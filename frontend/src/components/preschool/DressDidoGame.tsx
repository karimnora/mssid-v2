/**
 * DressDidoGame.tsx — « Habille Dido »
 * Selon le temps (soleil, pluie, neige, désert…), on pose les bons vêtements.
 */
import React, { useEffect, useState } from 'react';
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

export interface DressDidoGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

type Slot = 'head' | 'face' | 'neck' | 'body' | 'feet' | 'hand';

interface Garment {
  id: string;
  emoji: string;
  slot: Slot;
  correct: boolean;
}

interface LevelCfg {
  emoji: string;
  weather: string;
  bg: string;
  garments: Garment[];
  missionAr: string; missionFr: string; missionEn: string;
}

const LEVELS: LevelCfg[] = [
  {
    emoji: '☀️', weather: '☀️', bg: 'from-amber-100 via-yellow-50 to-sky-100',
    missionAr: 'الْجَوُّ حَارّ! أَلْبِسْ دِيدُو الْقُبَّعَةَ وَالْقَمِيص',
    missionFr: 'Il fait chaud ! Mets la casquette et le t-shirt',
    missionEn: 'It’s hot! Put on the cap and the t-shirt',
    garments: [
      { id: 'cap', emoji: '🧢', slot: 'head', correct: true },
      { id: 'tee', emoji: '👕', slot: 'body', correct: true },
      { id: 'coat', emoji: '🧥', slot: 'body', correct: false },
      { id: 'boots', emoji: '👢', slot: 'feet', correct: false },
    ],
  },
  {
    emoji: '🌧️', weather: '🌧️', bg: 'from-slate-200 via-sky-100 to-blue-100',
    missionAr: 'تُمْطِر! أَلْبِسْ دِيدُو الْمِعْطَفَ وَالْحِذَاءَ وَالْمِظَلَّة',
    missionFr: 'Il pleut ! Mets le manteau, les bottes et le parapluie !',
    missionEn: 'It’s raining! Put on the coat, the boots and the umbrella!',
    garments: [
      { id: 'coat', emoji: '🧥', slot: 'body', correct: true },
      { id: 'boots', emoji: '👢', slot: 'feet', correct: true },
      { id: 'umb', emoji: '☔', slot: 'hand', correct: true },
      { id: 'shorts', emoji: '🩳', slot: 'body', correct: false },
      { id: 'sun', emoji: '😎', slot: 'head', correct: false },
    ],
  },
  {
    emoji: '❄️', weather: '❄️', bg: 'from-sky-100 via-slate-50 to-indigo-100',
    missionAr: 'الثَّلْجُ فِي الْجِبَال! أَلْبِسْ دِيدُو الْمِعْطَفَ وَالْوِشَاحَ وَالْقُبَّعَة',
    missionFr: 'Il neige ! Mets le manteau, l’écharpe et le bonnet !',
    missionEn: 'It is snowing! Put on the coat, the scarf and the hat!',
    garments: [
      { id: 'coat', emoji: '🧥', slot: 'body', correct: true },
      { id: 'scarf', emoji: '🧣', slot: 'neck', correct: true },
      { id: 'hat', emoji: '🧢', slot: 'head', correct: true },
      { id: 'swim', emoji: '🩱', slot: 'body', correct: false },
      { id: 'sandals', emoji: '🩴', slot: 'feet', correct: false },
    ],
  },
  {
    emoji: '🏖️', weather: '🏖️', bg: 'from-cyan-100 via-amber-50 to-sky-100',
    missionAr: 'الشَّاطِئ! أَلْبِسْ دِيدُو الشُّورْت وَالْقُبَّعَةَ وَالنَّظَّارَات',
    missionFr: 'La plage ! Mets le short, le chapeau et les lunettes !',
    missionEn: 'The beach! Put on the shorts, the hat and the sunglasses!',
    garments: [
      { id: 'shorts', emoji: '🩳', slot: 'body', correct: true },
      { id: 'hat', emoji: '🧢', slot: 'head', correct: true },
      { id: 'glasses', emoji: '😎', slot: 'face', correct: true },
      { id: 'coat', emoji: '🧥', slot: 'body', correct: false },
      { id: 'boots', emoji: '👢', slot: 'feet', correct: false },
    ],
  },
  {
    emoji: '🏜️', weather: '🏜️', bg: 'from-orange-100 via-amber-50 to-yellow-100',
    missionAr: 'الصَّحْرَاء حَارَّة! أَلْبِسْ دِيدُو قَمِيصاً خَفِيفاً وَقُبَّعَة، وَأَعْطِهِ مَاء',
    missionFr: 'Le Sahara est chaud ! Mets le t-shirt, le chapeau, et donne-lui de l’eau !',
    missionEn: 'The Sahara is hot! Put on the t-shirt and hat, and give him water!',
    garments: [
      { id: 'tee', emoji: '👕', slot: 'body', correct: true },
      { id: 'hat', emoji: '🧢', slot: 'head', correct: true },
      { id: 'water', emoji: '💧', slot: 'hand', correct: true },
      { id: 'coat', emoji: '🧥', slot: 'body', correct: false },
      { id: 'scarf', emoji: '🧣', slot: 'neck', correct: false },
    ],
  },
  {
    emoji: '🌙', weather: '🌙', bg: 'from-indigo-200 via-violet-100 to-slate-100',
    missionAr: 'وَقْتُ النَّوْم! أَلْبِسْ دِيدُو قَمِيصَ النَّوْمِ وَالْجَوْرَب',
    missionFr: 'L’heure du dodo ! Mets le pyjama et les chaussettes !',
    missionEn: 'Bedtime! Put on the pajamas and the socks!',
    garments: [
      { id: 'pjs', emoji: '👕', slot: 'body', correct: true },
      { id: 'slippers', emoji: '🧦', slot: 'feet', correct: true },
      { id: 'coat', emoji: '🧥', slot: 'body', correct: false },
      { id: 'cap', emoji: '🧢', slot: 'head', correct: false },
    ],
  },
  {
    emoji: '💨', weather: '💨', bg: 'from-slate-100 via-sky-50 to-emerald-50',
    missionAr: 'الرِّيحُ بَارِدَة! أَلْبِسْ دِيدُو الْمِعْطَفَ وَالْوِشَاح',
    missionFr: 'Le vent est froid ! Mets le manteau et l’écharpe !',
    missionEn: 'The wind is cold! Put on the coat and the scarf!',
    garments: [
      { id: 'coat', emoji: '🧥', slot: 'body', correct: true },
      { id: 'scarf', emoji: '🧣', slot: 'neck', correct: true },
      { id: 'shorts', emoji: '🩳', slot: 'body', correct: false },
      { id: 'umb', emoji: '☔', slot: 'hand', correct: false },
    ],
  },
  {
    emoji: '🎒', weather: '🏫', bg: 'from-lime-100 via-amber-50 to-sky-100',
    missionAr: 'إِلَى الْمَدْرَسَة! أَلْبِسْ دِيدُو الْقَمِيصَ وَالْحِذَاء، وَأَعْطِهِ الْمِحْفَظَة',
    missionFr: 'À l’école ! Mets le t-shirt, les chaussures, et donne-lui le cartable !',
    missionEn: 'Off to school! Put on the t-shirt and shoes, and give him the backpack!',
    garments: [
      { id: 'tee', emoji: '👕', slot: 'body', correct: true },
      { id: 'shoes', emoji: '👟', slot: 'feet', correct: true },
      { id: 'bag', emoji: '🎒', slot: 'hand', correct: true },
      { id: 'swim', emoji: '🩱', slot: 'body', correct: false },
      { id: 'umb', emoji: '☔', slot: 'hand', correct: false },
    ],
  },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '☀️', diffLabel: '⭐',
    titleAr: 'الجو حار', titleFr: 'Il fait chaud', titleEn: 'It’s hot',
    descAr: 'قبعة وقميص', descFr: 'Casquette et t-shirt', descEn: 'Cap and t-shirt',
    gradient: 'from-amber-400 to-yellow-500' },
  { level: 2, emoji: '🌧️', diffLabel: '⭐',
    titleAr: 'المطر', titleFr: 'La pluie', titleEn: 'Rain',
    descAr: 'معطف ومظلة', descFr: 'Manteau et parapluie', descEn: 'Coat and umbrella',
    gradient: 'from-sky-400 to-slate-500' },
  { level: 3, emoji: '❄️', diffLabel: '⭐⭐',
    titleAr: 'ثلج الجبال', titleFr: 'Neige en Kabylie', titleEn: 'Mountain snow',
    descAr: 'معطف ووشاح', descFr: 'Manteau et écharpe', descEn: 'Coat and scarf',
    gradient: 'from-sky-300 to-indigo-500' },
  { level: 4, emoji: '🏖️', diffLabel: '⭐⭐',
    titleAr: 'الشاطئ', titleFr: 'La plage', titleEn: 'The beach',
    descAr: 'شورت ونظارات', descFr: 'Short et lunettes', descEn: 'Shorts and sunglasses',
    gradient: 'from-cyan-400 to-amber-400' },
  { level: 5, emoji: '🏜️', diffLabel: '⭐⭐',
    titleAr: 'الصحراء', titleFr: 'Le Sahara', titleEn: 'The Sahara',
    descAr: 'خفيف وماء', descFr: 'Léger, et de l’eau', descEn: 'Light clothes and water',
    gradient: 'from-orange-400 to-amber-600' },
  { level: 6, emoji: '🌙', diffLabel: '⭐⭐⭐',
    titleAr: 'النوم', titleFr: 'Dodo', titleEn: 'Bedtime',
    descAr: 'قميص النوم', descFr: 'Le pyjama', descEn: 'Pajamas',
    gradient: 'from-indigo-500 to-violet-700' },
  { level: 7, emoji: '💨', diffLabel: '⭐⭐⭐',
    titleAr: 'الريح', titleFr: 'Le vent', titleEn: 'The wind',
    descAr: 'معطف ووشاح', descFr: 'Manteau et écharpe', descEn: 'Coat and scarf',
    gradient: 'from-slate-400 to-sky-600' },
  { level: 8, emoji: '🎒', diffLabel: '🏆',
    titleAr: 'المدرسة', titleFr: 'L’école', titleEn: 'School',
    descAr: 'قميص وحقيبة', descFr: 'T-shirt et cartable', descEn: 'T-shirt and backpack',
    gradient: 'from-lime-400 to-emerald-600' },
];

