import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { PrimaryGrade } from '../types';
import { AuthService } from '../services/authService';
import { X, LogIn, UserPlus, KeyRound, Eye, EyeOff, GraduationCap, Lock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  /** Which tab to land on when the modal opens (login vs register). */
  initialMode?: 'login' | 'register';
  /** Opens PrivacyPolicyModal (rendered at App.tsx level) — surfaced on the register form so a new
   * account is never created without the policy having been reachable first. */
  onOpenPrivacyPolicy?: () => void;
  /** Opens TermsOfServiceModal (rendered at App.tsx level) — same rationale as onOpenPrivacyPolicy. */
  onOpenTermsOfService?: () => void;
  /** Set only when this modal was opened automatically because a guest hit a login-gated action
   * (locked lesson, exam/challenge, AI tutor...) — shown as a banner so the popup doesn't look like
   * an unexplained interruption. Left unset for a deliberate "Se connecter" click. */
  contextMessage?: string | null;
}

// Same 5 levels/labels as GradeSelector.tsx and Navbar.tsx's GRADES, kept in sync manually since
// each lives in its own component-scoped list rather than a shared constant.
const GRADE_OPTION_KEYS: Record<PrimaryGrade, 'grade1APOption' | 'grade2APOption' | 'grade3APOption' | 'grade4APOption' | 'grade5APOption'> = {
  '1AP': 'grade1APOption',
  '2AP': 'grade2APOption',
  '3AP': 'grade3APOption',
  '4AP': 'grade4APOption',
  '5AP': 'grade5APOption',
};

