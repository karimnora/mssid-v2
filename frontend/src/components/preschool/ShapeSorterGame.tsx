import { useActivityExitGuard } from '../../context/ActivityExitContext';
/**
 * ShapeSorterGame.tsx — « Range les formes »
 * 8 niveaux : couleurs, formes (cœur, losange), tailles, défi chronométré.
 * Glisser-déposer souris + tactile (framer-motion).
 */
import { useDelayedCompletion } from '../../hooks/useDelayedCompletion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

export interface ShapeSorterGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

type Color = 'red' | 'blue' | 'yellow' | 'green' | 'orange';
type Shape = 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond';
type Size = 'big' | 'small';
type SortBy = 'color' | 'shape' | 'size';
type BinKey = Color | Shape | Size;

interface Piece {
  id: string;
  shape: Shape;
  color: Color;
  size: Size;
  sorted?: boolean;
}

const COLOR_HEX: Record<Color, string> = {
  red: '#ef4444', blue: '#3b82f6', yellow: '#fbbf24', green: '#22c55e', orange: '#fb923c',
};
const COLOR_BORDER: Record<Color, string> = {
  red: 'border-red-400', blue: 'border-sky-400', yellow: 'border-amber-400',
  green: 'border-emerald-400', orange: 'border-orange-400',
};
const COLOR_LIGHT: Record<Color, string> = {
  red: 'bg-red-50', blue: 'bg-sky-50', yellow: 'bg-amber-50',
  green: 'bg-emerald-50', orange: 'bg-orange-50',
};
const SHAPE_EMOJI: Record<Shape, string> = {
  circle: '⬤', square: '■', triangle: '▲', star: '★', heart: '♥', diamond: '◆',
};
const LABEL = {
  shape: {
    circle:   { ar: 'دائرة', fr: 'Cercle',   en: 'Circle'   },
    square:   { ar: 'مربع',  fr: 'Carré',    en: 'Square'   },
    triangle: { ar: 'مثلث',  fr: 'Triangle', en: 'Triangle' },
    star:     { ar: 'نجمة',  fr: 'Étoile',   en: 'Star'     },
    heart:    { ar: 'قلب',   fr: 'Cœur',     en: 'Heart'    },
    diamond:  { ar: 'معين',  fr: 'Losange',  en: 'Diamond'  },
  } as Record<Shape, Record<'ar' | 'fr' | 'en', string>>,
  color: {
    red:    { ar: 'أحمر',  fr: 'Rouge',  en: 'Red'    },
    blue:   { ar: 'أزرق',  fr: 'Bleu',   en: 'Blue'   },
    yellow: { ar: 'أصفر',  fr: 'Jaune',  en: 'Yellow' },
    green:  { ar: 'أخضر',  fr: 'Vert',   en: 'Green'  },
    orange: { ar: 'برتقالي', fr: 'Orange', en: 'Orange' },
  } as Record<Color, Record<'ar' | 'fr' | 'en', string>>,
  size: {
    big:   { ar: 'كبير', fr: 'Grand', en: 'Big'   },
    small: { ar: 'صغير', fr: 'Petit', en: 'Small' },
  } as Record<Size, Record<'ar' | 'fr' | 'en', string>>,
};

interface LevelCfg {
  pieces: Piece[];
  sortBy: SortBy;
  bins: BinKey[];
  hasTimer: boolean;
  timerSecs: number;
  emoji: string;
  missionAr: string;
  missionFr: string;
  missionEn: string;
}

const p = (id: string, shape: Shape, color: Color, size: Size = 'big'): Piece =>
  ({ id, shape, color, size });

