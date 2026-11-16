import { MusaidiText } from './MusaidiText';
import React, { useEffect, useMemo, useState, useSyncExternalStore, useRef } from 'react';
import { BookOpen, Lightbulb, ScrollText, Search, Volume2, CheckCircle2 } from 'lucide-react';
import type { CourseLesson, PrimaryGrade, UserProfile } from '../../types';
import { useLocaleContext } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import { buildMusaidiBank, searchMusaidi, type MusaidiItem } from '../../data/musaidiBank';
import { openCorrectionSynced, readOpenedToday, remainingCorrections, syncOpenedToday } from '../../utils/musaidiQuota';
import { springBootApi } from '../../services/springBootApi';
import { canUseWebCheckout } from '../../utils/paymentPlatform';
import { NATIVE_OFFER_COPY } from '../../constants/nativeOfferCopy';
import { PremiumOffer } from '../PremiumOffer';
import { canAccess } from '../../access/entitlements';
import { SUBJECTS_LIST } from '../../data/subjectsData';
import { guidedHelpForLesson } from '../../data/guidedMath';
import { GuidedHelpCard } from '../GuidedMathSupport';
import { speakText, stopSpeech } from '../../utils/speech';

import type { PracticeResult } from '../../utils/competenceProgress';
import type { ExamCountdown } from '../../utils/examCountdown';
import { getActiveProgressOwner, subscribeProgressOwner } from '../../utils/progressOwner';
import { readLastLessonActivity } from '../../utils/lastActivity';
import { musaidiSuggestions } from '../../utils/musaidiPersonalization';
import { recordPremiumEvent } from '../../utils/premiumFunnel';
import { recordMusaidiHelp } from '../../utils/musaidiHistory';
import { VillagePremiumMark } from '../home/VillagePremiumMark';
import { MusaidiCorrection } from './MusaidiCorrection';
import { MusaidiTwin, findMusaidiTwin } from './MusaidiTwin';

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
  userProfile?: UserProfile;
  countdown?: ExamCountdown | null;
  onPracticeResult?: (lessonId:string, result:PracticeResult)=>void;
  lesson?: CourseLesson | null;
  /** Published catalog; null while it loads. */
  courses: CourseLesson[] | null;
  onReviewLesson?: (lessonId: string) => void;
  onClose: () => void;
}

