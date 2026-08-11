import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from './AuthModal';
import { AuthService } from '../services/authService';

describe('AuthModal Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('does not render when isOpen is false', () => {
    render(<AuthModal isOpen={false} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);
    expect(screen.queryByText('تسجيل الدخول إلى تطبيق mssid dz')).not.toBeInTheDocument();
  });

  it('renders login form by default when isOpen is true', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} onAuthSuccess={vi.fn()} />);

    expect(screen.getByText('تسجيل الدخول إلى تطبيق mssid dz')).toBeInTheDocument();
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

  it('triggers onAuthSuccess and onClose upon submitting login credentials (Happy Path)', async () => {
    const handleAuthSuccess = vi.fn();
    const handleClose = vi.fn();

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
