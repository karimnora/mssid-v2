import { common as commonAr } from './ar/common';
import { common as commonFr } from './fr/common';
import { common as commonEn } from './en/common';
import { navigation as navigationAr } from './ar/navigation';
import { navigation as navigationFr } from './fr/navigation';
import { navigation as navigationEn } from './en/navigation';
import { promo as promoAr } from './ar/promo';
import { promo as promoFr } from './fr/promo';
import { promo as promoEn } from './en/promo';
import { pricing as pricingAr } from './ar/pricing';
import { pricing as pricingFr } from './fr/pricing';
import { pricing as pricingEn } from './en/pricing';

export type LocaleCode = 'ar' | 'fr' | 'en';

export const locales = {
  ar: {
    code: 'ar' as const,
    direction: 'rtl' as const,
    strings: {
      common: commonAr,
      navigation: navigationAr,
      promo: promoAr,
      pricing: pricingAr,
    },
  },
  fr: {
    code: 'fr' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonFr,
      navigation: navigationFr,
      promo: promoFr,
      pricing: pricingFr,
    },
  },
  en: {
    code: 'en' as const,
    direction: 'ltr' as const,
    strings: {
      common: commonEn,
      navigation: navigationEn,
      promo: promoEn,
      pricing: pricingEn,
    },
  },
};

export type LocaleStrings = typeof locales['ar']['strings'];
