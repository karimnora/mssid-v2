import { MosaicWorkshop } from './MosaicWorkshop';
import { ADVENTURE_THEMES, THEMED_READING, type AdventureTheme } from '../../data/family/themedAdventures';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BookOpen, Check, FlaskConical, Minus, Plus, RotateCcw, ShoppingBasket } from 'lucide-react';
import type { PrimaryGrade } from '../../types';
import { FAMILY_MODULES } from '../../data/family/familyContent';
import { marketAmounts, PREMIUM_LAB_JOURNEYS, premiumLabResultId, shadowExperiments, shadowLength, type PremiumLab } from '../../data/family/premiumLabJourneys';
import { normalizeFamilyAnswer, type FamilyResults, type TaskOutcome } from '../../utils/familyLearning';
import { useActivityExit, useActivityExitGuard } from '../../context/ActivityExitContext';
import { speakText, stopSpeech } from '../../utils/speech';
import { AdventureBackdrop, AdventureStage, DidouGuide, LabParentSummary } from './AdventureStage';

type LabProps = { grade: PrimaryGrade; fr: boolean; premium: boolean; story: boolean; onResult: (id: string, outcome: TaskOutcome) => void; pending: React.MutableRefObject<boolean>; theme: AdventureTheme };
export function PremiumLearningLabs({ grade, fr, premium, onResult, results = {} }: Omit<LabProps, 'story' | 'pending' | 'theme'> & { results?: FamilyResults }) {
  const say = (a: string, b: string) => fr ? a : b;
  const [lab, setLab] = useState<PremiumLab | 'mosaic'>('market');
  const [theme, setTheme] = useState<AdventureTheme>('oasis');
  const [mode, setMode] = useState<'interactive' | 'story'>('interactive');
  const exit = useActivityExit();
  const pending = useRef(false);
  const onMosaicPending = React.useCallback((active: boolean) => { pending.current = active; }, []);
  const icons = { market: ShoppingBasket, story: BookOpen, science: FlaskConical };
  const completedFor = (id: PremiumLab) => [0, 1, 2].filter(step => { const result = results[premiumLabResultId(grade, id, step, theme)]; return Boolean(result?.completedAt) || result?.outcome === 'independent' || result?.outcome === 'helped'; }).length;
  const completedTotal = (['market', 'story', 'science'] as PremiumLab[]).reduce((sum, id) => sum + completedFor(id), 0);
  useEffect(() => () => stopSpeech(), [lab, grade, theme]);
  const props = { grade, fr, premium, pending, theme, story: mode === 'story', onResult };
  return <section className="premium-adventures space-y-5" aria-label={say('Laboratoires Premium', 'مختبرات Premium')}>
    <div className="adventure-introduction"><span className="adventure-eyebrow">{say('LES AVENTURES DE DIDOU', 'مغامرات ديدو')}</span><h3>{say('Une découverte à chaque geste.', 'أكتشف مع كل حركة.')}</h3><p>{say('Trois univers, trois défis chacun. Écoute, essaie, puis explique ce que tu as découvert. Une première mission est offerte dans chaque laboratoire.', 'ثلاثة عوالم وثلاثة تحديات في كل عالم. استمع وجرّب ثم اشرح ما اكتشفت. المهمة الأولى مجانية في كل مختبر.')}</p></div>
    {lab !== 'mosaic' && <>
    <details className="adventure-collection"><summary><span>{say('Choisir mon aventure', 'أختار مغامرتي')}</span><strong>{fr ? ADVENTURE_THEMES.find(item=>item.id===theme)!.title.fr : ADVENTURE_THEMES.find(item=>item.id===theme)!.title.ar}</strong></summary><fieldset className="adventure-themes"><legend className="sr-only">{say('Aventures disponibles', 'المغامرات المتاحة')}</legend>{ADVENTURE_THEMES.map(item => <button type="button" key={item.id} aria-pressed={theme === item.id} disabled={!premium && item.id !== 'oasis'} onClick={() => { if(item.id === theme) return; const change = () => {setTheme(item.id);setLab('market');}; if(pending.current) exit.requestLeave(change); else change(); }}><span>{fr ? item.title.fr : item.title.ar}</span>{!premium && item.id !== 'oasis' && <small>Premium</small>}</button>)}</fieldset></details>
    <p className="adventure-theme-intro">{fr ? ADVENTURE_THEMES.find(item=>item.id===theme)!.intro.fr : ADVENTURE_THEMES.find(item=>item.id===theme)!.intro.ar}</p>
    <div className="adventure-passport"><span>{say('Mon carnet d’aventures', 'دفتر مغامراتي')}</span><strong aria-live="polite">{completedTotal}/9 {say('défis réussis', 'تحديات ناجحة')}</strong></div>
    {completedTotal === 9 && <p className="adventure-theme-complete"><Check size={20} aria-hidden/>{say('Aventure explorée ! Raconte une de tes découvertes à un proche.', 'استكملت المغامرة! احكِ أحد اكتشافاتك لقريب.')}</p>}
    </>}
    <nav className="adventure-worlds" aria-label={say('Choisir mon univers', 'أختار عالمي')}>{(Object.keys(icons) as PremiumLab[]).map(id => {
      const Icon = icons[id]; const journey = PREMIUM_LAB_JOURNEYS[id];
      return <button type="button" key={id} data-world={id} aria-pressed={lab === id} onClick={() => { if (id !== lab) { if (pending.current) exit.requestLeave(() => setLab(id)); else setLab(id); } }}><Icon size={23} aria-hidden/><span>{fr ? journey.title.fr : journey.title.ar}<small>{fr ? journey.goal.fr : journey.goal.ar}</small></span><span className="adventure-world-count" aria-label={completedFor(id) + say(' défis réussis sur 3', ' تحديات ناجحة من 3')}>{completedFor(id) === 3 ? <Check size={17} aria-hidden/> : completedFor(id) + '/3'}</span></button>;
    })}</nav>
    <button type="button" className="mosaic-entry" aria-pressed={lab === 'mosaic'} onClick={() => { if(lab === 'mosaic') return; if(pending.current) exit.requestLeave(() => setLab('mosaic')); else setLab('mosaic'); }}><span aria-hidden>✦</span><span>{say('Les mosaïques de Didou', 'فسيفساء ديدو')}<small>{say('Un nouvel atelier : quantités, rectangles et fractions selon le niveau', 'ورشة جديدة: كميات ومستطيلات وكسور حسب المستوى')}</small></span></button>
    {lab !== 'mosaic' && <div className="adventure-modes" aria-label={say('Façon de jouer', 'طريقة اللعب')}>{(['interactive', 'story'] as const).map(id => <button type="button" key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>{id === 'interactive' ? say('Mode interactif', 'الوضع التفاعلي') : say('Mode histoire', 'وضع القصة')}</button>)}</div>}
    <div key={grade + ':' + theme + ':' + lab}>{lab === 'mosaic' ? <MosaicWorkshop grade={grade} fr={fr} premium={premium} results={results} onResult={onResult} onPending={onMosaicPending}/> : lab === 'market' ? <Market {...props}/> : lab === 'story' ? <Reading {...props}/> : <Shadows {...props}/>}</div>
    {lab !== 'mosaic' && <LabParentSummary fr={fr} grade={grade} results={results} theme={theme}/>}
  </section>;
}
function useAdventureExit(active: boolean, fr: boolean, pending: React.MutableRefObject<boolean>) {
  useActivityExitGuard(active, fr ? 'fr' : 'ar');
  useLayoutEffect(() => { pending.current = active; return () => { pending.current = false; }; }, [active, pending]);
}
function Finish({ fr, premium, lab }: { fr: boolean; premium: boolean; lab: PremiumLab }) {
  const transfer = PREMIUM_LAB_JOURNEYS[lab].transfer;
  return <div className="adventure-finish"><Check size={25} aria-hidden/><div><p>{fr ? (premium ? 'Mission terminée. À toi de transmettre !' : 'Mission découverte terminée. Tu peux la rejouer gratuitement.') : (premium ? 'انتهت المهمة. حان دورك لتشرح!' : 'انتهت مهمة الاكتشاف. يمكنك إعادتها مجاناً.')}</p><small>{fr ? transfer.fr : transfer.ar}</small>{!premium && <small>{fr ? 'Les deux défis suivants font partie de Premium.' : 'التحديان التاليان ضمن Premium.'}</small>}</div></div>;
}
function DateBag({ theme = 'oasis' }: { theme?: AdventureTheme }) {
  if(theme === 'library') return <svg viewBox="0 0 54 64" aria-hidden="true"><ellipse cx="27" cy="59" rx="22" ry="4" fill="#5c3a24" opacity=".15"/><path d="M12 8H44V55H12Q6 53 8 48V13Q8 8 12 8Z" fill="#ba7853" stroke="#875d42" strokeWidth="2"/><path d="M14 11H40V48H14" fill="#faedc9"/><path d="M18 15H42V49H18Z" fill="#7c9a70"/><path d="M23 24H36M23 30H34" stroke="#edf0cd" strokeWidth="3"/></svg>;
  return <svg viewBox="0 0 54 64" aria-hidden="true"><ellipse cx="27" cy="59" rx="22" ry="4" fill="#5c3a24" opacity=".15"/><path d="M13 12L10 54Q27 62 44 54L41 12Z" fill="#f4d59c" stroke="#be9159" strokeWidth="2"/><path d="M10 13Q27 5 44 13" stroke="#b0804a" strokeWidth="4" fill="none"/>{theme === 'garden' ? <g><path d="M27 47V25" stroke="#4f7650" strokeWidth="3"/><ellipse cx="20" cy="32" rx="9" ry="5" fill="#749260" transform="rotate(25 20 32)"/><ellipse cx="33" cy="24" rx="9" ry="5" fill="#749260" transform="rotate(-25 33 24)"/></g> : <><ellipse cx="23" cy="32" rx="6" ry="10" fill="#995b36" transform="rotate(-25 23 32)"/><ellipse cx="33" cy="39" rx="6" ry="10" fill="#ac6b3c" transform="rotate(24 33 39)"/><path d="M23 25V38M33 32V45" stroke="#76472f" strokeWidth="1.5"/></>}</svg>;
}
function Market({ grade, fr, premium, story, onResult, pending, theme }: LabProps) {
  const say = (a: string, b: string) => fr ? a : b;
  const { price, quantity: target, payment, total, change } = marketAmounts(grade, theme);
  const itemName = theme === 'library' ? say('livres', 'كتب') : theme === 'garden' ? say('sachets de graines', 'أكياس بذور') : say('sachets de dattes', 'أكياس تمر');
  const itemUnit = theme === 'library' ? say('livre', 'كتاب') : say('sachet', 'كيس');
  const [step, setStep] = useState(0); const [qty, setQty] = useState(0);
  const [answer, setAnswer] = useState(''); const [status, setStatus] = useState<'correct' | 'retry' | null>(null);
  const [help, setHelp] = useState(false); const [missed, setMissed] = useState(false); const [finished, setFinished] = useState(false);
  useAdventureExit(!finished && status !== 'correct' && (qty > 0 || answer.length > 0), fr, pending);
  const expected = [target, total, change][step];
  const prompts = [say('Prépare ' + target + ' ' + itemName + '. Utilise les boutons du panier.', 'العدد المطلوب من ' + itemName + ': ' + target + '. استعمل أزرار السلة.'), say('Chaque ' + itemUnit + ' coûte ' + price + ' DA. Quel est le total ? Écris seulement le nombre.', 'ثمن ' + itemUnit + ' ' + price + ' دج. ما المجموع؟ اكتب العدد فقط.'), say('Tu paies ' + payment + ' DA pour ' + total + ' DA d’achats. Quelle monnaie reçoit-on ?', 'دفعت ' + payment + ' دج وثمن المشتريات ' + total + ' دج. كم يُرجع لك؟')];
  const sum = Array.from({ length: target }, () => price).join(' + ') + ' = ' + total;
  const explanations = [say('Tu as placé exactement ' + target + ' ' + itemName + '. Un objet correspond à une unité.', 'العدد الذي وضعته: ' + target + '. كل جسم يمثّل وحدة واحدة.'), say(sum + ' DA. ' + (grade === '1AP' || grade === '2AP' ? 'Additionne le prix de chaque objet.' : 'Le même prix répété ' + target + ' fois : ' + target + ' × ' + price + '.'), sum + ' دج. نجمع ثمن المشتريات قطعةً قطعةً.'), say(payment + ' − ' + total + ' = ' + change + ' DA. Vérifie : ' + total + ' + ' + change + ' = ' + payment + '.', payment + ' − ' + total + ' = ' + change + ' دج. نتحقّق: ' + total + ' + ' + change + ' = ' + payment + '.')];
  const narratives = theme !== 'oasis' ? [say(theme === 'garden' ? 'Aidons la classe à planter son jardin. Prépare les sachets de graines avant de passer à la caisse.' : 'Didou prépare le coin lecture de la Casbah. Choisis les livres pour ses amis.', theme === 'garden' ? 'لنساعد القسم على غرس حديقته. حضّر أكياس البذور قبل حساب الثمن.' : 'يحضّر ديدو ركن القراءة في القصبة. اختر الكتب لأصدقائه.'), say('Le matériel est prêt. Vérifie maintenant le prix de tous les objets.', 'الأدوات جاهزة. تحقّق الآن من ثمن جميع المشتريات.'), say('Vérifie la monnaie pour terminer les préparatifs.', 'تحقّق من الباقي لإتمام التحضيرات.')] : [say('Didou prépare un pique-nique près de l’oasis. Au souk de Biskra, aide-le à remplir son panier.', 'يحضّر ديدو نزهة قرب الواحة. ساعده على ملء سلته في سوق بسكرة.'), say('Le panier est prêt ! Le marchand attend : trouvons ensemble le prix de tous les sachets.', 'السلة جاهزة! البائع ينتظر. لنحسب ثمن كل الأكياس.'), say('Dernière étape avant la promenade : vérifie que le marchand rend la bonne monnaie.', 'قبل النزهة، تأكّد أن البائع يرجع الباقي الصحيح.')];
  const verify = () => {
    if (status === 'correct' || finished) return;
    const ok = step === 0 ? qty === expected : normalizeFamilyAnswer(answer) === String(expected);
    setStatus(ok ? 'correct' : 'retry'); if (!ok) setMissed(true);
    onResult(premiumLabResultId(grade, 'market', step, theme), ok ? (help || missed ? 'helped' : 'independent') : 'review');
  };
  const move = () => { if (step === 2 || !premium) { setFinished(true); return; } setStep(step + 1); setAnswer(''); setStatus(null); setHelp(false); setMissed(false); };
  const updateQuantity = (value: number) => { setQty(Math.min(10, Math.max(0, value))); setStatus(null); };
  return <AdventureStage theme={theme} lab="market" fr={fr} grade={grade} step={step} completed={step + (status === 'correct' ? 1 : 0)} story={story} scene={<>
    <AdventureBackdrop theme={theme} kind="market"/><button type="button" className="adventure-date-pile" aria-label={theme === 'library' ? say('Prendre un livre sur l’étal', 'آخذ كتاباً من البسطة') : say('Prendre un sachet sur l’étal', 'أضيف كيساً من البسطة')} disabled={step !== 0 || qty >= 10 || status === 'correct' || finished} onClick={() => updateQuantity(qty + 1)}><DateBag theme={theme}/><DateBag theme={theme}/><DateBag theme={theme}/><span>{price} {say('DA / ', 'دج / ') + itemUnit}</span></button>
    <div className="adventure-scene-note">{theme === 'garden' ? say('Pour le jardin', 'للحديقة') : theme === 'library' ? say('Pour le coin lecture', 'لركن القراءة') : say('Pour notre pique-nique', 'لنزهتنا')}<strong>{target} {itemName}</strong></div>
  </>}>
    {story && <p className="adventure-story">{narratives[step]}</p>}
    <DidouGuide fr={fr} success={status === 'correct'} text={status === 'correct' ? explanations[step] : status === 'retry' ? say('Regarde ton panier ou ton calcul. Tu peux prendre un indice, puis réessayer.', 'راجع السلة أو الحساب. يمكنك طلب مساعدة ثم المحاولة مجدداً.') : prompts[step]}/>
    <div className="adventure-basket" aria-label={say('Mon panier', 'سلتي')}><ShoppingBasket size={25} aria-hidden/><div>{qty === 0 ? <span>{say('Touche les objets pour remplir le panier.', 'المس الأشياء لملء السلة.')}</span> : Array.from({ length: qty }, (_, i) => <span className="adventure-mini-bag" key={i}><DateBag theme={theme}/></span>)}</div><output aria-live="polite">{qty}</output></div>
    {step === 0 ? <div className="adventure-counter"><button type="button" className="studio-outline" aria-label={theme === 'library' ? say('Retirer un livre', 'حذف كتاب') : say('Retirer un sachet', 'حذف كيس')} disabled={qty === 0 || status === 'correct' || finished} onClick={() => updateQuantity(qty - 1)}><Minus aria-hidden/></button><span>{say('objets dans le panier', 'أشياء في السلة')}</span><button type="button" className="studio-outline" aria-label={theme === 'library' ? say('Ajouter un livre', 'إضافة كتاب') : say('Ajouter un sachet', 'إضافة كيس')} disabled={qty >= 10 || status === 'correct' || finished} onClick={() => updateQuantity(qty + 1)}><Plus aria-hidden/></button></div> : <><div className="adventure-receipt"><span>{step === 1 ? (grade === '1AP' || grade === '2AP' ? sum.split(' = ')[0] : target + ' × ' + price) : say('Paiement : ', 'المبلغ المدفوع: ') + payment}</span><strong>{step === 1 ? '?' : say('Achats : ', 'الثمن: ') + total} {say('DA', 'دج')}</strong></div><label className="adventure-answer">{say('Ta réponse', 'إجابتك')}<input className="studio-input" dir="ltr" inputMode="numeric" autoComplete="off" value={answer} disabled={status === 'correct' || finished} onChange={e => { setAnswer(e.target.value); setStatus(null); }}/></label></>}
    {!finished && status !== 'correct' && <div className="adventure-actions"><button type="button" className="studio-action" onClick={verify} disabled={step > 0 && !answer.trim()}>{say('Vérifier', 'أتحقق')}</button><button type="button" className="studio-outline" aria-expanded={help} onClick={() => setHelp(true)}>{say('Un indice', 'مساعدة')}</button></div>}
    {help && <p className="adventure-hint">{step === 0 ? say('Compte un à un : un objet, un nombre. Retire les objets en trop avec le bouton −.', 'عدّ واحداً واحداً: لكل كيس عدد. احذف الأشياء الزائدة بزر −.') : step === 1 ? say('Le prix est identique pour chaque objet. Additionne-le une fois par objet.', 'الثمن نفسه لكل قطعة. اجمعه مرة لكل قطعة.') : say('Pars du prix des achats et complète jusqu’au montant payé. Vérifie par une addition.', 'ابدأ بثمن المشتريات وأكمل إلى المبلغ المدفوع. تحقّق بالجمع.')}</p>}
    {status && !finished && <p role="status" className="studio-feedback" data-retry={status === 'retry'}>{status === 'correct' ? <bdi>{explanations[step]}</bdi> : say('Essaie encore. Tu peux modifier ta réponse.', 'حاول مجدداً. يمكنك تعديل الإجابة.')}</p>}
    {status === 'correct' && !finished && <button type="button" className="studio-action adventure-next" onClick={move}>{say('Continuer', 'أتابع')}</button>}
    {finished && <><Finish fr={fr} premium={premium} lab="market"/><button type="button" className="studio-outline" onClick={() => { setStep(0); setQty(0); setAnswer(''); setStatus(null); setHelp(false); setMissed(false); setFinished(false); }}><RotateCcw size={16} aria-hidden/> {say('Rejouer', 'أعيد اللعب')}</button></>}
    <p className="adventure-caption">{say('Prix fictifs pour apprendre à calculer.', 'أسعار افتراضية للتدرّب على الحساب.')}</p>
  </AdventureStage>;
}

