import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

interface AskAdultScreenProps {
  onAskAdult: () => void;
  onClose: () => void;
}

/** Child-first step before an adult form (auth, paywall). Not a legal consent flow. */
export const AskAdultScreen: React.FC<AskAdultScreenProps> = ({ onAskAdult, onClose }) => {
  const t = useTranslation('auth');
  return (
    <div className="p-6 space-y-5 text-center">
      <div className="text-5xl" aria-hidden>🦊</div>
      <h2 className="text-xl font-black text-[var(--kids-ink)]">{t('askAdultTitle')}</h2>
      <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed">{t('askAdultBody')}</p>
      <button
        type="button"
        onClick={onAskAdult}
        className="kids-cta cursor-pointer"
      >
        {t('askAdultCta')}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="text-sm font-extrabold text-[var(--kids-muted)] cursor-pointer min-h-12"
      >
        {t('verifyNotNow')}
      </button>
    </div>
  );
};

// Friction step before sensitive actions (delete, store links, reset). Not a legal parental-consent flow.
export const ParentGateModal: React.FC<ParentGateModalProps> = ({ isOpen, onClose, onVerified }) => {
  const t = useTranslation('meta');
  const { direction } = useLocaleContext();
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setA(10 + Math.floor(Math.random() * 40));
      setB(10 + Math.floor(Math.random() * 40));
      setAnswer('');
      setError(false);
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(answer) === a + b) {
      onVerified();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('parentGateTitle')}
      className="fixed inset-0 z-[80] kids-modal-overlay backdrop-blur-sm flex items-center justify-center p-4"
      dir={direction}
    >
      <div className="kids-modal-panel w-full max-w-sm overflow-hidden">
        <div className="kids-modal-header p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 bg-white/25 rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold truncate">{t('parentGateTitle')}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('pwaCloseAriaLabel')}
            className="kids-close cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed">
            {t('parentGateBody')}
          </p>
          <div className="bg-[#FFF8E7] border-2 border-[#E7E2D7] rounded-2xl p-4 text-center">
            <span dir="ltr" className="text-2xl font-black text-[var(--kids-ink)] font-mono">
              {a} + {b} = ?
            </span>
          </div>
          <input
            type="number"
            autoFocus
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(false);
            }}
            placeholder={t('parentGateAnswer')}
            aria-label={t('parentGateAnswer')}
            dir="ltr"
            className="kids-input text-center text-lg font-bold"
          />
          {error && (
            <p role="alert" className="text-xs font-bold text-center text-[var(--brand-coral)]">
              {t('parentGateError')}
            </p>
          )}
          <button
            type="submit"
            disabled={!answer}
            className="kids-cta cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('parentGateContinue')}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
};
