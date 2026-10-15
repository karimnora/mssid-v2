import type { FamilyResults } from './familyLearning';
export function cleanLearningResults(raw: unknown): FamilyResults {
 if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
 return Object.fromEntries(Object.entries(raw).slice(0,1200).flatMap(([id,v])=> {
  if (!/^[A-Za-z0-9:_-]{1,160}$/.test(id) || !v || typeof v!=='object') return [];
  const r=v as Record<string,unknown>;
  if (!['independent','helped','review'].includes(String(r.outcome)) || typeof r.at!=='string' || !Number.isFinite(Date.parse(r.at))) return [];
  const completedAt=typeof r.completedAt==='string' && Number.isFinite(Date.parse(r.completedAt)) && Date.parse(r.completedAt)<=Date.parse(r.at) ? r.completedAt : r.outcome!=='review' ? r.at : undefined;
  return [[id,{outcome:r.outcome,at:r.at,...(completedAt?{completedAt}:{})}]];
 })) as FamilyResults;
}
export function mergeLearningResults(a: FamilyResults,b: FamilyResults): FamilyResults {
 const merged={...a};
 for(const [id,value] of Object.entries(b)) {
  const old=merged[id];
  if(!old){merged[id]=value;continue;}
  const comparison=Date.parse(value.at)-Date.parse(old.at);
  const latest=comparison>0 || comparison===0 && value.outcome>old.outcome ? value : old;
  const completedAt=[old.completedAt,value.completedAt].filter((v):v is string=>Boolean(v)).sort((x,y)=>Date.parse(x)-Date.parse(y))[0];
  merged[id]={...latest,...(completedAt?{completedAt}:{})};
 }
 return merged;
}
export function sameLearningResults(a: FamilyResults,b: FamilyResults): boolean {
 const keys=Object.keys(a);return keys.length===Object.keys(b).length && keys.every(id=>a[id].outcome===b[id]?.outcome && a[id].at===b[id]?.at && a[id].completedAt===b[id]?.completedAt);
}
