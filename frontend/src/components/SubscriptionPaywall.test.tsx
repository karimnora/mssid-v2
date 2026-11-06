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
class ImmediateFileReader {
  result = 'data:image/png;base64,AAA';
  onloadend: null | (() => void) = null;
  readAsDataURL() {
    queueMicrotask(() => this.onloadend?.());
  }
}

const attachReceipt = async () => {
  vi.stubGlobal('FileReader', ImmediateFileReader);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['receipt'], 'receipt.png', { type: 'image/png' });
  Object.defineProperty(input, 'files', { configurable: true, value: [file] });
  fireEvent.change(input);
  await waitFor(() => expect(screen.getByText('معاينة الوصل المرفق')).toBeInTheDocument());
};

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

  it('keeps the showcase and prices behind the actual parent challenge', () => {
    renderPaywall(<SubscriptionPaywall user={testUser} onClose={vi.fn()} onSuccessUpgrade={vi.fn()} />);
    expect(document.querySelector('[data-premium-showcase]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'أنا ولي الأمر' }));
    expect(document.querySelector('[data-premium-showcase]')).toBeNull();
    solveParentGate();
    expect(document.querySelector('[data-premium-showcase]')).toBeVisible();
    expect(document.querySelectorAll('[data-premium-showcase] img')).toHaveLength(5);
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
    solveParentGate();

    fireEvent.change(screen.getByPlaceholderText('مثال: BM-2026-987456123'), { target: { value: 'BM-2026-987456123' } });
    await attachReceipt();
    fireEvent.click(screen.getByRole('button', { name: /إرسال وصل الدفع/ }));
    solveParentGate();

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith(
        expect.objectContaining({ paymentMethod: 'BARIDIMOB', amountDzd: 2400, planId: 'P12M', transactionRef: 'BM-2026-987456123' })
      );
      expect(screen.getByText('تم إرسال وصل الدفع وهو بانتظار التحقق اليدوي')).toBeInTheDocument();
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
    solveParentGate();

    fireEvent.change(screen.getByPlaceholderText('مثال: BM-2026-987456123'), { target: { value: 'BM-2026-987456123' } });
    await attachReceipt();
    fireEvent.click(screen.getByRole('button', { name: /إرسال وصل الدفع/ }));
    solveParentGate();

    await waitFor(() => {
      expect(screen.getByText("Le montant indiqué (1 DZD) ne correspond pas au tarif de l'abonnement (1500 DZD).")).toBeInTheDocument();
    });
    expect(screen.queryByText('تم إرسال وصل الدفع وهو بانتظار التحقق اليدوي')).not.toBeInTheDocument();
  });

  it('displays the subscription price from the shared constant, not a separate hardcoded value', () => {
    renderPaywall(<SubscriptionPaywall user={testUser} onClose={vi.fn()} onSuccessUpgrade={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'أنا ولي الأمر' }));
    solveParentGate();
    expect(screen.getByText(/السعر: 2400 دج/)).toBeInTheDocument();
  });
  it.each([[3, 900, 'P3M'], [12, 2400, 'P12M']] as const)('sends the selected %s month plan and its canonical price', async (months, price, planId) => {
    const submitSpy = vi.spyOn(AuthService, 'submitReceiptAsync').mockResolvedValue({ success: false, message: 'test stopped after upload' });
    renderPaywall(<SubscriptionPaywall parentVerified user={testUser} onClose={vi.fn()} onSuccessUpgrade={vi.fn()} />);
    fireEvent.click(screen.getByRole('radio', { name: new RegExp(`^${months} أشهر`) }));
    fireEvent.change(screen.getByPlaceholderText('مثال: BM-2026-987456123'), { target: { value: 'BM-plan-test' } });
    await attachReceipt();
    fireEvent.click(screen.getByRole('button', { name: /إرسال وصل الدفع/ })); solveParentGate();
    await waitFor(() => expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({ amountDzd: price, planId })));
  });

});
