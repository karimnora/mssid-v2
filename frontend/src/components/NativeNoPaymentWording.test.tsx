import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent, act, within } from '@testing-library/react';
import { Capacitor } from '@capacitor/core';
import { subscription as subscriptionAr } from '../locales/ar/subscription';
import { subscription as subscriptionFr } from '../locales/fr/subscription';
import { NATIVE_OFFER_COPY } from '../constants/nativeOfferCopy';
import { SubscriptionStatusPanel } from './SubscriptionStatusPanel';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { AuthService } from '../services/authService';
import { springBootApi } from '../services/springBootApi';
import { TermsOfServiceModal } from './TermsOfServiceModal';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { AuthModal } from './AuthModal';
import { GameStationSheet } from './journey/GameStationSheet';
import { MissionBanner } from './missions/MissionBanner';
import { DiagnosticModal } from './diagnostic/DiagnosticModal';
import { ExamPlanPanel } from './examPlan/ExamPlanPanel';
import { MusaidiPanel } from './musaidi/MusaidiPanel';
import { packsForGrade } from '../data/games';
import { getDiagnosticSet } from '../data/diagnostic';
import { saveDiagnosticResult, scoreDiagnostic, selectDiagnosticQuestions } from '../utils/diagnostic';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { buildParentNotebook } from '../utils/competenceProgress';
import { setActiveProgressOwner } from '../utils/progressOwner';
import type { CourseLesson } from '../types';
import type { Mission } from '../data/missions/types';

