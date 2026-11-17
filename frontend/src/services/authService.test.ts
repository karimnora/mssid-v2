import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AuthService } from './authService';
import { AuthUser } from '../types/auth';

describe('AuthService - Authentication & RBAC Service Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    // SEC-05: the authenticated profile is an in-memory singleton now (never localStorage), so
    // localStorage.clear() alone no longer resets it between tests — do it explicitly.
    AuthService.setCurrentUser(null);
  });

  describe('Happy Path - User Retrieval & Session', () => {
    it('returns null when local storage is empty', () => {
      const user = AuthService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('clears session on logout', () => {
      AuthService.setCurrentUser({ id: 103, nom: 'الأستاذ المدير', email: 'admin@mssid.dz', role: 'ROLE_ADMIN' });
      expect(AuthService.getCurrentUser()?.role).toBe('ROLE_ADMIN');

      AuthService.logout();
      expect(AuthService.getCurrentUser()).toBeNull();
    });
  });

  describe('loginAsync - real backend login (no fabricated demo progress)', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    // Regression test: `||` treated a genuine 0/[] from the backend as "missing" and fell through
    // to hardcoded demo values (4-day streak, 3 quizzes, a specific 5AP lesson marked done) — a real
    // student starting fresh saw fabricated progress instead of their honest, empty state.
    it('preserves a real 0 streak / 0 quizzes / no completed lessons instead of inventing demo progress', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          nom: 'يونس',
          email: 'younes@mssid.dz',
          user: {
            id: 42,
            grade: '2AP',
            streakDays: 0,
            quizzesCompleted: 0,
            completedLessonIds: [],
            score: 0,
          },
        }),
      });

      const result = await AuthService.loginAsync('younes@mssid.dz', 'password123');

      expect(result.user?.grade).toBe('2AP');
      expect(result.user?.streakDays).toBe(0);
      expect(result.user?.quizzesCompleted).toBe(0);
      expect(result.user?.completedLessonIds).toEqual([]);
      expect(result.user?.xp).toBe(0);
    });

    it('still falls back to honest empty defaults when the backend omits progress fields entirely', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ nom: 'يونس', email: 'younes@mssid.dz', user: { id: 42, grade: '3AP' } }),
      });

      const result = await AuthService.loginAsync('younes@mssid.dz', 'password123');

      expect(result.user?.streakDays).toBe(0);
      expect(result.user?.quizzesCompleted).toBe(0);
      expect(result.user?.completedLessonIds).toEqual([]);
    });
  });

  describe('getAllUsersAsync - admin console user list (regression: no fake demo accounts on failure)', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    // The exact bug this fix targets: an admin whose real user-list request fails must see an
    // empty list, never the three fabricated demo accounts (أحمد التلميذ / سارة المتفوقة / الأستاذ
    // المدير) with no indication they aren't real students.
    it('returns an empty list — not fabricated demo accounts — when the backend call throws', async () => {
      vi.useFakeTimers();
      try {
        global.fetch = vi.fn().mockRejectedValue(new Error('network down'));

        const usersPromise = AuthService.getAllUsersAsync();
        await vi.advanceTimersByTimeAsync(20000); // fast-forward past the cold-start retry delay
        const users = await usersPromise;

        expect(users).toEqual([]);
      } finally {
        vi.useRealTimers();
      }
    });

    it('returns an empty list when the backend responds with a non-array payload', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'unexpected shape' }),
      });

      const users = await AuthService.getAllUsersAsync();

      expect(users).toEqual([]);
    });

    it('maps real backend users normally when the call succeeds', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ([{ id: 7, nom: 'يونس', email: 'younes@mssid.dz', role: 'ROLE_FREE' }]),
      });

      const users = await AuthService.getAllUsersAsync();

      expect(users).toEqual([expect.objectContaining({ id: 7, email: 'younes@mssid.dz', role: 'ROLE_FREE' })]);
    });
  });

  describe('Payment Receipts & Verification Logic', () => {
    it('falls back to seed receipts when localStorage holds invalid JSON or a non-array', () => {
      localStorage.setItem('mssid_payment_receipts', '{not-json');
      expect(AuthService.getReceipts().length).toBeGreaterThan(0);

      localStorage.setItem('mssid_payment_receipts', JSON.stringify({ broken: true }));
      expect(Array.isArray(AuthService.getReceipts())).toBe(true);
      expect(AuthService.getReceipts()[0].userEmail).toBe('dev-free@example.test');
    });

    it('submits a new CCP/BaridiMob receipt successfully (Happy Path)', () => {
      const newReceipt = AuthService.submitReceipt(
        101,
        'أحمد التلميذ',
        'free@mssid.dz',
        'BARIDIMOB',
        1500,
        'BM-TEST-123456',
        'https://example.com/receipt.jpg'
      );

      expect(newReceipt.status).toBe('PENDING_VERIFICATION');
      expect(newReceipt.transactionRef).toBe('BM-TEST-123456');

      const allReceipts = AuthService.getReceipts();
      expect(allReceipts[0].id).toBe(newReceipt.id);
    });

    it('approves a pending receipt and upgrades matched user to ROLE_PREMIUM', () => {
      // Set current user as free user (id 101)
      const freeUser: AuthUser = {
        id: 101,
        nom: 'أحمد التلميذ',
        email: 'free@mssid.dz',
        role: 'ROLE_FREE',
      };
      AuthService.setCurrentUser(freeUser);

      // Submit a receipt for user 101
      const receipt = AuthService.submitReceipt(
        101,
        'أحمد التلميذ',
        'free@mssid.dz',
        'BARIDIMOB',
        1500,
        'BM-UPGRADE-999',
        'https://example.com/receipt.jpg'
      );

      // Verify and approve receipt
      const verified = AuthService.verifyReceipt(receipt.id, true);
      expect(verified?.status).toBe('APPROVED');

      // Check upgraded user state
      const upgradedUser = AuthService.getCurrentUser();
      expect(upgradedUser?.role).toBe('ROLE_PREMIUM');
      expect(upgradedUser?.subscription?.status).toBe('ACTIVE');
    });

    it('rejects a receipt with a specified reason (Error Path / Rejection)', () => {
      const receipt = AuthService.submitReceipt(
        101,
        'أحمد التلميذ',
        'free@mssid.dz',
        'EDAHABIA',
        1500,
        'ED-INVALID-000',
        'https://example.com/receipt.jpg'
      );

      const rejected = AuthService.verifyReceipt(receipt.id, false, 'الصورة غير واضحة ورقم العملية خاطئ');
      expect(rejected?.status).toBe('REJECTED');
      expect(rejected?.rejectionReason).toBe('الصورة غير واضحة ورقم العملية خاطئ');
    });
  });

  describe('verifyReceiptAsync - the real, backend-authoritative admin approval path', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('reports success only once the backend confirms the approval', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true }),
      });

      const result = await AuthService.verifyReceiptAsync(42, true);

      expect(result).toEqual({ success: true });
    });

    // Regression test for the bug this method exists to fix: the old verifyReceipt() wrote
    // "approved" to localStorage BEFORE the backend call even resolved, so a network failure was
    // invisible to the admin. This must surface as an explicit failure instead.
    it('reports failure (not a false success) when the backend call fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 500,
        ok: false,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Erreur serveur interne' }),
      });

      const result = await AuthService.verifyReceiptAsync(42, true);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Erreur serveur interne');
    });

    it('reports failure when the network itself is unreachable', async () => {
      // springBootApi.request() silently retries once after 20s on a raw network failure (see
      // Phase 34's cold-start recovery, widened in Phase 155) — use fake timers so this test
      // doesn't actually wait 20s.
      vi.useFakeTimers();
      try {
        global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

        const resultPromise = AuthService.verifyReceiptAsync(42, false, 'test');
        await vi.advanceTimersByTimeAsync(20000);
        const result = await resultPromise;

        expect(result.success).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('submitReceiptAsync - the real, backend-authoritative receipt submission path', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
      AuthService.setCurrentUser(null);
    });

    it('returns the saved receipt once the backend confirms it (Happy Path)', async () => {
      AuthService.setCurrentUser({ id: 7, nom: 'يونس', email: 'younes@mssid.dz', role: 'ROLE_FREE' });
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: 99, status: 'PENDING_VERIFICATION', transactionRef: 'BM-1', amountDzd: 1500 }),
      });

      const result = await AuthService.submitReceiptAsync({
        paymentMethod: 'BARIDIMOB',
        amountDzd: 1500,
        transactionRef: 'BM-1',
        receiptImageUrl: 'data:image/png;base64,xyz',
      });

      expect(result.success).toBe(true);
      expect(result.receipt?.id).toBe(99);
      expect(result.receipt?.status).toBe('PENDING_VERIFICATION');
    });

    // Regression test for the exact bug this method fixes: the old submitReceipt() wrote a
    // "PENDING_VERIFICATION" receipt to localStorage BEFORE the backend call resolved, so a
    // server-side rejection (e.g. the new amount-validation check) was invisible to the student —
    // they'd see a pending-review screen for a submission the server never actually recorded.
    it('reports failure — not a false pending state — when the backend rejects the submission', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 400,
        ok: false,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Le montant indiqué (1 DZD) ne correspond pas au tarif de l\'abonnement (1500 DZD).' }),
      });

      const result = await AuthService.submitReceiptAsync({
        paymentMethod: 'BARIDIMOB',
        amountDzd: 1,
        transactionRef: 'BM-2',
        receiptImageUrl: 'data:image/png;base64,xyz',
      });

      expect(result.success).toBe(false);
      expect(result.receipt).toBeUndefined();
      expect(result.message).toContain('ne correspond pas au tarif');
    });
  });

  describe('"Didou Studio" gold-coin/outfit sync (kept deliberately separate from XP)', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('updates the in-memory user and pushes goldCoins/avatarConfig to the backend', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });
      global.fetch = mockFetch;

      AuthService.setCurrentUser({ id: 101, nom: 'أحمد التلميذ', email: 'free@mssid.dz', role: 'ROLE_FREE',
        parentalConsentRequired: false, parentalConsentAt: '2026-11-16T10:00:00Z', parentalConsentVersion: 'parental-consent-2026-11-v1' });
      const newConfig = { activeOutfit: 'burnous_traditionnel' as const, unlockedOutfits: ['default', 'burnous_traditionnel'] as const, mood: 'celebrating' as const };

      const updated = AuthService.syncGoldCoinsAndAvatar(85, newConfig as any);

      expect(updated?.goldCoins).toBe(85);
      expect(updated?.avatarConfig).toEqual(newConfig);
      expect(AuthService.getCurrentUser()?.goldCoins).toBe(85);

      await Promise.resolve(); // let the fire-and-forget network call's microtask settle
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/users/me/progress'),
        expect.objectContaining({ body: expect.stringContaining('"goldCoins":85') })
      );
    });

    it('returns null and makes no network call when nobody is logged in', () => {
      const mockFetch = vi.fn();
      global.fetch = mockFetch;

      const result = AuthService.syncGoldCoinsAndAvatar(50);

      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Streak consistency across XP sources (addScore / addExamXp / addChallengeXp)', () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);

    // Regression: addExamXp/addChallengeXp used to never touch streakDays at all, so a student who
    // only did an exam or a challenge that day saw their streak silently fail to advance.
    it('addExamXp advances the streak by 1 when the last activity was exactly yesterday', () => {
      AuthService.setCurrentUser({
        id: 1, nom: 'ياسين', email: 'yassine@mssid.dz', role: 'ROLE_FREE',
        streakDays: 3, lastActiveDate: yesterday, score: 0,
      } as AuthUser);

      const updated = AuthService.addExamXp('exam-1', 50);

      expect(updated?.streakDays).toBe(4);
      expect(updated?.lastActiveDate).toBe(new Date().toISOString().slice(0, 10));
    });

    it('addChallengeXp resets the streak to 1 after a gap of more than one day', () => {
      AuthService.setCurrentUser({
        id: 1, nom: 'ياسين', email: 'yassine@mssid.dz', role: 'ROLE_FREE',
        streakDays: 7, lastActiveDate: twoDaysAgo, score: 0,
      } as AuthUser);

      const updated = AuthService.addChallengeXp('challenge-1', 30);

      expect(updated?.streakDays).toBe(1);
    });

    it('addScore leaves the streak unchanged on a second activity the same day', () => {
      const today = new Date().toISOString().slice(0, 10);
      AuthService.setCurrentUser({
        id: 1, nom: 'ياسين', email: 'yassine@mssid.dz', role: 'ROLE_FREE',
        streakDays: 5, lastActiveDate: today, score: 0,
      } as AuthUser);

      const updated = AuthService.addScore(10);

      expect(updated?.streakDays).toBe(5);
    });

    it('addExamXp and addChallengeXp agree with addScore on the same-day-then-next-day sequence', () => {
      AuthService.setCurrentUser({
        id: 1, nom: 'ياسين', email: 'yassine@mssid.dz', role: 'ROLE_FREE',
        streakDays: 2, lastActiveDate: yesterday, score: 0,
      } as AuthUser);

      // Only a challenge is completed today (no quiz) — the streak must still advance.
      const updated = AuthService.addChallengeXp('challenge-2', 20);
      expect(updated?.streakDays).toBe(3);

      // A second, same-day exam completion must not double-increment.
      const again = AuthService.addExamXp('exam-2', 40);
      expect(again?.streakDays).toBe(3);
    });
  });
});
