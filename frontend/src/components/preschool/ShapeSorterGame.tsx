/**
 * ShapeSorterGame.tsx
 * 4 niveaux : L1 tri par couleur 2 paniers, L2 tri couleur 4 paniers,
 * L3 tri par forme 4 paniers, L4 couleur 4 paniers + minuteur 60 s.
 * Drag cross-platform via framer-motion (souris ET tactile).
 */
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';

export interface ShapeSorterGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

type Color = 'red' | 'blue' | 'yellow' | 'green';
type Shape = 'circle' | 'square' | 'triangle' | 'star';

interface Piece { id: string; shape: Shape; color: Color; sorted?: boolean; }

const COLOR_HEX: Record<Color, string> = {
  red: '#ef4444', blue: '#3b82f6', yellow: '#fbbf24', green: '#22c55e',
};
const COLOR_BG: Record<Color, string> = {
  red: 'bg-red-400', blue: 'bg-blue-400', yellow: 'bg-amber-400', green: 'bg-green-400',
};
const COLOR_BORDER: Record<Color, string> = {
  red: 'border-red-500', blue: 'border-blue-500', yellow: 'border-amber-500', green: 'border-green-500',
};
const COLOR_LIGHT: Record<Color, string> = {
  red: 'bg-red-50', blue: 'bg-blue-50', yellow: 'bg-amber-50', green: 'bg-green-50',
};
const SHAPE_EMOJI: Record<Shape, string> = { circle: '⬤', square: '■', triangle: '▲', star: '★' };
const LABEL = {
  shape: {
    circle:   { ar: 'دائرة', fr: 'Cercle',   en: 'Circle'   },
    square:   { ar: 'مربع',  fr: 'Carré',    en: 'Square'   },
    triangle: { ar: 'مثلث',  fr: 'Triangle', en: 'Triangle' },
    star:     { ar: 'نجمة',  fr: 'Étoile',   en: 'Star'     },
  } as Record<Shape, Record<'ar'|'fr'|'en', string>>,
  color: {
    red:    { ar: 'أحمر', fr: 'Rouge',  en: 'Red'    },
    blue:   { ar: 'أزرق', fr: 'Bleu',   en: 'Blue'   },
    yellow: { ar: 'أصفر', fr: 'Jaune',  en: 'Yellow' },
    green:  { ar: 'أخضر', fr: 'Vert',   en: 'Green'  },
  } as Record<Color, Record<'ar'|'fr'|'en', string>>,
};

