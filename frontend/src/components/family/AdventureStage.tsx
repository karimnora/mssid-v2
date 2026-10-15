import { ADVENTURE_THEMES, type AdventureTheme } from '../../data/family/themedAdventures';
import React, { useEffect, useRef, useState } from 'react';
import { Check, Square, Volume2 } from 'lucide-react';
import { speakText, stopSpeech } from '../../utils/speech';
import { PREMIUM_LAB_JOURNEYS, premiumLabResultId, type PremiumLab } from '../../data/family/premiumLabJourneys';
import type { PrimaryGrade } from '../../types';
import type { FamilyResults } from '../../utils/familyLearning';
import './premiumAdventures.css';

export function DidouGuide({ text, fr, success = false, lang }: { text: string; fr: boolean; success?: boolean; lang?: 'ar-SA' | 'fr-FR' }) {
  const [enabled, setEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const token = useRef(0);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const current = ++token.current;
    setSpeaking(true);
    void speakText(text, lang ?? (fr ? 'fr-FR' : 'ar-SA')).catch(() => {}).finally(() => {
      if (active && current === token.current) setSpeaking(false);
    });
    return () => { active = false; stopSpeech(); };
  }, [text, enabled, fr, lang]);
  return <div className="adventure-guide" data-speaking={speaking}>
    <svg className="adventure-didou" viewBox="0 0 110 118" aria-hidden="true">
      <ellipse cx="55" cy="111" rx="35" ry="5" fill="#153e39" opacity=".12"/>
      <path d="M27 68Q6 79 13 99Q24 108 40 96" fill="#c47932"/><path d="M13 88Q10 100 24 100L29 91" fill="#fff2cf"/>
      <path d="M34 70Q55 59 77 73L84 106Q55 116 29 106Z" fill="#16796c"/><path d="M43 74L55 85L67 74" fill="none" stroke="#ffd67c" strokeWidth="5"/>
      <path d="M22 52Q5 26 13 4Q39 11 43 39M68 39Q77 9 99 4Q108 31 87 56" fill="#d99a52" stroke="#9f622d" strokeWidth="2"/>
      <path d="M20 15L33 39L21 37ZM88 16L77 40L91 34Z" fill="#e9afa0"/>
      <path d="M21 44Q55 24 90 45L84 72Q56 95 27 72Z" fill="#e4a75e"/>
      <path d="M24 58Q38 53 55 71Q71 53 88 58L81 74Q55 93 29 73Z" fill="#fff1d1"/>
      <path d={success ? 'M34 55Q39 49 44 55M67 55Q72 49 77 55' : 'M37 51V57M73 51V57'} stroke="#253f39" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M49 66Q55 62 61 66L55 72Z" fill="#253f39"/>
      <ellipse className="adventure-mouth" cx="55" cy="77" rx="5" ry="2" fill="#754b36"/>
      <path d="M33 90L24 96M78 90L88 96" stroke="#e4a75e" strokeWidth="10" strokeLinecap="round"/>
    </svg>
    <div className="adventure-bubble">
      <span className="adventure-eyebrow">{fr ? 'Didou, ton compagnon' : 'ديدو، رفيقك'}</span>
      <p dir={lang === 'ar-SA' ? 'rtl' : undefined} lang={lang?.slice(0, 2)}>{text}</p>
      <button type="button" className="adventure-audio" aria-pressed={enabled} onClick={() => { if (enabled) { token.current++; stopSpeech(); setSpeaking(false); } setEnabled(!enabled); }}>
        {enabled ? <Square size={15} aria-hidden/> : <Volume2 size={18} aria-hidden/>}
        {enabled ? (fr ? 'Couper la voix' : 'أوقف الصوت') : (fr ? 'Écouter Didou' : 'أستمع إلى ديدو')}
      </button>
    </div>
  </div>;
}

export function AdventureStage({ lab, fr, grade, step, completed, story, children, scene, theme = 'oasis' }: {
  lab: PremiumLab; fr: boolean; grade: PrimaryGrade; step: number; completed: number; story: boolean; children: React.ReactNode; scene: React.ReactNode; theme?: AdventureTheme;
}) {
  const journey = PREMIUM_LAB_JOURNEYS[lab];
  const t = (text: {fr: string; ar: string}) => fr ? text.fr : text.ar;
  return <article className="adventure studio-stage" data-adventure={lab} data-adventure-theme={theme}>
    <header className="adventure-heading"><div><span className="adventure-eyebrow">{grade} · {story ? (fr ? 'Aventure guidée' : 'مغامرة موجّهة') : (fr ? 'À toi de jouer' : 'دورك للّعب')}</span><h4>{t(journey.title)}</h4><p>{t(journey.goal)}</p></div><span className="adventure-stamp" aria-label={fr ? completed + ' défis terminés' : completed + ' تحديات مكتملة'}><Check size={16} aria-hidden/>{completed}/3</span></header>
    <ol className="adventure-path" aria-label={fr ? 'Étapes de l’aventure' : 'مراحل المغامرة'}>{journey.steps.map((label, i) => <li key={i} aria-current={step === i ? 'step' : undefined} data-complete={i < completed}><span>{i < completed ? <Check size={14} aria-hidden/> : i + 1}</span><small>{t(label)}</small></li>)}</ol>
    <div className="adventure-scene">{scene}<span className="adventure-location">{theme === 'garden' ? (fr ? 'Le jardin de l’école' : 'حديقة المدرسة') : theme === 'library' ? (fr ? 'La bibliothèque de la Casbah' : 'مكتبة القصبة') : lab === 'market' ? (fr ? 'Le souk · Biskra' : 'السوق · بسكرة') : lab === 'story' ? (fr ? 'Le jardin des récits' : 'حديقة الحكايات') : (fr ? 'La cour des découvertes' : 'ساحة الاكتشافات')}</span></div>
    <div className="adventure-workspace">{children}</div>
  </article>;
}

