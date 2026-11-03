import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { Capacitor } from '@capacitor/core';
import { subscription as subscriptionAr } from '../locales/ar/subscription';
import { subscription as subscriptionFr } from '../locales/fr/subscription';
import { NATIVE_OFFER_COPY } from '../constants/nativeOfferCopy';
import { SubscriptionStatusPanel } from './SubscriptionStatusPanel';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { AuthService } from '../services/authService';
import { springBootApi } from '../services/springBootApi';

/**
 * Google Play: the native app is consumption-only. It may state that a feature belongs to Family
 * Premium accounts, never a price, a purchase call to action, a receipt flow or where to pay.
 */
const FORBIDDEN = [
  /\d\s*(DA|DZD)\b/i, /دج/, /\bprix\b/i, /tarif/i, /\bpa(y|ie)\w*/i, /paiement/i, /achat|acheter/i,
  /abonnez/i, /reçu/i, /découvr\w*\s+Premium/i, /Premium\s+(ouvre|ajoute)/i,
  /الدفع|ادفع|شراء|اشتر[كي]\s*الآن|الوصل|وصولات|اكتشاف Premium|يفتح Premium|يضيف Premium/,
  /mssid-dz\.com/i, /https?:\/\//i, /BaridiMob|Edahabia|CIB|Chargily/i,
];
const offending = (text: string) => FORBIDDEN.filter((re) => re.test(text)).map(String);

// Every string a native user can read on subscription and Premium surfaces.
const NATIVE_VISIBLE_KEYS = [
  'mySubscription', 'subscriptionAccessInfo', 'subscriptionSignInInfo', 'subscriptionActive', 'subscriptionExpired',
  'subscriptionCancelled', 'subscriptionFree', 'subscriptionUnknown', 'subscriptionLoading', 'subscriptionEndDate',
  'subscriptionRefreshError', 'subscriptionRefresh', 'subscriptionClose',
  'cahierLimitNative', 'notebookPremiumNative', 'cemPreviewNative',
] as const;

describe('Native app — no payment wording (Google Play)', () => {
  it.each([['ar', subscriptionAr], ['fr', subscriptionFr]] as const)('native-visible %s subscription strings stay neutral', (_locale, dict) => {
    for (const key of NATIVE_VISIBLE_KEYS) {
      const value = (dict as Record<string, string>)[key];
      expect(value, key).toBeTruthy();
      expect(offending(value), `${key}: ${value}`).toEqual([]);
    }
  });

  it('every *Native subscription key stays neutral', () => {
    for (const dict of [subscriptionAr, subscriptionFr] as Record<string, string>[]) {
      for (const [key, value] of Object.entries(dict).filter(([k]) => k.endsWith('Native'))) {
        expect(offending(value), `${key}: ${value}`).toEqual([]);
      }
    }
  });

  it('inline native Premium copy stays neutral', () => {
    for (const [key, copy] of Object.entries(NATIVE_OFFER_COPY)) {
      expect(offending(copy.fr), key).toEqual([]);
      expect(offending(copy.ar), key).toEqual([]);
    }
  });

  it('covers the « مساعدي » daily-limit message', () => {
    expect(NATIVE_OFFER_COPY.musaidiLimit).toBeTruthy();
  });

  it('the guard itself catches the web wording it replaces', () => {
    expect(offending(subscriptionFr.cahierLimit)).not.toEqual([]);
    expect(offending(subscriptionAr.notebookPremium)).not.toEqual([]);
    expect(offending('900 DA par trimestre')).not.toEqual([]);
  });

  describe('rendered status panel', () => {
    const user = { id: 7, nom: 'Parent', email: 'parent@test.invalid', role: 'ROLE_FREE' as const };
    beforeEach(() => { AuthService.setCurrentUser(user); });
    afterEach(() => { cleanup(); vi.restoreAllMocks(); AuthService.setCurrentUser(null); });

    it.each(['ar', 'fr'] as const)('shows no receipt tracking and no payment wording in native (%s)', async (locale) => {
      setStoredLocale(locale);
      vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
      vi.spyOn(springBootApi, 'getSubscriptionStatus').mockResolvedValue({ status: 200, data: { status: 'NONE', startDate: null, endDate: null } });
      vi.spyOn(springBootApi, 'fetchCurrentUser').mockResolvedValue({ status: 200, data: user as never });
      const receipt = vi.spyOn(springBootApi, 'getReceiptStatus');
      render(<SubscriptionStatusPanel user={user} onClose={vi.fn()} />, { wrapper: LocaleProvider });
      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(locale === 'fr' ? 'Aucun abonnement actif' : 'لا يوجد اشتراك نشط'));
      expect(document.querySelector('[data-receipt-status]')).toBeNull();
      expect(receipt).not.toHaveBeenCalled();
      expect(document.querySelector('a, form, input[type=file]')).toBeNull();
      expect(offending(document.body.textContent ?? '')).toEqual([]);
    });
  });
});
