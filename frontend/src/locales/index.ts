import { common as commonAr } from './ar/common';
import { common as commonFr } from './fr/common';
import { common as commonEn } from './en/common';
import { common as commonBer } from './ber/common';
import { navigation as navigationAr } from './ar/navigation';
import { navigation as navigationFr } from './fr/navigation';
import { navigation as navigationEn } from './en/navigation';
import { navigation as navigationBer } from './ber/navigation';
import { pricing as pricingAr } from './ar/pricing';
import { pricing as pricingFr } from './fr/pricing';
import { pricing as pricingEn } from './en/pricing';
import { pricing as pricingBer } from './ber/pricing';

export type LocaleCode = 'ar' | 'fr' | 'en' | 'ber';

export const locales = {
  ar: {
    code: 'ar' as const,
    direction: 'rtl' as const,
    strings: {
      common: commonAr,
      navigation: navigationAr,
      pricing: pricingAr,
    },
  },
  fr: {
    code: 'fr' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonFr,
      navigation: navigationFr,
      pricing: pricingFr,
    },
  },
  en: {
    code: 'en' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonEn,
      navigation: navigationEn,
      pricing: pricingEn,
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
      pricing: pricingBer,
    },
  },
};

export type LocaleStrings = typeof locales['ar']['strings'];
