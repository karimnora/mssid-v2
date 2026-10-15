import type {UserProfile} from '../types';
type Notebook=Pick<UserProfile,'competenceStats'|'lessonSessions'>;
export function mergeNotebookProgress(local:Notebook,remote:Notebook):Notebook {
 const competenceStats={...local.competenceStats};
 for(const [id,next] of Object.entries(remote.competenceStats??{})){
  const old=competenceStats[id];if(!old){competenceStats[id]=next;continue;}
  const latest=Date.parse(next.lastAt)>=Date.parse(old.lastAt)?next:old;
  competenceStats[id]={...latest,attempts:Math.max(old.attempts,next.attempts),successes:Math.max(old.successes,next.successes),failures:Math.max(old.failures??0,next.failures??0)};
 }
 const sessions=[...(local.lessonSessions??[]),...(remote.lessonSessions??[])];
 const unique=new Map(sessions.map(s=>[[s.lessonId,s.at,s.outcome].join('|'),s]));
 return {competenceStats,lessonSessions:[...unique.values()].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at)).slice(-200)};
}
