import React from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, X } from 'lucide-react';

interface AuthWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: () => void;
  onLogin: () => void;
  viewedCount: number;
  maxCount: number;
}

// Shown when a guest (authUser === null) hits the discovery-mode lesson limit. Purely an
// account-creation nudge — distinct from SubscriptionPaywall, which gates paid content for
// already-authenticated free users.
export const AuthWallModal: React.FC<AuthWallModalProps> = ({
  isOpen,
  onClose,
  onCreateAccount,
  onLogin,
  viewedCount,
  maxCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 dir-rtl" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl text-center overflow-hidden"
      >
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 text-white p-8 pb-10">
          <button
            onClick={onClose}
            className="absolute top-3 left-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-5xl mb-3">
            🌟
          </div>
          <h2 className="text-xl font-black">برافو يا بطل! 🌟</h2>
          <p className="text-sm text-white/90 mt-1">
            لقد أنهيت {viewedCount} من {maxCount} دروس مجانية في وضع التجربة!
          </p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            أنشئ حساباً مجانياً الآن لمواصلة التعلم دون أي حدود، وحفظ تقدمك ونقاط خبرتك بأمان!
          </p>

          <div className="space-y-2.5">
            <button
              onClick={onCreateAccount}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب مجاني</span>
            </button>
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3.5 rounded-2xl transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>لدي حساب بالفعل، تسجيل الدخول</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
