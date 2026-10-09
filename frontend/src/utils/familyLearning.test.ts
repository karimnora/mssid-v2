import { describe, it, expect, beforeEach } from 'vitest';
import { FAMILY_MODULES } from '../data/family/familyContent';
import { getCompetence } from '../data/competences';
import { buildFamilySessions, checkFamilyAnswer, diagnosticTasks, FAMILY_GRADES, familyStorageKey, readFamilyResults, prioritizedModules } from './familyLearning';
describe('family learning content and planning',()=>{
 beforeEach(()=>localStorage.clear());
 it('has real corrected content for all five grades, without broken skill links',()=>{
  const ids=new Set<string>();
  for(const grade of FAMILY_GRADES){const modules=FAMILY_MODULES.filter(m=>m.grade===grade);expect(modules.length).toBeGreaterThanOrEqual(5);expect(diagnosticTasks(grade)).toHaveLength(3);
   for(const m of modules){expect(ids.has(m.id)).toBe(false);ids.add(m.id);expect(m.tasks).toHaveLength(3);for(const id of m.competenceIds)expect(getCompetence(id)?.grade).toBe(grade);
    for(const t of m.tasks){expect(ids.has(t.id)).toBe(false);ids.add(t.id);for(const v of [t.prompt,t.answer,t.hint,t.method]){expect(v.fr.trim().length).toBeGreaterThan(0);expect(v.ar.trim().length).toBeGreaterThan(0);}if(t.accepted)for(const answer of t.accepted)expect(checkFamilyAnswer(t,answer)).toBe(true);}
   }
  }
 });
 it('has arithmetically correct sums and differences in every grade',()=>{
  for(const m of FAMILY_MODULES.filter(m=>m.domain==='operations'))for(const t of m.tasks.slice(0,2)){const nums=t.prompt.fr.match(/\d+/g)!.map(Number);const expected=t.prompt.fr.includes('+')?nums[0]+nums[1]:nums[0]-nums[1];expect(t.accepted).toContain(String(expected));}
 });
 it('accepts Arabic digits and French decimal commas without accepting blank answers',()=>{
  const task=FAMILY_MODULES.find(m=>m.id==='5AP-decimals')!.tasks[0];expect(checkFamilyAnswer(task,'٤,٢٥')).toBe(true);expect(checkFamilyAnswer(task,'4.25')).toBe(true);expect(checkFamilyAnswer(task,'')).toBe(false);expect(checkFamilyAnswer(task,'4.5')).toBe(false);
 });
 it('reserves school-entry reading prerequisites and has a nonreading start for 1AP',()=>{
  expect(buildFamilySessions('entry','4AP',{}).every(s=>s.module.grade==='3AP')).toBe(true);
  expect(buildFamilySessions('entry','1AP',{})[0].module.id).toBe('readiness-1AP');
 });
 it('prioritizes an observed difficulty and does not leak another grade’s skill data',()=>{
  const results={'3AP-w1':{outcome:'review' as const,at:'2026-10-09T10:00:00Z'}};
  expect(prioritizedModules('3AP',results)[0].domain).toBe('writing');
  expect(buildFamilySessions('weekly','3AP',results)[0].module.domain).toBe('writing');
  expect(prioritizedModules('4AP',results)[0].domain).toBe('numbers');
 });
 it('has 20 holiday appointments and an explicitly repeated recall phase',()=>{
  for(const grade of FAMILY_GRADES){const sessions=[0,1,2,3].flatMap(w=>buildFamilySessions('holiday',grade,{},undefined,w));expect(sessions).toHaveLength(20);expect(new Set(sessions.map(s=>s.id)).size).toBe(20);expect(sessions.some(s=>s.phase==='recall')).toBe(true);}
 });
 it('targets the chosen evaluation topic for three, five or seven days',()=>{
  for(const days of [3,5,7]){const plan=buildFamilySessions('evaluation','5AP',{},undefined,0,'decimals',days);expect(plan).toHaveLength(days);expect(plan.every(s=>s.module.domain==='decimals')).toBe(true);}
 });
 it('keeps child/account observations separate and recovers from corrupt storage',()=>{
  const first=familyStorageKey('user:7:child:1','3AP');const second=familyStorageKey('user:7:child:2','3AP');
  localStorage.setItem(first,JSON.stringify({'3AP-n1':{outcome:'review',at:'2026-10-09T10:00:00Z'},oops:{outcome:'independent',at:'invalid'}}));expect(readFamilyResults(first)['3AP-n1'].outcome).toBe('review');expect(readFamilyResults(second)).toEqual({});expect(readFamilyResults(first).oops).toBeUndefined();localStorage.setItem(second,'broken');expect(readFamilyResults(second)).toEqual({});
 });
});
