import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SubscriptionPaywall } from './SubscriptionPaywall';
import { AuthService } from '../services/authService';
import { AuthUser } from '../types/auth';
import { LocaleProvider } from '../context/LocaleContext';

const renderPaywall = (ui: React.ReactElement) => render(<LocaleProvider>{ui}</LocaleProvider>);

const testUser: AuthUser = {
  id: 7,
  nom: 'يونس',
  email: 'younes@mssid.dz',
  role: 'ROLE_FREE',
};

// Submitting the receipt form now opens a Parent Gate (see ParentGateModal.tsx) before the actual
// AuthService call — solve it the same way a real parent would, reading the two numbers shown.
const solveParentGate = () => {
  const prompt = screen.getByText(/^\d+ \+ \d+ = \?$/);
  const [a, b] = prompt.textContent!.match(/\d+/g)!.map(Number);
  fireEvent.change(screen.getByPlaceholderText('اكتب الناتج هنا'), { target: { value: String(a + b) } });
  fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
};

describe('SubscriptionPaywall — receipt submission (regression: no false "pending" on backend rejection)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the pending-review state only once the backend confirms the submission', async () => {
    const submitSpy = vi.spyOn(AuthService, 'submitReceiptAsync').mockResolvedValue({
      success: true,
      receipt: {
        id: 99,
        userId: 7,
        userName: 'يونس',
        userEmail: 'younes@mssid.dz',
        paymentMethod: 'BARIDIMOB',
        amountDzd: 1500,
        transactionRef: 'BM-2026-987456123',
        receiptImageUrl: 'https://example.com/receipt.jpg',
        status: 'PENDING_VERIFICATION',
        submittedAt: '2026-08-17 12:00',
      },
    });

    renderPaywall(<SubscriptionPaywall user={testUser} onClose={vi.fn()} onSuccessUpgrade={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'أنا ولي الأمر' }));

    fireEvent.change(screen.getByPlaceholderText('مثال: BM-2026-987456123'), { target: { value: 'BM-2026-987456123' } });
    fireEvent.click(screen.getByRole('button', { name: /إرسال وصل الدفع وبدء التفعيل/ }));
    solveParentGate();

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith(
        expect.objectContaining({ paymentMethod: 'BARIDIMOB', amountDzd: 1500, transactionRef: 'BM-2026-987456123' })
      );
      expect(screen.getByText('تم إرسال وصل الدفع بنجاح وهو قيد التحقق الإداري')).toBeInTheDocument();
    });
  });

  // The exact bug this fix targets: the old flow wrote "pending" to localStorage before the backend
  // call even resolved, so a server-side rejection (e.g. the new amount-validation check) was
  // invisible to the student — they'd see a fake pending-review screen for nothing.
  it('shows an explicit error — never the pending-review screen — when the backend rejects the submission', async () => {
    vi.spyOn(AuthService, 'submitReceiptAsync').mockResolvedValue({
      success: false,
      message: "Le montant indiqué (1 DZD) ne correspond pas au tarif de l'abonnement (1500 DZD).",
    });

    renderPaywall(<SubscriptionPaywall user={testUser} onClose={vi.fn()} onSuccessUpgrade={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'أنا ولي الأمر' }));

    fireEvent.change(screen.getByPlaceholderText('مثال: BM-2026-987456123'), { target: { value: 'BM-2026-987456123' } });
    fireEvent.click(screen.getByRole('button', { name: /إرسال وصل الدفع وبدء التفعيل/ }));
    solveParentGate();

    await waitFor(() => {
      expect(screen.getByText("Le montant indiqué (1 DZD) ne correspond pas au tarif de l'abonnement (1500 DZD).")).toBeInTheDocument();
    });
    expect(screen.queryByText('تم إرسال وصل الدفع بنجاح وهو قيد التحقق الإداري')).not.toBeInTheDocument();
  });

  it('displays the subscription price from the shared constant, not a separate hardcoded value', () => {
    renderPaywall(<SubscriptionPaywall user={testUser} onClose={vi.fn()} onSuccessUpgrade={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'أنا ولي الأمر' }));
    expect(screen.getByText(/السعر: 1500 دج/)).toBeInTheDocument();
  });
});
