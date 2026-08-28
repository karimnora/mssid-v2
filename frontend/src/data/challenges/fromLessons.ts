import { Challenge, ChallengeItem, CourseLesson, PrimaryGrade, SubjectId } from '../../types';

const TARGET_GRADES: PrimaryGrade[] = ['3AP', '4AP', '5AP'];
const TARGET_SUBJECTS = ['islamic', 'civics'] as const satisfies readonly SubjectId[];
const MIN_ITEMS = 5;
const MAX_ITEMS = 8;

const SUBJECT_TITLE_AR: Record<(typeof TARGET_SUBJECTS)[number], string> = {
  islamic: 'التربية الإسلامية',
  civics: 'التربية المدنية',
};

// UTC-based (toISOString), matching utils/dailyObjective.ts's todayKey() exactly — a local-time
// version here previously caused the daily challenge pool and the daily objective counter to roll
// over to the next day at different real-world moments for the same user, near midnight.
export function localDayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const out = [...items];
  const rand = mulberry32(hashString(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function quizToItems(lesson: CourseLesson, seed: string): ChallengeItem[] {
  return (lesson.quiz || []).flatMap((question) => {
    const correct = question.options.find((option) => option.isCorrect);
    if (!correct || question.options.length < 2) return [];
    const optionsAr = seededShuffle(
      question.options.map((option) => option.textAr),
      `${seed}|${question.id}`
    );
    return [
      {
        questionOrPromptAr: question.questionAr,
        correctAnswerAr: correct.textAr,
        optionsAr,
        explanationAr: correct.explanationAr,
      },
    ];
  });
}

function gameToItems(lesson: CourseLesson): ChallengeItem[] {
  return (lesson.educationalGame?.items || []).flatMap((item) => {
    if (!item.correctAnswerAr || !item.optionsAr || item.optionsAr.length < 2) return [];
    if (!item.optionsAr.includes(item.correctAnswerAr)) return [];
    return [
      {
        questionOrPromptAr: item.questionOrPromptAr,
        correctAnswerAr: item.correctAnswerAr,
        optionsAr: item.optionsAr,
        explanationAr: item.explanationAr,
      },
    ];
  });
}

function isUsableLesson(lesson: CourseLesson, grade: PrimaryGrade, subject: SubjectId): boolean {
  if (lesson.grade !== grade || lesson.subject !== subject) return false;
  if (lesson.id.startsWith('art-')) return false;
  return true;
}

function uniqueItems(items: ChallengeItem[]): ChallengeItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.questionOrPromptAr.trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildDailyLessonChallenges(
  lessons: CourseLesson[],
  options: { grade?: PrimaryGrade; dayKey: string }
): Challenge[] {
  const grades = options.grade ? [options.grade] : TARGET_GRADES;
  const challenges: Challenge[] = [];

  grades.forEach((grade) => {
    if (!TARGET_GRADES.includes(grade)) return;
    TARGET_SUBJECTS.forEach((subject) => {
      const pool = uniqueItems(
        lessons
          .filter((lesson) => isUsableLesson(lesson, grade, subject))
          .flatMap((lesson) => [...quizToItems(lesson, options.dayKey), ...gameToItems(lesson)])
      );
      if (pool.length < MIN_ITEMS) return;

      const items = seededShuffle(pool, `${grade}|${subject}|${options.dayKey}`).slice(0, MAX_ITEMS);
      const slug = grade.toLowerCase();
      challenges.push({
        id: `challenge-gen-${slug}-${subject}-${options.dayKey}`,
        subject,
        grade,
        titleAr: `تدريب اليوم: ${SUBJECT_TITLE_AR[subject]}`,
        descriptionAr: `أسئلة مأخوذة من دروس ${grade} — تتجدد كل يوم، بدون بنك ثانٍ.`,
        difficulty: 'medium',
        format: 'quiz_flash',
        xpReward: 20,
        items,
      });
    });
  });

  return challenges;
}