// ── Level configs ────────────────────────────────────────────────────────────
type SortBy = 'color' | 'shape';
interface LevelCfg {
  pieces: Piece[];
  sortBy: SortBy;
  bins: (Color | Shape)[];
  hasTimer: boolean;
  timerSecs: number;
}
const ALL_LEVELS: LevelCfg[] = [
  // L1 – 4 pieces, 2 colors, sort by color
  {
    pieces: [
      { id: 'r1', shape: 'circle',   color: 'red'  },
      { id: 'r2', shape: 'square',   color: 'red'  },
      { id: 'b1', shape: 'triangle', color: 'blue' },
      { id: 'b2', shape: 'star',     color: 'blue' },
    ],
    sortBy: 'color', bins: ['red', 'blue'], hasTimer: false, timerSecs: 0,
  },
  // L2 – 8 pieces, 4 colors, sort by color
  {
    pieces: [
      { id: 'r1', shape: 'circle',   color: 'red'    },
      { id: 'r2', shape: 'star',     color: 'red'    },
      { id: 'b1', shape: 'square',   color: 'blue'   },
      { id: 'b2', shape: 'triangle', color: 'blue'   },
      { id: 'y1', shape: 'circle',   color: 'yellow' },
      { id: 'y2', shape: 'triangle', color: 'yellow' },
      { id: 'g1', shape: 'square',   color: 'green'  },
      { id: 'g2', shape: 'star',     color: 'green'  },
    ],
    sortBy: 'color', bins: ['red', 'blue', 'yellow', 'green'], hasTimer: false, timerSecs: 0,
  },
  // L3 – 8 pieces, 4 shapes, sort by shape
  {
    pieces: [
      { id: 'c1', shape: 'circle',   color: 'red'    },
      { id: 'c2', shape: 'circle',   color: 'blue'   },
      { id: 's1', shape: 'square',   color: 'yellow' },
      { id: 's2', shape: 'square',   color: 'green'  },
      { id: 't1', shape: 'triangle', color: 'red'    },
      { id: 't2', shape: 'triangle', color: 'blue'   },
      { id: 'k1', shape: 'star',     color: 'yellow' },
      { id: 'k2', shape: 'star',     color: 'green'  },
    ],
    sortBy: 'shape', bins: ['circle', 'square', 'triangle', 'star'], hasTimer: false, timerSecs: 0,
  },
  // L4 – 12 pieces, 4 colors, sort by color, 60 s timer
  {
    pieces: [
      { id: 'r1', shape: 'circle',   color: 'red'    },
      { id: 'r2', shape: 'square',   color: 'red'    },
      { id: 'r3', shape: 'star',     color: 'red'    },
      { id: 'b1', shape: 'triangle', color: 'blue'   },
      { id: 'b2', shape: 'circle',   color: 'blue'   },
      { id: 'b3', shape: 'square',   color: 'blue'   },
      { id: 'y1', shape: 'star',     color: 'yellow' },
      { id: 'y2', shape: 'triangle', color: 'yellow' },
      { id: 'y3', shape: 'circle',   color: 'yellow' },
      { id: 'g1', shape: 'square',   color: 'green'  },
      { id: 'g2', shape: 'star',     color: 'green'  },
      { id: 'g3', shape: 'triangle', color: 'green'  },
    ],
    sortBy: 'color', bins: ['red', 'blue', 'yellow', 'green'], hasTimer: true, timerSecs: 60,
  },
];
const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🔵', diffLabel: '⭐',
    titleAr: 'سهل – 2 ألوان',        titleFr: 'Facile – 2 couleurs',       titleEn: 'Easy – 2 colors',
    descAr:  'فرّز بالون وأزرق',     descFr:  'Trie rouge et bleu',        descEn:  'Sort red and blue',
    gradient: 'from-violet-400 to-purple-500' },
  { level: 2, emoji: '🎨', diffLabel: '⭐⭐',
    titleAr: 'متوسط – 4 ألوان',       titleFr: 'Moyen – 4 couleurs',        titleEn: 'Medium – 4 colors',
    descAr:  'فرّز الأشكال بالألوان', descFr:  'Trie par couleurs',         descEn:  'Sort by colors',
    gradient: 'from-purple-500 to-fuchsia-600' },
  { level: 3, emoji: '🔺', diffLabel: '⭐⭐⭐',
    titleAr: 'صعب – فرّز حسب الشكل',    titleFr: 'Difficile – trie par forme',  titleEn: 'Hard – sort by shape',
    descAr:  'ركّز على الشكل لا اللون', descFr:  'Regarde la forme pas la couleur', descEn:  'Focus on shape not color',
    gradient: 'from-fuchsia-500 to-pink-600' },
  { level: 4, emoji: '⏱️', diffLabel: '🏆',
    titleAr: 'تحدي – 12 قطعة في 60 ث!',  titleFr: 'Défi – 12 pièces en 60 s !', titleEn: 'Challenge – 12 pieces in 60 s!',
    descAr:  'الوقت ينفد! فرّز بسرعة',   descFr:  'Le temps presse ! Dépêche-toi', descEn:  'Time runs out! Sort fast',
    gradient: 'from-amber-500 to-orange-600' },
];

