/**
 * GamesHub.tsx
 * Écran de sélection des mini-jeux du préscolaire.
 * 8 jeux pour enfants de 3-5 ans.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CarMazeGame }      from './CarMazeGame';
import { FarmGame }         from './FarmGame';
import { BalloonPopGame }   from './BalloonPopGame';
import { FruitCatcherGame } from './FruitCatcherGame';
import { ShapeSorterGame }  from './ShapeSorterGame';
import { PuzzleGame }       from './PuzzleGame';
import { LittleFisherGame } from './LittleFisherGame';
import { DressDidoGame }    from './DressDidoGame';
import { useLevelProgress } from './useLevelProgress';
import { GAMES, GameId }    from './gamesHubCatalog';
import { PreschoolMuteButton } from './PreschoolMuteButton';
import { LearningGamesShelf } from '../games/learning/LearningGameEntry';

export type { GameId } from './gamesHubCatalog';
export { GAMES } from './gamesHubCatalog';

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

interface GamesHubProps {
  language?: 'ar' | 'fr' | 'en';
  onExit?: () => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({ language = 'fr', onExit }) => {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const title   = t('رُكْنُ الْأَلْعَاب 🎮', 'Espace Jeux 🎮', 'Games Hub 🎮');
  const subtitle = t('اِخْتَرْ لُعْبَتَكَ وَاسْتَمْتِعْ!', 'Choisis ton jeu préféré et amuse-toi !', 'Pick your favourite game and have fun!');
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
      case 'dress_dido':    return <DressDidoGame    language={language} onExit={exit} />;
      case 'little_fisher': return <LittleFisherGame language={language} onExit={exit} />;
      case 'puzzle':        return <PuzzleGame       language={language} onExit={exit} />;
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
            className="relative"
          >
            <div className="absolute top-4 end-4 z-20">
              <PreschoolMuteButton language={language} />
            </div>
            {renderGame()}
          </motion.div>
        ) : (
          <motion.div key="hub"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="preschool-safe-top min-h-screen bg-gradient-to-b from-indigo-100 via-sky-50 to-violet-100 px-4 py-6"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {onExit && (
                    <button onClick={onExit}
                      aria-label={t('العودة إلى الاستقبال', 'Retour à l’accueil', 'Back to home')}
                      className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-indigo-50 cursor-pointer border border-indigo-200 transition-all active:scale-95"
                    >{language === 'ar' ? '▶' : '◀'}</button>
                  )}
                  <PreschoolMuteButton language={language} className="border-indigo-200 text-indigo-800 hover:bg-indigo-50" />
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-2xl sm:text-3xl font-black text-indigo-950">{title}</h1>
                  <p className="text-sm font-bold text-indigo-700/70 mt-1">{subtitle}</p>
                </div>
                <div className="min-w-12" />
              </div>

              {/* « ألعاب ديدو التعليمية »: the 3D adventures of the preschool level (Arabic, read aloud by Didou). */}
              {language === 'ar' && (
                <div className="rounded-3xl bg-white/70 border-2 border-indigo-200 p-4 shadow-md text-indigo-950" data-preschool-learning-games>
                  <LearningGamesShelf grade="PRE" />
                </div>
              )}

              {/* Games grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {GAMES.map((g, i) => {
              const name = language === 'ar' ? g.titleAr : language === 'fr' ? g.titleFr : g.titleEn;
              const desc = language === 'ar' ? g.descAr  : language === 'fr' ? g.descFr  : g.descEn;
              const badge = language === 'ar' ? g.badgeAr : language === 'fr' ? g.badgeFr : g.badgeEn;
                  return (
                    <motion.button
                      key={g.id}
                      data-preschool-game={g.id}
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
                            {badge}
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
                {t('8 أَلْعَاب مُمْتِعَة لِعُمْر 3-5 سَنَوَات 🎈',
                   '8 jeux amusants et éducatifs pour 3-5 ans 🎈',
                   '8 fun educational games for ages 3-5 🎈')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
