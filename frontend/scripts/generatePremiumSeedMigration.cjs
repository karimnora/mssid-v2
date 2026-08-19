// Generates a Flyway seed migration for one premium lesson from its extracted full.json — avoids
// any hand-retyping of the JSON payload into SQL (transcription risk on a 20KB+ Arabic text blob).
const fs = require('fs');
const path = require('path');

const lessonId = process.argv[2];
const migrationOutPath = process.argv[3];
if (!lessonId || !migrationOutPath) {
  console.error('Usage: node scripts/generatePremiumSeedMigration.cjs <lessonId> <outputSqlPath>');
  process.exit(1);
}

const jsonPath = path.join(__dirname, 'premium-content-out', `${lessonId}.full.json`);
const raw = fs.readFileSync(jsonPath, 'utf-8');
const parsed = JSON.parse(raw); // throws if invalid — fail loudly rather than seed broken JSON

if (parsed.id !== lessonId) {
  console.error(`id mismatch: file says "${parsed.id}", expected "${lessonId}"`);
  process.exit(1);
}
if (raw.includes("'")) {
  console.error('Payload contains a single quote — this generator does not escape it, aborting.');
  process.exit(1);
}

const grade = parsed.grade;
const subject = parsed.subject;
const trimester = parsed.trimester;

const sql = `-- Seeds the pilot lesson for the T2/T3 server-side content gate (see trimesterAccess.ts's own
-- doc comment for the problem this closes: T2/T3 lesson content was statically bundled into the
-- frontend JS for every visitor regardless of role). This is the FULL lesson payload, extracted
-- verbatim from frontend/src/data/courses/5AP/math.ts via scripts/extractPremiumLesson.ts (no manual
-- retyping) — the frontend source for this lesson is trimmed down to a free "shell" (catalog
-- metadata only) in the same change that adds this migration.
INSERT INTO public.premium_lesson_content (lesson_id, grade, subject, trimester, content_json)
VALUES ('${lessonId}', '${grade}', '${subject}', ${trimester}, '${raw.replace(/\n/g, '\n')}');
`;

fs.writeFileSync(migrationOutPath, sql, 'utf-8');
console.log(`Wrote ${migrationOutPath} (${sql.length} bytes)`);
