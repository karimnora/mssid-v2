import React from 'react';
import { motion } from 'motion/react';

const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🏆'];

/** Brief particle burst played once next to a freshly-correct quiz answer. */
export const ConfettiBurst: React.FC = () => (
  <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 34 + (i % 3) * 10;
      return (
        <motion.span
          key={i}
          className="absolute top-1/2 left-1/2 text-xs"
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: 0,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance - 6,
            scale: 1,
            rotate: (i % 2 === 0 ? 1 : -1) * 90,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
        </motion.span>
      );
    })}
  </span>
);
