import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSES_DATA } from '../src/data/coursesData';
import { findRecordedSpeechSequence } from '../src/utils/recordedSpeech';
import { recordedSpeechKey } from '../src/utils/recordedSpeechKey';
import { parsePlayfulSnippet, splitPlayfulLines, stripLatinGlosses } from '../src/components/lessonViewer/youngLessonLayout';

// Fixed, authored audio surfaces. Dynamic feedback, simulations and app navigation
// require a separate audit; this is deliberately not a count of every Arabic string.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, 'docs/audio-v1/cours-1ap-2ap');
const clean = (text: string) => text.replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u200D\uFE0F\u20E3]/gu, ' ').replace(/\s+/g, ' ').trim();
type Target = { lessonId: string; grade: string; subject: string; category: string; key: string };
type Request = { text: string; targets: Target[]; clips?: string[] };
const requests = new Map<string, Request>();
const lessons = COURSES_DATA.filter(lesson => lesson.grade === '1AP' || lesson.grade === '2AP');
for (const lesson of lessons) {
  const add = (category: string, key: string, text?: string) => {
    if (!text) return;
    const spoken = clean(text);
    if (!spoken) return;
    const id = recordedSpeechKey(spoken);
    const entry = requests.get(id) ?? { text: spoken, targets: [], clips: findRecordedSpeechSequence(spoken, 'ar-SA')?.map(clip => clip.src) };
    entry.targets.push({ lessonId: lesson.id, grade: lesson.grade!, subject: lesson.subject, category, key });
    requests.set(id, entry);
  };
  const playful = (text: string) => parsePlayfulSnippet(text).speak;
  add('entry', 'title', lesson.grade === '1AP' ? playful(lesson.titleAr) : lesson.titleAr);
  add('entry', 'instruction', lesson.instructionAudioAr);
  lesson.readingStory?.scenes.forEach(scene => add('reading', `scene-${scene.id}`, scene.textAr));
  if (lesson.grade === '1AP') {
    splitPlayfulLines(lesson.discoveryAr ?? '').forEach((line, i) => add('explanation', `discovery-${i}`, playful(line)));
    lesson.rulesAr.slice(0, 8).forEach((rule, i) => add('explanation', `rule-${i}`, playful(rule)));
    lesson.detailedCourse?.vocabulary?.slice(0, 6).forEach((item, i) => add('explanation', `vocab-${i}`, playful(item.termAr)));
    const example = lesson.examplesAr?.[0];
    if (example) { add('explanation', 'example-problem', playful(example.problem)); add('explanation', 'example-solution', playful(example.solution)); }
    add('explanation', 'home-activity', stripLatinGlosses(lesson.detailedCourse?.visualizationHintAr ?? ''));
    add('explanation', 'takeaway', stripLatinGlosses(lesson.detailedCourse?.takeawayAr ?? ''));
  } else {
    add('explanation', 'objective', lesson.objectiveAr);
    add('explanation', 'discovery', lesson.discoveryAr);
    add('explanation', 'guided-problem', lesson.guidedExampleAr?.problem);
    add('content', 'summary', lesson.summaryAr);
    add('content', 'intro', lesson.detailedCourse?.introAr);
    lesson.rulesAr.forEach((rule, i) => add('content', `rule-${i}`, rule));
    lesson.detailedCourse?.vocabulary?.forEach((item, i) => add('content', `vocab-${i}`, item.termAr));
    lesson.detailedCourse?.commonMistakes?.forEach((item, i) => add('content', `mistake-${i}`, item.correctionAr));
    add('content', 'takeaway', lesson.detailedCourse?.takeawayAr);
  }
  [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []].forEach(exercise => add('practice', `practice-${exercise.id}`, exercise.problemAr));
  lesson.quiz.forEach(question => {
    add('quiz', `quiz-${question.id}`, question.questionAr);
    if (lesson.grade === '1AP') question.options.forEach(option => add('quiz', `quiz-${question.id}-opt-${option.id}`, option.textAr));
  });
  if (lesson.educationalGame) {
    add('game', 'game-instructions', lesson.educationalGame.instructionsAr);
    lesson.educationalGame.items?.forEach((item, i) => {
      add('game', `game-${i}`, item.questionOrPromptAr);
      item.optionsAr?.forEach((option, j) => add('game', `game-${i}-opt-${j}`, option));
    });
  }
}

