import { describe, it, expect } from 'vitest';
import { simulate } from '../src/sim/model';
import defaultAssumptions from '../src/data/assumptions.default.json';
import type { EventRecord, SimInput } from '../src/domain/types';

describe('Simulation Engine Determinism & Mechanics', () => {
  const dummyEvent: EventRecord = {
    id: 'test-evt-1',
    name: 'Motera Stadium Test Event',
    stationId: 'motera-stadium',
    preset: 'cricket-night',
    attendance: 50000,
    metroShare: 0.4,
    endsAt: Date.now(),
    staffAvailable: 30,
    status: 'draft',
    paramsId: 'gmrc-motera-default-v1',
    createdAt: Date.now(),
  };

  const input: SimInput = {
    event: dummyEvent,
    params: {
      id: defaultAssumptions.id,
      label: defaultAssumptions.label,
      values: defaultAssumptions.values,
    },
    plan: 'baseline',
    seeds: [1, 2, 3, 4, 5],
    stepSec: 10,
    horizonMin: 180,
  };

  it('produces identical outputs for identical seeds (determinism)', () => {
    const run1 = simulate(input);
    const run2 = simulate(input);

    expect(run1.riskOvercrowd).toBe(run2.riskOvercrowd);
    expect(run1.peakDensityP50).toBe(run2.peakDensityP50);
    expect(run1.clearMinP50).toBe(run2.clearMinP50);
    expect(run1.clearMinP90).toBe(run2.clearMinP90);
    expect(run1.bands.length).toBe(run2.bands.length);
    expect(run1.bands[5].q50).toBe(run2.bands[5].q50);
  });

  it('runs within reasonable execution time', () => {
    const t0 = performance.now();
    const run = simulate({
      ...input,
      seeds: Array.from({ length: 50 }, (_, i) => i + 1),
    });
    const elapsed = performance.now() - t0;
    expect(run.seeds).toBe(50);
    expect(elapsed).toBeLessThan(4000); // Should be very fast (well under 4 seconds)
  });

  it('calculates density bands monotonically in quantiles: q10 <= q50 <= q90', () => {
    const run = simulate(input);
    for (const band of run.bands) {
      expect(band.q10).toBeLessThanOrEqual(band.q50);
      expect(band.q50).toBeLessThanOrEqual(band.q90);
    }
  });
});
