/**
 * GamesHub.tsx
 * Écran de sélection des mini-jeux pour la section "Espace Jeux & Labyrinthes"
 * 9 jeux Phaser.js + React pour enfants de 2-5 ans.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CarMazeGame }      from './CarMazeGame';
import { FarmGame }         from './FarmGame';
import { BalloonPopGame }   from './BalloonPopGame';
import { FruitCatcherGame } from './FruitCatcherGame';
import { ShapeSorterGame }  from './ShapeSorterGame';
import { CarWashGame }      from './CarWashGame';
import { MagicTapGame }     from './MagicTapGame';
import { PuzzleGame }       from './PuzzleGame';
import { SensoryTapGame }   from './SensoryTapGame';
import { useLevelProgress } from './useLevelProgress';

export type GameId =
  | 'car_maze' | 'farm' | 'balloon_pop' | 'fruit_catcher' | 'shape_sorter'
  | 'car_wash' | 'magic_tap' | 'puzzle' | 'sensory_tap';

interface GameCard {
  id: GameId;
  icon: string;
  titleAr: string; titleFr: string; titleEn: string;
  descAr: string;  descFr: string;  descEn: string;
  gradient: string;
  border: string;
  badge: string;
  /** If set, totalStars from useLevelProgress are shown on the card */
  progressId?: string;
  maxLevels?: number;
}

/** Tiny component so the hook-per-game call is valid (top-level hook inside a component). */
const StarBadge: React.FC<{ progressId: string; maxLevels: number }> = ({ progressId, maxLevels }) => {
  const { totalStars } = useLevelProgress(progressId, maxLevels);
  if (totalStars === 0) return null;
  return (
    <div className="flex items-center gap-0.5 bg-black/20 backdrop-blur-xs rounded-full px-2.5 py-1">
      <span className="text-sm">⭐</span>
      <span className="text-[11px] font-black text-white">{totalStars}</span>
    </div>
  );
};

const GAMES: GameCard[] = [
  {
    id: 'car_maze',
    icon: '🚦',
    titleAr: 'في المدينة',       titleFr: 'En Ville',           titleEn: 'Around Town',
    descAr:  'دراجة، تاكسي، دراجة نارية وقطار — 10 مسارات!', descFr:  'Vélo, taxi, moto et train — 10 parcours !', descEn:  'Bike, taxi, moto and train — 10 routes!',
    gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-300',   badge: '🕹️ Labyrinthe',
    progressId: 'car_maze', maxLevels: 10,
  },
  {
    id: 'farm',
    icon: '🐄',
    titleAr: 'في المزرعة',       titleFr: 'À la Ferme',           titleEn: 'On the Farm',
    descAr:  'أرنب، بطة، كلب وحمار — 14 مساراً!', descFr:  'Lapin, canard, chien, âne — 14 parcours !', descEn:  'Rabbit, duck, dog, donkey — 14 routes!',
    gradient: 'from-lime-400 to-green-600', border: 'border-lime-300', badge: '🌾 Ferme',
    progressId: 'farm', maxLevels: 14,
  },
  {
    id: 'balloon_pop',
    icon: '🎈',
    titleAr: 'فرقع البالونات',                   titleFr: 'Éclate les Ballons',                         titleEn: 'Pop the Balloons',
    descAr:  '8 عوالم — اضغط البالونات الضاحكة!', descFr:  '8 mondes — éclate les ballons souriants !', descEn:  '8 worlds — pop the smiley balloons!',
    gradient: 'from-rose-400 to-pink-600', border: 'border-rose-300', badge: '🎯 Réflexes',
    progressId: 'balloon_pop', maxLevels: 8,
  },
  {
    id: 'fruit_catcher',
    icon: '🍎',
    titleAr: 'السلة الجائعة',                   titleFr: 'Le Panier Gourmand',                    titleEn: 'Hungry Basket',
    descAr:  'تفاح، تمر، بطيخ — 8 سلال في السوق!', descFr:  'Pommes, dattes, pastèque — 8 paniers au souk !', descEn:  'Apples, dates, watermelon — 8 baskets at the souk!',
    gradient: 'from-emerald-400 to-green-600', border: 'border-emerald-300', badge: '⭐ Réactivité',
    progressId: 'fruit_catcher', maxLevels: 8,
  },
  {
    id: 'shape_sorter',
    icon: '🧩',
    titleAr: 'فرّز الأشكال والألوان',        titleFr: 'Trieur de Formes',                   titleEn: 'Shape Sorter',
    descAr:  'ضع كل شكل في صندوقه!',        descFr:  'Glisse chaque forme dans sa boîte !', descEn:  'Drag shapes into matching boxes!',
    gradient: 'from-violet-400 to-purple-600', border: 'border-violet-300', badge: '🎨 Logique',
    progressId: 'shape_sorter', maxLevels: 4,
  },
  {
    id: 'car_wash',
    icon: '🧼',
    titleAr: 'اغسل السيارة الوسخة!',             titleFr: 'Lave la Voiture !',                      titleEn: 'Car Wash Fun!',
    descAr:  'امسح الطين وأضفِ البريق للسيارة', descFr:  'Frotte la voiture et fais-la briller !', descEn:  'Scrub the mud and make it shine!',
    gradient: 'from-cyan-400 to-sky-600', border: 'border-cyan-300', badge: '💧 Amusant',
    progressId: 'car_wash', maxLevels: 4,
  },
  {
    id: 'sensory_tap',
    icon: '🌈',
    titleAr: 'العَالَمُ السِّحْرِيّ',                 titleFr: 'Le Monde Magique',                    titleEn: 'Magic World',
    descAr:  'اِلْمَسْ أَيَّ مَكَانٍ وَشَاهِدِ العَجَائِب!', descFr:  'Touche partout et vois les merveilles !', descEn:  'Tap anywhere and see the wonders!',
    gradient: 'from-pink-400 to-purple-500', border: 'border-pink-300', badge: '👶 Mode Bébé',
  },
  {
    id: 'magic_tap',
    icon: '🪄',
    titleAr: 'دِيدُو السَّاحِر',                   titleFr: 'Dido le Magicien',                       titleEn: 'Dido the Magician',
    descAr:  'اِلمَسِ الشَّاشَةَ لِتَرَى السِّحْر!', descFr:  'Touche l\'écran et vois la magie !',       descEn:  'Tap the screen and see the magic!',
    gradient: 'from-violet-500 to-indigo-600', border: 'border-violet-300', badge: '✨ Magie',
  },
  {
    id: 'puzzle',
    icon: '🧩',
    titleAr: 'أَلْغَازُ دِيدُو',                  titleFr: 'Le Puzzle de Dido',                      titleEn: 'Dido\'s Puzzle',
    descAr:  'رَكِّبِ الأَلْغَازَ وَأَكْمِلِ الصُّورَة!', descFr:  'Assemble les pièces et complète l\'image !', descEn:  'Assemble pieces to complete the picture!',
    gradient: 'from-amber-400 to-orange-500', border: 'border-amber-300', badge: '🧠 Puzzle',
  },
];

