import { FamilyParentSummary } from './family/FamilyParentSummary';
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Printer, X } from 'lucide-react';
import { CourseLesson, UserProfile } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { useTranslation } from '../hooks/useTranslation';
import { canUseWebCheckout } from '../utils/paymentPlatform';
import { buildWeeklyReport, drawWeeklyReportCard, formatWeeklyReportText } from '../utils/weeklyReport';
import { shareImageBlob, sharePlainText } from '../utils/shareContent';
import { useLocaleContext } from '../context/LocaleContext';
import { buildParentNotebook, buildWeeklyPlan, formatWeeklyRecap, ParentNotebookRow } from '../utils/competenceProgress';
import { RevisionSheetViewer } from './RevisionSheetViewer';
import { getCahier } from '../data/cahiers/competenceCahiers';
import { CompetenceCahierSheet } from './cahiers/CompetenceCahierSheet';
import type { CompetenceCahier } from '../data/cahiers/competenceCahiers';

import { useAuth } from '../context/AuthContext';
import { PremiumOffer } from './PremiumOffer';
import { canAccess } from '../access/entitlements';

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
  printLabel: string;
  printAria: string;
  meta: string;
  tone?: 'review' | 'default';
  onReview: (lessonId: string) => void;
  onPrint: (lessonId: string, competenceLabelAr: string, competenceId: string) => void;
}> = ({ row, locale, actionLabel, printLabel, printAria, meta, tone = 'default', onReview, onPrint }) => {
  const label = locale === 'fr' ? row.labelFr : row.labelAr;
  const shell =
    tone === 'review'
      ? 'rounded-2xl border-2 border-[var(--brand-amber)] bg-[#FFF8E7] p-3 space-y-2'
      : 'rounded-2xl border-2 border-[#E7E2D7] bg-white p-3 space-y-2';
  return (
    <div className={shell}>
      <p className="text-[11px] font-extrabold text-[var(--kids-muted)]">{row.domainAr}</p>
      <p className="text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">{label}</p>
      {meta ? <p className="text-xs font-bold text-[var(--kids-muted)]">{meta}</p> : null}
      {row.reviewLessonId && (
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onReview(row.reviewLessonId!)}
            className="hit-target rounded-2xl px-4 bg-white border-2 border-[var(--kids-grass-2)] text-[var(--kids-grass-2)] text-sm font-extrabold cursor-pointer"
          >
            {actionLabel}
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            data-notebook-print={row.competenceId}
            aria-label={printAria}
            onClick={() => onPrint(row.reviewLessonId!, row.labelAr, row.competenceId)}
            className="hit-target rounded-2xl px-4 bg-white border-2 border-[#E7E2D7] text-[var(--kids-ink)] text-sm font-extrabold cursor-pointer inline-flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
            {printLabel}
          </motion.button>
        </div>
      )}
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
  const offerT = useTranslation('subscription');
  const { authUser } = useAuth();
  const premium = canAccess('parentNotebookDetail', authUser?.role);
  const canShareReport = canAccess('weeklyReportShare', authUser?.role);
  const { direction, locale } = useLocaleContext();
  const notebook = useMemo(
    () => buildParentNotebook(userProfile, viewingGrade ?? userProfile.grade),
    [userProfile, viewingGrade],
  );
  const plan = useMemo(() => buildWeeklyPlan(notebook), [notebook]);
  const [printable, setPrintable] = useState<{ lesson: CourseLesson; competenceLabelAr: string } | null>(null);
  const [cahier, setCahier] = useState<CompetenceCahier | null>(null);
  const [recapCopied, setRecapCopied] = useState(false);
  const [reportState, setReportState] = useState<'idle' | 'busy' | 'shared' | 'error'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setRecapCopied(false);
      setReportState('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReview = (lessonId: string) => {
    onReviewLesson(lessonId);
  };

  const handlePrint = (lessonId: string, competenceLabelAr: string, competenceId: string) => {
    const nextCahier = getCahier(competenceId);
    if (nextCahier) {
      setCahier(nextCahier);
      return;
    }
    const lesson = COURSES_DATA.find((item) => item.id === lessonId);
    if (lesson) setPrintable({ lesson, competenceLabelAr });
  };

  const printProps = {
    printLabel: t('parentNotebookPrint'),
    printAria: t('parentNotebookPrintAria'),
    onPrint: handlePrint,
  };

  const empty =
    notebook.review.length === 0 &&
    notebook.observed.length === 0 &&
    notebook.worked.length === 0 &&
    notebook.todo.length === 0;

  return (
    <>
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
          <FamilyParentSummary grade={viewingGrade ?? userProfile.grade} name={notebook.childName}/>
          <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-3">
            <p className="text-[11px] font-extrabold text-[var(--kids-muted)]">{premium ? t('parentNotebookWeekTitle') : offerT('nextFreeRevision')}</p>
            {premium && <p className="text-xs font-bold text-[var(--kids-muted)]">
              {t('parentNotebookWeekMeta', { review: plan.reviewCount, ok: plan.weekSuccesses })}
            </p>}
            {plan.next ? (
              <>
                <p className="text-xs font-extrabold text-[var(--brand-emerald)]">
                  {t('parentNotebookTomorrow', { minutes: plan.minutes })}
                </p>
                <p className="text-base font-extrabold text-[var(--kids-ink)] leading-relaxed">
                  {locale === 'fr' ? plan.next.labelFr : plan.next.labelAr}
                </p>
                {plan.next.reviewLessonId && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReview(plan.next!.reviewLessonId!)}
                    className="hit-target w-full rounded-2xl px-4 bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer"
                  >
                    {t('parentNotebookStartTomorrow')}
                  </motion.button>
                )}
              </>
            ) : (
              <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed">
                {t('parentNotebookTomorrowEmpty')}
              </p>
            )}
            {premium && <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                const text = formatWeeklyRecap(notebook, plan, locale);
                try {
                  await navigator.clipboard.writeText(text);
                  setRecapCopied(true);
                } catch {
                  setRecapCopied(false);
                }
              }}
              className="hit-target w-full rounded-2xl px-4 bg-[#FFF8E7] border-2 border-[#E7E2D7] text-[var(--kids-ink)] text-sm font-extrabold cursor-pointer"
            >
              {recapCopied ? t('parentNotebookCopied') : t('parentNotebookCopyRecap')}
            </motion.button>}
            {canShareReport && <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              disabled={reportState === 'busy'}
              data-share-weekly-report
              onClick={async () => {
                setReportState('busy');
                const report = buildWeeklyReport(notebook, plan);
                const text = formatWeeklyReportText(report, locale);
                try {
                  const blob = await drawWeeklyReportCard(report, locale);
                  const outcome = blob
                    ? await shareImageBlob(blob, `bilan-${report.toDate}.png`, text)
                    : await sharePlainText(text);
                  setReportState(outcome === 'cancelled' ? 'idle' : 'shared');
                } catch {
                  setReportState('error');
                }
              }}
              className="hit-target w-full rounded-2xl px-4 bg-[#25D366] text-[#073B1F] text-sm font-extrabold cursor-pointer disabled:opacity-60"
            >
              {reportState === 'busy'
                ? (locale === 'fr' ? 'Préparation du bilan…' : 'جارٍ تحضير الحصيلة…')
                : reportState === 'shared'
                  ? (locale === 'fr' ? 'Bilan partagé ✓' : 'تمت مشاركة الحصيلة ✓')
                  : (locale === 'fr' ? 'Partager le bilan de la semaine (WhatsApp)' : 'شارك حصيلة الأسبوع (واتساب)')}
            </motion.button>}
            {reportState === 'error' && <p role="alert" className="text-sm font-bold text-[var(--kids-ink)]">{locale === 'fr' ? 'Partage impossible pour le moment. Utilisez « copier » ci-dessus.' : 'تعذّرت المشاركة الآن. استعمل زر النسخ أعلاه.'}</p>}
          </section>

          {!premium && <section className="rounded-2xl border-2 border-[#E7E2D7] p-4 space-y-3">
            <p>{offerT('notebookSummary', { worked: notebook.worked.length + notebook.observed.length + notebook.review.length, review: notebook.review.length })}</p>
            {plan.next?.reviewLessonId && <button type="button" className="hit-target font-bold" onClick={() => handlePrint(plan.next!.reviewLessonId!, plan.next!.labelAr, plan.next!.competenceId)}>{t('parentNotebookPrint')}</button>}
            <p>{offerT(canUseWebCheckout() ? 'notebookPremium' : 'notebookPremiumNative')}</p><PremiumOffer />
          </section>}
          {empty ? (
            <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed bg-[#FFF8E7] rounded-2xl p-4">
              {t('parentNotebookEmpty')}
            </p>
          ) : premium ? (
            <>
              <section className="space-y-2">
                <h3 className="text-sm font-extrabold text-[var(--kids-ink)]">{t('parentNotebookNeedsReview')}</h3>
                {notebook.review.length === 0 ? (
                  <p className="text-sm font-bold text-[var(--kids-muted)]">{t('parentNotebookNeedsReviewEmpty')}</p>
                ) : (
                  notebook.review.map((row) => (
                    <CompetenceRow
                      key={row.competenceId}
                      row={row}
                      locale={locale}
                      tone="review"
                      actionLabel={t('parentNotebookReview')}
                      meta={t('parentNotebookFailures', { count: row.failures })}
                      onReview={handleReview}
                      {...printProps}
                    />
                  ))
                )}
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-extrabold text-[var(--kids-ink)]">{t('parentNotebookObserved')}</h3>
                {notebook.observed.length === 0 ? (
                  <p className="text-sm font-bold text-[var(--kids-muted)]">{t('parentNotebookObservedEmpty')}</p>
                ) : (
                  notebook.observed.map((row) => (
                    <CompetenceRow
                      key={row.competenceId}
                      row={row}
                      locale={locale}
                      actionLabel={t('parentNotebookReview')}
                      meta={t('parentNotebookSuccesses', { count: row.successes })}
                      onReview={handleReview}
                      {...printProps}
                    />
                  ))
                )}
              </section>

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
                      {...printProps}
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
                      {...printProps}
                    />
                  ))
                )}
              </section>
            </>
          ) : null}

          {premium && notebook.recentSessions.length > 0 && (
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
                    <p className="text-xs font-extrabold text-[var(--kids-muted)]">
                      {sessionDay(session.at)}
                      {' · '}
                      {session.outcome === 'fail' ? t('parentNotebookSessionFail') : t('parentNotebookSessionOk')}
                    </p>
                    <p className="text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">{labels[0]}</p>
                  </button>
                );
              })}
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>
      {printable && (
        <RevisionSheetViewer
          lesson={printable.lesson}
          competenceLabelAr={printable.competenceLabelAr}
          onClose={() => setPrintable(null)}
        />
      )}
      {cahier && <CompetenceCahierSheet cahier={cahier} onClose={() => setCahier(null)} />}
    </>
  );
};
