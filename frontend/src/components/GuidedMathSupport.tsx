import React, { useEffect, useState } from 'react';
import { Lightbulb, ListOrdered, BookOpen, Volume2 } from 'lucide-react';
import { useLocaleContext } from '../context/LocaleContext';
import { getCompetence } from '../data/competences';
import { guidedHelpForLesson, type GuidedMathHelp, type HelpText } from '../data/guidedMath';
import type { CourseLesson, QuizQuestion } from '../types';
import { speakText, stopSpeech } from '../utils/speech';
export function GuidedMathSupport({lesson,question}:{lesson:CourseLesson;question?:QuizQuestion}) {
 const guides=guidedHelpForLesson(lesson,question);
 const {locale}=useLocaleContext();const fr=locale==='fr';
 const [open,setOpen]=useState(false);const [selected,setSelected]=useState('');
 if(!guides.length)return null;
 const guide=guides.find(g=>g.competenceId===selected)??guides[0];
 return <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 space-y-3" data-guided-support>
  <button type="button" className="min-h-[60px] px-3 font-extrabold text-emerald-900 inline-flex items-center gap-2" aria-expanded={open} onClick={()=>setOpen(!open)}><Lightbulb size={18} aria-hidden/>{fr?'J’ai besoin d’aide':'أحتاج إلى مساعدة'}</button>
  {open&&<>
   {guides.length>1&&<label className="block font-bold text-sm text-slate-800">{fr?'Choisis la notion de cette question':'اختر فكرة هذا السؤال'}<select className="block w-full min-h-[60px] rounded-xl bg-white border border-emerald-300 px-3 mt-1" value={guide.competenceId} onChange={e=>setSelected(e.target.value)}>{guides.map(g=><option key={g.competenceId} value={g.competenceId}>{fr?getCompetence(g.competenceId)?.labelFr:getCompetence(g.competenceId)?.labelAr}</option>)}</select></label>}
   <GuidedHelpCard key={`${lesson.id}:${question?.id??'lesson'}:${guide.competenceId}`} guide={guide}/>
  </>}
 </section>;
}
export function GuidedHelpCard({guide,onHelp}:{guide:GuidedMathHelp;onHelp?:()=>void}) {
 const {locale,direction}=useLocaleContext();const fr=locale==='fr';const say=(a:string,b:string)=>fr?a:b;const text=(v:HelpText)=>fr?v.fr:v.ar;
 const [hint,setHint]=useState(0);const [method,setMethod]=useState(false);const [example,setExample]=useState(false);const [chosen,setChosen]=useState<number|null>(null);
 useEffect(()=>()=>stopSpeech(),[]);
 const action='min-h-[60px] rounded-xl border border-emerald-300 bg-white text-emerald-950 font-bold px-3 py-2 inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-emerald-700';
 return <div className="space-y-3 text-slate-800" dir={direction} data-guided-competence={guide.competenceId}>
  <p className="text-base leading-relaxed">{say('Aide préparée pour cette notion. Essaie d’abord ; un exemple similaire ne donne pas la réponse de ta question.','مساعدة معدّة لهذه الفكرة. حاول أولاً، المثال المشابه لا يعطي إجابة سؤالك.')}</p>
  <div className="flex flex-wrap gap-2"><button type="button" className={action} disabled={hint>=guide.hints.length} onClick={()=>{onHelp?.();setHint(hint+1);}}><Lightbulb size={16} aria-hidden/>{hint===0?say('Un indice','مساعدة'):hint>=guide.hints.length?say('Tous les indices affichés','كل المساعدات معروضة'):say('Un autre indice','مساعدة أخرى')}</button><button type="button" className={action} aria-expanded={method} onClick={()=>{if(!method)onHelp?.();setMethod(!method);}}><ListOrdered size={16} aria-hidden/>{say('Explique la méthode','اشرح الطريقة')}</button><button type="button" className={action} aria-expanded={example} onClick={()=>{if(!example)onHelp?.();setExample(!example);}}><BookOpen size={16} aria-hidden/>{say('Un exemple similaire','مثال مشابه')}</button></div>
  {hint>0&&<div className="rounded-xl bg-white border border-emerald-200 p-3 space-y-2" aria-live="polite"><ol className="list-decimal ps-5 space-y-2">{guide.hints.slice(0,hint).map((h,i)=><li key={i}>{text(h)}</li>)}</ol><button type="button" className={action} onClick={()=>{void speakText(text(guide.hints[hint-1]),fr?'fr-FR':'ar-SA',0.85)}}><Volume2 size={16} aria-hidden/>{say('Écouter l’indice','أسمع المساعدة')}</button></div>}
  {method&&<ol className="list-decimal ps-8 rounded-xl bg-white border border-emerald-200 p-3 space-y-2">{guide.steps.map((s,i)=><li key={i}>{text(s)}</li>)}</ol>}
  {example&&<div className="rounded-xl bg-white border border-emerald-200 p-4 space-y-3"><h4 className="font-extrabold">{say('Entraînement séparé','تدريب منفصل')}</h4><p>{text(guide.example.prompt)}</p><div className="grid gap-2">{guide.example.options.map((option,i)=><button type="button" key={i} className={action} aria-pressed={chosen===i} disabled={chosen===guide.example.correct} onClick={()=>setChosen(i)}>{text(option)}</button>)}</div>{chosen!==null&&<p role="status" className="rounded-xl p-3 bg-emerald-50">{chosen===guide.example.correct?text(guide.example.explanation):say('Réessaie : utilise un indice et explique ton raisonnement.','حاول مجدداً: استعمل المساعدة واشرح تفكيرك.')}</p>}<p className="text-base">{say('Sans points ni validation du cours. Reviens ensuite à ta question.','دون نقاط أو إكمال الدرس. ارجع بعدها إلى سؤالك.')}</p><button type="button" className={action} onClick={()=>setChosen(null)}>{say('Refaire cet exemple','أعيد هذا المثال')}</button></div>}
 </div>;
}
