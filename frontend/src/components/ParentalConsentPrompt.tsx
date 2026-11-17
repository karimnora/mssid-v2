import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useLocaleContext } from '../context/LocaleContext';
import { useTranslation } from '../hooks/useTranslation';
import { AuthService } from '../services/authService';
import { needsParentalConsent } from '../utils/parentalConsent';
import { ParentGateModal } from './ParentGateModal';
import { ParentalConsentCheckbox } from './ParentalConsentCheckbox';

const OPEN_EVENT = 'mssid:open-parental-consent';

/** Existing accounts keep learning locally while an adult decides whether to resume syncing. */
export function ParentalConsentPrompt() {
  const { authUser } = useAuth();
  const { direction } = useLocaleContext();
  const t = useTranslation('auth');
  const [deferred, setDeferred] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const required = !!authUser && needsParentalConsent(authUser);

  useEffect(() => {
    setDeferred(false); setVerified(false); setChecked(false); setError(false);
  }, [authUser?.id, required]);
  useEffect(() => {
    const open = () => { setDeferred(false); setVerified(false); setChecked(false); setError(false); };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  if (!required || deferred) return null;
  const later = () => { setDeferred(true); setChecked(false); setVerified(false); };
  if (!verified) return <ParentGateModal isOpen onClose={later} onVerified={() => setVerified(true)} zIndex={200} />;
  const accept = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!checked || saving) return;
    setSaving(true); setError(false);
    try { if (!(await AuthService.acceptParentalConsent()).success) setError(true); }
    catch { setError(true); }
    finally { setSaving(false); }
  };
  return createPortal(<div className="fixed inset-0 z-[200] kids-modal-overlay flex items-start justify-center p-4 sm:items-center" dir={direction}>
    <section role="dialog" aria-modal="true" aria-labelledby="parental-consent-title" className="kids-modal-panel w-full max-w-lg max-h-[90dvh] overflow-y-auto p-5">
      <h2 id="parental-consent-title" className="text-xl font-black">{t('consentExistingTitle')}</h2>
      <p className="my-4 text-base leading-relaxed">{t('consentExistingIntro')}</p>
      <form onSubmit={accept} className="space-y-4">
        <ParentalConsentCheckbox checked={checked} onChange={setChecked} disabled={saving} />
        {error && <p role="alert" className="text-base font-bold text-amber-900">{t('consentSaveError')}</p>}
        <button type="submit" disabled={!checked || saving} className="kids-cta min-h-[60px] disabled:opacity-40">{t('consentAccept')}</button>
        <button type="button" disabled={saving} onClick={later} className="min-h-[60px] w-full text-base font-bold">{t('consentLater')}</button>
      </form>
    </section>
  </div>, document.body);
}

export function ParentalConsentNotice() {
  const { authUser } = useAuth();
  const t = useTranslation('auth');
  if (!authUser || !needsParentalConsent(authUser)) return null;
  return <aside data-parental-consent-pending className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-base text-amber-950">
    <p>{t('consentPending')}</p>
    <button type="button" className="min-h-[60px] font-bold underline" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>{t('consentReview')}</button>
  </aside>;
}
