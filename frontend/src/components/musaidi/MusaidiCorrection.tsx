import { MusaidiText } from './MusaidiText';
import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { MusaidiItem } from '../../data/musaidiBank';
import { useLocaleContext } from '../../context/LocaleContext';
import { speakText } from '../../utils/speech';
import { TwoColumnCorrection } from '../manipulations/TwoColumnProblem';
const button = 'min-h-[60px] min-w-[60px] rounded-xl border border-emerald-300 px-3 py-2 font-bold';
export function MusaidiCorrection({item, interactive, onComplete}: {item:MusaidiItem; interactive:boolean; onComplete?:()=>void}) {
  const {locale} = useLocaleContext(); const fr = locale === 'fr';
  const [visible,setVisible] = useState(0); const [trying,setTrying] = useState(false);
  const steps = [...item.stepsAr, item.answerAr];
  const complete = !interactive || visible >= steps.length;
  const listen = () => { const text = interactive ? steps.slice(0, visible).join('. ') : [item.answerAr,...item.stepsAr].join('. '); void speakText(text,'ar-SA').catch(()=>{}); };
  return <section className="rounded-xl bg-white border border-emerald-300 p-3 space-y-3" aria-label={fr?'Correction':'التصحيح'}>
    {interactive ? <>
      <p>{fr?'Avance à ton rythme. Tu peux réfléchir avant chaque étape.':'تقدّم حسب وتيرتك. يمكنك التفكير قبل كل خطوة.'}</p>
      <ol dir="rtl" className="list-decimal ps-5 space-y-2" aria-live="polite">{steps.slice(0,visible).map((s,i)=><li key={i}><MusaidiText text={s}/></li>)}</ol>
      {!complete && <>
        <button type="button" className={button} onClick={()=>setTrying(true)}>{fr?'Essayer l’étape suivante':'أحاول الخطوة التالية'}</button>
        {trying && <label className="block">{fr?'Ton essai (sans note)':'محاولتك (دون تقييم)'}<textarea key={visible} className="block w-full min-h-[90px] border rounded-xl p-2" dir="auto" /><span>{fr?'Compare ensuite avec la correction préparée.':'قارن بعدها مع التصحيح المحضّر.'}</span></label>}
        <button type="button" className={button} onClick={()=>{setVisible(visible+1);setTrying(false);if(visible+1>=steps.length)onComplete?.();}}>{fr?'Révéler l’étape':'أكشف الخطوة'}</button>
      </>}
    </> : <><p dir="rtl"><strong>{fr?'Réponse : ':'الجواب: '}</strong><MusaidiText text={item.answerAr} /></p><ol dir="rtl" className="list-decimal ps-5 space-y-1">{item.stepsAr.map((s,i)=><li key={i}><MusaidiText text={s}/></li>)}</ol></>}
    <button type="button" className={button} disabled={interactive && !visible} onClick={listen} aria-label={fr?'Écouter la correction':'استمع إلى التصحيح'}><Volume2 aria-hidden /></button>
    {complete && item.operationsAr && <TwoColumnCorrection solution={<p><MusaidiText text={item.answerAr} /></p>} operations={item.operationsAr} />}
    {complete && item.irabTableAr && <table dir="rtl" className="w-full table-fixed border text-base"><thead><tr><th scope="col" className="border p-2">الكلمة</th><th scope="col" className="border p-2">إعرابها</th></tr></thead><tbody>{item.irabTableAr.map((r,i)=><tr key={i}><td className="border p-2 break-words"><MusaidiText text={r.wordAr} /></td><td className="border p-2 break-words"><MusaidiText text={r.analysisAr} /></td></tr>)}</tbody></table>}
  </section>;
}
