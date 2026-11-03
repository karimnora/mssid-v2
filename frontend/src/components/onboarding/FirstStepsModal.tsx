import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PrimaryGrade } from '../../types';
import type { AuthUser } from '../../types/auth';
import { useLocaleContext } from '../../context/LocaleContext';
import { springBootApi } from '../../services/springBootApi';
import { AuthService } from '../../services/authService';
import { algeriaDay } from '../../utils/musaidiQuota';
import { speakText, stopSpeech } from '../../utils/speech';

/**
 * « خطوتان للبدء » — V2 activation plan (ANVREDET annex 07): right after sign-in, ask the grade (only
 * if it was never chosen) and the parent e-mail (only if missing), then send the child straight into
 * a first lesson. Google sign-ups never see the register form, so this is where they give it.
 */
const STORAGE = 'mssid_first_steps_v1';
const GRADES: { id: PrimaryGrade; emoji: string; ar: string; fr: string }[] = [
  { id: '1AP', emoji: '🌱', ar: 'السنة الأولى', fr: '1re année' },
  { id: '2AP', emoji: '🌿', ar: 'السنة الثانية', fr: '2e année' },
  { id: '3AP', emoji: '🌳', ar: 'السنة الثالثة', fr: '3e année' },
  { id: '4AP', emoji: '🚀', ar: 'السنة الرابعة', fr: '4e année' },
  { id: '5AP', emoji: '🏆', ar: 'السنة الخامسة', fr: '5e année' },
];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Memory { gradeDone?: boolean; parentLater?: string }
const keyFor = (userId: number) => `${STORAGE}:user:${userId}`;
export function readFirstSteps(userId: number): Memory {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(keyFor(userId)) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}
function writeFirstSteps(userId: number, memory: Memory) {
  try {
    window.localStorage.setItem(keyFor(userId), JSON.stringify(memory));
  } catch {
    /* ignore */
  }
}

/** Which steps this account still needs. Unknown server state (undefined) never triggers a step. */
export function pendingFirstSteps(user: AuthUser | null, childActive: boolean, now: Date = new Date()) {
  if (!user || !user.id) return { grade: false, parent: false };
  const memory = readFirstSteps(user.id);
  return {
    grade: user.gradeSet === false && !memory.gradeDone && !childActive,
    parent: user.parentEmailSet === false && memory.parentLater !== algeriaDay(now),
  };
}

export interface FirstStepsModalProps {
  user: AuthUser;
  needGrade: boolean;
  needParent: boolean;
  /** Applies the chosen grade to navigation and to the account (progress sync). */
  onChooseGrade: (grade: PrimaryGrade) => void;
  /** journey=true: open the Kawkab Didou map (1AP), otherwise go to the courses. */
  onDone: (opts: { journey: boolean; grade: PrimaryGrade | null }) => void;
  journeyAvailable: boolean;
}

type Step = 'grade' | 'parent' | 'go';

