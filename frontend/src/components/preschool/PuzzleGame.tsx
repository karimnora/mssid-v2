/**
 * PuzzleGame.tsx
 * "أَلْغَازُ دِيدُو / Le Puzzle de Dido"
 * Tap-to-select + tap-to-place emoji jigsaw puzzle.
 * 4 levels: 2×2 → 3×2 → 3×3 → 4×3 pieces.
 * Works on mobile (tap) and desktop (drag + tap).
 * Fully integrated with LevelSelectScreen + useLevelProgress.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';

export interface PuzzleGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

// ── Data types ────────────────────────────────────────────────────────────────
interface PuzzlePiece {
  id: string;
  emoji: string;
  bg: string;    // CSS background color for this tile
  row: number;
  col: number;
}

interface PuzzleLevel {
  cols: number;
  rows: number;
  titleAr: string; titleFr: string; titleEn: string;
  pieces: PuzzlePiece[];
  hasTimer: boolean;
  timerSecs: number;
}

// ── Level definitions ─────────────────────────────────────────────────────────
const ALL_LEVELS: PuzzleLevel[] = [
  // ── L1: 2×2 "La Belle Mer"
  {
    cols: 2, rows: 2,
    titleAr: 'البَحْرُ الجَمِيل', titleFr: 'La Belle Mer', titleEn: 'The Beautiful Sea',
    hasTimer: false, timerSecs: 0,
    pieces: [
      { id: 'p0', emoji: '☀️', bg: '#FEF9C3', row: 0, col: 0 },
      { id: 'p1', emoji: '🌈', bg: '#E0F2FE', row: 0, col: 1 },
      { id: 'p2', emoji: '🌊', bg: '#BAE6FD', row: 1, col: 0 },
      { id: 'p3', emoji: '🐚', bg: '#F0FDF4', row: 1, col: 1 },
    ],
  },
  // ── L2: 3×2 "La Joyeuse Ferme"
  {
    cols: 3, rows: 2,
    titleAr: 'المَزْرَعَةُ السَّعِيدَة', titleFr: 'La Joyeuse Ferme', titleEn: 'The Happy Farm',
    hasTimer: false, timerSecs: 0,
    pieces: [
      { id: 'p0', emoji: '☀️', bg: '#FEF9C3', row: 0, col: 0 },
      { id: 'p1', emoji: '🌤️', bg: '#E0F2FE', row: 0, col: 1 },
      { id: 'p2', emoji: '🌳', bg: '#D1FAE5', row: 0, col: 2 },
      { id: 'p3', emoji: '🐄', bg: '#F3F4F6', row: 1, col: 0 },
      { id: 'p4', emoji: '🐑', bg: '#EDE9FE', row: 1, col: 1 },
      { id: 'p5', emoji: '🌾', bg: '#FEF3C7', row: 1, col: 2 },
    ],
  },
  // ── L3: 3×3 "La Forêt Magique" (timed)
  {
    cols: 3, rows: 3,
    titleAr: 'الغَابَةُ السَّحْرِيَّة', titleFr: 'La Forêt Magique', titleEn: 'The Magic Forest',
    hasTimer: true, timerSecs: 90,
    pieces: [
      { id: 'p0', emoji: '☀️', bg: '#FEF9C3', row: 0, col: 0 },
      { id: 'p1', emoji: '☁️', bg: '#E0F2FE', row: 0, col: 1 },
      { id: 'p2', emoji: '🦅', bg: '#BFDBFE', row: 0, col: 2 },
      { id: 'p3', emoji: '🌲', bg: '#D1FAE5', row: 1, col: 0 },
      { id: 'p4', emoji: '🦊', bg: '#FEF3C7', row: 1, col: 1 },
      { id: 'p5', emoji: '🌲', bg: '#D1FAE5', row: 1, col: 2 },
      { id: 'p6', emoji: '🌿', bg: '#A7F3D0', row: 2, col: 0 },
      { id: 'p7', emoji: '🐿️', bg: '#FDE68A', row: 2, col: 1 },
      { id: 'p8', emoji: '🌸', bg: '#FCE7F3', row: 2, col: 2 },
    ],
  },
  // ── L4: 4×3 "Mon Algérie" (timed, challenge)
  {
    cols: 4, rows: 3,
    titleAr: 'وَطَنِي الجَزَائِر', titleFr: 'Mon Algérie', titleEn: 'My Algeria',
    hasTimer: true, timerSecs: 120,
    pieces: [
      { id: 'p0',  emoji: '☀️', bg: '#FEF9C3', row: 0, col: 0 },
      { id: 'p1',  emoji: '🌤️', bg: '#E0F2FE', row: 0, col: 1 },
      { id: 'p2',  emoji: '🕌', bg: '#EDE9FE', row: 0, col: 2 },
      { id: 'p3',  emoji: '🏔️', bg: '#F3F4F6', row: 0, col: 3 },
      { id: 'p4',  emoji: '🌴', bg: '#D1FAE5', row: 1, col: 0 },
      { id: 'p5',  emoji: '🐪', bg: '#FEF3C7', row: 1, col: 1 },
      { id: 'p6',  emoji: '🏛️', bg: '#DBEAFE', row: 1, col: 2 },
      { id: 'p7',  emoji: '🌊', bg: '#BAE6FD', row: 1, col: 3 },
      { id: 'p8',  emoji: '🌺', bg: '#FCE7F3', row: 2, col: 0 },
      { id: 'p9',  emoji: '🦊', bg: '#FDE68A', row: 2, col: 1 },
      { id: 'p10', emoji: '🎭', bg: '#FECACA', row: 2, col: 2 },
      { id: 'p11', emoji: '🇩🇿', bg: '#D1FAE5', row: 2, col: 3 },
    ],
  },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🌊', diffLabel: '⭐',
    titleAr: 'البَحْرُ الجَمِيل',     titleFr: 'La Belle Mer',        titleEn: 'The Beautiful Sea',
    descAr:  '4 قِطَع — سَهْل',      descFr:  '4 pièces — facile',    descEn:  '4 pieces — easy',
    gradient: 'from-sky-400 to-blue-500' },
  { level: 2, emoji: '🌾', diffLabel: '⭐⭐',
    titleAr: 'المَزْرَعَةُ السَّعِيدَة', titleFr: 'La Joyeuse Ferme',  titleEn: 'The Happy Farm',
    descAr:  '6 قِطَع',               descFr:  '6 pièces',              descEn:  '6 pieces',
    gradient: 'from-emerald-400 to-green-500' },
  { level: 3, emoji: '🌲', diffLabel: '⭐⭐⭐',
    titleAr: 'الغَابَةُ السَّحْرِيَّة', titleFr: 'La Forêt Magique',   titleEn: 'The Magic Forest',
    descAr:  '9 قِطَع + مُؤَقِّت',   descFr:  '9 pièces + chrono',     descEn:  '9 pieces + timer',
    gradient: 'from-teal-500 to-emerald-600' },
  { level: 4, emoji: '🇩🇿', diffLabel: '🏆',
    titleAr: 'وَطَنِي الجَزَائِر',    titleFr: 'Mon Algérie',          titleEn: 'My Algeria',
    descAr:  '12 قِطْعَة — تَحَدِّي', descFr:  '12 pièces — défi!',    descEn:  '12 pieces — challenge!',
    gradient: 'from-green-600 to-emerald-700' },
];

// ── Piece size per total count ─────────────────────────────────────────────────
const PIECE_SIZES: Record<number, number> = { 4: 90, 6: 82, 9: 72, 12: 64 };

// ── Web Audio ─────────────────────────────────────────────────────────────────
function playBeep(ctx: AudioContext, type: 'correct' | 'wrong' | 'win') {
  try {
    if (type === 'correct') {
      [523, 784].forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = 'sine';
        const t = ctx.currentTime + i * 0.09;
        g.gain.setValueAtTime(0.28, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.start(t); o.stop(t + 0.2);
      });
    } else if (type === 'wrong') {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 220; o.type = 'sawtooth';
      g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.start(); o.stop(ctx.currentTime + 0.28);
    } else {
      [523, 659, 784, 1047, 1318].forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f; o.type = 'triangle';
        const t = ctx.currentTime + i * 0.1;
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.start(t); o.stop(t + 0.28);
      });
    }
  } catch { /* silence */ }
}

