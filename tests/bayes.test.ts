import { describe, it, expect } from 'vitest';
import { updateBayesianArrivalRate } from '../src/domain/bayes';

describe('Bayesian Rate Updating Mechanics', () => {
  it('updates posterior rate using conjugate Gamma-Poisson formula E[lambda]=(alpha+n)/(beta+t)', () => {
    // Prior: alpha = 100 pseudo pax, beta = 20 pseudo min -> prior rate = 5 pax/min
    const prior = { alpha: 100, beta: 20 };
    // Observed: 300 pax over 30 minutes -> observed rate = 10 pax/min
    const obs = { observedPax: 300, windowMinutes: 30 };

    const result = updateBayesianArrivalRate(prior, obs);

    // Posterior alpha = 100 + 300 = 400
    // Posterior beta = 20 + 30 = 50
    // Expected posterior rate = 400 / 50 = 8.0 pax/min
    expect(result.posteriorAlpha).toBe(400);
    expect(result.posteriorBeta).toBe(50);
    expect(result.posteriorMeanRate).toBe(8.0);
    expect(result.source).toBe('gamma-poisson');
    expect(result.rateMultiplier).toBe(1.6); // 8 / 5 = 1.6
  });

  it('correctly uses fallback capped ratio (0.5 to 2.0) when only queue length is observed', () => {
    const prior = { alpha: 100, beta: 20 }; // prior mean = 5 pax/min
    
    // Observed queue 400 vs predicted 100 -> ratio 4.0 -> capped to 2.0
    const highObs = { observedPax: 0, windowMinutes: 0, observedQueue: 400, predictedQueue: 100 };
    const highResult = updateBayesianArrivalRate(prior, highObs);
    expect(highResult.source).toBe('queue-ratio-fallback');
    expect(highResult.rateMultiplier).toBe(2.0);
    expect(highResult.posteriorMeanRate).toBe(10.0);

    // Observed queue 20 vs predicted 100 -> ratio 0.2 -> capped to 0.5
    const lowObs = { observedPax: 0, windowMinutes: 0, observedQueue: 20, predictedQueue: 100 };
    const lowResult = updateBayesianArrivalRate(prior, lowObs);
    expect(lowResult.rateMultiplier).toBe(0.5);
    expect(lowResult.posteriorMeanRate).toBe(2.5);
  });
});