interface GamesHubProps {
  language?: 'ar' | 'fr' | 'en';
  onExit?: () => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({ language = 'fr', onExit }) => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const title   = t('ركن الألعاب والمرح 🎮', 'Espace Jeux & Fun 🎮', 'Games & Fun Hub 🎮');
  const subtitle = t('اختر لعبتك المفضلة واستمتع!', 'Choisis ton jeu préféré et amuse-toi !', 'Pick your favorite game and have fun!');
  const back    = t('خروج', 'Retour', 'Back');

  // Render active game
  const renderGame = () => {
    const exit = () => setActiveGame(null);
    switch (activeGame) {
      case 'car_maze':      return <CarMazeGame      language={language} onExit={exit} />;
      case 'farm':          return <FarmGame         language={language} onExit={exit} />;
      case 'balloon_pop':   return <BalloonPopGame   language={language} onExit={exit} />;
      case 'fruit_catcher': return <FruitCatcherGame language={language} onExit={exit} />;
      case 'shape_sorter':  return <ShapeSorterGame  language={language} onExit={exit} />;
      case 'car_wash':      return <CarWashGame      language={language} onExit={exit} />;
      case 'magic_tap':     return <MagicTapGame     language={language} onExit={exit} />;
      case 'puzzle':        return <PuzzleGame       language={language} onExit={exit} />;
      case 'sensory_tap':   return <SensoryTapGame   language={language} onExit={exit} />;
      default:              return null;
    }
  };

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <AnimatePresence mode="wait">
        {activeGame ? (
          <motion.div key={activeGame}
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          >
            {renderGame()}
          </motion.div>
        ) : (
          <motion.div key="hub"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="min-h-screen bg-gradient-to-b from-indigo-100 via-sky-50 to-violet-100 px-4 py-6"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {onExit && (
                  <button onClick={onExit}
                    className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-indigo-50 cursor-pointer border border-indigo-200 transition-all active:scale-95"
                  >🚪</button>
                )}
                <div className="flex-1 text-center">
                  <h1 className="text-2xl sm:text-3xl font-black text-indigo-950">{title}</h1>
                  <p className="text-sm font-bold text-indigo-700/70 mt-1">{subtitle}</p>
                </div>
                <div className="min-w-12" />
              </div>

              {/* Games grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {GAMES.map((g, i) => {
                  const name = language === 'ar' ? g.titleAr : language === 'fr' ? g.titleFr : g.titleEn;
                  const desc = language === 'ar' ? g.descAr  : language === 'fr' ? g.descFr  : g.descEn;
                  return (
                    <motion.button
                      key={g.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
                      whileHover={{ scale: 1.04, translateY: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveGame(g.id)}
                      className={`rounded-3xl bg-gradient-to-br ${g.gradient} p-5 text-white shadow-xl border-2 ${g.border}
                                  flex flex-col gap-3 cursor-pointer relative overflow-hidden text-start min-h-36`}
                    >
                      {/* Decorative circle */}
                      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                      <div className="flex items-start justify-between relative z-10">
                        <span className="text-5xl drop-shadow">{g.icon}</span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className="bg-black/20 backdrop-blur-xs text-[11px] font-black px-2.5 py-1 rounded-full whitespace-nowrap">
                            {g.badge}
                          </span>
                          {g.progressId && g.maxLevels && (
                            <StarBadge progressId={g.progressId} maxLevels={g.maxLevels} />
                          )}
                        </div>
                      </div>
                      <div className="relative z-10">
                        <p className="text-base font-black drop-shadow-xs">{name}</p>
                        <p className="text-[12px] text-white/85 mt-0.5 leading-snug">{desc}</p>
                      </div>
                      <div className="relative z-10 mt-auto">
                        <span className="bg-white/20 hover:bg-white/30 text-white font-black text-xs px-4 py-1.5 rounded-full inline-block transition-colors">
                          {t('العب الآن ▶', 'Jouer ▶', 'Play ▶')}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer hint */}
              <p className="text-center text-xs text-indigo-500 font-bold pb-2">
                {t('9 ألعاب ممتعة وتعليمية لعمر 2-5 سنوات 🎈',
                   '9 jeux éducatifs et amusants pour 2-5 ans 🎈',
                   '9 fun educational games for ages 2-5 🎈')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
