export type LocaleCode = 'ar' | 'fr';

const LOCALE_STORAGE_KEY = 'mssid_locale_preference';
const DEFAULT_LOCALE: LocaleCode = 'ar';

function loadStoredLocale(): LocaleCode {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    // Explicit-choice only — never derive from navigator.language. No saved value means
    // "never chosen yet", which defaults to Arabic, not the browser's own language.
    return saved === 'fr' ? 'fr' : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

let currentLocale: LocaleCode = loadStoredLocale();

type Listener = () => void;
const listeners = new Set<Listener>();

export const getStoredLocale = (): LocaleCode => currentLocale;

export const setStoredLocale = (locale: LocaleCode): void => {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
  listeners.forEach((listener) => listener());
};

export const subscribeLocale = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