vi.mock('../context/AuthContext', async (importOriginal) => ({
  ...await importOriginal<typeof import('../context/AuthContext')>(),
  useAuth: () => ({ authUser: AuthService.getCurrentUser(), isAuthLoading: false }),
}));
vi.mock('../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));

/**
 * Google Play: the native app is consumption-only. It may state that a feature belongs to Family
 * Premium accounts, never a price, a purchase call to action, a receipt flow or where to pay.
 */
const FORBIDDEN = [
  /\d\s*(DA|DZD)\b/i, /دج/, /\bprix\b/i, /tarif/i, /\bpa(y|ie)\w*/i, /paiement/i, /achat|acheter/i,
  /abonnez/i, /reçu/i, /découvr\w*\s+Premium/i, /Premium\s+(ouvre|ajoute)/i,
  /سعر|ثمن|شراء|اشتر(?!اك)|اقتن|دفع|الوصل|وصولات|اكتشاف Premium|يفتح Premium|يضيف Premium/,
  /mssid-dz\.com/i, /https?:\/\//i, /BaridiMob|Edahabia|\bCCP\b|\bCIB\b|Chargily/i,
];
const offending = (text: string) => FORBIDDEN.filter((re) => re.test(text.normalize('NFC').replace(/[\u064B-\u065F\u0670]/g, ''))).map(String);

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

  it.each(['سعر', 'ثمن', 'شراء', 'اشترِ', 'اقتنى', 'الدَّفْع', 'دفعة', 'دفع'])('detects Arabic payment wording: %s', text => {
    expect(offending(text)).not.toEqual([]);
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

  describe('rendered legal and locked screens', () => {
    const profile = () => createFreshGuestProfile('5AP');
    beforeEach(() => {
      localStorage.clear();
      AuthService.setCurrentUser(null);
      setActiveProgressOwner();
      vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
    });
    afterEach(() => {
      cleanup();
      vi.restoreAllMocks();
      AuthService.setCurrentUser(null);
      setActiveProgressOwner();
      setStoredLocale('ar');
    });
    const expectNeutral = () => {
      expect(document.body.textContent?.trim()).toBeTruthy();
      expect(offending(document.body.textContent ?? '')).toEqual([]);
      expect(document.querySelector('a[href^="http"], input[type="file"]')).toBeNull();
    };
    const expectLockedOffer = () => {
      expect(document.querySelector('[data-premium-offer-entry]')).not.toBeNull();
      expectNeutral();
    };

    it.each(['ar', 'fr'] as const)('keeps registration legal actions inside the native app (%s)', (locale) => {
      setStoredLocale(locale);
      const auth = render(<AuthModal isOpen initialMode="register" onClose={vi.fn()} onAuthSuccess={vi.fn()} />, { wrapper: LocaleProvider });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      expect(document.querySelector('a[href="/terms.html"], a[href="/privacy.html"]')).toBeNull();
      for (const name of locale === 'fr' ? ["conditions d'utilisation", 'politique de confidentialité'] : ['شروط الاستخدام', 'سياسة الخصوصية']) {
        fireEvent.click(screen.getByRole('button', { name, exact: true }));
        const legal = document.querySelector('[data-consent-legal-dialog]')!;
        expect(legal).toBeInTheDocument();
        expect(offending(legal.textContent ?? '')).toEqual([]);
        expect(legal.querySelector('a[href]')).toBeNull();
        expect(checkbox).not.toBeChecked();
        fireEvent.click(within(legal as HTMLElement).getByRole('button', { name: 'فهمت وإغلاق' }));
        expect(document.querySelector('[data-consent-legal-dialog]')).toBeNull();
      }
      auth.unmount();
    });

    it.each(['ar', 'fr'] as const)('renders neutral native terms and privacy (%s)', (locale) => {
      setStoredLocale(locale);
      const terms = render(<TermsOfServiceModal isOpen onClose={vi.fn()} />, { wrapper: LocaleProvider });
      expect(document.querySelector('[data-native-subscription-terms]')).toHaveTextContent(locale === 'fr'
        ? "Certaines fonctions sont réservées aux comptes Famille Premium. L'état de votre abonnement est visible dans « Mon abonnement »."
        : 'بعض الوظائف مخصّصة لحسابات العائلة المميّزة. يمكنكم الاطّلاع على حالة اشتراككم في «اشتراكي».');
      expectNeutral();
      terms.unmount();
      render(<PrivacyPolicyModal isOpen onClose={vi.fn()} />);
      expect(screen.getByText('نحتفظ بالمعلومات اللازمة لتفعيل حساب العائلة المميّزة وحفظ حالته.')).toBeInTheDocument();
      expectNeutral();
    });

    it('catches the old terms actually rendered on the web, including CCP and receipt instructions', () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);
      render(<TermsOfServiceModal isOpen onClose={vi.fn()} />, { wrapper: LocaleProvider });
      expect(document.querySelector('[data-native-subscription-terms]')).toBeNull();
      expect(document.body).toHaveTextContent('BaridiMob / CCP');
      expect(offending(document.body.textContent ?? '')).toEqual(expect.arrayContaining([
        expect.stringContaining('دفع'), expect.stringContaining('BaridiMob'),
      ]));
      expect(offending('CCP')).not.toEqual([]);
      expect(offending('الدَّفْع')).not.toEqual([]);
    });

    it.each(['ar', 'fr'] as const)('checks the locked game and mission with their real Premium button (%s)', (locale) => {
      setStoredLocale(locale);
      const pack = packsForGrade('1AP').find(pack => !pack.free)!;
      const game = render(<GameStationSheet pack={pack} open={false} lessonTitles={{}} onClose={vi.fn()} />, { wrapper: LocaleProvider });
      expect(document.querySelector('.gs-locked-note')).not.toBeNull();
      expectLockedOffer();
      game.unmount();
      const mission: Mission = { id: 'locked-copy', lessonId: 'locked-lesson', grade: '5AP', subject: 'math', titleAr: 'مهمة ديدو', xp: 10, scenes: [] };
      render(<MissionBanner mission={mission} />, { wrapper: LocaleProvider });
      fireEvent.click(document.querySelector('[data-mission-start]')!);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expectLockedOffer();
    });

    it.each(['ar', 'fr'] as const)('checks the diagnostic report with locked detail (%s)', (locale) => {
      setStoredLocale(locale);
      const set = getDiagnosticSet('5AP')!;
      const questions = selectDiagnosticQuestions(set, 1);
      const answers = Object.fromEntries(questions.map(question => [question.id, question.options.find(option => option.id !== question.correctId)!.id]));
      saveDiagnosticResult(scoreDiagnostic(set, questions, answers, 1, 0));
      render(<DiagnosticModal isOpen onClose={vi.fn()} userProfile={profile()} setUserProfile={vi.fn()} grade="5AP" onReviewLesson={vi.fn()} />, { wrapper: LocaleProvider });
      fireEvent.click(document.querySelector('[data-diagnostic-last]')!);
      expect(document.querySelector('[data-diagnostic="report"]')).not.toBeNull();
      expectLockedOffer();
    });

    it.each(['ar', 'fr'] as const)('checks the exam plan after locked days load (%s)', async (locale) => {
      setStoredLocale(locale);
      render(<ExamPlanPanel notebook={buildParentNotebook(profile(), '5AP')} storageKey="native-plan" locale={locale} premium={false} onReviewLesson={vi.fn()} onPrint={vi.fn()} now={new Date(2026, 10, 4, 18)} />, { wrapper: LocaleProvider });
      await waitFor(() => expect(document.querySelector('[data-premium-offer-entry]')).not.toBeNull(), { timeout: 20000 });
      expectLockedOffer();
    }, 30000);

    it.each(['ar', 'fr'] as const)('checks Musaidi after the detailed-correction limit is reached (%s)', async (locale) => {
      setStoredLocale(locale);
      AuthService.setCurrentUser({ id: 7, nom: 'Parent', email: 'parent@test.invalid', role: 'ROLE_FREE' });
      const quota = { allowed: false, premium: false, limit: 3, remaining: 0, opened: ['previous-1', 'previous-2', 'previous-3'], day: 'd' };
      vi.spyOn(springBootApi, 'getMusaidiToday').mockResolvedValue({ status: 200, data: quota });
      vi.spyOn(springBootApi, 'openMusaidi').mockResolvedValue({ status: 200, data: quota });
      const lesson = { id: 'native-math', grade: '1AP', subject: 'math', trimester: 1, titleAr: 'الجمع', rulesAr: ['نجمع العددين'], quiz: [{ id: 'q', questionAr: 'ما نتيجة الجمع؟', hintAr: 'اجمع', options: [{ id: 'a', textAr: '2', isCorrect: true, explanationAr: '1 + 1 = 2' }, { id: 'b', textAr: '3', isCorrect: false }] }] } as CourseLesson;
      render(<MusaidiPanel grade="1AP" courses={[lesson]} lesson={lesson} onClose={vi.fn()} />, { wrapper: LocaleProvider });
      await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^ما نتيجة الجمع/ })); });
      await act(async () => { fireEvent.click(document.querySelector('[data-musaidi-reveal]')!); });
      await screen.findByRole('alert');
      expectLockedOffer();
    });
  });
});