const READING_DISTRACTORS: Record<PrimaryGrade, string[][]> = {
  '1AP': [['فَوْقَ الشَّجَرَةِ.', 'فِي الْمَدْرَسَةِ.'], ['لَيْلَى.', 'الْقِطَّةُ.'], ['لِتَجِفَّ.', 'لِتَخْتَفِيَ.']],
  '2AP': [['يَوْمَ الْجُمُعَةِ.', 'يَوْمَ الِاثْنَيْنِ.'], ['عَنِ الْجَبَلِ.', 'عَنِ السُّوقِ.'], ['لِتُخْفِيَهُ.', 'لِتُتْلِفَهُ.']],
  '3AP': [['الْأَلْعَابَ.', 'الْكُتُبَ.'], ['لِزِيَادَةِ الْوَقْتِ.', 'لِكَيْ يَضِيعَا.'], ['لَمَسَا الزُّجَاجَ.', 'تَرَكَا النُّفَايَاتِ.']],
  '4AP': [['كَثْرَةُ الْكُتُبِ.', 'نَقْصُ الْأَقْلَامِ.'], ['ازْدَادَ التَّسَرُّبُ.', 'جَفَّتِ الْحُقُولُ.'], ['الْقَنَاةُ قَدِيمَةٌ.', 'عَادَ الْمَاءُ إِلَى الْحُقُولِ.']],
  '5AP': [['قِلَّةُ الْوَقْتِ فَقَطْ.', 'طُولُ الطَّرِيقِ.'], ['مَنَعَتِ الإِعَارَةَ.', 'أَخْفَتِ الْكُتُبَ.'], ['عُطْلَةٌ فِي الْبَحْرِ؛ لِأَنَّ النَّصَّ عَنِ الشَّاطِئِ.', 'السُّوقُ؛ لِأَنَّ النَّصَّ عَنِ الْبَيْعِ.']],
};
function Reading({ grade, fr, premium, story, onResult, pending, theme }: LabProps) {
  const say = (a: string, b: string) => fr ? a : b;
  const module = FAMILY_MODULES.find(m => m.grade === grade && m.domain === 'reading')!;
  const reading = theme === 'oasis' ? { text: module.text?.ar ?? '', tasks: module.tasks.map((item, i) => ({ prompt: item.prompt.ar, correct: item.answer.ar, wrong: READING_DISTRACTORS[grade][i], hint: item.hint, method: item.method.ar })) } : THEMED_READING[theme][grade];
  const [step, setStep] = useState(0); const [chosen, setChosen] = useState<number | null>(null); const [finished, setFinished] = useState(false);
  const [missed, setMissed] = useState(false); const [help, setHelp] = useState(false);
  const task = reading.tasks[step]; const correctIndex = (step + 1) % 3; const correct = chosen === correctIndex;
  const options = [...task.wrong]; options.splice(correctIndex, 0, task.correct);
  useAdventureExit(chosen !== null && !correct && !finished, fr, pending);
  return <AdventureStage theme={theme} lab="story" fr={fr} grade={grade} step={step} completed={step + (correct ? 1 : 0)} story={story} scene={<><AdventureBackdrop theme={theme} kind="story"/><span className="adventure-scene-note">{say('Cherchons des indices', 'نبحث عن الأدلة')}<strong>{say('Une histoire, trois découvertes', 'قصة وثلاثة اكتشافات')}</strong></span></>}>
    {story && <p className="adventure-story">{say('Un livre nous attend dans le jardin. Deviens l’enquêteur de Didou : trouve une information, relie les indices, puis explique ton choix.', 'ينتظرنا كتاب في الحديقة. كن محقّق ديدو: ابحث عن معلومة واربط الأدلة ثم اشرح اختيارك.')}</p>}
    <DidouGuide fr={fr} lang={correct ? (fr ? 'fr-FR' : 'ar-SA') : 'ar-SA'} text={correct ? say('Tu as trouvé une réponse. Maintenant, montre les mots du récit qui la justifient.', 'وجدت إجابة. أشر الآن إلى كلمات القصة التي تدعمها.') : task.prompt}/>
    <div className="adventure-book"><span className="adventure-eyebrow">{say('Lecture en arabe', 'قراءة بالعربية')}</span><p dir="rtl" lang="ar">{reading.text}</p><button type="button" className="adventure-audio" onClick={() => { void speakText(reading.text, 'ar-SA').catch(() => {}); }}><BookOpen size={17} aria-hidden/> {say('Écouter le récit en arabe', 'أستمع إلى القصة بالعربية')}</button></div>
    <div className="adventure-options">{options.map((option, i) => <button type="button" key={option} dir="rtl" lang="ar" disabled={correct || finished} data-selected={chosen === i} onClick={() => { setChosen(i); if (i !== correctIndex) setMissed(true); onResult(premiumLabResultId(grade, 'story', step, theme), i === correctIndex ? (missed || help ? 'helped' : 'independent') : 'review'); }}><span aria-hidden>{i + 1}</span>{option}</button>)}</div>
    {!correct && !finished && <button type="button" className="studio-outline" aria-expanded={help} onClick={() => setHelp(true)}>{say('Un indice', 'مساعدة')}</button>}
    {help && <p className="adventure-hint">{fr ? task.hint.fr : task.hint.ar}</p>}
    {chosen !== null && !finished && <div role="status" className="studio-feedback" data-retry={!correct}>{correct ? <><strong>{say('Bonne piste !', 'إجابة مناسبة!')}</strong><p>{task.method}</p><p>{say('Montre la phrase utile à un adulte. Le choix correct seul ne prouve pas encore que tu sais justifier.', 'أشر إلى الجملة المناسبة لشخص بالغ. اختيار الإجابة الصحيحة وحده لا يثبت القدرة على التبرير.')}</p></> : say('Cette réponse ne correspond pas au récit. Relis le passage et réessaie.', 'هذه الإجابة لا توافق القصة. أعد قراءة الجزء المناسب وحاول مجدداً.')}</div>}
    {correct && !finished && <button type="button" className="studio-action" onClick={() => { if (step === 2 || !premium) { setFinished(true); return; } setStep(step + 1); setChosen(null); setMissed(false); setHelp(false); }}>{say('Suite de l’aventure', 'أتابع المغامرة')}</button>}
    {finished && <><Finish fr={fr} premium={premium} lab="story"/><button type="button" className="studio-outline" onClick={() => { setStep(0); setChosen(null); setMissed(false); setHelp(false); setFinished(false); }}>{say('Relire et rejouer', 'أقرأ وأعيد اللعب')}</button></>}
  </AdventureStage>;
}

