import { db } from './schema';
import defaultAssumptions from '../data/assumptions.default.json';
import briefingTemplatesEn from '../data/briefing-templates.en.json';
import briefingTemplatesHi from '../data/briefing-templates.hi.json';
import briefingTemplatesGu from '../data/briefing-templates.gu.json';
import { hashPin } from '../domain/crypto';
import type { EventRecord, Plan, RunSummary, Briefing } from '../domain/types';

export async function seedDemoData(force = false) {
  const profileCount = await db.profiles.count();
  if (profileCount > 0 && !force) {
    return;
  }

  if (force) {
    await db.profiles.clear();
    await db.events.clear();
    await db.params.clear();
    await db.plans.clear();
    await db.runs.clear();
    await db.liveCounts.clear();
    await db.briefings.clear();
    await db.reviews.clear();
    await db.settings.clear();
  }

  // 1. Seed Profiles with PIN "1234"
  const { pinHash: plannerPin, salt: plannerSalt } = await hashPin('1234');
  const { pinHash: supervisorPin, salt: supervisorSalt } = await hashPin('1234');

  await db.profiles.bulkAdd([
    {
      id: 'profile-planner-ashwin',
      name: 'Ashwin Patel',
      role: 'planner',
      pinHash: plannerPin,
      salt: plannerSalt,
      lang: 'en',
      homeStationId: 'motera-stadium',
      lastUsedAt: Date.now(),
    },
    {
      id: 'profile-supervisor-meera',
      name: 'Meera Shah',
      role: 'supervisor',
      pinHash: supervisorPin,
      salt: supervisorSalt,
      lang: 'en',
      homeStationId: 'motera-stadium',
      lastUsedAt: Date.now() - 3600000,
    },
  ]);

  // 2. Seed Default Model Assumptions
  await db.params.put({
    id: defaultAssumptions.id,
    label: defaultAssumptions.label,
    values: defaultAssumptions.values,
  });

  // 3. Seed Events
  const now = Date.now();
  // Set event end time to 23:30 today
  const tonight = new Date();
  tonight.setHours(23, 30, 0, 0);

  const event1: EventRecord = {
    id: 'evt-gt-vs-mi-2026',
    name: 'IPL T20: Gujarat Titans vs Mumbai Indians',
    stationId: 'motera-stadium',
    preset: 'cricket-night',
    attendance: 105000,
    metroShare: 0.42, // (A)
    endsAt: tonight.getTime(),
    staffAvailable: 38,
    status: 'briefed',
    paramsId: defaultAssumptions.id,
    appliedPlanId: 'plan-gt-opt-1',
    createdAt: now - 86400000,
  };

  const event2: EventRecord = {
    id: 'evt-navratri-garba-2026',
    name: 'Navratri Riverfront Maha-Garba (Vibrant Gujarat)',
    stationId: 'old-high-court',
    preset: 'navratri',
    attendance: 60000,
    metroShare: 0.34, // (A)
    endsAt: tonight.getTime() + 86400000,
    staffAvailable: 26,
    status: 'draft',
    paramsId: defaultAssumptions.id,
    createdAt: now - 43200000,
  };

  const event3: EventRecord = {
    id: 'evt-ipl-final-backtest',
    name: 'IPL 2026 Final (Historical Replay Backtest)',
    stationId: 'motera-stadium',
    preset: 'ipl-replay',
    attendance: 110000,
    metroShare: 0.44, // (A)
    endsAt: now - 1000000000,
    staffAvailable: 45,
    status: 'completed',
    paramsId: defaultAssumptions.id,
    createdAt: now - 2000000000,
  };

  await db.events.bulkAdd([event1, event2, event3]);

  // 4. Seed Tactical Plans for Event 1
  const baselinePlan: Plan = {
    id: 'plan-gt-baseline',
    eventId: event1.id,
    name: 'Timetable Baseline (Do Nothing)',
    gatesOpen: 4,
    metering: { on: false, limit: 3.8 },
    headwayMin: 5,
    lastTrainExtMin: 0,
    staff: 20,
    holdMin: 0,
    score: 84.5,
    cost: 0,
    actionsText: [
      'Maintain standard 4 AFC gates',
      'No concourse metering',
      'Normal 5-min train headway',
      'Regular timetable termination at 00:30',
    ],
  };

  const appliedPlan: Plan = {
    id: 'plan-gt-opt-1',
    eventId: event1.id,
    name: 'Alpha Tactical: High Egress & Extended Headway',
    gatesOpen: 7,
    metering: { on: true, limit: 3.5 },
    headwayMin: 3.5,
    lastTrainExtMin: 75,
    staff: 38,
    holdMin: 4,
    score: 18.2,
    cost: 16,
    actionsText: [
      'Open 3 additional AFC gates (Total 7 active gates)',
      'Activate concourse metering at 3.5 pax/m²',
      'Compress headway from 5 min to 3.5 min (14 extra trains)',
      'Extend terminal revenue service by +75 minutes',
      'Deploy 18 additional crowd marshals at stair foot',
    ],
  };

  const alternativePlan: Plan = {
    id: 'plan-gt-opt-2',
    eventId: event1.id,
    name: 'Bravo Tactical: Gate Throttling & Medium Extension',
    gatesOpen: 6,
    metering: { on: true, limit: 3.2 },
    headwayMin: 4,
    lastTrainExtMin: 60,
    staff: 34,
    holdMin: 6,
    score: 24.8,
    cost: 12,
    actionsText: [
      'Open 2 additional AFC gates (Total 6 active gates)',
      'Enforce tight metering at 3.2 pax/m²',
      'Compress headway to 4 min (9 extra trains)',
      'Extend terminal service by +60 minutes',
    ],
  };

  await db.plans.bulkAdd([baselinePlan, appliedPlan, alternativePlan]);

  // 5. Seed Pre-calculated Run Summaries
  const generateBands = (peakDensity: number, clearMin: number) => {
    const points = [];
    for (let t = 0; t <= 180; t += 5) {
      // Gamma-like surge curve peaking at t = 25
      const shape = Math.exp(-Math.pow((t - 25) / 22, 2));
      const decay = Math.max(0, 1 - (t - 40) / Math.max(1, clearMin - 40));
      const density = t < 25 ? shape * peakDensity : shape * peakDensity * 0.4 + decay * peakDensity * 0.6;
      const base = Math.max(0.1, density);
      points.push({
        t,
        q10: Number(Math.max(0.1, base * 0.75).toFixed(2)),
        q50: Number(base.toFixed(2)),
        q90: Number(Math.min(5.5, base * 1.3).toFixed(2)),
      });
    }
    return points;
  };

  const baselineRun: RunSummary = {
    id: 'run-gt-baseline',
    eventId: event1.id,
    planId: 'baseline',
    seeds: 200,
    createdAt: now - 3600000,
    riskOvercrowd: 0.68, // 68% risk of crush under baseline
    gateWaitP90Min: 28.5,
    clearMinP50: 145,
    clearMinP90: 172,
    peakDensityP50: 4.95,
    bands: generateBands(4.95, 170),
  };

  const appliedRun: RunSummary = {
    id: 'run-gt-opt-1',
    eventId: event1.id,
    planId: appliedPlan.id,
    seeds: 200,
    createdAt: now - 1800000,
    riskOvercrowd: 0.04, // Dropped to 4%
    gateWaitP90Min: 8.2,
    clearMinP50: 88,
    clearMinP90: 104,
    peakDensityP50: 3.32,
    bands: generateBands(3.32, 102),
  };

  await db.runs.bulkAdd([baselineRun, appliedRun]);

  // 6. Seed Briefings for Event 1
  const buildBriefingBlocks = (templates: any[], event: EventRecord, plan: Plan) => {
    const metroPax = Math.round(event.attendance * event.metroShare).toLocaleString();
    const attendanceStr = event.attendance.toLocaleString();
    const metroSharePct = Math.round(event.metroShare * 100).toString();
    const lastTrainTime = '01:45 AM';

    return templates.map((tmpl) => {
      let text = tmpl.text
        .replace(/{eventName}/g, event.name)
        .replace(/{stationName}/g, 'Motera Stadium')
        .replace(/{attendance}/g, attendanceStr)
        .replace(/{metroSharePct}/g, metroSharePct)
        .replace(/{metroPax}/g, metroPax)
        .replace(/{gatesOpen}/g, plan.gatesOpen.toString())
        .replace(/{headwayMin}/g, plan.headwayMin.toString())
        .replace(/{lastTrainTime}/g, lastTrainTime)
        .replace(/{lastTrainExtMin}/g, plan.lastTrainExtMin.toString())
        .replace(/{staffRequired}/g, plan.staff.toString())
        .replace(/{staffForecourt}/g, '14')
        .replace(/{staffGates}/g, '12')
        .replace(/{staffPlatform}/g, '12')
        .replace(/{meteringLimit}/g, plan.metering.limit.toString())
        .replace(/{criticalLimit}/g, '4.8');

      return {
        key: tmpl.key,
        title: tmpl.title,
        text,
        edited: false,
      };
    });
  };

  const briefingEn: Briefing = {
    id: `brf-${event1.id}-en`,
    eventId: event1.id,
    planId: appliedPlan.id,
    lang: 'en',
    blocks: buildBriefingBlocks(briefingTemplatesEn, event1, appliedPlan),
    final: true,
  };

  const briefingHi: Briefing = {
    id: `brf-${event1.id}-hi`,
    eventId: event1.id,
    planId: appliedPlan.id,
    lang: 'hi',
    blocks: buildBriefingBlocks(briefingTemplatesHi, event1, appliedPlan),
    final: true,
  };

  const briefingGu: Briefing = {
    id: `brf-${event1.id}-gu`,
    eventId: event1.id,
    planId: appliedPlan.id,
    lang: 'gu',
    blocks: buildBriefingBlocks(briefingTemplatesGu, event1, appliedPlan),
    final: true,
  };

  await db.briefings.bulkAdd([briefingEn, briefingHi, briefingGu]);

  // 7. Seed Initial Live Counts
  await db.liveCounts.bulkAdd([
    {
      id: 'lc-1',
      eventId: event1.id,
      gateId: 'G1',
      ts: now - 600000,
      kind: 'arrivals',
      delta: 10,
    },
    {
      id: 'lc-2',
      eventId: event1.id,
      gateId: 'G2',
      ts: now - 480000,
      kind: 'arrivals',
      delta: 20,
    },
    {
      id: 'lc-3',
      eventId: event1.id,
      gateId: 'G1',
      ts: now - 300000,
      kind: 'queueShort',
      delta: 25,
    },
  ]);

  // 8. Seed Settings
  await db.settings.bulkPut([
    { key: 'activeProfileId', value: 'profile-planner-ashwin' },
    { key: 'theme', value: 'dark' },
    { key: 'lang', value: 'en' },
    { key: 'setupComplete', value: true },
    { key: 'wakeLockDefault', value: true },
    { key: 'storagePersisted', value: true },
  ]);

  // Storage persistence request
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      await navigator.storage.persist();
    } catch {
      // Ignored in non-supported environments
    }
  }
}
