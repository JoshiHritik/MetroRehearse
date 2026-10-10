import { simulate } from './model';
import { optimizePlans } from './optimizer';

self.onmessage = async (e: MessageEvent) => {
  const { type, id, input, budget, weights } = e.data;

  try {
    if (type === 'run') {
      const summary = simulate(input);
      self.postMessage({ type: 'result', id, summary });
    } else if (type === 'optimize') {
      const { event, params } = input;
      const plans = optimizePlans(event, params, weights, budget);
      self.postMessage({ type: 'result', id, plans });
    }
  } catch (err: any) {
    self.postMessage({
      type: 'error',
      id,
      message: err?.message || 'Simulation worker error',
    });
  }
};
