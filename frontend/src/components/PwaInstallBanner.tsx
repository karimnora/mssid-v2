import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { DownloadCloud, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { getAppPlatform, isInstalledWebApp, PLAY_STORE_URL } from '../utils/appPlatform';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
const DISMISSED_KEY = 'mssid_pwa_dismissed_time';
const COOLDOWN = 3 * 24 * 60 * 60 * 1000;

export const PwaInstallBanner: React.FC = () => {
  const t = useTranslation('meta');
  const { direction } = useLocaleContext();
  const platform = getAppPlatform();
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [visible, setVisible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installError, setInstallError] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform() || isInstalledWebApp()) return;
    let dismissedAt = 0;
    try { dismissedAt = Number(localStorage.getItem(DISMISSED_KEY)); } catch { /* Storage is optional. */ }
    let suppressed = dismissedAt > 0 && Date.now() - dismissedAt < COOLDOWN;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      if (suppressed || dismissed.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => { if (!dismissed.current) setVisible(true); }, 4000);
    };
    const beforeInstall = (event: Event) => {
      event.preventDefault();
      if (platform === 'desktop') setPrompt(event as InstallPrompt);
      reveal();
    };
    const installed = () => {
      suppressed = true;
      clearTimeout(timer);
      setVisible(false);
      setPrompt(null);
    };
    if (platform !== 'desktop') reveal();
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', installed);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      window.removeEventListener('appinstalled', installed);
    };
  }, [platform]);

  const dismiss = () => {
    dismissed.current = true;
    setVisible(false);
    setShowIosHelp(false);
    try { localStorage.setItem(DISMISSED_KEY, String(Date.now())); } catch { /* Storage is optional. */ }
  };
  const install = async () => {
    if (platform === 'ios') { setShowIosHelp(true); return; }
    if (!prompt || installing) return;
    setInstalling(true);
    setInstallError(false);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      // Acceptance is not proof of installation. appinstalled handles actual completion.
      if (outcome === 'dismissed') dismiss();
      else setVisible(false);
      setPrompt(null);
    } catch { setInstallError(true); }
    finally { setInstalling(false); }
  };

  if (!visible || Capacitor.isNativePlatform() || isInstalledWebApp()) return null;
  const ctaClass = 'hit-target inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 text-sm font-extrabold text-slate-950 disabled:opacity-50';
  return (
    <aside dir={direction} aria-label={t('pwaBannerTitle')} className="sticky top-0 z-40 bg-emerald-800 px-3 py-3 text-white shadow-md overflow-x-clip">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-sm leading-snug break-words whitespace-normal">{t('pwaBannerTitle')}</p>
            <p className="text-xs text-emerald-100 leading-snug mt-0.5 break-words">{t('installSubtitle')}</p>
          </div>
          <button type="button" className="hit-target w-12 shrink-0 grid place-items-center" onClick={dismiss} aria-label={t('pwaCloseAriaLabel')}><X className="w-5 h-5" /></button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
          {platform === 'android' ? (
            <a className={ctaClass} href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer"><DownloadCloud className="w-4 h-4 shrink-0" />{t('installGooglePlay')}</a>
          ) : (
            <button type="button" className={ctaClass} onClick={install} disabled={installing}><DownloadCloud className="w-4 h-4 shrink-0" />{t(platform === 'ios' ? 'installHomeScreen' : 'pwaInstallButton')}</button>
          )}
          <button type="button" className="hit-target shrink-0 px-3 text-sm font-extrabold" onClick={dismiss}>{t('pwaLaterButton')}</button>
        </div>
        {showIosHelp && <p role="status" className="w-full rounded-xl bg-white/10 p-3 text-sm leading-relaxed break-words">{t('installIosHelp')}</p>}
        {installError && <p role="alert" className="w-full text-sm">{t('installError')}</p>}
      </div>
    </aside>
  );
};
