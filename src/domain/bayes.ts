// Bayesian conjugate Gamma-Poisson rate updating model for Live Mode

export interface GammaPrior {
  alpha: number; // Shape parameter (prior pseudo-counts)
  beta: number;  // Rate parameter (prior pseudo-time in minutes)
}

export interface ObservationData {
  observedPax: number;        // n: total observed arrivals
  windowMinutes: number;      // t: elapsed observation window
  observedQueue?: number;     // manual concourse queue count
  predictedQueue?: number;    // expected simulation queue at current time
}

export interface BayesianUpdateResult {
  priorMeanRate: number;      // alpha / beta (pax / min)
  posteriorAlpha: number;     // alpha + n
  posteriorBeta: number;      // beta + t
  posteriorMeanRate: number;  // (alpha + n) / (beta + t)
  rateMultiplier: number;     // posteriorRate / priorRate
  source: 'gamma-poisson' | 'queue-ratio-fallback';
}

/**
 * Calculates updated arrival rate using conjugate Gamma-Poisson updating.
 * Prior: Gamma(alpha, beta)
 * Likelihood: Poisson(lambda * t)
 * Posterior: Gamma(alpha + n, beta + t)
 * Expected posterior rate: E[lambda] = (alpha + n) / (beta + t)
 */
export function updateBayesianArrivalRate(
  prior: GammaPrior,
  obs: ObservationData
): BayesianUpdateResult {
  const priorMean = prior.beta > 0 ? prior.alpha / prior.beta : 1;

  // Case 1: Direct arrival counts observed
  if (obs.observedPax > 0 && obs.windowMinutes > 0) {
    const postAlpha = prior.alpha + obs.observedPax;
    const postBeta = prior.beta + obs.windowMinutes;
    const postMean = postAlpha / postBeta;
    const rateMultiplier = Math.max(0.4, Math.min(2.8, postMean / priorMean));

    return {
      priorMeanRate: Number(priorMean.toFixed(1)),
      posteriorAlpha: Number(postAlpha.toFixed(1)),
      posteriorBeta: Number(postBeta.toFixed(1)),
      posteriorMeanRate: Number(postMean.toFixed(1)),
      rateMultiplier: Number(rateMultiplier.toFixed(2)),
      source: 'gamma-poisson',
    };
  }

  // Case 2: Fallback when only queue length is observed
  if (obs.observedQueue !== undefined && obs.predictedQueue !== undefined && obs.predictedQueue > 0) {
    const rawRatio = obs.observedQueue / obs.predictedQueue;
    // Capped at 0.5 to 2.0 as per Blueprint specification
    const cappedRatio = Math.max(0.5, Math.min(2.0, rawRatio));
    const postMean = priorMean * cappedRatio;

    return {
      priorMeanRate: Number(priorMean.toFixed(1)),
      posteriorAlpha: prior.alpha,
      posteriorBeta: prior.beta,
      posteriorMeanRate: Number(postMean.toFixed(1)),
      rateMultiplier: Number(cappedRatio.toFixed(2)),
      source: 'queue-ratio-fallback',
    };
  }

  // No observations yet; prior remains unchanged
  return {
    priorMeanRate: Number(priorMean.toFixed(1)),
    posteriorAlpha: prior.alpha,
    posteriorBeta: prior.beta,
    posteriorMeanRate: Number(priorMean.toFixed(1)),
    rateMultiplier: 1.0,
    source: 'gamma-poisson',
  };
}
