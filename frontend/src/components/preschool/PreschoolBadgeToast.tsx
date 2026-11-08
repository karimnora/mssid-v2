/**
 * PreschoolBadgeToast.tsx
 * Toast de déblocage de badge — version enfant-friendly, trilingue, confetti intégré.
 * Auto-disparaît après 4 secondes.
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreschoolBadge } from '../../data/preschool/preschoolBadgesData';
import { PreschoolLanguage } from '../../data/preschool/types';

interface PreschoolBadgeToastProps {
  badge: PreschoolBadge | null;
  language: PreschoolLanguage;
  onDismiss: () => void;
}

function popConfetti() {
  try {
    // Dynamic import to not block the bundle
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 70,
        spread: 80,
        startVelocity: 30,
        origin: { y: 0.12 },
        colors: ['#fbbf24', '#f97316', '#34d399', '#60a5fa', '#e879f9'],
      });
    });
  } catch {}
}

const AUTO_DISMISS_MS = 4500;

export const PreschoolBadgeToast: React.FC<PreschoolBadgeToastProps> = ({
  badge,
  language,
  onDismiss,
}) => {
  useEffect(() => {
    if (!badge) return;
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    popConfetti();
    return () => clearTimeout(timer);
  }, [badge, onDismiss]);

  const t = (ar: { ar: string; fr: string; en: string }) =>
    language === 'ar' ? ar.ar : language === 'fr' ? ar.fr : ar.en;

  const newBadgeLabel =
    language === 'ar' ? '🏅 وِسَامٌ جَدِيد!' :
    language === 'fr' ? '🏅 Nouveau Badge !' :
    '🏅 New Badge!';

  return (
    <div className="fixed top-4 inset-x-0 z-[200] flex justify-center px-4 pointer-events-none">
      <AnimatePresence mode="wait">
        {badge && (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: -50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="pointer-events-auto w-full max-w-xs"
          >
            <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl shadow-2xl border-2 border-white/50 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-4">
                {/* Big emoji */}
                <motion.span
                  className="text-5xl shrink-0 select-none"
                  initial={{ rotate: -20, scale: 0.4 }}
                  animate={{ rotate: [0, 15, -10, 5, 0], scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.15 }}
                >
                  {badge.icon}
                </motion.span>

                {/* Text */}
                <div className="flex-1 min-w-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/80">
                    {newBadgeLabel}
                  </p>
                  <p className="text-sm font-black text-white leading-tight truncate">
                    {t(badge.titleI18n)}
                  </p>
                  <p className="text-[11px] text-white/90 leading-snug mt-0.5 line-clamp-2">
                    {t(badge.descI18n)}
                  </p>
                </div>

                {/* Dismiss tap */}
                <button
                  onClick={onDismiss}
                  className="min-h-[60px] min-w-[60px] shrink-0 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center cursor-pointer text-white font-black text-lg transition-colors"
                  aria-label="Fermer"
                >
                  ✕
                </button>
              </div>

              {/* Progress bar for auto-dismiss */}
              <motion.div
                className="h-1 bg-white/50"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
