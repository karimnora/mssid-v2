import React, { useEffect, useMemo, useRef, useState } from 'react';
import { COURSES_DATA } from '../../data/coursesData';
import { COURSE_SUBJECTS_LIST, GRADE_ORDER } from '../../data/subjectsData';
import { filterReviewLessons, REVIEW_LABELS, reviewIssues, reviewStatus, ReviewFilters } from './contentReview';

const INITIAL_FILTERS: ReviewFilters = { query: '', grade: '', subject: '', trimester: '', status: '', needsAttention: false };
const fieldClass = 'min-h-12 w-full rounded-xl border border-slate-600 bg-slate-900 px-3 text-sm text-slate-100';
const buttonClass = 'min-h-12 rounded-xl border border-slate-600 px-4 text-sm font-bold hover:bg-slate-800 disabled:opacity-50';
const PAGE_SIZE = 25;
const subjectLabel = (id: string) => COURSE_SUBJECTS_LIST.find(subject => subject.id === id)?.nameAr ?? id;
const STATUS_STYLES = {
  official_verified: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  corroborated: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  complementary: 'border-slate-600 bg-slate-800 text-slate-200',
  needs_verification: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
  unspecified: 'border-orange-500/30 bg-orange-500/10 text-orange-200',
};

export const ContentReviewModule: React.FC = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filtered = useMemo(() => filterReviewLessons(COURSES_DATA, filters), [filters]);
  const selected = filtered.find(lesson => lesson.id === selectedId);
  const exercises = [...(selected?.progressiveExercises ?? []), ...(selected?.evaluationExercises ?? [])];
  const detailHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (selectedId) {
      detailHeading.current?.focus({ preventScroll: true });
      detailHeading.current?.scrollIntoView({ block: 'start' });
    }
  }, [selectedId]);
  const statuses = Object.entries(REVIEW_LABELS);
  const subjects = [...new Set(COURSES_DATA.map(lesson => lesson.subject))];
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const update = (patch: Partial<ReviewFilters>) => { setFilters(previous => ({ ...previous, ...patch })); setPage(1); };

  return (
    <section className="space-y-5" dir="rtl" aria-labelledby="content-review-title">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="content-review-title" className="text-xl sm:text-2xl font-black">مراقبة المحتوى / Contrôle des cours</h2><span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">للقراءة والمراجعة</span></div>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">دروس هذه النسخة ومصادرها. الفحص الآلي يساعد المراجعة ولا يثبت صحة المحتوى بيداغوجياً.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3">
        <button type="button" aria-pressed={!filters.status} onClick={() => { setFilters(INITIAL_FILTERS); setPage(1); }} className="text-start rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 hover:border-slate-400 transition-colors"><p className="text-xs text-slate-300">كل الدروس</p><p className="text-2xl font-black mt-1 tabular-nums">{COURSES_DATA.length}</p></button>
        {statuses.map(([status, label]) => <button type="button" key={status} aria-pressed={filters.status === status} onClick={() => { setFilters({ ...INITIAL_FILTERS, status }); setPage(1); }} className={`text-start rounded-xl border px-3 py-3 transition-colors hover:border-slate-400 ${STATUS_STYLES[status as keyof typeof STATUS_STYLES]} ${filters.status === status ? 'ring-2 ring-slate-300 ring-offset-2 ring-offset-slate-950' : ''}`}><p className="text-xs leading-relaxed">{label}</p><p className="text-2xl font-black mt-1 tabular-nums">{COURSES_DATA.filter(lesson => reviewStatus(lesson) === status).length}</p></button>)}
      </div>
      <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-4 sm:p-5 space-y-3">
        <label className="block text-sm space-y-1"><span>البحث / Recherche</span><input type="search" value={filters.query} onChange={event => update({ query: event.target.value })} className={fieldClass} placeholder="عنوان الدرس، المعرّف أو المصدر" /></label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="text-sm space-y-1"><span>السنة / Classe</span><select value={filters.grade} onChange={event => update({ grade: event.target.value })} className={fieldClass}><option value="">كل السنوات</option>{GRADE_ORDER.map(grade => <option key={grade}>{grade}</option>)}</select></label>
          <label className="text-sm space-y-1"><span>المادة / Matière</span><select value={filters.subject} onChange={event => update({ subject: event.target.value })} className={fieldClass}><option value="">كل المواد</option>{subjects.map(subject => <option key={subject} value={subject}>{subjectLabel(subject)}</option>)}</select></label>
          <label className="text-sm space-y-1"><span>الفصل / Trimestre</span><select value={filters.trimester} onChange={event => update({ trimester: event.target.value })} className={fieldClass}><option value="">كل الفصول</option>{[1, 2, 3].map(trimester => <option key={trimester} value={trimester}>الفصل {trimester}</option>)}<option value="unspecified">غير محدد</option></select></label>
          <label className="text-sm space-y-1"><span>حالة المراجعة / Statut</span><select value={filters.status} onChange={event => update({ status: event.target.value })} className={fieldClass}><option value="">كل الحالات</option>{statuses.map(([status, label]) => <option key={status} value={status}>{label}</option>)}</select></label>
        </div>
        <div className="flex flex-wrap items-center gap-3"><label className="inline-flex items-center gap-2 min-h-12 text-sm"><input type="checkbox" checked={filters.needsAttention} onChange={event => update({ needsAttention: event.target.checked })} />دروس تحتاج إلى مراجعة أو بيانات ناقصة</label><button type="button" className={buttonClass} onClick={() => { setFilters(INITIAL_FILTERS); setPage(1); }}>إعادة ضبط الفلاتر</button></div>
      </div>
      <p role="status" className="text-sm text-slate-300">{filtered.length} درس مطابق — الصفحة <span dir="ltr">{page} / {pages}</span></p>
      {selected && <article className="rounded-2xl border border-amber-500 bg-slate-900 p-4 sm:p-6 space-y-4 break-words" aria-labelledby="review-detail-title">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 ref={detailHeading} tabIndex={-1} id="review-detail-title" className="font-black text-lg scroll-mt-40">{selected.titleAr}</h3><button type="button" className={buttonClass} onClick={() => setSelectedId(null)}>إغلاق تفاصيل الدرس</button></div>
        <p className={`inline-flex rounded-full border px-3 py-1 text-sm ${STATUS_STYLES[reviewStatus(selected)]}`}>{REVIEW_LABELS[reviewStatus(selected)]}</p>
        <dl className="grid sm:grid-cols-2 gap-3 text-sm">
          {Object.entries({ 'المعرّف': selected.id, 'السنة': selected.grade, 'المادة': subjectLabel(selected.subject), 'الفصل': selected.trimester ?? 'غير محدد', 'مرجع المصدر': selected.sourceReference?.trim() || 'غير موثق', 'نوع المصدر': selected.sourceType ? ({ ministry_official: 'وثيقة رسمية', secondary_corroboration: 'مصدر ثانوي', original_authoring: 'تأليف أصلي' }[selected.sourceType]) : 'غير محدد', 'الثقة المعلنة': selected.confidenceLevel ? ({ high: 'عالية', medium: 'متوسطة', low: 'منخفضة' }[selected.confidenceLevel]) : 'غير محددة' }).map(([label, value]) => <div key={label}><dt className="text-slate-300">{label}</dt><dd className="whitespace-pre-wrap">{value}</dd></div>)}
        </dl>
        <p className="text-sm whitespace-pre-wrap">{selected.sourceNoteAr || 'لا توجد ملاحظة مراجعة موثقة.'}</p>
        <div><h4 className="font-bold">نقاط الفحص الآلي</h4>{reviewIssues(selected).length ? <ul className="list-disc list-inside text-amber-200">{reviewIssues(selected).map(issue => <li key={issue}>{issue}</li>)}</ul> : <p className="text-slate-300 text-sm">لا توجد معلومات ناقصة ضمن هذه الفحوص. يلزم التحقق البشري من صحة المحتوى.</p>}</div>
        <div><h4 className="font-bold">ملخص الدرس</h4><p className="whitespace-pre-wrap">{selected.summaryAr}</p></div>
        <div><h4 className="font-bold">الأهداف</h4><ul className="list-disc list-inside">{(selected.objectivesAr ?? (selected.objectiveAr ? [selected.objectiveAr] : [])).map((objective, index) => <li key={index}>{objective}</li>)}</ul></div>
        <div><h4 className="font-bold">القواعد</h4>{selected.rulesAr?.map((rule, index) => <p key={index} className="whitespace-pre-wrap mb-2">{rule}</p>)}</div>
        <div><h4 className="font-bold">الأمثلة المحلولة</h4>{selected.examplesAr?.map((example, index) => <div key={index} className="border-s border-slate-600 ps-3 my-2 whitespace-pre-wrap"><p>{example.problem}</p><p className="text-emerald-200">{example.solution}</p></div>)}</div>
        {selected.detailedCourse && <details className="rounded-xl border border-slate-700 p-3"><summary className="min-h-12 cursor-pointer font-bold">الشرح المفصل</summary><p className="whitespace-pre-wrap">{selected.detailedCourse.introAr}</p>{selected.detailedCourse.vocabulary?.map((term, index) => <p key={index}>{term.termAr}: {term.definitionAr}</p>)}{selected.detailedCourse.commonMistakes?.map((mistake, index) => <p key={index}>{mistake.mistakeAr} ← {mistake.correctionAr}</p>)}<p className="text-emerald-200 whitespace-pre-wrap">{selected.detailedCourse.takeawayAr}</p></details>}
        <details className="rounded-xl border border-slate-700 p-3"><summary className="min-h-12 cursor-pointer font-bold">تمارين التدريب والتقييم وتصحيحها ({exercises.length})</summary>{exercises.length === 0 && <p>لا توجد تمارين مسجلة ضمن هذين الحقلين. راجع الأنشطة في معاينة التلميذ.</p>}{exercises.map((exercise, index) => <div key={index} className="border-t border-slate-700 py-3 whitespace-pre-wrap"><p className="font-bold">{exercise.levelLabelAr}: {exercise.problemAr}</p><p className="text-emerald-200">{exercise.solutionAr}</p><p>{exercise.detailedCorrectionAr}</p></div>)}</details>
        {selected.mediaAssets?.length ? <details className="rounded-xl border border-slate-700 p-3"><summary className="min-h-12 cursor-pointer font-bold">الصور والصوت الموثقة ({selected.mediaAssets.length})</summary>{selected.mediaAssets.map(asset => <div key={asset.id} className="border-t border-slate-700 py-3"><p>{asset.altAr || asset.transcript || asset.id}</p><p>{asset.pedagogicalPurposeAr}</p><p>المصدر: {asset.source}</p><p>آخر مراجعة: {asset.reviewedAt || 'غير محددة'}</p><p dir="ltr" className="break-all text-sm">{asset.src}</p></div>)}</details> : <p className="text-sm text-slate-300">لا توجد وسائط موثقة في سجل هذا الدرس؛ قد تتوفر رسوم تفاعلية في معاينة التلميذ.</p>}
        <div><h4 className="font-bold">أسئلة التقييم والإجابات ({selected.quiz.length})</h4>{selected.quiz.length === 0 && <p className="text-slate-300">لا يوجد QCM في هذا الدرس؛ راجع الأنشطة في معاينة التلميذ.</p>}{selected.quiz.map((question, index) => <div key={question.id} className="rounded-xl border border-slate-700 p-3 my-2"><p className="font-bold">{index + 1}. {question.questionAr}</p><ul>{question.options.map(option => <li key={option.id} className={option.isCorrect ? 'text-emerald-200' : 'text-slate-300'}>{option.isCorrect ? '✓ ' : '• '}{option.textAr}{option.explanationAr && <p className="text-sm ps-4">{option.explanationAr}</p>}</li>)}</ul></div>)}</div>
        <a href={`/lesson/${encodeURIComponent(selected.id)}?g=${encodeURIComponent(selected.grade)}`} target="_blank" rel="noopener noreferrer" className={`${buttonClass} inline-flex items-center`}>معاينة الدرس كما يراه التلميذ ↗</a>
      </article>}
      <div className="space-y-3">
        {filtered.length === 0 && <p className="rounded-xl border border-slate-700 p-4">لا توجد دروس مطابقة. غيّر الفلاتر أو أعد ضبطها.</p>}
        {filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(lesson => <article key={lesson.id} className={`rounded-xl border bg-slate-900/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors hover:border-slate-500 ${selectedId === lesson.id ? 'border-emerald-500/50' : 'border-slate-800'}`}>
          <div className="flex-1 min-w-0"><div className="flex flex-wrap gap-2 items-center"><span className="text-xs font-bold rounded-md bg-slate-800 text-slate-200 px-2 py-1" dir="ltr">{lesson.grade}</span><h3 className="font-bold">{lesson.titleAr}</h3></div><p className="text-sm text-slate-400 mt-2">{subjectLabel(lesson.subject)} · {lesson.trimester ? `الفصل ${lesson.trimester}` : 'الفصل غير محدد'}</p>
            <p className="text-xs text-slate-400 break-all mt-1" dir="ltr">{lesson.id}</p>
          </div>
          <div className="sm:max-w-56 space-y-2"><p className={`inline-flex text-xs rounded-full border px-3 py-1 ${STATUS_STYLES[reviewStatus(lesson)]}`}>{REVIEW_LABELS[reviewStatus(lesson)]}</p>{reviewIssues(lesson).length > 0 && <p className="text-xs text-slate-300">{reviewIssues(lesson).length} نقطة تحتاج إلى فحص</p>}</div>
          <button type="button" className="min-h-12 shrink-0 px-4 rounded-xl border border-slate-600 text-sm font-bold text-emerald-200 hover:bg-slate-800" aria-expanded={selectedId === lesson.id} onClick={() => setSelectedId(lesson.id)}>فحص الدرس</button>
        </article>)}
      </div>
      <div className="flex justify-between gap-3"><button type="button" className={buttonClass} disabled={page === 1} onClick={() => setPage(previous => previous - 1)}>الصفحة السابقة</button><button type="button" className={buttonClass} disabled={page >= pages} onClick={() => setPage(previous => previous + 1)}>الصفحة التالية</button></div>
    </section>
  );
};
