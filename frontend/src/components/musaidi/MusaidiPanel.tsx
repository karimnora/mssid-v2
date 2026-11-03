import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Lightbulb, ScrollText, Search, Volume2, CheckCircle2 } from 'lucide-react';
import type { CourseLesson, PrimaryGrade } from '../../types';
import { useLocaleContext } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import { buildMusaidiBank, searchMusaidi, type MusaidiItem } from '../../data/musaidiBank';
import { openCorrectionSynced, readOpenedToday, remainingCorrections, syncOpenedToday } from '../../utils/musaidiQuota';
import { springBootApi } from '../../services/springBootApi';
import { canUseWebCheckout } from '../../utils/paymentPlatform';
import { NATIVE_OFFER_COPY } from '../../constants/nativeOfferCopy';
import { PremiumOffer } from '../PremiumOffer';
import { canAccess } from '../../access/entitlements';
import { speakText, stopSpeech } from '../../utils/speech';

const GRADES: PrimaryGrade[] = ['1AP', '2AP', '3AP', '4AP', '5AP'];
const SUBJECTS: Record<string, { fr: string; ar: string }> = {
  arabic: { fr: 'Arabe', ar: 'العربية' },
  math: { fr: 'Mathématiques', ar: 'الرياضيات' },
  islamic: { fr: 'Éducation islamique', ar: 'التربية الإسلامية' },
  science: { fr: 'Éducation scientifique', ar: 'التربية العلمية' },
  civics: { fr: 'Éducation civique', ar: 'التربية المدنية' },
  history_geo: { fr: 'Histoire-géographie', ar: 'التاريخ والجغرافيا' },
  french: { fr: 'Français', ar: 'الفرنسية' },
  english: { fr: 'Anglais', ar: 'الإنجليزية' },
  tamazight: { fr: 'Tamazight', ar: 'الأمازيغية' },
  art: { fr: 'Arts', ar: 'التربية الفنية' },
};
const PAGE = 20;

export interface MusaidiPanelProps {
  grade: PrimaryGrade;
  lesson?: CourseLesson | null;
  /** Published catalog; null while it loads. */
  courses: CourseLesson[] | null;
  onReviewLesson?: (lessonId: string) => void;
  onClose: () => void;
}

