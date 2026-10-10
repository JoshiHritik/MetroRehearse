import type { DensityBandPoint, RunSummary } from '../domain/types';

export function quantile(sortedValues: number[], q: number): number {
  if (sortedValues.length === 0) return 0;
  if (sortedValues.length === 1) return sortedValues[0];
  const pos = (sortedValues.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (base + 1 < sortedValues.length) {
    return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
  }
  return sortedValues[base];
}

export interface SingleRunResult {
  seed: number;
  peakDensity: number;
  clearTimeMin: number;
  peakGateWaitMin: number;
  densityOverTime: Float32Array; // sample every minute
}

export function summarizeRuns(
  results: SingleRunResult[],
  eventId: string,
  planId: string | 'baseline',
  horizonMin: number,
  criticalDensity = 4.5
): RunSummary {
  const n = results.length;
  if (n === 0) {
    return {
      id: `run-${eventId}-${planId}-${Date.now()}`,
      eventId,
      planId,
      seeds: 0,
      createdAt: Date.now(),
      riskOvercrowd: 0,
      gateWaitP90Min: 0,
      clearMinP50: 0,
      clearMinP90: 0,
      peakDensityP50: 0,
      bands: [],
    };
  }

  const peakDensities = results.map((r) => r.peakDensity).sort((a, b) => a - b);
  const clearTimes = results.map((r) => r.clearTimeMin).sort((a, b) => a - b);
  const gateWaits = results.map((r) => r.peakGateWaitMin).sort((a, b) => a - b);

  const overcrowdCount = results.filter((r) => r.peakDensity >= criticalDensity).length;
  const riskOvercrowd = Number((overcrowdCount / n).toFixed(3));

  const peakDensityP50 = Number(quantile(peakDensities, 0.5).toFixed(2));
  const clearMinP50 = Math.round(quantile(clearTimes, 0.5));
  const clearMinP90 = Math.round(quantile(clearTimes, 0.9));
  const gateWaitP90Min = Number(quantile(gateWaits, 0.9).toFixed(1));

  // Compute quantile bands over time (every 5 minutes up to horizon)
  const bandStepMin = 5;
  const bands: DensityBandPoint[] = [];

  for (let t = 0; t <= horizonMin; t += bandStepMin) {
    const densitiesAtT: number[] = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.min(t, results[i].densityOverTime.length - 1);
      densitiesAtT.push(results[i].densityOverTime[idx] || 0);
    }
    densitiesAtT.sort((a, b) => a - b);

    bands.push({
      t,
      q10: Number(quantile(densitiesAtT, 0.1).toFixed(2)),
      q50: Number(quantile(densitiesAtT, 0.5).toFixed(2)),
      q90: Number(quantile(densitiesAtT, 0.9).toFixed(2)),
    });
  }

  return {
    id: `run-${eventId}-${planId}-${Date.now()}`,
    eventId,
    planId,
    seeds: n,
    createdAt: Date.now(),
    riskOvercrowd,
    gateWaitP90Min,
    clearMinP50,
    clearMinP90,
    peakDensityP50,
    bands,
  };
}
