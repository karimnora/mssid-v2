import { MusaidiText } from './MusaidiText';
import React, {useState} from 'react';
import type {CourseLesson} from '../../types';
import type {MusaidiItem} from '../../data/musaidiBank';
import type {PracticeResult} from '../../utils/competenceProgress';
import {useLocaleContext} from '../../context/LocaleContext';
import {shuffleOptions} from '../lessonViewer/shared';
export function twinOptions(item:MusaidiItem, courses:CourseLesson[]) {
  const lesson = courses.find(l=>l.id===item.lessonId);
  if (item.kind==='quiz') return lesson?.quiz.find(q=>q.id===item.sourceId)?.options;
  const exercise = lesson?.progressiveExercises?.find(e=>e.id===item.sourceId);
  return exercise?.type === 'qcm' || exercise?.type === 'true_false' ? exercise.options : undefined;
}
export function findMusaidiTwin(item:MusaidiItem, bank:MusaidiItem[], courses:CourseLesson[]) {
  if(!item.competenceId)return undefined;
  return bank.find(candidate=>candidate.id!==item.id && candidate.questionAr!==item.questionAr && candidate.competenceId===item.competenceId && twinOptions(candidate,courses)?.filter(o=>o.isCorrect).length===1);
}
export function MusaidiTwin({item,courses,onPracticeResult}: {item:MusaidiItem;courses:CourseLesson[];onPracticeResult:(id:string,result:PracticeResult)=>void}) {
  const {locale}=useLocaleContext();const fr=locale==='fr';
  const [chosen,setChosen]=useState<string|null>(null);const [done,setDone]=useState(false);const [missed,setMissed]=useState(false);
  // Authored data store the right answer first; shuffle once per twin, as the lesson quiz does.
  const [options]=useState(()=>shuffleOptions(twinOptions(item,courses)??[]));
  // Only lesson exercises can later leave the missed list (by redoing them alone); quiz ids would stay forever.
  const exerciseId=item.kind==='exercise'?item.sourceId:undefined;
  return <section className="rounded-xl border border-sky-300 bg-sky-50 p-3 space-y-3" aria-label={fr?'Question jumelle':'سؤال مشابه'}>
    <h3 className="font-bold">{fr?'À toi : une question de la même compétence':'دورك: سؤال من نفس المهارة'}</h3>
    <p dir="rtl"><MusaidiText text={item.questionAr} /></p>
    {options.map(option=><button type="button" key={option.id} disabled={done} aria-pressed={chosen===option.id} className="block w-full min-h-[60px] rounded-xl border bg-white p-3 text-start" onClick={()=>{
      setChosen(option.id);
      if(option.isCorrect){setDone(true);onPracticeResult(item.lessonId,{outcome:'success',helped:true,exerciseId,competenceId:item.competenceId});}
      else if(!missed){setMissed(true);onPracticeResult(item.lessonId,{outcome:'fail',helped:true,exerciseId,competenceId:item.competenceId});}
    }}><MusaidiText text={option.textAr} /></button>)}
    {chosen && <p role="status">{done?(fr?'Réussi avec aide.':'نجحت بمساعدة.'):(fr?'Réessaie, prends ton temps.':'حاول مجدداً، خذ وقتك.')}</p>}
    <p>{fr?'Cet entraînement est enregistré avec aide, sans points ni validation de leçon.':'يُسجّل هذا التدريب بمساعدة، دون نقاط أو إكمال الدرس.'}</p>
  </section>;
}
