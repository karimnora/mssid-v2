import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { CourseLesson, OfficialExam } from '../../types';
import type { ParentNotebook } from '../../utils/competenceProgress';
import {
  EXAM_PLAN_FREE_DAYS,
  buildExamPlan,
  daysBetween,
  isValidExamDate,
  suggestExamDate,
  todayIndex,
  type ExamPlanDay,
} from '../../utils/examPlan';
import { PremiumOffer } from '../PremiumOffer';

interface StoredPlan {
  examDate: string;
  done: string[];
}

function readStored(key: string): StoredPlan | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPlan;
    if (typeof parsed?.examDate !== 'string' || !isValidExamDate(parsed.examDate)) return null;
    const done = Array.isArray(parsed.done)
      ? [...new Set(parsed.done.filter((day): day is string => typeof day === 'string' && isValidExamDate(day)))]
      : [];
    return { examDate: parsed.examDate, done };
  } catch {
    return null;
  }
}

function writeStored(key: string, value: StoredPlan) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode: the plan still works for this visit */
  }
}

const REASON: Record<ExamPlanDay['reason'], { ar: string; fr: string }> = {
  missed: { ar: '🔁 أَخْطَأَ فِيهَا', fr: '🔁 Erreurs à reprendre' },
  helped: { ar: '💡 نَجَحَ بِمُسَاعَدَةٍ', fr: '💡 Réussi avec aide' },
  todo: { ar: '🆕 لَمْ يَبْدَأْهَا', fr: '🆕 Pas encore travaillé' },
  lesson: { ar: '📘 دَرْسُ الفَصْلِ', fr: '📘 Leçon du trimestre' },
  mock: { ar: '📝 مَوْضُوعٌ تَجْرِيبِيٌّ', fr: '📝 Sujet blanc' },
};

function formatDay(day: string, locale: 'ar' | 'fr'): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-DZ' : 'ar-DZ', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(y, m - 1, d));
}

/**
 * « 10 jours avant la composition », in the parent notebook. The parent sets the date given by the
 * school; each day is 20 minutes on the most missed competence, a mock paper every third day and a
 * full mock composition the day before. Free: the first two days.
 */
