import en from './en.json';
import hi from './hi.json';
import gu from './gu.json';

export type SupportedLang = 'en' | 'hi' | 'gu';

const dictionaries: Record<SupportedLang, any> = {
  en,
  hi,
  gu,
};

export function getTranslation(lang: SupportedLang, keyPath: string, fallback?: string): string {
  const dict = dictionaries[lang] || dictionaries.en;
  const parts = keyPath.split('.');
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  if (typeof current === 'string') {
    return current;
  }

  // Fallback to English
  if (lang !== 'en') {
    let enCurrent: any = dictionaries.en;
    for (const part of parts) {
      if (enCurrent && typeof enCurrent === 'object' && part in enCurrent) {
        enCurrent = enCurrent[part];
      } else {
        enCurrent = undefined;
        break;
      }
    }
    if (typeof enCurrent === 'string') return enCurrent;
  }

  return fallback || keyPath;
}

export function applyLanguageToDoc(lang: SupportedLang) {
  document.documentElement.lang = lang;
}
