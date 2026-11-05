import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useLocaleContext } from '../../context/LocaleContext';
import { DidouPortrait } from '../world/DidouPortrait';
import { DidouRibbon } from '../world/DidouRibbon';
import { ConfettiBurst } from '../lessonViewer/ConfettiBurst';

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
  const { direction, locale } = useLocaleContext();

  // Didou cheers every time a new star is earned (« monde de jeu » design, docs/v2-design-monde.md).
  const previousStars = useRef(stars);
  const [cheer, setCheer] = useState(0);
  useEffect(() => {
    if (stars > previousStars.current) setCheer((n) => n + 1);
    previousStars.current = stars;
  }, [stars]);
  useEffect(() => {
    if (!cheer) return;
    const timer = window.setTimeout(() => setCheer(0), 2200);
    return () => window.clearTimeout(timer);
  }, [cheer]);

  return (
    <div className="space-y-5 max-w-5xl mx-auto" dir={direction} data-world-lab>
      <div className="kids-pole rounded-[28px] p-5 sm:p-7 relative overflow-hidden" data-world-lab-hero>
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              data-world-lab-back
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
            <p className="world-hide text-sm font-bold text-[var(--kids-muted)] leading-relaxed">{intro}</p>
            {stars > 0 && (
              <p className="world-hide text-xs font-extrabold text-[var(--brand-amber)]">{t('stars', { count: stars })}</p>
            )}
          </div>
          <div className="world-only world-lab-stars" data-lab-stars={stars} role="img" aria-label={t('stars', { count: stars })}>
            <svg viewBox="0 0 24 24" aria-hidden="true" key={stars} className={stars > 0 ? 'is-on' : ''}>
              <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
            </svg>
            <span dir="ltr">×{stars}</span>
          </div>
        </div>
        <div className="world-only relative z-10 mt-4">
          <DidouRibbon text={intro} lang={locale === 'fr' ? 'fr' : 'ar'} listenLabel={t('listenDidou')} />
        </div>
      </div>

      {cheer > 0 && (
        <div className="world-only world-lab-cheer" role="status" key={cheer}>
          <div className="world-lab-cheer-card">
            <span className="relative inline-block">
              <DidouPortrait size={64} />
              <ConfettiBurst />
            </span>
            <span>{t('starWon')} ⭐</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1" data-lab-tabs={tabs.length}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            type="button"
            whileTap={{ scale: 0.95 }}
            data-lab-tab
            aria-current={activeTab === tab.id ? 'step' : undefined}
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
    <div className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-5 space-y-3" data-lab-quiz>
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
              data-quiz-option={!picked ? 'idle' : ok ? 'correct' : chosen ? 'retry' : 'muted'}
              onClick={() => onPick(option, ok)}
              className={`hit-target w-full rounded-2xl border-2 px-4 text-sm font-extrabold cursor-pointer ${tone}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
      {picked && (
        <div data-quiz-feedback={picked === correctAr ? 'correct' : 'retry'} className="rounded-2xl p-3 text-sm font-extrabold text-[var(--kids-ink)]">
          <DidouPortrait size={56} pose={picked === correctAr ? 'cheer' : 'think'} className="world-only world-quiz-didou" />
          <p>{picked === correctAr ? t('wellDone') : t('tryAgain')}</p>
        </div>
      )}
    </div>
  );
}
