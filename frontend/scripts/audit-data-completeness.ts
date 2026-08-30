import { OFFICIAL_EXAMS_DATA } from '../src/data/examsData';
import { COURSES_DATA } from '../src/data/coursesData';
import { CHALLENGES_DATA } from '../src/data/challengesData';
import { getExamKind } from '../src/utils/examKind';
import { PrimaryGrade, SubjectId } from '../src/types';

const GRADES: PrimaryGrade[] = ['1AP', '2AP', '3AP', '4AP', '5AP'];

const CORE_SUBJECTS_BY_GRADE: Record<PrimaryGrade, SubjectId[]> = {
  '1AP': ['math', 'arabic', 'islamic', 'science', 'civics'],
  '2AP': ['math', 'arabic', 'islamic', 'science', 'civics'],
  '3AP': ['math', 'arabic', 'french', 'english', 'islamic', 'science', 'civics', 'history_geo', 'tamazight', 'art'],
  '4AP': ['math', 'arabic', 'french', 'english', 'islamic', 'science', 'civics', 'history_geo', 'tamazight', 'art'],
  '5AP': ['math', 'arabic', 'french', 'english', 'islamic', 'science', 'civics', 'history_geo', 'tamazight', 'art'],
};

const COURSE_SUBJECTS = new Set(
  [...new Set(COURSES_DATA.map((l) => l.subject))].filter((s) =>
    ['math', 'arabic', 'science', 'french', 'english', 'islamic', 'civics', 'history_geo', 'tamazight', 'art'].includes(s)
  )
);

function countExams(grade: PrimaryGrade, subject: SubjectId, trimester?: 1 | 2 | 3, kind?: string) {
  return OFFICIAL_EXAMS_DATA.filter((e) => {
    if (e.grade !== grade || e.subject !== subject) return false;
    if (trimester && e.trimester !== trimester) return false;
    if (kind && getExamKind(e) !== kind) return false;
    return true;
  }).length;
}

console.log('=== MSSID DATA COMPLETENESS AUDIT ===\n');
console.log(`Exams total: ${OFFICIAL_EXAMS_DATA.length}`);
console.log(`Lessons total: ${COURSES_DATA.length}`);
console.log(`Challenges total: ${CHALLENGES_DATA.length}\n`);

// Exam gaps: composition T1-T3 per core subject
console.log('--- COMPOSITION GAPS (0 paper) ---');
const compGaps: string[] = [];
for (const grade of GRADES) {
  if (grade === '1AP') continue;
  for (const subject of CORE_SUBJECTS_BY_GRADE[grade]) {
    for (const t of [1, 2, 3] as const) {
      const n = countExams(grade, subject, t, 'composition');
      if (n === 0) compGaps.push(`${grade} ${subject} T${t}`);
    }
  }
}
if (compGaps.length) compGaps.forEach((g) => console.log('  ✗', g));
else console.log('  ✓ none');

// Devoir gaps
console.log('\n--- DEVOIR GAPS (0 paper) ---');
const devoirGaps: string[] = [];
for (const grade of GRADES) {
  if (grade === '1AP') continue;
  for (const subject of CORE_SUBJECTS_BY_GRADE[grade]) {
    if (['history_geo', 'tamazight', 'art', 'technology'].includes(subject) && grade === '2AP') continue;
    if (['french', 'english', 'history_geo', 'tamazight', 'art', 'technology'].includes(subject) && grade === '2AP') continue;
    for (const t of [1, 2, 3] as const) {
      const n = countExams(grade, subject, t, 'devoir');
      if (n === 0) devoirGaps.push(`${grade} ${subject} T${t}`);
    }
  }
}
if (devoirGaps.length) devoirGaps.forEach((g) => console.log('  ✗', g));
else console.log('  ✓ none (core subjects)');

// P2 subjects: devoirs missing (expected)
const p2DevoirMissing = ['tamazight', 'art', 'technology'].flatMap((subject) =>
  (['3AP', '4AP', '5AP'] as const).flatMap((grade) =>
    ([1, 2, 3] as const).filter((t) => countExams(grade, subject as SubjectId, t, 'devoir') === 0).map((t) => `${grade} ${subject} T${t}`)
  )
);
console.log('\n--- P2 DEVOIRS (not shipped — expected gap) ---');
console.log(`  ${p2DevoirMissing.length} slots without devoir`);

// Lesson coverage per grade/subject/trimester
console.log('\n--- LESSON TRIMESTER GAPS (course subjects, 0 lesson) ---');
const lessonGaps: string[] = [];
for (const grade of ['3AP', '4AP', '5AP'] as const) {
  for (const subject of CORE_SUBJECTS_BY_GRADE[grade]) {
    if (!COURSE_SUBJECTS.has(subject as SubjectId) && !['tamazight', 'art'].includes(subject)) continue;
    for (const t of [1, 2, 3] as const) {
      const n = COURSES_DATA.filter((l) => l.grade === grade && l.subject === subject && l.trimester === t).length;
      if (n === 0) lessonGaps.push(`lesson ${grade} ${subject} T${t}`);
    }
  }
}
if (lessonGaps.length) lessonGaps.slice(0, 20).forEach((g) => console.log('  ✗', g));
if (lessonGaps.length > 20) console.log(`  ... +${lessonGaps.length - 20} more`);
if (!lessonGaps.length) console.log('  ✓ none');

// Orphan lesson links
const lessonIds = new Set(COURSES_DATA.map((l) => l.id));
const badLinks: string[] = [];
OFFICIAL_EXAMS_DATA.forEach((exam) => {
  (exam.relatedLessonIds || []).forEach((id) => {
    if (!lessonIds.has(id)) badLinks.push(`${exam.id} → ${id}`);
  });
});
console.log('\n--- BROKEN relatedLessonIds ---');
if (badLinks.length) badLinks.forEach((b) => console.log('  ✗', b));
else console.log('  ✓ none');

// History_geo composition coverage
console.log('\n--- HISTORY_GEO compositions per trimester ---');
for (const grade of ['3AP', '4AP', '5AP'] as const) {
  const counts = [1, 2, 3].map((t) => countExams(grade, 'history_geo', t as 1 | 2 | 3, 'composition'));
  console.log(`  ${grade}: T1=${counts[0]} T2=${counts[1]} T3=${counts[2]}`);
}

// French T2/T3 composition depth
console.log('\n--- FRENCH compositions per trimester (3AP-5AP) ---');
for (const grade of ['3AP', '4AP', '5AP'] as const) {
  const counts = [1, 2, 3].map((t) => countExams(grade, 'french', t as 1 | 2 | 3, 'composition'));
  console.log(`  ${grade}: T1=${counts[0]} T2=${counts[1]} T3=${counts[2]}`);
}

// Summary matrix sample 3AP
console.log('\n--- 3AP COMPOSITION MATRIX (count) ---');
const subjects3 = CORE_SUBJECTS_BY_GRADE['3AP'];
console.log('subject'.padEnd(14), 'T1', 'T2', 'T3');
for (const s of subjects3) {
  console.log(s.padEnd(14), [1, 2, 3].map((t) => String(countExams('3AP', s, t as 1 | 2 | 3, 'composition')).padStart(3)).join(' '));
}

// Challenges by grade
console.log('\n--- CHALLENGES BY GRADE ---');
for (const g of GRADES) {
  const n = CHALLENGES_DATA.filter((c) => c.grade === g).length;
  console.log(`  ${g}: ${n}`);
}

console.log('\n=== END AUDIT ===');
