import type { SimInput, RunSummary, EventRecord, Params } from '../domain/types';
import type { OptimizedPlanResult, OptimizerWeights, OptimizerBudget } from './optimizer';
import { simulate } from './model';
import { optimizePlans } from './optimizer';

let workerInstance: Worker | null = null;

function getWorker(): Worker | null {
  if (typeof Worker === 'undefined') return null;
  if (!workerInstance) {
    try {
      workerInstance = new Worker(new URL('./worker.ts', import.meta.url), {
        type: 'module',
      });
    } catch {
      workerInstance = null;
    }
  }
  return workerInstance;
}

export async function runSimulationAsync(
  input: SimInput,
  onProgress?: (done: number, total: number) => void
): Promise<RunSummary> {
  const worker = getWorker();
  const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (!worker) {
    // Fallback: direct simulation on main thread
    onProgress?.(0, input.seeds.length);
    const summary = simulate(input);
    onProgress?.(input.seeds.length, input.seeds.length);
    return summary;
  }

  return new Promise<RunSummary>((resolve, reject) => {
    const handler = (e: MessageEvent) => {
      if (e.data.id !== id) return;

      if (e.data.type === 'progress') {
        onProgress?.(e.data.done, e.data.total);
      } else if (e.data.type === 'result') {
        worker.removeEventListener('message', handler);
        resolve(e.data.summary);
      } else if (e.data.type === 'error') {
        worker.removeEventListener('message', handler);
        reject(new Error(e.data.message));
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({ type: 'run', id, input });
  });
}

export async function runOptimizationAsync(
  event: EventRecord,
  params: Params,
  weights?: OptimizerWeights,
  budget?: OptimizerBudget
): Promise<OptimizedPlanResult[]> {
  const worker = getWorker();
  const id = `opt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (!worker) {
    return optimizePlans(event, params, weights, budget);
  }

  return new Promise<OptimizedPlanResult[]>((resolve, reject) => {
    const handler = (e: MessageEvent) => {
      if (e.data.id !== id) return;

      if (e.data.type === 'result') {
        worker.removeEventListener('message', handler);
        resolve(e.data.plans);
      } else if (e.data.type === 'error') {
        worker.removeEventListener('message', handler);
        reject(new Error(e.data.message));
      }
    };

    worker.addEventListener('message', handler);
    worker.postMessage({
      type: 'optimize',
      id,
      input: { event, params },
      weights,
      budget,
    });
  });
}
