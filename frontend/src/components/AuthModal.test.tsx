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
