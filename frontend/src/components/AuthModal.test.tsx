import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from './AuthModal';
import { AuthService } from '../services/authService';

describe('AuthModal Integration Tests', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('does not render when isOpen is false', () => {
    render(<AuthModal isOpen={false} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);
    expect(screen.queryByRole('heading', { name: 'تسجيل الدخول' })).not.toBeInTheDocument();
  });

  it('renders login form by default when isOpen is true', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'تسجيل الدخول' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@mssid.dz')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('switches between Login mode and Register mode when tabs are clicked', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);

    const registerTab = screen.getAllByRole('button', { name: /إنشاء حساب/i })[0];
    fireEvent.click(registerTab);

    // Full name input should appear in registration mode
    expect(screen.getByPlaceholderText('مثال: يونس الجزائري')).toBeInTheDocument();
  });

  it('shows a required grade selector only in registration mode, defaulting to no selection', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);

    // Login mode: no grade selector
    expect(screen.queryByText('المستوى الدراسي:')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /إنشاء حساب/i })[0]);

    const gradeSelect = screen.getByText('المستوى الدراسي:').closest('div')!.querySelector('select')!;
    expect(gradeSelect).toBeInTheDocument();
    expect(gradeSelect).toBeRequired();
    expect(gradeSelect).toHaveValue('');
  });

  it('sends the chosen grade to the backend on registration', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ nom: 'يونس', email: 'younes@mssid.dz', roleName: 'ROLE_FREE', user: { grade: '3AP' } }),
    });
    global.fetch = mockFetch;

    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);
    fireEvent.click(screen.getAllByRole('button', { name: /إنشاء حساب/i })[0]);

    fireEvent.change(screen.getByPlaceholderText('مثال: يونس الجزائري'), { target: { value: 'يونس' } });
    fireEvent.change(screen.getByPlaceholderText('example@mssid.dz'), { target: { value: 'younes@mssid.dz' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    const gradeSelect = screen.getByText('المستوى الدراسي:').closest('div')!.querySelector('select')!;
    fireEvent.change(gradeSelect, { target: { value: '3AP' } });

    const form = screen.getByPlaceholderText('example@mssid.dz').closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/auth/register'),
        expect.objectContaining({ body: expect.stringContaining('"grade":"3AP"') })
      );
    });
  });

  it('triggers onAuthSuccess and onClose upon submitting login credentials (Happy Path)', async () => {
    const handleAuthSuccess = vi.fn();
    const handleClose = vi.fn();

    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        nom: 'سارة المتفوقة',
        email: 'premium@mssid.dz',
        roleName: 'ROLE_PREMIUM',
        user: { email: 'premium@mssid.dz', role: 'ROLE_PREMIUM' },
      }),
    });
    global.fetch = mockFetch;

    render(<AuthModal isOpen={true} onClose={handleClose} onAuthSuccess={handleAuthSuccess} />);

    const emailInput = screen.getByPlaceholderText('example@mssid.dz');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const form = emailInput.closest('form')!;

    fireEvent.change(emailInput, { target: { value: 'premium@mssid.dz' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleAuthSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'premium@mssid.dz',
          role: 'ROLE_PREMIUM',
        })
      );
      expect(handleClose).toHaveBeenCalled();
    });
  });

});

describe('AuthModal password recovery flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a "forgot password?" link only in login mode', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);
    expect(screen.getByText('نسيت كلمة المرور؟')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /إنشاء حساب/i })[0]);
    expect(screen.queryByText('نسيت كلمة المرور؟')).not.toBeInTheDocument();
  });

  it('requests a reset code and advances to the code-entry step', async () => {
    const requestSpy = vi
      .spyOn(AuthService, 'requestPasswordReset')
      .mockResolvedValue({ success: true, message: 'إذا كان هذا البريد مسجلاً لدينا، فستصلك رسالة تحتوي على رمز.' });

    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);
    fireEvent.click(screen.getByText('نسيت كلمة المرور؟'));

    fireEvent.change(screen.getByPlaceholderText('example@mssid.dz'), { target: { value: 'younes@mssid.dz' } });
    fireEvent.click(screen.getByRole('button', { name: 'إرسال رمز إعادة التعيين' }));

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith('younes@mssid.dz');
      expect(screen.getByPlaceholderText('123456')).toBeInTheDocument();
    });
  });

  it('submits the code + new password and returns to the login form on success', async () => {
    vi.spyOn(AuthService, 'requestPasswordReset').mockResolvedValue({ success: true, message: 'ok' });
    const resetSpy = vi
      .spyOn(AuthService, 'resetPasswordWithCode')
      .mockResolvedValue({ success: true, message: 'تم تغيير كلمة المرور بنجاح.' });

    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);
    fireEvent.click(screen.getByText('نسيت كلمة المرور؟'));
    fireEvent.change(screen.getByPlaceholderText('example@mssid.dz'), { target: { value: 'younes@mssid.dz' } });
    fireEvent.click(screen.getByRole('button', { name: 'إرسال رمز إعادة التعيين' }));

    await screen.findByPlaceholderText('123456');
    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '654321' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'NewPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'تغيير كلمة المرور' }));

    await waitFor(() => {
      expect(resetSpy).toHaveBeenCalledWith('younes@mssid.dz', '654321', 'NewPass123!');
      // Back on the login form
      expect(screen.getByPlaceholderText('example@mssid.dz')).toBeInTheDocument();
      expect(screen.queryByPlaceholderText('123456')).not.toBeInTheDocument();
    });
  });

  it('shows an error and stays on the code-entry step when the code is wrong', async () => {
    vi.spyOn(AuthService, 'requestPasswordReset').mockResolvedValue({ success: true, message: 'ok' });
    vi.spyOn(AuthService, 'resetPasswordWithCode').mockResolvedValue({
      success: false,
      message: 'الرمز غير صحيح أو منتهي الصلاحية.',
    });

    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);
    fireEvent.click(screen.getByText('نسيت كلمة المرور؟'));
    fireEvent.change(screen.getByPlaceholderText('example@mssid.dz'), { target: { value: 'younes@mssid.dz' } });
    fireEvent.click(screen.getByRole('button', { name: 'إرسال رمز إعادة التعيين' }));

    await screen.findByPlaceholderText('123456');
    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '000000' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'NewPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'تغيير كلمة المرور' }));

    await waitFor(() => {
      expect(screen.getByText('الرمز غير صحيح أو منتهي الصلاحية.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('123456')).toBeInTheDocument();
    });
  });
});
