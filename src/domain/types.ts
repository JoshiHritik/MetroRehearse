export type UserRole = 'planner' | 'supervisor';
export type SupportedLang = 'en' | 'hi' | 'gu';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  pinHash: string;
  salt: string;
  lang: SupportedLang;
  homeStationId: string;
  lastUsedAt: number;
}

export type EventStatus = 'draft' | 'rehearsed' | 'briefed' | 'live' | 'completed';

export interface EventRecord {
  id: string;
  name: string;
  stationId: string;
  preset: string;
  attendance: number;
  metroShare: number; // (A) assumed
  endsAt: number;     // epoch ms
  staffAvailable: number;
  status: EventStatus;
  paramsId: string;
  appliedPlanId?: string;
  createdAt: number;
}

export interface ParamValue {
  value: number;
  unit: string;
  assumed: boolean;
  note?: string;
}

export interface Params {
  id: string;
  label: string;
  values: Record<string, ParamValue>;
}

export interface Plan {
  id: string;
  eventId: string;
  name?: string;
  gatesOpen: number;
  metering: {
    on: boolean;
    limit: number;
  };
  headwayMin: number;
  lastTrainExtMin: number;
  staff: number;
  holdMin: number;
  score?: number;
  cost?: number;
  actionsText?: string[];
}

export interface DensityBandPoint {
  t: number;      // minutes from event end (0 to 180)
  q10: number;    // 10th percentile density
  q50: number;    // median density (50th percentile)
  q90: number;    // 90th percentile density
}

export interface RunSummary {
  id: string;
  eventId: string;
  planId: string | 'baseline';
  seeds: number;
  createdAt: number;
  riskOvercrowd: number;    // e.g. 0.05 = 5% probability density > 4.5
  gateWaitP90Min: number;   // minutes
  clearMinP50: number;      // median clear minutes
  clearMinP90: number;      // 90th percentile clear minutes
  peakDensityP50: number;   // pax/m²
  bands: DensityBandPoint[]; // platform load over time
}

export interface LiveCount {
  id: string;
  eventId: string;
  gateId: string;
  ts: number;
  kind: 'arrivals' | 'queueShort' | 'queueLong';
  delta: number;
  undoOf?: string;
}

export interface BriefingBlock {
  key: string;
  title?: string;
  text: string;
  edited: boolean;
}

export interface Briefing {
  id: string;
  eventId: string;
  planId: string;
  lang: SupportedLang;
  blocks: BriefingBlock[];
  final: boolean;
}

export interface Review {
  id: string;
  eventId: string;
  actual: {
    peakQueue?: number;
    clearMin?: number;
    extraTrains?: number;
  };
  error: Record<string, number>;
}

export interface Setting {
  key: string;
  value: unknown;
}

// Sim input contract
export interface SimInput {
  event: EventRecord;
  params: Params;
  plan: Plan | 'baseline';
  seeds: number[];
  stepSec: number;
  horizonMin: number;
}