const ALL_LEVELS: LevelCfg[] = [
  {
    sortBy: 'color', bins: ['red', 'blue'], hasTimer: false, timerSecs: 0, emoji: '🔵',
    missionAr: 'ضَعِ الْأَحْمَرَ مَعَ الْأَحْمَر، وَالْأَزْرَقَ مَعَ الْأَزْرَق!',
    missionFr: 'Mets le rouge avec le rouge, et le bleu avec le bleu !',
    missionEn: 'Put red with red, and blue with blue!',
    pieces: [
      p('1a', 'circle', 'red'), p('1b', 'square', 'red'),
      p('1c', 'triangle', 'blue'), p('1d', 'star', 'blue'),
    ],
  },
  {
    sortBy: 'color', bins: ['red', 'blue', 'yellow'], hasTimer: false, timerSecs: 0, emoji: '💛',
    missionAr: 'ثَلَاثُ أَلْوَان: أَحْمَر، أَزْرَق، أَصْفَر!',
    missionFr: 'Trois couleurs : rouge, bleu, jaune !',
    missionEn: 'Three colors: red, blue, yellow!',
    pieces: [
      p('2a', 'circle', 'red'), p('2b', 'star', 'red'),
      p('2c', 'square', 'blue'), p('2d', 'triangle', 'blue'),
      p('2e', 'circle', 'yellow'), p('2f', 'triangle', 'yellow'),
    ],
  },
  {
    sortBy: 'color', bins: ['red', 'blue', 'yellow', 'green'], hasTimer: false, timerSecs: 0, emoji: '🎨',
    missionAr: 'أَرْبَعَةُ أَلْوَان! ضَعْ كُلَّ لَوْنٍ فِي صُنْدُوقِهِ.',
    missionFr: 'Quatre couleurs ! Glisse chaque pièce dans sa boîte.',
    missionEn: 'Four colors! Drag each piece into its box.',
    pieces: [
      p('3a', 'circle', 'red'), p('3b', 'star', 'red'),
      p('3c', 'square', 'blue'), p('3d', 'triangle', 'blue'),
      p('3e', 'circle', 'yellow'), p('3f', 'triangle', 'yellow'),
      p('3g', 'square', 'green'), p('3h', 'star', 'green'),
    ],
  },
  {
    sortBy: 'shape', bins: ['circle', 'square'], hasTimer: false, timerSecs: 0, emoji: '⬜',
    missionAr: 'اُنْظُرْ إِلَى الشَّكْل: دَائِرَة أَوْ مُرَبَّع!',
    missionFr: 'Regarde la forme : cercle ou carré !',
    missionEn: 'Look at the shape: circle or square!',
    pieces: [
      p('4a', 'circle', 'red'), p('4b', 'circle', 'blue'), p('4c', 'circle', 'yellow'),
      p('4d', 'square', 'green'), p('4e', 'square', 'orange'), p('4f', 'square', 'red'),
    ],
  },
  {
    sortBy: 'shape', bins: ['circle', 'square', 'triangle', 'star'], hasTimer: false, timerSecs: 0, emoji: '🔺',
    missionAr: 'الشَّكْلُ لَا اللَّوْن! دَائِرَة، مُرَبَّع، مُثَلَّث، نَجْمَة.',
    missionFr: 'La forme, pas la couleur ! Cercle, carré, triangle, étoile.',
    missionEn: 'Shape, not color! Circle, square, triangle, star.',
    pieces: [
      p('5a', 'circle', 'red'), p('5b', 'circle', 'blue'),
      p('5c', 'square', 'yellow'), p('5d', 'square', 'green'),
      p('5e', 'triangle', 'orange'), p('5f', 'triangle', 'blue'),
      p('5g', 'star', 'yellow'), p('5h', 'star', 'green'),
    ],
  },
  {
    sortBy: 'shape', bins: ['heart', 'diamond'], hasTimer: false, timerSecs: 0, emoji: '💜',
    missionAr: 'شَكْلَانِ جَدِيدَان: قَلْب وَمُعَيَّن!',
    missionFr: 'Deux nouvelles formes : le cœur et le losange !',
    missionEn: 'Two new shapes: heart and diamond!',
    pieces: [
      p('6a', 'heart', 'red'), p('6b', 'heart', 'orange'), p('6c', 'heart', 'yellow'), p('6d', 'heart', 'blue'),
      p('6e', 'diamond', 'green'), p('6f', 'diamond', 'blue'), p('6g', 'diamond', 'orange'), p('6h', 'diamond', 'red'),
    ],
  },
  {
    sortBy: 'size', bins: ['big', 'small'], hasTimer: false, timerSecs: 0, emoji: '🐘',
    missionAr: 'الْكَبِيرُ مَعَ الْكَبِير، وَالصَّغِيرُ مَعَ الصَّغِير!',
    missionFr: 'Les grands avec les grands, les petits avec les petits !',
    missionEn: 'Big with big, small with small!',
    pieces: [
      p('7a', 'circle', 'red', 'big'), p('7b', 'circle', 'blue', 'small'),
      p('7c', 'square', 'yellow', 'big'), p('7d', 'star', 'green', 'small'),
      p('7e', 'heart', 'orange', 'big'), p('7f', 'triangle', 'blue', 'small'),
      p('7g', 'diamond', 'red', 'big'), p('7h', 'heart', 'yellow', 'small'),
    ],
  },
  {
    sortBy: 'color', bins: ['red', 'blue', 'yellow', 'green'], hasTimer: true, timerSecs: 70, emoji: '⏱️',
    missionAr: 'أَسْرِع! فَرِّزِ الْأَلْوَانَ قَبْلَ انْتِهَاءِ الْوَقْت!',
    missionFr: 'Vite ! Trie les couleurs avant la fin du temps !',
    missionEn: 'Hurry! Sort the colors before time runs out!',
    pieces: [
      p('8a', 'circle', 'red'), p('8b', 'square', 'red'), p('8c', 'heart', 'red'),
      p('8d', 'triangle', 'blue'), p('8e', 'circle', 'blue'), p('8f', 'diamond', 'blue'),
      p('8g', 'star', 'yellow'), p('8h', 'triangle', 'yellow'), p('8i', 'heart', 'yellow'),
      p('8j', 'square', 'green'), p('8k', 'star', 'green'), p('8l', 'diamond', 'green'),
    ],
  },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🔵', diffLabel: '⭐',
    titleAr: 'أحمر وأزرق', titleFr: 'Rouge et bleu', titleEn: 'Red and blue',
    descAr: 'لونان فقط', descFr: 'Deux couleurs seulement', descEn: 'Just two colors',
    gradient: 'from-red-400 to-blue-500' },
  { level: 2, emoji: '💛', diffLabel: '⭐',
    titleAr: 'ثلاثة ألوان', titleFr: 'Trois couleurs', titleEn: 'Three colors',
    descAr: 'أحمر، أزرق، أصفر', descFr: 'Rouge, bleu, jaune', descEn: 'Red, blue, yellow',
    gradient: 'from-amber-400 to-yellow-500' },
  { level: 3, emoji: '🎨', diffLabel: '⭐⭐',
    titleAr: 'أربعة ألوان', titleFr: 'Quatre couleurs', titleEn: 'Four colors',
    descAr: 'أضف الأخضر', descFr: 'Le vert s’ajoute', descEn: 'Green joins in',
    gradient: 'from-emerald-400 to-teal-500' },
  { level: 4, emoji: '⬜', diffLabel: '⭐⭐',
    titleAr: 'دائرة ومربع', titleFr: 'Cercle et carré', titleEn: 'Circle and square',
    descAr: 'انظر إلى الشكل', descFr: 'Regarde la forme', descEn: 'Look at the shape',
    gradient: 'from-sky-400 to-indigo-500' },
  { level: 5, emoji: '🔺', diffLabel: '⭐⭐',
    titleAr: 'أربعة أشكال', titleFr: 'Quatre formes', titleEn: 'Four shapes',
    descAr: 'الشكل لا اللون', descFr: 'La forme, pas la couleur', descEn: 'Shape, not color',
    gradient: 'from-violet-400 to-fuchsia-500' },
  { level: 6, emoji: '💜', diffLabel: '⭐⭐⭐',
    titleAr: 'قلب ومعين', titleFr: 'Cœur et losange', titleEn: 'Heart and diamond',
    descAr: 'شكلان جديدان', descFr: 'Deux nouvelles formes', descEn: 'Two new shapes',
    gradient: 'from-rose-400 to-pink-500' },
  { level: 7, emoji: '🐘', diffLabel: '⭐⭐⭐',
    titleAr: 'كبير وصغير', titleFr: 'Grand et petit', titleEn: 'Big and small',
    descAr: 'فرّز حسب الحجم', descFr: 'Trie selon la taille', descEn: 'Sort by size',
    gradient: 'from-lime-400 to-green-600' },
  { level: 8, emoji: '⏱️', diffLabel: '🏆',
    titleAr: 'تحدّي الوقت', titleFr: 'Course contre la montre', titleEn: 'Beat the clock',
    descAr: '12 قطعة في 70 ثانية', descFr: '12 pièces en 70 secondes', descEn: '12 pieces in 70 seconds',
    gradient: 'from-amber-500 to-orange-600' },
];