// Integrity comes from the supplied metadata, not the generated lookup alone.
const metadata = new Map<string, { sha256: string; duration: number; text: string }>();
const docs = resolve(root, 'docs/audio-v1');
for (const file of readdirSync(docs).filter(file => /^enregistrements-.*\.json$/.test(file))) {
  const data = JSON.parse(readFileSync(resolve(docs, file), 'utf8'));
  for (const clip of data.ar?.clips ?? []) metadata.set(`/sounds/preschool/ar/${clip.fichier}`, { sha256: clip.sha256, duration: clip.duration, text: clip.texte });
}
const entries = [...requests.values()];
const reused = [...new Set(entries.flatMap(entry => entry.clips ?? []))];
for (const src of metadata.keys()) {
  const file = resolve(root, 'frontend/public', src.slice(1));
  const source = metadata.get(src);
  if (!existsSync(file) || !source || !(source.duration > 0)) throw new Error(`Missing recording or metadata: ${src}`);
  if (createHash('sha256').update(readFileSync(file)).digest('hex') !== source.sha256) throw new Error(`Integrity mismatch: ${src}`);
}
const summary = {
  scope: 'Fixed authored lesson speech; excludes dynamic feedback, simulations and navigation. Text matching and integrity do not certify pronunciation.',
  lessons: lessons.length,
  uniqueTexts: entries.length,
  recordedTexts: entries.filter(entry => entry.clips).length,
  missingTexts: entries.filter(entry => !entry.clips).length,
  reusedFiles: reused.length,
  integrityCheckedArabicFiles: metadata.size,
  byGrade: ['1AP', '2AP'].map(grade => {
    const targets = entries.flatMap(entry => entry.targets.filter(target => target.grade === grade).map(target => ({ ...target, recorded: !!entry.clips })));
    return { grade, lessons: lessons.filter(lesson => lesson.grade === grade).length, requestedSegments: targets.length,
      recordedSegments: targets.filter(target => target.recorded).length,
      lessonsWithAnyRecording: new Set(targets.filter(target => target.recorded).map(target => target.lessonId)).size };
  }),
};
const pending = entries.filter(entry => !entry.clips).map(entry => ({ fichier: `course-ar-${createHash('sha256').update(entry.text).digest('hex').slice(0, 16)}.mp3`, texte: entry.text, targets: entry.targets, reviewRequired: true }));
// A manageable first delivery: entry titles, balanced across both grades.
const firstBatch = ['1AP', '2AP'].flatMap(grade => pending.filter(entry => entry.targets.some(target => target.grade === grade && target.category === 'entry')).slice(0, 12));
mkdirSync(output, { recursive: true });
const byLesson = lessons.map(lesson => {
  const targets = entries.flatMap(entry => entry.targets.filter(target => target.lessonId === lesson.id).map(target => ({ ...target, recorded: !!entry.clips })));
  return { lessonId: lesson.id, grade: lesson.grade, titleAr: lesson.titleAr, requestedSegments: targets.length, recordedSegments: targets.filter(target => target.recorded).length };
});
writeFileSync(resolve(output, 'couverture.json'), JSON.stringify({ summary, byLesson, recorded: entries.filter(entry => entry.clips) }, null, 2) + '\n');
writeFileSync(resolve(output, 'ar-manquants.json'), JSON.stringify(pending, null, 2) + '\n');
writeFileSync(resolve(output, 'prochain-lot-ar-decoupage.json'), JSON.stringify(firstBatch, null, 2) + '\n');
writeFileSync(resolve(output, 'prochain-lot-ar-texte-a-relire.txt'), firstBatch.map(entry => entry.texte).join('\n\n') + '\n');
console.log(JSON.stringify(summary, null, 2));
