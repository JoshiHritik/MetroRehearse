import { simulate } from './model';
import { createMulberry32 } from './rng';
import type { EventRecord, Params, Plan, RunSummary } from '../domain/types';

export interface OptimizerBudget {
  candidates: number;
  refine: number;
  seedCount: number; // e.g. 50 for search, 200 for final
}

export interface OptimizerWeights {
  safety: number; // 0 to 1 (w1)
  time: number;   // 0 to 1 (w2)
  cost: number;   // 0 to 1 (w3)
}

export interface OptimizedPlanResult {
  plan: Plan;
  summary: RunSummary;
  baselineSummary: RunSummary;
  costBreakdown: {
    extraTrains: number;
    staffHours: number;
    costScore: number;
  };
  plainActions: string[];
}

export function generateActionsList(plan: Plan, baselinePlan: Plan): string[] {
  const actions: string[] = [];

  const gateDiff = plan.gatesOpen - baselinePlan.gatesOpen;
  if (gateDiff > 0) {
    actions.push(`Open ${gateDiff} additional AFC gate${gateDiff > 1 ? 's' : ''} (Total ${plan.gatesOpen} active)`);
  } else if (gateDiff < 0) {
    actions.push(`Reduce active AFC gates to ${plan.gatesOpen}`);
  }

  if (plan.metering.on) {
    actions.push(`Activate concourse metering when platform density touches ${plan.metering.limit} pax/m²`);
  } else {
    actions.push('Operate concourse gates without metering restriction');
  }

  const headwayDiff = baselinePlan.headwayMin - plan.headwayMin;
  if (headwayDiff > 0) {
    actions.push(`Compress train headway from ${baselinePlan.headwayMin} min to ${plan.headwayMin} min`);
  }

  if (plan.lastTrainExtMin > 0) {
    actions.push(`Extend revenue train operation by +${plan.lastTrainExtMin} minutes beyond scheduled end`);
  }

  const staffDiff = plan.staff - baselinePlan.staff;
  if (staffDiff > 0) {
    actions.push(`Deploy ${staffDiff} additional crowd marshals at concourse escalators`);
  }

  if (plan.holdMin > 0) {
    actions.push(`Enforce initial ${plan.holdMin}-min safety pause at forecourt turnstiles`);
  }

  return actions;
}

export function computePlanCost(plan: Plan, baselineHeadway = 5): {
  extraTrains: number;
  staffHours: number;
  costScore: number;
} {
  // Extra trains from tighter headway + extension
  const baseServicesIn2h = 120 / baselineHeadway; // 24
  const plannedServicesIn2h = 120 / plan.headwayMin;
  const extraHeadwayTrains = Math.max(0, Math.round(plannedServicesIn2h - baseServicesIn2h));
  const extensionTrains = Math.round(plan.lastTrainExtMin / plan.headwayMin);
  const extraTrains = extraHeadwayTrains + extensionTrains;

  const staffHours = Math.round(plan.staff * 3); // 3-hour deployment
  // Normalize cost score to 0..100
  const costScore = Number((extraTrains * 1.5 + staffHours * 0.1).toFixed(1));

  return { extraTrains, staffHours, costScore };
}

