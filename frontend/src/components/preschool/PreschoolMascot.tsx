import React from 'react';
import { motion } from 'motion/react';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import greet from '../../assets/v2-reused/didou-greet.webp';
import cheer from '../../assets/v2-reused/didou-cheer.webp';
import point from '../../assets/v2-reused/didou-point.webp';

export type MascotMood = 'idle' | 'happy' | 'encourage' | 'celebrate';

interface PreschoolMascotProps {
  mood: MascotMood;
  size?: 'md' | 'lg';
}

// Didou reacts using the existing V2 illustrations. Idle motion stops after two cycles.
export const PreschoolMascot: React.FC<PreschoolMascotProps> = ({ mood, size = 'lg' }) => {
  const reducedMotion = useMotionPreference();
  const dimension = size === 'lg' ? 'w-28 h-28 sm:w-36 sm:h-36' : 'w-20 h-20';

  const animationByMood: Record<MascotMood, { animate: Record<string, number[]>; transition: Record<string, unknown> }> = {
    idle: {
      animate: { y: [0, -6, 0], rotate: [0, -2, 2, 0] },
      transition: { duration: 3, repeat: 1, ease: 'easeInOut' },
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
      aria-label="Didou"
    >
      <img src={mood === 'encourage' ? point : mood === 'idle' ? greet : cheer} alt="" width={144} height={144} className="w-full h-full object-contain" draggable={false} />
    </motion.div>
  );
};