const ShapeSVG: React.FC<{ shape: Shape; fill: string; size?: number }> = ({ shape, fill, size = 52 }) => {
  const c = size / 2;
  const shine = 'rgba(255,255,255,0.32)';
  switch (shape) {
    case 'circle':
      return (
        <svg width={size} height={size} aria-hidden>
          <circle cx={c} cy={c} r={c - 4} fill={fill} />
          <ellipse cx={c - 6} cy={c - 8} rx={7} ry={11} fill={shine} />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} aria-hidden>
          <rect x={4} y={4} width={size - 8} height={size - 8} rx={8} fill={fill} />
          <rect x={9} y={8} width={12} height={18} rx={4} fill={shine} />
        </svg>
      );
    case 'triangle': {
      const pts = `${c},5 ${size - 5},${size - 5} 5,${size - 5}`;
      return (
        <svg width={size} height={size} aria-hidden>
          <polygon points={pts} fill={fill} />
          <polygon points={`${c},13 ${c + 9},27 ${c - 9},27`} fill="rgba(255,255,255,0.22)" />
        </svg>
      );
    }
    case 'star': {
      const star = (cx: number, cy: number, r: number, ir: number) => {
        let d = '';
        for (let i = 0; i < 10; i++) {
          const a = (Math.PI * i) / 5 - Math.PI / 2;
          const rad = i % 2 === 0 ? r : ir;
          d += `${i === 0 ? 'M' : 'L'}${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
        }
        return `${d}Z`;
      };
      return (
        <svg width={size} height={size} aria-hidden>
          <path d={star(c, c, c - 4, c * 0.4)} fill={fill} />
          <path d={star(c - 5, c - 5, 8, 3.5)} fill="rgba(255,255,255,0.25)" />
        </svg>
      );
    }
    case 'heart': {
      const d = `M ${c} ${size - 7}
        C ${c - size * 0.45} ${c + 4}, ${c - size * 0.42} ${c - size * 0.34}, ${c} ${c - size * 0.04}
        C ${c + size * 0.42} ${c - size * 0.34}, ${c + size * 0.45} ${c + 4}, ${c} ${size - 7} Z`;
      return (
        <svg width={size} height={size} aria-hidden>
          <path d={d} fill={fill} />
          <ellipse cx={c - 6} cy={c - 4} rx={6} ry={8} fill={shine} />
        </svg>
      );
    }
    case 'diamond':
      return (
        <svg width={size} height={size} aria-hidden>
          <polygon points={`${c},5 ${size - 5},${c} ${c},${size - 5} 5,${c}`} fill={fill} />
          <polygon points={`${c},14 ${c + 8},${c} ${c},22 ${c - 8},${c}`} fill="rgba(255,255,255,0.22)" />
        </svg>
      );
  }
};

const pieceKey = (piece: Piece, sortBy: SortBy): BinKey => {
  if (sortBy === 'color') return piece.color;
  if (sortBy === 'shape') return piece.shape;
  return piece.size;
};

const binLabel = (bin: BinKey, sortBy: SortBy, language: 'ar' | 'fr' | 'en') => {
  if (sortBy === 'color') return LABEL.color[bin as Color][language];
  if (sortBy === 'shape') return LABEL.shape[bin as Shape][language];
  return LABEL.size[bin as Size][language];
};

const starsFrom = (mistakes: number, hasTimer: boolean, timeLeft: number, timerSecs: number) => {
  if (hasTimer) {
    if (timeLeft <= 0) return 1;
    const elapsed = timerSecs - timeLeft;
    const timeStars = elapsed < timerSecs * 0.5 ? 3 : elapsed < timerSecs * 0.75 ? 2 : 1;
    return Math.max(1, timeStars - (mistakes >= 4 ? 1 : 0));
  }
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
};

export const ShapeSorterGame: React.FC<ShapeSorterGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('shape_sorter', 8);
  const unlockedCap = (stars[4] ?? 0) > 0 ? Math.max(maxUnlocked, 5) : maxUnlocked;
  const [phase, setPhase] = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('رَتِّبِ الْأَشْكَال', 'Range les formes', 'Sort the shapes')}
        gameIcon="🧩"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={(lvl) => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map((d) => ({
          ...d,
          unlocked: d.level <= unlockedCap,
          earnedStars: stars[d.level] ?? 0,
        }))}
      />
    );
  }

  return (
    <GameBoard
      key={`board-${activeLevel}`}
      cfg={ALL_LEVELS[activeLevel - 1]}
      language={language}
      onExit={() => setPhase('select')}
      onComplete={(earnedStars) => {
        completeLevel(activeLevel, earnedStars);
        setPhase('select');
      }}
    />
  );
};

const GameBoard: React.FC<{
  cfg: LevelCfg;
  language: 'ar' | 'fr' | 'en';
  onExit: () => void;
  onComplete: (stars: number) => void;
}> = ({ cfg, language, onExit, onComplete }) => {
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const { speak } = usePreschoolSpeech(language);
  const mission = t(cfg.missionAr, cfg.missionFr, cfg.missionEn);

  const [pieces, setPieces] = useState<Piece[]>(() => [...cfg.pieces].sort(() => Math.random() - 0.5));
  const [shaking, setShaking] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const requestLeave = useActivityExitGuard(!won, language);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cfg.timerSecs);
  const [timerActive, setTimerActive] = useState(cfg.hasTimer);
  const binRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const completeLater = useDelayedCompletion();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const id = window.setTimeout(() => {
      resumeTownAudio();
      speak(mission);
    }, 350);
    return () => window.clearTimeout(id);
  }, [mission, speak]);

  useEffect(() => {
    if (!timerActive || won) return;
    if (timeLeft <= 0) {
      onComplete(1);
      return;
    }
    const id = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerActive, won]); // eslint-disable-line react-hooks/exhaustive-deps

  const spokenName = (piece: Piece) => {
    if (cfg.sortBy === 'color') return LABEL.color[piece.color][language];
    if (cfg.sortBy === 'shape') return LABEL.shape[piece.shape][language];
    return LABEL.size[piece.size][language];
  };

  const checkDrop = useCallback((pieceId: string, info: PanInfo) => {
    const piece = pieces.find((x) => x.id === pieceId);
    if (!piece || piece.sorted) return;

    const { x, y } = info.point;
    let matchedBin: string | null = null;
    for (const binKey of Object.keys(binRefs.current)) {
      const el = binRefs.current[binKey];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        matchedBin = binKey;
        break;
      }
    }
    if (!matchedBin) return;

    if (pieceKey(piece, cfg.sortBy) === matchedBin) {
      playBubblePop();
      speak(spokenName(piece));
      const next = pieces.map((x) => (x.id === pieceId ? { ...x, sorted: true } : x));
      setPieces(next);
      if (next.every((x) => x.sorted)) {
        setWon(true);
        setTimerActive(false);
        playModuleCompleteFanfare();
        const earned = starsFrom(mistakes, cfg.hasTimer, timeLeft, cfg.timerSecs);
        completeLater(() => onComplete(earned), 1500);
      }
    } else {
      playGentleNudge();
      setMistakes((n) => n + 1);
      setShaking(pieceId);
      setTimeout(() => setShaking(null), 600);
    }
  }, [pieces, cfg, timeLeft, mistakes, onComplete, speak, language, completeLater]); // eslint-disable-line react-hooks/exhaustive-deps

  const unsorted = pieces.filter((x) => !x.sorted);
  const doneCount = pieces.length - unsorted.length;
  const binGrid =
    cfg.bins.length <= 2 ? 'grid-cols-2'
      : cfg.bins.length === 3 ? 'grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-4';

  return (
    <div dir={dir} className="preschool-safe-top min-h-screen bg-[#F8F9FA] flex flex-col items-center py-4 px-4 sm:px-6 gap-5">
      <div className="w-full max-w-3xl flex items-center justify-between gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => requestLeave(onExit)}
          className="bg-white shadow-md border-2 border-violet-200 text-slate-800 text-sm px-4 py-2 rounded-2xl font-black cursor-pointer"
        >
          🚪 {t('خروج', 'Retour', 'Back')}
        </motion.button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-black text-slate-800">
            {cfg.emoji} {t('رَتِّبِ الْأَشْكَال', 'Range les formes', 'Sort the shapes')}
          </span>
          <span className="text-xs text-slate-500 font-bold">
            {doneCount} / {pieces.length} {t('تم', 'triés', 'sorted')}
          </span>
        </div>
        {cfg.hasTimer ? (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-black text-sm border-2
            ${timeLeft <= 10 ? 'bg-orange-100 border-orange-500 text-orange-800 animate-pulse' : 'bg-white border-amber-300 text-amber-800'}`}>
            ⏱️ {timeLeft}s
          </div>
        ) : (
          <div className="w-16" />
        )}
      </div>

      <div className="w-full max-w-3xl flex items-center justify-center gap-3 px-2">
        <p className="text-base sm:text-lg font-black text-slate-800 text-center leading-snug">{mission}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { resumeTownAudio(); speak(mission); }}
          className="min-h-12 min-w-12 shrink-0 rounded-2xl bg-white shadow-md border-2 border-violet-200 text-2xl cursor-pointer"
          aria-label={t('استمع', 'Écouter', 'Listen')}
        >
          🔊
        </motion.button>
      </div>

      <div className="w-full max-w-3xl h-2.5 rounded-full bg-violet-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-violet-400"
          animate={{ width: `${(doneCount / pieces.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        />
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-full max-w-lg bg-white text-slate-800 rounded-3xl p-5 text-center shadow-xl border-2 border-violet-200"
          >
            <p className="text-3xl font-black">🎉 {t('أحسنت!', 'Bravo !', 'Well done!')}</p>
            <p className="text-sm font-bold text-slate-500 mt-1">
              {t('فرزت كل الأشكال! 🌟', 'Tu as tout trié ! 🌟', 'You sorted everything! 🌟')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-3xl bg-white rounded-3xl p-4 sm:p-5 shadow-md border-2 border-violet-100 min-h-28">
        <div className="flex flex-wrap gap-3 justify-center">
          <AnimatePresence>
            {unsorted.map((piece) => {
              const svgSize = cfg.sortBy === 'size' ? (piece.size === 'big' ? 62 : 36) : 52;
              return (
                <motion.div
                  key={piece.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0.1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  whileDrag={{ scale: 1.18, zIndex: 50, rotate: 6 }}
                  animate={shaking === piece.id ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
                  transition={shaking === piece.id ? { duration: 0.45 } : { type: 'spring', stiffness: 260, damping: 18 }}
                  onDragStart={() => resumeTownAudio()}
                  onDragEnd={(_, info) => checkDrop(piece.id, info)}
                  className="cursor-grab active:cursor-grabbing select-none flex flex-col items-center gap-1 p-2.5 rounded-3xl bg-[#F8F9FA] shadow-md border-2 border-violet-100"
                  style={{ touchAction: 'none' }}
                >
                  <ShapeSVG shape={piece.shape} fill={COLOR_HEX[piece.color]} size={svgSize} />
                  <span className="text-[10px] font-black" style={{ color: COLOR_HEX[piece.color] }}>
                    {spokenName(piece)}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className={`w-full max-w-3xl grid ${binGrid} gap-3`}>
        {cfg.bins.map((binKey) => {
          const isColorBin = cfg.sortBy === 'color';
          const sortedHere = pieces.filter((x) => x.sorted && pieceKey(x, cfg.sortBy) === binKey);
          const hex = isColorBin ? COLOR_HEX[binKey as Color]
            : cfg.sortBy === 'size' && binKey === 'big' ? '#64748b'
              : cfg.sortBy === 'size' ? '#94a3b8'
                : '#8b5cf6';
          const label = binLabel(binKey, cfg.sortBy, language);

          return (
            <div
              key={binKey}
              ref={(el) => { binRefs.current[binKey] = el; }}
              className={`min-h-28 rounded-3xl border-4 flex flex-col items-center p-3 gap-2
                ${isColorBin
                  ? `${COLOR_BORDER[binKey as Color]} ${COLOR_LIGHT[binKey as Color]}`
                  : 'border-violet-200 bg-white'}`}
            >
              <div
                className="w-full py-1.5 rounded-2xl flex items-center justify-center gap-1"
                style={{ backgroundColor: `${hex}22` }}
              >
                {cfg.sortBy === 'shape' && (
                  <span className="text-sm" style={{ color: hex }}>{SHAPE_EMOJI[binKey as Shape]}</span>
                )}
                {cfg.sortBy === 'size' && (
                  <span className="text-lg">{binKey === 'big' ? '🐘' : '🐭'}</span>
                )}
                <span className="text-xs font-black text-slate-800">{label}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center min-h-8">
                {sortedHere.map((piece) => (
                  <motion.div
                    key={piece.id}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                  >
                    <ShapeSVG
                      shape={piece.shape}
                      fill={COLOR_HEX[piece.color]}
                      size={cfg.sortBy === 'size' ? (piece.size === 'big' ? 34 : 22) : 28}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
