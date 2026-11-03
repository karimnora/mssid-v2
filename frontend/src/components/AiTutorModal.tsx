import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen } from 'lucide-react';
import type { CourseLesson, PrimaryGrade } from '../types';
import { useLocaleContext } from '../context/LocaleContext';
import { getCompetence, getLessonsForCompetence } from '../data/competences';
import { guidedHelpForGrade, guidedHelpForLesson } from '../data/guidedMath';
import { GuidedHelpCard } from './GuidedMathSupport';
import { MusaidiPanel } from './musaidi/MusaidiPanel';
import { stopSpeech } from '../utils/speech';
interface AiTutorModalProps {isOpen:boolean;onClose:()=>void;grade:PrimaryGrade;lesson?:CourseLesson|null;onReviewLesson?:(id:string)=>void;
 /** Published catalog for « مساعدي »; null while it loads. */
 courses?:CourseLesson[]|null}
type Tab='bank'|'guide';
// Name retained for existing callers. « مساعدي » has no external AI dependency: the question bank
// shows prepared corrections from the catalog, the guided tab shows prepared math methods.
export function AiTutorModal({isOpen,onClose,grade,lesson,onReviewLesson,courses=null}:AiTutorModalProps){
 const {locale,direction}=useLocaleContext();const fr=locale==='fr';const say=(a:string,b:string)=>fr?a:b;
 const [tab,setTab]=useState<Tab>('bank');
 const [viewGrade,setViewGrade]=useState<PrimaryGrade>(grade==='2AP'?'2AP':'1AP');const [selected,setSelected]=useState('');
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{if(!isOpen)return;setTab('bank');const pilot=grade==='2AP'?'2AP':'1AP';setViewGrade(pilot);setSelected(lesson&&lesson.grade===pilot?guidedHelpForLesson(lesson)[0]?.competenceId??'':'');},[isOpen,grade,lesson?.id]);
 useEffect(()=>{if(!isOpen)return;const previous=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';ref.current?.focus();const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.stopPropagation();onClose();}};window.addEventListener('keydown',escape,true);return()=>{window.removeEventListener('keydown',escape,true);document.body.style.overflow=overflow;previous?.focus();stopSpeech();}},[isOpen,onClose]);
 if(!isOpen)return null;
 const guides=guidedHelpForGrade(viewGrade);const baseGuide=guides.find(g=>g.competenceId===selected)??guides[0];const guide=(lesson?guidedHelpForLesson(lesson).find(g=>g.competenceId===baseGuide.competenceId):undefined)??baseGuide;const competence=getCompetence(guide.competenceId)!;
 const tabClass=(t:Tab)=>`min-h-12 rounded-xl px-4 font-bold border ${tab===t?'bg-emerald-800 text-white border-emerald-800':'bg-white border-emerald-200'}`;
 return createPortal(<div className="fixed inset-0 z-[110] bg-black/40 overflow-auto p-3 sm:p-6 flex items-start justify-center"><section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={say('Mon assistant MSSID','مساعدي')} data-learning-focus className="bg-white text-slate-800 rounded-3xl border border-emerald-100 p-5 w-full max-w-2xl space-y-5" dir={direction} onKeyDown={e=>{if(e.key!=='Tab')return;const items=ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),select,input');if(!items?.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===ref.current)){e.preventDefault();first.focus();}}}>
  <header className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-emerald-800">MSSID · {say('Corrections préparées, sans IA','تصحيحات محضّرة دون ذكاء اصطناعي')}</p><h2 className="text-xl font-black">{say('Mon assistant','مساعدي')}</h2></div><button type="button" className="min-h-12 min-w-12 rounded-xl border border-slate-200 grid place-items-center" onClick={onClose} aria-label={say('Fermer','أغلق')}><X aria-hidden/></button></header>
  <div className="flex flex-wrap gap-2" role="group" aria-label={say('Mode d’aide','نوع المساعدة')}>
   <button type="button" aria-pressed={tab==='bank'} className={tabClass('bank')} onClick={()=>{stopSpeech();setTab('bank');}}>{say('Questions de l’année','أسئلة السنة')}</button>
   <button type="button" aria-pressed={tab==='guide'} className={tabClass('guide')} onClick={()=>{stopSpeech();setTab('guide');}}>{say('Méthode guidée','طريقة موجّهة')}</button>
  </div>
  {tab==='bank'?<>
   <p className="text-sm leading-relaxed">{say('Choisis ta matière, puis une question du programme : indice et règle libres, puis la correction pas à pas.','اختر المادة ثم سؤالاً من البرنامج: تلميح وقاعدة الدرس مجاناً، ثم التصحيح خطوة بخطوة.')}</p>
   <MusaidiPanel grade={grade} lesson={lesson} courses={courses} onReviewLesson={onReviewLesson} onClose={onClose}/>
  </>:<>
  <p className="text-sm leading-relaxed">{say('Choisis une notion pour recevoir des indices, une méthode et un exemple corrigé. Avance à ton rythme : tu peux essayer plusieurs fois.','اختر فكرة للحصول على مساعدات وطريقة ومثال مصحّح. تعلّم حسب وتيرتك، يمكنك المحاولة عدة مرات.')}</p>
  {!['1AP','2AP'].includes(grade)&&<p className="rounded-xl bg-amber-50 p-3 text-sm">{say('Le pilote couvre les maths de 1AP et 2AP. Les autres cours restent accessibles ; leur aide guidée sera ajoutée progressivement.','تشمل البداية رياضيات 1AP و2AP. تبقى الدروس الأخرى متاحة وسنضيف مساعدتها تدريجياً.')}</p>}
  <div className="flex gap-2">{(['1AP','2AP'] as const).map(g=><button key={g} type="button" className={`min-h-12 rounded-xl px-5 font-bold border ${viewGrade===g?'bg-emerald-800 text-white border-emerald-800':'bg-white border-emerald-200'}`} aria-pressed={viewGrade===g} onClick={()=>{setViewGrade(g);setSelected('')}}>{g}</button>)}</div>
  <label className="block font-bold">{say('Notion à travailler','الفكرة التي أعمل عليها')}<select className="block w-full min-h-12 rounded-xl border border-emerald-300 bg-white px-3 mt-2" value={guide.competenceId} onChange={e=>setSelected(e.target.value)}>{guides.map(g=><option key={g.competenceId} value={g.competenceId}>{fr?getCompetence(g.competenceId)?.labelFr:getCompetence(g.competenceId)?.labelAr}</option>)}</select></label>
  <h3 className="font-black">{fr?competence.labelFr:competence.labelAr}</h3><GuidedHelpCard key={`${viewGrade}:${guide.competenceId}`} guide={guide}/>
  {onReviewLesson&&getLessonsForCompetence(guide.competenceId)[0]&&<button type="button" className="min-h-12 rounded-xl bg-emerald-800 text-white px-4 font-bold inline-flex gap-2 items-center" onClick={()=>{onClose();onReviewLesson(getLessonsForCompetence(guide.competenceId)[0])}}><BookOpen size={18} aria-hidden/>{say('Revoir le cours lié','أراجع الدرس المرتبط')}</button>}
  </>}
 </section></div>,document.body);
}
