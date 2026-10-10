import { createMulberry32, randomPoisson, gammaPdf } from './rng';
import { summarizeRuns, type SingleRunResult } from './summarize';
import type { SimInput, RunSummary, Plan } from '../domain/types';

export function simulate(input: SimInput): RunSummary {
  const { event, params, plan, seeds, stepSec = 10, horizonMin = 180 } = input;
  const criticalDensity = params.values.criticalDensity?.value ?? 4.8;
  const platformAreaM2 = params.values.platformAreaM2?.value ?? 950;
  const gateBaseRatePaxMin = params.values.gateBaseRate?.value ?? 28;
  const gateStaffBonus = params.values.gateStaffBonus?.value ?? 4;
  const maxStaffBonus = params.values.maxStaffGateBonus?.value ?? 10;
  const stairCapPaxMin = params.values.stairEscalatorRate?.value ?? 180;
  const trainCapacity = params.values.trainCapacity?.value ?? 1000;
  const freeShare = params.values.freeShareOnArrival?.value ?? 0.85;

  // Resolve plan levers
  const effectivePlan: Plan =
    plan === 'baseline'
      ? {
          id: 'baseline',
          eventId: event.id,
          gatesOpen: 4,
          metering: { on: false, limit: 3.8 },
          headwayMin: 5,
          lastTrainExtMin: 0,
          staff: Math.min(20, event.staffAvailable),
          holdMin: 0,
        }
      : plan;

  const totalPax = Math.round(event.attendance * event.metroShare);
  const totalSteps = Math.floor((horizonMin * 60) / stepSec);
  const stepsPerMin = 60 / stepSec;

  // Pre-calculate arrival distribution curve over time
  // Peak at 25 min, shape 2.8, scale 10
  const arrivalWeights = new Float32Array(totalSteps);
  let totalWeight = 0;
  for (let s = 0; s < totalSteps; s++) {
    const tMin = (s * stepSec) / 60;
    // Gamma shape offset by 5 min
    const weight = gammaPdf(Math.max(0.1, tMin - 4), 2.8, 10);
    arrivalWeights[s] = weight;
    totalWeight += weight;
  }
  // Normalize
  if (totalWeight > 0) {
    for (let s = 0; s < totalSteps; s++) {
      arrivalWeights[s] /= totalWeight;
    }
  }

  // Pre-calculate train arrival timetable in steps
  const trainIntervalSteps = Math.max(1, Math.round((effectivePlan.headwayMin * 60) / stepSec));
  const baseServiceEndMin = 60; // Normal service ends 60 min after event end
  const serviceEndMin = baseServiceEndMin + effectivePlan.lastTrainExtMin;
  const serviceEndStep = Math.round((serviceEndMin * 60) / stepSec);

  // Gate service rate
  const staffAtGates = Math.max(0, effectivePlan.staff - 10);
  const bonusPerGate = Math.min(maxStaffBonus, (staffAtGates / effectivePlan.gatesOpen) * gateStaffBonus);
  const gateRatePerMin = (gateBaseRatePaxMin + bonusPerGate) * effectivePlan.gatesOpen;
  const gateCapacityPerStep = (gateRatePerMin * stepSec) / 60;
  const stairCapacityPerStep = (stairCapPaxMin * stepSec) / 60;
  const effectiveTrainBoarding = Math.round(trainCapacity * freeShare);

  const results: SingleRunResult[] = new Array(seeds.length);

  for (let r = 0; r < seeds.length; r++) {
    const seed = seeds[r];
    const rng = createMulberry32(seed);

    let forecourtQueue = 0;
    let gateQueue = 0;
    let concourseToPlatform = 0;
    let platformPax = 0;
    let servedPax = 0;

    let peakDensity = 0;
    let peakGateWaitMin = 0;
    let clearTimeMin = horizonMin;
    let cleared = false;

    const densityOverTime = new Float32Array(horizonMin + 1);

    for (let s = 0; s < totalSteps; s++) {
      const tMin = (s * stepSec) / 60;

      // 1. Ingress arrivals
      const expectedArrivals = totalPax * arrivalWeights[s];
      const actualArrivals = randomPoisson(rng, expectedArrivals);
      forecourtQueue += actualArrivals;

      // 2. Forecourt to concourse gate queue
      const entryFlow = Math.min(forecourtQueue, gateCapacityPerStep * 1.5);
      forecourtQueue -= entryFlow;
      gateQueue += entryFlow;

      // Track gate wait (queue / throughput rate)
      const currentWait = gateRatePerMin > 0 ? gateQueue / gateRatePerMin : 0;
      if (currentWait > peakGateWaitMin) {
        peakGateWaitMin = currentWait;
      }

      // 3. Concourse AFC Gates with Metering
      const currentDensity = platformPax / platformAreaM2;
      let gateAllow = gateCapacityPerStep;

      // Hold in initial holdMin window if designated
      if (effectivePlan.holdMin > 0 && tMin < effectivePlan.holdMin) {
        gateAllow = 0;
      } else if (effectivePlan.metering.on && currentDensity >= effectivePlan.metering.limit) {
        // Metering throttling: throttle gate flow to prevent platform crush
        gateAllow = gateCapacityPerStep * 0.15;
      }

      const passedGates = Math.min(gateQueue, gateAllow);
      gateQueue -= passedGates;
      concourseToPlatform += passedGates;

      // 4. Stairs/Escalators to Platform
      const downStairs = Math.min(concourseToPlatform, stairCapacityPerStep);
      concourseToPlatform -= downStairs;
      platformPax += downStairs;

      // 5. Train Arrival & Boarding
      if (s % trainIntervalSteps === 0 && s <= serviceEndStep) {
        const boardCount = Math.min(platformPax, effectiveTrainBoarding);
        platformPax -= boardCount;
        servedPax += boardCount;
      }

      // 6. Record density
      const stepDensity = platformPax / platformAreaM2;
      if (stepDensity > peakDensity) {
        peakDensity = stepDensity;
      }

      // Sample density every minute
      if (s % stepsPerMin === 0) {
        const minIdx = Math.floor(tMin);
        if (minIdx <= horizonMin) {
          densityOverTime[minIdx] = stepDensity;
        }
      }

      // Check clearance
      if (!cleared && s > 30 * stepsPerMin && (forecourtQueue + gateQueue + platformPax < 100)) {
        clearTimeMin = tMin;
        cleared = true;
      }
    }

    if (!cleared) {
      clearTimeMin = horizonMin;
    }

    results[r] = {
      seed,
      peakDensity,
      clearTimeMin,
      peakGateWaitMin,
      densityOverTime,
    };
  }

  const planId = plan === 'baseline' ? 'baseline' : plan.id;
  return summarizeRuns(results, event.id, planId, horizonMin, criticalDensity);
}