export function optimizePlans(
  event: EventRecord,
  params: Params,
  weights: OptimizerWeights = { safety: 0.5, time: 0.3, cost: 0.2 },
  budget: OptimizerBudget = { candidates: 150, refine: 5, seedCount: 60 }
): OptimizedPlanResult[] {
  const seeds = Array.from({ length: budget.seedCount }, (_, i) => i + 1);
  const baselineSummary = simulate({
    event,
    params,
    plan: 'baseline',
    seeds,
    stepSec: 10,
    horizonMin: 180,
  });

  const baselinePlan: Plan = {
    id: 'baseline',
    eventId: event.id,
    gatesOpen: 4,
    metering: { on: false, limit: 3.8 },
    headwayMin: 5,
    lastTrainExtMin: 0,
    staff: Math.min(20, event.staffAvailable),
    holdMin: 0,
  };

  const rng = createMulberry32(42);

  // Generate candidate plans
  const candidates: Plan[] = [];
  for (let i = 0; i < budget.candidates; i++) {
    const gatesOpen = 2 + Math.floor(rng() * 7); // 2 to 8
    const meteringOn = rng() > 0.35;
    const meteringLimit = Number((2.8 + rng() * 1.2).toFixed(1)); // 2.8 to 4.0
    const headwayMin = Number((3.0 + Math.floor(rng() * 11) * 0.5).toFixed(1)); // 3.0 to 8.0
    const lastTrainExtMin = Math.floor(rng() * 9) * 15; // 0, 15, ..., 120
    const maxStaff = Math.max(15, event.staffAvailable);
    const staff = 12 + Math.floor(rng() * (maxStaff - 12 + 1));
    const holdMin = Math.floor(rng() * 5) * 5; // 0, 5, 10, 15, 20

    candidates.push({
      id: `candidate-${i + 1}`,
      eventId: event.id,
      gatesOpen,
      metering: { on: meteringOn, limit: meteringLimit },
      headwayMin,
      lastTrainExtMin,
      staff,
      holdMin,
    });
  }

  // Objective function
  const scorePlan = (p: Plan, sum: RunSummary) => {
    const cost = computePlanCost(p);
    const normSafety = sum.riskOvercrowd; // 0 to 1
    const normTime = Math.min(1, sum.clearMinP90 / 180); // 0 to 1
    const normCost = Math.min(1, cost.costScore / 60); // 0 to 1

    return weights.safety * normSafety + weights.time * normTime + weights.cost * normCost;
  };

  // Evaluate candidate plans
  const scoredCandidates: { plan: Plan; summary: RunSummary; score: number }[] = [];

  for (const c of candidates) {
    const summary = simulate({
      event,
      params,
      plan: c,
      seeds,
      stepSec: 10,
      horizonMin: 180,
    });
    const score = scorePlan(c, summary);
    scoredCandidates.push({ plan: c, summary, score });
  }

  // Sort by lowest score (best)
  scoredCandidates.sort((a, b) => a.score - b.score);
  const bestInitial = scoredCandidates.slice(0, budget.refine);

  // Single-lever refinement of top 5
  const refinedResults: { plan: Plan; summary: RunSummary; score: number }[] = [...bestInitial];

  for (const base of bestInitial) {
    const tweaks: Plan[] = [
      { ...base.plan, id: `${base.plan.id}-t1`, gatesOpen: Math.min(8, base.plan.gatesOpen + 1) },
      { ...base.plan, id: `${base.plan.id}-t2`, headwayMin: Math.max(3, base.plan.headwayMin - 0.5) },
      { ...base.plan, id: `${base.plan.id}-t3`, lastTrainExtMin: Math.min(120, base.plan.lastTrainExtMin + 15) },
      { ...base.plan, id: `${base.plan.id}-t4`, metering: { on: true, limit: 3.5 } },
    ];

    for (const tw of tweaks) {
      const summary = simulate({
        event,
        params,
        plan: tw,
        seeds,
        stepSec: 10,
        horizonMin: 180,
      });
      const score = scorePlan(tw, summary);
      refinedResults.push({ plan: tw, summary, score });
    }
  }

  refinedResults.sort((a, b) => a.score - b.score);

  // Take top 3 distinct plans
  const topThree: OptimizedPlanResult[] = [];
  const titles = [
    'Alpha Tactical: Maximum Crowd Safety',
    'Bravo Tactical: Balanced Rapid Clearance',
    'Charlie Tactical: Cost-Efficient Interventions',
  ];

  let rankIdx = 0;
  for (const item of refinedResults) {
    if (topThree.length >= 3) break;
    // Ensure distinct configurations
    const isDuplicate = topThree.some(
      (t) =>
        t.plan.gatesOpen === item.plan.gatesOpen &&
        t.plan.headwayMin === item.plan.headwayMin &&
        t.plan.lastTrainExtMin === item.plan.lastTrainExtMin
    );
    if (!isDuplicate || topThree.length === 0) {
      const costBreakdown = computePlanCost(item.plan);
      const namedPlan: Plan = {
        ...item.plan,
        id: `plan-opt-${rankIdx + 1}`,
        name: titles[rankIdx] || `Tactical Option ${rankIdx + 1}`,
        score: Number(item.score.toFixed(3)),
        cost: costBreakdown.costScore,
      };
      namedPlan.actionsText = generateActionsList(namedPlan, baselinePlan);

      topThree.push({
        plan: namedPlan,
        summary: item.summary,
        baselineSummary,
        costBreakdown,
        plainActions: namedPlan.actionsText,
      });
      rankIdx++;
    }
  }

  return topThree;
}
