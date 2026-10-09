import {describe,it,expect} from 'vitest';
import {GUIDED_MATH_HELP,guidedHelpForGrade,guidedHelpForLesson} from './guidedMath';
import {COMPETENCES,LESSON_COMPETENCES,getCompetence} from './competences';
import type {CourseLesson,QuizQuestion} from '../types';
describe('Prepared maths help coverage and contextual boundaries',()=>{
 it('covers every mapped maths skill in the two pilot grades with bilingual complete help',()=>{
  const expected=COMPETENCES.filter(c=>c.subject==='math'&&['1AP','2AP'].includes(c.grade)).map(c=>c.id).sort();
  expect(GUIDED_MATH_HELP.map(g=>g.competenceId).sort()).toEqual(expected);
  for(const g of GUIDED_MATH_HELP){expect(g.hints).toHaveLength(3);expect(g.steps).toHaveLength(3);expect(g.example.options).toHaveLength(3);
   expect(g.example.correct).toBeGreaterThanOrEqual(0);expect(g.example.correct).toBeLessThan(g.example.options.length);
   for(const t of [...g.hints,...g.steps,g.example.prompt,g.example.explanation,...g.example.options]){expect(t.fr.trim()).not.toBe('');expect(t.ar.trim()).not.toBe('');}
  }
 });
 it('resolves every pilot lesson and rejects unrelated question skills, grades and subjects',()=>{
  for(const mapping of LESSON_COMPETENCES){const c=getCompetence(mapping.competenceIds[0])!;if(c.subject!=='math'||!['1AP','2AP'].includes(c.grade))continue;
   const lesson={id:mapping.lessonId,grade:c.grade,subject:'math'} as CourseLesson;
   expect(guidedHelpForLesson(lesson).map(g=>g.competenceId).sort()).toEqual([...mapping.competenceIds].sort());
   expect(guidedHelpForLesson(lesson,{competenceId:'foreign'} as QuizQuestion)).toEqual([]);
   expect(guidedHelpForLesson({...lesson,subject:'arabic'})).toEqual([]);
  }
  expect(guidedHelpForGrade('5AP')).toEqual([]);
 });
 it('keeps carry, exchange, units and money examples mathematically correct',()=>{
  const answer=(id:string)=>{const g=GUIDED_MATH_HELP.find(g=>g.competenceId===id)!;return g.example.options[g.example.correct].fr;};
  expect(answer('math-2ap-c-addition-carry')).toContain(String(58+27));
  expect(answer('math-2ap-c-subtraction')).toContain(String(62-28));
  expect(answer('math-2ap-c-multiplication')).toContain(String(4*3));
  expect(answer('math-2ap-c-units')).toContain(String(3*100));
  expect(answer('math-2ap-c-money')).toContain(String(50-35));
 });
});

it('keeps early 1AP examples within the introductory number range',()=>{
 const early={id:'math-1ap-t1-numbers-0-5',grade:'1AP',subject:'math'} as CourseLesson;
 expect(guidedHelpForLesson(early).find(g=>g.competenceId==='math-1ap-c-numbers-read-write')?.example.options.map(o=>Number(o.fr))).toEqual([3,2,4]);
 const addition={...early,id:'math-1ap-t2-addition-concept'};
 expect(guidedHelpForLesson(addition,{competenceId:'math-1ap-c-addition'} as QuizQuestion)[0].example.options[0].fr).toBe('5');
});
