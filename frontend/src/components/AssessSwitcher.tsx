import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

const spring = { type: 'spring' as const, stiffness: 400, damping: 22 };

interface AssessSwitcherProps {
  active: 'exams' | 'challenges';
  onOpenExams: () => void;
  onOpenChallenges: () => void;
}

export const AssessSwitcher: React.FC<AssessSwitcherProps> = ({
  active,
  onOpenExams,
  onOpenChallenges,
}) => {
  const t = useTranslation('navigation');

  const pill = (
    tab: 'exams' | 'challenges',
    label: string,
    onClick: () => void,
    activeClass: string,
  ) => {
    const isOn = active === tab;
    return (
      <motion.button
        type="button"
        data-assess-tab={tab}
        whileTap={{ scale: 0.95 }}
        transition={spring}
        onClick={onClick}
        aria-current={isOn ? 'page' : undefined}
        className={`hit-target min-h-12 flex-1 rounded-2xl text-sm font-extrabold px-3 cursor-pointer ${
          isOn ? `${activeClass} text-white shadow-md` : 'text-[var(--app-text-muted)]'
        }`}
      >
        {label}
      </motion.button>
    );
  };

  return (
    <div
      className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-30 -mx-1 px-1 py-1 bg-[var(--app-bg)]"
      data-assess-switcher="true"
    >
      <div className="flex gap-1.5 rounded-3xl border-2 border-[#E7E2D7] bg-white p-1.5">
        {pill('exams', t('navExamsShort'), onOpenExams, 'bg-[var(--brand-blue)]')}
        {pill('challenges', t('navChallengesShort'), onOpenChallenges, 'bg-[var(--brand-amber)]')}
      </div>
    </div>
  );
};
