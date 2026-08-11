import { common as commonAr } from './ar/common';
import { common as commonFr } from './fr/common';
import { common as commonEn } from './en/common';

export type LocaleCode = 'ar' | 'fr' | 'en';

export const locales = {
  ar: {
    code: 'ar' as const,
    direction: 'rtl' as const,
    strings: {
      common: commonAr,
    },
  },
  fr: {
    code: 'fr' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonFr,
    },
  },
  en: {
    code: 'en' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonEn,
    },
  },
};

export type LocaleStrings = typeof locales['ar']['strings'];
