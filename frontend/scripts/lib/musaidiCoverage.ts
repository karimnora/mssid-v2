import type { CourseLesson } from '../../src/types';
import { buildMusaidiBank } from '../../src/data/musaidiBank';
import { getLessonCompetences } from '../../src/data/competences';
import { guidedHelpForLesson } from '../../src/data/guidedMath';

export function auditMusaidiCoverage(catalog: CourseLesson[], curriculumReviewGate: boolean) {
  const lessons = catalog.filter(l => !curriculumReviewGate || l.contentSource === 'official_verified');
  const rows = lessons.map(lesson => {
    const bank = buildMusaidiBank([lesson]);
    const hasRule = lesson.rulesAr?.some(rule => rule.trim().length > 0) ?? false;
    const mapped = getLessonCompetences(lesson.id).filter(c => c.grade === lesson.grade && c.subject === lesson.subject);
    const guides = guidedHelpForLesson(lesson);
    const covered = new Set(guides.map(g => g.competenceId));
    const withHint = bank.filter(i => i.hintsAr.length > 0).length;
    const withDetailedCorrection = bank.filter(i => i.stepsAr.some(step=>step.trim().length > 0 && step.trim() !== i.answerAr.trim())).length;
    const withFullHelp = bank.filter(i => i.hintsAr.length > 0 && hasRule && i.stepsAr.some(step=>step.trim().length > 0 && step.trim() !== i.answerAr.trim())).length;
    const withApplicableGuide = bank.filter(item => {
      const question = item.kind === 'quiz' ? lesson.quiz.find(q => q.id === item.sourceId) : undefined;
      const candidates = guidedHelpForLesson(lesson, question);
      return question?.competenceId ? candidates.length > 0 : candidates.length === 1;
    }).length;
    return { id: lesson.id, titleAr: lesson.titleAr, grade: lesson.grade, subject: lesson.subject, trimester: lesson.trimester ?? null,
      questions: bank.length, quizQuestions: bank.filter(i => i.kind === 'quiz').length, exercises: bank.filter(i => i.kind === 'exercise').length,
      sourceQuestions: (lesson.quiz?.length ?? 0) + (lesson.progressiveExercises?.length ?? 0),
      skippedQuestions: (lesson.quiz?.length ?? 0) + (lesson.progressiveExercises?.length ?? 0) - bank.length,
      missingHintQuestionIds: bank.filter(i=>i.hintsAr.length===0).map(i=>i.id),
      missingDetailedQuestionIds: bank.filter(i=>!i.stepsAr.some(step=>step.trim().length > 0 && step.trim() !== i.answerAr.trim())).map(i=>i.id),
      missingCompetenceQuestionIds: bank.filter(i=>!i.competenceId).map(i=>i.id),
      evaluationExercisesExcluded: lesson.evaluationExercises?.length ?? 0,
      withHint, withRule: hasRule ? bank.length : 0, withDetailedCorrection, withFullHelp,
      withMultipleSteps: bank.filter(i => i.stepsAr.length >= 2).length,
      withApplicableGuide, withExactCompetence: bank.filter(i => !!i.competenceId).length,
      mappedCompetenceIds: mapped.map(c => c.id), guidedCompetenceIds: [...covered],
      hasRules: hasRule, keyFormulas: lesson.keyFormulas?.length ?? 0,
      duplicateQuestionIds: [...new Set(bank.filter((i,n) => bank.findIndex(other => other.id === i.id) !== n).map(i => i.id))],
    };
  });
  const groups = [...new Set(rows.map(r => `${r.grade}/${r.subject}`))].sort().map(key => {
    const items = rows.filter(r => `${r.grade}/${r.subject}` === key);
    const total = (field: 'questions' | 'withHint' | 'withRule' | 'withDetailedCorrection' | 'withFullHelp' | 'withApplicableGuide' | 'withExactCompetence' | 'skippedQuestions') => items.reduce((sum,r) => sum+r[field],0);
    const mapped = new Set(items.flatMap(r => r.mappedCompetenceIds));
    const guided = new Set(items.flatMap(r => r.guidedCompetenceIds));
    return {grade:items[0].grade,subject:items[0].subject,lessons:items.length,questions:total('questions'),withHint:total('withHint'),withRule:total('withRule'),withDetailedCorrection:total('withDetailedCorrection'),withFullHelp:total('withFullHelp'),withApplicableGuide:total('withApplicableGuide'),withExactCompetence:total('withExactCompetence'),skippedQuestions:total('skippedQuestions'),mappedCompetences:mapped.size,guidedCompetences:guided.size,lessonsWithoutQuestions:items.filter(r=>r.questions===0).length};
  });
  return {curriculumReviewGate,lessons:rows.length,questions:rows.reduce((sum,r)=>sum+r.questions,0),groups,rows};
}
