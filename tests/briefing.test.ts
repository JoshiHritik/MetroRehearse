import { describe, it, expect } from 'vitest';
import { generateBriefingFromPlan } from '../src/domain/briefing';
import type { EventRecord, Plan } from '../src/domain/types';

describe('Briefing Generator Placeholders & Multi-Language Support', () => {
  const dummyEvent: EventRecord = {
    id: 'evt-101',
    name: 'India vs Australia T20',
    stationId: 'motera-stadium',
    preset: 'cricket-night',
    attendance: 80000,
    metroShare: 0.45,
    endsAt: 1760000000000,
    staffAvailable: 40,
    status: 'draft',
    paramsId: 'gmrc-motera-default-v1',
    createdAt: 1760000000000,
  };

  const dummyPlan: Plan = {
    id: 'plan-101',
    eventId: dummyEvent.id,
    gatesOpen: 7,
    metering: { on: true, limit: 3.5 },
    headwayMin: 3.5,
    lastTrainExtMin: 60,
    staff: 35,
    holdMin: 5,
  };

  it('interpolates placeholders accurately into English briefing blocks', () => {
    const briefing = generateBriefingFromPlan(dummyEvent, dummyPlan, 'en');
    expect(briefing.lang).toBe('en');
    expect(briefing.blocks.length).toBeGreaterThan(0);

    const summaryBlock = briefing.blocks.find((b) => b.key === 'summary');
    expect(summaryBlock).toBeDefined();
    expect(summaryBlock?.text).toContain('India vs Australia T20');
    expect(summaryBlock?.text).toContain('7 active AFC turnstiles');
    expect(summaryBlock?.text).toContain('3.5 minutes');
    expect(summaryBlock?.text).toContain('+60 min');
  });

  it('supports Hindi and Gujarati briefing generation', () => {
    const briefingHi = generateBriefingFromPlan(dummyEvent, dummyPlan, 'hi');
    const briefingGu = generateBriefingFromPlan(dummyEvent, dummyPlan, 'gu');

    expect(briefingHi.blocks.find((b) => b.key === 'summary')?.text).toContain('India vs Australia T20');
    expect(briefingGu.blocks.find((b) => b.key === 'summary')?.text).toContain('India vs Australia T20');
  });

  it('preserves user edited blocks when regenerating', () => {
    const originalBriefing = generateBriefingFromPlan(dummyEvent, dummyPlan, 'en');
    originalBriefing.blocks[0] = {
      ...originalBriefing.blocks[0],
      text: 'CUSTOM OVERRIDE TEXT BY CONTROLLER',
      edited: true,
    };

    const regenerated = generateBriefingFromPlan(dummyEvent, dummyPlan, 'en', originalBriefing);
    expect(regenerated.blocks[0].text).toBe('CUSTOM OVERRIDE TEXT BY CONTROLLER');
    expect(regenerated.blocks[0].edited).toBe(true);
  });
});
