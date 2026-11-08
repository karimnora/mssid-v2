import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ModalCloseButton } from './ui/ModalCloseButton';
import { DidouPortrait } from './world/DidouPortrait';
import type { CourseLesson, PrimaryGrade } from '../types';
import { useLocaleContext } from '../context/LocaleContext';
import { MusaidiPanel } from './musaidi/MusaidiPanel';
import { stopSpeech } from '../utils/speech';
interface AiTutorModalProps {isOpen:boolean;onClose:()=>void;grade:PrimaryGrade;lesson?:CourseLesson|null;onReviewLesson?:(id:string)=>void;
 /** Published catalog for « مساعدي »; null while it loads. */
 courses?:CourseLesson[]|null}
export function AiTutorModal({isOpen,onClose,grade,lesson,onReviewLesson,courses=null}:AiTutorModalProps){
 const {locale,direction}=useLocaleContext();const fr=locale==='fr';const say=(a:string,b:string)=>fr?a:b;
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{if(!isOpen)return;const previous=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';ref.current?.focus();const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.stopPropagation();onClose();}};window.addEventListener('keydown',escape,true);return()=>{window.removeEventListener('keydown',escape,true);document.body.style.overflow=overflow;previous?.focus();stopSpeech();}},[isOpen,onClose]);
 if(!isOpen)return null;
 return createPortal(<div className="fixed inset-0 z-[110] bg-black/40 overflow-auto p-3 sm:p-6 flex items-start justify-center"><section ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={say('Mon assistant MSSID','مساعدي')} data-learning-focus data-musaidi-modal className="bg-white text-slate-800 rounded-3xl border border-emerald-100 p-5 w-full max-w-2xl space-y-5" dir={direction} onKeyDown={e=>{if(e.key!=='Tab')return;const items=ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),select,input');if(!items?.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===ref.current)){e.preventDefault();first.focus();}}}>
  <header className="flex items-start justify-between gap-3"><DidouPortrait size={72} className="world-only musaidi-didou shrink-0"/><div className="flex-1 min-w-0"><p className="text-base font-bold text-emerald-800">MSSID · {say('Corrections préparées, sans IA','تصحيحات محضّرة دون ذكاء اصطناعي')}</p><h2 className="text-xl font-black">{say('Mon assistant','مساعدي')}</h2></div><ModalCloseButton onClose={onClose} className="min-h-[60px] min-w-[60px]"/></header>
  <p className="text-base leading-relaxed">{say('Choisis ta matière, ta leçon, puis une question. Les indices, la règle et la voix restent gratuits.','اختر المادة ثم الدرس ثم السؤال. التلميحات وقاعدة الدرس والصوت متاحة مجاناً.')}</p>
  <MusaidiPanel key={`${grade}:${lesson?.id??'menu'}`} grade={grade} lesson={lesson} courses={courses} onReviewLesson={onReviewLesson} onClose={onClose}/>
 </section></div>,document.body);
}
