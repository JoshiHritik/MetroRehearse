import { seedDemoData } from './seed';

export async function resetDemoData(): Promise<void> {
  await seedDemoData(true);
}
