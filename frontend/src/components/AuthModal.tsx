import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { PrimaryGrade } from '../types';
import { AuthService } from '../services/authService';
import { X, LogIn, UserPlus, KeyRound, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { MssidLogo } from './MssidLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  /** Which tab to land on when the modal opens — e.g. AuthWallModal's two CTAs open this in different modes. */
  initialMode?: 'login' | 'register';
  /** Opens PrivacyPolicyModal (rendered at App.tsx level) — surfaced on the register form so a new
   * account is never created without the policy having been reachable first. */
  onOpenPrivacyPolicy?: () => void;
  /** Opens TermsOfServiceModal (rendered at App.tsx level) — same rationale as onOpenPrivacyPolicy. */
  onOpenTermsOfService?: () => void;
}

// Same 5 levels/labels as GradeSelector.tsx and Navbar.tsx's GRADES, kept in sync manually since
// each lives in its own component-scoped list rather than a shared constant.
const GRADE_OPTIONS: { id: PrimaryGrade; labelAr: string }[] = [
  { id: '1AP', labelAr: 'السنة الأولى ابتدائي (1AP)' },
  { id: '2AP', labelAr: 'السنة الثانية ابتدائي (2AP)' },
  { id: '3AP', labelAr: 'السنة الثالثة ابتدائي (3AP)' },
  { id: '4AP', labelAr: 'السنة الرابعة ابتدائي (4AP)' },
  { id: '5AP', labelAr: 'السنة الخامسة ابتدائي (5AP)' },
];

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onAuthSuccess, initialMode = 'login', onOpenPrivacyPolicy, onOpenTermsOfService }) => {
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

  if (!isOpen) return null;

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const result = await AuthService.requestPasswordReset(email);
    setLoading(false);

    if (!result.success) {
      setStatusMessage({ type: 'error', text: result.message || 'تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.' });
      return;
    }

    setAuthFlow('reset');
    setResendCooldown(60);
    setStatusMessage({ type: 'success', text: result.message || 'إذا كان هذا البريد مسجلاً لدينا، فستصلك رسالة تحتوي على رمز إعادة التعيين.' });
  };

  const handleResendResetCode = async () => {
    setResendCooldown(60);
    const result = await AuthService.requestPasswordReset(email);
    setStatusMessage({
      type: result.success ? 'success' : 'error',
      text: result.message || (result.success ? 'تم إرسال رمز جديد.' : 'تعذر إرسال الرمز، حاول لاحقاً.'),
    });
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const result = await AuthService.resetPasswordWithCode(email, resetCode, newPassword);
    setLoading(false);

    if (!result.success) {
      setStatusMessage({ type: 'error', text: result.message || 'الرمز غير صحيح أو منتهي الصلاحية.' });
      return;
    }

    setAuthFlow('credentials');
    setIsLogin(true);
    setPassword('');
    setResetCode('');
    setNewPassword('');
    setStatusMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.' });
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
            text: result.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
          });
          return;
        }

        setStatusMessage({
          type: 'success',
          text: `أهلاً بك مجدداً ${result.user.nom}!`
        });
        onAuthSuccess(result.user);
        onClose();
      } else {
        const result = await AuthService.registerAsync(nom, email, password, grade || undefined, parentEmail.trim() || undefined);
        
        if (result.error || !result.user) {
          setStatusMessage({
            type: 'error',
            text: result.error || 'تعذر إنشاء الحساب، يرجى المحاولة لاحقاً.'
          });
          return;
        }

        setStatusMessage({
          type: 'success',
          text: `تم إنشاء حسابك بنجاح! أهلاً بك ${result.user.nom}`
        });
        onAuthSuccess(result.user);
        onClose();
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'حدث خطأ في الاتصال. يرجى التأكد من شبكة الإنترنت والمحاولة لاحقاً.'
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
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="bg-white border border-slate-200 w-full max-w-md max-h-[90vh] rounded-3xl shadow-2xl text-slate-800 flex flex-col overflow-hidden dir-rtl"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <MssidLogo size="sm" />
            <div>
              <h2 className="text-base font-extrabold font-sans">
                {authFlow === 'forgot' || authFlow === 'reset'
                  ? 'استعادة كلمة المرور'
                  : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h2>
              <p className="text-[11px] text-emerald-200">منصة مسيد التعليمية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        {authFlow === 'credentials' && (
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              isLogin
                ? 'border-emerald-700 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 ${
              !isLogin
                ? 'border-emerald-700 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>حساب جديد</span>
          </button>
        </div>
        )}

        {/* "Mot de passe oublié" — step 1: enter the email to receive a reset code */}
        {authFlow === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
            <p className="text-xs text-slate-600 leading-relaxed">
              أدخل بريدك الإلكتروني، وإذا كان مسجلاً لدينا فستصلك رسالة تحتوي على رمز لإعادة تعيين كلمة المرور.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mssid.dz"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none dir-ltr"
              />
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {statusMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer mt-2 active:scale-[0.98]"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رمز إعادة التعيين'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setAuthFlow('credentials'); setStatusMessage(null); }}
                className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          </form>
        )}

        {/* "Mot de passe oublié" — step 2: enter the code + a new password */}
        {authFlow === 'reset' && (
          <form onSubmit={handleResetSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
            <p className="text-xs text-slate-600 leading-relaxed">
              أدخل الرمز المكون من 6 أرقام الذي وصلك على <span className="font-bold dir-ltr inline-block">{email}</span>، وكلمة المرور الجديدة.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رمز التحقق:</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                dir="ltr"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-extrabold text-center tracking-widest focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الجديدة:</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 pl-10 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {statusMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || resetCode.length !== 6}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer mt-2 active:scale-[0.98]"
            >
              {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => { setAuthFlow('credentials'); setStatusMessage(null); }}
                className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                العودة لتسجيل الدخول
              </button>
              <button
                type="button"
                onClick={handleResendResetCode}
                disabled={resendCooldown > 0}
                className="text-xs text-emerald-700 font-bold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
              >
                {resendCooldown > 0 ? `إعادة الإرسال بعد ${resendCooldown} ثانية` : 'لم يصلك الرمز؟ إعادة الإرسال'}
              </button>
            </div>
          </form>
        )}

        {/* Form */}
        {authFlow === 'credentials' && (
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل:</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="مثال: يونس الجزائري"
                autoComplete="name"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                <span>المستوى الدراسي:</span>
              </label>
              <select
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value as PrimaryGrade)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="" disabled>اختر مستواك الدراسي...</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g.id} value={g.id}>{g.labelAr}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">سيكون هذا مستواك الافتراضي، ويمكنك تغييره لاحقاً من أعلى الصفحة.</p>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                بريد ولي الأمر (اختياري):
              </label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@example.com"
                autoComplete="off"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none dir-ltr"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                يساعدنا على التواصل مع ولي الأمر عند الحاجة (مثلاً بخصوص الاشتراك). لن يُطلب أي تفعيل لهذا البريد.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mssid.dz"
              autoComplete="email"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none dir-ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور:</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="w-full px-3.5 py-2.5 pl-10 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isLogin && (
              <button
                type="button"
                onClick={() => { setAuthFlow('forgot'); setStatusMessage(null); }}
                className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer mt-1.5"
              >
                نسيت كلمة المرور؟
              </button>
            )}
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-bold ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {!isLogin && (onOpenPrivacyPolicy || onOpenTermsOfService) && (
            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              بإنشاء الحساب، أنت توافق على{' '}
              {onOpenTermsOfService && (
                <button
                  type="button"
                  onClick={onOpenTermsOfService}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  الشروط والأحكام
                </button>
              )}
              {onOpenTermsOfService && onOpenPrivacyPolicy && <span> و</span>}
              {onOpenPrivacyPolicy && (
                <button
                  type="button"
                  onClick={onOpenPrivacyPolicy}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  سياسة الخصوصية
                </button>
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 active:scale-[0.98]"
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>
              {loading
                ? 'جاري التحميل...'
                : isLogin
                ? 'تسجيل الدخول'
                : 'إنشاء الحساب'}
            </span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              {isLogin ? 'ليس لديك حساب؟ قم بإنشاء حساب جديد' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>
        </form>
        )}
      </motion.div>
    </motion.div>
  );
};