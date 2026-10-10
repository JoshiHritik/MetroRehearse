// Telemetry data level classification for MetroRehearse

export type DataLevel = 0 | 1 | 2 | 3;

export interface TelemetryLevelInfo {
  level: DataLevel;
  code: string;
  name: string;
  badgeColor: string;
  badgeBg: string;
  description: string;
}

export const DATA_LEVELS: Record<DataLevel, TelemetryLevelInfo> = {
  0: {
    level: 0,
    code: 'L0-STREAM',
    name: 'Level 0: Live Automated Stream',
    badgeColor: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.16)',
    description: 'High-frequency telemetry stream directly from fare gate AFC and platform screen door sensors (simulated replay).',
  },
  1: {
    level: 1,
    code: 'L1-MANUAL',
    name: 'Level 1: Concourse Manual Counts',
    badgeColor: '#38BDF8',
    badgeBg: 'rgba(56, 189, 248, 0.16)',
    description: 'Manual crowd counts submitted via supervisor Tap Pad within the past 15 minutes.',
  },
  2: {
    level: 2,
    code: 'L2-CACHED',
    name: 'Level 2: Cached Monte Carlo Rehearsal',
    badgeColor: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.16)',
    description: 'Stochastic simulation forecast generated offline before the operational window.',
  },
  3: {
    level: 3,
    code: 'L3-PRINTED',
    name: 'Level 3: Tactical Event Order',
    badgeColor: '#94A3B8',
    badgeBg: 'rgba(148, 163, 184, 0.16)',
    description: 'Static procedural thresholds and timetable printed in hard copy.',
  },
};

/**
 * Determines current highest active telemetry tier based on freshness of live data
 */
export function determineActiveDataLevel(options: {
  hasCsvStream?: boolean;
  lastManualCountTs?: number;
  hasCachedRun?: boolean;
  hasBriefing?: boolean;
}): TelemetryLevelInfo {
  const now = Date.now();

  // Tier 0: Live CSV stream active
  if (options.hasCsvStream) {
    return DATA_LEVELS[0];
  }

  // Tier 1: Manual tap within last 15 minutes (900,000 ms)
  if (options.lastManualCountTs && now - options.lastManualCountTs < 900000) {
    return DATA_LEVELS[1];
  }

  // Tier 2: Cached Monte Carlo simulation exists
  if (options.hasCachedRun) {
    return DATA_LEVELS[2];
  }

  // Tier 3: Static printed / saved briefing
  return DATA_LEVELS[3];
}