const SLOT_POS: Record<Slot, string> = {
  head: 'top-[6%] left-1/2 -translate-x-1/2',
  face: 'top-[22%] left-1/2 -translate-x-1/2',
  neck: 'top-[32%] left-1/2 -translate-x-1/2',
  body: 'top-[48%] left-1/2 -translate-x-1/2',
  feet: 'bottom-[8%] left-1/2 -translate-x-1/2',
  hand: 'top-[40%] end-[10%]',
};

export const DressDidoGame: React.FC<DressDidoGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('dress_dido', 8);
  const [phase, setPhase] = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('أَلْبِسْ دِيدُو', 'Habille Dido', 'Dress Dido')}
        gameIcon="👕"
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
    <DressBoard
      key={`dress-${activeLevel}`}
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

const DressBoard: React.FC<{
  cfg: LevelCfg;
  language: 'ar' | 'fr' | 'en';
  onExit: () => void;
  onComplete: (stars: number) => void;
}> = ({ cfg, language, onExit, onComplete }) => {
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;
  const { speak } = usePreschoolSpeech(language);
  const mission = t(cfg.missionAr, cfg.missionFr, cfg.missionEn);

  const needed = cfg.garments.filter((g) => g.correct).length;
  const [worn, setWorn] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const didoRef = React.useRef<HTMLDivElement>(null);
  const draggedRef = React.useRef(false);
  const [trayTick, setTrayTick] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      resumeTownAudio();
      speak(mission);
    }, 350);
    return () => window.clearTimeout(id);
  }, [mission, speak]);

  const tryWear = (g: Garment) => {
    if (won || worn.includes(g.id)) return;
    if (g.correct) {
      playBubblePop();
      const next = [...worn, g.id];
      setWorn(next);
      if (next.length >= needed) {
        setWon(true);
        playModuleCompleteFanfare();
        const stars = misses <= 0 ? 3 : misses <= 2 ? 2 : 1;
        setTimeout(() => onComplete(stars), 1400);
      }
    } else {
      playGentleNudge();
      setMisses((n) => n + 1);
      setWrongId(g.id);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const onDragEnd = (g: Garment, info: PanInfo) => {
    draggedRef.current = true;
    const el = didoRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      const { x, y } = info.point;
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        tryWear(g);
      }
    }
    setTrayTick((n) => n + 1);
  };

  const wornItems = cfg.garments.filter((g) => worn.includes(g.id));
  const tray = cfg.garments.filter((g) => !worn.includes(g.id));

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="preschool-safe-top min-h-screen bg-[#F8F9FA] flex flex-col items-center p-4 sm:p-6 gap-4">
      <div className="w-full max-w-3xl flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          className="bg-white shadow-md border-2 border-orange-200 text-slate-800 text-sm px-4 py-2 rounded-2xl font-black cursor-pointer"
        >
          🚪 {t('خروج', 'Retour', 'Back')}
        </motion.button>
        <p className="text-sm font-black text-slate-600">{worn.length} / {needed}</p>
        <div className="w-16" />
      </div>

      <div className="w-full max-w-3xl flex items-center justify-center gap-3 px-2">
        <p className="text-3xl shrink-0">{cfg.weather}</p>
        <p className="text-base sm:text-lg font-black text-slate-800 text-center leading-snug">{mission}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { resumeTownAudio(); speak(mission); }}
          className="min-h-12 min-w-12 shrink-0 rounded-2xl bg-white shadow-md border-2 border-orange-200 text-2xl cursor-pointer"
          aria-label={t('استمع', 'Écouter', 'Listen')}
        >
          🔊
        </motion.button>
      </div>

      <div
        ref={didoRef}
        className={`relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-b ${cfg.bg}
                    border-4 border-orange-200 shadow-xl flex items-center justify-center`}
      >
        <span className="text-[7rem] sm:text-[8rem] select-none leading-none">🦊</span>
        {wornItems.map((g) => (
          <motion.span
            key={g.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 16 }}
            className={`absolute text-5xl sm:text-6xl pointer-events-none ${SLOT_POS[g.slot]}`}
          >
            {g.emoji}
          </motion.span>
        ))}
      </div>

      <p className="text-xs font-bold text-slate-500">
        {t('اِلْمِسْ أَوِ اسْحَبْ إِلَى دِيدُو', 'Touche, ou glisse vers Dido', 'Tap, or drag onto Dido')}
      </p>

      <div className="w-full max-w-xl bg-white rounded-3xl p-4 shadow-md border-2 border-orange-100 flex flex-wrap gap-3 justify-center min-h-24">
        {tray.map((g) => (
          <motion.button
            key={`${g.id}-${trayTick}`}
            type="button"
            drag
            dragMomentum={false}
            dragElastic={0.12}
            onDragStart={() => { resumeTownAudio(); draggedRef.current = true; }}
            onDragEnd={(_, info) => onDragEnd(g, info)}
            onClick={() => {
              if (draggedRef.current) {
                draggedRef.current = false;
                return;
              }
              tryWear(g);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={wrongId === g.id ? { x: [0, -8, 8, -8, 0] } : { x: 0 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F8F9FA] border-2 border-orange-200
                       shadow-md text-4xl cursor-grab active:cursor-grabbing select-none touch-none"
          >
            {g.emoji}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35"
          >
            <div className="bg-white rounded-3xl px-8 py-7 shadow-2xl text-center max-w-xs mx-4 border-2 border-orange-200 space-y-2">
              <p className="text-5xl">🦊👕</p>
              <p className="text-2xl font-black text-slate-800">{t('دِيدُو جَاهِز!', 'Dido est prêt !', 'Dido is ready!')}</p>
              <p className="text-3xl">{'⭐'.repeat(misses <= 0 ? 3 : misses <= 2 ? 2 : 1)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
