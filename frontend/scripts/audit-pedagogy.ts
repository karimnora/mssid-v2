/** Read-only catalogue audit. Structural checks and arithmetic candidates do not certify pedagogy. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSES_DATA } from '../src/data/coursesData';
import { PRESCHOOL_MODULES } from '../src/data/preschool';
import { OFFICIAL_EXAMS_DATA } from '../src/data/examsData';
import { CHALLENGES_DATA, getArenaChallenges } from '../src/data/challengesData';
import { stripArabicTashkeel } from '../src/utils/textFormatter';
import { stripNonSpokenSymbols } from '../src/utils/speech';
import { findRecordedSpeechSequence } from '../src/utils/recordedSpeech';
import { evaluateExpression } from '../src/utils/mathParser';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'docs/audits/pedagogie-2026-11-13');
const bare = (text: string) => text.normalize('NFC').replace(/[\u064B-\u065F\u0670\u0640]/gu, '').replace(/\s+/g, ' ').trim();
type Finding = { id: string; path: string; detail: unknown };
const optionIssues: Finding[] = [], arithmeticCandidates: Finding[] = [], groupingComma: Finding[] = [];
let equationsChecked = 0;
function walk(value: unknown, visit: (text: string, path: string) => void, path = '') {
  if (typeof value === 'string') visit(value, path);
  else if (Array.isArray(value)) value.forEach((item, index) => walk(item, visit, `${path}[${index}]`));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => walk(item, visit, path ? `${path}.${key}` : key));
}
function inspectNumbers(id: string, source: unknown) {
  walk(source, (text, path) => {
    if (/\d,\d{3}(?:\D|$)/u.test(text)) groupingComma.push({ id, path, detail: text.slice(0, 240) });
    if (!/(solution|operations|correction|takeaway|rules|workedExample)/i.test(path) || /options\[\d+\]/.test(path)) return;
    const normalized = text.replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit))).replace(/[\u202f\u00a0]/g, '').replace(/−/g, '-');
    for (const match of normalized.matchAll(/\d[\d., ()+×÷*/-]*=[\d., ()+×÷*/=-]+/g)) {
      const expression = match[0].trim().replace(/[.,]+$/, '');
      if (/\d,\d{3}(?:\D|$)/.test(expression)) continue; // Do not guess whether a comma is thousands or decimal.
      try {
        const values = expression.split('=').map(side => evaluateExpression(side.trim()));
        if (values.length < 2 || !values.every(Number.isFinite)) continue;
        equationsChecked++;
        if (values.some(value => Math.abs(value - values[0]) > 1e-7)) arithmeticCandidates.push({ id, path, detail: { expression, values, context: text.slice(0, 500) } });
      } catch { /* Layouts, fractions with units and incomplete expressions need human review. */ }
    }
  });
}
function inspectOptions(id: string, path: string, options: { textAr: string; isCorrect?: boolean }[]) {
  if (options.filter(option => option.isCorrect).length !== 1) optionIssues.push({ id, path, detail: 'Not exactly one correct option' });
  const texts = options.map(option => bare(option.textAr));
  if (new Set(texts).size !== texts.length) optionIssues.push({ id, path, detail: { duplicateVisibleOptions: texts, renderer: path.startsWith('quiz[') || path.startsWith('game[') ? 'quiz/game does not preserve distinguishing marks' : 'practice auto-preserves distinguishing marks' } });
}
const lessons = COURSES_DATA.map(lesson => {
  const exercises = [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []];
  lesson.quiz.forEach((question, index) => inspectOptions(lesson.id, `quiz[${index}]`, question.options));
  exercises.forEach(exercise => { if (exercise.options?.length) inspectOptions(lesson.id, exercise.id, exercise.options); });
  lesson.educationalGame?.items.forEach((item, index) => {
    if (!item.optionsAr?.length) optionIssues.push({ id: lesson.id, path: `game[${index}]`, detail: 'No selectable options in the current renderer' });
    else inspectOptions(lesson.id, `game[${index}]`, item.optionsAr.map(textAr => ({ textAr, isCorrect: textAr === item.correctAnswerAr })));
  });
  inspectNumbers(lesson.id, lesson);
  const missionText = lesson.learningPath?.steps.filter(step => !('exerciseId' in step)).map(step => step.textAr ?? '') ?? [];
  return { id: lesson.id, grade: lesson.grade, subject: lesson.subject, trimester: lesson.trimester, title: lesson.titleAr,
    guided: !!lesson.learningPath, guidedSteps: lesson.learningPath?.steps.length ?? 0, hasSecondMission: !!lesson.learningPath?.next,
    quizQuestions: lesson.quiz.length, progressiveExercises: exercises.length, practiceOnly: lesson.progressiveExercises?.length ?? 0, evaluationOnly: lesson.evaluationExercises?.length ?? 0, interactiveTool: lesson.interactiveTool,
    simulationType: lesson.gameplay_simulation?.type, gameType: lesson.educationalGame?.type, gameQuestions: lesson.educationalGame?.items.length ?? 0,
    unansweredExplanationCount: lesson.quiz.filter(question => !question.options.find(option => option.isCorrect)?.explanationAr).length,
    longestMissionStep: Math.max(0, ...missionText.map(text => text.length)),
    longestRule: Math.max(0, ...lesson.rulesAr.map(text => text.length)),
    emptyFields: ['titleAr', 'summaryAr', 'objectiveAr'].filter(field => !(lesson as unknown as Record<string, unknown>)[field]),
  };
});
const activities = PRESCHOOL_MODULES.flatMap(module => module.activities);
const preschool = { modules: PRESCHOOL_MODULES.length, activities: activities.length,
  interactions: Object.fromEntries([...new Set(activities.map(activity => activity.interactionType))].map(type => [type, activities.filter(activity => activity.interactionType === type).length])),
  modulesDetail: PRESCHOOL_MODULES.map(module => ({ id: module.id, title: module.titleI18n.fr, activities: module.activities.length, types: [...new Set(module.activities.map(activity => activity.interactionType))] })),
};
for (const exam of OFFICIAL_EXAMS_DATA) inspectNumbers(exam.id, exam);
for (const challenge of CHALLENGES_DATA) {
  inspectNumbers(challenge.id, challenge);
  challenge.items.forEach((item, index) => {
    if (!item.optionsAr?.includes(item.correctAnswerAr)) optionIssues.push({ id: challenge.id, path: `item[${index}]`, detail: 'Correct answer absent' });
    if (new Set(item.optionsAr?.map(bare)).size !== item.optionsAr?.length) optionIssues.push({ id: challenge.id, path: `item[${index}]`, detail: 'Duplicate visible options' });
  });
}
const summary = { scope: 'All catalogue entries inspected structurally; semantic correctness and fun require human/contextual review',
  preschool: { modules: preschool.modules, activities: preschool.activities, interactions: preschool.interactions },
  courses: lessons.length, byGrade: ['1AP', '2AP', '3AP', '4AP', '5AP'].map(grade => {
    const items = lessons.filter(lesson => lesson.grade === grade);
    return { grade, lessons: items.length, guided: items.filter(item => item.guided).length, secondMission: items.filter(item => item.hasSecondMission).length,
      exercises: items.reduce((sum, item) => sum + item.progressiveExercises, 0), quizzes: items.reduce((sum, item) => sum + item.quizQuestions, 0),
      withGames: items.filter(item => item.gameQuestions > 0).length, withSimulations: items.filter(item => item.simulationType).length, withInteractiveTool: items.filter(item => item.interactiveTool).length,
      bySubject: [...new Set(items.map(item => item.subject))].map(subject => ({ subject, lessons: items.filter(item => item.subject === subject).length, guided: items.filter(item => item.subject === subject && item.guided).length })) };
  }), exams: OFFICIAL_EXAMS_DATA.length, authoredChallenges: CHALLENGES_DATA.length, arenaChallengesToday: getArenaChallenges().length,
  equationsChecked, arithmeticCandidates: arithmeticCandidates.length, optionCollisionCandidates: optionIssues.length, unprotectedQuizCollisions: optionIssues.filter(issue => issue.path.startsWith('quiz[')).length, unprotectedGameCollisions: optionIssues.filter(issue => issue.path.startsWith('game[')).length, fieldsWithGroupingComma: groupingComma.length,
};
const challengeCues = [...new Set(CHALLENGES_DATA.filter(challenge => ['1AP','2AP'].includes(challenge.grade)).flatMap(challenge => challenge.items.flatMap(item => [item.questionOrPromptAr, ...item.optionsAr ?? []])))];
const challengeSpeech = { scope: 'Unique authored question/option strings in 1AP/2AP only', cues: challengeCues.length,
  coveredUsingAuthoredText: challengeCues.filter(text => findRecordedSpeechSequence(stripNonSpokenSymbols(text), 'ar-SA')).length,
  coveredUsingActualStrippedText: challengeCues.filter(text => findRecordedSpeechSequence(stripNonSpokenSymbols(stripArabicTashkeel(text)), 'ar-SA')).length,
  lostAfterStripping: challengeCues.filter(text => findRecordedSpeechSequence(stripNonSpokenSymbols(text), 'ar-SA') && !findRecordedSpeechSequence(stripNonSpokenSymbols(stripArabicTashkeel(text)), 'ar-SA')),
};
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, 'inventaire.json'), JSON.stringify({ summary, preschool, lessons, optionIssues, arithmeticCandidates, groupingComma, challengeSpeech }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
