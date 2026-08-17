import { common as commonAr } from './ar/common';
import { common as commonFr } from './fr/common';
import { common as commonEn } from './en/common';
import { common as commonBer } from './ber/common';
import { navigation as navigationAr } from './ar/navigation';
import { navigation as navigationFr } from './fr/navigation';
import { navigation as navigationEn } from './en/navigation';
import { navigation as navigationBer } from './ber/navigation';

export type LocaleCode = 'ar' | 'fr' | 'en' | 'ber';

export const locales = {
  ar: {
    code: 'ar' as const,
    direction: 'rtl' as const,
    strings: {
      common: commonAr,
      navigation: navigationAr,
    },
  },
  fr: {
    code: 'fr' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonFr,
      navigation: navigationFr,
    },
  },
  en: {
    code: 'en' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonEn,
      navigation: navigationEn,
    },
  },
  // Neo-Tifinagh (as standardized for Tamazight education in Algeria/Morocco) is written LTR,
  // unlike Arabic — this is the one non-Arabic locale that isn't just "the same as fr/en".
  ber: {
    code: 'ber' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonBer,
      navigation: navigationBer,
    },
  },
};

export type LocaleStrings = typeof locales['ar']['strings'];
