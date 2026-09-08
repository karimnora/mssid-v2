import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UsersRolesModule } from './UsersRolesModule';
import { AuthService } from '../../services/authService';
import { PaymentReceipt, AuthUser } from '../../types/auth';

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
    vi.spyOn(window, 'confirm').mockReturnValue(true);
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

  it('never calls the backend when the admin declines the confirmation prompt', async () => {
    (window.confirm as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const verifySpy = vi.spyOn(AuthService, 'verifyReceiptAsync');
    await renderAndSelectReceipt();

    fireEvent.click(screen.getByRole('button', { name: /المصادقة وتفعيل اشتراك ROLE_PREMIUM/ }));

    expect(verifySpy).not.toHaveBeenCalled();
  });
});

const freeUser: AuthUser = {
  id: 7,
  nom: 'يونس',
  email: 'younes@mssid.dz',
  role: 'ROLE_FREE',
};

// Same bug class as receipts above (see the block up top): updateUserRoleAsync used to fall back
// to an unconditional local-only "success" whenever the edited row was the admin's own account,
// even if the backend call had failed. These regression tests target UsersRolesModule's role-change
// UI, which previously had zero coverage of its own despite sharing the exact same risk.
describe('UsersRolesModule — role change (regression: no false "success" on backend failure)', () => {
  beforeEach(() => {
    vi.spyOn(AuthService, 'getAllReceiptsAsync').mockResolvedValue([]);
    vi.spyOn(AuthService, 'getAllUsersAsync').mockResolvedValue([freeUser]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderUsersTab = async () => {
    render(<UsersRolesModule />);
    fireEvent.click(screen.getByRole('button', { name: /إدارة حسابات المستخدمين والصلاحيات/ }));
    await screen.findByText('يونس');
  };

  it('only shows the success message once the backend confirms the role change', async () => {
    const roleSpy = vi.spyOn(AuthService, 'updateUserRoleAsync').mockResolvedValue({ success: true });
    await renderUsersTab();

    fireEvent.change(screen.getByDisplayValue('👤 ROLE_FREE (تلميذ مجاني)'), { target: { value: 'ROLE_PREMIUM' } });

    await waitFor(() => {
      expect(roleSpy).toHaveBeenCalledWith(7, 'ROLE_PREMIUM');
      expect(screen.getByText('تم تعديل الدور بنجاح إلى ROLE_PREMIUM')).toBeInTheDocument();
    });
  });

  // The exact bug this fix targets: a failed backend call must never look like a success to the admin.
  it('shows an explicit error — never a false success — when the backend call fails', async () => {
    vi.spyOn(AuthService, 'updateUserRoleAsync').mockResolvedValue({
      success: false,
      message: 'Impossible de contacter le serveur. Veuillez réessayer plus tard.',
    });
    await renderUsersTab();

    fireEvent.change(screen.getByDisplayValue('👤 ROLE_FREE (تلميذ مجاني)'), { target: { value: 'ROLE_PREMIUM' } });

    await waitFor(() => {
      expect(screen.getByText('Impossible de contacter le serveur. Veuillez réessayer plus tard.')).toBeInTheDocument();
    });
    expect(screen.queryByText(/تم تعديل الدور بنجاح/)).not.toBeInTheDocument();
  });

  it('never calls the backend when the admin declines the confirmation prompt', async () => {
    (window.confirm as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const roleSpy = vi.spyOn(AuthService, 'updateUserRoleAsync');
    await renderUsersTab();

    fireEvent.change(screen.getByDisplayValue('👤 ROLE_FREE (تلميذ مجاني)'), { target: { value: 'ROLE_PREMIUM' } });

    expect(roleSpy).not.toHaveBeenCalled();
  });
});
