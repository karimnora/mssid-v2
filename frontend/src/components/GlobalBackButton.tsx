import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Home, BookOpen, Sparkles, AlertCircle, X, Check } from 'lucide-react';

export interface BackNavigationState {
  canGoBack: boolean;
  destinationLabelAr: string;
  destinationType: 'home' | 'courses' | 'labs' | 'exams' | 'challenges' | 'custom';
  onBack: () => void;
  /** If true, prompts with a kid-friendly confirmation dialog before leaving */
  requireConfirmation?: boolean;
  confirmationMessageAr?: string;
}

interface GlobalBackButtonProps {
  navState: BackNavigationState;
  /** Visual variant: 'floating' (sticky badge) or 'inline' (bar header) or 'bar' */
  variant?: 'floating' | 'bar' | 'header';
  className?: string;
}

export const GlobalBackButton: React.FC<GlobalBackButtonProps> = ({
  navState,
  variant = 'floating',
  className = '',
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleBackClick = () => {
    if (navState.requireConfirmation) {
      setShowConfirmModal(true);
    } else {
      navState.onBack();
    }
  };

  const confirmLeave = () => {
    setShowConfirmModal(false);
    navState.onBack();
  };

  const cancelLeave = () => {
    setShowConfirmModal(false);
  };

  // Keyboard shortcut: Escape or Backspace (when not in an input) triggers back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navState.canGoBack) {
        if (showConfirmModal) {
          setShowConfirmModal(false);
        } else {
          handleBackClick();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navState.canGoBack, showConfirmModal, navState.requireConfirmation]);

  if (!navState.canGoBack) return null;

  const getDestinationIcon = () => {
    switch (navState.destinationType) {
      case 'home':
        return <Home className="w-4 h-4 text-amber-300" />;
      case 'courses':
        return <BookOpen className="w-4 h-4 text-emerald-300" />;
      case 'labs':
        return <Sparkles className="w-4 h-4 text-cyan-300" />;
      default:
        return <ArrowRight className="w-4 h-4 text-white" />;
    }
  };

  return (
    <>
      {/* 1. BUTTON UI */}
      {variant === 'floating' ? (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.9 }}
          className={`fixed top-20 right-4 z-40 sm:top-24 sm:right-6 ${className}`}
        >
          <button
            onClick={handleBackClick}
            type="button"
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl border-2 border-white/40 backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 ring-4 ring-purple-500/20"
            title={`رجوع: ${navState.destinationLabelAr}`}
            aria-label={`رجوع: ${navState.destinationLabelAr}`}
          >
            {/* Animated Glow Dot */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
            </span>

            {/* Back Icon (Right-pointing in RTL means back) */}
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>

            {/* Clear Text Label */}
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-black tracking-wide drop-shadow-xs">
                رجوع للخلف ↩️
              </span>
              <span className="text-[10px] text-purple-100 font-medium truncate max-w-[130px]">
                {navState.destinationLabelAr}
              </span>
            </div>
          </button>
        </motion.div>
      ) : (
        /* Header / In-line Variant */
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBackClick}
          type="button"
          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-md border border-white/20 cursor-pointer transition-all ${className}`}
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
          <span>رجوع: {navState.destinationLabelAr}</span>
          {getDestinationIcon()}
        </motion.button>
      )}

      {/* 2. CONFIRMATION MODAL IF ACTIVE PROGRESS MIGHT BE LOST */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" dir="rtl">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-[var(--app-card-bg)] border-2 border-amber-400/60 rounded-3xl p-6 shadow-2xl space-y-5 text-center relative overflow-hidden"
            >
              {/* Decorative top accent */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border-2 border-amber-400/40 text-amber-500 flex items-center justify-center text-3xl shadow-inner">
                🤔
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-[var(--app-text)]">
                  هل تريد الرجوع حقاً يا بطل؟
                </h3>
                <p className="text-xs sm:text-sm text-[var(--app-text-muted)] font-medium leading-relaxed">
                  {navState.confirmationMessageAr ||
                    'أنت في منتصف هذا النشاط! إذا رجعت الآن قد تفقد بعض النقاط أو الإجابات غير المحفوظة.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={cancelLeave}
                  className="min-h-12 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs sm:text-sm shadow-md hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>لا، سأواصل التحدي! 🚀</span>
                </button>

                <button
                  onClick={confirmLeave}
                  className="min-h-12 px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-500 hover:text-white font-black text-xs sm:text-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>نعم، أريد الرجوع 👋</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
