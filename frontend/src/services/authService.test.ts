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

  describe('Happy Path - User Retrieval & Login', () => {
    it('returns null when local storage is empty', () => {
      const user = AuthService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('logs in pre-defined demo accounts successfully', () => {
      const premiumUser = AuthService.login('premium@mssid.dz', '123456');
      expect(premiumUser.role).toBe('ROLE_PREMIUM');
      expect(premiumUser.subscription?.status).toBe('ACTIVE');

      const currentUser = AuthService.getCurrentUser();
      expect(currentUser?.email).toBe('premium@mssid.dz');
    });

    it('dynamically creates a new free account for non-demo email on login', () => {
      const newEmail = 'student2026@mssid.dz';
      const user = AuthService.login(newEmail, 'secretpass');

      expect(user.email).toBe(newEmail);
      expect(user.role).toBe('ROLE_FREE');
      expect(user.nom).toBe('student2026');
      expect(user.token).toBeDefined();
    });

    it('registers a new user with custom name and persists token', () => {
      const user = AuthService.register('أمينة الجزائرية', 'amina@mssid.dz', 'password123');

      expect(user.nom).toBe('أمينة الجزائرية');
      expect(user.email).toBe('amina@mssid.dz');
      expect(user.role).toBe('ROLE_FREE');

      const savedUser = AuthService.getCurrentUser();
      expect(savedUser?.nom).toBe('أمينة الجزائرية');
    });

    it('switches demo roles seamlessly for RBAC testing', () => {
      const admin = AuthService.switchDemoRole('ROLE_ADMIN');
      expect(admin.role).toBe('ROLE_ADMIN');
      expect(admin.email).toBe('admin@mssid.dz');

      const current = AuthService.getCurrentUser();
      expect(current?.role).toBe('ROLE_ADMIN');
    });

    it('clears session on logout', () => {
      AuthService.login('admin@mssid.dz', '123456');
      expect(AuthService.getCurrentUser()?.role).toBe('ROLE_ADMIN');

      AuthService.logout();
      // After logout, getCurrentUser defaults back to free user or null when explicitly cleared
      expect(localStorage.getItem('mssid_auth_user')).toBeNull();
    });
  });

  describe('Payment Receipts & Verification Logic', () => {
    it('initializes default payment receipts when empty', () => {
      const receipts = AuthService.getReceipts();
      expect(receipts.length).toBeGreaterThan(0);
      expect(receipts[0].userEmail).toBe('free@mssid.dz');
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

      AuthService.login('free@mssid.dz', '123456');
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
});
