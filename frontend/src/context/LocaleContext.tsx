import React, { createContext, useContext, useMemo } from 'react';
import { locales, LocaleStrings } from '../locales';

export interface LocaleContextValue {
  locale: 'ar';
  direction: 'rtl';
  strings: LocaleStrings;
  t: (namespace: keyof LocaleStrings, key: string, params?: Record<string, string | number>) => string;
  useT: (namespace: keyof LocaleStrings, key: string, params?: Record<string, string | number>) => string;
}

// The app is Arabic-only, permanently — the previous fr/en/ber switcher only ever translated ~50
// generic UI labels (buttons, nav) while the actual pedagogical content (66 course data files) stayed
// Arabic regardless of the selected language, and it silently auto-picked fr/en from the browser's
// own language setting even before anyone touched the switcher. That mismatch was worse than no
// switcher at all, so it's gone — see LanguageSwitcher.tsx's removal. `t()` stays as the lookup
// mechanism for the ~9 call sites that already use it; there's just nothing left to switch to.
const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const localeConfig = locales.ar;

  const interpolate = (template: string, params?: Record<string, string | number>) => {
    if (!params) return template;
    return Object.entries(params).reduce((result, [key, value]) => {
      const pattern = new RegExp(`\\{${key}\\}`, 'g');
      return result.replace(pattern, String(value));
    }, template);
  };

  const translate = (namespace: keyof LocaleStrings, key: string, params?: Record<string, string | number>) => {
    const namespaceStrings = localeConfig.strings[namespace] as Record<string, string> | undefined;
    const copy = namespaceStrings?.[key] || key;
    return interpolate(copy, params);
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: 'ar',
      direction: 'rtl',
      strings: localeConfig.strings,
      t: translate,
      useT: translate,
    }),
    [],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocaleContext = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within LocaleProvider');
  }
  return context;
};
