import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './schema';


export function useProfiles() {
  return useLiveQuery(() => db.profiles.toArray(), []);
}

export function useActiveProfile() {
  return useLiveQuery(async () => {
    const setting = await db.settings.get('activeProfileId');
    const profileId = (setting?.value as string) || 'profile-planner-ashwin';
    const profile = await db.profiles.get(profileId);
    if (profile) return profile;
    return (await db.profiles.toCollection().first()) || null;
  }, []);
}

export function useEvents() {
  return useLiveQuery(() => db.events.orderBy('endsAt').toArray(), []);
}

export function useEvent(id: string | undefined) {
  return useLiveQuery(async () => {
    if (!id) return null;
    return (await db.events.get(id)) || null;
  }, [id]);
}

export function useParams(id: string | undefined) {
  return useLiveQuery(async () => {
    if (!id) return null;
    return (await db.params.get(id)) || null;
  }, [id]);
}

export function usePlans(eventId: string | undefined) {
  return useLiveQuery(async () => {
    if (!eventId) return [];
    return await db.plans.where('eventId').equals(eventId).toArray();
  }, [eventId]);
}

export function usePlan(id: string | undefined) {
  return useLiveQuery(async () => {
    if (!id) return null;
    return (await db.plans.get(id)) || null;
  }, [id]);
}

export function useRuns(eventId: string | undefined) {
  return useLiveQuery(async () => {
    if (!eventId) return [];
    return await db.runs.where('eventId').equals(eventId).toArray();
  }, [eventId]);
}

export function useLiveCounts(eventId: string | undefined) {
  return useLiveQuery(async () => {
    if (!eventId) return [];
    const counts = await db.liveCounts.where('eventId').equals(eventId).toArray();
    return counts.sort((a, b) => b.ts - a.ts);
  }, [eventId]);
}

export function useBriefing(eventId: string | undefined, lang: string) {
  return useLiveQuery(async () => {
    if (!eventId) return null;
    const all = await db.briefings.where('eventId').equals(eventId).toArray();
    return all.find((b) => b.lang === lang) || all[0] || null;
  }, [eventId, lang]);
}

export function useSetting<T>(key: string, defaultValue: T): T {
  const result = useLiveQuery(async () => {
    const s = await db.settings.get(key);
    return s ? (s.value as T) : defaultValue;
  }, [key]);

  return result !== undefined ? result : defaultValue;
}
