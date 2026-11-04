import { beforeEach, describe, expect, it } from 'vitest';
import type { CourseLesson, UserProfile } from '../types';
import { dailyMissionCopy, pickDailyMission, resolveDailyMission } from './dailyMission';

const lesson = (id: string, subject: CourseLesson['subject'], trimester: 1 | 2 | 3 = 1): CourseLesson =>
  ({ id, grade: '5AP', subject, trimester, titleAr: `درس ${id}: تفاصيل` }) as CourseLesson;

const LESSONS = [
  lesson('math-5ap-large-numbers', 'math'),
  lesson('math-5ap-division', 'math'),
  lesson('ar-5ap-a', 'arabic'),
  lesson('sci-5ap-a', 'science'),
  lesson('math-5ap-t2', 'math', 2),
];

const profile = (over: Partial<UserProfile> = {}): UserProfile =>
  ({ name: 'سمير', grade: '5AP', completedLessonIds: [], lessonSessions: [], competenceStats: {}, ...over }) as UserProfile;

describe('daily mission (planet home)', () => {
  beforeEach(() => window.localStorage.clear());

  it('proposes a skill to review before anything else', () => {
    const p = profile({
      competenceStats: {
        'math-5ap-c-division': { attempts: 2, successes: 0, failures: 2, lastAt: '2026-11-03T10:00:00Z', lastOutcome: 'fail', lastLessonId: 'math-5ap-division', missedExerciseIds: ['x'] },
      } as UserProfile['competenceStats'],
    });
    const m = pickDailyMission({ grade: '5AP', profile: p, lessons: LESSONS });
    expect(m?.kind).toBe('review');
    expect(m?.lesson.id).toBe('math-5ap-division');
  });

  it('then the lesson left half-way, then the next lesson of maths or Arabic in programme order', () => {
    const resume = { kind: 'lesson' as const, grade: '5AP' as const, lessonId: 'sci-5ap-a', subject: 'science' as const, titleAr: 'x' };
    expect(pickDailyMission({ grade: '5AP', profile: profile(), lessons: LESSONS, resume })?.kind).toBe('resume');

    const next = pickDailyMission({ grade: '5AP', profile: profile({ completedLessonIds: ['math-5ap-large-numbers'] }), lessons: LESSONS });
    expect(next?.kind).toBe('next');
    expect(['math-5ap-division', 'ar-5ap-a']).toContain(next?.lesson.id);
  });

  it('keeps the same mission for the day and says well done once it is done', () => {
    const key = 'k';
    const first = resolveDailyMission({ grade: '5AP', profile: profile(), lessons: LESSONS, storageKey: key });
    expect(first.done).toBe(false);
    const doneProfile = profile({ completedLessonIds: [first.mission!.lesson.id] });
    const later = resolveDailyMission({ grade: '5AP', profile: doneProfile, lessons: LESSONS, storageKey: key });
    expect(later.mission?.lesson.id).toBe(first.mission?.lesson.id);
    expect(later.done).toBe(true);
    expect(later.next?.lesson.id).not.toBe(first.mission?.lesson.id);

    const copy = dailyMissionCopy(later, 'ar', () => 'الرياضيات');
    expect(copy?.say).toMatch(/^أحسنت! أنجزت مهمة اليوم/);
    expect(copy?.cta).toBe('مهمة أخرى');
  });

  it('says only the part of a long title before the colon', () => {
    const state = resolveDailyMission({ grade: '5AP', profile: profile(), lessons: LESSONS, storageKey: 'k2' });
    expect(dailyMissionCopy(state, 'ar', () => 'الرياضيات')?.say).not.toContain('تفاصيل');
  });
});
