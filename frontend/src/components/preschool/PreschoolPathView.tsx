import React from 'react';
import { motion } from 'motion/react';
import { PreschoolModule, PreschoolLanguage } from '../../data/preschool/types';
import { PreschoolMascot } from './PreschoolMascot';
import { activityPathIcon } from './preschoolGlyphs';

interface PreschoolPathViewProps {
  module: PreschoolModule;
  language: PreschoolLanguage;
  completedActivityIds: string[];
  onSelectStep: (activityId: string) => void;
  onExit: () => void;
}

// Duolingo-style skill path with activity titles and progress bar.
// ALL steps remain fully unlocked — a 3-5 yo is never blocked.
export const PreschoolPathView: React.FC<PreschoolPathViewProps> = ({
  module, language, completedActivityIds, onSelectStep, onExit,
}) => {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const total = module.activities.length;
  const done = module.activities.filter(a => completedActivityIds.includes(a.id)).length;
  const allDone = done === total;
  const pct = total > 0 ? (done / total) * 100 : 0;

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 px-4 py-6">
      <div className="max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onExit}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-white shadow-md text-2xl
                       hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-orange-100"
            aria-label="خروج / Quitter / Exit"
          >
            🚪
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-lg sm:text-xl font-black text-orange-900">
              {module.icon} {module.titleI18n[language]}
            </h1>
          </div>
          <div className="w-12" />
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-orange-700/80 px-1">
            <span>{t('التَّقَدُّم', 'Progression', 'Progress')}</span>
            <span>{done} / {total} ⭐</span>
          </div>
          <div className="h-3 bg-amber-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className={`h-full rounded-full ${allDone ? 'bg-emerald-400' : 'bg-amber-400'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.1 }}
            />
          </div>
        </div>

        {/* Mascot + status */}
        <div className="flex flex-col items-center gap-2">
          <PreschoolMascot mood={allDone ? 'celebrate' : 'idle'} size="md" />
          {allDone ? (
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center font-black text-emerald-700 text-sm bg-emerald-100 rounded-2xl px-4 py-2 border border-emerald-200"
            >
              🏆 {t('أَنْجَزْتَ كُلَّ الرِّحْلَة! مُمْتَاز!', 'Parcours entièrement terminé ! Bravo !', 'Full path complete! Amazing!')}
            </motion.p>
          ) : (
            <p className="text-center font-bold text-orange-800 text-xs">
              {t('اخْتَرْ أَيَّ لُعْبَةٍ تُحِبُّ وَالعَبْ! ✨', 'Choisis n\'importe quel jeu et amuse-toi ! ✨', 'Pick any game and have fun! ✨')}
            </p>
          )}
        </div>

        {/* Activity path — zigzag */}
        <div className="flex flex-col items-center gap-5 py-4 pb-8">
          {module.activities.map((activity, index) => {
            const isCompleted = completedActivityIds.includes(activity.id);
            const offsetClass = index % 2 === 0 ? '-translate-x-8 sm:-translate-x-12' : 'translate-x-8 sm:translate-x-12';
            const actTitle = activity.i18n[language]?.title ?? '';
            const nodeIcon = activityPathIcon(activity, language);

            return (
              <motion.div
                key={activity.id}
                className={`flex flex-col items-center gap-1.5 ${offsetClass}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
              >
                {/* Bounce indicator for first incomplete */}
                {!isCompleted && index === done && (
                  <span className="text-2xl animate-bounce select-none">✨</span>
                )}

                <motion.button
                  onClick={() => onSelectStep(activity.id)}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.1 }}
                  className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg border-4
                              transition-all cursor-pointer select-none
                              ${isCompleted
                                ? 'bg-emerald-400 border-emerald-600 shadow-emerald-200'
                                : 'bg-amber-400 border-amber-500 hover:bg-amber-300 shadow-amber-200'}`}
                  aria-label={actTitle}
                >
                  {/* Step number badge */}
                  <span className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center
                                    text-[10px] font-black border-2 border-white
                                    ${isCompleted ? 'bg-emerald-600 text-white' : 'bg-orange-500 text-white'}`}>
                    {activity.stepNumber}
                  </span>

                  <span className={`font-black text-white drop-shadow select-none ${nodeIcon.length > 1 ? 'text-lg' : 'text-2xl'}`}>
                    {isCompleted ? '⭐' : nodeIcon}
                  </span>
                </motion.button>

                {/* Activity title below circle */}
                <p className={`text-[11px] font-black text-center max-w-[120px] leading-tight
                               ${isCompleted ? 'text-emerald-700' : 'text-orange-800'}`}>
                  {actTitle}
                </p>
              </motion.div>
            );
          })}

          {/* Module complete trophy at the end */}
          {allDone && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="text-6xl select-none animate-bounce mt-2"
            >
              🏆
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
