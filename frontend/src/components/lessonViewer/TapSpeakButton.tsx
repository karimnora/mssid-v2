import React from 'react';
import { motion } from 'motion/react';

const spring = { type: 'spring' as const, stiffness: 400, damping: 22 };

interface TapSpeakButtonProps {
  snippetKey: string;
  text: string;
  speakingKey: string | null;
  onSpeak: (key: string, text: string) => void;
  size?: 'md' | 'lg';
  label?: string;
}

/** Dedicated speaker in front of one snippet. Never reads the rest of the lesson. */
export const TapSpeakButton: React.FC<TapSpeakButtonProps> = ({
  snippetKey,
  text,
  speakingKey,
  onSpeak,
  size = 'md',
  label = 'استمع',
}) => {
  if (!text) return null;
  const active = speakingKey === snippetKey;
  const dim = size === 'lg' ? 'w-14 h-14 text-2xl' : 'w-12 h-12 text-xl';

  return (
    <motion.button
      type="button"
      data-tap-speak={snippetKey}
      aria-label={label}
      aria-pressed={active}
      onClick={(e) => {
        e.stopPropagation();
        onSpeak(snippetKey, text);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}
      className={`${dim} shrink-0 rounded-full flex items-center justify-center cursor-pointer shadow-sm ${
        active
          ? 'bg-[var(--brand-blue)] text-white'
          : 'bg-amber-200 text-slate-900 hover:bg-amber-300'
      }`}
    >
      <span aria-hidden="true">{active ? '⏹️' : '🔊'}</span>
    </motion.button>
  );
};
