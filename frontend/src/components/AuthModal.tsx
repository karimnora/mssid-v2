import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { GoogleSignIn, ErrorCode as GoogleSignInErrorCode } from '@capawesome/capacitor-google-sign-in';
import { AuthUser } from '../types/auth';
import { PrimaryGrade } from '../types';
import { AuthService } from '../services/authService';
import { WILAYAS_LIST } from '../data/wilayasData';
import { X, LogIn, UserPlus, KeyRound, Eye, EyeOff, GraduationCap, Lock, MapPin, Loader2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** `landOnPreschool` is set only when the child picked "préscolaire" at registration — there's
   * no such PrimaryGrade, so the account still gets a real default grade (1AP) and this flag is
   * how the caller knows to route into preschool mode instead of the normal grade-based home. */
  onAuthSuccess: (user: AuthUser, opts?: { landOnPreschool?: boolean }) => void;
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

// Google's own web GSI library (loaded below) blocks itself inside an embedded WebView, which is
// exactly what the Android/iOS app is — so native builds use @capawesome/capacitor-google-sign-in
// (Android Credential Manager / iOS native sign-in) instead. Both paths end up calling the same
// GOOGLE_CLIENT_ID: the plugin's initialize() always wants the *web* OAuth client, even on native —
// see the plugin's README. A matching Android OAuth client (same SHA-1 as the signing cert) must
// still exist in Google Cloud Console for the native flow to succeed, even though its ID is never
// referenced here.
const IS_NATIVE_PLATFORM = Capacitor.isNativePlatform();

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onAuthSuccess, initialMode = 'login', onOpenPrivacyPolicy, onOpenTermsOfService, contextMessage }) => {
  const t = useTranslation('auth');
  const tMeta = useTranslation('meta');
  const { direction } = useLocaleContext();
  const [isLogin, setIsLogin] = useState<boolean>(initialMode === 'login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nom, setNom] = useState<string>('');
  const [grade, setGrade] = useState<PrimaryGrade | 'prescolaire' | ''>('');
  // Minimal parental supervision (product decision, pre-launch audit): optional, no verification —
  // never blocks registration, just lets an admin reach a parent later if genuinely needed.
  const [parentEmail, setParentEmail] = useState<string>('');
  // Optional, for B2B partner reporting (regional breakdown) — stores the wilaya's official code
  // ("16"), not its name, so it stays locale-independent and matches how Algerians already refer to
  // wilayas (plates, postal codes). Never gates registration.
  const [wilaya, setWilaya] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [awaitingServer, setAwaitingServer] = useState(false);
  const [slowNetwork, setSlowNetwork] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 'credentials' = the normal login/register form above. 'forgot'/'reset' replace it entirely with
  // the password-recovery steps (request a code, then use it) — see handleForgotSubmit/handleResetSubmit.
  // 'completeProfile' replaces it once, right after a brand-new Google sign-up (see
  // handleGoogleCredential): Google never gives us a grade/wilaya, so this is the only chance to ask.
  const [authFlow, setAuthFlow] = useState<'credentials' | 'forgot' | 'reset' | 'completeProfile'>('credentials');
  const [resetCode, setResetCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<AuthUser | null>(null);
  const [completeGrade, setCompleteGrade] = useState<PrimaryGrade | 'prescolaire' | ''>('');
  const [completeWilaya, setCompleteWilaya] = useState<string>('');

  useEffect(() => {
    setSlowNetwork(false);
    if (!awaitingServer || !isOpen) return;
    const timer = setTimeout(() => setSlowNetwork(true), 8000);
    return () => clearTimeout(timer);
  }, [awaitingServer, isOpen]);

  const requestAuth = async <T,>(request: () => Promise<T>): Promise<T> => {
    setAwaitingServer(true);
    try { return await request(); }
    finally { setAwaitingServer(false); }
  };

  // The modal never unmounts (App.tsx toggles `isOpen`, not conditional rendering), so re-sync the
  // tab from initialMode every time it's (re)opened rather than only once at first mount.
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      setShowPassword(false);
      setGrade('');
      setParentEmail('');
      setWilaya('');
      setAuthFlow('credentials');
      setResetCode('');
      setNewPassword('');
      setPendingGoogleUser(null);
      setCompleteGrade('');
      setCompleteWilaya('');
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
  const nativeGoogleReady = useRef(false);
  const nativeGooglePending = useRef(false);

  // Loads Google Identity Services once, app-wide (checks for an already-injected/loaded script
  // first) — a no-op entirely when VITE_GOOGLE_CLIENT_ID isn't set, or on native platforms (see
  // IS_NATIVE_PLATFORM above), so nothing else about the modal changes for a deployment that hasn't
  // created a Google Cloud OAuth client yet.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || IS_NATIVE_PLATFORM) return;
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
      const result = await requestAuth(() => AuthService.loginWithGoogleAsync(response.credential!));
      if (result.error || !result.user) {
        setStatusMessage({ type: 'error', text: result.error || t('googleAuthErrorDefault') });
        return;
      }
      if (result.profileIncomplete) {
        // Brand-new Google account: grade/wilaya are genuinely unset in the DB (not just defaulted
        // for display). Ask once now instead of leaving them silently blank forever.
        setPendingGoogleUser(result.user);
        setCompleteGrade('');
        setCompleteWilaya('');
        setStatusMessage(null);
        setAuthFlow('completeProfile');
        return;
      }
      setStatusMessage({ type: 'success', text: t('loginSuccessWelcomeBack', { name: result.user.nom }) });
      onAuthSuccess(result.user);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingGoogleUser) return;
    setLoading(true);
    try {
      const isPreschoolChoice = completeGrade === 'prescolaire';
      const effectiveGrade = isPreschoolChoice ? '1AP' : completeGrade;
      if (effectiveGrade) AuthService.updateGrade(effectiveGrade);
      if (completeWilaya) AuthService.updateWilaya(completeWilaya);

      const finalUser = AuthService.getCurrentUser() || pendingGoogleUser;
      setPendingGoogleUser(null);
      setAuthFlow('credentials');
      onAuthSuccess(finalUser, isPreschoolChoice ? { landOnPreschool: true } : undefined);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Native counterpart of handleGoogleCredential: same backend call, same success/error handling,
  // but the ID token comes from the native Credential Manager / Google Sign-In flow instead of the
  // web GSI button's credential callback.
  const handleNativeGoogleSignIn = async () => {
    if (nativeGooglePending.current) return;
    nativeGooglePending.current = true;
    setLoading(true);
    setStatusMessage(null);
    try {
      // Initialize on demand so a plugin failure shows an error and can be retried,
      // instead of silently removing the Google button for the whole app session.
      if (!nativeGoogleReady.current) {
        await GoogleSignIn.initialize({ clientId: GOOGLE_CLIENT_ID });
        nativeGoogleReady.current = true;
      }
      const result = await GoogleSignIn.signIn();
      if (!result.idToken) {
        setStatusMessage({ type: 'error', text: t('googleAuthErrorDefault') });
        return;
      }
      await handleGoogleCredential({ credential: result.idToken });
    } catch (error: any) {
      if (error?.code === GoogleSignInErrorCode.SignInCanceled) {
        return; // User closed the account picker — not an error worth showing.
      }
      if (error?.code === GoogleSignInErrorCode.NoCredentialAvailable) {
        setStatusMessage({ type: 'error', text: t('googleSignInUnavailable') });
        return;
      }
      setStatusMessage({ type: 'error', text: t('googleAuthErrorDefault') });
    } finally {
      nativeGooglePending.current = false;
      setLoading(false);
    }
  };

  // Re-initializes/re-renders Google's own button whenever the modal (re)opens on the credentials
  // step, or the login/register tab flips (its label switches between "Sign in" / "Sign up").
  // Web-only — native builds render their own button instead of this one.
  useEffect(() => {
    if (IS_NATIVE_PLATFORM || !googleReady || !GOOGLE_CLIENT_ID || authFlow !== 'credentials' || !isOpen) return;
    const g = (window as any).google;
    if (!g?.accounts?.id || !googleButtonRef.current) return;
    g.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleCredential });
    googleButtonRef.current.innerHTML = '';
    // Google's button takes a fixed pixel width (no %/auto support), clamped to its own
    // 200-400 range — a hardcoded 320 overflowed narrower phones. Measure the actual
    // available width instead so the button never exceeds its container.
    const availableWidth = googleButtonRef.current.clientWidth || 320;
    g.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      width: Math.min(400, Math.max(200, Math.floor(availableWidth))),
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

    const result = await requestAuth(() => AuthService.requestPasswordReset(email));
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
    const result = await requestAuth(() => AuthService.requestPasswordReset(email));
    setStatusMessage({
      type: result.success ? 'success' : 'error',
      text: result.message || (result.success ? t('resendSuccessDefault') : t('resendErrorDefault')),
    });
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const result = await requestAuth(() => AuthService.resetPasswordWithCode(email, resetCode, newPassword));
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
    if (loading) return;
    setLoading(true);
    setStatusMessage(null);

    try {
      if (isLogin) {
        const result = await requestAuth(() => AuthService.loginAsync(email, password));
        
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
        // No PrimaryGrade covers "préscolaire" — the account still needs a real grade to fall
        // back to once the child grows into primary school, so it registers as 1AP and the caller
        // routes into preschool mode via the landOnPreschool flag instead.
        const isPreschoolChoice = grade === 'prescolaire';
        const effectiveGrade: PrimaryGrade | undefined = isPreschoolChoice ? '1AP' : (grade || undefined);
        const result = await requestAuth(() => AuthService.registerAsync(nom, email, password, effectiveGrade, parentEmail.trim() || undefined, wilaya || undefined));

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
        onAuthSuccess(result.user, isPreschoolChoice ? { landOnPreschool: true } : undefined);
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
      className="fixed inset-0 z-50 kids-modal-overlay backdrop-blur-sm flex items-start sm:items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="kids-modal-panel w-full max-w-md flex flex-col overflow-hidden"
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
                  : authFlow === 'completeProfile'
                  ? t('completeProfileTitle')
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

        {slowNetwork && awaitingServer && <p role="status" className="p-3 text-sm font-bold bg-amber-50 text-amber-900">{tMeta('networkSlow')}</p>}

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
          <form onSubmit={handleForgotSubmit} className="kids-modal-body p-5 space-y-4">
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
              className="kids-cta cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? t('forgotSubmitLoading') : t('forgotSubmit')}</span>
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
          <form onSubmit={handleResetSubmit} className="kids-modal-body p-5 space-y-4">
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
              className="kids-cta cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? t('resetSubmitLoading') : t('resetSubmit')}</span>
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

        {/* Post-Google-signup, one-time: grade/wilaya are genuinely unset in the DB, ask once. */}
        {authFlow === 'completeProfile' && (
          <form onSubmit={handleCompleteProfileSubmit} className="kids-modal-body p-5 space-y-4">
            <p className="text-sm text-[var(--kids-muted)] leading-relaxed font-bold">
              {t('completeProfileIntro')}
            </p>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">
                <GraduationCap className="w-4 h-4 text-[var(--kids-grass-2)]" />
                <span>{t('gradeLabel')}</span>
              </label>
              <select
                value={completeGrade}
                onChange={(e) => setCompleteGrade(e.target.value as PrimaryGrade | 'prescolaire')}
                className="kids-input"
              >
                <option value="">{t('gradeChoosePlaceholder')}</option>
                <option value="prescolaire">{t('gradePrescolaireOption')}</option>
                {(Object.keys(GRADE_OPTION_KEYS) as PrimaryGrade[]).map((id) => (
                  <option key={id} value={id}>{t(GRADE_OPTION_KEYS[id])}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">
                <MapPin className="w-4 h-4 text-[var(--kids-grass-2)]" />
                <span>{t('wilayaLabel')}</span>
              </label>
              <select
                value={completeWilaya}
                onChange={(e) => setCompleteWilaya(e.target.value)}
                className="kids-input"
              >
                <option value="">{t('wilayaChoosePlaceholder')}</option>
                {WILAYAS_LIST.map((w) => (
                  <option key={w.codeStr} value={w.codeStr}>
                    {w.codeStr} - {direction === 'rtl' ? w.nameAr : w.nameFr}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading} className="kids-cta cursor-pointer mt-2">
              {loading ? t('submitLoading') : t('completeProfileSubmit')}
            </button>
          </form>
        )}

        {/* Form */}
        {authFlow === 'credentials' && (
        <>
        {GOOGLE_CLIENT_ID && (
          <div className="px-5 pt-4 space-y-3 shrink-0">
            {IS_NATIVE_PLATFORM ? (
              <button
                type="button"
                onClick={handleNativeGoogleSignIn}
                disabled={loading}
                className="w-full min-h-[44px] flex items-center justify-center gap-2.5 rounded-full border border-[#E7E2D7] bg-white text-sm font-bold text-[#3c4043] shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin text-[#4285F4]" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.68-3.88 2.68-6.61Z" />
                    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z" />
                    <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z" />
                    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
                  </svg>
                )}
                {loading ? t('submitLoading') : t('continueWithGoogle')}
              </button>
            ) : (
              <div ref={googleButtonRef} className="w-full flex justify-center min-h-[44px]" />
            )}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E7E2D7]" />
              <span className="text-xs font-extrabold text-[var(--kids-muted)]">{t('orDivider')}</span>
              <div className="h-px flex-1 bg-[#E7E2D7]" />
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="kids-modal-body p-5 space-y-4">
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
                onChange={(e) => setGrade(e.target.value as PrimaryGrade | 'prescolaire')}
                className="kids-input"
              >
                <option value="" disabled>{t('gradeChoosePlaceholder')}</option>
                <option value="prescolaire">{t('gradePrescolaireOption')}</option>
                {(Object.keys(GRADE_OPTION_KEYS) as PrimaryGrade[]).map((id) => (
                  <option key={id} value={id}>{t(GRADE_OPTION_KEYS[id])}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--kids-muted)] mt-1.5 font-bold">{t('gradeHint')}</p>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="flex items-center gap-1.5 text-sm font-extrabold text-[var(--kids-ink)] mb-1.5">
                <MapPin className="w-4 h-4 text-[var(--kids-grass-2)]" />
                <span>{t('wilayaLabel')}</span>
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="kids-input"
              >
                <option value="">{t('wilayaChoosePlaceholder')}</option>
                {WILAYAS_LIST.map((w) => (
                  <option key={w.codeStr} value={w.codeStr}>
                    {w.codeStr} - {direction === 'rtl' ? w.nameAr : w.nameFr}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--kids-muted)] mt-1.5 font-bold">{t('wilayaHint')}</p>
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
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4 text-[var(--kids-sun-1)]" />
            )}
            <span>
              {loading
                ? t('submitLoading')
                : statusMessage?.type === 'error'
                ? tMeta('networkRetry')
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
