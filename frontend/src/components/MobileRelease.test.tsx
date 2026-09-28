import React from 'react';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { PwaInstallBanner } from './PwaInstallBanner';
import { AppRatingPrompt } from './AppRatingPrompt';
import { OfflinePacksManagerModal } from './OfflinePacksManagerModal';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { getAppPlatform, PLAY_STORE_URL } from '../utils/appPlatform';

const capacitor = vi.hoisted(() => ({ isNativePlatform: vi.fn(() => false), getPlatform: vi.fn(() => 'web') }));
vi.mock('@capacitor/core', () => ({ Capacitor: capacitor }));
const show = (ui: React.ReactNode) => render(<LocaleProvider>{ui}</LocaleProvider>);
const waitForPrompt = async () => { await act(async () => { await vi.advanceTimersByTimeAsync(4000); }); };
function device(userAgent: string, touches = 0) {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent);
  Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, value: touches });
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  setStoredLocale('fr');
  capacitor.isNativePlatform.mockReturnValue(false);
  capacitor.getPlatform.mockReturnValue('web');
  vi.mocked(window.matchMedia).mockReturnValue({ matches: false } as MediaQueryList);
  device('Desktop browser');
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); setStoredLocale('ar'); });

describe('Platform-specific installation', () => {
  it('links Android browsers to Google Play without waiting for a PWA event', async () => {
    device('Mozilla/5.0 Android');
    show(<PwaInstallBanner />);
    await waitForPrompt();
    expect(screen.getByRole('link', { name: /Google Play/ })).toHaveAttribute('href', PLAY_STORE_URL);
  });
  it.each(['iPhone', 'Macintosh'])('shows Safari home-screen guidance on %s without a PWA event', async (ua) => {
    device(ua, 5);
    show(<PwaInstallBanner />);
    await waitForPrompt();
    fireEvent.click(screen.getByRole('button', { name: /Ajouter/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Safari');
    expect(screen.queryByRole('link', { name: /Google Play/ })).not.toBeInTheDocument();
  });
  it('never offers installation in the native Android app', async () => {
    capacitor.isNativePlatform.mockReturnValue(true);
    capacitor.getPlatform.mockReturnValue('android');
    show(<PwaInstallBanner />);
    await waitForPrompt();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
  it('hides the banner in an installed web app', async () => {
    device('iPhone');
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    show(<PwaInstallBanner />);
    await waitForPrompt();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
  it('respects dismissal across remounts', async () => {
    device('Android');
    const first = show(<PwaInstallBanner />);
    await waitForPrompt();
    fireEvent.click(screen.getByRole('button', { name: 'Plus tard' }));
    first.unmount();
    show(<PwaInstallBanner />);
    await waitForPrompt();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
  it('preserves desktop installation and does not claim success on acceptance', async () => {
    show(<PwaInstallBanner />);
    const event = new Event('beforeinstallprompt', { cancelable: true });
    const prompt = vi.fn().mockResolvedValue(undefined);
    Object.assign(event, { prompt, userChoice: Promise.resolve({ outcome: 'accepted' }) });
    act(() => window.dispatchEvent(event));
    await waitForPrompt();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /Installer/ })));
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/succès/)).not.toBeInTheDocument();
  });
  it('uses Arabic labels when Arabic is selected', async () => {
    setStoredLocale('ar'); device('Android'); show(<PwaInstallBanner />); await waitForPrompt();
    expect(screen.getByRole('link', { name: 'التحميل من Google Play' })).toHaveAttribute('href', PLAY_STORE_URL);
  });
  it('stacks the Arabic install title instead of squeezing it beside the CTA', async () => {
    setStoredLocale('ar'); device('Android'); show(<PwaInstallBanner />); await waitForPrompt();
    const banner = screen.getByRole('complementary');
    expect(banner.className).toContain('overflow-x-clip');
    expect(banner.querySelector('.break-words')).toBeTruthy();
    expect(banner.querySelector('.flex-col')).toBeTruthy();
    expect(screen.getByText('ثبّت مَسيد على هاتفك')).toBeInTheDocument();
  });
});

describe('Reviews and feedback', () => {
  it('keeps iOS feedback inside the contact flow', async () => {
    device('iPhone'); const contact = vi.fn();
    show(<AppRatingPrompt trigger={1} onOpenContact={contact} />); await waitForPrompt();
    expect(screen.queryByRole('button', { name: /Google Play/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer mon avis' }));
    expect(contact).toHaveBeenCalledTimes(1);
  });
  it('gates Android store navigation and does not mark a cancelled gate as rated', async () => {
    device('Android'); const open = vi.spyOn(window, 'open').mockReturnValue(null);
    show(<AppRatingPrompt trigger={1} onOpenContact={vi.fn()} />); await waitForPrompt();
    fireEvent.click(screen.getByRole('button', { name: 'Noter sur Google Play' }));
    expect(open).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Fermer' }));
    expect(localStorage.getItem('mssid_rating_prompt_status')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Noter sur Google Play' }));
    const numbers = screen.getByText(/\d+ \+ \d+ = \?/).textContent!.match(/\d+/g)!.map(Number);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: String(numbers[0] + numbers[1]) } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
    expect(open).toHaveBeenCalledWith(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
    expect(localStorage.getItem('mssid_rating_prompt_status')).toBe('link_opened');
  });
  it('opens native Android external navigation through the Capacitor bridge', async () => {
    capacitor.isNativePlatform.mockReturnValue(true); capacitor.getPlatform.mockReturnValue('android');
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    show(<AppRatingPrompt trigger={0} manualTrigger={1} />);
    fireEvent.click(screen.getByRole('button', { name: 'Noter sur Google Play' }));
    const values = screen.getByText(/\d+ \+ \d+ = \?/).textContent!.match(/\d+/g)!.map(Number);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: String(values[0] + values[1]) } });
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
    expect(open).toHaveBeenCalledWith(PLAY_STORE_URL, '_self', 'noopener,noreferrer');
  });
  it('preserves legacy dismissal but allows a voluntary request from settings', async () => {
    device('Android'); localStorage.setItem('mssid_rating_prompt_status', 'rated');
    const view = show(<AppRatingPrompt trigger={1} />); await waitForPrompt();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    view.rerender(<LocaleProvider><AppRatingPrompt trigger={1} manualTrigger={1} /></LocaleProvider>);
    expect(screen.getByRole('button', { name: 'Noter sur Google Play' })).toBeInTheDocument();
  });
  it('waits until other modals are closed before showing a request', async () => {
    device('Android'); const view = show(<AppRatingPrompt trigger={1} blocked />); await waitForPrompt();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    view.rerender(<LocaleProvider><AppRatingPrompt trigger={1} blocked={false} /></LocaleProvider>); await waitForPrompt();
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });
  it('recognizes a desktop-mode iPad as iOS', () => { device('Mozilla Macintosh', 5); expect(getAppPlatform()).toBe('ios'); });
  it('does not interrupt an exercise but still honors a voluntary settings request', async () => {
    device('Android');
    const view = show(<AppRatingPrompt trigger={1} allowAutomaticPrompt={false} />);
    await waitForPrompt();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    view.rerender(<LocaleProvider><AppRatingPrompt trigger={1} allowAutomaticPrompt={false} manualTrigger={1} /></LocaleProvider>);
    expect(screen.getByRole('button', { name: 'Noter sur Google Play' })).toBeInTheDocument();
  });
});

it('shows honest offline guidance without downloading or sending demo progress', () => {
  const fetch = vi.spyOn(globalThis, 'fetch'); const close = vi.fn();
  show(<OfflinePacksManagerModal isOpen onClose={close} />);
  expect(screen.getByText(/ne télécharge pas de packs/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Revenir aux leçons' }));
  expect(close).toHaveBeenCalledTimes(1);
  expect(fetch).not.toHaveBeenCalled();
});
