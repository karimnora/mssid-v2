import { useActivityExitGuard } from '../../context/ActivityExitContext';
/**
 * PuzzleGame.tsx — « Le Puzzle de Dido »
 * Puzzle à fantômes (comme un trieur en bois) : chaque case montre
 * en transparence la pièce qui y va. Pièces toutes différentes.
 * Glisser (PanInfo) ou toucher-puis-poser. 4 tableaux.
 */
import { useDelayedCompletion } from '../../hooks/useDelayedCompletion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';
import {
  playBubblePop,
  playGentleNudge,
  playModuleCompleteFanfare,
  resumeTownAudio,
  usePreschoolSpeech,
} from './usePreschoolAudio';

export interface PuzzleGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface PuzzlePiece {
  id: string;
  emoji: string;
  bg: string;
  row: number;
  col: number;
}

interface PuzzleLevel {
  cols: number;
  rows: number;
  titleAr: string; titleFr: string; titleEn: string;
  missionAr: string; missionFr: string; missionEn: string;
  pieces: PuzzlePiece[];
}

const tile = (id: string, emoji: string, bg: string, row: number, col: number): PuzzlePiece =>
  ({ id, emoji, bg, row, col });

const ALL_LEVELS: PuzzleLevel[] = [
  {
    cols: 2, rows: 2,
    titleAr: 'البَحْرُ الجَمِيل', titleFr: 'La Belle Mer', titleEn: 'The Beautiful Sea',
    missionAr: 'ضَعْ كُلَّ صُورَةٍ فَوْقَ ظِلِّهَا!',
    missionFr: 'Pose chaque image sur son ombre !',
    missionEn: 'Put each picture on its shadow!',
    pieces: [
      tile('p0', '☀️', '#FEF9C3', 0, 0),
      tile('p1', '⛵', '#E0F2FE', 0, 1),
      tile('p2', '🌊', '#BAE6FD', 1, 0),
      tile('p3', '🐚', '#F0FDF4', 1, 1),
    ],
  },
  {
    cols: 3, rows: 2,
    titleAr: 'المَزْرَعَةُ السَّعِيدَة', titleFr: 'La Joyeuse Ferme', titleEn: 'The Happy Farm',
    missionAr: 'أَعِدِ الْحَيَوَانَاتِ إِلَى الْمَزْرَعَة!',
    missionFr: 'Remets les animaux à la ferme !',
    missionEn: 'Put the animals back on the farm!',
    pieces: [
      tile('p0', '☀️', '#FEF9C3', 0, 0),
      tile('p1', '🌳', '#D1FAE5', 0, 1),
      tile('p2', '🏠', '#E0F2FE', 0, 2),
      tile('p3', '🐄', '#F3F4F6', 1, 0),
      tile('p4', '🐑', '#EDE9FE', 1, 1),
      tile('p5', '🐔', '#FEF3C7', 1, 2),
    ],
  },
  {
    cols: 3, rows: 3,
    titleAr: 'الْوَاحَة', titleFr: 'L’Oasis', titleEn: 'The Oasis',
    missionAr: 'رَكِّبْ صُورَةَ الْوَاحَة!',
    missionFr: 'Assemble l’image de l’oasis !',
    missionEn: 'Assemble the oasis picture!',
    pieces: [
      tile('p0', '☀️', '#FEF9C3', 0, 0),
      tile('p1', '☁️', '#E0F2FE', 0, 1),
      tile('p2', '🦅', '#BFDBFE', 0, 2),
      tile('p3', '🌴', '#D1FAE5', 1, 0),
      tile('p4', '🐪', '#FEF3C7', 1, 1),
      tile('p5', '🫒', '#ECFCCB', 1, 2),
      tile('p6', '🦊', '#FDE68A', 2, 0),
      tile('p7', '🏜️', '#FDE68A', 2, 1),
      tile('p8', '💧', '#BAE6FD', 2, 2),
    ],
  },
  {
    cols: 4, rows: 3,
    titleAr: 'وَطَنِي الجَزَائِر', titleFr: 'Mon Algérie', titleEn: 'My Algeria',
    missionAr: 'رَكِّبْ صُورَةَ بِلَادِنَا!',
    missionFr: 'Assemble le tableau de notre pays !',
    missionEn: 'Assemble the picture of our country!',
    pieces: [
      tile('p0',  '☀️', '#FEF9C3', 0, 0),
      tile('p1',  '🕌', '#EDE9FE', 0, 1),
      tile('p2',  '🏔️', '#F3F4F6', 0, 2),
      tile('p3',  '🍋', '#FEF9C3', 0, 3),
      tile('p4',  '🌴', '#D1FAE5', 1, 0),
      tile('p5',  '🐪', '#FEF3C7', 1, 1),
      tile('p6',  '⛵', '#BAE6FD', 1, 2),
      tile('p7',  '🌊', '#7DD3FC', 1, 3),
      tile('p8',  '🐑', '#F3F4F6', 2, 0),
      tile('p9',  '🦊', '#FDE68A', 2, 1),
      tile('p10', '🫒', '#ECFCCB', 2, 2),
      tile('p11', '🇩🇿', '#BBF7D0', 2, 3),
    ],
  },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '⛵', diffLabel: '⭐',
    titleAr: 'البَحْرُ الجَمِيل', titleFr: 'La Belle Mer', titleEn: 'The Beautiful Sea',
    descAr: '4 قطع — ظلّ واضح', descFr: '4 pièces — l’ombre t’aide', descEn: '4 pieces — the shadow helps',
    gradient: 'from-sky-400 to-blue-500' },
  { level: 2, emoji: '🐄', diffLabel: '⭐',
    titleAr: 'المَزْرَعَةُ السَّعِيدَة', titleFr: 'La Joyeuse Ferme', titleEn: 'The Happy Farm',
    descAr: '6 قطع', descFr: '6 pièces', descEn: '6 pieces',
    gradient: 'from-emerald-400 to-green-500' },
  { level: 3, emoji: '🌴', diffLabel: '⭐⭐',
    titleAr: 'الْوَاحَة', titleFr: 'L’Oasis', titleEn: 'The Oasis',
    descAr: '9 قطع — واحة الجزائر', descFr: '9 pièces — oasis d’Algérie', descEn: '9 pieces — Algerian oasis',
    gradient: 'from-amber-400 to-yellow-600' },
  { level: 4, emoji: '🇩🇿', diffLabel: '🏆',
    titleAr: 'وَطَنِي الجَزَائِر', titleFr: 'Mon Algérie', titleEn: 'My Algeria',
    descAr: '12 قطعة', descFr: '12 pièces', descEn: '12 pieces',
    gradient: 'from-green-600 to-emerald-700' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const starsFromMistakes = (mistakes: number) => {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
};

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('puzzle', 4);
  const [phase, setPhase] = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('بَازِلُ دِيدُو', 'Le puzzle de Dido', 'Dido\'s puzzle')}
        gameIcon="🧩"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={(lvl) => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map((d) => ({
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
      language={language}
      onExit={() => setPhase('select')}
      onComplete={(earnedStars) => {
        completeLevel(activeLevel, earnedStars);
        setPhase('select');
      }}
    />
  );
};

const PuzzleBoard: React.FC<{
  level: PuzzleLevel;
  language: 'ar' | 'fr' | 'en';
  onExit: () => void;
  onComplete: (stars: number) => void;
}> = ({ level, language, onExit, onComplete }) => {
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const { speak } = usePreschoolSpeech(language);
  const mission = t(level.missionAr, level.missionFr, level.missionEn);

  const [trayOrder] = useState<PuzzlePiece[]>(() => shuffle(level.pieces));
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [shakingSlot, setShakingSlot] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const requestLeave = useActivityExitGuard(!won, language);
  const [earnedStars, setEarnedStars] = useState(3);
  const [mistakes, setMistakes] = useState(0);
  const draggedRef = useRef(false);
  const completeLater = useDelayedCompletion();
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const placedCount = Object.keys(placed).length;
  const totalPieces = level.pieces.length;

  const boardSlots = useMemo(
    () => [...level.pieces].sort((a, b) => a.row * 100 + a.col - (b.row * 100 + b.col)),
    [level]
  );
  const trayPieces = trayOrder.filter((p) => !Object.values(placed).includes(p.id));

  useEffect(() => {
    const id = window.setTimeout(() => {
      resumeTownAudio();
      speak(mission);
    }, 350);
    return () => window.clearTimeout(id);
  }, [mission, speak]);

  const tryPlace = useCallback((pieceId: string, row: number, col: number) => {
    if (won) return;
    const slotKey = `${row}-${col}`;
    if (placed[slotKey]) return;

    const piece = level.pieces.find((p) => p.id === pieceId);
    if (!piece) return;

    if (piece.row === row && piece.col === col) {
      playBubblePop();
      const next = { ...placed, [slotKey]: pieceId };
      setPlaced(next);
      setSelected(null);
      if (Object.keys(next).length === totalPieces) {
        const stars = starsFromMistakes(mistakes);
        setEarnedStars(stars);
        setWon(true);
        playModuleCompleteFanfare();
        completeLater(() => onComplete(stars), 1800);
      }
    } else {
      playGentleNudge();
      setMistakes((n) => n + 1);
      setShakingSlot(slotKey);
      setTimeout(() => setShakingSlot(null), 500);
      setSelected(null);
    }
  }, [won, placed, level.pieces, totalPieces, mistakes, onComplete, completeLater]);

  const handleDragEnd = (pieceId: string, info: PanInfo) => {
    const { x, y } = info.point;
    for (const [slotKey, el] of Object.entries(slotRefs.current)) {
      if (!el || placed[slotKey]) continue;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        const [row, col] = slotKey.split('-').map(Number);
        tryPlace(pieceId, row, col);
        return;
      }
    }
    setSelected(null);
  };

  const title = language === 'ar' ? level.titleAr : language === 'fr' ? level.titleFr : level.titleEn;

  return (
    <div
      className="preschool-safe-top min-h-screen bg-[#F8F9FA] flex flex-col items-center px-4 pb-8 gap-5"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-2xl flex items-center justify-between pt-4 gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => requestLeave(onExit)}
          className="min-w-12 min-h-12 flex items-center justify-center rounded-2xl
                     bg-white shadow-md text-2xl border-2 border-amber-200 cursor-pointer"
        >
          🚪
        </motion.button>

        <div className="flex-1 text-center">
          <p className="text-lg font-black text-slate-800">🧩 {title}</p>
          <p className="text-xs font-bold text-slate-500">
            {placedCount}/{totalPieces} {t('قطع', 'pièces', 'pieces')}
          </p>
        </div>
        <div className="w-12" />
      </div>

      <div className="w-full max-w-2xl flex items-center justify-center gap-3 px-2">
        <p className="text-base sm:text-lg font-black text-slate-800 text-center leading-snug">{mission}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { resumeTownAudio(); speak(mission); }}
          className="min-h-12 min-w-12 shrink-0 rounded-2xl bg-white shadow-md border-2 border-amber-200 text-2xl cursor-pointer"
          aria-label={t('استمع', 'Écouter', 'Listen')}
        >
          🔊
        </motion.button>
      </div>

      <div className="w-full max-w-md h-2.5 rounded-full bg-amber-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-amber-400"
          animate={{ width: `${(placedCount / totalPieces) * 100}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        />
      </div>

      <div
        className="w-full max-w-[360px] sm:max-w-[420px] grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))` }}
      >
        {boardSlots.map((piece) => {
          const slotKey = `${piece.row}-${piece.col}`;
          const placedPieceId = placed[slotKey];
          const placedPiece = placedPieceId
            ? level.pieces.find((p) => p.id === placedPieceId)
            : null;
          const isEmpty = !placedPiece;

          return (
            <motion.div
              key={slotKey}
              ref={(el) => { slotRefs.current[slotKey] = el; }}
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl sm:text-4xl
                border-[3px] ${placedPiece ? 'border-amber-300 shadow-md' : 'border-dashed border-slate-300'}
                ${isEmpty && selected ? 'cursor-pointer' : ''}`}
              style={{ background: placedPiece ? placedPiece.bg : `${piece.bg}66` }}
              animate={shakingSlot === slotKey ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => { if (isEmpty && selected) tryPlace(selected, piece.row, piece.col); }}
              whileTap={isEmpty && selected ? { scale: 0.94 } : {}}
            >
              {placedPiece ? (
                <motion.span
                  initial={{ scale: 0, rotate: -16 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                >
                  {placedPiece.emoji}
                </motion.span>
              ) : (
                <span className="opacity-35 select-none" aria-hidden>{piece.emoji}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-sm font-bold text-slate-500 text-center px-2">
        {selected
          ? t('ضَعْهَا عَلَى الظِّلِّ الْمُمَاثِل', 'Pose-la sur la même ombre', 'Place it on the matching shadow')
          : t('اِلْمَسْ أَوِ اسْحَبْ قِطْعَةً', 'Touche ou glisse une pièce', 'Tap or drag a piece')}
      </p>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-md border-2 border-amber-100 p-4">
        <div className="flex flex-wrap gap-3 justify-center min-h-16">
          <AnimatePresence>
            {trayPieces.map((piece) => {
              const isSelected = selected === piece.id;
              return (
                <motion.div
                  key={piece.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0.12}
                  onDragStart={() => {
                    draggedRef.current = true;
                    resumeTownAudio();
                    setSelected(piece.id);
                  }}
                  onDragEnd={(_, info) => handleDragEnd(piece.id, info)}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: isSelected ? 1.08 : 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (draggedRef.current) {
                      draggedRef.current = false;
                      return;
                    }
                    setSelected((prev) => (prev === piece.id ? null : piece.id));
                  }}
                  className={`w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl flex items-center justify-center
                    text-3xl cursor-grab active:cursor-grabbing select-none border-[3px]
                    ${isSelected ? 'border-amber-400 shadow-lg' : 'border-slate-200 shadow-md'}`}
                  style={{
                    background: isSelected ? '#FEF08A' : piece.bg,
                    touchAction: 'none',
                    zIndex: isSelected ? 20 : 1,
                  }}
                >
                  {piece.emoji}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40"
          >
            <div className="bg-white rounded-3xl px-8 py-8 shadow-2xl text-center max-w-xs mx-4 space-y-3 border-2 border-amber-200">
              <div className="text-5xl">🏆</div>
              <h2 className="text-2xl font-black text-slate-800">
                {t('أَحْسَنْت!', 'Bravo !', 'Well done!')}
              </h2>
              <p className="text-slate-500 font-bold">
                {t('رَكَّبْتَ الصُّورَة!', 'Tu as assemblé l’image !', 'You assembled the picture!')}
              </p>
              <div className="flex justify-center gap-1 text-3xl">
                {[1, 2, 3].map((n) => (
                  <motion.span
                    key={n}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, opacity: n <= earnedStars ? 1 : 0.25 }}
                    transition={{ delay: n * 0.12, type: 'spring', stiffness: 300 }}
                  >
                    ⭐
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
