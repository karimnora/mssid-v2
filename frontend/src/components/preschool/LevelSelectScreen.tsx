/**
 * LevelSelectScreen.tsx
 * Écran de sélection des niveaux partagé entre tous les mini-jeux.
 * Design adapté aux 3-5 ans : grosses cartes colorées, étoiles visibles,
 * verrouillage progressif animé.
 */
import React from 'react';
import { motion } from 'motion/react';

export interface LevelDef {
  level: number;
  emoji: string;
  /** Label court : "⭐", "⭐⭐", "⭐⭐⭐", "🏆" */
  diffLabel: string;
  /** Titre court du niveau */
  titleAr: string; titleFr: string; titleEn: string;
  /** Courte description pédagogique */
  descAr: string; descFr: string; descEn: string;
  gradient: string;
  /** Niveau débloqué ? (calculé par le parent) */
  unlocked: boolean;
  /** Étoiles gagnées (0-3) */
  earnedStars: number;
}

interface LevelSelectScreenProps {
  gameTitle: string;
  gameIcon: string;
  levels: LevelDef[];
  language: 'ar' | 'fr' | 'en';
  onSelectLevel: (level: number) => void;
  onExit: () => void;
}

const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
  <span className={`text-lg ${filled ? 'text-amber-400' : 'text-slate-300'}`}>★</span>
);

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  gameTitle, gameIcon, levels, language, onSelectLevel, onExit,
}) => {
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const backLabel  = t('خروج', 'Retour', 'Back');
  const chooseLabel = t('اختر المستوى', 'Choisis ton niveau', 'Choose your level');
  const lockedLabel = t('🔒 مغلق', '🔒 Verrouillé', '🔒 Locked');
  const playLabel  = t('▶ العب', '▶ Jouer', '▶ Play');
  const bestLabel  = t('أفضل نتيجة', 'Meilleur résultat', 'Best score');

  return (
    <div dir={dir} className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center py-6 px-4 gap-5">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.92 }} onClick={onExit}
          className="bg-white/10 hover:bg-white/20 text-white font-black px-4 py-2.5 rounded-2xl border border-white/20 cursor-pointer text-sm transition-colors"
        >
          🚪 {backLabel}
        </motion.button>
        <div className="flex flex-col items-center gap-1">
          <span className="text-5xl drop-shadow-lg">{gameIcon}</span>
          <p className="text-white font-black text-base text-center drop-shadow">{gameTitle}</p>
        </div>
        <div className="w-20" />
      </div>

      {/* Subtitle */}
      <p className="text-indigo-200 font-bold text-sm">{chooseLabel}</p>

      {/* Level cards grid */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 sm:grid-cols-4">
        {levels.map((lvl, i) => {
          const name = language === 'ar' ? lvl.titleAr : language === 'fr' ? lvl.titleFr : lvl.titleEn;
          const desc = language === 'ar' ? lvl.descAr  : language === 'fr' ? lvl.descFr  : lvl.descEn;
          const isNew = lvl.unlocked && lvl.earnedStars === 0;

          return (
            <motion.div
              key={lvl.level}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09, type: 'spring', stiffness: 260, damping: 22 }}
              className="relative"
            >
              {/* "NEW" badge */}
              {isNew && (
                <div className="absolute -top-2 -right-2 z-10 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                  {t('جديد!', 'NOUVEAU!', 'NEW!')}
                </div>
              )}

              <motion.button
                whileHover={lvl.unlocked ? { scale: 1.04, translateY: -2 } : {}}
                whileTap={lvl.unlocked ? { scale: 0.95 } : {}}
                onClick={() => lvl.unlocked && onSelectLevel(lvl.level)}
                className={`w-full rounded-3xl p-4 flex flex-col gap-2 text-center cursor-pointer border-2 transition-all relative overflow-hidden
                  ${lvl.unlocked
                    ? `bg-gradient-to-br ${lvl.gradient} border-white/30 shadow-xl`
                    : 'bg-slate-800/60 border-slate-700 cursor-not-allowed opacity-60'
                  }`}
              >
                {/* Decorative glow for unlocked */}
                {lvl.unlocked && (
                  <div className="absolute inset-0 bg-white/5 rounded-3xl" />
                )}

                {/* Level number */}
                <div className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} text-[11px] font-black ${lvl.unlocked ? 'text-white/60' : 'text-slate-500'}`}>
                  {t(`م${lvl.level}`, `N${lvl.level}`, `L${lvl.level}`)}
                </div>

                {/* Emoji + diff label */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-4xl drop-shadow">{lvl.unlocked ? lvl.emoji : '🔒'}</span>
                  <span className={`text-sm font-black ${lvl.unlocked ? 'text-white/80' : 'text-slate-500'}`}>
                    {lvl.diffLabel}
                  </span>
                </div>

                {/* Title */}
                <p className={`text-sm font-black leading-snug ${lvl.unlocked ? 'text-white drop-shadow-xs' : 'text-slate-500'}`}>
                  {lvl.unlocked ? name : lockedLabel}
                </p>

                {/* Description (only when unlocked) */}
                {lvl.unlocked && (
                  <p className="text-[10px] text-white/75 leading-tight line-clamp-2">{desc}</p>
                )}

                {/* Stars */}
                <div className="flex justify-center gap-0.5 mt-auto">
                  {[1, 2, 3].map(s => (
                    <Star key={s} filled={lvl.earnedStars >= s} />
                  ))}
                </div>

                {/* Play button */}
                {lvl.unlocked && (
                  <div className="bg-black/20 hover:bg-black/30 text-white font-black text-xs py-1.5 rounded-2xl transition-colors">
                    {playLabel}
                  </div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Total stars */}
      <div className="bg-white/10 rounded-2xl px-6 py-3 flex items-center gap-2 border border-white/20">
        <span className="text-amber-400 font-black text-lg">★</span>
        <span className="text-white font-bold text-sm">
          {bestLabel}: {levels.reduce((a, l) => a + l.earnedStars, 0)} / {levels.length * 3}
        </span>
      </div>
    </div>
  );
};
