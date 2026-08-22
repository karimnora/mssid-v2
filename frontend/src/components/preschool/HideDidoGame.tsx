/**
 * HideDidoGame.tsx — « Où est Dido ? »
 * Cache-cache visuel : Dido le fennec se cache dans des scènes d’Algérie.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';
import {
  playGentleNudge,
  playModuleCompleteFanfare,
  playSuccessChime,
  resumeTownAudio,
  usePreschoolSpeech,
} from './usePreschoolAudio';

export interface HideDidoGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface Spot {
  id: string;
  emoji: string;
  isDido: boolean;
  x: number;
  y: number;
  size: number;
}

interface LevelCfg {
  emoji: string;
  bg: string;
  decoys: string[];
  decoyCount: number;
  didoSize: number;
  findsNeeded: number;
  missionAr: string; missionFr: string; missionEn: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SLOTS: { x: number; y: number }[] = [];
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 5; col++) {
    SLOTS.push({ x: 10 + col * 20, y: 14 + row * 22 });
  }
}

const LEVELS: LevelCfg[] = [
  {
    emoji: '🏜️', bg: 'from-amber-200 via-yellow-100 to-orange-200',
    decoys: ['🌵', '🪨', '☀️', '🐪'], decoyCount: 5, didoSize: 56, findsNeeded: 1,
    missionAr: 'أَيْنَ دِيدُو؟ اِلْمِسِ الْفَنَكَ!',
    missionFr: 'Où est Dido ? Touche le fennec !',
    missionEn: 'Where is Dido? Tap the fennec!',
  },
  {
    emoji: '🌴', bg: 'from-lime-200 via-amber-100 to-emerald-200',
    decoys: ['🌴', '💧', '🫒', '🍋', '🐪'], decoyCount: 7, didoSize: 52, findsNeeded: 1,
    missionAr: 'دِيدُو فِي الْوَاحَة! اِجِدْهُ',
    missionFr: 'Dido est dans l’oasis ! Trouve-le',
    missionEn: 'Dido is in the oasis! Find him',
  },
  {
    emoji: '🏖️', bg: 'from-sky-200 via-cyan-100 to-amber-100',
    decoys: ['🌊', '🐚', '⛵', '☀️', '🦀', '⭐'], decoyCount: 9, didoSize: 48, findsNeeded: 1,
    missionAr: 'عَلَى الشَّاطِئ! أَيْنَ دِيدُو؟',
    missionFr: 'Sur la plage ! Où est Dido ?',
    missionEn: 'On the beach! Where is Dido?',
  },
  {
    emoji: '🛒', bg: 'from-orange-200 via-amber-100 to-rose-100',
    decoys: ['🍊', '🍋', '🫒', '🥖', '🫖', '🧅'], decoyCount: 11, didoSize: 46, findsNeeded: 1,
    missionAr: 'دِيدُو فِي السُّوق! اِبْحَثْ',
    missionFr: 'Dido est au souk ! Cherche bien',
    missionEn: 'Dido is at the souk! Look carefully',
  },
  {
    emoji: '🕌', bg: 'from-slate-200 via-stone-100 to-sky-100',
    decoys: ['🕌', '🏠', '🌙', '🪴', '🚪', '🪟'], decoyCount: 12, didoSize: 42, findsNeeded: 2,
    missionAr: 'فِي الْقَصَبَة — اِجِدْهُ مَرَّتَيْن!',
    missionFr: 'Dans la casbah — trouve-le deux fois !',
    missionEn: 'In the casbah — find him twice!',
  },
  {
    emoji: '🏔️', bg: 'from-emerald-200 via-lime-100 to-sky-200',
    decoys: ['🏔️', '🌲', '🐐', '🪨', '🌸', '🦅'], decoyCount: 13, didoSize: 38, findsNeeded: 2,
    missionAr: 'فِي الْجِبَال! دِيدُو صَغِير',
    missionFr: 'Dans les montagnes ! Dido est petit',
    missionEn: 'In the mountains! Dido is small',
  },
  {
    emoji: '🌙', bg: 'from-indigo-400 via-violet-300 to-slate-400',
    decoys: ['⭐', '🌙', '🌵', '🦉', '✨', '🪐'], decoyCount: 14, didoSize: 36, findsNeeded: 2,
    missionAr: 'لَيْلُ الصَّحْرَاء — اِبْحَثْ جَيِّداً',
    missionFr: 'Nuit du Sahara — cherche bien',
    missionEn: 'Sahara night — look closely',
  },
  {
    emoji: '🎉', bg: 'from-rose-200 via-amber-100 to-violet-200',
    decoys: ['🍊', '🐪', '🕌', '⛵', '🌴', '🍋', '🐑', '🫖', '🏠'], decoyCount: 16, didoSize: 32, findsNeeded: 3,
    missionAr: 'الْحَفْلَةُ الْكُبْرَى! اِجِدْ دِيدُو ٣ مَرَّات',
    missionFr: 'La grande fête ! Trouve Dido 3 fois',
    missionEn: 'The big party! Find Dido 3 times',
  },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🏜️', diffLabel: '⭐',
    titleAr: 'الصحراء', titleFr: 'Le Sahara', titleEn: 'The Sahara',
    descAr: 'ديدو كبير وسهل', descFr: 'Dido est grand et facile', descEn: 'Dido is big and easy',
    gradient: 'from-amber-400 to-orange-500' },
  { level: 2, emoji: '🌴', diffLabel: '⭐',
    titleAr: 'الواحة', titleFr: 'L’oasis', titleEn: 'The oasis',
    descAr: 'بين النخيل', descFr: 'Parmi les palmiers', descEn: 'Among the palms',
    gradient: 'from-lime-400 to-emerald-500' },
  { level: 3, emoji: '🏖️', diffLabel: '⭐⭐',
    titleAr: 'الشاطئ', titleFr: 'La plage', titleEn: 'The beach',
    descAr: 'رمل وصدف', descFr: 'Sable et coquillages', descEn: 'Sand and shells',
    gradient: 'from-sky-400 to-cyan-500' },
  { level: 4, emoji: '🛒', diffLabel: '⭐⭐',
    titleAr: 'السوق', titleFr: 'Le souk', titleEn: 'The souk',
    descAr: 'كثير من الفواكه', descFr: 'Beaucoup de fruits', descEn: 'Lots of fruit',
    gradient: 'from-orange-400 to-rose-500' },
  { level: 5, emoji: '🕌', diffLabel: '⭐⭐',
    titleAr: 'القصبة', titleFr: 'La casbah', titleEn: 'The casbah',
    descAr: 'ابحث مرتين', descFr: 'Trouve-le deux fois', descEn: 'Find him twice',
    gradient: 'from-slate-400 to-sky-600' },
  { level: 6, emoji: '🏔️', diffLabel: '⭐⭐⭐',
    titleAr: 'الجبال', titleFr: 'Les montagnes', titleEn: 'The mountains',
    descAr: 'ديدو أصغر', descFr: 'Dido est plus petit', descEn: 'Dido is smaller',
    gradient: 'from-emerald-500 to-teal-700' },
  { level: 7, emoji: '🌙', diffLabel: '⭐⭐⭐',
    titleAr: 'ليل الصحراء', titleFr: 'Nuit du Sahara', titleEn: 'Sahara night',
    descAr: 'ابحث في الظلام', descFr: 'Cherche dans le noir', descEn: 'Search in the dark',
    gradient: 'from-indigo-600 to-slate-800' },
  { level: 8, emoji: '🎉', diffLabel: '🏆',
    titleAr: 'الحفلة الكبرى', titleFr: 'La grande fête', titleEn: 'The big party',
    descAr: 'ثلاث مرات!', descFr: 'Trois fois !', descEn: 'Three times!',
    gradient: 'from-rose-400 to-violet-600' },
];

function buildSpots(cfg: LevelCfg, round: number): Spot[] {
  const slots = shuffle(SLOTS).slice(0, cfg.decoyCount + 1);
  const decoyPool = shuffle(
    Array.from({ length: cfg.decoyCount }, (_, i) => cfg.decoys[i % cfg.decoys.length]),
  );
  const jitter = (n: number) => n + (Math.random() * 6 - 3);
  const spots: Spot[] = [
    {
      id: `dido-${round}`,
      emoji: '🦊',
      isDido: true,
      x: jitter(slots[0].x),
      y: jitter(slots[0].y),
      size: cfg.didoSize,
    },
  ];
  decoyPool.forEach((emoji, i) => {
    const slot = slots[i + 1];
    spots.push({
      id: `d-${round}-${i}`,
      emoji,
      isDido: false,
      x: jitter(slot.x),
      y: jitter(slot.y),
      size: Math.max(28, cfg.didoSize - 4),
    });
  });
  return shuffle(spots);
}

const starsFrom = (misses: number) => {
  if (misses <= 0) return 3;
  if (misses <= 2) return 2;
  return 1;
};

export const HideDidoGame: React.FC<HideDidoGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('hide_dido', 8);
  const [phase, setPhase] = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('أَيْنَ دِيدُو؟', 'Où est Dido ?', 'Where is Dido?')}
        gameIcon="🦊"
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
    <HideBoard
      key={`hide-${activeLevel}`}
      cfg={LEVELS[activeLevel - 1]}
      language={language}
      onExit={() => setPhase('select')}
      onComplete={(s) => {
        completeLevel(activeLevel, s);
        setPhase('select');
      }}
    />
  );
};

const HideBoard: React.FC<{
  cfg: LevelCfg;
  language: 'ar' | 'fr' | 'en';
  onExit: () => void;
  onComplete: (stars: number) => void;
}> = ({ cfg, language, onExit, onComplete }) => {
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;
  const { speak } = usePreschoolSpeech(language);
  const mission = t(cfg.missionAr, cfg.missionFr, cfg.missionEn);

  const [round, setRound] = useState(0);
  const [found, setFound] = useState(0);
  const [misses, setMisses] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [justFound, setJustFound] = useState(false);

  const spots = useMemo(() => buildSpots(cfg, round), [cfg, round]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      resumeTownAudio();
      speak(mission);
    }, 350);
    return () => window.clearTimeout(id);
  }, [mission, speak]);

  const handleTap = (spot: Spot) => {
    if (won || justFound) return;
    resumeTownAudio();
    if (spot.isDido) {
      playSuccessChime();
      setJustFound(true);
      const nextFound = found + 1;
      setFound(nextFound);
      if (nextFound >= cfg.findsNeeded) {
        setWon(true);
        playModuleCompleteFanfare();
        setTimeout(() => onComplete(starsFrom(misses)), 1500);
      } else {
        setTimeout(() => {
          setJustFound(false);
          setRound((r) => r + 1);
        }, 900);
      }
    } else {
      playGentleNudge();
      setMisses((n) => n + 1);
      setWrongId(spot.id);
      setTimeout(() => setWrongId(null), 450);
    }
  };

  const night = cfg.emoji === '🌙';

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F8F9FA] flex flex-col items-center p-4 sm:p-6 gap-4">
      <div className="w-full max-w-3xl flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          className="bg-white shadow-md border-2 border-amber-200 text-slate-800 text-sm px-4 py-2 rounded-2xl font-black cursor-pointer"
        >
          🚪 {t('خروج', 'Retour', 'Back')}
        </motion.button>
        <p className="text-sm font-black text-slate-600">
          🦊 {found} / {cfg.findsNeeded}
        </p>
        <div className="w-16" />
      </div>

      <div className="w-full max-w-3xl flex items-center justify-center gap-3 px-2">
        <p className="text-3xl shrink-0">{cfg.emoji}</p>
        <p className={`text-base sm:text-lg font-black text-center leading-snug ${night ? 'text-indigo-900' : 'text-slate-800'}`}>
          {mission}
        </p>
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

      <div
        className={`relative w-full max-w-3xl aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-amber-200 bg-gradient-to-b ${cfg.bg}`}
      >
        {spots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            onClick={() => handleTap(spot)}
            className="absolute cursor-pointer select-none bg-transparent border-0 p-0 leading-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              filter: night && !spot.isDido ? 'brightness(0.85)' : undefined,
            }}
            aria-label={spot.isDido ? 'Dido' : spot.emoji}
          >
            <motion.span
              className="block"
              style={{ fontSize: spot.size }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              animate={
                wrongId === spot.id
                  ? { x: [0, -8, 8, -8, 0] }
                  : spot.isDido && justFound
                    ? { scale: [1, 1.35, 1.15], rotate: [0, -12, 12, 0] }
                    : { y: [0, -4, 0] }
              }
              transition={
                wrongId === spot.id
                  ? { duration: 0.4 }
                  : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              {spot.emoji}
            </motion.span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35"
          >
            <div className="bg-white rounded-3xl px-8 py-7 shadow-2xl text-center max-w-xs mx-4 border-2 border-amber-200 space-y-2">
              <p className="text-5xl">🦊</p>
              <p className="text-2xl font-black text-slate-800">{t('وَجَدْتَهُ!', 'Tu l’as trouvé !', 'You found him!')}</p>
              <p className="text-3xl">{'⭐'.repeat(starsFrom(misses))}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
