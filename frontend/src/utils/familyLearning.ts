import { ENRICHMENT_MODULES } from '../data/family/enrichmentContent';
import { MARKET_PLANS } from '../data/market/marketMission';
import { GARDEN_PLANS } from '../data/garden/gardenMission';
import { MOSAIC_TASKS } from '../data/family/mosaicWorkshop';
import { ADVENTURE_THEMES } from '../data/family/themedAdventures';
import { premiumLabResultId, premiumLabResultIds } from '../data/family/premiumLabJourneys';
import type { PrimaryGrade, UserProfile } from '../types';
import { FAMILY_MODULES, type FamilyDomain, type FamilyModule, type FamilyTask } from '../data/family/familyContent';
export const FAMILY_GRADES: PrimaryGrade[] = ['1AP', '2AP', '3AP', '4AP', '5AP'];
export type FamilyService = 'holiday' | 'entry' | 'weekly' | 'evaluation';
export type TaskOutcome = 'independent' | 'helped' | 'review';
export type FamilyResults = Record<string, { outcome: TaskOutcome; at: string; completedAt?: string }>;
export interface FamilySession { id: string; module: FamilyModule; taskIds: string[]; phase: 'discover' | 'practice' | 'recall' | 'transfer'; }
export function familyStorageKey(owner: string, grade: PrimaryGrade) { return `mssid_family_learning_v1:${owner}:${grade}`; }
export function readFamilyResults(key: string): FamilyResults {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const known = new Set([...ENRICHMENT_MODULES.flatMap(m => m.tasks.map(t => t.id)), ...FAMILY_GRADES.flatMap(g => MARKET_PLANS[g].tasks.map(t => t.id)), ...FAMILY_MODULES.flatMap(m => m.tasks.map(t => t.id)), 'readiness-count','readiness-oral','readiness-draw', ...FAMILY_GRADES.flatMap(g => GARDEN_PLANS[g].tasks.map(t => t.id)), ...FAMILY_GRADES.flatMap(g => MOSAIC_TASKS[g].map(t => t.id)), ...FAMILY_GRADES.flatMap(premiumLabResultIds), ...FAMILY_GRADES.flatMap(g => [`lab:${g}:operations`,`lab:${g}:measures`])]);
    return Object.fromEntries(Object.entries(parsed).filter(([id, v]) => known.has(id) && v && typeof v === 'object' && ['independent','helped','review'].includes(v.outcome) && typeof v.at === 'string' && Number.isFinite(Date.parse(v.at))).map(([id, value]) => {
      const completedAt = typeof value.completedAt === 'string' && Number.isFinite(Date.parse(value.completedAt)) ? value.completedAt : value.outcome !== 'review' ? value.at : undefined;
      return [id, { outcome: value.outcome, at: value.at, ...(completedAt ? { completedAt } : {}) }];
    }));
  } catch { return {}; }
}
export function normalizeFamilyAnswer(value: string): string {
  return value.normalize('NFKC').replace(/[٠-٩]/g, d => String(d.charCodeAt(0)-1632)).replace(/[۰-۹]/g, d => String(d.charCodeAt(0)-1776)).replace(/[\s٬]/g, '').replace(',', '.').toLocaleLowerCase();
}
export function checkFamilyAnswer(task: FamilyTask, answer: string): boolean | null {
  if (!task.accepted) return null;
  return task.accepted.some(a => normalizeFamilyAnswer(a) === normalizeFamilyAnswer(answer));
}
export function prioritizedModules(grade: PrimaryGrade, results: FamilyResults, profile?: UserProfile): FamilyModule[] {
  const modules = FAMILY_MODULES.filter(m => m.grade === grade);
  const priority = (m: FamilyModule) => {
    const labIds = ADVENTURE_THEMES.flatMap(theme => m.domain === 'reading' ? [0, 1, 2].map(step => premiumLabResultId(grade, 'story', step, theme.id))
      : ['numbers', 'operations', 'measures'].includes(m.domain) ? [premiumLabResultId(grade, 'market', ['numbers', 'operations', 'measures'].indexOf(m.domain), theme.id)] : []);
    const outcomes = [...m.tasks.map(t => results[t.id]?.outcome), ...labIds.flatMap(id => results[id] ? [results[id].outcome] : []), results[`lab:${grade}:${m.domain}`]?.outcome];
    const misses = outcomes.filter(o => o === 'review').length;
    const help = outcomes.filter(o => o === 'helped').length;
    const profileMiss = profile?.grade === grade && m.competenceIds.some(id => profile.competenceStats?.[id]?.lastOutcome === 'fail');
    return misses * 6 + help * 3 + (profileMiss ? 6 : 0) + outcomes.filter(o => !o).length - outcomes.filter(o => o === 'independent').length;
  };
  return [...modules].sort((a,b) => priority(b)-priority(a));
}
const readiness: FamilyModule = { id: 'readiness-1AP', grade:'1AP', domain:'numbers', title:{fr:'Avant la 1AP : observer et raconter',ar:'قبل 1AP: ألاحظ وأحكي'}, objective:{fr:'Préparer les bases sans exiger de savoir déjà lire.',ar:'تهيئة الأساس دون اشتراط القراءة مسبقاً.'}, competenceIds:[], tasks:[
 {id:'readiness-count', prompt:{fr:'Pose 5 bouchons. Compte-les, puis enlève un bouchon. Combien reste-t-il ?',ar:'ضع 5 أغطية. عدّها ثم احذف غطاءً. كم بقي؟'},answer:{fr:'4 bouchons.',ar:'4 أغطية.'}, hint:{fr:'Touche chaque objet une seule fois.',ar:'المس كل غطاء مرة واحدة.'},method:{fr:'Il reste 4 objets. Le parent observe la correspondance entre un objet et un mot-nombre.',ar:'بقيت 4 أغطية. يلاحظ الوالد الربط بين كل غطاء وعدد.'},accepted:['4']},
 {id:'readiness-oral', prompt:{fr:'Raconte ce que tu fais le matin avec : d’abord, puis, enfin.',ar:'احكِ ما تفعله صباحاً باستعمال: أولاً، ثم، أخيراً.'},answer:{fr:'Accepte une routine racontée dans un ordre compréhensible.',ar:'تُقبل عادات صباحية مرتّبة ومفهومة.'},hint:{fr:'Le parent pose une question à la fois.',ar:'يسأل الوالد سؤالاً واحداً في كل مرة.'},method:{fr:'Observe trois moments ordonnés. L’enfant peut parler dans sa langue habituelle ; aucune lecture requise.',ar:'نلاحظ ثلاثة أحداث مرتّبة. يتكلم الطفل بلغته المعتادة ولا تُشترط القراءة.'}},
 {id:'readiness-draw', prompt:{fr:'Trace un rond et une ligne sur une feuille. Place un petit objet sous la feuille.',ar:'ارسم دائرة وخطاً على ورقة. ضع شيئاً صغيراً تحت الورقة.'},answer:{fr:'Un rond, une ligne et l’objet sous la feuille.',ar:'دائرة وخط وشيء تحت الورقة.'},hint:{fr:'Montre le geste, puis laisse l’enfant essayer.',ar:'اعرض الحركة ثم دع الطفل يحاول.'},method:{fr:'Observe le geste et le mot sous. Pas de note sur la beauté du dessin.',ar:'نلاحظ الحركة وفهم كلمة تحت. لا نقيّم جمال الرسم.'}}
] };
export function diagnosticTasks(grade: PrimaryGrade): { module: FamilyModule; task: FamilyTask }[] {
  return ['numbers','operations','reading'].flatMap(domain => {
    const module = FAMILY_MODULES.find(m => m.grade===grade && m.domain===domain);
    return module ? [{module,task:module.tasks[0]}] : [];
  });
}
export function buildFamilySessions(service: FamilyService, grade: PrimaryGrade, results: FamilyResults, profile?: UserProfile, week=0, domain?: FamilyDomain, days=5): FamilySession[] {
  const sourceGrade = service==='entry' ? FAMILY_GRADES[Math.max(0,FAMILY_GRADES.indexOf(grade)-1)] : grade;
  let modules = prioritizedModules(sourceGrade, results, profile);
  if (service==='entry' && grade==='1AP') modules=[readiness];
  if (service==='evaluation' && domain) modules=modules.filter(m => m.domain===domain);
  if (!modules.length) return [];
  const count = service==='holiday' || service==='weekly' || service==='entry' ? 5 : Math.min(7,Math.max(3,days));
  // Keep a new week stable; spaced recall is explicit, not marketed as unseen content.
  const phases: FamilySession['phase'][] = ['discover','practice','recall','transfer','recall'];
  const selected = service==='weekly' ? modules.slice(0,3) : modules;
  return Array.from({length:count},(_,i) => {
    const module=selected[(i+(service==='holiday' ? week*2 : 0))%selected.length];
    const phase=phases[(i+week)%phases.length];
    const order=service==='evaluation' && i<3 ? [module.tasks[i]] : phase==='recall' ? [...module.tasks].reverse() : module.tasks;
    return {id:`${service}:${grade}:${week}:${i}:${module.id}`,module,taskIds:order.map(t=>t.id),phase};
  });
}
