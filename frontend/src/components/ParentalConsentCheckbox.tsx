import React, { useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../hooks/useTranslation';
import { canUseWebCheckout } from '../utils/paymentPlatform';
import { TermsOfServiceModal } from './TermsOfServiceModal';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

export function ParentalConsentCheckbox({ checked, onChange, disabled = false, onOpenTerms, onOpenPrivacy }: {
  checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean;
  onOpenTerms?: () => void; onOpenPrivacy?: () => void;
}) {
  const t = useTranslation('auth');
  const id = useId();
  const [legal, setLegal] = useState<'terms' | 'privacy' | null>(null);
  const native = !canUseWebCheckout();
  const openLegal = (page: 'terms' | 'privacy') => {
    const callback = page === 'terms' ? onOpenTerms : onOpenPrivacy;
    if (callback) callback();
    else setLegal(page);
  };
  const legalLink = (page: 'terms' | 'privacy', text: string) => native
    ? <button type="button" onClick={() => openLegal(page)} className="text-base underline text-[var(--kids-grass-2)]">{text}</button>
    : <a href={`/${page}.html`} target="_blank" rel="noopener noreferrer" className="text-base underline text-[var(--kids-grass-2)]">{text}</a>;
  return <div className="space-y-2 text-base font-bold text-[var(--kids-ink)]">
    <div className="flex min-h-[60px] min-w-[60px] items-start gap-3 rounded-2xl border-2 border-[#E7E2D7] bg-white p-4 leading-relaxed">
      <input id={id} type="checkbox" required checked={checked} disabled={disabled}
        onChange={event => onChange(event.target.checked)}
        className="mt-1 h-6 w-6 shrink-0 accent-emerald-700" />
      <div><label htmlFor={id} className="inline-block min-h-[60px] min-w-[60px] cursor-pointer">{t('consentStatement')}</label>{' '}
        {legalLink('privacy', t('consentPrivacyLink'))}.
        {' '}{t('consentTermsPrefix')}{' '}
        {legalLink('terms', t('consentTermsLink'))}.
      </div>
    </div>
    {!checked && <p className="text-base text-[var(--kids-muted)]">{t('consentUnchecked')}</p>}
    {native && legal && createPortal(<div data-consent-legal-dialog className="fixed inset-0 z-[210]">
      {legal === 'terms'
        ? <TermsOfServiceModal isOpen onClose={() => setLegal(null)} />
        : <PrivacyPolicyModal isOpen onClose={() => setLegal(null)} />}
    </div>, document.body)}
  </div>;
}
