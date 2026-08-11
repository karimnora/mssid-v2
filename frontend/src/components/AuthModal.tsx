import React, { useState } from 'react';
import { AuthUser } from '../types/auth';
import { AuthService } from '../services/authService';
import { X, LogIn, UserPlus, KeyRound } from 'lucide-react';
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
        const result = await AuthService.registerAsync(nom, email, password);
        
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl text-slate-800 flex flex-col overflow-hidden dir-rtl" dir="rtl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MssidLogo size="sm" />
            <div>
              <h2 className="text-base font-extrabold font-sans">
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
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
        <div className="flex border-b border-slate-200 bg-slate-50">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل:</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="مثال: يونس الجزائري"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none dir-ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
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
      </div>
    </div>
  );
};