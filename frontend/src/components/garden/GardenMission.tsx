import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, LockKeyhole, Minus, RotateCcw, Volume2 } from 'lucide-react';
import { GARDEN_PLANS, GARDEN_SESSIONS, gardenCellsCorrect, type GardenBand, type GardenTask } from '../../data/garden/gardenMission';
import type { PreschoolLanguage } from '../../data/preschool/types';
import { normalizeFamilyAnswer, type FamilyResults, type TaskOutcome } from '../../utils/familyLearning';
import { formatProgressCount, isolateMathRuns } from '../../utils/textFormatter';
import { useActivityExit, useActivityExitGuard } from '../../context/ActivityExitContext';
import { DidouGuide } from '../family/AdventureStage';
import { ParentGateButton } from '../preschool/PreschoolParentBilan';
import { speakText, stopSpeech } from '../../utils/speech';
import { GardenObject, GardenScene } from './GardenArt';
import './gardenMission.css';
type Props = {
    band: GardenBand;
    language: PreschoolLanguage;
    premium: boolean;
    results: FamilyResults;
    onResult: (id: string, outcome: TaskOutcome) => void;
    onPending?: (pending: boolean) => void;
    onExit?: () => void;
};
const voice = { fr: 'fr-FR', ar: 'ar-SA', en: 'en-US' } as const;
const completed = (result: FamilyResults[string] | undefined) => Boolean(result?.completedAt) || result?.outcome === 'independent' || result?.outcome === 'helped';
export function GardenMission({ band, language, premium, results, onResult, onPending, onExit }: Props) {
    const plan = GARDEN_PLANS[band];
    const t = (fr: string, ar: string, en: string) => language === 'fr' ? fr : language === 'ar' ? ar : en;
    const initial = plan.tasks.findIndex(task => !completed(results[task.id]));
    const [step, setStep] = useState(() => initial < 0 ? 5 : !premium && initial > 1 ? 1 : initial);
    const [view, setView] = useState<'play' | 'pause' | 'summary'>(() => initial < 0 ? 'summary' : 'play');
    const [status, setStatus] = useState<TaskOutcome | null>(null);
    const [hint, setHint] = useState(false);
    const [pending, setPending] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const assisted = useRef(false);
    const locked = useRef(false);
    const heading = useRef<HTMLHeadingElement>(null);
    const exit = useActivityExit();
    const task = plan.tasks[step];
    const session = Math.floor(step / 2);
    const count = plan.tasks.filter(task => completed(results[task.id])).length;
    useActivityExitGuard(pending, language);
    useEffect(() => () => { onPending?.(false); stopSpeech(); }, [onPending]);
    useEffect(() => { heading.current?.focus(); return () => stopSpeech(); }, [step, view]);
    const markWork = () => { setPending(true); onPending?.(true); };
    const release = () => { setPending(false); onPending?.(false); };
    const observe = (outcome: TaskOutcome) => { if (locked.current)
        return; locked.current = true; onResult(task.id, outcome); release(); setView('summary'); };
    const record = (correct: boolean) => { if (locked.current)
        return; const outcome = correct ? (assisted.current ? 'helped' : 'independent') : 'review'; if (!correct)
        assisted.current = true;
    else {
        locked.current = true;
        release();
    } setStatus(outcome); onResult(task.id, outcome); };
    function open(next: number) { stopSpeech(); release(); setStep(next); setView('play'); setStatus(null); setHint(false); assisted.current = false; locked.current = false; setAttempt(a => a + 1); }
    function navigate(action: () => void) { if (pending)
        exit.requestLeave(action);
    else
        action(); }
    const canOpen = (s: number) => s === 0 || premium && plan.tasks.slice(0, s * 2).every(task => completed(results[task.id]));
    const successful = status === 'independent' || status === 'helped';
    return <section className="premium-adventures garden-mission" data-garden-mission={band} dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}>
  <header className="garden-top"><div>{onExit && <button type="button" className="garden-quiet" onClick={() => navigate(onExit)}><ArrowLeft size={18} aria-hidden/>{t('Retour', 'رجوع', 'Back')}</button>}<span className="garden-kicker">{band === 'preschool' ? t('ÉVEIL', 'التحضيري', 'EARLY YEARS') : band} · {t('UNE AVENTURE EN 3 SÉANCES', 'مغامرة في ثلاث جلسات', 'AN ADVENTURE IN 3 SESSIONS')}</span><h3 tabIndex={-1} ref={heading}>{t('La mission du jardin de Didou', 'مهمة حديقة ديدو', 'Didou’s garden mission')}</h3></div><span className="garden-progress" aria-label={t('Défis réussis', 'تحديات ناجحة', 'Successful challenges')}>{formatProgressCount(count, 6)}<Check size={16} aria-hidden/></span></header>
  <p className="garden-intro">{plan.intro[language]}</p>
  <ol className="garden-sessions" aria-label={t('Séances du jardin', 'جلسات الحديقة', 'Garden sessions')}>{GARDEN_SESSIONS.map((label, i) => <li key={i}><button type="button" disabled={!canOpen(i)} aria-current={session === i ? 'step' : undefined} onClick={() => { if (i === session && view === 'play')
        return; navigate(() => open(i * 2)); }}><span>{canOpen(i) ? i + 1 : <LockKeyhole size={17} aria-hidden/>}</span><strong>{label[language]}</strong><small>{!premium && i > 0 ? 'Premium' : t('2 défis', 'تحديان', '2 challenges')}</small></button></li>)}</ol>
  <article className="garden-stage"><GardenScene phase={view === 'summary' ? 5 : step}/>
  {view === 'play' ? <div className="garden-workspace"><p className="garden-kicker">{GARDEN_SESSIONS[session][language]} · {formatProgressCount(step % 2 + 1, 2)}</p><h4>{task.title[language]}</h4>
   <DidouGuide fr={language === 'fr'} uiLanguage={language} lang={voice[language]} text={task.prompt[language]} success={successful}/>
   <GardenChallenge key={task.id + ':' + attempt} task={task} language={language} young={band === 'preschool'} solved={successful} onWork={markWork} onCheck={record} onObserve={observe}/>
   {task.kind !== 'observe' && !successful && <button type="button" className="garden-quiet" aria-expanded={hint} onClick={() => { setHint(true); assisted.current = true; }}>{t('Un indice', 'مساعدة', 'A hint')}</button>}
   {hint && <p className="garden-hint">{isolateMathRuns(task.hint[language])}</p>}
   {status && task.kind !== 'observe' && <div className="garden-feedback" role="status" data-retry={!successful}><strong>{successful ? t('Tu as trouvé !', 'وجدت الحل!', 'You found it!') : t('Essaie encore, tu peux modifier ton travail.', 'حاول مجدداً، يمكنك تعديل عملك.', 'Try again. You can change your work.')}</strong><p>{isolateMathRuns((successful ? task.explain : task.hint)[language])}</p>{successful && <p>{t('Raconte comment tu as fait.', 'احكِ كيف فعلت ذلك.', 'Explain how you did it.')}</p>}</div>}
   {successful && <button type="button" className="garden-primary" onClick={() => { if (step % 2 === 1)
            setView('pause');
        else
            open(step + 1); }}>{step % 2 === 1 ? t('Terminer cette séance', 'أنهي هذه الجلسة', 'Finish this session') : t('Continuer la mission', 'أتابع المهمة', 'Continue the mission')}</button>}
   <button type="button" className="garden-quiet" onClick={() => navigate(() => open(step))}><RotateCcw size={16} aria-hidden/>{t('Recommencer ce défi', 'أعيد التحدي', 'Restart this challenge')}</button>
  </div> : view === 'pause' ? <div className="garden-workspace garden-pause"><Check size={32} aria-hidden/><h4>{t('Une étape du jardin est prête.', 'اكتملت مرحلة من الحديقة.', 'One part of the garden is ready.')}</h4><p>{t('Tu peux faire une pause. Tes réussites sont gardées dans ton carnet sur cet appareil.', 'يمكنك أخذ استراحة. نجاحاتك محفوظة في دفترك على هذا الجهاز.', 'You can take a break. Your successes are kept in your notebook on this device.')}</p>{premium && session < 2 ? <button type="button" className="garden-primary" onClick={() => open(step + 1)}>{t('Ouvrir la séance suivante', 'أفتح الجلسة التالية', 'Open the next session')}</button> : <><p>{t('La séance découverte est terminée et reste rejouable. Les deux autres séances font partie de Premium.', 'انتهت جلسة الاكتشاف ويمكن إعادتها. الجلستان الأخريان ضمن Premium.', 'The discovery session is complete and can be replayed. The other two sessions are part of Premium.')}</p><button type="button" className="garden-primary" onClick={() => open(0)}>{t('Rejouer la découverte', 'أعيد الاكتشاف', 'Replay discovery')}</button></>}<button type="button" className="garden-quiet" onClick={() => setView('summary')}>{t('Voir mon carnet', 'أرى دفتري', 'View my notebook')}</button></div> : <div className="garden-workspace"><h4>{t('Le carnet du jardin', 'دفتر الحديقة', 'The garden notebook')}</h4><p>{t('L’aventure a été explorée. Voici les derniers essais ; une réussite en jeu ne suffit pas à prouver un apprentissage durable.', 'استكشفت المغامرة. هذه آخر المحاولات؛ النجاح في اللعبة لا يكفي لإثبات تعلّم دائم.', 'You explored the adventure. These are the latest attempts; a success in the game does not prove lasting learning.')}</p><GardenReport tasks={plan.tasks} results={results} language={language} onReplay={n => { if (canOpen(Math.floor(n / 2)))
            open(n); }} premium={premium}/></div>}
  </article>
  {view !== 'summary' && <details className="garden-parent"><summary>{t('Repères pour le parent', 'ملاحظات للوالد', 'Notes for the grown-up')}</summary><GardenReport tasks={plan.tasks} results={results} language={language}/><p>{t('Les réponses automatiques et l’observation d’un adulte sont distinguées. Le carnet reste local à cet appareil.', 'نميّز الإجابات الآلية عن ملاحظة شخص بالغ. يبقى الدفتر محلياً على هذا الجهاز.', 'Game answers and a grown-up’s observation are distinguished. The notebook stays on this device.')}</p></details>}
  <p className="garden-footnote">{t('Les étapes illustrent une histoire sur plusieurs jours. Les plantes ne poussent pas instantanément ; les quantités du jeu ne sont pas des conseils d’arrosage.', 'تمثل المراحل قصة تمتد أياماً. لا تنمو النباتات فوراً، وكميات اللعبة ليست نصائح للسقي.', 'The scenes tell a story over several days. Plants do not grow instantly; game quantities are not watering advice.')}</p>
 </section>;
}
function GardenChallenge({ task, language, young, solved, onWork, onCheck, onObserve }: {
    task: GardenTask;
    language: PreschoolLanguage;
    young: boolean;
    solved: boolean;
    onWork: () => void;
    onCheck: (correct: boolean) => void;
    onObserve: (outcome: TaskOutcome) => void;
}) {
    const [cells, setCells] = useState<number[]>([]);
    const [amounts, setAmounts] = useState<number[]>(() => task.kind === 'water' || task.kind === 'share' ? task.targets.map(() => 0) : []);
    const [answer, setAnswer] = useState('');
    const [choice, setChoice] = useState('');
    const [parent, setParent] = useState(false);
    const t = (fr: string, ar: string, en: string) => language === 'fr' ? fr : language === 'ar' ? ar : en;
    const checkLabel = t('Vérifier mon défi', 'أتحقّق من التحدي', 'Check my challenge');
    const mark = () => { if (!solved)
        onWork(); };
    if (task.kind === 'observe')
        return <div className="garden-observe" data-garden-observe><p>{task.action[language]}</p><p>{t('Un adulte observe l’explication et le geste, sans juger la beauté du dessin.', 'يلاحظ شخص بالغ الشرح والحركة دون تقييم جمال الرسم.', 'A grown-up observes the explanation and action, not the beauty of the drawing.')}</p>{parent ? <fieldset><legend>{t('Observation de l’adulte', 'ملاحظة الشخص البالغ', 'Grown-up’s observation')}</legend>{(['independent', 'helped', 'review'] as const).map(o => <button key={o} type="button" className="garden-secondary" onClick={() => onObserve(o)}>{o === 'independent' ? t('Réussi sans aide', 'نجح دون مساعدة', 'Succeeded without help') : o === 'helped' ? t('Réussi avec aide', 'نجح بمساعدة', 'Succeeded with help') : t('À reprendre ensemble', 'نعيده معاً', 'Try again together')}</button>)}</fieldset> : <ParentGateButton language={language} onUnlock={() => setParent(true)}/>}<button type="button" className="garden-quiet" onClick={() => onObserve('review')}>{t('Faire l’observation plus tard', 'نؤجّل الملاحظة', 'Observe later')}</button></div>;
    if (task.kind === 'sow')
        return <><p className="garden-instruction">{t('Touche pour planter ; retouche pour retirer.', 'المس للزرع والمس مجدداً للحذف.', 'Touch to plant; touch again to remove.')}</p><div className="garden-seed-grid" style={{ gridTemplateColumns: 'repeat(' + task.columns + ',minmax(0,1fr))' }} role="group" aria-label={t('Emplacements du potager', 'خانات الحوض', 'Garden spaces')} dir="ltr">{Array.from({ length: task.rows * task.columns }, (_, i) => <button type="button" key={i} aria-label={t('Emplacement ', 'الخانة ', 'Space ') + (i + 1)} aria-pressed={cells.includes(i)} disabled={solved} onClick={() => { mark(); setCells(c => c.includes(i) ? c.filter(n => n !== i) : [...c, i]); }}>{cells.includes(i) ? <GardenObject kind="seed" size={34}/> : <span aria-hidden>+</span>}</button>)}</div><p className="garden-counter" aria-live="polite">{formatProgressCount(cells.length, task.rows * task.columns)}</p>{!solved && <button type="button" className="garden-primary" onClick={() => { mark(); onCheck(gardenCellsCorrect(task, cells)); }}>{checkLabel}</button>}</>;
    if (task.kind === 'number')
        return <><div className="garden-number-scene" aria-hidden="true"><GardenObject kind="seed"/><GardenObject kind="basket"/></div>{young ? <div className="garden-number-choices" role="group" aria-label={t('Choisir un nombre', 'أختار عدداً', 'Choose a number')}>{[2, 3, 4, 5].map(n => <button type="button" key={n} disabled={solved} className="garden-secondary" aria-pressed={answer === String(n)} onClick={() => { mark(); setAnswer(String(n)); onCheck(String(n) === task.accepted); }}>{n}</button>)}</div> : <label className="garden-answer">{t('Ma réponse, nombre seul', 'إجابتي بالعدد فقط', 'My answer, number only')}<input inputMode="decimal" autoComplete="off" value={answer} disabled={solved} onChange={e => { mark(); setAnswer(e.target.value); }}/><small>{task.unit[language]}</small></label>}{!solved && !young && <button type="button" className="garden-primary" disabled={!answer.trim()} onClick={() => onCheck(normalizeFamilyAnswer(answer) === task.accepted)}>{checkLabel}</button>}</>;
    if (task.kind === 'read')
        return <><div className="garden-reading"><p>{task.passage[language]}</p><button type="button" className="garden-quiet" onClick={() => { void speakText(task.passage[language], voice[language]).catch(() => { }); }}><Volume2 size={17} aria-hidden/>{t('Écouter le récit', 'أستمع إلى القصة', 'Listen to the story')}</button></div><div className="garden-reading-choices">{task.options.map(option => <button type="button" className="garden-secondary" key={option.id} aria-pressed={choice === option.id} disabled={solved} onClick={() => { mark(); setChoice(option.id); onCheck(option.id === task.correct); }}>{young && <GardenObject kind={option.art} size={48}/>}<span>{option.label[language]}</span></button>)}</div></>;
    const water = task.kind === 'water';
    const total = amounts.reduce((a, b) => a + b, 0);
    const targets = task.targets;
    const change = (i: number, d: number) => { if (solved)
        return; mark(); setAmounts(old => old.map((n, j) => j === i ? Math.max(0, Math.min(water ? 6 : task.total, n + d)) : n)); };
    return <><div className="garden-distribution" role="group" aria-label={water ? t('Les pots à arroser', 'أصائص للسقي', 'Pots to water') : t('Les paniers de récolte', 'سلال المحصول', 'Harvest baskets')}>{targets.map((_, i) => <section key={i}><h5>{water ? t('Pot ', 'الأصيص ', 'Pot ') + (i + 1) : task.labels[i][language]}</h5><GardenObject kind={water ? 'plant' : 'basket'} size={62}/><div className="garden-dose" aria-live="polite">{amounts[i]}{water && task.doseMl ? ' × ' + task.doseMl + ' mL' : ''}</div><div className="garden-controls"><button type="button" className="garden-secondary" disabled={solved || amounts[i] === 0} aria-label={t('Retirer de ', 'أحذف من ', 'Remove from ') + (i + 1)} onClick={() => change(i, -1)}><Minus size={18} aria-hidden/></button><button type="button" className="garden-add" disabled={solved || (!water && total >= task.total) || water && amounts[i] >= 6} aria-label={t(water ? 'Arroser le pot ' : 'Ajouter au panier ', water ? 'أسقي الأصيص ' : 'أضيف للسلة ', water ? 'Water pot ' : 'Add to basket ') + (i + 1)} onClick={() => change(i, 1)}><GardenObject kind={water ? 'can' : 'tomato'} size={34}/><span aria-hidden>+</span></button></div></section>)}</div><p className="garden-counter" aria-live="polite">{water ? t('Doses distribuées : ', 'الجرعات الموزّعة: ', 'Doses distributed: ') + total : t('Tomates restantes : ', 'الطماطم المتبقية: ', 'Tomatoes remaining: ') + (task.total - total)}</p>{!solved && <button type="button" className="garden-primary" onClick={() => { mark(); onCheck(amounts.every((n, i) => n === targets[i])); }}>{checkLabel}</button>}</>;
}
function GardenReport({ tasks, results, language, onReplay, premium }: {
    tasks: GardenTask[];
    results: FamilyResults;
    language: PreschoolLanguage;
    onReplay?: (step: number) => void;
    premium?: boolean;
}) {
    const t = (fr: string, ar: string, en: string) => language === 'fr' ? fr : language === 'ar' ? ar : en;
    const priority = tasks.find(task => results[task.id]?.outcome === 'review') ?? tasks.find(task => results[task.id]?.outcome === 'helped') ?? tasks.find(task => !results[task.id]);
    return <div className="garden-report"><ol>{tasks.map((task, i) => { const result = results[task.id]; return <li key={task.id}><div><strong>{task.title[language]}</strong><small>{task.kind === 'observe' ? t('À observer avec un adulte', 'ملاحظة مع شخص بالغ', 'Observe with a grown-up') : t('Réponse vérifiée dans le jeu', 'إجابة متحقّق منها في اللعبة', 'Answer checked in the game')}</small></div><span data-outcome={result?.outcome}>{result?.outcome === 'independent' ? t('Réussi sans aide', 'نجح دون مساعدة', 'Without help') : result?.outcome === 'helped' ? t('Avec aide', 'بمساعدة', 'With help') : result?.outcome === 'review' ? t('À reprendre ensemble', 'نعيده معاً', 'Try again together') : t('Pas encore essayé', 'لم يُجرّب بعد', 'Not tried yet')}</span>{onReplay && <button type="button" className="garden-quiet" disabled={!premium && i > 1 || i >= 2 && !tasks.slice(0, Math.floor(i / 2) * 2).every(task => completed(results[task.id]))} onClick={() => onReplay(i)}>{t('Rejouer', 'أعيد', 'Replay')}</button>}</li>; })}</ol><p className="garden-recommendation"><strong>{t('Prochain petit pas : ', 'الخطوة الصغيرة التالية: ', 'Next small step: ')}</strong>{priority ? priority.practice[language] : t('Reprendre une idée avec de nouveaux objets dans deux jours, sans regarder le corrigé.', 'أعد فكرة بأشياء جديدة بعد يومين دون النظر إلى التصحيح.', 'Try one idea with new objects in two days, without looking at the solution.')}</p></div>;
}
