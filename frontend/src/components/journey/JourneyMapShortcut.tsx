import React from 'react';
import { motion } from 'motion/react';
import { useLocaleContext } from '../../context/LocaleContext';
import './journeyMapShortcut.css';

/**
 * Free home: a little folded map in the bottom corner (left in Arabic, the side opposite the reading
 * start) that opens Didou's journey map directly; « back » on the map returns to this home.
 * Family Premium opens on the planet itself, so it does not need this shortcut.
 */
export const JourneyMapShortcut: React.FC<{ onOpen: () => void; /** false: no map for this grade yet, the shortcut opens the planet. */ hasMap?: boolean }> = ({ onOpen, hasMap = true }) => {
  const { locale } = useLocaleContext();
  const fr = locale === 'fr';
  return (
    <motion.button
      type="button"
      data-journey-map-shortcut
      onClick={onOpen}
      initial={{ opacity: 0, y: 24, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 320, damping: 20, delay: 0.6 }}
      aria-label={hasMap ? (fr ? 'Ouvrir la carte du voyage de Didou' : 'افتح خريطة رحلة ديدو') : (fr ? 'Ouvrir la planète de Didou' : 'افتح كوكب ديدو')}
      className="journey-map-shortcut fixed z-40 end-4 flex flex-col items-center gap-1 cursor-pointer"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 104px)' }}
    >
      <span className="block w-[76px] h-[76px] rounded-[22px] p-1.5 bg-gradient-to-b from-[#ffe9a8] to-[#f5b301] shadow-[0_8px_0_#b77900,0_14px_24px_rgba(8,12,52,0.45)] border-2 border-white/80">
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="jms-paper" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff8e6" />
              <stop offset="1" stopColor="#f1dcae" />
            </linearGradient>
          </defs>
          {/* folded paper map in three panels */}
          <path d="M6 12 L22 6 L42 12 L58 6 V52 L42 58 L22 52 L6 58Z" fill="url(#jms-paper)" stroke="#8a5a1f" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 6 V52 M42 12 V58" stroke="#c99a52" strokeWidth="1.5" />
          <path d="M6 12 L22 6 V52 L6 58Z" fill="#000" opacity="0.06" />
          <path d="M42 12 L58 6 V52 L42 58Z" fill="#000" opacity="0.06" />
          {/* sea, dunes and the dotted route */}
          <path d="M8 20 Q14 18 20 21" stroke="#62b6e8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M44 44 Q50 40 56 44" stroke="#d89a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path className="jms-route" d="M12 48 Q18 34 28 36 T40 26 T52 16" stroke="#d6283b" strokeWidth="2.5" strokeDasharray="1 5" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="48" r="3.4" fill="#0f8a4b" stroke="#fff" strokeWidth="1.3" />
          <circle cx="28" cy="36" r="3" fill="#2f6fe0" stroke="#fff" strokeWidth="1.3" />
          <circle cx="40" cy="26" r="3" fill="#2f6fe0" stroke="#fff" strokeWidth="1.3" />
          {/* Didou's flag at the next stop */}
          <g transform="translate(50 6)">
            <path d="M2 12 V0" stroke="#6b4a2a" strokeWidth="1.8" />
            <path className="jms-flag" d="M2 0 H11 L8 3.5 L11 7 H2Z" fill="#d6283b" />
          </g>
          <circle cx="52" cy="17" r="3.6" fill="#ffd23f" stroke="#8a5a1f" strokeWidth="1.3" />
        </svg>
      </span>
      <span className="rounded-full bg-[#13206b]/90 text-white text-[11px] font-extrabold px-2.5 py-0.5 shadow">
        {hasMap ? (fr ? 'Carte de Didou' : 'خَرِيطَةُ دِيدُو') : (fr ? 'Planète Didou' : 'كَوْكَبُ دِيدُو')}
      </span>
    </motion.button>
  );
};
