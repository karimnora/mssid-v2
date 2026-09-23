import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthModal } from './AuthModal';
import { AuthService } from '../services/authService';
import { LocaleProvider } from '../context/LocaleContext';

const native = vi.hoisted(() => {
  return { initialize: vi.fn(), signIn: vi.fn() };
});

vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));
vi.mock('@capawesome/capacitor-google-sign-in', () => ({
  GoogleSignIn: native,
  ErrorCode: { SignInCanceled: 'SIGN_IN_CANCELED', NoCredentialAvailable: 'NO_CREDENTIAL_AVAILABLE' },
}));

function openAuth() {
  const onAuthSuccess = vi.fn();
  const onClose = vi.fn();
  render(<LocaleProvider><AuthModal isOpen onClose={onClose} onAuthSuccess={onAuthSuccess} /></LocaleProvider>);
  return { onAuthSuccess, onClose };
}

const googleButton = () => screen.getByRole('button', { name: /Google/ });

describe('Google sign-in on Android', () => {
  beforeEach(() => {
    localStorage.clear();
    native.initialize.mockReset().mockResolvedValue(undefined);
    native.signIn.mockReset().mockResolvedValue({ idToken: 'google-id-token' });
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  it('keeps the button visible after initialization fails and allows a retry', async () => {
    native.initialize.mockRejectedValueOnce(new Error('Plugin initialization failed'));
    native.signIn.mockRejectedValue({ code: 'SIGN_IN_CANCELED' });
    const login = vi.spyOn(AuthService, 'loginWithGoogleAsync');
    openAuth();
    expect(googleButton()).toBeEnabled();
    fireEvent.click(googleButton());
    expect(await screen.findByText('تعذرت المصادقة عبر Google. يرجى المحاولة لاحقاً.')).toBeInTheDocument();
    expect(googleButton()).toBeEnabled();
    expect(native.signIn).not.toHaveBeenCalled();
    fireEvent.click(googleButton());
    await waitFor(() => expect(googleButton()).toBeEnabled());
    expect(native.initialize).toHaveBeenCalledTimes(2);
    expect(native.signIn).toHaveBeenCalledTimes(1);
    expect(login).not.toHaveBeenCalled();
  });

  it('prevents duplicate requests while the native account picker is open', async () => {
    let rejectSignIn!: (error: unknown) => void;
    native.signIn.mockReturnValue(new Promise((_, reject) => { rejectSignIn = reject; }));
    openAuth();
    const pendingButton = googleButton();
    fireEvent.click(pendingButton);
    await waitFor(() => expect(native.signIn).toHaveBeenCalledTimes(1));
    expect(pendingButton).toBeDisabled();
    fireEvent.click(pendingButton);
    expect(native.signIn).toHaveBeenCalledTimes(1);
    rejectSignIn({ code: 'SIGN_IN_CANCELED' });
    await waitFor(() => expect(googleButton()).toBeEnabled());
    expect(screen.queryByText('تعذرت المصادقة عبر Google. يرجى المحاولة لاحقاً.')).not.toBeInTheDocument();
  });

  it('passes the native ID token to the backend before authenticating the user', async () => {
    const user = { id: 1, nom: 'Test', email: 'test@example.com', role: 'ROLE_FREE' as const };
    const login = vi.spyOn(AuthService, 'loginWithGoogleAsync').mockResolvedValue({ user });
    const { onAuthSuccess, onClose } = openAuth();
    fireEvent.click(googleButton());
    await waitFor(() => expect(onAuthSuccess).toHaveBeenCalledWith(user));
    expect(native.initialize).toHaveBeenCalledWith({ clientId: 'test-web-client.apps.googleusercontent.com' });
    expect(login).toHaveBeenCalledWith('google-id-token');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
