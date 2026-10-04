import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLocaleContext } from '../../context/LocaleContext';

export interface ImmersiveTab {
  id: string;
  label: string;
}

interface ImmersiveLabShellProps {
  badge: string;
  title: string;
  intro: string;
  tabs: ImmersiveTab[];
  activeTab: string;
  onTab: (id: string) => void;
  stars?: number;
  onBack?: () => void;
  children: React.ReactNode;
}

export const ImmersiveLabShell: React.FC<ImmersiveLabShellProps> = ({
  badge,
  title,
  intro,
  tabs,
  activeTab,
  onTab,
  stars = 0,
  onBack,
  children,
}) => {
  const t = useTranslation('labsImmersive');
  const { direction } = useLocaleContext();

  return (
    <div className="space-y-5 max-w-5xl mx-auto" dir={direction}>
      <div className="kids-pole rounded-[28px] p-5 sm:p-7 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={t('backAria')}
              className="hit-target shrink-0 flex items-center justify-center bg-white border-2 border-[#E7E2D7] text-[var(--kids-ink)] rounded-2xl cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[var(--brand-emerald-dark,#065F46)] px-3 py-1 rounded-full text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brand-amber)]" />
              <span>{badge}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[var(--kids-ink)] leading-tight">{title}</h1>
            <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed">{intro}</p>
            {stars > 0 && (
              <p className="text-xs font-extrabold text-[var(--brand-amber)]">{t('stars', { count: stars })}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onTab(tab.id)}
            className={`hit-target px-4 rounded-2xl text-sm font-extrabold cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-[var(--brand-emerald)] text-white'
                : 'bg-white border-2 border-[#E7E2D7] text-[var(--kids-ink)]'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {children}
    </div>
  );
};

export function QuizBlock({
  questionAr,
  optionsAr,
  correctAr,
  picked,
  onPick,
}: {
  questionAr: string;
  optionsAr: readonly string[];
  correctAr: string;
  picked: string | null;
  onPick: (option: string, ok: boolean) => void;
}) {
  const t = useTranslation('labsImmersive');
  return (
    <div className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-5 space-y-3">
      <p className="text-base font-extrabold text-[var(--kids-ink)] leading-relaxed">{questionAr}</p>
      <div className="grid gap-2">
        {optionsAr.map((option) => {
          const chosen = picked === option;
          const ok = option === correctAr;
          const tone = !picked
            ? 'bg-[#FFFBF0] border-[#E7E2D7] text-[var(--kids-ink)]'
            : ok
              ? 'bg-[#ECFDF5] border-[#008751] text-[#065F46]'
              : chosen
                ? 'bg-[#FFF8E7] border-[#E7E2D7] text-[var(--kids-ink)]'
                : 'bg-white border-[#E7E2D7] text-[var(--kids-muted)]';
          return (
            <motion.button
              key={option}
              type="button"
              whileTap={{ scale: 0.95 }}
              disabled={!!picked}
              onClick={() => onPick(option, ok)}
              className={`hit-target w-full rounded-2xl border-2 px-4 text-sm font-extrabold cursor-pointer ${tone}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
      {picked && (
        <p className="text-sm font-extrabold text-[var(--kids-ink)]">
          {picked === correctAr ? t('wellDone') : t('tryAgain')}
        </p>
      )}
    </div>
  );
}
