import React, { useEffect, useMemo, useState } from 'react';
import { Compass, Volume2, X } from 'lucide-react';
import type { PrimaryGrade, UserProfile } from '../../types';
import { getDiagnosticSet } from '../../data/diagnostic';
import {
  SKIPPED,
  applyDiagnosticToProfile,
  estimatedMinutes,
  formatDiagnosticText,
  loadDiagnosticResult,
  rowsByStatus,
  saveDiagnosticResult,
  scoreDiagnostic,
  selectDiagnosticQuestions,
  suggestedScope,
  type DiagnosticAnswers,
  type DiagnosticResult,
  type DiagnosticRow,
  type DiagnosticScope,
} from '../../utils/diagnostic';
import { useLocaleContext } from '../../context/LocaleContext';
import { useAuth } from '../../context/AuthContext';
import { useProgressOwner } from '../../utils/ownerStorage';
import { formatEducationalText } from '../../utils/textFormatter';
import { speakText, stopSpeech } from '../../utils/speech';
import { sharePlainText } from '../../utils/shareContent';
import { springBootApi } from '../../services/springBootApi';
import { AuthService } from '../../services/authService';
import { canAccess } from '../../access/entitlements';
import { PremiumOffer } from '../PremiumOffer';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  grade: PrimaryGrade;
  onReviewLesson: (lessonId: string) => void;
}

type Phase = 'intro' | 'quiz' | 'handover' | 'report';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SCOPES: DiagnosticScope[] = [1, 2, 3];

/**
 * Free level check. The parent starts it, the child answers alone (no timer, no right/wrong shown
 * while answering, so nothing to be afraid of), then the parent reads the report. No price and no
 * payment wording here: the same screen runs in the Android app.
 */
