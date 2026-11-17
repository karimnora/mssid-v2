import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthModal } from './AuthModal';
import { AuthService } from '../services/authService';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { PARENTAL_CONSENT_VERSION } from '../utils/parentalConsent';
import { Capacitor } from '@capacitor/core';

let googleCallback: (response: { credential: string }) => Promise<void>;
const user = { id: 7, nom: 'Parent', email: 'parent@example.test', role: 'ROLE_FREE' as const };
beforeEach(() => {
  localStorage.clear(); setStoredLocale('fr'); AuthService.setCurrentUser(null);
  Object.assign(window, { google: { accounts: { id: {
    initialize: vi.fn(options => { googleCallback = options.callback; }), renderButton: vi.fn(),
  } } } });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); delete (window as any).google; AuthService.setCurrentUser(null); setStoredLocale('ar'); });
const open = (initialMode: 'login' | 'register' = 'login') => {
  const success = vi.fn(), close = vi.fn();
  const view = render(<LocaleProvider><AuthModal isOpen initialMode={initialMode} onClose={close} onAuthSuccess={success} /></LocaleProvider>);
  return { ...view, success, close };
};

describe('explicit parental consent during account creation', () => {
  it('uses the supplied internal legal callbacks on native without accepting consent', () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
    const terms = vi.fn(), privacy = vi.fn();
    render(<LocaleProvider><AuthModal isOpen initialMode="register" onClose={vi.fn()} onAuthSuccess={vi.fn()} onOpenTermsOfService={terms} onOpenPrivacyPolicy={privacy} /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: "conditions d'utilisation" }));
    fireEvent.click(screen.getByRole('button', { name: 'politique de confidentialité' }));
    expect(terms).toHaveBeenCalledOnce();
    expect(privacy).toHaveBeenCalledOnce();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(document.querySelector('a[href="/terms.html"], a[href="/privacy.html"]')).toBeNull();
  });

  it('starts unchecked, blocks an unchecked submission and sends the accepted version', async () => {
    const register = vi.spyOn(AuthService, 'registerAsync').mockResolvedValue({ user });
    open('register');
    const checkbox = screen.getByRole('checkbox', { name: /Je confirme être/ });
    const form = checkbox.closest('form')!;
    const submit = form.querySelector('button[type="submit"]')!;
    expect(checkbox).not.toBeChecked();
    expect(submit).toBeDisabled();
    expect(screen.getByRole('link', { name: 'politique de confidentialité' })).toHaveAttribute('href', '/privacy.html');
    expect(screen.getByRole('link', { name: "conditions d'utilisation" })).toHaveAttribute('href', '/terms.html');
    fireEvent.submit(form);
    expect(register).not.toHaveBeenCalled();
    fireEvent.change(form.querySelector('input[autocomplete="name"]')!, { target: { value: 'Parent' } });
    fireEvent.change(screen.getByPlaceholderText('example@mssid.dz'), { target: { value: user.email } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(checkbox);
    expect(submit).toBeEnabled();
    fireEvent.submit(form);
    await waitFor(() => expect(register).toHaveBeenCalledWith('Parent', user.email, 'password123', undefined, undefined, undefined,
      { parentalConsentAccepted: true, parentalConsentVersion: PARENTAL_CONSENT_VERSION }));
  });

  it('asks after the Google account choice and authenticates only after explicit acceptance', async () => {
    const login = vi.spyOn(AuthService, 'loginWithGoogleAsync')
      .mockResolvedValueOnce({ user: null, consentRequired: true })
      .mockResolvedValueOnce({ user });
    const { success } = open();
    await waitFor(() => expect(googleCallback).toBeTypeOf('function'));
    await act(async () => googleCallback({ credential: 'google-token' }));
    expect(screen.getByRole('heading', { name: 'Une dernière étape pour le parent' })).toBeVisible();
    expect(success).not.toHaveBeenCalled();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Continuer', exact: true })).toBeDisabled();
    fireEvent.submit(checkbox.closest('form')!);
    expect(login).toHaveBeenCalledTimes(1);
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole('button', { name: 'Continuer', exact: true }));
    await waitFor(() => expect(success).toHaveBeenCalledWith(user));
    expect(login).toHaveBeenLastCalledWith('google-token', { parentalConsentAccepted: true, parentalConsentVersion: PARENTAL_CONSENT_VERSION });
  });

  it('cancels the Google consent step without authenticating or persisting the token', async () => {
    const login = vi.spyOn(AuthService, 'loginWithGoogleAsync').mockResolvedValue({ user: null, consentRequired: true });
    const { close, success } = open();
    await waitFor(() => expect(googleCallback).toBeTypeOf('function'));
    await act(async () => googleCallback({ credential: 'private-google-token' }));
    fireEvent.click(screen.getByRole('button', { name: 'Annuler', exact: true }));
    expect(close).toHaveBeenCalledTimes(1);
    expect(success).not.toHaveBeenCalled();
    expect(login).toHaveBeenCalledTimes(1);
    expect(Object.keys(localStorage).map(key => localStorage.getItem(key)).join('')).not.toContain('private-google-token');
  });
});
