import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UsersRolesModule } from './UsersRolesModule';
import { AuthService } from '../../services/authService';
import { PaymentReceipt } from '../../types/auth';

const pendingReceipt: PaymentReceipt = {
  id: 42,
  userId: 7,
  userEmail: 'younes@mssid.dz',
  userName: 'يونس',
  receiptImageUrl: 'https://example.com/receipt.jpg',
  paymentMethod: 'BARIDIMOB',
  amountDzd: 1500,
  transactionRef: 'BM-TEST-123456',
  status: 'PENDING_VERIFICATION',
  submittedAt: '2026-08-17 10:00',
};

describe('UsersRolesModule — receipt approval (regression: no false "approved" on backend failure)', () => {
  beforeEach(() => {
    vi.spyOn(AuthService, 'getAllReceiptsAsync').mockResolvedValue([pendingReceipt]);
    vi.spyOn(AuthService, 'getAllUsersAsync').mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderAndSelectReceipt = async () => {
    render(<UsersRolesModule />);
    const card = await screen.findByText('يونس');
    fireEvent.click(card);
    await screen.findByText(/تفاصيل معالجة وصل الدفع/);
  };

  it('only shows the success message once the backend confirms the approval', async () => {
    const verifySpy = vi.spyOn(AuthService, 'verifyReceiptAsync').mockResolvedValue({ success: true });
    await renderAndSelectReceipt();

    fireEvent.click(screen.getByRole('button', { name: /المصادقة وتفعيل اشتراك ROLE_PREMIUM/ }));

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith(42, true, undefined);
      expect(screen.getByText('تمت الموافقة على الوصل وترقية الحساب بنجاح.')).toBeInTheDocument();
    });
  });

  // The exact bug this fix targets: a failed backend call must never look like a success to the admin.
  it('shows an explicit error — never a false success — when the backend call fails', async () => {
    vi.spyOn(AuthService, 'verifyReceiptAsync').mockResolvedValue({
      success: false,
      message: 'Impossible de contacter le serveur. Veuillez réessayer plus tard.',
    });
    await renderAndSelectReceipt();

    fireEvent.click(screen.getByRole('button', { name: /المصادقة وتفعيل اشتراك ROLE_PREMIUM/ }));

    await waitFor(() => {
      expect(screen.getByText('Impossible de contacter le serveur. Veuillez réessayer plus tard.')).toBeInTheDocument();
    });
    expect(screen.queryByText('تمت الموافقة على الوصل وترقية الحساب بنجاح.')).not.toBeInTheDocument();
    // The receipt must still be selected/pending — the admin can see it wasn't actually processed.
    expect(screen.getByText(/تفاصيل معالجة وصل الدفع/)).toBeInTheDocument();
  });

  it('disables the approve button while the request is in flight, to prevent double submission', async () => {
    let resolveVerify: (value: { success: boolean }) => void;
    vi.spyOn(AuthService, 'verifyReceiptAsync').mockReturnValue(
      new Promise((resolve) => { resolveVerify = resolve; })
    );
    await renderAndSelectReceipt();

    const approveButton = screen.getByRole('button', { name: /المصادقة وتفعيل اشتراك ROLE_PREMIUM/ });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /جارٍ التسجيل على الخادم/ })).toBeDisabled();
    });

    resolveVerify!({ success: true });
  });
});