/** « مساعدي »: pick any question of the school year and get its prepared, verified correction. */
export function MusaidiPanel({ grade, lesson, courses, onReviewLesson, onClose }: MusaidiPanelProps) {
  const { locale } = useLocaleContext();
  const fr = locale === 'fr';
  const say = (a: string, b: string) => (fr ? a : b);
  const { authUser } = useAuth();
  const premium = canAccess('musaidiCorrections', authUser?.role);
  const account = authUser ? `user:${authUser.id}` : 'guest';

  const startGrade: PrimaryGrade = lesson?.grade && GRADES.includes(lesson.grade) ? lesson.grade : GRADES.includes(grade) ? grade : '1AP';
  const [viewGrade, setViewGrade] = useState<PrimaryGrade>(startGrade);
  const [subject, setSubject] = useState<string>(lesson?.subject ?? '');
  const [trimester, setTrimester] = useState<string>('all');
  const [lessonId, setLessonId] = useState<string>(lesson?.id ?? 'all');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [itemId, setItemId] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [showRule, setShowRule] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [opened, setOpened] = useState<string[]>(() => readOpenedToday(account));
  const [blocked, setBlocked] = useState(false);
  const [opening, setOpening] = useState(false);

  const signedIn = !!authUser;
  useEffect(() => {
    setOpened(readOpenedToday(account));
    if (!signedIn || premium) return;
    let alive = true;
    void syncOpenedToday(account, springBootApi).then((ids) => {
      if (alive) setOpened(ids);
    });
    return () => {
      alive = false;
    };
  }, [account, signedIn, premium]);

  const gradeLessons = useMemo(() => (courses ?? []).filter((l) => l.grade === viewGrade), [courses, viewGrade]);
  const bank = useMemo(() => buildMusaidiBank(gradeLessons), [gradeLessons]);
  const subjects = useMemo(() => Object.keys(SUBJECTS).filter((s) => bank.some((i) => i.subject === s)), [bank]);
  const activeSubject = subjects.includes(subject) ? subject : subjects.includes('math') ? 'math' : subjects[0] ?? '';
  const subjectLessons = gradeLessons.filter(
    (l) => l.subject === activeSubject && (trimester === 'all' || String(l.trimester) === trimester) && bank.some((i) => i.lessonId === l.id),
  );
  const activeLessonId = lessonId !== 'all' && subjectLessons.some((l) => l.id === lessonId) ? lessonId : 'all';
  const filtered = searchMusaidi(
    bank.filter(
      (i) =>
        i.subject === activeSubject &&
        (trimester === 'all' || String(i.trimester) === trimester) &&
        (activeLessonId === 'all' || i.lessonId === activeLessonId),
    ),
    query,
  );
  const item: MusaidiItem | undefined = itemId ? bank.find((i) => i.id === itemId) : undefined;
  const itemLesson = item ? gradeLessons.find((l) => l.id === item.lessonId) : undefined;
  const remaining = remainingCorrections(premium, opened);
  const alreadySeen = item ? opened.includes(item.id) : false;

  const resetItem = () => {
    stopSpeech();
    setItemId(null);
    setHints(0);
    setShowRule(false);
    setRevealed(false);
    setBlocked(false);
  };
  const choose = (id: string) => {
    resetItem();
    setItemId(id);
    if (opened.includes(id)) setRevealed(true);
  };
  const reveal = async () => {
    if (!item || opening) return;
    setOpening(true);
    try {
      const next = await openCorrectionSynced(account, premium, item.id, signedIn ? springBootApi : null);
      if (!next) {
        setBlocked(true);
        return;
      }
      setOpened(next);
      setRevealed(true);
    } finally {
      setOpening(false);
    }
  };
  const listen = (text: string) => void speakText(text, 'ar-SA').catch(() => {});

  if (!courses) {
    return <p role="status" className="rounded-xl bg-emerald-50 text-slate-900 p-3">{say('Préparation des questions…', 'جارٍ تحضير الأسئلة…')}</p>;
  }

  const selectClass = 'block w-full min-h-12 rounded-xl border border-emerald-300 bg-white px-3 mt-1';
  return (
    <div className="space-y-4" data-musaidi>
      <div className="flex flex-wrap gap-2" role="group" aria-label={say('Niveau', 'الصف')}>
        {GRADES.map((g) => (
          <button
            key={g}
            type="button"
            aria-pressed={viewGrade === g}
            onClick={() => {
              setViewGrade(g);
              setSubject('');
              setLessonId('all');
              setTrimester('all');
              setLimit(PAGE);
              resetItem();
            }}
            className={`min-h-12 min-w-14 rounded-xl px-4 font-bold border ${viewGrade === g ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white border-emerald-200'}`}
          >
            {g}
          </button>
        ))}
      </div>

      {subjects.length === 0 ? (
        <p className="rounded-xl bg-amber-50 text-slate-900 p-3 text-sm">{say('Aucune question publiée pour ce niveau pour le moment.', 'لا توجد أسئلة منشورة لهذا الصف حالياً.')}</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="font-bold text-sm">
              {say('Matière', 'المادة')}
              <select className={selectClass} value={activeSubject} onChange={(e) => { setSubject(e.target.value); setLessonId('all'); setLimit(PAGE); resetItem(); }}>
                {subjects.map((s) => (
                  <option key={s} value={s}>{fr ? SUBJECTS[s].fr : SUBJECTS[s].ar}</option>
                ))}
              </select>
            </label>
            <label className="font-bold text-sm">
              {say('Trimestre', 'الفصل')}
              <select className={selectClass} value={trimester} onChange={(e) => { setTrimester(e.target.value); setLessonId('all'); setLimit(PAGE); resetItem(); }}>
                <option value="all">{say('Toute l’année', 'السنة كلها')}</option>
                <option value="1">{say('1er trimestre', 'الفصل الأول')}</option>
                <option value="2">{say('2e trimestre', 'الفصل الثاني')}</option>
                <option value="3">{say('3e trimestre', 'الفصل الثالث')}</option>
              </select>
            </label>
            <label className="font-bold text-sm">
              {say('Leçon', 'الدرس')}
              <select className={selectClass} value={activeLessonId} onChange={(e) => { setLessonId(e.target.value); setLimit(PAGE); resetItem(); }}>
                <option value="all">{say('Toutes les leçons', 'كل الدروس')}</option>
                {subjectLessons.map((l) => (
                  <option key={l.id} value={l.id}>{l.titleAr}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block font-bold text-sm">
            <span className="inline-flex items-center gap-1"><Search size={16} aria-hidden />{say('Chercher une question', 'ابحث عن سؤال')}</span>
            <input
              type="search"
              dir="rtl"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }}
              placeholder="مثال: الجمع بالاحتفاظ"
              className="block w-full min-h-12 rounded-xl border border-emerald-300 bg-white text-slate-900 px-3 mt-1"
            />
          </label>

          <p className="text-sm text-slate-600" role="status" data-musaidi-count>
            {say(`${filtered.length} question(s)`, `${filtered.length} سؤال`)}
            {remaining != null && ` · ${say(`${remaining} correction(s) détaillée(s) restante(s) aujourd’hui`, `بقي لك ${remaining} من التصحيحات المفصّلة اليوم`)}`}
          </p>

          {!item && (
            <ul className="space-y-2" aria-label={say('Questions', 'الأسئلة')}>
              {filtered.slice(0, limit).map((i) => (
                <li key={i.id}>
                  <button type="button" dir="rtl" data-musaidi-question onClick={() => choose(i.id)} className="w-full min-h-12 text-right rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-emerald-400">
                    {opened.includes(i.id) && <CheckCircle2 size={16} className="inline text-emerald-700 ml-1" aria-label={say('Correction vue', 'تمت مشاهدة التصحيح')} />}
                    {i.questionAr}
                  </button>
                </li>
              ))}
              {filtered.length > limit && (
                <li>
                  <button type="button" onClick={() => setLimit(limit + PAGE)} className="min-h-12 px-4 rounded-xl border border-emerald-300 font-bold">
                    {say('Voir plus de questions', 'أسئلة أخرى')}
                  </button>
                </li>
              )}
            </ul>
          )}

          {item && (
            <article className="musaidi-sheet rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3" data-musaidi-item>
              <button type="button" onClick={resetItem} className="min-h-12 px-3 rounded-xl border border-slate-300 font-bold text-sm">
                {say('← Autres questions', 'أسئلة أخرى')}
              </button>
              <div className="flex items-start gap-2">
                <p dir="rtl" className="flex-1 text-lg font-bold leading-relaxed">{item.questionAr}</p>
                <button type="button" onClick={() => listen(item.questionAr)} aria-label={say('Écouter la question', 'استمع إلى السؤال')} className="min-h-12 min-w-12 rounded-xl border border-emerald-300 grid place-items-center">
                  <Volume2 aria-hidden />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {hints < item.hintsAr.length && (
                  <button type="button" onClick={() => setHints(hints + 1)} className="min-h-12 px-4 rounded-xl bg-white border border-amber-300 font-bold inline-flex items-center gap-2">
                    <Lightbulb size={18} aria-hidden />{say('Un indice', 'تلميح')}
                  </button>
                )}
                {itemLesson?.rulesAr?.length ? (
                  <button type="button" aria-pressed={showRule} onClick={() => setShowRule(!showRule)} className="min-h-12 px-4 rounded-xl bg-white border border-sky-300 font-bold inline-flex items-center gap-2">
                    <ScrollText size={18} aria-hidden />{say('La règle', 'قاعدة الدرس')}
                  </button>
                ) : null}
                {!revealed && (
                  <button type="button" onClick={() => void reveal()} disabled={opening} aria-busy={opening} data-musaidi-reveal className="min-h-12 px-4 rounded-xl bg-emerald-800 text-white font-bold">
                    {say('Voir la correction détaillée', 'التصحيح المفصّل')}
                  </button>
                )}
              </div>

              {item.hintsAr.slice(0, hints).map((h, n) => (
                <p key={n} dir="rtl" className="rounded-xl bg-amber-50 p-3">💡 {h}</p>
              ))}
              {showRule && itemLesson && (
                <ul dir="rtl" className="rounded-xl bg-sky-50 p-3 list-disc pr-5 space-y-1">
                  {itemLesson.rulesAr.slice(0, 3).map((r, n) => <li key={n}>{r}</li>)}
                </ul>
              )}

              {blocked && !revealed && (
                <div className="rounded-xl bg-amber-50 p-3 space-y-2" role="alert">
                  <p>
                    {canUseWebCheckout()
                      ? say(
                          'Tu as utilisé tes 3 corrections détaillées d’aujourd’hui. Elles reviennent demain. Les indices et la règle restent libres. Premium ouvre les corrections sans limite.',
                          'استعملت تصحيحاتك المفصّلة الثلاثة لهذا اليوم، وتعود غداً. تبقى التلميحات وقاعدة الدرس متاحة. يفتح Premium التصحيحات دون حد.',
                        )
                      : say(NATIVE_OFFER_COPY.musaidiLimit.fr, NATIVE_OFFER_COPY.musaidiLimit.ar)}
                  </p>
                  <PremiumOffer />
                </div>
              )}

              {revealed && (
                <section className="rounded-xl bg-white border border-emerald-300 p-3 space-y-2" aria-label={say('Correction', 'التصحيح')}>
                  <div className="flex items-start gap-2">
                    <p dir="rtl" className="flex-1"><strong>{say('Réponse : ', 'الجواب: ')}</strong>{item.answerAr}</p>
                    <button type="button" onClick={() => listen([item.answerAr, ...item.stepsAr].join('. '))} aria-label={say('Écouter la correction', 'استمع إلى التصحيح')} className="min-h-12 min-w-12 rounded-xl border border-emerald-300 grid place-items-center">
                      <Volume2 aria-hidden />
                    </button>
                  </div>
                  {item.stepsAr.length > 0 && (
                    <ol dir="rtl" className="list-decimal pr-5 space-y-1">
                      {item.stepsAr.map((s, n) => <li key={n}>{s}</li>)}
                    </ol>
                  )}
                  {item.operationsAr && (
                    <div dir="rtl" className="grid grid-cols-2 gap-2 text-sm" data-two-columns>
                      <div className="rounded-lg bg-slate-50 p-2"><strong>العمليات</strong><pre className="whitespace-pre-wrap font-sans">{item.operationsAr}</pre></div>
                      <div className="rounded-lg bg-slate-50 p-2"><strong>الحل</strong><p>{item.answerAr}</p></div>
                    </div>
                  )}
                  {item.irabTableAr && (
                    <table dir="rtl" className="w-full text-sm border">
                      <thead><tr><th className="border p-1">الكلمة</th><th className="border p-1">إعرابها</th></tr></thead>
                      <tbody>{item.irabTableAr.map((r, n) => <tr key={n}><td className="border p-1">{r.wordAr}</td><td className="border p-1">{r.analysisAr}</td></tr>)}</tbody>
                    </table>
                  )}
                  {!premium && alreadySeen && <p className="text-xs text-slate-500">{say('Revoir une correction déjà ouverte aujourd’hui est gratuit.', 'إعادة مشاهدة تصحيح فُتح اليوم لا تُحتسب.')}</p>}
                </section>
              )}

              {onReviewLesson && itemLesson && (
                <button type="button" onClick={() => { onClose(); onReviewLesson(itemLesson.id); }} className="min-h-12 rounded-xl border border-emerald-700 text-emerald-900 px-4 font-bold inline-flex gap-2 items-center">
                  <BookOpen size={18} aria-hidden />{say('Revoir la leçon', 'أراجع الدرس')} · <span dir="rtl">{itemLesson.titleAr}</span>
                </button>
              )}
            </article>
          )}
        </>
      )}
    </div>
  );
}

