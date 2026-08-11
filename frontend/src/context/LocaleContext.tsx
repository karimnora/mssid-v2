import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LocaleCode, locales, LocaleStrings } from '../locales';

export interface LocaleContextValue {
  locale: LocaleCode;
  direction: 'rtl' | 'ltr';
  strings: LocaleStrings;
  setLocale: (locale: LocaleCode) => void;
  t: (namespace: keyof LocaleStrings, key: string, params?: Record<string, string | number>) => string;
  useT: (namespace: keyof LocaleStrings, key: string, params?: Record<string, string | number>) => string;
}

const defaultLocale: LocaleCode = 'ar';

const detectBrowserLocale = (): LocaleCode => {
  if (typeof navigator === 'undefined') return defaultLocale;
  const browserLocale = navigator.language.slice(0, 2).toLowerCase();
  if (browserLocale === 'fr') return 'fr';
  if (browserLocale === 'en') return 'en';
  return 'ar';
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('mssid_locale');
      if (stored === 'ar' || stored === 'fr' || stored === 'en') {
        return stored as LocaleCode;
      }
    }
    return detectBrowserLocale();
  });

  const setLocale = (nextLocale: LocaleCode) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mssid_locale', nextLocale);
    }
  };

  const localeConfig = locales[locale];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = localeConfig.direction;
      document.documentElement.lang = localeConfig.code;
    }
  }, [localeConfig.direction, localeConfig.code]);

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
      locale,
      direction: localeConfig.direction,
      strings: localeConfig.strings,
      setLocale,
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
