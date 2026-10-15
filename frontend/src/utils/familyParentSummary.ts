import {MOSAIC_TASKS} from '../data/family/mosaicWorkshop';
import {premiumLabResultId,PREMIUM_LAB_JOURNEYS,type PremiumLab} from '../data/family/premiumLabJourneys';
import {ADVENTURE_THEMES} from '../data/family/themedAdventures';
import { FAMILY_MODULES } from '../data/family/familyContent';
import { ENRICHMENT_MODULES } from '../data/family/enrichmentContent';
import { GARDEN_PLANS } from '../data/garden/gardenMission';
import { MARKET_PLANS } from '../data/market/marketMission';
import type { PrimaryGrade } from '../types';
import type { FamilyResults } from './familyLearning';
export function familyParentSummary(grade:PrimaryGrade,results:FamilyResults,now=Date.now()) {
 const modules=[...FAMILY_MODULES,...ENRICHMENT_MODULES].filter(m=>m.grade===grade);
 const labels=new Map(modules.flatMap(m=>m.tasks.map(t=>[t.id,{title:m.title,moduleId:m.id}] as const)));
 for(const plan of [GARDEN_PLANS[grade],MARKET_PLANS[grade]])for(const task of plan.tasks)labels.set(task.id,{title:task.title,moduleId:''});
 for(const task of MOSAIC_TASKS[grade])labels.set(task.id,{title:{fr:'Atelier mosaïque',ar:'ورشة الفسيفساء'},moduleId:'mosaic'});
 for(const theme of ADVENTURE_THEMES)for(const lab of Object.keys(PREMIUM_LAB_JOURNEYS) as PremiumLab[])PREMIUM_LAB_JOURNEYS[lab].steps.forEach((title,i)=>labels.set(premiumLabResultId(grade,lab,i,theme.id),{title,moduleId:'lab:'+theme.id+':'+lab}));
 if(grade==='1AP')for(const [id,title] of [['readiness-count',{fr:'Compter avec des objets',ar:'العدّ باستعمال الأشياء'}],['readiness-oral',{fr:'Raconter dans l’ordre',ar:'أحكي بالترتيب'}],['readiness-draw',{fr:'Tracer et se repérer',ar:'أرسم وأحدّد المكان'}]] as const)labels.set(id,{title,moduleId:'readiness-1AP'});
 const rows=Object.entries(results).filter(([id])=>labels.has(id)).map(([id,r])=>({id,...r,...labels.get(id)!}));
 const week=rows.filter(r=>Date.parse(r.at)>=now-7*86400000 && Date.parse(r.at)<=now);
 const next=rows.filter(r=>r.outcome!=='independent').sort((a,b)=>(a.outcome==='review'?0:1)-(b.outcome==='review'?0:1)||Date.parse(a.at)-Date.parse(b.at)).filter((r,i,all)=>all.findIndex(v=>v.moduleId ? v.moduleId===r.moduleId:v.id===r.id)===i).slice(0,3);
 return {week,independent:week.filter(r=>r.outcome==='independent').length,helped:week.filter(r=>r.outcome==='helped').length,review:week.filter(r=>r.outcome==='review').length,next};
}
