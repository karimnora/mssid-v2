import type {UserProfile} from '../types';
type Notebook=Pick<UserProfile,'competenceStats'|'lessonSessions'>;
export function mergeNotebookProgress(local:Notebook,remote:Notebook):Notebook {
 const competenceStats={...local.competenceStats};
 for(const [id,next] of Object.entries(remote.competenceStats??{})){
  const old=competenceStats[id];if(!old){competenceStats[id]=next;continue;}
  const latest=Date.parse(next.lastAt)>=Date.parse(old.lastAt)?next:old;
  competenceStats[id]={...latest,attempts:Math.max(old.attempts,next.attempts),successes:Math.max(old.successes,next.successes),failures:Math.max(old.failures??0,next.failures??0),alone:Math.max(old.alone??0,next.alone??0),helped:Math.max(old.helped??0,next.helped??0),missedExerciseIds:latest.missedExerciseIds??[]};
 }
 const sessions=[...(local.lessonSessions??[]),...(remote.lessonSessions??[])];
 const unique=new Map<string,NonNullable<UserProfile['lessonSessions']>[number]>();
 for(const session of sessions){
  const key=session.villageSummary ? session.lessonId+'|summary|'+session.villageSummary.id : [session.lessonId,session.at,session.outcome].join('|');
  const old=unique.get(key);
  if(!old || Date.parse(session.at)>=Date.parse(old.at)) unique.set(key,session);
 }
 return {competenceStats,lessonSessions:[...unique.values()].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)).slice(-200)};
}