function Shadows({ grade, fr, premium, story, onResult, pending, theme }: LabProps) {
  const say = (a: string, b: string) => fr ? a : b;
  const [step, setStep] = useState(0); const [prediction, setPrediction] = useState(''); const [observed, setObserved] = useState(false);
  const [finished, setFinished] = useState(false); const [missed, setMissed] = useState(false); const [help, setHelp] = useState(false);
  const experiment = shadowExperiments(theme)[step]; const params = observed ? experiment.after : experiment.before;
  const shadow = shadowLength(params.height, params.angle); const before = shadowLength(experiment.before.height, experiment.before.angle);
  const correct = prediction === experiment.prediction;
  useAdventureExit(Boolean(prediction) && !(observed && correct) && !finished, fr, pending);
  const explanation = step === 1 ? say('À lumière constante, doubler la hauteur double la longueur de l’ombre.', 'عند ثبات الضوء، مضاعفة ارتفاع العمود تضاعف طول الظل.') : say('À hauteur de poteau constante, une lumière plus haute donne une ombre plus courte.', 'عند ثبات ارتفاع العمود، ضوء أعلى يعطي ظلاً أقصر.');
  const prompt = step === 1 ? say('Même lumière, poteau deux fois plus haut : que devient l’ombre ?', 'الضوء نفسه وعمود بضعف الارتفاع: كيف يتغيّر الظل؟') : say('Même poteau, lumière plus haute : que devient l’ombre ?', 'العمود نفسه وضوء أعلى: كيف يتغيّر الظل؟');
  const run = () => { if (!prediction || observed || finished) return; setObserved(true); if (!correct) setMissed(true); onResult(premiumLabResultId(grade, 'science', step, theme), correct ? (help || missed ? 'helped' : 'independent') : 'review'); };
  return <AdventureStage theme={theme} lab="science" fr={fr} grade={grade} step={step} completed={step + (observed && correct ? 1 : 0)} story={story} scene={<svg viewBox="0 0 640 260" aria-label={say('Poteau éclairé et ombre sur le sol', 'عمود مضاء وظله على الأرض')} role="img" className="adventure-shadow-scene">
    <rect width="640" height="260" fill="#dcece7"/><path d="M0 171Q110 120 210 172T420 160T640 154V260H0Z" fill="#b9cda4"/><path d="M0 205Q270 185 640 206V260H0Z" fill="#eadbb7"/>
    <path d="M460 208V106Q500 65 540 106V208" fill="#f8edcd" stroke="#c8ad83" strokeWidth="4"/><path d="M483 209V133Q500 109 518 133V209" fill="#7caa91"/>
    <circle cx="105" cy={165 - params.angle * 1.6} r="25" fill="#ffd66c"/>
    <path d={'M250 ' + (210 - params.height * 2.4) + 'L' + (250 + shadow * 2.4) + ' 210H250Z'} fill="#f9d57d" opacity=".5"/>
    <path d={'M250 212H' + (250 + shadow * 2.4)} className="adventure-shadow" stroke="#5b6b66" strokeWidth="9" strokeLinecap="round"/>
    <rect x="244" y={210 - params.height * 2.4} width="12" height={params.height * 2.4} rx="3" fill="#986c4a"/>
    <path d="M0 225H640" stroke="#c4ac84" strokeWidth="3"/>
    <text x="252" y="246" textAnchor="middle" fill="#3e5349" fontSize="14">{params.height} cm</text>
  </svg>}>
    {story && <p className="adventure-story">{say('Dans la cour, Didou cherche une place à l’ombre pour lire. Teste une idée avant de lui répondre : un seul paramètre change à chaque fois.', 'يبحث ديدو في الساحة عن ظلّ ليقرأ. اختبر فكرتك قبل الإجابة: نغيّر عاملاً واحداً فقط في كل مرة.')}</p>}
    <DidouGuide fr={fr} success={observed && correct} text={observed ? explanation : prompt}/>
    <div className="adventure-measures"><span>{say('Poteau', 'العمود')} <strong>{params.height} cm</strong></span><span>{say('Lumière', 'الضوء')} <strong>{params.angle}°</strong></span><span>{say('Ombre', 'الظل')} <strong>{observed ? '≈ ' + shadow.toFixed(1) + ' cm' : '?'}</strong></span></div>
    <div className="adventure-options adventure-predictions">{[['shorter', say('Plus courte', 'أقصر')], ['longer', say('Plus longue', 'أطول')], ['same', say('Identique', 'لا تتغيّر')]].map(([id, label]) => <button type="button" key={id} aria-pressed={prediction === id} disabled={observed || finished} onClick={() => setPrediction(id)}><span className={'shadow-sample shadow-' + id} aria-hidden/>{label}</button>)}</div>
    {!observed && <div className="adventure-actions"><button type="button" className="studio-action" disabled={!prediction} onClick={run}>{say('Tester ma prédiction', 'أختبر توقّعي')}</button><button type="button" className="studio-outline" onClick={() => setHelp(true)} aria-expanded={help}>{say('Un indice', 'مساعدة')}</button></div>}
    {help && <p className="adventure-hint">{step === 1 ? say('Garde la lumière au même endroit. Imagine un deuxième poteau identique au-dessus du premier.', 'ثبّت الضوء. تخيّل عموداً مماثلاً فوق الأول.') : say('Imagine la lumière au-dessus du poteau, puis très basse. Dans quel cas l’ombre s’étire-t-elle ?', 'تخيّل الضوء فوق العمود ثم منخفضاً جداً. متى يمتدّ الظل؟')}</p>}
    {observed && !finished && <div role="status" className="studio-feedback" data-retry={!correct}><strong>{correct ? say('Ta prédiction correspond au modèle.', 'توقّعك يوافق النموذج.') : say('Le modèle ne confirme pas ta prédiction.', 'النموذج لا يؤكّد توقّعك.')}</strong><p>{explanation}</p><p className="adventure-comparison"><bdi>{before.toFixed(1)} cm → {shadow.toFixed(1)} cm</bdi></p><p>{say('Explique : quel paramètre a changé ? Lequel est resté identique ?', 'اشرح: ما العامل الذي تغيّر؟ وما العامل الذي بقي ثابتاً؟')}</p></div>}
    {observed && !correct && !finished && <button type="button" className="studio-action" onClick={() => { setPrediction(''); setObserved(false); }}>{say('Réessayer l’expérience', 'أعيد التجربة')}</button>}
    {observed && correct && !finished && <button type="button" className="studio-action" onClick={() => { if (step === 2 || !premium) { setFinished(true); return; } setStep(step + 1); setPrediction(''); setObserved(false); setMissed(false); setHelp(false); }}>{say('Expérience suivante', 'التجربة التالية')}</button>}
    {finished && <><Finish fr={fr} premium={premium} lab="science"/><button type="button" className="studio-outline" onClick={() => { setStep(0); setPrediction(''); setObserved(false); setMissed(false); setHelp(false); setFinished(false); }}>{say('Recommencer', 'أعيد التجربة')}</button></>}
    <p className="adventure-caption">{say('Modèle simplifié : poteau vertical, sol plat et rayons parallèles. Les mesures sont calculées. Pour les petits, comparer plus court / plus long suffit.', 'نموذج مبسّط: عمود قائم وأرض مستوية وأشعة متوازية. القياسات محسوبة. للصغار تكفي مقارنة أقصر وأطول.')}</p>
  </AdventureStage>;
}
