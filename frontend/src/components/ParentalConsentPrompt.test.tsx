import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ParentalConsentPrompt, ParentalConsentNotice } from './ParentalConsentPrompt';
import { AuthService } from '../services/authService';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { PARENTAL_CONSENT_VERSION } from '../utils/parentalConsent';
import { Capacitor } from '@capacitor/core';

const session = vi.hoisted(() => ({ authUser: null as any }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => session }));
vi.mock('./ParentGateModal', () => ({ ParentGateModal: ({ onVerified, onClose }: any) => <section>
  <button onClick={onVerified}>Vérifier le parent</button><button onClick={onClose}>Fermer la protection</button>
</section> }));
beforeEach(() => {
  setStoredLocale('fr');
  session.authUser = { id: 7, nom: 'Parent', role: 'ROLE_FREE', parentalConsentRequired: true };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); setStoredLocale('ar'); session.authUser = null; });
const UI = () => <LocaleProvider><p>Leçons disponibles</p><ParentalConsentPrompt /><ParentalConsentNotice /></LocaleProvider>;
const open = () => render(<UI />);

describe('parental consent for existing accounts', () => {
  it('opens native legal windows above the existing consent prompt without checking or saving consent', () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
    const accept = vi.spyOn(AuthService, 'acceptParentalConsent');
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier le parent' }));
    fireEvent.click(screen.getByRole('button', { name: "conditions d'utilisation" }));
    expect(document.querySelector('[data-consent-legal-dialog]')).toHaveClass('z-[210]');
    expect(document.querySelector('[data-native-subscription-terms]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/terms.html"]')).toBeNull();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(accept).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'فهمت وإغلاق' }));
    expect(document.querySelector('[data-consent-legal-dialog]')).toBeNull();
    expect(screen.getByRole('button', { name: "J'accepte" })).toBeDisabled();
  });

  it('requires the parent gate, starts unchecked and allows postponing while learning remains available', () => {
    const accept = vi.spyOn(AuthService, 'acceptParentalConsent');
    open();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier le parent' }));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('button', { name: "J'accepte" })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Plus tard' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Leçons disponibles')).toBeVisible();
    expect(screen.getByText(/Les nouveaux progrès ne sont pas enregistrés/)).toBeVisible();
    expect(accept).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Donner mon accord' }));
    expect(screen.getByRole('button', { name: 'Vérifier le parent' })).toBeVisible();
  });

  it('saves only a checked decision and closes after the server confirms the current version', async () => {
    const accept = vi.spyOn(AuthService, 'acceptParentalConsent').mockImplementation(async () => {
      session.authUser = { ...session.authUser, parentalConsentRequired: false, parentalConsentAt: '2026-11-16T10:00:00Z', parentalConsentVersion: PARENTAL_CONSENT_VERSION };
      return { success: true };
    });
    const view = open();
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier le parent' }));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: "J'accepte" }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(accept).toHaveBeenCalledTimes(1);
    // The mock context has no subscription; emulate the real AuthProvider notification.
    view.rerender(<UI />);
    expect(screen.queryByText(/Les nouveaux progrès ne sont pas enregistrés/)).not.toBeInTheDocument();
  });

  it('does not treat a failed server save as consent', async () => {
    vi.spyOn(AuthService, 'acceptParentalConsent').mockResolvedValue({ success: false });
    open();
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier le parent' }));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: "J'accepte" }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/n'a pas pu être enregistré/);
    expect(screen.getByRole('dialog')).toBeVisible();
  });
});
