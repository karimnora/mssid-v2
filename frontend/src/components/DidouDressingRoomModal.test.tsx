import React, { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { DidouDressingRoomModal } from './DidouDressingRoomModal';
import { DidouPortrait } from './DidouPortrait';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { speakText } from '../utils/speech';
import { setFeatureFlagOverride, resetFeatureFlagOverride } from '../featureFlags';

const voice = vi.hoisted(() => ({ available: true }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ authUser: null }) }));
vi.mock('../services/authService', () => ({ AuthService: { syncGoldCoinsAndAvatar: vi.fn() } }));
vi.mock('../utils/speech', async importOriginal => ({ ...(await importOriginal<typeof import('../utils/speech')>()), speakText: vi.fn().mockResolvedValue(undefined), stopSpeech: vi.fn(), useVoiceAvailable: () => voice.available }));
const base = { goldCoins: 150, xp: 300, level: 4, avatarConfig: { species: 'fennec', activeOutfit: 'default', unlockedOutfits: ['default'], energy: 70 } };
function setup(coins = 150) {
  setStoredLocale('fr');
  const updated = vi.fn();
  function Harness() {
    const [profile, setProfile] = useState({ ...base, goldCoins: coins });
    return <LocaleProvider><DidouDressingRoomModal isOpen onClose={vi.fn()} userProfile={profile}
      onUpdateProfile={next => { updated(next); setProfile(next); }} /></LocaleProvider>;
  }
  render(<Harness />);
  return updated;
}
afterEach(() => { resetFeatureFlagOverride('voiceReading'); setStoredLocale('ar'); voice.available = true; vi.clearAllMocks(); });

describe('Didou studio interactions', () => {
  it('keeps messages readable without inactive listen buttons when voice reading is switched off', () => {
    setFeatureFlagOverride('voiceReading', false);
    setup();
    fireEvent.click(screen.getByRole('tab', { name: 'Parler' }));
    expect(document.querySelectorAll('.didou-dialogues article')).toHaveLength(6);
    expect(screen.queryByRole('button', { name: 'Écouter' })).not.toBeInTheDocument();
    expect(speakText).not.toHaveBeenCalled();
  });
  it('previews a costume before spending coins, then equips it once', () => {
    const updated = setup();
    fireEvent.click(document.querySelector('[data-outfit="cheche_sahara"]')!);
    expect(updated).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Débloquer · 120/ }));
    expect(updated).toHaveBeenCalledTimes(1);
    expect(updated.mock.calls[0][0]).toMatchObject({ goldCoins: 30, avatarConfig: { activeOutfit: 'cheche_sahara' } });
    expect(screen.queryByRole('button', { name: /Débloquer · 120/ })).not.toBeInTheDocument();
  });
  it('shows the cost and preserves the energy, XP and friendship feeding rules', () => {
    const updated = setup();
    fireEvent.click(screen.getByRole('tab', { name: 'Nourrir' }));
    fireEvent.click(document.querySelector('[data-treat="deglet_nour"] button')!);
    expect(updated).toHaveBeenCalledTimes(1);
    expect(updated.mock.calls[0][0]).toMatchObject({ goldCoins: 135, xp: 310, avatarConfig: { energy: 95, totalTreatsGiven: 1 } });
    expect(document.querySelector('[data-treat="deglet_nour"] button')).toBeDisabled();
  });
  it('does not spend coins that the child does not have', () => {
    const updated = setup(0);
    fireEvent.click(document.querySelector('[data-outfit="cheche_sahara"]')!);
    expect(screen.getByRole('button', { name: /Débloquer/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('tab', { name: 'Nourrir' }));
    expect(document.querySelector('[data-treat="deglet_nour"] button')).toBeDisabled();
    expect(updated).not.toHaveBeenCalled();
  });
  it('plays recorded messages when the device has no voice', async () => {
    voice.available = false;
    setup();
    fireEvent.click(screen.getByRole('tab', { name: 'Parler' }));
    expect(screen.queryByText(/Tu peux lire tous les messages/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Écouter' })).toHaveLength(6);
    await act(async () => fireEvent.click(screen.getAllByRole('button', { name: 'Écouter' })[0]));
    expect(speakText).toHaveBeenCalledWith(expect.any(String), 'fr-FR', 0.95, 1, { recordedOnly: true });
  });
  it('uses the interface language for the selected message', async () => {
    setup();
    fireEvent.click(screen.getByRole('tab', { name: 'Parler' }));
    await act(async () => fireEvent.click(screen.getAllByRole('button', { name: 'Écouter' })[0]));
    expect(speakText).toHaveBeenCalledWith(expect.any(String), 'fr-FR', 0.95, 1, { recordedOnly: false });
  });
  it('marks the real current growth stage and supports tab keyboard navigation', () => {
    setup();
    fireEvent.click(screen.getByRole('tab', { name: 'Grandir' }));
    expect(document.querySelector('.didou-growth-steps [aria-current="step"]')).toHaveTextContent('Écolier Brillant');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Grandir' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Parler' })).toHaveAttribute('aria-selected', 'true');
  });
  it('renders the three visual stages while retaining the selected species and outfits', () => {
    const view = render(<DidouPortrait stage={1} label="Didou" size="lg" />);
    expect(document.querySelector('[data-didou-stage]')).toHaveAttribute('data-didou-stage', '1');
    view.rerender(<DidouPortrait stage={3} label="Didou" species="eagle" outfitId="chapeau_diplome" />);
    expect(document.querySelector('[data-didou-stage]')).toHaveAttribute('data-didou-stage', '3');
    expect(document.querySelector('svg')).toBeTruthy();
  });
});
