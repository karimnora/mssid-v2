import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { BookOpen, X } from 'lucide-react';
import { UserProfile } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { buildParentNotebook, ParentNotebookRow } from '../utils/competenceProgress';

interface ParentNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  viewingGrade?: UserProfile['grade'];
  onReviewLesson: (lessonId: string) => void;
}

function sessionDay(iso: string): string {
  return iso.slice(0, 10);
}

const CompetenceRow: React.FC<{
  row: ParentNotebookRow;
  locale: string;
  actionLabel: string;
  meta: string;
  onReview: (lessonId: string) => void;
}> = ({ row, locale, actionLabel, meta, onReview }) => {
  const label = locale === 'fr' ? row.labelFr : row.labelAr;
  return (
    <div className="rounded-2xl border-2 border-[#E7E2D7] bg-white p-3 space-y-2">
      <p className="text-[11px] font-extrabold text-[var(--kids-muted)]">{row.domainAr}</p>
      <p className="text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-[var(--kids-muted)]">{meta}</p>
        {row.reviewLessonId && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onReview(row.reviewLessonId!)}
            className="hit-target rounded-2xl px-4 bg-white border-2 border-[var(--kids-grass-2)] text-[var(--kids-grass-2)] text-sm font-extrabold cursor-pointer"
          >
            {actionLabel}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export const ParentNotebookModal: React.FC<ParentNotebookModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  viewingGrade,
  onReviewLesson,
}) => {
  const t = useTranslation('meta');
  const { direction, locale } = useLocaleContext();
  const notebook = useMemo(
    () => buildParentNotebook(userProfile, viewingGrade ?? userProfile.grade),
    [userProfile, viewingGrade],
  );

  if (!isOpen) return null;

  const handleReview = (lessonId: string) => {
    onReviewLesson(lessonId);
  };

  const empty = notebook.worked.length === 0 && notebook.todo.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[55] kids-modal-overlay backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6"
      dir={direction}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-notebook-title"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="kids-modal-panel w-full max-w-xl flex flex-col overflow-hidden"
      >
        <div className="p-4 sm:p-5 flex items-center justify-between gap-2 shrink-0 bg-white border-b-2 border-[#E7E2D7]">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-5 h-5 shrink-0 text-[var(--kids-grass-2)]" />
            <div className="min-w-0">
              <h2 id="parent-notebook-title" className="text-base sm:text-lg font-extrabold truncate">
                {t('parentNotebookTitle')}
              </h2>
              <p className="text-xs font-bold text-[var(--kids-muted)] truncate">
                {t('parentNotebookSubtitle', { name: notebook.childName })}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="kids-close cursor-pointer" aria-label={t('pwaCloseAriaLabel')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="kids-modal-body p-5 space-y-5">
          {empty ? (
            <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed bg-[#FFF8E7] rounded-2xl p-4">
              {t('parentNotebookEmpty')}
            </p>
          ) : (
            <>
              <section className="space-y-2">
                <h3 className="text-sm font-extrabold text-[var(--kids-ink)]">{t('parentNotebookWorked')}</h3>
                {notebook.worked.length === 0 ? (
                  <p className="text-sm font-bold text-[var(--kids-muted)]">{t('parentNotebookWorkedEmpty')}</p>
                ) : (
                  notebook.worked.map((row) => (
                    <CompetenceRow
                      key={row.competenceId}
                      row={row}
                      locale={locale}
                      actionLabel={t('parentNotebookReview')}
                      meta={t('parentNotebookSuccesses', { count: row.successes })}
                      onReview={handleReview}
                    />
                  ))
                )}
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-extrabold text-[var(--kids-ink)]">{t('parentNotebookTodo')}</h3>
                {notebook.todo.length === 0 ? (
                  <p className="text-sm font-bold text-[var(--kids-muted)]">{t('parentNotebookTodoEmpty')}</p>
                ) : (
                  notebook.todo.map((row) => (
                    <CompetenceRow
                      key={row.competenceId}
                      row={row}
                      locale={locale}
                      actionLabel={t('parentNotebookStart')}
                      meta=""
                      onReview={handleReview}
                    />
                  ))
                )}
              </section>
            </>
          )}

          {notebook.recentSessions.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-[var(--kids-ink)]">{t('parentNotebookRecent')}</h3>
              {notebook.recentSessions.map((session) => {
                const labels = locale === 'fr' ? session.labelsFr : session.labelsAr;
                return (
                  <button
                    key={`${session.at}-${session.lessonId}`}
                    type="button"
                    onClick={() => handleReview(session.lessonId)}
                    className="w-full text-start rounded-2xl border-2 border-[#E7E2D7] bg-[#FFF8E7] p-3 cursor-pointer hit-target"
                  >
                    <p className="text-xs font-extrabold text-[var(--kids-muted)]">{sessionDay(session.at)}</p>
                    <p className="text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">{labels[0]}</p>
                  </button>
                );
              })}
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
