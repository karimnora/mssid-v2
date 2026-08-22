import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, X } from 'lucide-react';
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
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      dir={direction}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-white p-6 pb-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 left-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all cursor-pointer"
            aria-label={tCommon('close')}
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black">{t('verifyTitle')}</h2>
          <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
            {t('verifyIntro')}<br />
            <span dir="ltr" className="font-mono font-bold">{email}</span>
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
              className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-extrabold text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6 || verifyState === 'loading'}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shrink-0"
            >
              {verifyState === 'loading' ? '...' : t('verifyConfirm')}
            </button>
          </div>

          {verifyMessage && (
            <p className={`text-[11px] font-bold ${verifyState === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
              {verifyMessage}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className="text-[11px] font-bold text-amber-700 hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
            >
              {resendCooldown > 0 ? t('resendAfterSeconds', { seconds: resendCooldown }) : t('resendPrompt')}
            </button>
            <button
              onClick={onClose}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
            >
              {t('verifyNotNow')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
