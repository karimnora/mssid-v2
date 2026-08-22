import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailVerificationPopup } from './EmailVerificationPopup';
import { AuthService } from '../services/authService';
import { LocaleProvider } from '../context/LocaleContext';

const renderPopup = (ui: React.ReactElement) => render(<LocaleProvider>{ui}</LocaleProvider>);

describe('EmailVerificationPopup — dismissible post-login nudge', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = renderPopup(
      <EmailVerificationPopup isOpen={false} onClose={vi.fn()} email="younes@mssid.dz" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the target email and a code input when open', () => {
    renderPopup(<EmailVerificationPopup isOpen={true} onClose={vi.fn()} email="younes@mssid.dz" />);
    expect(screen.getByText('younes@mssid.dz')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('123456')).toBeInTheDocument();
  });

  it('can be dismissed via the ✕ button — it never blocks the user', () => {
    const onClose = vi.fn();
    renderPopup(<EmailVerificationPopup isOpen={true} onClose={onClose} email="younes@mssid.dz" />);
    fireEvent.click(screen.getByLabelText('إغلاق'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('can be dismissed via the "ليس الآن" (not now) link', () => {
    const onClose = vi.fn();
    renderPopup(<EmailVerificationPopup isOpen={true} onClose={onClose} email="younes@mssid.dz" />);
    fireEvent.click(screen.getByText('ليس الآن'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('can be dismissed by clicking the backdrop', () => {
    const onClose = vi.fn();
    const { container } = renderPopup(<EmailVerificationPopup isOpen={true} onClose={onClose} email="younes@mssid.dz" />);
    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking inside the card does not dismiss it', () => {
    const onClose = vi.fn();
    renderPopup(<EmailVerificationPopup isOpen={true} onClose={onClose} email="younes@mssid.dz" />);
    fireEvent.click(screen.getByPlaceholderText('123456'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('submits the 6-digit code and shows the success message on a correct code', async () => {
    vi.spyOn(AuthService, 'verifyEmailCode').mockResolvedValue({ success: true, message: 'تم تأكيد بريدك بنجاح!' });
    renderPopup(<EmailVerificationPopup isOpen={true} onClose={vi.fn()} email="younes@mssid.dz" />);

    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'تأكيد' }));

    await waitFor(() => {
      expect(screen.getByText('تم تأكيد بريدك بنجاح!')).toBeInTheDocument();
    });
  });

  it('auto-closes itself shortly after a successful verification', async () => {
    vi.spyOn(AuthService, 'verifyEmailCode').mockResolvedValue({ success: true });
    const onClose = vi.fn();
    renderPopup(<EmailVerificationPopup isOpen={true} onClose={onClose} email="younes@mssid.dz" />);

    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'تأكيد' }));

    await waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 3000 });
  });

  it('shows an error message and does not close on a wrong code', async () => {
    vi.spyOn(AuthService, 'verifyEmailCode').mockResolvedValue({ success: false, message: 'رمز غير صحيح.' });
    const onClose = vi.fn();
    renderPopup(<EmailVerificationPopup isOpen={true} onClose={onClose} email="younes@mssid.dz" />);

    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: 'تأكيد' }));

    await waitFor(() => {
      expect(screen.getByText('رمز غير صحيح.')).toBeInTheDocument();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('resend button starts a 60s cooldown and calls the resend endpoint', async () => {
    vi.spyOn(AuthService, 'resendVerificationCode').mockResolvedValue({ success: true, message: 'تم إرسال رمز جديد.' });
    renderPopup(<EmailVerificationPopup isOpen={true} onClose={vi.fn()} email="younes@mssid.dz" />);

    fireEvent.click(screen.getByText('لم يصلك الرمز؟ إعادة الإرسال'));

    await waitFor(() => {
      expect(screen.getByText('تم إرسال رمز جديد.')).toBeInTheDocument();
    });
    expect(screen.getByText(/إعادة الإرسال بعد 60 ثانية/)).toBeInTheDocument();
  });
});
