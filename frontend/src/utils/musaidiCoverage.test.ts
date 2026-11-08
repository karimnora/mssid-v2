import {describe,it,expect} from 'vitest';
import type {CourseLesson} from '../types';
import {auditMusaidiCoverage} from '../../scripts/lib/musaidiCoverage';
const lesson=(changes:Partial<CourseLesson>={})=>({id:'math-1ap-t2-addition-concept',grade:'1AP',subject:'math',trimester:2,rulesAr:['قاعدة'],quiz:[{id:'q',questionAr:'سؤال',hintAr:'تلميح',options:[{id:'a',textAr:'جواب',isCorrect:true,explanationAr:'طريقة الحل'}]}],...changes} as CourseLesson);
describe('musaidi coverage audit',()=>{
 it('uses the application publication gate without treating every local lesson as verified',()=>{
  const catalog=[lesson({contentSource:'official_verified'}),lesson({id:'other',contentSource:'needs_verification'})];
  expect(auditMusaidiCoverage(catalog,false).lessons).toBe(2);
  expect(auditMusaidiCoverage(catalog,true).rows.map(r=>r.id)).toEqual(['math-1ap-t2-addition-concept']);
 });
 it('does not count a final answer repeated as a detailed correction',()=>{
  const input=lesson();input.quiz[0].options[0].explanationAr='جواب';
  const result=auditMusaidiCoverage([input],false).rows[0];
  expect(result.questions).toBe(1);expect(result.withDetailedCorrection).toBe(0);
  expect(result.withFullHelp).toBe(0);
 });
 it('counts only usable bank entries, not an invalid quiz or evaluation-only content',()=>{
  const input=lesson();input.quiz.push({id:'bad',questionAr:'',options:[]});
  input.evaluationExercises=[{id:'evaluation'} as NonNullable<CourseLesson['evaluationExercises']>[number]];
  const result=auditMusaidiCoverage([input],false).rows[0];
  expect(result.questions).toBe(1);expect(result.skippedQuestions).toBe(1);expect(result.evaluationExercisesExcluded).toBe(1);
 });
 it('does not count whitespace rules or absent hints as usable help',()=>{
  const input=lesson({rulesAr:['  ']});input.quiz[0].hintAr=' ';
  const result=auditMusaidiCoverage([input],false).rows[0];
  expect(result.withHint).toBe(0);expect(result.withRule).toBe(0);expect(result.withFullHelp).toBe(0);
  expect(result.missingHintQuestionIds).toEqual([`${input.id}:quiz:q`]);
 });
 it('reports a real 1AP guide but no invented 4AP skill or guide',()=>{
  const report=auditMusaidiCoverage([lesson(),lesson({id:'math-4ap-fractions',grade:'4AP'})],false);
  expect(report.rows[0].withApplicableGuide).toBe(1);
  expect(report.rows[1].mappedCompetenceIds).toEqual([]);
  expect(report.rows[1].guidedCompetenceIds).toEqual([]);
  expect(report.rows[1].withExactCompetence).toBe(0);
 });
});
