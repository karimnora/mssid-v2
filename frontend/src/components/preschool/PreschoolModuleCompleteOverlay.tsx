/**
 * PreschoolModuleCompleteOverlay.tsx
 * Overlay plein-écran avec confetti affiché 2.5 secondes quand un module atteint 100%.
 * Beaucoup plus engageant que le simple fanfare audio — c'est le "moment Duolingo".
 */
import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { PreschoolModule, PreschoolLanguage } from '../../data/preschool/types';

interface PreschoolModuleCompleteOverlayProps {
  module: PreschoolModule;
  language: PreschoolLanguage;
  onClose: () => void;
}

const DISPLAY_MS = 2800;

function launchConfetti() {
  try {
    import('canvas-confetti').then(({ default: confetti }) => {
      // Left burst
      confetti({ particleCount: 60, angle: 60,  spread: 60, origin: { x: 0,   y: 0.65 }, colors: ['#fbbf24','#f97316','#34d399'] });
      // Right burst
      confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1,   y: 0.65 }, colors: ['#60a5fa','#e879f9','#fbbf24'] });
      // Center top
      setTimeout(() => confetti({ particleCount: 80, spread: 90, origin: { y: 0.2 }, colors: ['#fde68a','#34d399','#f9a8d4'] }), 400);
    });
  } catch {}
}

export const PreschoolModuleCompleteOverlay: React.FC<PreschoolModuleCompleteOverlayProps> = ({
  module,
  language,
  onClose,
}) => {
  useEffect(() => {
    launchConfetti();
    const timer = setTimeout(onClose, DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const lines = [
    t('أَحْسَنْتَ! أَنْهَيْتَ المَسَار!', 'Bravo ! Parcours terminé !', 'Amazing! Path complete!'),
    t('أَنْتَ بَطَلٌ حَقِيقِيّ! 🏆', 'Tu es un vrai champion ! 🏆', 'You\'re a true champion! 🏆'),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-[2.5rem] p-8 shadow-2xl border-4 border-white/60
                   flex flex-col items-center gap-4 max-w-xs mx-4 text-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Module icon — bouncing */}
        <motion.span
          className="text-8xl select-none"
          animate={{ y: [0, -20, 0, -12, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {module.icon}
        </motion.span>

        {/* Stars row */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="text-3xl select-none"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 400 }}
            >
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Module title */}
        <p className="text-lg font-black text-white drop-shadow">
          {module.titleI18n[language]}
        </p>

        {/* Celebration lines */}
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.2 }}
            className="text-sm font-black text-white/95"
          >
            {line}
          </motion.p>
        ))}

        {/* Progress pills */}
        <div className="flex gap-1 mt-1">
          {Array.from({ length: Math.min(module.totalSteps, 8) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.06 }}
              className="w-2.5 h-2.5 rounded-full bg-white"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
