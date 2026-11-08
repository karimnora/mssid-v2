import {describe,it,expect} from 'vitest';
import {buildMusaidiBank} from '../data/musaidiBank';
import {musaidiSuggestions} from './musaidiPersonalization';
import type {CourseLesson} from '../types';
const lesson={id:'math-5ap-fractions',grade:'5AP',subject:'math',trimester:1,quiz:[{id:'q1',questionAr:'سؤال',options:[{id:'a',textAr:'جواب',isCorrect:true}]}]} as CourseLesson;
const bank=buildMusaidiBank([lesson]);
const stat={attempts:1,successes:0,lastAt:'2026-11-08T10:00:00Z',lastLessonId:lesson.id,lastOutcome:'fail' as const};
const now=new Date('2026-11-08T12:00:00Z');
describe('musaidi real difficulty recommendations',()=>{
 it('returns nothing without evidence or for unknown competence',()=>{
  expect(musaidiSuggestions(bank,{},now)).toEqual([]);
  expect(musaidiSuggestions(bank,{'unknown':stat},now)).toEqual([]);
 });
 it('uses a real mapped skill and states the reason',()=>{
  const items=musaidiSuggestions(bank,{'math-5ap-c-fractions':stat},now);
  expect(items).toHaveLength(1);expect(items[0].reasonFr).toMatch(/fractions/);expect(items[0].item.id).toBe(bank[0].id);
 });
 it('ignores stale failures and resolved errors',()=>{
  expect(musaidiSuggestions(bank,{'math-5ap-c-fractions':{...stat,lastAt:'2026-01-01'}},now)).toEqual([]);
  expect(musaidiSuggestions(bank,{'math-5ap-c-fractions':{...stat,lastOutcome:'success'}},now)).toEqual([]);
 });
 it('never returns another grade or semester outside the supplied bank',()=>{
  expect(musaidiSuggestions(bank.filter(i=>i.trimester===2),{'math-5ap-c-fractions':stat},now)).toEqual([]);
  expect(musaidiSuggestions(bank,{'math-1ap-c-addition':stat},now)).toEqual([]);
 });
});
