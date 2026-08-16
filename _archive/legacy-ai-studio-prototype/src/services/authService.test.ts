import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './authService';
import { AuthUser } from '../types/auth';

describe('AuthService - Authentication & RBAC Service Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
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
});