export function AdventureBackdrop({ kind, theme = 'oasis' }: { kind: 'market' | 'story'; theme?: AdventureTheme }) {
  return <svg viewBox="0 0 640 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="adventure-backdrop">
    <rect width="640" height="260" fill={theme === 'garden' ? '#e4efdb' : theme === 'library' ? '#eee5d3' : kind === 'market' ? '#d8eee6' : '#dfebdf'}/><circle cx="545" cy="49" r="29" fill="#ffe6a0"/>
    <path d="M0 154Q90 90 180 148Q282 82 400 141Q530 98 640 143V260H0Z" fill="#b6c9a0"/>
    <path d="M0 191Q135 158 320 193Q480 165 640 184V260H0Z" fill="#ecdcb7"/>
    <path d="M38 181V79Q73 41 107 79V181M125 177V64Q169 20 211 64V178" fill="#f7edcf" stroke="#d6bf92" strokeWidth="4"/>
    <path d="M62 181V112Q74 94 85 112V181M151 178V104Q168 77 186 104V178" fill="#cf9d77"/>
    <path d="M587 168V73M587 86Q542 49 539 73M587 91Q622 47 633 75M587 83Q575 38 562 46" stroke="#638c69" strokeWidth="10" fill="none" strokeLinecap="round"/>
    {theme === 'garden' && <g><path d="M5 226H160" stroke="#a67d4a" strokeWidth="16"/>{[32,74,116].map(x=><g key={x}><path d={'M'+x+' 223V191'} stroke="#598459" strokeWidth="4"/><ellipse cx={x-8} cy="199" rx="10" ry="5" fill="#7b9b60"/><ellipse cx={x+8} cy="190" rx="10" ry="5" fill="#7b9b60"/></g>)}</g>}
    {theme === 'library' && <g><rect x="18" y="202" width="142" height="12" rx="3" fill="#ab7c56"/>{['#8b9e75','#cf9468','#597e7d','#d2b463'].map((color,i)=><rect key={color} x={30+i*29} y={156+(i%2)*7} width="23" height={46-(i%2)*7} rx="3" fill={color}/>)}</g>}
    {kind === 'market' ? <><ellipse cx="342" cy="239" rx="180" ry="12" fill="#7b7059" opacity=".17"/><rect x="198" y="131" width="287" height="90" rx="8" fill="#bd7655"/><path d="M180 132L215 54H467L502 132Z" fill="#14776b"/><path d="M238 54L218 132M310 54L304 132M380 54L391 132M446 54L474 132" stroke="#f9d68a" strokeWidth="24"/><path d="M195 145H490" stroke="#865e43" strokeWidth="8"/><rect x="303" y="168" width="77" height="33" rx="5" fill="#fff0cd"/><path d="M214 199H283M398 199H470" stroke="#985b40" strokeWidth="5"/></> : <><path d="M290 238V100Q343 54 396 100V238" fill="#f6eacb" stroke="#cead84" strokeWidth="4"/><path d="M312 238V120Q344 89 376 120V238" fill="#629a88"/><rect x="172" y="198" width="353" height="24" rx="9" fill="#b9865a"/><path d="M191 222V250M503 222V250" stroke="#896544" strokeWidth="10"/><path d="M248 188L317 176L340 192L366 176L434 188V210L340 214L248 210Z" fill="#fffaf0" stroke="#be9270" strokeWidth="3"/><path d="M340 192V213" stroke="#be9270" strokeWidth="3"/><path d="M54 204V115Q89 81 126 115V204" fill="#83a37c"/><circle cx="72" cy="150" r="11" fill="#edb279"/><circle cx="106" cy="134" r="12" fill="#edb279"/></>}
  </svg>;
}

export function LabParentSummary({ fr, grade, results, theme = 'oasis' }: { fr: boolean; grade: PrimaryGrade; results: FamilyResults; theme?: AdventureTheme }) {
  const labels = { independent: fr ? 'Réussi seul' : 'نجح وحده', helped: fr ? 'Avec aide' : 'بمساعدة', review: fr ? 'À reprendre' : 'للمراجعة' };
  return <details className="adventure-parent"><summary>{fr ? 'Repères pour le parent' : 'ملاحظات للوالد'}</summary><p><strong>{fr ? ADVENTURE_THEMES.find(t=>t.id===theme)!.title.fr : ADVENTURE_THEMES.find(t=>t.id===theme)!.title.ar}</strong></p><p>{fr ? 'Observations des essais de cet enfant, conservées sur cet appareil. Une réussite ne suffit pas à déclarer une compétence acquise.' : 'ملاحظات محاولات هذا الطفل محفوظة على هذا الجهاز. لا تكفي إجابة ناجحة لإعلان إتقان المهارة.'}</p>
    {(Object.entries(PREMIUM_LAB_JOURNEYS) as [PremiumLab, typeof PREMIUM_LAB_JOURNEYS[PremiumLab]][]).map(([lab, journey]) => <section key={lab}><h5>{fr ? journey.title.fr : journey.title.ar}</h5><ul>{journey.steps.map((step, index) => {
      const result = results[premiumLabResultId(grade, lab, index, theme)];
      return <li key={index}><span>{fr ? step.fr : step.ar}</span><strong data-outcome={result?.outcome}>{result ? labels[result.outcome] : (fr ? 'Pas encore essayé' : 'لم يُجرّب بعد')}</strong></li>;
    })}</ul><p>{fr ? journey.transfer.fr : journey.transfer.ar}</p></section>)}
  </details>;
}
