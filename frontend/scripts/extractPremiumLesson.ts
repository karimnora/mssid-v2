// One-off extraction tool for the T2/T3 server-side-gating pilot — reads a lesson object straight
// from its TS source (no manual retyping, zero transcription risk) and writes:
//   1. <id>.full.json   — everything, to seed the backend's premium_lesson_content table
//   2. <id>.shell.json  — only the light/free metadata fields, for reference while editing the
//                          source file down to a "shell" lesson object by hand
// Usage: npx tsx scripts/extractPremiumLesson.ts <lessonId>
import { MATH_5AP } from '../src/data/courses/5AP/math';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const lessonId = process.argv[2];
if (!lessonId) {
  console.error('Usage: npx tsx scripts/extractPremiumLesson.ts <lessonId>');
  process.exit(1);
}

const lesson = MATH_5AP.find((l) => l.id === lessonId);
if (!lesson) {
  console.error(`Lesson "${lessonId}" not found in MATH_5AP`);
  process.exit(1);
}

// Only true catalog/marketing metadata — never the actual pedagogical content (rules, worked
// examples, vocabulary, exercises...), which is exactly what the paywall is meant to gate.
const SHELL_FIELDS = [
  'id', 'grade', 'subject', 'categoryAr', 'unitAr', 'trimester', 'difficultyTier',
  'contentSource', 'sourceType', 'sourceReference', 'confidenceLevel',
  'titleAr', 'summaryAr', 'objectiveAr', 'objectivesAr',
] as const;

const shell: Record<string, unknown> = {};
const lessonRecord = lesson as unknown as Record<string, unknown>;
for (const field of SHELL_FIELDS) {
  if (field in lesson) shell[field] = lessonRecord[field];
}
// quiz/rulesAr are required (non-optional) on CourseLesson — keep the shape valid but empty for
// locked lessons; the real rulesAr/quiz only arrive via the authenticated premium-content fetch.
shell.quiz = [];
shell.rulesAr = [];

const outDir = path.join(__dirname, 'premium-content-out');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, `${lessonId}.full.json`), JSON.stringify(lesson, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, `${lessonId}.shell.json`), JSON.stringify(shell, null, 2), 'utf-8');

console.log(`Wrote ${lessonId}.full.json (${JSON.stringify(lesson).length} bytes) and ${lessonId}.shell.json to ${outDir}`);
