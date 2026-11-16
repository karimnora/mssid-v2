import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { DidouVirtualCompanion } from './DidouVirtualCompanion';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { DIDOU_POSES } from './world/worldArt';

vi.mock('../utils/speech', () => ({ speakText: vi.fn().mockResolvedValue(undefined), stopSpeech: vi.fn() }));
afterEach(() => setStoredLocale('ar'));

describe('companion card after the V1 merge', () => {
  it('uses the world portrait and keeps petting and feeding available', async () => {
    setStoredLocale('fr');
    const onPat = vi.fn();
    const onFeed = vi.fn();
    const { container } = render(<LocaleProvider><DidouVirtualCompanion onPat={onPat} onFeed={onFeed} /></LocaleProvider>);
    expect(container.querySelector('[data-companion-card]')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Didou' }).querySelector('image')).toHaveAttribute('href', DIDOU_POSES.talk.src);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Faire un câlin à Didou' })));
    expect(onPat).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('img', { name: 'Didou' }).querySelector('image')).toHaveAttribute('href', DIDOU_POSES.cheer.src);
    fireEvent.click(screen.getByRole('button', { name: 'Nourrir' }));
    fireEvent.click(container.querySelector('[data-home-treat="deglet_nour"]')!);
    expect(onFeed).toHaveBeenCalledWith('deglet_nour', expect.any(Number), expect.any(Number), 15);
  });

  it.each([
    { species: 'fennec' as const, activeOutfit: 'cheche_sahara' as const },
    { species: 'eagle' as const, activeOutfit: 'default' as const },
  ])('retains the equipped appearance: $species / $activeOutfit', config => {
    const { container } = render(<LocaleProvider><DidouVirtualCompanion level={4}
      avatarConfig={{ ...config, unlockedOutfits: ['default', config.activeOutfit] }} /></LocaleProvider>);
    expect(container.querySelector('[data-didou-portrait]')).toBeNull();
    expect(container.querySelector('[data-didou-stage="2"] svg')).toBeTruthy();
  });
});
