import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PreschoolLanguage } from '../../data/preschool/types';
import { ChallengeItem } from './useDailyChallenge';
import { activityPathIcon } from './preschoolGlyphs';

interface DailyChallengeBannerProps {
  items: ChallengeItem[];
  completedIds: string[];
  streak: number;
  language: PreschoolLanguage;
  onNavigateToActivity: (moduleId: string, activityId: string) => void;
}

const LABELS = {
  ar: {
    title: 'تَحَدِّي اليَوْم',
    completed: 'أَنْجَزْتَ التَّحَدِّي! 🎉',
    go: 'انْطَلِقْ!',
    days: 'يَوْم',
    streak: 'سِلْسِلَة أَيَّام',
  },
  fr: {
    title: 'Défi du Jour',
    completed: 'Défi accompli ! 🎉',
    go: 'C\'est parti !',
    days: 'j',
    streak: 'jours consécutifs',
  },
  en: {
    title: 'Daily Challenge',
    completed: 'Challenge done! 🎉',
    go: 'Let\'s go!',
    days: 'd',
    streak: 'day streak',
  },
};

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({
  items,
  completedIds,
  streak,
  language,
  onNavigateToActivity,
}) => {
  const L = LABELS[language];
  const total = items.length;
  const done = items.filter(i => completedIds.includes(i.activityId)).length;
  const allDone = done === total && total > 0;
  const nextItem = items.find(i => !completedIds.includes(i.activityId)) ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      className={`rounded-3xl shadow-md border overflow-hidden mx-1
        ${allDone
          ? 'bg-gradient-to-r from-emerald-400 to-teal-400 border-emerald-300'
          : 'bg-gradient-to-r from-orange-400 to-amber-400 border-orange-300'}`}
    >
      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Row 1: title + streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{allDone ? '✅' : '⚡'}</span>
            <span className="text-white font-black text-base">{L.title}</span>
          </div>

          <AnimatePresence mode="wait">
            {streak > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-white/25 rounded-2xl px-3 py-1"
              >
                <span className="text-lg">🔥</span>
                <span className="text-white font-black text-sm">{streak}{L.days}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Row 2: activity chips */}
        <div className="flex gap-2 justify-center">
          {items.map(item => {
            const isDone = completedIds.includes(item.activityId);
            const title = item.activity.i18n[language]?.title ?? item.module.titleI18n[language];
            return (
              <motion.button
                key={item.activityId}
                whileTap={{ scale: 0.9 }}
                onClick={() => !isDone && onNavigateToActivity(item.moduleId, item.activityId)}
                disabled={isDone}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-2xl transition-all cursor-pointer
                  ${isDone
                    ? 'bg-white/30 opacity-80'
                    : 'bg-white/20 hover:bg-white/30 active:bg-white/40'}`}
              >
                <span className="text-2xl">{isDone ? '✅' : activityPathIcon(item.activity, language)}</span>
                <span className="text-[10px] font-bold text-white/90 text-center leading-tight line-clamp-2">
                  {title}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Row 3: progress bar + CTA */}
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            />
          </div>

          <span className="text-white font-black text-sm shrink-0">{done}/{total}</span>

          {!allDone && nextItem && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigateToActivity(nextItem.moduleId, nextItem.activityId)}
              className="bg-white rounded-2xl px-3 py-1.5 text-orange-600 font-black text-xs shadow-sm cursor-pointer shrink-0"
            >
              {L.go}
            </motion.button>
          )}

          {allDone && (
            <span className="text-white font-black text-xs shrink-0">🌟 +{streak > 1 ? streak : '1'}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
