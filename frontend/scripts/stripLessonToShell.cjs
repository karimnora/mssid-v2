// Replaces one lesson's full object literal in a courses/*.ts source file with a lightweight "shell"
// (catalog metadata only — id/grade/subject/titleAr/summaryAr/etc, quiz/rulesAr emptied) built from
// the paired *.shell.json produced by extractPremiumLesson.ts. Locates the block by finding the
// standalone `{` / `},` lines (column 0) surrounding the `id: '<lessonId>'` line — this file's lesson
// array entries are consistently formatted that way (verified by inspection before running this).
const fs = require('fs');
const path = require('path');

const [, , lessonId, sourceFilePath] = process.argv;
if (!lessonId || !sourceFilePath) {
  console.error('Usage: node scripts/stripLessonToShell.cjs <lessonId> <path/to/source.ts>');
  process.exit(1);
}

const shellPath = path.join(__dirname, 'premium-content-out', `${lessonId}.shell.json`);
const shell = JSON.parse(fs.readFileSync(shellPath, 'utf-8'));

const src = fs.readFileSync(sourceFilePath, 'utf-8');
const lines = src.split('\n');

const idLineIdx = lines.findIndex((l) => l.trim() === `id: '${lessonId}',`);
if (idLineIdx === -1) {
  console.error(`Could not find "id: '${lessonId}',"  in ${sourceFilePath}`);
  process.exit(1);
}

let startIdx = -1;
for (let i = idLineIdx; i >= 0; i--) {
  if (lines[i] === '{') { startIdx = i; break; }
}
let endIdx = -1;
for (let i = idLineIdx; i < lines.length; i++) {
  if (lines[i] === '},') { endIdx = i; break; }
}
if (startIdx === -1 || endIdx === -1) {
  console.error('Could not locate standalone { / }, block boundaries');
  process.exit(1);
}

function tsString(v) {
  return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}
function tsValue(v, indent) {
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    const items = v.map((item) => indent + '    ' + tsValue(item, indent + '    '));
    return '[\n' + items.join(',\n') + '\n' + indent + ']';
  }
  if (typeof v === 'string') return tsString(v);
  return JSON.stringify(v);
}

const shellLines = ['{'];
for (const [key, value] of Object.entries(shell)) {
  shellLines.push(`    ${key}: ${tsValue(value, '    ')},`);
}
shellLines.push(
  '    // Full content (rulesAr/detailedCourse/progressiveExercises/quiz/...) lives server-side —',
  '    // see backend premium_lesson_content (V10/V11) and PremiumContentController. Fetched at',
  '    // runtime for PREMIUM/ADMIN users only; LessonViewer shows a paywall for everyone else.',
  '    premiumContentPending: true,'
);
shellLines.push('},');

const newLines = [...lines.slice(0, startIdx), ...shellLines, ...lines.slice(endIdx + 1)];
fs.writeFileSync(sourceFilePath, newLines.join('\n'), 'utf-8');
console.log(`Replaced lines ${startIdx + 1}-${endIdx + 1} (${endIdx - startIdx + 1} lines) with a ${shellLines.length}-line shell.`);
