import React from 'react';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AndroidUpdateBanner } from './AndroidUpdateBanner';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { springBootApi } from '../services/springBootApi';
import { PLAY_STORE_URL } from '../utils/appPlatform';

const capacitor = vi.hoisted(() => ({ isNativePlatform: vi.fn(() => false), getPlatform: vi.fn(() => 'web') }));
vi.mock('@capacitor/core', () => ({ Capacitor: capacitor }));

const show = () => render(<LocaleProvider><AndroidUpdateBanner /></LocaleProvider>);
const waitForCheck = async () => { await act(async () => { await vi.advanceTimersByTimeAsync(4000); }); };

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  setStoredLocale('fr');
  capacitor.isNativePlatform.mockReturnValue(true);
  capacitor.getPlatform.mockReturnValue('android');
  vi.spyOn(springBootApi, 'getAndroidRelease').mockResolvedValue({
    data: { latestVersionCode: 9, minVersionCode: 0 },
    status: 200,
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  setStoredLocale('ar');
});

describe('AndroidUpdateBanner', () => {
  it('stays off on the website', async () => {
    capacitor.isNativePlatform.mockReturnValue(false);
    show();
    await waitForCheck();
    expect(springBootApi.getAndroidRelease).not.toHaveBeenCalled();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('offers a skippable Play update when the server is ahead', async () => {
    show();
    await waitForCheck();
    expect(screen.getByRole('complementary')).toHaveAttribute('data-android-update', 'optional');
    fireEvent.click(screen.getByRole('button', { name: 'Plus tard' }));
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('respects a seven-day cooldown after dismiss', async () => {
    localStorage.setItem('mssid_android_update_dismissed_time', String(Date.now()));
    show();
    await waitForCheck();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });

  it('cannot be dismissed when minVersionCode is above the installed build', async () => {
    vi.mocked(springBootApi.getAndroidRelease).mockResolvedValue({
      data: { latestVersionCode: 10, minVersionCode: 9 },
      status: 200,
    });
    show();
    await waitForCheck();
    expect(screen.getByRole('complementary')).toHaveAttribute('data-android-update', 'required');
    expect(screen.queryByRole('button', { name: 'Plus tard' })).not.toBeInTheDocument();
  });

  it('opens Google Play through the parent gate', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    show();
    await waitForCheck();
    fireEvent.click(screen.getByRole('button', { name: 'Mettre à jour sur Google Play' }));
    const dialog = screen.getByRole('dialog');
    const numbers = within(dialog).getByText(/\d+ \+ \d+ = \?/).textContent!.match(/\d+/g)!.map(Number);
    fireEvent.change(within(dialog).getByRole('spinbutton'), { target: { value: String(numbers[0] + numbers[1]) } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Continuer' }));
    expect(open).toHaveBeenCalledWith(PLAY_STORE_URL, '_self', 'noopener,noreferrer');
  });

  it('stays quiet when the installed build already matches Play', async () => {
    vi.mocked(springBootApi.getAndroidRelease).mockResolvedValue({
      data: { latestVersionCode: 8, minVersionCode: 0 },
      status: 200,
    });
    show();
    await waitForCheck();
    expect(springBootApi.getAndroidRelease).toHaveBeenCalled();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
});
