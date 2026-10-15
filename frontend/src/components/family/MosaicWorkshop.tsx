import { formatProgressCount, isolateMathRuns } from '../../utils/textFormatter';
import React, { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import type { PrimaryGrade } from '../../types';
import { MOSAIC_TASKS, checkMosaic } from '../../data/family/mosaicWorkshop';
import type { FamilyResults, TaskOutcome } from '../../utils/familyLearning';
import { useActivityExitGuard } from '../../context/ActivityExitContext';
import { DidouGuide } from './AdventureStage';
export function MosaicWorkshop({ grade, fr, premium, results, onResult, onPending }: {
    grade: PrimaryGrade;
    fr: boolean;
    premium: boolean;
    results: FamilyResults;
    onResult: (id: string, outcome: TaskOutcome) => void;
    onPending: (active: boolean) => void;
}) {
    const say = (a: string, b: string) => fr ? a : b;
    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [checked, setChecked] = useState<boolean | null>(null);
    const [assisted, setAssisted] = useState(false);
    const [hint, setHint] = useState(false);
    const [finished, setFinished] = useState(false);
    const tasks = MOSAIC_TASKS[grade];
    const task = tasks[step];
    const pending = selected.length > 0 && checked !== true && !finished;
    useActivityExitGuard(pending, fr ? 'fr' : 'ar');
    React.useLayoutEffect(() => { onPending(pending); return () => onPending(false); }, [pending, onPending]);
    const successCount = tasks.filter(t => results[t.id]?.completedAt || ['independent', 'helped'].includes(results[t.id]?.outcome)).length;
    function check() {
        if (checked === true || finished)
            return;
        const correct = checkMosaic(task, selected);
        setChecked(correct);
        onResult(task.id, correct ? (assisted ? 'helped' : 'independent') : 'review');
        if (!correct)
            setAssisted(true);
    }
    function reset(next = 0) { setStep(next); setSelected([]); setChecked(null); setAssisted(false); setHint(false); setFinished(false); }
    return <article className="adventure studio-stage mosaic-workshop" data-adventure="mosaic" dir={fr ? 'ltr' : 'rtl'}>
    <header className="adventure-heading"><div><span className="adventure-eyebrow">{grade} · {say('MANIPULER POUR COMPRENDRE', 'أفهم بالمناولة')}</span><h4>{say('Les mosaïques de Didou', 'فسيفساء ديدو')}</h4><p>{say('De la quantité aux fractions : construis, vérifie, explique.', 'من الكمية إلى الكسور: أبني وأتحقّق وأشرح.')}</p></div><span className="adventure-stamp"><Check size={16} aria-hidden/>{formatProgressCount(successCount, 3)}</span></header>
    <ol className="adventure-path" aria-label={say('Étapes des mosaïques', 'مراحل الفسيفساء')}>{tasks.map((t, i) => <li key={t.id} aria-current={step === i ? 'step' : undefined} data-complete={Boolean(results[t.id]?.completedAt)}><span>{i + 1}</span><small>{say('Défi ', 'التحدي ')}{i + 1}</small></li>)}</ol>
    <div className="adventure-scene mosaic-panorama"><svg viewBox="0 0 640 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="640" height="260" fill="#e1ece2"/><circle cx="550" cy="46" r="27" fill="#efd18b"/><path d="M0 159Q130 101 257 162T640 145V260H0Z" fill="#b5c8a0"/><path d="M0 206Q300 160 640 195V260H0Z" fill="#e9d8b1"/><path d="M42 181V79Q84 34 126 79V181M144 180V64Q184 26 224 64V180" fill="#f7ecd1" stroke="#c4aa7c" strokeWidth="3"/><path d="M65 181V106Q85 82 105 106V181M165 180V103Q183 83 202 103V180" fill="#729c85"/><rect x="255" y="147" width="260" height="20" rx="5" fill="#b07a52"/><path d="M275 167V224M494 167V224" stroke="#815b40" strokeWidth="12"/>{[0, 1, 2, 3, 4, 5].map(i => <g key={i} transform={'translate(' + (275 + i * 36) + ' 108)'}><rect width="29" height="29" rx="3" fill={i % 2 ? '#d9ac63' : '#397b68'}/><path d="M14 5L24 14L14 24L5 14Z" fill="#f4e8c7"/></g>)}<path d="M552 168H610L600 210H562Z" fill="#bc8059"/><path d="M580 169V122M580 145Q550 136 558 119M580 131Q608 115 611 130" stroke="#56845a" strokeWidth="8" fill="none" strokeLinecap="round"/>{[0, 1, 2, 3].flatMap(y => [0, 1, 2, 3, 4].map(x => <rect key={x + ':' + y} x={36 + x * 25 + y * 4} y={197 + y * 13} width="23" height="11" rx="2" fill={(x + y) % 2 ? '#c3a269' : '#6d9a85'}/>))}</svg><span className="adventure-scene-note">{say('La cour des artisans', 'ساحة الحرفيين')}<strong>{say('Chaque carreau compte', 'كل بلاطة لها قيمة')}</strong></span></div>
    <div className="adventure-workspace">
      <DidouGuide fr={fr} success={checked === true} text={fr ? task.prompt.fr : task.prompt.ar}/>
      <p className="mosaic-instructions">{say('Touche une case pour poser ou retirer un carreau. Toutes les cases ont la même taille.', 'المس الخانة لوضع بلاطة أو حذفها. كل الخانات بالحجم نفسه.')}</p>
      <div className="mosaic-board" style={{ gridTemplateColumns: 'repeat(' + task.columns + ', minmax(0, 1fr))' }} role="group" aria-label={say('Mosaïque à construire', 'فسيفساء للبناء')} dir="ltr">
        {Array.from({ length: task.rows * task.columns }, (_, i) => <button type="button" key={i} aria-pressed={selected.includes(i)} disabled={checked === true || finished} aria-label={say('Rangée ', 'الصف ') + (Math.floor(i / task.columns) + 1) + say(', case ', '، الخانة ') + (i % task.columns + 1)} onClick={() => { setSelected(cells => cells.includes(i) ? cells.filter(c => c !== i) : [...cells, i]); setChecked(null); }}><svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 5L39 21L55 30L39 39L30 55L21 39L5 30L21 21Z" fill="currentColor"/><circle cx="30" cy="30" r="6" fill="#f9edcf"/></svg></button>)}
      </div>
      <p className="mosaic-count" aria-live="polite">{formatProgressCount(selected.length, task.rows * task.columns)} {say('cases colorées', 'خانات ملوّنة')}</p>
      {!finished && checked !== true && <div className="adventure-actions"><button type="button" className="studio-action" onClick={check}>{say('Vérifier ma mosaïque', 'أتحقّق من الفسيفساء')}</button><button type="button" className="studio-outline" aria-expanded={hint} onClick={() => { setHint(true); setAssisted(true); }}>{say('Un indice', 'مساعدة')}</button></div>}
      {hint && <p className="adventure-hint">{isolateMathRuns(fr ? task.hint.fr : task.hint.ar)}</p>}
      {checked !== null && <div role="status" className="studio-feedback" data-retry={!checked}>{checked ? <><strong>{say('Ta mosaïque respecte la consigne !', 'فسيفساؤك توافق التعليمة!')}</strong><p dir={fr ? 'ltr' : 'rtl'}>{isolateMathRuns(fr ? task.explanation.fr : task.explanation.ar)}</p><p>{say('Explique ta méthode à un proche avant de continuer.', 'اشرح طريقتك لقريب قبل المتابعة.')}</p></> : <><strong>{say('Regarde encore la quantité et la disposition.', 'راجع العدد وترتيب البلاطات.')}</strong><p>{isolateMathRuns(fr ? task.hint.fr : task.hint.ar)}</p></>}</div>}
      {checked === true && !finished && <button type="button" className="studio-action" onClick={() => step === 2 || !premium ? setFinished(true) : reset(step + 1)}>{say('Continuer les mosaïques', 'أتابع الفسيفساء')}</button>}
      {finished && <div className="adventure-finish"><Check aria-hidden/><p>{premium ? say('Parcours terminé. Sur une feuille quadrillée, invente une autre mosaïque et explique sa quantité ou sa fraction.', 'انتهى المسار. على ورقة مربّعة، ابتكر فسيفساء أخرى واشرح كميتها أو كسرها.') : say('Découverte terminée. Les deux défis suivants font partie de Premium. Tu peux rejouer librement ce premier défi.', 'انتهى الاكتشاف. التحديان التاليان ضمن Premium. يمكنك إعادة التحدي الأول مجاناً.')}</p></div>}
      <button type="button" className="studio-outline" onClick={() => reset(finished ? 0 : step)}><RotateCcw size={16} aria-hidden/>{say('Recommencer ce défi', 'أعيد التحدي')}</button>
      <details className="mosaic-parent"><summary>{say('Observations des mosaïques pour le parent', 'ملاحظات الفسيفساء للوالد')}</summary><p>{say('Derniers essais enregistrés sur cet appareil. Une réussite en jeu reste à confirmer dans une autre situation.', 'آخر المحاولات محفوظة على هذا الجهاز. نؤكّد النجاح في وضعية أخرى.')}</p><ul>{tasks.map((t, i) => <li key={t.id}><span>{say('Défi ', 'التحدي ')}{i + 1}</span><strong>{results[t.id]?.outcome === 'independent' ? say('Réussi seul', 'نجح وحده') : results[t.id]?.outcome === 'helped' ? say('Avec aide', 'بمساعدة') : results[t.id]?.outcome === 'review' ? say('À reprendre', 'للمراجعة') : say('Pas encore essayé', 'لم يُجرّب بعد')}</strong></li>)}</ul></details>
    </div>
  </article>;
}
