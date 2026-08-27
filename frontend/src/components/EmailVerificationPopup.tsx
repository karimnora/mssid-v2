import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { AuthService } from '../services/authService';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface EmailVerificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

// Shown once, right after a successful login/registration, if the account isn't verified yet (see
// App.tsx's AuthModal onAuthSuccess) — purely a nudge, never a gate: closing it (✕, backdrop, or
// "لاحقاً") just dismisses it for this session, same as ProfileModal's SEC-08 reminder card still
// does for anyone who wants to verify later from their profile instead.
export const EmailVerificationPopup: React.FC<EmailVerificationPopupProps> = ({ isOpen, onClose, email }) => {
  const t = useTranslation('auth');
  const tCommon = useTranslation('common');
  const { direction } = useLocaleContext();
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyState, setVerifyState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // A successful confirmation closes the popup on its own after a moment — no need to make the
  // child tap something else once the code already worked.
  useEffect(() => {
    if (verifyState !== 'success') return;
    const timer = setTimeout(onClose, 1800);
    return () => clearTimeout(timer);
  }, [verifyState, onClose]);

  if (!isOpen) return null;

  const handleVerifyCode = async () => {
    if (verificationCode.trim().length !== 6) return;
    setVerifyState('loading');
    const result = await AuthService.verifyEmailCode(verificationCode.trim());
    setVerifyState(result.success ? 'success' : 'error');
    setVerifyMessage(result.message || null);
    if (result.success) setVerificationCode('');
  };

  const handleResendCode = async () => {
    setResendCooldown(60);
    const result = await AuthService.resendVerificationCode();
    setVerifyMessage(result.message || null);
  };

  return (
    <div
      className="fixed inset-0 z-50 kids-modal-overlay backdrop-blur-sm flex items-center justify-center p-4"
      dir={direction}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="kids-modal-panel w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative kids-modal-header p-6 pb-8 text-center">
          <button
            onClick={onClose}
            className="kids-close absolute top-3 left-3 cursor-pointer"
            aria-label={tCommon('close')}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 mx-auto rounded-[20px] bg-white/20 flex items-center justify-center mb-2 text-3xl">
            🦊
          </div>
          <h2 className="text-lg font-extrabold">{t('verifyTitle')}</h2>
          <p className="text-sm text-white/90 mt-1.5 leading-relaxed font-bold">
            {t('verifyIntro')}<br />
            <span dir="ltr" className="font-extrabold">{email}</span>
          </p>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              dir="ltr"
              autoFocus
              className="kids-input flex-1 font-mono text-center tracking-widest"
            />
            <button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6 || verifyState === 'loading'}
              className="kids-cta-amber cursor-pointer shrink-0 disabled:cursor-not-allowed"
            >
              {verifyState === 'loading' ? '...' : t('verifyConfirm')}
            </button>
          </div>

          {verifyMessage && (
            <p className={`text-xs font-bold ${verifyState === 'success' ? 'text-[var(--kids-grass-2)]' : 'text-[var(--brand-coral)]'}`}>
              {verifyMessage}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className="text-xs font-extrabold text-[#8A5A12] disabled:opacity-50 cursor-pointer"
            >
              {resendCooldown > 0 ? t('resendAfterSeconds', { seconds: resendCooldown }) : t('resendPrompt')}
            </button>
            <button
              onClick={onClose}
              className="text-xs font-extrabold text-[var(--kids-muted)] cursor-pointer"
            >
              {t('verifyNotNow')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