export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose, userProfile, setUserProfile, grade, onReviewLesson }) => {
  const { locale, direction } = useLocaleContext();
  const { authUser } = useAuth();
  const owner = useProgressOwner();
  const fr = locale === 'fr';
  const say = (frText: string, arText: string) => (fr ? frText : arText);
  const set = useMemo(() => getDiagnosticSet(grade), [grade]);

  const [phase, setPhase] = useState<Phase>('intro');
  const [scope, setScope] = useState<DiagnosticScope>(() => suggestedScope());
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [shareState, setShareState] = useState<'idle' | 'shared' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<'idle' | 'busy' | 'saved' | 'error'>('idle');

  // A new child, grade or opening starts from the intro, with that child's last report at hand.
  useEffect(() => {
    if (!isOpen) return;
    setPhase('intro');
    setIndex(0);
    setAnswers({});
    setShareState('idle');
    setEmailState('idle');
    setResult(loadDiagnosticResult(grade));
    return () => stopSpeech();
  }, [isOpen, owner, grade]);

  const round = result ? result.round + 1 : 0;
  const questions = useMemo(() => (set ? selectDiagnosticQuestions(set, scope, round) : []), [set, scope, round]);

  if (!isOpen) return null;

  const shell = (title: string, body: React.ReactNode) => (
    <div className="fixed inset-0 z-[56] kids-modal-overlay backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6" dir={direction}>
      <div role="dialog" aria-modal="true" aria-labelledby="diagnostic-title" data-diagnostic={phase} className="kids-modal-panel w-full max-w-xl flex flex-col overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between gap-2 shrink-0 bg-white border-b-2 border-[#E7E2D7]">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="w-5 h-5 shrink-0 text-[var(--kids-grass-2)]" aria-hidden="true" />
            <h2 id="diagnostic-title" className="text-base sm:text-lg font-extrabold truncate">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="kids-close cursor-pointer" aria-label={say('Fermer', 'إغلاق')}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="kids-modal-body p-5 space-y-4">{body}</div>
      </div>
    </div>
  );

  const title = set ? (fr ? set.titleFr : set.titleAr) : say('Diagnostic de niveau', 'تشخيص المستوى');

  if (!set) {
    return shell(title, (
      <p className="text-sm font-bold text-[var(--kids-ink)] leading-relaxed bg-[#FFF8E7] rounded-2xl p-4">
        {say(
          'Le diagnostic existe pour les maths de 5AP pour le moment. Les autres niveaux arrivent.',
          'التشخيص متوفر حالياً لرياضيات السنة الخامسة. المستويات الأخرى قادمة.',
        )}
      </p>
    ));
  }

  const start = () => {
    setAnswers({});
    setIndex(0);
    setPhase('quiz');
  };

  const finish = (all: DiagnosticAnswers) => {
    const next = scoreDiagnostic(set, questions, all, scope, round);
    setUserProfile((prev) => applyDiagnosticToProfile(prev, next));
    saveDiagnosticResult(next);
    setResult(next);
    setShareState('idle');
    setPhase('handover');
  };

  const answer = (optionId: string) => {
    stopSpeech();
    const all = { ...answers, [questions[index].id]: optionId };
    setAnswers(all);
    if (index + 1 < questions.length) setIndex(index + 1);
    else finish(all);
  };

  if (phase === 'intro') {
    const scopeLabel = (value: DiagnosticScope) =>
      value === 1 ? say('1er trimestre', 'الفصل الأول') : value === 2 ? say('Trimestres 1 et 2', 'الفصلان الأول والثاني') : say('Toute l’année', 'السنة كلها');
    return shell(title, (
      <>
        <p className="text-sm font-bold text-[var(--kids-ink)] leading-relaxed">
          {say(
            `Pour le parent : ${userProfile.name} répond seul à quelques questions, sans chronomètre. Vous recevez ensuite un bilan : ce qui est réussi, ce qui est fragile et par quoi commencer.`,
            `للولي: يجيب ${userProfile.name} وحده عن بعض الأسئلة دون توقيت. بعدها تحصلون على حصيلة: ما نجح فيه، ما يحتاج إلى تثبيت، وبماذا نبدأ.`,
          )}
        </p>
        <fieldset className="space-y-2">
          <legend className="text-xs font-extrabold text-[var(--kids-muted)]">{say('Ce qui a été vu en classe', 'ما دُرس في القسم')}</legend>
          <div className="flex flex-wrap gap-2">
            {SCOPES.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={scope === value}
                data-diagnostic-scope={value}
                onClick={() => setScope(value)}
                className={`hit-target rounded-2xl px-4 text-sm font-extrabold cursor-pointer border-2 ${scope === value ? 'bg-[var(--brand-emerald)] text-white border-[var(--brand-emerald)]' : 'bg-white text-[var(--kids-ink)] border-[#E7E2D7]'}`}
              >
                {scopeLabel(value)}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="text-xs font-bold text-[var(--kids-muted)]">
          {say(
            `${questions.length} questions, environ ${estimatedMinutes(questions.length)} minutes. Laissez l’enfant répondre sans aide : le bilan sera plus juste.`,
            `${questions.length} سؤالاً، حوالي ${estimatedMinutes(questions.length)} دقيقة. اتركوا الطفل يجيب دون مساعدة لتكون الحصيلة أصدق.`,
          )}
        </p>
        <button type="button" data-diagnostic-start onClick={start} className="hit-target w-full rounded-2xl px-4 bg-[var(--brand-emerald)] text-white text-base font-extrabold cursor-pointer">
          {result ? say('Refaire le diagnostic', 'إعادة التشخيص') : say('Commencer', 'ابدأ')}
        </button>
        {result && (
          <button type="button" data-diagnostic-last onClick={() => setPhase('report')} className="hit-target w-full rounded-2xl px-4 bg-white border-2 border-[#E7E2D7] text-[var(--kids-ink)] text-sm font-extrabold cursor-pointer">
            {say(`Voir le bilan du ${result.at.slice(0, 10)}`, `عرض حصيلة ${result.at.slice(0, 10)}`)}
          </button>
        )}
      </>
    ));
  }

  if (phase === 'quiz') {
    const question = questions[index];
    return shell(title, (
      <>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-extrabold text-[var(--kids-muted)]" aria-live="polite">
            {say(`Question ${index + 1} sur ${questions.length}`, `السؤال ${index + 1} من ${questions.length}`)}
          </p>
          <progress className="w-32 h-2" value={index} max={questions.length} aria-hidden="true" />
        </div>
        <div className="flex items-start gap-3">
          <p dir="rtl" lang="ar" data-diagnostic-question={question.id} className="flex-1 text-lg font-extrabold text-[var(--kids-ink)] leading-loose">
            {formatEducationalText(question.questionAr)}
          </p>
          <button
            type="button"
            onClick={() => { void speakText(question.questionAr, 'ar-SA'); }}
            aria-label={say('Écouter la question', 'استمع إلى السؤال')}
            className="hit-target shrink-0 rounded-2xl px-3 bg-white border-2 border-[#E7E2D7] text-[var(--kids-grass-2)] cursor-pointer"
          >
            <Volume2 className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              dir="rtl"
              lang="ar"
              data-diagnostic-option={option.id}
              onClick={() => answer(option.id)}
              className="min-h-[64px] rounded-2xl px-4 py-3 bg-white border-2 border-[#E7E2D7] text-[var(--kids-ink)] text-lg font-extrabold cursor-pointer shadow-[0_4px_0_#E7E2D7] active:translate-y-[2px] active:shadow-[0_2px_0_#E7E2D7]"
            >
              {formatEducationalText(option.textAr)}
            </button>
          ))}
        </div>
        <button type="button" data-diagnostic-skip onClick={() => answer(SKIPPED)} className="hit-target w-full rounded-2xl px-4 bg-[#FFF8E7] border-2 border-[#E7E2D7] text-[var(--kids-ink)] text-sm font-extrabold cursor-pointer">
          {say('Je n’ai pas encore appris cela', 'لم أدرس هذا بعد')}
        </button>
      </>
    ));
  }

  if (phase === 'handover' || !result) {
    return shell(title, (
      <>
        <p className="text-xl font-extrabold text-[var(--kids-ink)] text-center leading-relaxed" aria-live="polite">
          {say(`Bravo ${userProfile.name}, tu as terminé ! 🌟`, `أحسنت يا ${userProfile.name}، لقد أنهيت! 🌟`)}
        </p>
        <p className="text-sm font-bold text-[var(--kids-muted)] text-center">
          {say('Donne maintenant le téléphone à ton parent.', 'أعطِ الهاتف الآن لوليّك.')}
        </p>
        <button type="button" data-diagnostic-open-report onClick={() => setPhase('report')} className="hit-target w-full rounded-2xl px-4 bg-[var(--brand-emerald)] text-white text-base font-extrabold cursor-pointer">
          {say('Voir le bilan (parent)', 'عرض الحصيلة (للولي)')}
        </button>
      </>
    ));
  }

  const label = (row: DiagnosticRow) => (fr ? row.labelFr : row.labelAr);
  const priorities = result.priorities
    .map((id) => result.rows.find((row) => row.competenceId === id))
    .filter((row): row is DiagnosticRow => Boolean(row));
  const secure = rowsByStatus(result, 'secure');
  const fragile = rowsByStatus(result, 'fragile');
  const review = rowsByStatus(result, 'review');
  const unseen = rowsByStatus(result, 'unseen');
  const needsParentEmail = Boolean(authUser) && authUser?.parentEmailSet === false && emailState !== 'saved';
  const premium = canAccess('parentNotebookDetail', authUser?.role);

  const group = (heading: string, rows: DiagnosticRow[], tone: string, withScore = true) => rows.length > 0 && (
    <section className="space-y-1">
      <h3 className="text-sm font-extrabold" style={{ color: tone }}>{heading}</h3>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li key={row.competenceId} className="text-sm font-bold text-[var(--kids-ink)] leading-relaxed">
            {label(row)}{withScore ? ` (${row.correct}/${row.asked})` : ''}
          </li>
        ))}
      </ul>
    </section>
  );

  const saveEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setEmailState('error');
      return;
    }
    setEmailState('busy');
    try {
      const response = await springBootApi.updateParentEmail(value);
      if (response.error) throw new Error(response.error);
      const current = AuthService.getCurrentUser();
      if (current && authUser && current.id === authUser.id) AuthService.setCurrentUser({ ...current, parentEmailSet: true });
      setEmailState('saved');
    } catch {
      setEmailState('error');
    }
  };

  return shell(title, (
    <>
      <section data-diagnostic-score className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-1">
        <p className="text-xs font-extrabold text-[var(--kids-muted)]">{userProfile.name} · {result.grade} · {result.at.slice(0, 10)}</p>
        <p className="text-lg font-extrabold text-[var(--kids-ink)]">
          {say(`${result.correct} bonne(s) réponse(s) sur ${result.total}`, `${result.correct} إجابة صحيحة من ${result.total}`)}
        </p>
        <p className="text-xs font-bold text-[var(--kids-muted)] leading-relaxed">
          {say(
            'C’est une indication sur une ou deux questions par compétence, pas une note. Le carnet se précise à chaque leçon.',
            'هذا مؤشر مبني على سؤال أو سؤالين لكل كفاءة، وليس علامة. يتدقّق الدفتر مع كل درس.',
          )}
        </p>
      </section>

      {priorities.length > 0 ? (
        <section data-diagnostic-priorities className="rounded-3xl border-2 border-[var(--brand-amber)] bg-[#FFF8E7] p-4 space-y-3">
          <h3 className="text-sm font-extrabold text-[var(--kids-ink)]">{say('Par quoi commencer', 'بماذا نبدأ')}</h3>
          {priorities.map((row) => (
            <div key={row.competenceId} className="space-y-2">
              <p className="text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">{label(row)}</p>
              {row.misses.map((miss) => (
                <div key={miss.questionAr} dir="rtl" lang="ar" className="rounded-2xl bg-white border-2 border-[#E7E2D7] p-3 space-y-1">
                  <p className="text-sm font-bold text-[var(--kids-ink)] leading-loose">{formatEducationalText(miss.questionAr)}</p>
                  <p className="text-sm font-extrabold text-[var(--brand-emerald)] leading-loose">✓ {formatEducationalText(miss.correctAr)}</p>
                  <p className="text-xs font-bold text-[var(--kids-muted)] leading-loose">{formatEducationalText(miss.explanationAr)}</p>
                </div>
              ))}
              {row.lessonId && (
                <button type="button" data-diagnostic-review={row.competenceId} onClick={() => onReviewLesson(row.lessonId!)} className="hit-target rounded-2xl px-4 bg-white border-2 border-[var(--kids-grass-2)] text-[var(--kids-grass-2)] text-sm font-extrabold cursor-pointer">
                  {say('Revoir la leçon', 'راجع الدرس')}
                </button>
              )}
            </div>
          ))}
        </section>
      ) : (
        <p className="text-sm font-extrabold text-[var(--brand-emerald)] bg-white border-2 border-[#E7E2D7] rounded-2xl p-4">
          {say('Aucune difficulté repérée sur ces questions.', 'لم تظهر صعوبة في هذه الأسئلة.')}
        </p>
      )}

      {group(say('✅ Réussi', '✅ نجح في'), secure, '#0B6B4F')}
      {group(say('🟡 À consolider', '🟡 يحتاج إلى تثبيت'), fragile, '#8A5A00')}
      {group(say('🔁 À travailler', '🔁 للمراجعة'), review, '#8A5A00')}
      {group(say('⏳ Pas encore vu en classe', '⏳ لم يدرسه بعد في القسم'), unseen, '#475569', false)}

      <button
        type="button"
        data-diagnostic-share
        onClick={async () => {
          try {
            const outcome = await sharePlainText(formatDiagnosticText(result, userProfile.name, fr ? 'fr' : 'ar'));
            setShareState(outcome === 'cancelled' ? 'idle' : 'shared');
          } catch {
            setShareState('error');
          }
        }}
        className="hit-target w-full rounded-2xl px-4 bg-[#25D366] text-[#073B1F] text-sm font-extrabold cursor-pointer"
      >
        {shareState === 'shared' ? say('Bilan partagé ✓', 'تمت مشاركة الحصيلة ✓') : say('Partager le bilan (WhatsApp)', 'شارك الحصيلة (واتساب)')}
      </button>
      {shareState === 'error' && <p role="alert" className="text-sm font-bold text-[var(--kids-ink)]">{say('Partage impossible pour le moment.', 'تعذّرت المشاركة الآن.')}</p>}

      {needsParentEmail && (
        <form onSubmit={saveEmail} data-diagnostic-email className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-2">
          <label htmlFor="diagnostic-parent-email" className="block text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">
            {say('Recevoir chaque jeudi le bilan de la semaine par e-mail', 'استلام حصيلة الأسبوع كل خميس عبر البريد الإلكتروني')}
          </label>
          <input
            id="diagnostic-parent-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); if (emailState === 'error') setEmailState('idle'); }}
            placeholder="parent@example.com"
            className="hit-target w-full rounded-2xl px-4 border-2 border-[#E7E2D7] bg-white text-base font-bold text-[var(--kids-ink)]"
          />
          {emailState === 'error' && <p role="alert" className="text-sm font-bold text-[var(--kids-ink)]">{say('Vérifiez l’adresse, puis réessayez.', 'تحقّق من العنوان ثم أعد المحاولة.')}</p>}
          <button type="submit" disabled={emailState === 'busy'} className="hit-target w-full rounded-2xl px-4 bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer disabled:opacity-60">
            {say('Enregistrer mon e-mail', 'حفظ بريدي')}
          </button>
          <p className="text-xs font-bold text-[var(--kids-muted)]">{say('Un lien d’arrêt figure dans chaque message.', 'كل رسالة تحتوي على رابط لإيقافها.')}</p>
        </form>
      )}
      {emailState === 'saved' && <p role="status" className="text-sm font-extrabold text-[var(--brand-emerald)]">{say('E-mail enregistré ✓', 'تم حفظ البريد ✓')}</p>}

      {!premium && priorities.length > 0 && (
        <section className="rounded-2xl border-2 border-[#E7E2D7] p-4 space-y-3">
          <p className="text-sm font-bold text-[var(--kids-ink)] leading-relaxed">
            {say(
              'Le carnet détaillé suit ces compétences leçon après leçon et prépare le plan de révision avant la composition.',
              'الدفتر المفصّل يتابع هذه الكفاءات درساً بعد درس ويحضّر خطة المراجعة قبل الاختبار.',
            )}
          </p>
          <PremiumOffer grade={grade} />
        </section>
      )}
    </>
  ));
};
