import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Badge } from '../types';
import { X, Share2 } from 'lucide-react';

interface BadgeUnlockToastProps {
  /** Queue of newly-unlocked badges — only the first is shown; dismissing (or the auto-timeout) advances the queue. */
  queue: Badge[];
  onDismiss: () => void;
  /** Opens the shareable-certificate modal for the currently-shown badge (see CertificateModal). */
  onShare?: (badge: Badge) => void;
}

const AUTO_DISMISS_MS = 5000;

/** Celebratory toast shown the moment a badge's criteria becomes true (see utils/badgeEngine.ts). */
export const BadgeUnlockToast: React.FC<BadgeUnlockToastProps> = ({ queue, onDismiss, onShare }) => {
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [current, onDismiss]);

  // Fires once per badge (not per correct answer elsewhere in the app) — a badge unlock is the one
  // milestone-sized celebration in the whole app that currently had zero visual payoff beyond the
  // toast itself. prefers-reduced-motion is respected since canvas-confetti already checks it.
  useEffect(() => {
    if (!current || typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    confetti({
      particleCount: 90,
      spread: 75,
      startVelocity: 35,
      origin: { y: 0.15 },
      colors: ['#fbbf24', '#10b981', '#34d399', '#f59e0b'],
    });
  }, [current]);

  return (
    <div className="fixed top-4 inset-x-0 z-[100] flex justify-center px-3 pointer-events-none" dir="rtl">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 bg-gradient-to-r from-amber-400 to-emerald-500 text-white rounded-2xl shadow-2xl px-4 py-3 max-w-sm border-2 border-white/40"
          >
            <motion.span
              className="text-3xl shrink-0"
              initial={{ rotate: -15, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.1 }}
            >
              {current.icon}
            </motion.span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wide text-white/80">🎉 وسام جديد!</p>
              <p className="text-sm font-extrabold leading-tight truncate">{current.titleAr}</p>
              <p className="text-[11px] text-white/85 leading-snug">{current.descriptionAr}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {onShare && (
                <button
                    onClick={() => onShare(current)}
                  className="hit-target w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
                  aria-label="مشاركة الشهادة"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onDismiss}
                className="hit-target w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
