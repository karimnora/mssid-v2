import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { CEM_PAPERS, cemErrorRows, markCemRewarded, type CemPaper, type CemPaperExercise } from '../../data/immersive/cemPrep';
import { getCahier } from '../../data/cahiers/competenceCahiers';
import { CompetenceCahierSheet } from '../cahiers/CompetenceCahierSheet';
import { buildParentNotebook } from '../../utils/competenceProgress';
import type { UserProfile } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

import { useAuth } from '../../context/AuthContext';
import { PremiumOffer, hasPremium } from '../PremiumOffer';

interface CemPrepLabProps {
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
  userProfile?: UserProfile;
  onReviewLesson?: (lessonId: string) => void;
}

function TwoCol({
  contentAr,
  solutionAr,
  operationsAr,
  reveal,
}: {
  contentAr: string;
  solutionAr: string;
  operationsAr?: string;
  reveal: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[15px] font-bold text-[var(--kids-ink)] leading-relaxed whitespace-pre-line">{contentAr}</p>
      {reveal && (
        <div dir="rtl" data-exam-two-col className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border-2 border-[#E7E2D7] bg-[#FFF8E7] p-3">
            <p className="text-[11px] font-extrabold text-[#008751] mb-1">الحَلُّ / الأَجْوِبَةُ</p>
            <p className="text-sm font-bold leading-relaxed whitespace-pre-line">{solutionAr}</p>
          </div>
          <div className="rounded-2xl border-2 border-[#E7E2D7] bg-white p-3">
            <p className="text-[11px] font-extrabold text-[#2563EB] mb-1">العَمَلِيَّاتُ</p>
            <pre className="text-sm font-bold leading-relaxed whitespace-pre-wrap font-sans">{operationsAr || solutionAr}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseBlock({
  paper,
  exercise,
  index,
  onReward,
}: {
  paper: CemPaper;
  exercise: CemPaperExercise;
  index: number;
  onReward?: (coins: number, xp: number) => void;
}) {
  const t = useTranslation('labsImmersive');
  const key = `${paper.id}-${index}`;
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const correct = picked === exercise.check.correctIndex;

  const verify = () => {
    if (picked === null) return;
    setChecked(true);
    if (picked === exercise.check.correctIndex && markCemRewarded(key)) {
      onReward?.(4, 8);
    }
  };

  return (
    <section className="rounded-3xl border-2 border-[#E7E2D7] p-4 space-y-3">
      <p className="text-sm font-extrabold">{exercise.titleAr}</p>
      <TwoCol
        contentAr={exercise.contentAr}
        solutionAr={exercise.solutionAr}
        operationsAr={exercise.operationsAr}
        reveal={reveal}
      />
      <p className="text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">{exercise.check.promptAr}</p>
      <div className="flex flex-wrap gap-2">
        {exercise.check.choices.map((choice, choiceIndex) => (
          <motion.button
            key={choice}
            type="button"
            whileTap={{ scale: 0.95 }}
            data-cem-choice={`${key}-${choiceIndex}`}
            onClick={() => {
              setPicked(choiceIndex);
              setChecked(false);
              setReveal(false);
            }}
            className={`hit-target px-4 rounded-2xl border-2 text-sm font-extrabold cursor-pointer ${
              picked === choiceIndex
                ? checked && correct
                  ? 'border-[#008751] bg-[#008751] text-white'
                  : checked
                    ? 'border-[#C42A23] bg-white'
                    : 'border-[#008751] bg-[#FFF8E7]'
                : 'border-[#E7E2D7] bg-white'
            }`}
          >
            {choice}
          </motion.button>
        ))}
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        data-cem-check={key}
        onClick={verify}
        disabled={picked === null}
        className="hit-target px-4 rounded-2xl bg-[#008751] text-white text-sm font-extrabold cursor-pointer disabled:opacity-50"
      >
        {t('cemAnswer')}
      </motion.button>
      {checked && !correct && <p className="text-sm font-extrabold">{t('tryAgain')}</p>}
      {checked && correct && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          data-cem-reveal={key}
          onClick={() => setReveal((open) => !open)}
          className="hit-target px-4 rounded-2xl border-2 border-[#008751] bg-white text-[#008751] text-sm font-extrabold cursor-pointer"
        >
          {reveal ? t('cemHide') : t('cemReveal')}
        </motion.button>
      )}
      {!checked && picked !== null && (
        <p className="text-xs font-bold text-[var(--kids-muted)]">{t('cemNeedAnswer')}</p>
      )}
    </section>
  );
}

export const CemPrepLab: React.FC<CemPrepLabProps> = ({ onBack, onReward, userProfile, onReviewLesson }) => {
  const t = useTranslation('labsImmersive');
  const offerT = useTranslation('subscription');
  const { authUser } = useAuth();
  const premium = hasPremium(authUser?.role);
  const [tab, setTab] = useState(CEM_PAPERS[0].id);
  const [cahierId, setCahierId] = useState<string | null>(null);
  const paper = CEM_PAPERS.find((item) => item.id === tab) ?? CEM_PAPERS[0];
  const notebook = useMemo(
    () => (userProfile ? buildParentNotebook(userProfile, '5AP') : null),
    [userProfile],
  );
  const errors = notebook ? cemErrorRows([...notebook.review]) : [];
  const openCahier = cahierId ? getCahier(cahierId) : undefined;

  return (
    <ImmersiveLabShell
      badge={t('cemBadge')}
      title={t('cemTitle')}
      intro={t('cemIntro')}
      tabs={[
        ...CEM_PAPERS.map((item) => ({ id: item.id, label: item.subjectAr.split('—')[0].trim() })),
        { id: 'errors', label: t('cemErrors') },
      ]}
      activeTab={tab}
      onTab={setTab}
      onBack={onBack}
    >
      {!premium && <section className="rounded-2xl bg-white p-4 space-y-3"><p>{offerT('cemPreview')}</p><PremiumOffer /></section>}
      {!premium && tab !== CEM_PAPERS[0].id ? null : tab === 'errors' ? (
        <section className="space-y-3">
          <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed">{t('cemErrorsIntro')}</p>
          {errors.length === 0 ? (
            <p className="rounded-[24px] border-2 border-[#E7E2D7] bg-white p-4 text-sm font-extrabold">{t('cemErrorsEmpty')}</p>
          ) : (
            errors.map((row) => (
              <article key={row.competenceId} className="rounded-[24px] border-2 border-[#E7E2D7] bg-white p-4 space-y-2">
                <p className="text-[11px] font-extrabold text-[var(--kids-muted)]">{row.domainAr}</p>
                <p className="text-sm font-extrabold leading-relaxed">{row.labelAr}</p>
                <div className="flex flex-wrap gap-2">
                  {row.reviewLessonId && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onReviewLesson?.(row.reviewLessonId!)}
                      className="hit-target px-4 rounded-2xl bg-[#008751] text-white text-sm font-extrabold cursor-pointer"
                    >
                      {t('cemRevise')}
                    </motion.button>
                  )}
                  {getCahier(row.competenceId) && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCahierId(row.competenceId)}
                      className="hit-target px-4 rounded-2xl border-2 border-[#E7E2D7] bg-white text-sm font-extrabold cursor-pointer"
                    >
                      {t('cahierPrint')}
                    </motion.button>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      ) : (
        <article className="rounded-[28px] border-2 border-[#E7E2D7] bg-white p-5 space-y-5">
          <header className="space-y-1">
            <p className="text-xs font-extrabold text-[#2563EB]">{paper.durationMinutes} د — {paper.totalPoints} ن</p>
            <h2 className="text-lg font-extrabold leading-tight">{paper.subjectAr}</h2>
          </header>
          {(premium ? [...paper.exercises, paper.problem] : paper.exercises.slice(0, 1)).map((exercise, index) => (
            <ExerciseBlock key={`${paper.id}-${index}`} paper={paper} exercise={exercise} index={index} onReward={onReward} />
          ))}
        </article>
      )}
      {openCahier && <CompetenceCahierSheet cahier={openCahier} onClose={() => setCahierId(null)} />}
    </ImmersiveLabShell>
  );
};
