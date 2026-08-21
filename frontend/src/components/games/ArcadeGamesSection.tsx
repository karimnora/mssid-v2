import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade } from '../../types';
import { ARCADE_GAMES, ArcadeGameDef } from '../../data/arcadeGamesData';
import { NumberSortGame } from './NumberSortGame';
import { SpellingChampGame } from './SpellingChampGame';
import { MathStarsGame } from './MathStarsGame';
import { DiduRunner } from './DiduRunner';
import { TowerStackGame } from './TowerStackGame';
import { Galaxy3DGame } from './Galaxy3DGame';

interface ArcadeGamesSectionProps {
  grade: PrimaryGrade;
  userXp: number;
  userBadges: string[];
  completedGameIds: string[];
  onGameComplete: (gameId: string, earnedXp: number) => void;
}

function isUnlocked(game: ArcadeGameDef, xp: number, badges: string[]): boolean {
  if (xp >= game.xpUnlock) return true;
  if (game.badgeUnlock && badges.includes(game.badgeUnlock)) return true;
  return false;
}

function isGradeEligible(game: ArcadeGameDef, grade: PrimaryGrade): boolean {
  return game.grades.includes(grade);
}

export const ArcadeGamesSection: React.FC<ArcadeGamesSectionProps> = ({
  grade,
  userXp,
  userBadges,
  completedGameIds,
  onGameComplete,
}) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleGameComplete = (gameId: string, earnedXp: number) => {
    onGameComplete(gameId, earnedXp);
    setActiveGame(null);
  };

  // Active game views
  if (activeGame === 'number_sort') {
    return (
      <NumberSortGame
        grade={grade}
        onExit={() => setActiveGame(null)}
        onComplete={(xp) => handleGameComplete('number_sort', xp)}
      />
    );
  }
  if (activeGame === 'dido_runner') {
    return (
      <DiduRunner
        language="ar"
        onExit={() => setActiveGame(null)}
        onComplete={(xp) => handleGameComplete('dido_runner', xp ?? 0)}
      />
    );
  }
  if (activeGame === 'tower_stack') {
    return (
      <TowerStackGame
        language="ar"
        onExit={() => setActiveGame(null)}
        onComplete={(xp) => handleGameComplete('tower_stack', xp ?? 0)}
      />
    );
  }
  if (activeGame === 'spelling_champ') {
    return (
      <SpellingChampGame
        onExit={() => setActiveGame(null)}
        onComplete={(xp) => handleGameComplete('spelling_champ', xp)}
      />
    );
  }
  if (activeGame === 'galaxy_3d') {
    return (
      <Galaxy3DGame
        language="ar"
        onExit={() => setActiveGame(null)}
        onComplete={(xp) => handleGameComplete('galaxy_3d', xp ?? 0)}
      />
    );
  }
  if (activeGame === 'math_stars') {
    return (
      <MathStarsGame
        language="ar"
        onExit={() => setActiveGame(null)}
        onComplete={(xp) => handleGameComplete('math_stars', xp ?? 0)}
      />
    );
  }

  const visibleGames = ARCADE_GAMES.filter((g) => isGradeEligible(g, grade));

  return (
    <div className="p-4 pb-8" dir="rtl">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-extrabold text-slate-800">🎮 ألعاب الترويح</h2>
        <p className="text-sm text-slate-400 mt-1">العب، تعلّم، واربح نقاط XP</p>
      </div>

      {/* XP progress card */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl p-4 mb-5 shadow-sm border border-amber-100">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-amber-700 text-sm">نقاطك الحالية</span>
          <span className="font-extrabold text-amber-700 text-lg">{userXp} XP ⭐</span>
        </div>
        <div className="w-full bg-amber-100 rounded-full h-2">
          <motion.div
            className="bg-amber-400 h-2 rounded-full"
            animate={{ width: `${Math.min((userXp / 400) * 100, 100)}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-amber-500">
          <span>0 XP</span>
          <span>🔓 150 XP</span>
          <span>🔓 350 XP</span>
          <span>400 XP</span>
        </div>
      </div>

      {/* Games grid */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {visibleGames.map((game, idx) => {
            const unlocked = isUnlocked(game, userXp, userBadges);
            const completed = completedGameIds.includes(game.id);
            const xpNeeded = game.xpUnlock - userXp;

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 260, damping: 22 }}
              >
                <motion.button
                  whileHover={unlocked ? { scale: 1.02 } : {}}
                  whileTap={unlocked ? { scale: 0.97 } : {}}
                  onClick={() => {
                    if (!unlocked) {
                      const msg = game.badgeUnlock
                        ? `اجمع ${Math.max(0, xpNeeded)} XP أو احصل على الشارة المطلوبة لفتح هذه اللعبة!`
                        : `اجمع ${Math.max(0, xpNeeded)} XP إضافية لفتح هذه اللعبة!`;
                      alert(msg);
                      return;
                    }
                    setActiveGame(game.id);
                  }}
                  className={`w-full rounded-3xl overflow-hidden shadow-md text-right transition-all duration-200 ${unlocked ? 'cursor-pointer' : 'cursor-default opacity-75'}`}
                >
                  <div className={`bg-gradient-to-l ${game.gradient} p-4 relative`}>
                    {/* Lock overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl mb-1">🔒</div>
                          <p className="text-white font-bold text-xs">
                            {game.badgeUnlock ? `${Math.max(0, xpNeeded)} XP أو شارة` : `${Math.max(0, xpNeeded)} XP`}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{game.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-extrabold text-lg">{game.titleAr}</h3>
                          {completed && <span className="bg-white/30 text-white text-xs font-bold rounded-full px-2 py-0.5">✅ أُنجز</span>}
                        </div>
                        <p className="text-white/80 text-sm italic">{game.titleFr}</p>
                        <p className="text-white/70 text-xs mt-1">{game.descAr}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="bg-white/20 rounded-xl px-3 py-1 text-white text-xs font-bold">
                        +{game.xpReward} XP
                      </div>
                      {unlocked && (
                        <div className="bg-white/90 rounded-xl px-4 py-1 text-slate-700 text-xs font-bold shadow">
                          ▶ العب الآن
                        </div>
                      )}
                      {!unlocked && game.xpUnlock > 0 && (
                        <div className="bg-white/20 rounded-xl px-3 py-1 text-white text-xs">
                          يُفتح عند {game.xpUnlock} XP
                        </div>
                      )}
                    </div>
                  </div>

                  {/* XP progress bar for locked games */}
                  {!unlocked && game.xpUnlock > 0 && (
                    <div className="bg-slate-100 px-4 py-2">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{userXp} XP</span>
                        <span>الهدف: {game.xpUnlock} XP</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full"
                          animate={{ width: `${Math.min((userXp / game.xpUnlock) * 100, 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {visibleGames.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-3">🎮</div>
            <p className="font-bold">لا توجد ألعاب لمستواك بعد</p>
            <p className="text-sm mt-1">ارفع مستواك للاستمتاع بالألعاب</p>
          </div>
        )}
      </div>
    </div>
  );
};
