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

// The Duolingo-style "skill path" for Mode Éveil.
// ALL steps are fully unlocked by default so a young child (3-5 yo) or parent is NEVER blocked
// from exploring any activity or moving forward at their own pace.
export const PreschoolPathView: React.FC<PreschoolPathViewProps> = ({ module, language, completedActivityIds, onSelectStep, onExit }) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const allDone = module.activities.every((a) => completedActivityIds.includes(a.id));

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-100"
            aria-label="خروج / Quitter / Exit"
          >
            🚪
          </button>
          <h1 className="text-lg sm:text-xl font-black text-orange-900 text-center flex-1">
            {module.icon} {module.titleI18n[language]}
          </h1>
          <div className="w-12" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <PreschoolMascot mood={allDone ? 'celebrate' : 'idle'} size="md" />
          {allDone ? (
            <p className="text-center font-black text-emerald-700 text-sm">
              🎉 {language === 'ar' ? 'أحسنت يا بطل! أنهيت كل الرحلة!' : language === 'fr' ? 'Bravo ! Parcours terminé !' : 'Great job! Path complete!'}
            </p>
          ) : (
            <p className="text-center font-bold text-orange-800 text-xs">
              {language === 'ar' ? 'اختر أي لعبة تحب والعب مباشرة! ✨' : language === 'fr' ? 'Choisis n\'importe quel jeu et amuse-toi ! ✨' : 'Pick any game and have fun! ✨'}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          {module.activities.map((activity, index) => {
            const isCompleted = completedActivityIds.includes(activity.id);
            const offsetClass = index % 2 === 0 ? '-translate-x-6' : 'translate-x-6';

            return (
              <motion.button
                key={activity.id}
                onClick={() => onSelectStep(activity.id)}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.06 }}
                className={`relative min-h-20 min-w-20 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg border-4 transition-all cursor-pointer ${offsetClass} ${
                  isCompleted
                    ? 'bg-emerald-400 border-emerald-600'
                    : 'bg-amber-400 border-amber-500 hover:bg-amber-300'
                }`}
                aria-label={`${activity.i18n[language].title}`}
              >
                <span className="text-2xl font-black text-white drop-shadow">
                  {isCompleted ? '⭐' : String(activity.targetValue)}
                </span>
                {!isCompleted && (
                  <span className="absolute -top-7 text-2xl animate-bounce">✨</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