// ── SVG shape renderer ───────────────────────────────────────────────────────
const ShapeSVG: React.FC<{ shape: Shape; fill: string; size?: number }> = ({ shape, fill, size = 52 }) => {
  const c = size / 2;
  switch (shape) {
    case 'circle':
      return <svg width={size} height={size}><circle cx={c} cy={c} r={c - 4} fill={fill} /><ellipse cx={c - 6} cy={c - 8} rx={7} ry={11} fill="rgba(255,255,255,0.35)" /></svg>;
    case 'square':
      return <svg width={size} height={size}><rect x={4} y={4} width={size - 8} height={size - 8} rx={8} fill={fill} /><rect x={9} y={8} width={12} height={18} rx={4} fill="rgba(255,255,255,0.28)" /></svg>;
    case 'triangle': {
      const pts = `${c},5 ${size - 5},${size - 5} 5,${size - 5}`;
      return <svg width={size} height={size}><polygon points={pts} fill={fill} /><polygon points={`${c},13 ${c + 9},27 ${c - 9},27`} fill="rgba(255,255,255,0.22)" /></svg>;
    }
    case 'star': {
      const star = (cx: number, cy: number, r: number, ir: number) => {
        const n = 5; let d = '';
        for (let i = 0; i < n * 2; i++) {
          const a = (Math.PI * i) / n - Math.PI / 2;
          const rad = i % 2 === 0 ? r : ir;
          d += `${i === 0 ? 'M' : 'L'}${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
        }
        return d + 'Z';
      };
      return <svg width={size} height={size}><path d={star(c, c, c - 4, c * 0.4)} fill={fill} /><path d={star(c - 5, c - 5, 8, 3.5)} fill="rgba(255,255,255,0.25)" /></svg>;
    }
  }
};

// ── Main component ───────────────────────────────────────────────────────────
export const ShapeSorterGame: React.FC<ShapeSorterGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('shape_sorter', 4);
  const [phase, setPhase]   = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('فرّز الأشكال', 'Trieur de Formes', 'Shape Sorter')}
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
    <GameBoard
      key={`board-${activeLevel}`}
      cfg={ALL_LEVELS[activeLevel - 1]}
      level={activeLevel}
      language={language}
      onExit={() => setPhase('select')}
      onComplete={(earnedStars) => {
        completeLevel(activeLevel, earnedStars);
        setPhase('select');
      }}
    />
  );
};

// ── Game board ───────────────────────────────────────────────────────────────
const GameBoard: React.FC<{
  cfg: LevelCfg;
  level: number;
  language: 'ar' | 'fr' | 'en';
  onExit: () => void;
  onComplete: (stars: number) => void;
}> = ({ cfg, level, language, onExit, onComplete }) => {
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const [pieces, setPieces]   = useState<Piece[]>(() => [...cfg.pieces].sort(() => Math.random() - 0.5));
  const [shaking, setShaking] = useState<string | null>(null);
  const [won, setWon]         = useState(false);
  const [timeLeft, setTimeLeft] = useState(cfg.timerSecs);
  const [timerActive, setTimerActive] = useState(cfg.hasTimer);
  const dragIdRef  = useRef<string | null>(null);
  const binRefs    = useRef<Record<string, HTMLDivElement | null>>({});
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Timer countdown for level 4
  useEffect(() => {
    if (!timerActive || won) return;
    if (timeLeft <= 0) { onComplete(1); return; } // time's up = 1 star
    const id = setTimeout(() => setTimeLeft(t2 => t2 - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerActive, won]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkDrop = useCallback((pieceId: string, info: PanInfo) => {
    dragIdRef.current = null;
    const piece = pieces.find(p => p.id === pieceId);
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

    const key = cfg.sortBy === 'color' ? piece.color : piece.shape;
    if (key === matchedBin) {
      const next = pieces.map(p => p.id === pieceId ? { ...p, sorted: true } : p);
      setPieces(next);
      if (next.every(p => p.sorted)) {
        setWon(true);
        setTimerActive(false);
        const elapsed = cfg.timerSecs - timeLeft;
        const earnedStars = !cfg.hasTimer ? 3 : elapsed < cfg.timerSecs * 0.5 ? 3 : elapsed < cfg.timerSecs * 0.75 ? 2 : 1;
        setTimeout(() => onComplete(earnedStars), 1400);
      }
    } else {
      setShaking(pieceId);
      setTimeout(() => setShaking(null), 600);
    }
  }, [pieces, cfg, timeLeft, onComplete]);

  const unsorted = pieces.filter(p => !p.sorted);

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-violet-100 via-purple-50 to-indigo-100 flex flex-col items-center py-4 px-3 sm:px-4 gap-4">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center justify-between gap-2 flex-wrap">
        <button onClick={onExit}
          className="bg-white shadow-md border-2 border-violet-300 text-base px-4 py-2 rounded-2xl font-black cursor-pointer hover:bg-violet-50 active:scale-95 transition-all">
          🚪 {t('خروج', 'Retour', 'Back')}
        </button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-black text-violet-900">
            {t('فرّز الأشكال 🧩', 'Trieur de Formes 🧩', 'Shape Sorter 🧩')}
          </span>
          <span className="text-xs text-violet-500 font-bold">
            {pieces.filter(p => p.sorted).length} / {pieces.length} {t('تم', 'triés', 'sorted')}
          </span>
        </div>
        {/* Timer */}
        {cfg.hasTimer && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-black text-sm border-2
            ${timeLeft <= 10 ? 'bg-red-100 border-red-400 text-red-700 animate-pulse' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
            ⏱️ {timeLeft}s
          </div>
        )}
      </div>

      {/* Win banner */}
      <AnimatePresence>
        {won && (
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="w-full max-w-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-3xl p-5 text-center shadow-2xl border-4 border-violet-300">
            <p className="text-3xl font-black">🎉 {t('أحسنت!', 'Bravo !', 'Well done!')}</p>
            <p className="text-sm font-bold opacity-90 mt-1">
              {t('فرزت كل الأشكال! 🌟', 'Tu as tout trié ! 🌟', 'You sorted everything! 🌟')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction */}
      <div className="w-full max-w-3xl bg-white/70 rounded-2xl px-4 py-2 text-center text-xs font-bold text-violet-600 border border-violet-200">
        {cfg.sortBy === 'color'
          ? t('⬇ اسحب إلى صندوق اللون المناسب', '⬇ Glisse dans la boîte de la même couleur', '⬇ Drag to the matching color box')
          : t('⬇ اسحب إلى صندوق الشكل المناسب', '⬇ Glisse dans la boîte de la même forme', '⬇ Drag to the matching shape box')}
      </div>

      {/* Pieces */}
      <div className="w-full max-w-3xl bg-white/70 rounded-3xl p-3 sm:p-4 shadow-md border-2 border-violet-200 min-h-28">
        <div className="flex flex-wrap gap-3 justify-center">
          <AnimatePresence>
            {unsorted.map(p => (
              <motion.div key={p.id}
                drag
                dragMomentum={false}
                dragElastic={0.1}
                whileDrag={{ scale: 1.2, zIndex: 50, rotate: 8 }}
                whileHover={{ scale: 1.1, rotate: 3 }}
                animate={shaking === p.id ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
                transition={shaking === p.id ? { duration: 0.45 } : { type: 'spring', stiffness: 250 }}
                onDragEnd={(_, info) => checkDrop(p.id, info)}
                className="cursor-grab active:cursor-grabbing select-none flex flex-col items-center gap-1 p-2 rounded-2xl bg-white shadow-md border-2 border-violet-100 hover:border-violet-300"
                style={{ touchAction: 'none' }}
              >
                <ShapeSVG shape={p.shape} fill={COLOR_HEX[p.color]} size={50} />
                <span className="text-[10px] font-black" style={{ color: COLOR_HEX[p.color] }}>
                  {cfg.sortBy === 'color' ? LABEL.color[p.color][language] : LABEL.shape[p.shape][language]}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {unsorted.length === 0 && !won && (
            <p className="text-violet-400 font-bold text-sm py-4">🎊 {t('تقريباً!', 'Presque !', 'Almost!')}</p>
          )}
        </div>
      </div>

      {/* Bins */}
      <div className="w-full max-w-3xl grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cfg.bins.length}, minmax(0, 1fr))` }}>
        {(cfg.bins as string[]).map(binKey => {
          const isColorBin = cfg.sortBy === 'color';
          const sortedHere = pieces.filter(p => p.sorted && (isColorBin ? p.color === binKey : p.shape === binKey));
          const hex = isColorBin ? COLOR_HEX[binKey as Color] : '#8b5cf6';
          const binLabel = isColorBin
            ? LABEL.color[binKey as Color][language]
            : LABEL.shape[binKey as Shape][language];

          return (
            <div key={binKey}
              ref={el => { binRefs.current[binKey] = el; }}
              className={`min-h-24 rounded-3xl border-4 flex flex-col items-center p-2 gap-1 transition-all
                ${isColorBin ? `${COLOR_BORDER[binKey as Color]} ${COLOR_LIGHT[binKey as Color]}` : 'border-violet-400 bg-violet-50'}`}
            >
              {/* Bin header */}
              <div className="w-full py-1 rounded-2xl flex items-center justify-center gap-1"
                style={{ backgroundColor: hex + '33', borderBottom: `2px solid ${hex}40` }}>
                {!isColorBin && (
                  <span className="text-sm" style={{ color: hex }}>
                    {SHAPE_EMOJI[binKey as Shape]}
                  </span>
                )}
                <span className="text-xs font-black" style={{ color: hex }}>{binLabel}</span>
              </div>
              {/* Sorted pieces */}
              <div className="flex flex-wrap gap-1 justify-center">
                {sortedHere.map(p => (
                  <motion.div key={p.id} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}>
                    <ShapeSVG shape={p.shape} fill={COLOR_HEX[p.color]} size={28} />
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
