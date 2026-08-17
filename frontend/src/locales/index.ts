import { common as commonAr } from './ar/common';
import { navigation as navigationAr } from './ar/navigation';

// Arabic-only, permanently — see LocaleContext.tsx's comment for why the fr/en/ber switcher was
// removed rather than kept as a real feature.
export const locales = {
  ar: {
    code: 'ar' as const,
    direction: 'rtl' as const,
    strings: {
      common: commonAr,
      navigation: navigationAr,
    },
  },
};

export type LocaleStrings = typeof locales['ar']['strings'];
