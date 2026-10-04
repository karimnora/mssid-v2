import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { CEM_PAPERS, cemErrorRows, type CemPaper } from '../../data/immersive/cemPrep';
import { getCahier } from '../../data/cahiers/competenceCahiers';
import { CompetenceCahierSheet } from '../cahiers/CompetenceCahierSheet';
import { buildParentNotebook } from '../../utils/competenceProgress';
import type { UserProfile } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

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

export const CemPrepLab: React.FC<CemPrepLabProps> = ({ onBack, onReward, userProfile, onReviewLesson }) => {
  const t = useTranslation('labsImmersive');
  const [tab, setTab] = useState(CEM_PAPERS[0].id);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [cahierId, setCahierId] = useState<string | null>(null);
  const paper = CEM_PAPERS.find((item) => item.id === tab) ?? CEM_PAPERS[0];
  const notebook = useMemo(
    () => (userProfile ? buildParentNotebook(userProfile, '5AP') : null),
    [userProfile],
  );
  const errors = notebook ? cemErrorRows([...notebook.review]) : [];
  const openCahier = cahierId ? getCahier(cahierId) : undefined;

  const revealKey = (item: CemPaper, index: number) => `${item.id}-${index}`;

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
      {tab === 'errors' ? (
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
          {[...paper.exercises, paper.problem].map((exercise, index) => {
            const key = revealKey(paper, index);
            const open = Boolean(revealed[key]);
            return (
              <section key={key} className="rounded-3xl border-2 border-[#E7E2D7] p-4 space-y-3">
                <p className="text-sm font-extrabold">{exercise.titleAr}</p>
                <TwoCol
                  contentAr={exercise.contentAr}
                  solutionAr={exercise.solutionAr}
                  operationsAr={exercise.operationsAr}
                  reveal={open}
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setRevealed((prev) => ({ ...prev, [key]: !open }));
                    if (!open) onReward?.(4, 8);
                  }}
                  className="hit-target px-4 rounded-2xl bg-[#008751] text-white text-sm font-extrabold cursor-pointer"
                >
                  {open ? t('cemHide') : t('cemReveal')}
                </motion.button>
              </section>
            );
          })}
        </article>
      )}
      {openCahier && <CompetenceCahierSheet cahier={openCahier} onClose={() => setCahierId(null)} />}
    </ImmersiveLabShell>
  );
};