/** « مساعدي »: pick any question of the school year and get its prepared, verified correction. */
export function MusaidiPanel(props: MusaidiPanelProps) {
  const owner = useSyncExternalStore(subscribeProgressOwner, getActiveProgressOwner, () => 'guest');
  return <MusaidiPanelContent key={`${owner}:${props.grade}:${props.lesson?.id ?? 'menu'}`} {...props} owner={owner} />;
}
function MusaidiPanelContent({ grade, lesson, courses, onReviewLesson, onClose, userProfile, countdown, onPracticeResult, owner }: MusaidiPanelProps & {owner:string}) {
  const { locale } = useLocaleContext();
  const fr = locale === 'fr';
  const say = (a: string, b: string) => (fr ? a : b);
  const { authUser } = useAuth();
  const premium = canAccess('musaidiCorrections', authUser?.role);
  const account = authUser ? `user:${authUser.id}` : 'guest';

  const viewGrade = grade;
  const contextLesson = lesson?.grade === grade ? lesson : null;
  const [subject, setSubject] = useState(contextLesson?.subject ?? '');
  const [lessonId, setLessonId] = useState(contextLesson?.id ?? '');
  const [stage, setStage] = useState<'subject' | 'lesson' | 'question'>(contextLesson ? 'question' : 'subject');
  const [otherTerms, setOtherTerms] = useState(false);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE);
  const [itemId, setItemId] = useState<string | null>(null);
  const [hints, setHints] = useState(0);
  const [showRule, setShowRule] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [opened, setOpened] = useState<string[]>(() => readOpenedToday(account));
  const [blocked, setBlocked] = useState(false);
  const [opening, setOpening] = useState(false);
  const [correctionComplete,setCorrectionComplete] = useState(false);
  const helpRecorded = useRef(false);
  const requestVersion = useRef(0);
  useEffect(()=>()=>{ requestVersion.current += 1; },[]);

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
  const subjectLessons = gradeLessons.filter(l => l.subject === subject && bank.some(i => i.lessonId === l.id));
  const month = new Date().getMonth() + 1;
  const currentTerm = month >= 9 ? 1 : month <= 3 ? 2 : month <= 6 ? 3 : null;
  const currentLessons = subjectLessons.filter(l => currentTerm === null || l.trimester === currentTerm);
  const otherLessons = subjectLessons.filter(l => currentTerm !== null && l.trimester !== currentTerm);
  const filtered = searchMusaidi(bank.filter(i => i.subject === subject && i.lessonId === lessonId), query);
  const item: MusaidiItem | undefined = itemId ? bank.find((i) => i.id === itemId) : undefined;
  const itemLesson = item ? gradeLessons.find((l) => l.id === item.lessonId) : undefined;
  const sourceQuestion = item?.kind === 'quiz' ? itemLesson?.quiz?.find(q => item.id === `${itemLesson.id}:quiz:${q.id}`) : undefined;
  const guides = itemLesson ? guidedHelpForLesson(itemLesson, sourceQuestion) : [];
  const itemGuides = sourceQuestion?.competenceId || guides.length === 1 ? guides : [];
  const suggestions = useMemo(()=>musaidiSuggestions(bank,userProfile?.competenceStats),[bank,userProfile?.competenceStats]);
  const revision = countdown ? musaidiSuggestions(bank.filter(i=>i.trimester===countdown.trimester),userProfile?.competenceStats,new Date(),10) : [];
  const lastActivity = readLastLessonActivity();
  const fallbackLessonId = contextLesson?.id ?? (lastActivity?.kind === 'lesson' && lastActivity.grade === grade ? lastActivity.lessonId : undefined);
  const freeSuggestions = bank.filter(i=>i.lessonId===fallbackLessonId).slice(0,3);
  const twin = item ? findMusaidiTwin(item,bank,gradeLessons) : undefined;
  const recordHelp = () => {
    if(!item || helpRecorded.current)return;
    helpRecorded.current=true;
    recordMusaidiHelp(owner,{lessonId:item.lessonId,competenceId:item.competenceId,grade});
  };
  const remaining = remainingCorrections(premium, opened);
  const alreadySeen = item ? opened.includes(item.id) : false;

  const resetItem = () => {
    stopSpeech();
    requestVersion.current += 1;
    setOpening(false);
    helpRecorded.current=false;
    setCorrectionComplete(false);
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
    const version = requestVersion.current;
    try {
      const next = await openCorrectionSynced(account, premium, item.id, signedIn ? springBootApi : null);
      if(version !== requestVersion.current || getActiveProgressOwner() !== owner)return;
      if (!next) {
        setBlocked(true);
        return;
      }
      recordHelp();
      if(premium)recordPremiumEvent('musaidi_correction',grade);
      setOpened(next);
      setRevealed(true);
    } finally {
      if(version === requestVersion.current)setOpening(false);
    }
  };
  const listen = (text: string) => void speakText(text, 'ar-SA').catch(() => {});

  if (!courses) {
    return <p role="status" className="rounded-xl bg-emerald-50 text-slate-900 p-3">{say('Préparation des questions…', 'جارٍ تحضير الأسئلة…')}</p>;
  }

  // Explicit dark text: the panel also opens over the dark « world » theme, where inherited white text was unreadable on mint.
  const tileClass = 'min-w-[60px] min-h-[60px] rounded-xl border border-emerald-300 bg-emerald-50 text-slate-900 px-4 py-3 text-start font-bold text-base';
  const earlyGrade = ['1AP', '2AP', '3AP'].includes(grade);
  const voice = (text: string, subjectTile: boolean) => void speakText(text, subjectTile && fr ? 'fr-FR' : 'ar-SA').catch(() => {});
  const tile = (id: string, label: string, select: () => void, subjectTile = false) => (
    <li key={id} className="flex gap-2">
      <button type="button" className={`${tileClass} flex-1 ${subjectTile ? SUBJECTS_LIST.find(s => s.id === id)?.bgLight ?? '' : ''}`} onClick={select}>
        {subjectTile && <span aria-hidden className="me-2">{id === 'math' ? '🔢' : id === 'arabic' ? '📖' : id === 'science' ? '🌱' : '📚'}</span>}{label}
      </button>
      {earlyGrade && <button type="button" className={tileClass} aria-label={`${say('Écouter', 'استمع')}: ${label}`} onClick={() => voice(label, subjectTile)}><Volume2 aria-hidden /></button>}
    </li>
  );
  const selectLesson = (id: string) => { stopSpeech(); setLessonId(id); setQuery(''); setLimit(PAGE); setStage('question'); };
  // Suggestions open the help; they are not repeated while the child browses another lesson.
  // On entry from a lesson, free suggestions would duplicate that lesson's list, so only Premium shows them.
  const atEntry = !!contextLesson && stage === 'question' && lessonId === contextLesson.id;
  const showSuggestions = !item && (stage === 'subject' || (premium && atEntry));
  return (
    <div className="space-y-4 text-base" data-musaidi>
      {showSuggestions && (premium ? suggestions.length > 0 : freeSuggestions.length > 0) && <section className="rounded-2xl border border-emerald-200 p-3 space-y-3" aria-label={say('Didou te propose','ديدو يقترح عليك')}>
        <h3 className="font-bold">{say('Didou te propose','ديدو يقترح عليك')}</h3>
        {premium && <VillagePremiumMark />}
        {(premium ? suggestions : freeSuggestions.map(item=>({item,reasonFr:'Ta leçon en cours ou la dernière leçon ouverte.',reasonAr:'درسك الحالي أو آخر درس فتحته.'}))).map(s=><div key={s.item.id}>
          <button type="button" aria-label={`${say('Travailler : ','أتدرّب: ')}${s.item.questionAr}`} className={tileClass} onClick={()=>{if(premium)recordPremiumEvent('musaidi_suggestion',grade);setSubject(s.item.subject);setLessonId(s.item.lessonId);setStage('question');choose(s.item.id);}}><MusaidiText text={s.item.questionAr} /></button>
          <p>{fr?s.reasonFr:s.reasonAr}</p>
        </div>)}
      </section>}
      {premium && showSuggestions && revision.length>0 && <section className="rounded-2xl border border-amber-300 p-3 space-y-3" aria-label={say('Révision avant les compositions','مراجعة قبل الاختبارات')}>
        <h3 className="font-bold">{say('Révision avant les compositions','مراجعة قبل الاختبارات')}</h3><VillagePremiumMark />
        <p>{say('Une série du trimestre, construite sur tes erreurs.','سلسلة من دروس الفصل مبنية على أخطائك.')}</p>
        {revision.map((s,n)=><div key={s.item.id}><button type="button" aria-label={`${say('Réviser : ','أراجع: ')}${s.item.questionAr}`} className={tileClass} onClick={()=>{recordPremiumEvent('musaidi_revision',grade);setSubject(s.item.subject);setLessonId(s.item.lessonId);setStage('question');choose(s.item.id);}}><bdi dir="ltr">{n+1}</bdi> · <MusaidiText text={s.item.questionAr} /></button><p>{fr?s.reasonFr:s.reasonAr}</p></div>)}
      </section>}
      {stage !== 'subject' && <button type="button" className={tileClass} onClick={() => { resetItem(); setQuery(''); setLimit(PAGE); setStage(stage === 'question' ? 'lesson' : 'subject'); }}>{say('Retour', 'رجوع')}</button>}
      {stage === 'question' && <button type="button" className={tileClass} onClick={() => { resetItem(); setQuery(''); setStage('subject'); }}>{say('Autres matières', 'مواد أخرى')}</button>}
      {subjects.length === 0 ? <p role="status">{say('Aucune question publiée pour ce niveau pour le moment.', 'لا توجد أسئلة منشورة لهذا الصف حالياً.')}</p> : <>
        {stage === 'subject' && <ul className="grid gap-3" aria-label={say('Matières', 'المواد')}>{subjects.map(s => tile(s, fr ? SUBJECTS[s].fr : SUBJECTS[s].ar, () => { stopSpeech(); setSubject(s); setOtherTerms(false); setStage('lesson'); }, true))}</ul>}
        {stage === 'lesson' && <>
          <h3 className="font-bold">{say('Choisis une leçon', 'اختر الدرس')}</h3>
          <ul className="grid gap-3">{currentLessons.map(l => tile(l.id, l.titleAr, () => selectLesson(l.id)))}</ul>
          {otherLessons.length > 0 && <>
            <button type="button" className={tileClass} aria-expanded={otherTerms} onClick={() => setOtherTerms(!otherTerms)}>{say('Autres leçons', 'دروس أخرى')}</button>
            {otherTerms && <ul className="grid gap-3">{otherLessons.map(l => tile(l.id, l.titleAr, () => selectLesson(l.id)))}</ul>}
          </>}
        </>}
        {stage === 'question' && <>
          {!earlyGrade && !item && <label className="block font-bold">
            <span className="inline-flex items-center gap-1"><Search size={16} aria-hidden />{say('Chercher une question', 'ابحث عن سؤال')}</span>
            <input type="search" dir="rtl" value={query} onChange={e => { setQuery(e.target.value); setLimit(PAGE); }} className="block w-full min-h-[60px] rounded-xl border border-emerald-300 px-3 mt-1" />
          </label>}
          <p className="text-base text-slate-600" role="status" data-musaidi-count>
            <MusaidiText text={say(`${filtered.length} question(s)`, `${filtered.length} سؤال`)} />
            {remaining != null && <MusaidiText text={` · ${say(`${remaining} correction(s) détaillée(s) restante(s) aujourd’hui`, `بقي لك ${remaining} من التصحيحات المفصّلة اليوم`)}`} />}
          </p>

          {!item && (
            <ul className="space-y-2" aria-label={say('Questions', 'الأسئلة')}>
              {filtered.slice(0, limit).map((i) => (
                <li key={i.id}>
                  <button type="button" dir="rtl" data-musaidi-question onClick={() => choose(i.id)} className="w-full min-h-[60px] text-right rounded-xl border border-slate-200 bg-white px-3 py-2 hover:border-emerald-400">
                    {opened.includes(i.id) && <CheckCircle2 size={16} className="inline text-emerald-700 ml-1" aria-label={say('Correction vue', 'تمت مشاهدة التصحيح')} />}
                    <MusaidiText text={i.questionAr} />
                  </button>
                  {earlyGrade && <button type="button" className={tileClass} aria-label={`${say('Écouter', 'استمع')}: ${i.questionAr}`} onClick={() => listen(i.questionAr)}><Volume2 aria-hidden /></button>}
                </li>
              ))}
              {filtered.length > limit && (
                <li>
                  <button type="button" onClick={() => setLimit(limit + PAGE)} className="min-h-[60px] px-4 rounded-xl border border-emerald-300 font-bold">
                    {say('Voir plus de questions', 'أسئلة أخرى')}
                  </button>
                </li>
              )}
            </ul>
          )}

          {item && (
            <article className="musaidi-sheet rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3" data-musaidi-item>
              <button type="button" onClick={resetItem} className="min-h-[60px] px-3 rounded-xl border border-slate-300 font-bold text-base">
                {say('← Autres questions', 'أسئلة أخرى')}
              </button>
              <div className="flex items-start gap-2">
                <p dir="rtl" className="flex-1 text-lg font-bold leading-relaxed"><MusaidiText text={item.questionAr} /></p>
                <button type="button" onClick={() => listen(item.questionAr)} aria-label={say('Écouter la question', 'استمع إلى السؤال')} className="min-h-[60px] min-w-[60px] rounded-xl border border-emerald-300 grid place-items-center">
                  <Volume2 aria-hidden />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {hints < item.hintsAr.length && (
                  <button type="button" onClick={() => {recordHelp();setHints(hints + 1);}} className="min-h-[60px] px-4 rounded-xl bg-white border border-amber-300 font-bold inline-flex items-center gap-2">
                    <Lightbulb size={18} aria-hidden />{say('Un indice', 'تلميح')}
                  </button>
                )}
                {itemLesson?.rulesAr?.length ? (
                  <button type="button" aria-pressed={showRule} onClick={() => {if(!showRule)recordHelp();setShowRule(!showRule);}} className="min-h-[60px] px-4 rounded-xl bg-white border border-sky-300 font-bold inline-flex items-center gap-2">
                    <ScrollText size={18} aria-hidden />{say('La règle', 'قاعدة الدرس')}
                  </button>
                ) : null}
                {!revealed && (
                  <button type="button" onClick={() => void reveal()} disabled={opening} aria-busy={opening} data-musaidi-reveal className="min-h-[60px] px-4 rounded-xl bg-emerald-800 text-white font-bold">
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
                  <VillagePremiumMark locked /><PremiumOffer grade={grade} layer={130} />
                </div>
              )}

              {revealed && <>
                <MusaidiCorrection key={item.id} item={item} interactive={premium} onComplete={()=>setCorrectionComplete(true)} />
                {!premium && alreadySeen && <p>{say('Revoir une correction déjà ouverte aujourd’hui est gratuit.','إعادة مشاهدة تصحيح فُتح اليوم لا تُحتسب.')}</p>}
                {premium && correctionComplete && twin && onPracticeResult && <MusaidiTwin key={twin.id} item={twin} courses={gradeLessons} onPracticeResult={(id,result)=>{if(result.outcome==='success')recordPremiumEvent('musaidi_twin',grade);onPracticeResult(id,result);}} />}
              </>}

              {itemGuides.map(guide => <GuidedHelpCard key={`${item.id}:${guide.competenceId}`} guide={guide} onHelp={recordHelp} />)}
              {onReviewLesson && itemLesson && (
                <button type="button" onClick={() => { onClose(); onReviewLesson(itemLesson.id); }} className="min-h-[60px] rounded-xl border border-emerald-700 text-emerald-900 px-4 font-bold inline-flex gap-2 items-center">
                  <BookOpen size={18} aria-hidden />{say('Revoir la leçon', 'أراجع الدرس')} · <span dir="rtl">{itemLesson.titleAr}</span>
                </button>
              )}
            </article>
          )}
        </>}
        </>
      }
    </div>
  );
}

