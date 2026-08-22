import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolLanguage, PreschoolPathStop } from '../../data/preschool/types';
import { playSuccessChime } from './usePreschoolAudio';

interface PreschoolFindPathProps {
  activity: PreschoolActivity;
  language?: PreschoolLanguage;
  onComplete: () => void;
}

const HIT_RADIUS = 52;
const spring = { type: 'spring' as const, stiffness: 280, damping: 20 };

function defaultStops(startAsset: string, endAsset: string): PreschoolPathStop[] {
  return [
    { x: 16, y: 48, asset: startAsset, color: '#fde68a' },
    { x: 84, y: 52, asset: endAsset, color: '#bbf7d0' },
  ];
}

export const PreschoolFindPath: React.FC<PreschoolFindPathProps> = ({
  activity, language = 'fr', onComplete,
}) => {
  const token = activity.visualAssets.pathToken;
  const stops = useMemo(
    () => activity.visualAssets.pathStops?.length
      ? activity.visualAssets.pathStops
      : defaultStops(token?.startAsset ?? '⭐', token?.endAsset ?? '🏡'),
    [activity.id, token?.startAsset, token?.endAsset, activity.visualAssets.pathStops],
  );

  const boardRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const completedRef = useRef(false);
  const reachedRef = useRef(0);
  const [reached, setReached] = useState(0);
  const [pos, setPos] = useState({ x: stops[0].x, y: stops[0].y });
  const [solved, setSolved] = useState(false);
  const theme = activity.visualAssets.pathTheme
    ?? (stops.length > 2 ? 'desert' : 'default');

  useEffect(() => {
    completedRef.current = false;
    reachedRef.current = 0;
    setReached(0);
    setSolved(false);
    setPos({ x: stops[0].x, y: stops[0].y });
  }, [activity.id, stops]);

  if (!token) return null;

  const pointerToPercent = (clientX: number, clientY: number) => {
    const rect = boardRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  };

  const nearStop = (p: { x: number; y: number }, stop: PreschoolPathStop, boardW: number, boardH: number) => {
    const dx = ((p.x - stop.x) / 100) * boardW;
    const dy = ((p.y - stop.y) / 100) * boardH;
    return Math.hypot(dx, dy) <= HIT_RADIUS;
  };

  const advanceIfNeeded = (p: { x: number; y: number }) => {
    const rect = boardRef.current!.getBoundingClientRect();
    const current = reachedRef.current;
    if (current >= stops.length - 1) return;
    const next = stops[current + 1];
    if (!nearStop(p, next, rect.width, rect.height)) return;
    const nextIndex = current + 1;
    reachedRef.current = nextIndex;
    setReached(nextIndex);
    if (nextIndex === stops.length - 1 && !completedRef.current) {
      completedRef.current = true;
      setSolved(true);
      playSuccessChime();
      setTimeout(onComplete, 1100);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (solved) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragging.current = true;
    const p = pointerToPercent(e.clientX, e.clientY);
    setPos(p);
    advanceIfNeeded(p);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || solved) return;
    const p = pointerToPercent(e.clientX, e.clientY);
    setPos({
      x: Math.min(96, Math.max(4, p.x)),
      y: Math.min(96, Math.max(4, p.y)),
    });
    advanceIfNeeded(p);
  };

  const handlePointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (solved) return;
    const last = stops[reachedRef.current];
    setPos({ x: last.x, y: last.y });
  };

  const pathD = stops
    .map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x} ${s.y}`)
    .join(' ');

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const THEME_UI = {
    desert: {
      hint: t('اِسْحَبِ الفَنَكَ مِنْ لَوْنٍ إِلَى لَوْن!', 'Glisse le fennec de couleur en couleur !', 'Drag the fennec from color to color!'),
      win: t('وَصَلْنَا! 🏠', 'Arrivé à la maison ! 🏠', 'Home sweet home! 🏠'),
      bg: 'linear-gradient(180deg, #7dd3fc 0%, #fde68a 42%, #fbbf24 70%, #d97706 100%)',
      trail: '#f97316',
      trailFill: '#fff7ed',
      border: 'border-amber-200',
    },
    bath: {
      hint: t('اِسْحَبْ: صَابُون ثُمَّ مَاء ثُمَّ مِنْشَفَة!', 'Glisse : savon, eau, puis serviette !', 'Drag: soap, water, then towel!'),
      win: t('يَدَانِ نَظِيفَتَان! 🫧', 'Mains propres ! 🫧', 'Clean hands! 🫧'),
      bg: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 45%, #a5f3fc 100%)',
      trail: '#38bdf8',
      trailFill: '#f0f9ff',
      border: 'border-sky-200',
    },
    seasons: {
      hint: t('اِسْحَبْ عَبْرَ الفُصُولِ الأَرْبَعَة!', 'Glisse à travers les quatre saisons !', 'Drag through the four seasons!'),
      win: t('عَامٌ كَامِل! 🌈', 'Une année complète ! 🌈', 'A whole year! 🌈'),
      bg: 'linear-gradient(180deg, #7dd3fc 0%, #bbf7d0 40%, #fde68a 70%, #e0f2fe 100%)',
      trail: '#16a34a',
      trailFill: '#ecfccb',
      border: 'border-emerald-200',
    },
    market: {
      hint: t('اِسْحَبِ الفَنَكَ مِنْ دُكَّانٍ إِلَى دُكَّان!', 'Glisse le fennec d\'étal en étal !', 'Drag the fennec from stall to stall!'),
      win: t('وَصَلْنَا إِلَى السُّوق! 🏪', 'Arrivé au marché ! 🏪', 'We made it to the market! 🏪'),
      bg: 'linear-gradient(180deg, #fdba74 0%, #fed7aa 40%, #fde68a 70%, #fef3c7 100%)',
      trail: '#c2410c',
      trailFill: '#fff7ed',
      border: 'border-orange-200',
    },
    home: {
      hint: t('اِسْحَبِ الفَنَكَ مِنْ غُرْفَةٍ إِلَى غُرْفَة!', 'Glisse le fennec de pièce en pièce !', 'Drag the fennec from room to room!'),
      win: t('هَا هِيَ العَائِلَة! 👨‍👩‍👧', 'Voici la famille ! 👨‍👩‍👧', 'Here is the family! 👨‍👩‍👧'),
      bg: 'linear-gradient(180deg, #fecaca 0%, #fed7aa 45%, #fde68a 100%)',
      trail: '#e11d48',
      trailFill: '#fff1f2',
      border: 'border-rose-200',
    },
    day: {
      hint: t('اِسْحَبْ مِنَ الصَّبَاحِ إِلَى اللَّيْل!', 'Glisse du matin jusqu\'à la nuit !', 'Drag from morning all the way to night!'),
      win: t('يَوْمٌ كَامِل! 🏡', 'Une journée complète ! 🏡', 'A whole day! 🏡'),
      bg: 'linear-gradient(180deg, #7dd3fc 0%, #fde68a 35%, #fdba74 65%, #1e3a5f 100%)',
      trail: '#0369a1',
      trailFill: '#e0f2fe',
      border: 'border-sky-200',
    },
    algeria: {
      hint: t('اِسْحَبِ الفَنَكَ عَبْرَ الجَزَائِر!', 'Glisse le fennec à travers l\'Algérie !', 'Drag the fennec across Algeria!'),
      win: t('عَاشَتِ الجَزَائِر! 🇩🇿', 'Vive l\'Algérie ! 🇩🇿', 'Long live Algeria! 🇩🇿'),
      bg: 'linear-gradient(180deg, #7dd3fc 0%, #fefce8 38%, #fde68a 68%, #d97706 100%)',
      trail: '#15803d',
      trailFill: '#ecfccb',
      border: 'border-emerald-200',
    },
    mosque: {
      hint: t('اِسْحَبْ نَحْوَ المَسْجِد!', 'Glisse jusqu\'à la mosquée !', 'Drag all the way to the mosque!'),
      win: t('وَصَلْنَا إِلَى المَسْجِد! 🕌', 'Arrivés à la mosquée ! 🕌', 'We reached the mosque! 🕌'),
      bg: 'linear-gradient(180deg, #86efac 0%, #fefce8 48%, #fde68a 100%)',
      trail: '#047857',
      trailFill: '#ecfdf5',
      border: 'border-emerald-200',
    },
    feelings: {
      hint: t('اِسْحَبْ عَبْرَ المَشَاعِر!', 'Glisse à travers les émotions !', 'Drag through the feelings!'),
      win: t('كُلُّ المَشَاعِرِ مَقْبُولَة! 🤗', 'Toutes les émotions sont OK ! 🤗', 'Every feeling is OK! 🤗'),
      bg: 'linear-gradient(180deg, #fde68a 0%, #fbcfe8 48%, #ddd6fe 100%)',
      trail: '#db2777',
      trailFill: '#fdf2f8',
      border: 'border-pink-200',
    },
    writing: {
      hint: t('اِسْحَبِ القَلَمَ عَلَى الخُطُوط!', 'Glisse le crayon sur les traits !', 'Drag the pencil along the strokes!'),
      win: t('يَدُكَ جَاهِزَةٌ لِلكِتَابَة! ✏️', 'Ta main est prête à écrire ! ✏️', 'Your hand is ready to write! ✏️'),
      bg: 'linear-gradient(180deg, #fff7ed 0%, #fef3c7 55%, #e0f2fe 100%)',
      trail: '#a16207',
      trailFill: '#fffbeb',
      border: 'border-amber-200',
    },
    logic: {
      hint: t('اِسْحَبْ وَفَكِّرْ مِنْ شَيْءٍ إِلَى شَيْء!', 'Glisse et réfléchis d\'objet en objet !', 'Drag and think from object to object!'),
      win: t('عَقْلُكَ الصَّغِيرُ يُفَكِّر! 🧠', 'Ton petit esprit réfléchit ! 🧠', 'Your little mind is thinking! 🧠'),
      bg: 'linear-gradient(180deg, #ddd6fe 0%, #e0f2fe 50%, #fef9c3 100%)',
      trail: '#6d28d9',
      trailFill: '#f5f3ff',
      border: 'border-violet-200',
    },
    default: {
      hint: t('اِسْحَبْ حَتَّى تَصِل!', 'Glisse jusqu\'à l\'arrivée !', 'Drag all the way to the end!'),
      win: t('أَحْسَنْت!', 'Bravo !', 'Well done!'),
      bg: 'linear-gradient(180deg, #e0f2fe 0%, #fef9c3 55%, #bbf7d0 100%)',
      trail: '#f97316',
      trailFill: '#fff7ed',
      border: 'border-amber-200',
    },
  } as const;
  const ui = THEME_UI[theme];

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm px-1" dir="ltr">
      <motion.div
        ref={boardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring}
        className={`relative w-full aspect-[5/4] rounded-[2rem] overflow-hidden shadow-lg border-4 ${ui.border}
                   cursor-grab active:cursor-grabbing touch-none select-none`}
        style={{ background: ui.bg }}
      >
        {theme === 'desert' && (
          <div className="absolute top-3 right-4 text-4xl drop-shadow select-none pointer-events-none" aria-hidden>☀️</div>
        )}
        {theme === 'bath' && (
          <>
            <div className="absolute top-3 right-4 text-3xl select-none pointer-events-none" aria-hidden>🪞</div>
            <div className="absolute top-6 left-5 text-2xl select-none pointer-events-none opacity-70" aria-hidden>🫧</div>
            <div className="absolute bottom-4 right-8 text-2xl select-none pointer-events-none opacity-70" aria-hidden>🫧</div>
          </>
        )}
        {theme === 'seasons' && (
          <div className="absolute top-3 right-5 text-3xl drop-shadow select-none pointer-events-none" aria-hidden>🌤️</div>
        )}
        {theme === 'market' && (
          <>
            <div className="absolute top-2 right-4 text-3xl select-none pointer-events-none" aria-hidden>🏮</div>
            <div className="absolute top-3 left-4 text-2xl select-none pointer-events-none opacity-80" aria-hidden>🧺</div>
          </>
        )}
        {theme === 'home' && (
          <>
            <div className="absolute top-2 right-5 text-3xl select-none pointer-events-none" aria-hidden>🪟</div>
            <div className="absolute top-3 left-4 text-2xl select-none pointer-events-none" aria-hidden>💡</div>
          </>
        )}
        {theme === 'day' && (
          <div className="absolute top-2 right-4 text-3xl drop-shadow select-none pointer-events-none" aria-hidden>🌤️</div>
        )}
        {theme === 'algeria' && (
          <>
            <div className="absolute top-2 right-4 text-3xl select-none pointer-events-none" aria-hidden>🇩🇿</div>
            <div className="absolute top-3 left-4 text-2xl select-none pointer-events-none" aria-hidden>☀️</div>
          </>
        )}
        {theme === 'mosque' && (
          <>
            <div className="absolute top-2 right-5 text-3xl select-none pointer-events-none" aria-hidden>🌙</div>
            <div className="absolute top-3 left-4 text-2xl select-none pointer-events-none" aria-hidden>⭐</div>
          </>
        )}
        {theme === 'feelings' && (
          <div className="absolute top-2 right-4 text-3xl select-none pointer-events-none" aria-hidden>💖</div>
        )}
        {theme === 'writing' && (
          <>
            <div className="absolute top-2 right-4 text-3xl select-none pointer-events-none" aria-hidden>✏️</div>
            <div className="absolute top-3 left-4 text-2xl select-none pointer-events-none" aria-hidden>📓</div>
          </>
        )}
        {theme === 'logic' && (
          <div className="absolute top-2 right-4 text-3xl select-none pointer-events-none" aria-hidden>🧠</div>
        )}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {theme === 'desert' && (
            <>
              <path d="M0 72 Q 18 60 34 70 T 68 68 T 100 74 L 100 100 L 0 100 Z" fill="#f59e0b" opacity="0.5" />
              <path d="M0 82 Q 22 72 40 80 T 100 84 L 100 100 L 0 100 Z" fill="#d97706" opacity="0.4" />
            </>
          )}
          {theme === 'bath' && (
            <path d="M0 78 Q 30 70 55 78 T 100 76 L 100 100 L 0 100 Z" fill="#7dd3fc" opacity="0.35" />
          )}
          {theme === 'seasons' && (
            <path d="M0 78 Q 25 68 50 76 T 100 80 L 100 100 L 0 100 Z" fill="#86efac" opacity="0.45" />
          )}
          {theme === 'market' && (
            <path d="M0 80 Q 28 70 52 78 T 100 82 L 100 100 L 0 100 Z" fill="#c2410c" opacity="0.18" />
          )}
          {theme === 'home' && (
            <path d="M0 82 L 100 82 L 100 100 L 0 100 Z" fill="#fda4af" opacity="0.35" />
          )}
          {theme === 'day' && (
            <path d="M0 76 Q 30 68 55 76 T 100 78 L 100 100 L 0 100 Z" fill="#0f172a" opacity="0.22" />
          )}
          {theme === 'algeria' && (
            <>
              <path d="M0 78 Q 22 70 48 78 T 100 80 L 100 100 L 0 100 Z" fill="#22c55e" opacity="0.22" />
              <path d="M0 88 Q 30 82 60 88 T 100 90 L 100 100 L 0 100 Z" fill="#f59e0b" opacity="0.28" />
            </>
          )}
          {theme === 'mosque' && (
            <path d="M0 80 Q 25 72 50 80 T 100 82 L 100 100 L 0 100 Z" fill="#047857" opacity="0.18" />
          )}
          {theme === 'feelings' && (
            <path d="M0 80 Q 28 72 55 80 T 100 82 L 100 100 L 0 100 Z" fill="#f9a8d4" opacity="0.35" />
          )}
          {theme === 'writing' && (
            <path d="M0 84 L 100 84 L 100 100 L 0 100 Z" fill="#fde68a" opacity="0.35" />
          )}
          {theme === 'logic' && (
            <path d="M0 80 Q 30 72 55 80 T 100 82 L 100 100 L 0 100 Z" fill="#c4b5fd" opacity="0.35" />
          )}
          <path d={pathD} fill="none" stroke={ui.trailFill} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <path d={pathD} fill="none" stroke={ui.trail} strokeWidth="1.1" strokeDasharray="3 3" strokeLinecap="round" />
        </svg>

        {stops.map((stop, i) => {
          const done = i <= reached;
          const isNext = i === reached + 1 && !solved;
          return (
            <motion.div
              key={`${stop.x}-${stop.y}-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
              style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
              animate={isNext ? { scale: [1, 1.12, 1] } : { scale: done ? 1 : 0.92 }}
              transition={isNext ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } : spring}
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-3xl
                            border-4 shadow-md ${done ? 'border-emerald-400' : 'border-white/80'}`}
                style={{ backgroundColor: stop.color }}
              >
                {done && i > 0 ? '✨' : stop.asset}
              </div>
            </motion.div>
          );
        })}

        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-6xl z-10 pointer-events-none drop-shadow-lg"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          animate={solved ? { scale: [1, 1.35, 1], rotate: [0, -12, 12, 0] } : { scale: 1 }}
          transition={spring}
        >
          {token.travelerAsset}
        </motion.div>
      </motion.div>

      <div className="flex items-center gap-2">
        {stops.map((stop, i) => (
          <span
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2
                        ${i <= reached ? 'border-emerald-400 bg-white' : 'border-amber-200 bg-amber-50 opacity-50'}`}
            style={{ backgroundColor: i <= reached ? stop.color : undefined }}
          >
            {i === 0 ? token.travelerAsset : stop.asset}
          </span>
        ))}
      </div>

      <p className="text-sm font-black text-orange-800 text-center">
        {solved ? ui.win : ui.hint}
      </p>
    </div>
  );
};
