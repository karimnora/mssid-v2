import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { PreschoolLanguage } from '../../data/preschool/types';
import { usePreschoolMute } from './usePreschoolAudio';

interface PreschoolMuteButtonProps {
  language: PreschoolLanguage;
  className?: string;
}

/**
 * Parent-facing mute — sits in the top header next to Exit / Replay.
 * Stops TTS, SFX, loops and recorded clips; preference in localStorage.
 */
export const PreschoolMuteButton: React.FC<PreschoolMuteButtonProps> = ({
  language,
  className = '',
}) => {
  const { muted, toggle } = usePreschoolMute();
  const label = muted
    ? (language === 'ar' ? 'تفعيل الصوت' : language === 'fr' ? 'Activer le son' : 'Unmute')
    : (language === 'ar' ? 'كتم الصوت' : language === 'fr' ? 'Couper le son' : 'Mute');

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={muted}
      data-preschool-mute={muted ? 'on' : 'off'}
      className={[
        'min-h-12 min-w-12 shrink-0 flex items-center justify-center rounded-2xl shadow-md border-2 cursor-pointer transition-colors',
        muted
          ? 'bg-rose-500 border-rose-600 text-white'
          : 'bg-white border-orange-200 text-orange-800 hover:bg-orange-50',
        className,
      ].filter(Boolean).join(' ')}
    >
      {muted ? <VolumeX className="w-5 h-5" strokeWidth={2.5} /> : <Volume2 className="w-5 h-5" strokeWidth={2.5} />}
    </motion.button>
  );
};
