/**
 * SensoryTapGame.tsx
 * Mode Bébé (2-3 ans) : toucher n'importe où génère un animal/emoji animé + son.
 * Aucune règle, aucune erreur possible — pure découverte cause-effet.
 */
import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface SensoryTapGameProps {
  onExit?: () => void;
  language?: 'ar' | 'fr' | 'en';
}

const EMOJIS = [
  '🐱', '🐶', '🐸', '🦁', '🐨', '🦊', '🐷', '🐔', '🐺', '🐼',
  '🐻', '🦄', '🐯', '🐭', '🐮', '🦋', '🐝', '🦀', '🐬', '🦒',
  '🌟', '⭐', '✨', '🌈', '🎈', '🌸', '🌺', '🍭', '🎉', '🎊',
  '💫', '🌻', '🎵', '🎶', '🍦', '🍓', '🌙', '☀️', '❄️', '🔮',
];

const BG_GRADIENTS = [
  'from-yellow-100 via-orange-50 to-pink-100',
  'from-sky-100 via-blue-50 to-indigo-100',
  'from-green-100 via-emerald-50 to-teal-100',
  'from-purple-100 via-violet-50 to-pink-100',
  'from-rose-100 via-orange-50 to-yellow-100',
];

interface Sparkle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
}

function playBoing() {
  try {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return;
    const ctx = new C();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const freqs = [440, 523, 659, 784, 880, 1046];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.35);
  } catch {}
}

export const SensoryTapGame: React.FC<SensoryTapGameProps> = ({ onExit, language = 'fr' }) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [bgIdx, setBgIdx] = useState(0);
  const idRef = useRef(0);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const handleTap = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Don't trigger on the Back button
    if ((e.target as HTMLElement).closest('button')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const size = 36 + Math.floor(Math.random() * 32); // 36–68px
    const id = idRef.current++;

    setSparkles(prev => [...prev, { id, x, y, emoji, size }]);
    setTapCount(prev => {
      const next = prev + 1;
      if (next % 8 === 0) setBgIdx(i => (i + 1) % BG_GRADIENTS.length);
      return next;
    });

    playBoing();
    setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 1600);
  }, []);

  const hintText = t(
    'اِضْغَطْ فِي أَيِّ مَكَان! 👆',
    'Appuie n\'importe où ! 👆',
    'Tap anywhere! 👆',
  );

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${BG_GRADIENTS[bgIdx]} flex flex-col relative overflow-hidden
                  transition-colors duration-700 select-none`}
      onPointerDown={handleTap}
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 pointer-events-none">
        <button
          className="pointer-events-auto min-w-12 min-h-12 flex items-center justify-center rounded-2xl
                     bg-white/80 shadow-md border border-white/50 text-lg font-black active:scale-95
                     cursor-pointer transition-all"
          onClick={onExit}
        >
          🚪
        </button>

        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs rounded-2xl px-4 py-2 shadow-md border border-white/50">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-black text-orange-900">{tapCount}</span>
        </div>
      </div>

      {/* Floating sparkles */}
      <AnimatePresence>
        {sparkles.map(s => (
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

      {/* Hint — fades after first tap */}
      <AnimatePresence>
        {tapCount === 0 && (
          <motion.p
            className="absolute bottom-16 left-0 right-0 text-center text-base font-black text-orange-600/70 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {hintText}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Milestone celebrations */}
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
