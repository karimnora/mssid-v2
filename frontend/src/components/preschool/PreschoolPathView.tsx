import React from 'react';
import { motion } from 'motion/react';
import { PreschoolModule, PreschoolLanguage } from '../../data/preschool/types';
import { PreschoolMascot } from './PreschoolMascot';

interface PreschoolPathViewProps {
  module: PreschoolModule;
  language: PreschoolLanguage;
  completedActivityIds: string[];
  onSelectStep: (activityId: string) => void;
  onExit: () => void;
}

// The Duolingo-style "skill path" — deliberately short (11 nodes for this module) and concrete: no
// percentages, no "12/40" abstraction a 3-5 year old can't parse. Steps unlock strictly in order;
// only the next unplayed step and completed steps are tappable, which keeps the choice simple
// (never a confusing branching map at this age).
export const PreschoolPathView: React.FC<PreschoolPathViewProps> = ({ module, language, completedActivityIds, onSelectStep, onExit }) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const nextUnlockedIndex = module.activities.findIndex((a) => !completedActivityIds.includes(a.id));
  const allDone = nextUnlockedIndex === -1;

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-full bg-white shadow-md text-xl cursor-pointer"
            aria-label="خروج / Quitter / Exit"
          >
            🚪
          </button>
          <h1 className="text-lg sm:text-xl font-black text-orange-900 text-center flex-1">
            {module.icon} {module.titleI18n[language]}
          </h1>
          <div className="w-11" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <PreschoolMascot mood={allDone ? 'celebrate' : 'idle'} size="md" />
          {allDone && (
            <p className="text-center font-black text-emerald-700 text-sm">
              🎉 {language === 'ar' ? 'أنهيت كل الرحلة!' : language === 'fr' ? 'Parcours terminé !' : 'Path complete!'}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          {module.activities.map((activity, index) => {
            const isCompleted = completedActivityIds.includes(activity.id);
            const isNext = index === nextUnlockedIndex;
            const isLocked = !isCompleted && !isNext;
            const offsetClass = index % 2 === 0 ? '-translate-x-6' : 'translate-x-6';

            return (
              <motion.button
                key={activity.id}
                disabled={isLocked}
                onClick={() => onSelectStep(activity.id)}
                whileTap={!isLocked ? { scale: 0.92 } : undefined}
                whileHover={!isLocked ? { scale: 1.05 } : undefined}
                className={`relative min-h-20 min-w-20 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg border-4 transition-colors ${offsetClass} ${
                  isCompleted
                    ? 'bg-emerald-400 border-emerald-600 cursor-pointer'
                    : isNext
                    ? 'bg-amber-400 border-amber-600 cursor-pointer animate-pulse'
                    : 'bg-slate-200 border-slate-300 opacity-60 cursor-not-allowed'
                }`}
                aria-label={`${activity.i18n[language].title}`}
              >
                <span className="text-2xl font-black text-white drop-shadow">
                  {isCompleted ? '⭐' : isLocked ? '🔒' : String(activity.targetValue)}
                </span>
                {isNext && (
                  <span className="absolute -top-9 text-3xl">🦊</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
