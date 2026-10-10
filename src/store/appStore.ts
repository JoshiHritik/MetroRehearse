import { create } from 'zustand';
import type { SupportedLang, UserRole } from '../domain/types';
import { applyLanguageToDoc } from '../i18n';
import { db } from '../db/schema';
import { requestWakeLock, releaseWakeLock } from '../pwa/wakeLock';

interface AppState {
  currentLang: SupportedLang;
  theme: 'dark' | 'light';
  isOnline: boolean;
  wakeLockActive: boolean;
  csvStreamActive: boolean;
  activeEventId: string | null;
  timeScrubberMin: number; // 0 to 180 minutes
  isSimulating: boolean;
  activeProfileId: string;
  activeRole: UserRole;

  // Actions
  setLanguage: (lang: SupportedLang) => Promise<void>;
  setTheme: (theme: 'dark' | 'light') => Promise<void>;
  setIsOnline: (status: boolean) => void;
  toggleWakeLock: () => Promise<boolean>;
  toggleCsvStream: () => void;
  setTimeScrubberMin: (min: number) => void;
  setIsSimulating: (isSim: boolean) => void;
  setActiveEventId: (eventId: string | null) => void;
  setActiveProfile: (profileId: string, role: UserRole) => Promise<void>;
  initSettings: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentLang: 'en',
  theme: 'dark',
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  wakeLockActive: false,
  csvStreamActive: false,
  activeEventId: 'evt-gt-vs-mi-2026',
  timeScrubberMin: 25,
  isSimulating: false,
  activeProfileId: 'profile-planner-ashwin',
  activeRole: 'planner',

  initSettings: async () => {
    try {
      const langSetting = await db.settings.get('lang');
      const themeSetting = await db.settings.get('theme');
      const profileSetting = await db.settings.get('activeProfileId');

      const lang = (langSetting?.value as SupportedLang) || 'en';
      const theme = (themeSetting?.value as 'dark' | 'light') || 'dark';
      const profileId = (profileSetting?.value as string) || 'profile-planner-ashwin';

      applyLanguageToDoc(lang);
      document.documentElement.setAttribute('data-theme', theme);

      const profile = await db.profiles.get(profileId);
      const role = profile ? profile.role : 'planner';

      set({
        currentLang: lang,
        theme,
        activeProfileId: profileId,
        activeRole: role,
      });
    } catch (e) {
      console.warn('Could not load settings from DB:', e);
    }
  },

  setLanguage: async (lang: SupportedLang) => {
    applyLanguageToDoc(lang);
    await db.settings.put({ key: 'lang', value: lang });
    set({ currentLang: lang });
  },

  setTheme: async (theme: 'dark' | 'light') => {
    document.documentElement.setAttribute('data-theme', theme);
    await db.settings.put({ key: 'theme', value: theme });
    set({ theme });
  },

  setIsOnline: (isOnline: boolean) => {
    set({ isOnline });
  },

  toggleWakeLock: async () => {
    const current = get().wakeLockActive;
    if (current) {
      await releaseWakeLock();
      set({ wakeLockActive: false });
      return false;
    } else {
      const success = await requestWakeLock();
      set({ wakeLockActive: success });
      return success;
    }
  },

  toggleCsvStream: () => {
    set((state) => ({ csvStreamActive: !state.csvStreamActive }));
  },

  setTimeScrubberMin: (timeScrubberMin: number) => {
    set({ timeScrubberMin });
  },

  setIsSimulating: (isSimulating: boolean) => {
    set({ isSimulating });
  },

  setActiveEventId: (activeEventId: string | null) => {
    set({ activeEventId });
  },

  setActiveProfile: async (profileId: string, role: UserRole) => {
    await db.settings.put({ key: 'activeProfileId', value: profileId });
    set({ activeProfileId: profileId, activeRole: role });
  },
}));