export function FirstStepsModal({ user, needGrade, needParent, onChooseGrade, onDone, journeyAvailable }: FirstStepsModalProps) {
  const { locale, direction } = useLocaleContext();
  const fr = locale === 'fr';
  const say = (a: string, b: string) => (fr ? a : b);
  const [step, setStep] = useState<Step>(needGrade ? 'grade' : needParent ? 'parent' : 'go');
  const [grade, setGrade] = useState<PrimaryGrade | null>(null);
  const [email, setEmail] = useState('');
  const [mine, setMine] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialog.current?.focus();
  }, [step]);
  useEffect(() => {
    if (step !== 'grade') return;
    void speakText('اختر قسمك في المدرسة', 'ar-SA').catch(() => {});
    return () => stopSpeech();
  }, [step]);

  const chooseGrade = (g: PrimaryGrade) => {
    setGrade(g);
    onChooseGrade(g);
    writeFirstSteps(user.id, { ...readFirstSteps(user.id), gradeDone: true });
    setStep(needParent ? 'parent' : 'go');
  };

  const later = () => {
    writeFirstSteps(user.id, { ...readFirstSteps(user.id), parentLater: algeriaDay() });
    setStep('go');
  };

  const saveParent = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = (mine ? user.email : email).trim();
    if (!EMAIL.test(value)) {
      setError(say('Vérifiez l’adresse e-mail.', 'تحقّق من البريد الإلكتروني.'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await springBootApi.updateParentEmail(value);
      if (res.error) throw new Error(res.error);
      const current = AuthService.getCurrentUser();
      if (current && current.id === user.id) AuthService.setCurrentUser({ ...current, parentEmailSet: true });
      setStep('go');
    } catch {
      setError(say('Enregistrement impossible pour le moment. Réessayez ou choisissez « Plus tard ».', 'تعذّر الحفظ الآن. أعد المحاولة أو اختر «لاحقاً».'));
    } finally {
      setBusy(false);
    }
  };

  const finalGrade = grade ?? (user.grade as PrimaryGrade | undefined) ?? null;
  const journey = journeyAvailable && finalGrade === '1AP';
  const total = (needGrade ? 1 : 0) + (needParent ? 1 : 0);
  const index = step === 'grade' ? 1 : step === 'parent' ? (needGrade ? 2 : 1) : total;

  return createPortal(
    <div className="fixed inset-0 z-[70] bg-slate-950/70 p-3 sm:p-6 flex items-center justify-center overflow-auto">
      <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="first-steps-title" dir={direction} data-first-steps className="bg-[#FFFBF2] text-slate-900 rounded-3xl p-5 sm:p-7 w-full max-w-lg space-y-5 shadow-xl outline-none">
        {step !== 'go' && total > 1 && (
          <p className="text-sm font-bold text-emerald-800">{say(`Étape ${index} sur ${total}`, `الخطوة ${index} من ${total}`)}</p>
        )}

        {step === 'grade' && (
          <>
            <h2 id="first-steps-title" className="text-2xl font-black">{say('En quelle année es-tu ?', 'في أي قسم تدرس؟')}</h2>
            <div className="grid grid-cols-1 gap-3">
              {GRADES.map((g) => (
                <button key={g.id} type="button" onClick={() => chooseGrade(g.id)} className="min-h-[64px] rounded-2xl border-2 border-emerald-200 bg-white px-4 text-lg font-extrabold flex items-center gap-3 hover:border-emerald-500 shadow-[0_4px_0_#d1fae5] active:translate-y-0.5">
                  <span aria-hidden className="text-3xl">{g.emoji}</span>
                  <span>{fr ? g.fr : g.ar}</span>
                  <span className="ms-auto text-sm text-slate-500" dir="ltr">{g.id}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'parent' && (
          <form onSubmit={saveParent} className="space-y-4" noValidate>
            <h2 id="first-steps-title" className="text-2xl font-black">{say('Pour le parent', 'إلى ولي الأمر')}</h2>
            <p>{say('Recevez chaque semaine le bilan de votre enfant : leçons réussies, points à revoir, conseil de révision.', 'استلم كل أسبوع حصيلة طفلك: الدروس المكتسبة، ما يحتاج مراجعة، ونصيحة للمراجعة.')}</p>
            <label className="flex items-center gap-3 min-h-12 rounded-xl bg-white border border-slate-200 px-3">
              <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} className="h-5 w-5" />
              <span>{say('Ce compte est déjà mon e-mail de parent', 'هذا البريد هو بريدي أنا (ولي الأمر)')} <span dir="ltr" className="text-sm text-slate-500">{user.email}</span></span>
            </label>
            {!mine && (
              <label className="block font-bold">
                {say('E-mail du parent', 'بريد ولي الأمر')}
                <input type="email" dir="ltr" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full min-h-12 rounded-xl border border-emerald-300 bg-white px-3 mt-1" />
              </label>
            )}
            {error && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={busy} className="min-h-12 px-5 rounded-xl bg-emerald-800 text-white font-bold disabled:opacity-60">{busy ? say('Enregistrement…', 'جارٍ الحفظ…') : say('Recevoir le bilan', 'أريد الحصيلة')}</button>
              <button type="button" onClick={later} className="min-h-12 px-5 rounded-xl border border-slate-300 font-bold">{say('Plus tard', 'لاحقاً')}</button>
            </div>
            <p className="text-xs text-slate-500">{say('Aucune publicité. L’adresse sert uniquement au bilan et aux messages sur le compte.', 'دون إشهار. يُستعمل البريد للحصيلة ورسائل الحساب فقط.')}</p>
          </form>
        )}

        {step === 'go' && (
          <>
            <h2 id="first-steps-title" className="text-2xl font-black">{say('Tout est prêt !', 'كل شيء جاهز!')}</h2>
            <p>{journey ? say('Didou t’attend pour la première étape de son voyage.', 'ديدو ينتظرك في أول محطة من رحلته.') : say('Ta première leçon t’attend.', 'درسك الأول في انتظارك.')}</p>
            <button type="button" onClick={() => onDone({ journey, grade: finalGrade })} className="w-full min-h-[64px] rounded-2xl bg-emerald-700 text-white text-xl font-black shadow-[0_5px_0_#065f46] active:translate-y-0.5">
              {journey ? say('Partir avec Didou', 'انطلق مع ديدو') : say('Commencer', 'ابدأ التعلّم')}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
