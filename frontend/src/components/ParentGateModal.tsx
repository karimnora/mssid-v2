import React, { useEffect, useState } from 'react';
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

// Friction step before sensitive actions (delete, store links). Not a legal parental-consent flow.
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(answer) === a + b) {
      onVerified();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={t('parentGateTitle')} className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 font-sans" dir={direction}>
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-extrabold text-white">{t('parentGateTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t('pwaCloseAriaLabel')}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('parentGateBody')}
          </p>
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center">
            <span dir="ltr" className="text-2xl font-black text-white font-mono">
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
            className="w-full text-center bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:outline-none text-white text-lg font-bold rounded-xl px-3 py-2.5"
          />
          {error && <p role="alert" className="text-xs text-rose-400 text-center font-bold">{t('parentGateError')}</p>}
          <button
            type="submit"
            disabled={!answer}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm py-2.5 rounded-xl transition-all cursor-pointer"
          >
            {t('parentGateContinue')}
          </button>
        </form>
      </div>
    </div>
  );
};
