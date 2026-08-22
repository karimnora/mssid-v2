import React, { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import { locales, LocaleStrings, AppLocale } from '../locales';
import { getStoredLocale, setStoredLocale, subscribeLocale, LocaleCode } from '../localePreference';

export interface LocaleContextValue {
  locale: AppLocale;
  direction: 'rtl' | 'ltr';
  setLocale: (locale: LocaleCode) => void;
  strings: LocaleStrings;
  t: (namespace: keyof LocaleStrings, key: string, params?: Record<string, string | number>) => string;
  useT: (namespace: keyof LocaleStrings, key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template;
  return Object.entries(params).reduce((result, [key, value]) => {
    const pattern = new RegExp(`\\{${key}\\}`, 'g');
    return result.replace(pattern, String(value));
  }, template);
}

export const LocaleProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const locale = useSyncExternalStore(subscribeLocale, getStoredLocale, () => 'ar' as LocaleCode);
  const localeConfig = locales[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeConfig.direction;
  }, [locale, localeConfig.direction]);

  const translate = (namespace: keyof LocaleStrings, key: string, params?: Record<string, string | number>) => {
    const current = localeConfig.strings[namespace] as Record<string, string> | undefined;
    const fallback = locales.ar.strings[namespace] as Record<string, string> | undefined;
    const copy = current?.[key] || fallback?.[key] || key;
    return interpolate(copy, params);
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: localeConfig.direction,
      setLocale: setStoredLocale,
      strings: localeConfig.strings,
      t: translate,
      useT: translate,
    }),
    [locale, localeConfig],
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