// Public value, not a secret — same env-var pattern as springBootApi.ts's VITE_SPRING_BOOT_URL.
// Empty/unset = the Google button below never renders, nothing else about the form changes.
const GOOGLE_CLIENT_ID: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID) || '';

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onAuthSuccess, initialMode = 'login', onOpenPrivacyPolicy, onOpenTermsOfService, contextMessage }) => {
  const t = useTranslation('auth');
  const { direction } = useLocaleContext();
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nom, setNom] = useState<string>('');
  const [grade, setGrade] = useState<PrimaryGrade | ''>('');
  // Minimal parental supervision (product decision, pre-launch audit): optional, no verification —
  // never blocks registration, just lets an admin reach a parent later if genuinely needed.
  const [parentEmail, setParentEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 'credentials' = the normal login/register form above. 'forgot'/'reset' replace it entirely with
  // the password-recovery steps (request a code, then use it) — see handleForgotSubmit/handleResetSubmit.
  const [authFlow, setAuthFlow] = useState<'credentials' | 'forgot' | 'reset'>('credentials');
  const [resetCode, setResetCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // The modal never unmounts (App.tsx toggles `isOpen`, not conditional rendering), so re-sync the
  // tab from initialMode every time it's (re)opened rather than only once at first mount.
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      setShowPassword(false);
      setGrade('');
      setParentEmail('');
      setAuthFlow('credentials');
      setResetCode('');
      setNewPassword('');
      setStatusMessage(null);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState<boolean>(false);

  // Loads Google Identity Services once, app-wide (checks for an already-injected/loaded script
  // first) — a no-op entirely when VITE_GOOGLE_CLIENT_ID isn't set, so nothing else about the modal
  // changes for a deployment that hasn't created a Google Cloud OAuth client yet.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if ((window as any).google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }
    const existing = document.getElementById('google-identity-script') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => setGoogleReady(true));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.head.appendChild(script);
  }, []);

  // Sends the Google-issued ID token straight to the backend for verification — never trusts
  // anything else from the credential response, same success/error handling as handleSubmit below.
  const handleGoogleCredential = async (response: { credential?: string }) => {
    if (!response?.credential) return;
    setLoading(true);
    setStatusMessage(null);
    try {
      const result = await AuthService.loginWithGoogleAsync(response.credential);
      if (result.error || !result.user) {
        setStatusMessage({ type: 'error', text: result.error || t('googleAuthErrorDefault') });
        return;
      }
      setStatusMessage({ type: 'success', text: t('loginSuccessWelcomeBack', { name: result.user.nom }) });
      onAuthSuccess(result.user);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Re-initializes/re-renders Google's own button whenever the modal (re)opens on the credentials
  // step, or the login/register tab flips (its label switches between "Sign in" / "Sign up").
  useEffect(() => {
    if (!googleReady || !GOOGLE_CLIENT_ID || authFlow !== 'credentials' || !isOpen) return;
    const g = (window as any).google;
    if (!g?.accounts?.id || !googleButtonRef.current) return;
    g.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential });
    googleButtonRef.current.innerHTML = '';
    g.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 320,
      shape: 'pill',
      text: isLogin ? 'signin_with' : 'signup_with',
      locale: direction === 'rtl' ? 'ar' : 'fr',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleReady, authFlow, isOpen, isLogin, direction]);

  if (!isOpen) return null;

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const result = await AuthService.requestPasswordReset(email);
    setLoading(false);

    if (!result.success) {
      setStatusMessage({ type: 'error', text: result.message || t('errorServerUnreachable') });
      return;
    }

    setAuthFlow('reset');
    setResendCooldown(60);
    setStatusMessage({ type: 'success', text: result.message || t('forgotSuccessDefault') });
  };

  const handleResendResetCode = async () => {
    setResendCooldown(60);
    const result = await AuthService.requestPasswordReset(email);
    setStatusMessage({
      type: result.success ? 'success' : 'error',
      text: result.message || (result.success ? t('resendSuccessDefault') : t('resendErrorDefault')),
    });
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const result = await AuthService.resetPasswordWithCode(email, resetCode, newPassword);
    setLoading(false);

    if (!result.success) {
      setStatusMessage({ type: 'error', text: result.message || t('resetCodeInvalid') });
      return;
    }

    setAuthFlow('credentials');
    setIsLogin(true);
    setPassword('');
    setResetCode('');
    setNewPassword('');
    setStatusMessage({ type: 'success', text: t('resetPasswordSuccess') });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      if (isLogin) {
        const result = await AuthService.loginAsync(email, password);
        
        if (result.error || !result.user) {
          setStatusMessage({
            type: 'error',
            text: result.error || t('loginInvalidCredentials')
          });
          return;
        }

        setStatusMessage({
          type: 'success',
          text: t('loginSuccessWelcomeBack', { name: result.user.nom })
        });
        onAuthSuccess(result.user);
        onClose();
      } else {
        const result = await AuthService.registerAsync(nom, email, password, grade || undefined, parentEmail.trim() || undefined);
        
        if (result.error || !result.user) {
          setStatusMessage({
            type: 'error',
            text: result.error || t('registerErrorDefault')
          });
          return;
        }

        setStatusMessage({
          type: 'success',
          text: t('registerSuccessWelcome', { name: result.user.nom })
        });
        onAuthSuccess(result.user);
        onClose();
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: t('genericConnectionError')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 kids-modal-overlay backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="kids-modal-panel w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
        dir={direction}
      >
        {/* Modal Header */}
        <div className="kids-modal-header p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-12 h-12 rounded-[16px] bg-white/20 flex items-center justify-center text-2xl shrink-0">🦊</div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold truncate">
                {authFlow === 'forgot' || authFlow === 'reset'
                  ? t('titleRecovery')
                  : isLogin ? t('login') : t('titleRegister')}
              </h2>
              <p className="text-[11px] text-white/90">{t('platformSubtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="kids-close cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why-am-I-here banner — only set when a guest was redirected here by a locked action. */}
        {contextMessage && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border-b-2 border-amber-200 shrink-0">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-amber-900 leading-relaxed">{contextMessage}</p>
          </div>
        )}

        {/* Auth Mode Tabs */}
        {authFlow === 'credentials' && (
        <div className="flex gap-2 p-3 bg-[#FFF8E7] shrink-0">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 hit-target rounded-2xl text-sm font-extrabold cursor-pointer flex items-center justify-center gap-2 ${
              isLogin
                ? 'bg-[var(--kids-grass-2)] text-white kids-pop'
                : 'bg-white text-[var(--kids-muted)] border-2 border-[#E7E2D7]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{t('login')}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 hit-target rounded-2xl text-sm font-extrabold cursor-pointer flex items-center justify-center gap-2 ${
              !isLogin
                ? 'bg-[var(--kids-grass-2)] text-white kids-pop'
                : 'bg-white text-[var(--kids-muted)] border-2 border-[#E7E2D7]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('registerTab')}</span>
          </button>
        </div>
        )}

        {/* "Mot de passe oublié" — step 1: enter the email to receive a reset code */}
        {authFlow === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
            <p className="text-sm text-[var(--kids-muted)] leading-relaxed font-bold">
              {t('forgotIntro')}
            </p>
            <div>
              <label className="block text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">{t('emailLabel')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mssid.dz"
                autoComplete="email"
                className="kids-input dir-ltr"
              />
            </div>

            {statusMessage && (
              <div className={`p-3 text-sm font-bold ${statusMessage.type === 'success' ? 'kids-msg-ok' : 'kids-msg-err'}`}>
                {statusMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="kids-cta cursor-pointer mt-2"
            >
              {loading ? t('forgotSubmitLoading') : t('forgotSubmit')}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setAuthFlow('credentials'); setStatusMessage(null); }}
                className="text-sm text-[var(--kids-grass-2)] font-extrabold cursor-pointer"
              >
                {t('backToLogin')}
              </button>
            </div>
          </form>
        )}

        {/* "Mot de passe oublié" — step 2: enter the code + a new password */}
        {authFlow === 'reset' && (
          <form onSubmit={handleResetSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
            <p className="text-sm text-[var(--kids-muted)] leading-relaxed font-bold">
              {t('resetIntroPrefix')} <span className="font-extrabold dir-ltr inline-block">{email}</span>{t('resetIntroSuffix')}
            </p>
            <div>
              <label className="block text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">{t('verificationCodeLabel')}</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                dir="ltr"
                className="kids-input font-mono text-center tracking-widest"
              />
            </div>
            <div>
              <label className="block text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">{t('newPasswordLabel')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="kids-input pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--kids-muted)] cursor-pointer w-8 h-8 flex items-center justify-center"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-[var(--kids-muted)] mt-1">{t('newPasswordMinLengthHint')}</p>
            </div>

            {statusMessage && (
              <div className={`p-3 text-sm font-bold ${statusMessage.type === 'success' ? 'kids-msg-ok' : 'kids-msg-err'}`}>
                {statusMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || resetCode.length !== 6}
              className="kids-cta cursor-pointer mt-2"
            >
              {loading ? t('resetSubmitLoading') : t('resetSubmit')}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setAuthFlow('credentials'); setStatusMessage(null); }}
                className="text-sm text-[var(--kids-grass-2)] font-extrabold cursor-pointer"
              >
                {t('backToLogin')}
              </button>
              <button
                type="button"
                onClick={handleResendResetCode}
                disabled={resendCooldown > 0}
                className="text-sm text-[var(--kids-grass-2)] font-extrabold disabled:opacity-50 cursor-pointer"
              >
                {resendCooldown > 0 ? t('resendAfterSeconds', { seconds: resendCooldown }) : t('resendPrompt')}
              </button>
            </div>
          </form>
        )}

        {/* Form */}
        {authFlow === 'credentials' && (
        <>
        {GOOGLE_CLIENT_ID && (
          <div className="px-5 pt-4 space-y-3 shrink-0">
            <div ref={googleButtonRef} className="w-full flex justify-center min-h-[44px]" />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E7E2D7]" />
              <span className="text-xs font-extrabold text-[var(--kids-muted)]">{t('orDivider')}</span>
              <div className="h-px flex-1 bg-[#E7E2D7]" />
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {!isLogin && (
            <div>
              <label className="block text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">{t('fullNameLabel')}</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={t('fullNamePlaceholder')}
                autoComplete="name"
                className="kids-input"
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="flex items-center gap-1.5 text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">
                <GraduationCap className="w-4 h-4 text-[var(--kids-grass-2)]" />
                <span>{t('gradeLabel')}</span>
              </label>
              <select
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value as PrimaryGrade)}
                className="kids-input"
              >
                <option value="" disabled>{t('gradeChoosePlaceholder')}</option>
                {(Object.keys(GRADE_OPTION_KEYS) as PrimaryGrade[]).map((id) => (
                  <option key={id} value={id}>{t(GRADE_OPTION_KEYS[id])}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--kids-muted)] mt-1.5 font-bold">{t('gradeHint')}</p>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">
                {t('parentEmailLabel')}
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
                autoComplete="off"
                className="kids-input dir-ltr"
              />
              <p className="text-xs text-[var(--kids-muted)] mt-1.5 font-bold">
                {t('parentEmailHint')}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">{t('emailLabel')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mssid.dz"
              autoComplete="email"
              className="kids-input dir-ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">{t('passwordLabel')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={isLogin ? undefined : 8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="kids-input pl-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--kids-muted)] cursor-pointer w-8 h-8 flex items-center justify-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-[var(--kids-muted)] mt-1">{t('passwordMinLengthHint')}</p>
            )}
            {isLogin && (
              <button
                type="button"
                onClick={() => { setAuthFlow('forgot'); setStatusMessage(null); }}
                className="text-sm text-[var(--kids-grass-2)] font-extrabold cursor-pointer mt-2"
              >
                {t('forgotPasswordLink')}
              </button>
            )}
          </div>

          {statusMessage && (
            <div
              className={`p-3 text-sm font-bold ${
                statusMessage.type === 'success' ? 'kids-msg-ok' : 'kids-msg-err'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {!isLogin && (onOpenPrivacyPolicy || onOpenTermsOfService) && (
            <p className="text-xs text-[var(--kids-muted)] text-center leading-relaxed font-bold">
              {t('termsAgreementPrefix')}{' '}
              {onOpenTermsOfService && (
                <button
                  type="button"
                  onClick={onOpenTermsOfService}
                  className="text-[var(--kids-grass-2)] font-extrabold cursor-pointer"
                >
                  {t('termsLink')}
                </button>
              )}
              {onOpenTermsOfService && onOpenPrivacyPolicy && <span> {t('termsAnd')} </span>}
              {onOpenPrivacyPolicy && (
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-[var(--kids-grass-2)] font-extrabold cursor-pointer"
                >
                  {t('privacyLink')}
                </button>
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="kids-cta cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <KeyRound className="w-4 h-4 text-[var(--kids-sun-1)]" />
            <span>
              {loading
                ? t('submitLoading')
                : isLogin
                ? t('login')
                : t('registerSubmit')}
            </span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-[var(--kids-grass-2)] font-extrabold cursor-pointer"
            >
              {isLogin ? t('toggleToRegister') : t('toggleToLogin')}
            </button>
          </div>
        </form>
        </>
        )}
      </motion.div>
    </motion.div>
  );
};