export const ExamPlanPanel: React.FC<{
  notebook: ParentNotebook;
  storageKey: string;
  locale: 'ar' | 'fr';
  premium: boolean;
  onReviewLesson: (lessonId: string) => void;
  onPrint: (lessonId: string, competenceLabelAr: string, competenceId: string) => void;
  onOpenExam?: (examId: string) => void;
  now?: Date;
}> = ({ notebook, storageKey, locale, premium, onReviewLesson, onPrint, onOpenExam, now }) => {
  const fr = locale === 'fr';
  const today = useMemo(() => now ?? new Date(), [now]);
  const suggestion = useMemo(() => suggestExamDate(today), [today]);
  const [stored, setStored] = useState<StoredPlan>(() => readStored(storageKey) ?? { examDate: suggestion.date, done: [] });
  const [loadFailed, setLoadFailed] = useState(false);
  const [data, setData] = useState<{ lessons: CourseLesson[]; exams: OfficialExam[] } | null>(null);

  useEffect(() => {
    setStored(readStored(storageKey) ?? { examDate: suggestion.date, done: [] });
  }, [storageKey, suggestion.date]);

  useEffect(() => {
    let alive = true;
    setLoadFailed(false);
    void Promise.all([import('../../data/coursesData'), import('../../data/examsData')]).then(([courses, exams]) => {
      if (alive) setData({ lessons: courses.COURSES_DATA, exams: exams.OFFICIAL_EXAMS_DATA });
    }).catch(() => {
      if (alive) setLoadFailed(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const plan = useMemo(
    () => (data ? buildExamPlan({ notebook, lessons: data.lessons, exams: data.exams, examDate: stored.examDate, now: today }) : null),
    [data, notebook, stored.examDate, today],
  );
  const current = plan ? todayIndex(plan, today) : -1;
  const daysLeft = daysBetween(today, stored.examDate);
  const update = (next: StoredPlan) => {
    setStored(next);
    writeStored(storageKey, next);
  };
  const toggleDone = (date: string) =>
    update({ ...stored, done: stored.done.includes(date) ? stored.done.filter((d) => d !== date) : [...stored.done, date] });

  return (
    <section data-exam-plan className="rounded-3xl border-2 border-[#1d4ed8]/30 bg-[var(--app-card-subtle)] p-4 space-y-3">
      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-[var(--kids-ink)]">
          {fr ? '🗓️ Plan avant la composition' : '🗓️ خِطَّةُ المُرَاجَعَةِ قَبْلَ الاخْتِبَارِ'}
        </h3>
        <p className="text-xs font-bold text-[var(--kids-muted)] leading-relaxed">
          {plan?.days.some(day => day.reason === 'missed' || day.reason === 'helped')
            ? fr ? `Priorité aux difficultés observées de ${notebook.childName}. Le temps prévu est indiqué pour chaque séance.` : `الأولوية للنقاط التي يحتاج ${notebook.childName} إلى مراجعتها حسب نشاطه المسجّل. مدة كل حصة موضّحة في الخطة.`
            : fr ? 'Programme général : aucune difficulté exploitable enregistrée pour ce plan. Le temps prévu est indiqué pour chaque séance.' : 'برنامج مراجعة عام: لا توجد صعوبات مسجّلة يمكن استعمالها لبناء هذه الخطة. مدة كل حصة موضّحة أدناه.'}
        </p>
      </div>

      <label className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-[var(--kids-ink)]">
        {fr ? 'Date de la composition' : 'تَارِيخُ الاخْتِبَارِ'}
        <input
          type="date"
          data-exam-plan-date
          value={stored.examDate}
          onChange={(event) => isValidExamDate(event.target.value) && update({ examDate: event.target.value, done: [] })}
          className="hit-target rounded-xl border-2 border-[#E7E2D7] bg-[var(--app-card-bg)] px-3 text-sm font-bold [.theme-dark_&]:[color-scheme:dark] [.theme-midnight_&]:[color-scheme:dark]"
        />
        {daysLeft > 0 && (
          <span data-exam-plan-countdown className="rounded-full bg-[#1d4ed8] text-white px-3 py-1 text-xs font-extrabold">
            {fr ? `dans ${daysLeft} jour(s)` : `بَعْدَ ${daysLeft} يَوْماً`}
          </span>
        )}
      </label>
      <p className="text-[11px] font-bold text-[var(--kids-muted)]">
        {fr ? 'Date proposée : corrigez-la avec celle donnée par l’école.' : 'تَارِيخٌ مُقْتَرَحٌ: عَدِّلْهُ حَسَبَ مَا أَعْلَنَتْهُ المَدْرَسَةُ.'}
      </p>

      {loadFailed ? (
        <div role="alert" className="space-y-2">
          <p className="text-sm font-bold text-[var(--kids-ink)]">
            {fr ? 'Le plan n’a pas pu être chargé. Les cours restent accessibles séparément.' : 'تعذّر تحميل الخطة. يمكنك متابعة الدروس بشكل مستقل.'}
          </p>
          <button type="button" onClick={() => window.location.reload()}
            className="hit-target rounded-xl bg-[var(--app-card-bg)] border-2 border-[#E7E2D7] px-4 text-sm font-bold">
            {fr ? 'Recharger la page' : 'أعد تحميل الصفحة'}
          </button>
        </div>
      ) : !plan ? (
        <p role="status" className="text-sm font-bold text-[var(--kids-muted)]">{fr ? 'Préparation du plan…' : 'جَارٍ تَحْضِيرُ الخِطَّةِ…'}</p>
      ) : plan.days.length === 0 ? (
        <p className="text-sm font-bold text-[var(--kids-muted)]">
          {plan.unavailableReason === 'no_resources'
            ? fr ? 'Aucune ressource disponible pour ce niveau et cette période. Les cours restent accessibles séparément.' : 'لا توجد موارد لهذا المستوى وهذه الفترة بعد. يمكنك متابعة الدروس بشكل مستقل.'
            : fr ? 'Choisissez la date de la prochaine composition pour obtenir le plan.' : 'اخْتَرْ تَارِيخَ الاخْتِبَارِ القَادِمِ لِتَظْهَرَ الخِطَّةُ.'}
        </p>
      ) : (
        <>
          <p className="text-xs font-extrabold text-[var(--kids-ink)]" data-exam-plan-progress>
            {fr
              ? `${stored.done.filter((d) => plan.days.some((day) => day.date === d)).length}/${plan.days.length} jour(s) faits`
              : `${stored.done.filter((d) => plan.days.some((day) => day.date === d)).length}/${plan.days.length} أَيَّامٍ مُنْجَزَةٍ`}
          </p>
          <ol className="space-y-2">
            {plan.days.map((day) => {
              const locked = !premium && day.index >= EXAM_PLAN_FREE_DAYS;
              const done = stored.done.includes(day.date);
              const isToday = day.index === current;
              return (
                <li
                  key={day.date}
                  data-exam-plan-day={day.kind}
                  data-today={isToday || undefined}
                  className={`rounded-2xl border-2 p-3 space-y-2 ${isToday ? 'border-[#1d4ed8] bg-[var(--app-card-bg)]' : 'border-[#E7E2D7] bg-[var(--app-card-subtle)]'} ${locked ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-extrabold text-[var(--kids-muted)]">
                      {fr ? `Jour ${day.index + 1}` : `اليَوْمُ ${day.index + 1}`} · {formatDay(day.date, locale)} · {day.minutes} {fr ? 'min' : 'د'}
                      {isToday && <span className="ms-2 rounded-full bg-[#1d4ed8] text-white px-2 py-0.5">{fr ? 'aujourd’hui' : 'اليَوْمَ'}</span>}
                    </p>
                    <span className="text-[11px] font-extrabold text-[var(--kids-ink)]">{fr ? REASON[day.reason].fr : REASON[day.reason].ar}</span>
                  </div>
                  {locked ? (
                    <p className="text-sm font-bold text-[var(--kids-muted)]">{fr ? 'Disponible pour les comptes Famille Premium.' : 'مُتَاحٌ لِحِسَابَاتِ العَائِلَةِ المُمَيَّزَةِ.'}</p>
                  ) : (
                    <>
                      <p className="text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">{fr ? day.titleFr : day.titleAr}</p>
                      <div className="flex flex-wrap gap-2">
                        {day.lessonId && (
                          <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => onReviewLesson(day.lessonId!)}
                            className="hit-target rounded-2xl px-4 bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer">
                            {fr ? '▶ Revoir la leçon' : '▶ رَاجِعِ الدَّرْسَ'}
                          </motion.button>
                        )}
                        {day.lessonId && day.competenceId && (
                          <motion.button type="button" whileTap={{ scale: 0.95 }} data-exam-plan-print={day.competenceId}
                            onClick={() => onPrint(day.lessonId!, day.titleAr, day.competenceId!)}
                            className="hit-target rounded-2xl px-4 bg-[var(--app-card-bg)] border-2 border-[#E7E2D7] text-[var(--kids-ink)] text-sm font-extrabold cursor-pointer">
                            {fr ? '🖨️ Fiche de rattrapage' : '🖨️ كُرَّاسُ الاسْتِدْرَاكِ'}
                          </motion.button>
                        )}
                        {onOpenExam && day.examIds.map((examId, i) => (
                          <motion.button key={examId} type="button" whileTap={{ scale: 0.95 }} data-exam-plan-open={examId} onClick={() => onOpenExam(examId)}
                            className="hit-target rounded-2xl px-4 bg-[#1d4ed8] text-white text-sm font-extrabold cursor-pointer">
                            {day.examIds.length > 1
                              ? (fr ? `📝 Sujet ${i + 1}` : `📝 المَوْضُوعُ ${i + 1}`)
                              : (fr ? '📝 Ouvrir le sujet blanc' : '📝 افْتَحِ المَوْضُوعَ التَّجْرِيبِيَّ')}
                          </motion.button>
                        ))}
                        <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => toggleDone(day.date)} aria-pressed={done}
                          className={`hit-target rounded-2xl px-4 text-sm font-extrabold cursor-pointer border-2 ${done ? 'bg-[#ecfdf5] border-[var(--brand-emerald)] text-[var(--brand-emerald)]' : 'bg-[var(--app-card-bg)] border-[#E7E2D7] text-[var(--kids-muted)]'}`}>
                          {done ? (fr ? '✓ Fait' : '✓ تَمَّ') : (fr ? 'Marquer fait' : 'تَمَّ اليَوْمَ')}
                        </motion.button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
          {!premium && plan.days.length > EXAM_PLAN_FREE_DAYS && <PremiumOffer />}
        </>
      )}
    </section>
  );
};
