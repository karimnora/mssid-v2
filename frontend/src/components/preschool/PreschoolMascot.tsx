import React from 'react';
import { motion } from 'motion/react';
import { useMotionPreference } from '../../hooks/useMotionPreference';

export type MascotMood = 'idle' | 'happy' | 'encourage' | 'celebrate';

interface PreschoolMascotProps {
  mood: MascotMood;
  size?: 'md' | 'lg';
}

// "أمين الفنك" / Amine the Fennec — reacts to the child's actions. Kept to pure CSS/motion (a big
// emoji + spring animations), no image/lottie asset pipeline needed for the MVP.
export const PreschoolMascot: React.FC<PreschoolMascotProps> = ({ mood, size = 'lg' }) => {
  const reducedMotion = useMotionPreference();
  const dimension = size === 'lg' ? 'text-7xl sm:text-8xl' : 'text-5xl';

  const animationByMood: Record<MascotMood, { animate: Record<string, number[]>; transition: Record<string, unknown> }> = {
    idle: {
      animate: { y: [0, -6, 0], rotate: [0, -2, 2, 0] },
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    happy: {
      animate: { y: [0, -18, 0], rotate: [0, -8, 8, 0] },
      transition: { duration: 0.6, repeat: 1, ease: 'easeOut' },
    },
    encourage: {
      animate: { x: [0, -8, 8, -8, 0] },
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    celebrate: {
      animate: { y: [0, -28, 0, -14, 0], rotate: [0, -12, 12, -12, 0], scale: [1, 1.15, 1, 1.1, 1] },
      transition: { duration: 1.1, ease: 'easeOut' },
    },
  };

  const config = animationByMood[mood];

  return (
    <motion.div
      key={mood}
      animate={reducedMotion ? { x: 0, y: 0, rotate: 0, scale: 1 } : config.animate}
      transition={reducedMotion ? { duration: 0 } : config.transition}
      className={`select-none ${dimension} drop-shadow-lg`}
      role="img"
      aria-label="Amine the Fennec mascot"
    >
      🦊
    </motion.div>
  );
};