// ── Helper: shuffle array ─────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Main component ────────────────────────────────────────────────────────────
export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('puzzle', 4);
  const [phase, setPhase]       = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('أَلْغَازُ دِيدُو', 'Le Puzzle de Dido', 'Dido\'s Puzzle')}
        gameIcon="🧩"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={lvl => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map(d => ({
          ...d,
          unlocked: d.level <= maxUnlocked,
          earnedStars: stars[d.level] ?? 0,
        }))}
      />
    );
  }

  return (
    <PuzzleBoard
      key={`board-${activeLevel}`}
      level={ALL_LEVELS[activeLevel - 1]}
      levelNum={activeLevel}
      language={language}
      onExit={() => setPhase('select')}
      onComplete={(earnedStars) => {
        completeLevel(activeLevel, earnedStars);
        setPhase('select');
      }}
    />
  );
};

// ── Puzzle board ──────────────────────────────────────────────────────────────
interface BoardProps {
  level: PuzzleLevel;
  levelNum: number;
  language: 'ar' | 'fr' | 'en';
  onExit: () => void;
  onComplete: (stars: number) => void;
}

const PuzzleBoard: React.FC<BoardProps> = ({ level, levelNum, language, onExit, onComplete }) => {
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const pieceSize = PIECE_SIZES[level.pieces.length] ?? 64;
  const fontSize  = Math.round(pieceSize * 0.54);
  const gap       = 4;

  // ── State ─────────────────────────────────────────────────────────────────
  const [trayOrder] = useState<PuzzlePiece[]>(() => shuffle(level.pieces));
  // Map slotKey → pieceId for placed pieces
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null); // piece id in tray
  const [shakingSlot, setShakingSlot] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [timeLeft, setTimeLeft]   = useState<number>(level.timerSecs);
  const [timerActive, setTimerActive] = useState(level.hasTimer);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const placedCount = Object.keys(placed).length;
  const totalPieces = level.pieces.length;

  // Board slots sorted top-left → bottom-right
  const boardSlots = useMemo(
    () => [...level.pieces].sort((a, b) => a.row * 100 + a.col - (b.row * 100 + b.col)),
    [level]
  );

  // Unplaced pieces still in tray
  const trayPieces = trayOrder.filter(p => !Object.values(placed).includes(p.id));

  // Slot refs for drag-drop collision detection
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  }, []);

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!timerActive || won) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      setWon(true);
      playBeep(getCtx(), 'win');
      setTimeout(() => onComplete(1), 2500);
      return;
    }
    const id = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(id);
  }, [timerActive, timeLeft, won]);

  // ── Win check ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (placedCount === totalPieces && !won) {
      setWon(true);
      setTimerActive(false);
      playBeep(getCtx(), 'win');
      // Stars: L1/L2 = 3; L3/L4 based on remaining time
      let earnedStars = 3;
      if (level.hasTimer) {
        const ratio = timeLeft / level.timerSecs;
        earnedStars = ratio > 0.6 ? 3 : ratio > 0.25 ? 2 : 1;
      }
      setTimeout(() => onComplete(earnedStars), 2500);
    }
  }, [placedCount, totalPieces, won]);

  // ── Tap-to-select a tray piece ────────────────────────────────────────────
  const handlePieceTap = (pieceId: string) => {
    if (won) return;
    setSelected(prev => prev === pieceId ? null : pieceId);
  };

  // ── Tap a board slot (with selected piece) ────────────────────────────────
  const handleSlotTap = (row: number, col: number) => {
    if (won || !selected) return;
    const slotKey = `${row}-${col}`;
    if (placed[slotKey]) { setSelected(null); return; }

    const piece = level.pieces.find(p => p.id === selected)!;
    if (piece.row === row && piece.col === col) {
      setPlaced(prev => ({ ...prev, [slotKey]: selected }));
      setSelected(null);
      playBeep(getCtx(), 'correct');
    } else {
      setShakingSlot(slotKey);
      setTimeout(() => setShakingSlot(null), 600);
      playBeep(getCtx(), 'wrong');
      setSelected(null);
    }
  };

  // ── Drag-end fallback (desktop UX) ────────────────────────────────────────
  const handleDragEnd = (pieceId: string, event: MouseEvent | TouchEvent | PointerEvent) => {
    if (won) return;
    const clientX = ('clientX' in event) ? event.clientX : (event as TouchEvent).changedTouches?.[0]?.clientX ?? 0;
    const clientY = ('clientY' in event) ? event.clientY : (event as TouchEvent).changedTouches?.[0]?.clientY ?? 0;

    for (const [slotKey, el] of Object.entries(slotRefs.current)) {
      if (!el || placed[slotKey]) continue;
      const rect = el.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        const [row, col] = slotKey.split('-').map(Number);
        const piece = level.pieces.find(p => p.id === pieceId)!;
        if (piece.row === row && piece.col === col) {
          setPlaced(prev => ({ ...prev, [slotKey]: pieceId }));
          setSelected(null);
          playBeep(getCtx(), 'correct');
        } else {
          setShakingSlot(slotKey);
          setTimeout(() => setShakingSlot(null), 600);
          playBeep(getCtx(), 'wrong');
          setSelected(null);
        }
        return;
      }
    }
    setSelected(null);
  };

  // ── Colors ────────────────────────────────────────────────────────────────
  const selectedBg = '#FEF08A'; // amber-200

  // ── Timer display ─────────────────────────────────────────────────────────
  const timerColor = timeLeft < 20 ? '#EF4444' : timeLeft < 45 ? '#F59E0B' : '#22C55E';

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-violet-100 via-sky-50 to-emerald-50
                 flex flex-col items-center px-3 pb-8 gap-4"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-2xl flex items-center justify-between pt-4 gap-2">
        <button
          onClick={onExit}
          className="min-w-12 min-h-12 flex items-center justify-center rounded-2xl
                     bg-white shadow-md text-2xl border border-violet-200
                     hover:bg-violet-50 transition-all active:scale-95"
        >🚪</button>

        <div className="flex-1 text-center">
          <p className="text-lg font-black text-violet-900">
            🧩 {language === 'ar' ? level.titleAr : language === 'fr' ? level.titleFr : level.titleEn}
          </p>
          <p className="text-xs font-bold text-violet-600/70">
            {t(`المستوى ${levelNum}`, `Niveau ${levelNum}`, `Level ${levelNum}`)}
            {' · '}
            {placedCount}/{totalPieces} {t('قطع', 'pièces', 'pieces')}
          </p>
        </div>

        {/* Preview hint */}
        <button
          onPointerDown={() => setShowPreview(true)}
          onPointerUp={() => setShowPreview(false)}
          onPointerLeave={() => setShowPreview(false)}
          className="min-w-12 min-h-12 flex items-center justify-center rounded-2xl
                     bg-white shadow-md text-2xl border border-amber-200
                     hover:bg-amber-50 transition-all active:scale-95 select-none"
          title={t('اضغط لرؤية الصورة', 'Maintenez pour voir l\'image', 'Hold to preview')}
        >💡</button>
      </div>

      {/* ── Timer ─────────────────────────────────────────────────────────── */}
      {level.hasTimer && !won && (
        <div
          className="text-2xl font-black tabular-nums"
          style={{ color: timerColor }}
        >
          ⏱️ {timeLeft}s
        </div>
      )}

      {/* ── Puzzle board ──────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Preview overlay */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 rounded-2xl flex items-center justify-center
                         backdrop-blur-sm bg-white/50 pointer-events-none"
            >
              <span className="text-lg font-black text-violet-900 bg-white/80 px-4 py-2 rounded-full shadow">
                {t('الصورة الكاملة 🔍', 'Image complète 🔍', 'Full image 🔍')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${level.cols}, ${pieceSize}px)`,
            gridTemplateRows:    `repeat(${level.rows}, ${pieceSize}px)`,
            gap: `${gap}px`,
          }}
        >
          {boardSlots.map(piece => {
            const slotKey = `${piece.row}-${piece.col}`;
            const placedPieceId = placed[slotKey];
            const placedPiece   = placedPieceId
              ? level.pieces.find(p => p.id === placedPieceId)
              : null;
            const isShaking = shakingSlot === slotKey;
            const isEmpty   = !placedPiece;

            return (
              <motion.div
                key={slotKey}
                ref={el => { slotRefs.current[slotKey] = el; }}
                style={{
                  width: pieceSize, height: pieceSize,
                  background: placedPiece ? placedPiece.bg
                    : showPreview ? `${piece.bg}88`
                    : 'rgba(99,102,241,0.10)',
                  fontSize: fontSize,
                  cursor: isEmpty && selected ? 'pointer' : 'default',
                  borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `3px ${placedPiece ? 'solid' : 'dashed'} ${
                    placedPiece ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.35)'}`,
                  boxShadow: placedPiece ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                  transition: 'background 0.2s, border 0.2s',
                  userSelect: 'none',
                }}
                animate={isShaking ? { x: [0, -9, 9, -9, 9, 0] } : placedPiece ? { scale: [1, 1.18, 1] } : {}}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                onClick={() => isEmpty && handleSlotTap(piece.row, piece.col)}
                whileTap={isEmpty && selected ? { scale: 0.94 } : {}}
              >
                {placedPiece ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    style={{ lineHeight: 1 }}
                  >
                    {placedPiece.emoji}
                  </motion.span>
                ) : (
                  <span style={{ opacity: showPreview ? 0.7 : 0.25, lineHeight: 1, fontSize: fontSize * 0.8 }}>
                    {showPreview ? piece.emoji : '?'}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Instruction ───────────────────────────────────────────────────── */}
      <p className="text-sm font-bold text-violet-700/70 text-center px-2">
        {selected
          ? t('✅ اِلمَسْ خَانَةً فِي اللَّوحَة!', '✅ Touche une case sur le plateau !', '✅ Tap a slot on the board!')
          : t('👆 اِلمَسْ قِطْعَةً مِنَ الصِّينِيَّة', '👆 Touche une pièce dans le plateau', '👆 Tap a piece from the tray')}
      </p>

      {/* ── Tray of draggable / tappable pieces ──────────────────────────── */}
      <div className="w-full max-w-2xl bg-white/70 rounded-3xl shadow-inner border border-violet-100 p-4">
        <p className="text-xs font-black text-violet-500/70 mb-3 text-center tracking-wide uppercase">
          {t('الصِّينِيَّة', 'Plateau', 'Tray')}
          {' · '}
          {trayPieces.length} {t('قِطَع مُتَبَقِّيَة', 'pièces restantes', 'pieces left')}
        </p>

        <AnimatePresence>
          <div className="flex flex-wrap gap-3 justify-center">
            {trayPieces.map(piece => {
              const isSelected = selected === piece.id;
              return (
                <motion.div
                  key={piece.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0.15}
                  onDragEnd={(e: MouseEvent | TouchEvent | PointerEvent) => handleDragEnd(piece.id, e)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: isSelected ? 1.12 : 1,
                    opacity: 1,
                    boxShadow: isSelected
                      ? '0 0 0 4px #F59E0B, 0 6px 20px rgba(0,0,0,0.22)'
                      : '0 2px 10px rgba(0,0,0,0.15)',
                  }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  whileHover={{ scale: isSelected ? 1.12 : 1.07 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handlePieceTap(piece.id)}
                  style={{
                    width: pieceSize, height: pieceSize,
                    background: isSelected ? selectedBg : piece.bg,
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: fontSize,
                    cursor: 'grab',
                    border: `3px solid ${isSelected ? '#F59E0B' : 'rgba(0,0,0,0.08)'}`,
                    userSelect: 'none',
                    zIndex: isSelected ? 20 : 1,
                    position: 'relative',
                  }}
                >
                  {piece.emoji}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {trayPieces.length === 0 && !won && (
          <p className="text-center text-3xl animate-bounce">🎉</p>
        )}
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="w-full max-w-md">
        <div className="h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-400 to-emerald-400 rounded-full"
            animate={{ width: `${(placedCount / totalPieces) * 100}%` }}
            transition={{ type: 'spring', stiffness: 150 }}
          />
        </div>
      </div>

      {/* ── Win overlay ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl px-8 py-8 shadow-2xl text-center max-w-xs mx-4 space-y-4">
              <div className="text-6xl">🏆</div>
              <h2 className="text-2xl font-black text-violet-900">
                {t('أَحْسَنْت!', 'Bravo !', 'Well done!')}
              </h2>
              <p className="text-violet-600 font-bold">
                {t('رَكَّبْتَ الأَلْغَازَ بِنَجَاح!', 'Tu as assemblé le puzzle !', 'You assembled the puzzle!')}
              </p>
              <div className="flex justify-center gap-1 text-3xl">
                {'⭐⭐⭐'.split('').map((s, i) => (
                  <motion.span key={i} initial={{ scale: 0 }}
                    animate={{ scale: 1 }} transition={{ delay: i * 0.18, type: 'spring', stiffness: 300 }}>
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
