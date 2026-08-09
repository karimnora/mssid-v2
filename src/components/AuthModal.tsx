import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types/auth';
import { AuthService } from '../services/authService';
import { X, LogIn, UserPlus, Shield, User, Lock, KeyRound, CheckCircle, Sparkles } from 'lucide-react';
import { MssidLogo } from './MssidLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nom, setNom] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      if (isLogin) {
        const result = await AuthService.loginAsync(email, password);

        if (result.error || !result.user || !result.user.token) {
          setStatusMessage({
            type: 'error',
            text: result.error || 'فشلت عملية تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.'
          });
          setLoading(false);
          return;
        }

        setStatusMessage({
          type: 'success',
          text: `تم تسجيل الدخول بنجاح! أهلاً بك يا ${result.user.nom}`
        });
        onAuthSuccess(result.user);
        setTimeout(() => onClose(), 600);
      } else {
        const result = await AuthService.registerAsync(nom, email, password);

        if (result.error || !result.user || !result.user.token) {
          setStatusMessage({
            type: 'error',
            text: result.error || 'فشلت عملية إنشاء الحساب. يرجى التحقق من البيانات المدخلة.'
          });
          setLoading(false);
          return;
        }

        setStatusMessage({
          type: 'success',
          text: `تم إنشاء الحساب وحفظه في الخادم بنجاح! أهلاً بك يا ${result.user.nom}`
        });
        onAuthSuccess(result.user);
        setTimeout(() => onClose(), 600);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'حدث خطأ أثناء التواصل مع خادم mssid dz. يرجى المحاولة لاحقاً.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleSwitch = (role: UserRole) => {
    const user = AuthService.switchDemoRole(role);
    onAuthSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl text-slate-800 flex flex-col overflow-hidden dir-rtl" dir="rtl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MssidLogo size="sm" />
            <div>
              <h2 className="text-base font-extrabold font-sans">
                {isLogin ? 'تسجيل الدخول إلى تطبيق mssid dz' : 'إنشاء حساب جديد'}
              </h2>
              <p className="text-[11px] text-purple-200">نظام إدارة الهويات والصلاحيات المعتمد على JWT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Role Tester Bar for Developer/Evaluator */}
        <div className="bg-purple-50 p-3.5 border-b border-purple-100 space-y-2">
          <span className="text-[11px] font-extrabold text-purple-900 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>تجربة فورية للأدوار المحددة بالهيكلية (Quick RBAC Tester):</span>
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickRoleSwitch('ROLE_FREE')}
              disabled={loading}
              className="px-2 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] font-extrabold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              👤 ROLE_FREE
            </button>
            <button
              onClick={() => handleQuickRoleSwitch('ROLE_PREMIUM')}
              disabled={loading}
              className="px-2 py-1.5 bg-purple-700 text-white border border-purple-800 rounded-xl text-[11px] font-extrabold hover:bg-purple-800 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              ⭐ ROLE_PREMIUM
            </button>
            <button
              onClick={() => handleQuickRoleSwitch('ROLE_ADMIN')}
              disabled={loading}
              className="px-2 py-1.5 bg-slate-900 text-amber-400 border border-slate-800 rounded-xl text-[11px] font-extrabold hover:bg-slate-800 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              🛡️ ROLE_ADMIN
            </button>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            disabled={loading}
            onClick={() => { setIsLogin(true); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 disabled:opacity-50 ${
              isLogin
                ? 'border-purple-700 text-purple-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => { setIsLogin(false); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 border-b-2 disabled:opacity-50 ${
              !isLogin
                ? 'border-purple-700 text-purple-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>إنشاء حساب جديد</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل:</label>
              <input
                type="text"
                disabled={loading}
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="مثال: يونس الجزائري"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:opacity-60 disabled:bg-slate-100"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني:</label>
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mssid.dz"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none dir-ltr disabled:opacity-60 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور:</label>
            <input
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none disabled:opacity-60 disabled:bg-slate-100"
            />
          </div>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-start gap-2.5 shadow-xs transition-all ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  : 'bg-red-50 text-red-900 border border-red-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <KeyRound className="w-4 h-4 text-amber-300" />
            )}
            <span>
              {loading
                ? 'جاري التحقق والمصادقة مع الخادم...'
                : isLogin
                ? 'تسجيل الدخول وإنشاء رمز JWT'
                : 'تسجيل حساب جديد'}
            </span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => { setIsLogin(!isLogin); setStatusMessage(null); }}
              className="text-xs text-purple-700 font-bold hover:underline cursor-pointer disabled:opacity-50"
            >
              {isLogin ? 'ليس لديك حساب؟ قم بإنشاء حساب جديد' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
