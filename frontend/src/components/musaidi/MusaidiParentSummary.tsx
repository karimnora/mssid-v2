import React, {useSyncExternalStore} from 'react';
import type {CourseLesson, PrimaryGrade} from '../../types';
import {getCompetence} from '../../data/competences';
import {readMusaidiHelp} from '../../utils/musaidiHistory';
import {getActiveProgressOwner, subscribeProgressOwner} from '../../utils/progressOwner';
import {useLocaleContext} from '../../context/LocaleContext';
/** Arabic counted noun: مرة واحدة، مرتين، 3–10 مرات، 11+ مرة. */
export function arabicTimes(count:number):React.ReactNode {
  if(count===1)return 'مرة واحدة';
  if(count===2)return 'مرتين';
  return <><bdi dir="ltr">{count}</bdi> {count%100>=3&&count%100<=10?'مرات':'مرة'}</>;
}
export function MusaidiParentSummary({grade,courses,onReview}: {grade:PrimaryGrade;courses:CourseLesson[];onReview:(id:string)=>void}) {
  const owner=useSyncExternalStore(subscribeProgressOwner,getActiveProgressOwner,()=> 'guest');
  const {locale}=useLocaleContext();const fr=locale==='fr';
  const rows=readMusaidiHelp(owner).filter(r=>r.grade===grade && courses.some(l=>l.id===r.lessonId && l.grade===grade));
  if(!rows.length)return null;
  return <section className="rounded-2xl border border-emerald-200 p-4 space-y-3" data-musaidi-parent>
    <h3 className="font-bold">{fr?'Les demandes d’aide dans مساعدي':'طلبات المساعدة في مساعدي'}</h3>
    {rows.map(r=>{const lesson=courses.find(l=>l.id===r.lessonId)!;const competence=r.competenceId?getCompetence(r.competenceId):undefined;const label=competence?(fr?competence.labelFr:competence.labelAr):lesson.titleAr;
      return <div key={`${r.lessonId}:${r.competenceId??''}`} className="space-y-2"><p>{fr?<>Aide demandée <bdi dir="ltr">{r.count}</bdi> fois pour :</>:<>طلب المساعدة {arabicTimes(r.count)} في:</>} {label}</p><p>{fr?'Révision conseillée :':'المراجعة المقترحة:'} {lesson.titleAr}</p><button type="button" className="min-h-[60px] rounded-xl border border-emerald-300 px-4 font-bold" onClick={()=>onReview(lesson.id)}>{fr?'Revoir la leçon':'أراجع الدرس'}</button></div>;
    })}
    <p>{fr?'Compteurs sur cet appareil. Une demande correspond à l’ouverture d’un indice, d’une règle ou d’une correction dans une question.':'عدادات على هذا الجهاز. يُحتسب الطلب عند فتح تلميح أو قاعدة أو تصحيح في سؤال.'}</p>
  </section>;
}
