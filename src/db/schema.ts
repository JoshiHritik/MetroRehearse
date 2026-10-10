import Dexie, { type EntityTable } from 'dexie';
import type {
  Profile,
  EventRecord,
  Params,
  Plan,
  RunSummary,
  LiveCount,
  Briefing,
  Review,
  Setting,
} from '../domain/types';

export class MetroRehearseDB extends Dexie {
  profiles!: EntityTable<Profile, 'id'>;
  events!: EntityTable<EventRecord, 'id'>;
  params!: EntityTable<Params, 'id'>;
  plans!: EntityTable<Plan, 'id'>;
  runs!: EntityTable<RunSummary, 'id'>;
  liveCounts!: EntityTable<LiveCount, 'id'>;
  briefings!: EntityTable<Briefing, 'id'>;
  reviews!: EntityTable<Review, 'id'>;
  settings!: EntityTable<Setting, 'key'>;

  constructor() {
    super('MetroRehearseDB');
    this.version(1).stores({
      profiles: 'id, role, lastUsedAt',
      events: 'id, stationId, status, endsAt',
      params: 'id',
      plans: 'id, eventId',
      runs: 'id, eventId, planId',
      liveCounts: 'id, eventId, gateId, ts',
      briefings: 'id, eventId, lang',
      reviews: 'id, eventId',
      settings: 'key',
    });
  }
}

export const db = new MetroRehearseDB();
