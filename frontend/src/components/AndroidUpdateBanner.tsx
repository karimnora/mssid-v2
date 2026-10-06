import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { DownloadCloud, X } from 'lucide-react';
import { ParentGateModal } from './ParentGateModal';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { openGooglePlay } from '../utils/appPlatform';
import { androidUpdateKind, AndroidUpdateKind } from '../utils/androidUpdate';
import { springBootApi } from '../services/springBootApi';

const DISMISSED_KEY = 'mssid_android_update_dismissed_time';
const COOLDOWN = 7 * 24 * 60 * 60 * 1000;

export const AndroidUpdateBanner: React.FC = () => {
  const t = useTranslation('meta');
  const { direction } = useLocaleContext();
  const [kind, setKind] = useState<AndroidUpdateKind>('none');
  const [openError, setOpenError] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      if (dismissed.current || cancelled) return;
      try {
        const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
        const onCooldown = dismissedAt > 0 && Date.now() - dismissedAt < COOLDOWN;
        const res = await springBootApi.getAndroidRelease();
        if (cancelled || dismissed.current || !res.data) return;
        const next = androidUpdateKind(__APP_BUILD__, res.data);
        if (next === 'none') return;
        if (next === 'optional' && onCooldown) return;
        setKind(next);
      } catch {
        // Offline or old backend: never block the child on a missing check.
      }
    }, 4000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    if (kind === 'required') return;
    dismissed.current = true;
    setKind('none');
    try { localStorage.setItem(DISMISSED_KEY, String(Date.now())); } catch { /* Storage is optional. */ }
  };

  const openStore = () => {
    setShowParentGate(false);
    try {
      openGooglePlay();
      if (kind === 'optional') dismiss();
    } catch {
      setOpenError(true);
    }
  };

  if (kind === 'none') return null;

  const required = kind === 'required';
  return (
    <>
      <aside
        dir={direction}
        data-android-update={kind}
        aria-label={t(required ? 'androidUpdateRequiredTitle' : 'androidUpdateTitle')}
        className="fixed bottom-28 md:bottom-6 inset-x-4 sm:inset-x-auto sm:end-6 sm:w-80 z-50 rounded-3xl border-2 border-[#BFDBFE] bg-white p-4 shadow-xl space-y-3 text-[var(--app-text)] min-w-0 overflow-x-clip"
      >
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h3 className="font-extrabold text-sm leading-snug break-words min-w-0">
            {t(required ? 'androidUpdateRequiredTitle' : 'androidUpdateTitle')}
          </h3>
          {!required && (
            <button
              type="button"
              aria-label={t('pwaCloseAriaLabel')}
              className="hit-target min-h-12 min-w-12 grid place-items-center cursor-pointer"
              onClick={dismiss}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-sm font-medium text-[var(--app-text-muted)] leading-snug">
          {t(required ? 'androidUpdateRequiredBody' : 'androidUpdateBody')}
        </p>
        <button
          type="button"
          className="kids-cta w-full cursor-pointer inline-flex items-center justify-center gap-2"
          onClick={() => setShowParentGate(true)}
        >
          <DownloadCloud className="w-4 h-4 shrink-0" />
          {t('androidUpdateCta')}
        </button>
        {!required && (
          <button type="button" className="w-full min-h-12 rounded-xl font-extrabold text-sm cursor-pointer" onClick={dismiss}>
            {t('pwaLaterButton')}
          </button>
        )}
        {openError && <p role="alert" className="text-sm text-[var(--kids-coral,#C42A23)]">{t('reviewOpenError')}</p>}
      </aside>
      <ParentGateModal isOpen={showParentGate} onClose={() => setShowParentGate(false)} onVerified={openStore} />
    </>
  );
};
