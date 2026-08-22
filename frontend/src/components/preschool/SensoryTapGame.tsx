/**
 * SensoryTapGame.tsx — « Le Monde Magique »
 * Mode Bébé (2–3 ans) : toucher n’importe où fait apparaître un emoji + un son.
 * Aucune règle, aucune erreur. Mondes thématiques (nuit, jardin, mer, fête, ferme).
 */
import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playBubblePop, resumeTownAudio } from './usePreschoolAudio';

export interface SensoryTapGameProps {
  onExit?: () => void;
  language?: 'ar' | 'fr' | 'en';
  /** Inside the Magic Board: no exit button, fills the parent. */
  embedded?: boolean;
}

interface World {
  id: string;
  emoji: string;
  labelAr: string; labelFr: string; labelEn: string;
  bg: string;
  emojis: string[];
}

const WORLDS: World[] = [
  {
    id: 'mix', emoji: '🌈',
    labelAr: 'كل شيء', labelFr: 'Tout', labelEn: 'Mix',
    bg: 'from-yellow-100 via-orange-50 to-pink-100',
    emojis: ['🐱', '🐶', '🐸', '🦊', '🐔', '🦋', '🐝', '🌟', '🎈', '🌸', '🌙', '☀️', '🍓', '🎵'],
  },
  {
    id: 'night', emoji: '🌙',
    labelAr: 'ليل', labelFr: 'Nuit', labelEn: 'Night',
    bg: 'from-indigo-200 via-violet-100 to-slate-200',
    emojis: ['⭐', '🌟', '💫', '🌙', '✨', '🪐', '🌌', '🦉'],
  },
  {
    id: 'garden', emoji: '🦋',
    labelAr: 'حديقة', labelFr: 'Jardin', labelEn: 'Garden',
    bg: 'from-green-100 via-emerald-50 to-lime-100',
    emojis: ['🦋', '🐝', '🌸', '🌺', '🌼', '🌻', '🍀', '🐞'],
  },
  {
    id: 'ocean', emoji: '🐠',
    labelAr: 'بحر', labelFr: 'Mer', labelEn: 'Sea',
    bg: 'from-sky-100 via-cyan-50 to-blue-100',
    emojis: ['🐠', '🐡', '🐬', '🌊', '🦀', '🐚', '🐋', '⭐'],
  },
  {
    id: 'farm', emoji: '🐄',
    labelAr: 'مزرعة', labelFr: 'Ferme', labelEn: 'Farm',
    bg: 'from-amber-100 via-lime-50 to-green-100',
    emojis: ['🐄', '🐑', '🐔', '🦆', '🐐', '🐴', '🐥', '🌾'],
  },
  {
    id: 'party', emoji: '🎉',
    labelAr: 'حفلة', labelFr: 'Fête', labelEn: 'Party',
    bg: 'from-pink-100 via-violet-50 to-fuchsia-100',
    emojis: ['🎉', '🎊', '🎈', '🎁', '🎵', '🥳', '🌟', '🦄'],
  },
];

interface Sparkle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

export const SensoryTapGame: React.FC<SensoryTapGameProps> = ({ onExit, language = 'fr', embedded = false }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [worldId, setWorldId] = useState(WORLDS[0].id);
  const idRef = useRef(0);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const world = WORLDS.find((w) => w.id === worldId) ?? WORLDS[0];

  const handleTap = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;

    resumeTownAudio();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const emoji = world.emojis[Math.floor(Math.random() * world.emojis.length)];
    const size = 40 + Math.floor(Math.random() * 28);
    const id = idRef.current++;

    setSparkles((prev) => [...prev, { id, x, y, emoji, size }]);
    setTapCount((n) => n + 1);
    playBubblePop();
    setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== id)), 1600);
  }, [world]);

  const hintText = t('اِضْغَطْ فِي أَيِّ مَكَان! 👆', 'Appuie n’importe où ! 👆', 'Tap anywhere! 👆');

  return (
    <div
      className={`${embedded ? 'h-full min-h-[360px] rounded-3xl' : 'min-h-screen'} bg-gradient-to-br ${world.bg} flex flex-col relative overflow-hidden
                  transition-colors duration-700 select-none`}
      onPointerDown={handleTap}
      style={{ touchAction: 'none' }}
    >
      <div className="flex items-center justify-between px-4 py-3 pointer-events-none gap-2">
        {!embedded && onExit && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto min-w-12 min-h-12 flex items-center justify-center rounded-2xl
                       bg-white shadow-md border-2 border-pink-200 text-lg font-black cursor-pointer"
            onClick={onExit}
          >
            🚪
          </motion.button>
        )}
        {embedded && <div className="w-2" />}

        <div className="flex items-center gap-2 bg-white/80 rounded-2xl px-4 py-2 shadow-md border border-white">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-black text-slate-800">{tapCount}</span>
        </div>
      </div>

      <div className="pointer-events-auto flex gap-2 overflow-x-auto px-4 pb-2">
        {WORLDS.map((w) => {
          const label = language === 'ar' ? w.labelAr : language === 'fr' ? w.labelFr : w.labelEn;
          const on = w.id === worldId;
          return (
            <motion.button
              key={w.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWorldId(w.id)}
              className={`shrink-0 px-3 py-2 rounded-2xl text-xs font-black border-2 cursor-pointer
                ${on ? 'bg-white border-pink-400 text-slate-800 shadow-md' : 'bg-white/70 border-white text-slate-600'}`}
            >
              {w.emoji} {label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute pointer-events-none select-none"
            style={{ left: s.x - s.size / 2, top: s.y - s.size / 2, fontSize: s.size }}
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{ scale: 1.4, opacity: 0, y: -140, rotate: Math.random() > 0.5 ? 30 : -30 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            {s.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {tapCount === 0 && (
          <motion.p
            className="absolute bottom-16 left-0 right-0 text-center text-base font-black text-slate-600/80 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {hintText}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tapCount > 0 && tapCount % 20 === 0 && (
          <motion.div
            key={tapCount}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ fontSize: 80 }}>🎉</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
