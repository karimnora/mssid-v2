import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { ParentGateModal } from './ParentGateModal';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { getAppPlatform, openGooglePlay } from '../utils/appPlatform';

const STORAGE_KEY = 'mssid_rating_prompt_status';
interface AppRatingPromptProps {
  trigger: number;
  manualTrigger?: number;
  blocked?: boolean;
  allowAutomaticPrompt?: boolean;
  onOpenContact?: () => void;
}
export const AppRatingPrompt: React.FC<AppRatingPromptProps> = ({ trigger, manualTrigger = 0, blocked = false, allowAutomaticPrompt = true, onOpenContact }) => {
  const t = useTranslation('meta');
  const { direction } = useLocaleContext();
  const [visible, setVisible] = useState(false);
  const [showParentGate, setShowParentGate] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [manualVisible, setManualVisible] = useState(false);
  const manualSeen = useRef(0);
  const handled = useRef(false);
  const isAndroid = getAppPlatform() === 'android';

  useEffect(() => {
    if (blocked) return;
    if (manualTrigger > manualSeen.current) {
      manualSeen.current = manualTrigger;
      setOpenError(false);
      setManualVisible(true);
      setVisible(true);
      return;
    }
    if (!allowAutomaticPrompt || trigger <= 0 || handled.current) return;
    try {
      // Legacy "rated" records a handled invitation, never proof of a published review.
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch { /* Limit invitations within this session even without storage. */ }
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, [trigger, manualTrigger, blocked, allowAutomaticPrompt]);

  const finish = (status: 'dismissed' | 'link_opened') => {
    handled.current = true;
    try { localStorage.setItem(STORAGE_KEY, status); } catch { /* Storage is optional. */ }
    setVisible(false);
    setManualVisible(false);
  };
  const openStore = () => {
    setShowParentGate(false);
    try { openGooglePlay(); finish('link_opened'); }
    catch { setOpenError(true); }
  };

  return <>
    {visible && !blocked && (manualVisible || allowAutomaticPrompt) && (
      <aside id="app-rating-prompt" dir={direction} aria-label={t('reviewTitle')} className="fixed bottom-28 md:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-80 z-50 rounded-2xl border-2 border-amber-300 bg-white p-4 shadow-xl space-y-3 text-slate-900 min-w-0 overflow-x-clip">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h3 className="font-extrabold text-sm leading-snug break-words min-w-0">{t('reviewTitle')}</h3>
          <button type="button" aria-label={t('ratingCloseAriaLabel')} className="min-h-12 min-w-12 grid place-items-center" onClick={() => finish('dismissed')}><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm">{t(isAndroid ? 'reviewStoreDescription' : 'reviewContactDescription')}</p>
        {isAndroid && <button type="button" className="kids-cta w-full" onClick={() => setShowParentGate(true)}>{t('reviewGooglePlay')}</button>}
        {onOpenContact && <button type="button" className="w-full min-h-12 rounded-xl border-2 border-slate-200 font-bold text-sm" onClick={() => { finish('dismissed'); onOpenContact(); }}>{t(isAndroid ? 'reviewSuggestion' : 'ratingSendFeedbackButton')}</button>}
        {openError && <p role="alert" className="text-sm text-red-700">{t('reviewOpenError')}</p>}
      </aside>
    )}
    <ParentGateModal isOpen={showParentGate} onClose={() => setShowParentGate(false)} onVerified={openStore} />
  </>;
};
