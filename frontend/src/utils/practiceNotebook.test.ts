import { describe, expect, it } from 'vitest';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { buildParentNotebook, buildWeeklyPlan, formatWeeklyRecap, recordPracticeResult, MAX_MISSED_EXERCISES } from './competenceProgress';
import { catchUpExercises } from './catchUpExercises';
import { mergeNotebookProgress } from './mergeNotebookProgress';
import { buildWeeklyReport, formatWeeklyReportText } from './weeklyReport';

const LESSON = 'arabic-5ap-tamyiz';
const COMPETENCE = 'ar-5ap-c-tamyiz';
const at = (minute: number) => `2026-11-04T18:${String(minute).padStart(2, '0')}:00.000Z`;

describe('exercise results in the parent notebook (5AP)', () => {
  it('tells « réussi seul » from « avec aide » and keeps missed exercises for the catch-up sheet', () => {
    let profile = createFreshGuestProfile('5AP');
    profile = recordPracticeResult(profile, LESSON, { outcome: 'success', helped: false, exerciseId: 'arabic-5ap-tamyiz-ex1' }, at(1));
    profile = recordPracticeResult(profile, LESSON, { outcome: 'fail', exerciseId: 'arabic-5ap-tamyiz-eval3' }, at(2));
    profile = recordPracticeResult(profile, LESSON, { outcome: 'success', helped: true, exerciseId: 'arabic-5ap-tamyiz-eval3' }, at(3));

    const stat = profile.competenceStats![COMPETENCE];
    expect(stat.alone).toBe(1);
    expect(stat.helped).toBe(1);
    // Redone only with help: still on the sheet, and the skill stays « à revoir ».
    expect(stat.missedExerciseIds).toEqual(['arabic-5ap-tamyiz-eval3']);
    const notebook = buildParentNotebook(profile, '5AP');
    expect(notebook.review.map((row) => row.competenceId)).toContain(COMPETENCE);

    // Redone alone: it leaves the sheet.
    profile = recordPracticeResult(profile, LESSON, { outcome: 'success', helped: false, exerciseId: 'arabic-5ap-tamyiz-eval3' }, at(4));
    expect(profile.competenceStats![COMPETENCE].missedExerciseIds).toEqual([]);
  });

  it('caps the missed exercises and collapses successes of the same kind into one notebook line', () => {
    let profile = createFreshGuestProfile('5AP');
    for (let i = 0; i < MAX_MISSED_EXERCISES + 3; i++) {
      profile = recordPracticeResult(profile, LESSON, { outcome: 'fail', exerciseId: `ex-${i}` }, at(i));
    }
    expect(profile.competenceStats![COMPETENCE].missedExerciseIds).toHaveLength(MAX_MISSED_EXERCISES);
    expect(profile.competenceStats![COMPETENCE].missedExerciseIds![0]).toBe(`ex-${MAX_MISSED_EXERCISES + 2}`);

    const before = profile.lessonSessions!.length;
    profile = recordPracticeResult(profile, LESSON, { outcome: 'success', helped: false, exerciseId: 'a' }, at(20));
    profile = recordPracticeResult(profile, LESSON, { outcome: 'success', helped: false, exerciseId: 'b' }, at(21));
    profile = recordPracticeResult(profile, LESSON, { outcome: 'success', helped: true, exerciseId: 'c' }, at(22));
    expect(profile.lessonSessions!.length).toBe(before + 2);
    expect(profile.lessonSessions![before].count).toBe(2);
  });

  it('counts the week alone / with help in the plan, the recap and the WhatsApp report', () => {
    let profile = { ...createFreshGuestProfile('5AP'), name: 'أمين' };
    profile = recordPracticeResult(profile, LESSON, { outcome: 'success', helped: false, exerciseId: 'a' }, at(1));
    profile = recordPracticeResult(profile, LESSON, { outcome: 'success', helped: false, exerciseId: 'b' }, at(2));
    profile = recordPracticeResult(profile, 'math-5ap-division', { outcome: 'success', helped: true, exerciseId: 'c' }, at(3));
    const notebook = buildParentNotebook(profile, '5AP');
    const plan = buildWeeklyPlan(notebook, new Date('2026-11-05T08:00:00Z'));
    expect(plan.weekAlone).toBe(2);
    expect(plan.weekHelped).toBe(1);
    expect(plan.weekSuccesses).toBe(3);
    expect(formatWeeklyRecap(notebook, plan, 'fr')).toContain('2 réussi(s) seul, 1 avec un indice');
    const report = buildWeeklyReport(notebook, plan, new Date('2026-11-05T08:00:00Z'));
    expect(formatWeeklyReportText(report, 'ar')).toContain('2 بمفرده، 1 بمساعدة تلميح');
  });

  it('sends tomorrow’s 12 minutes to the competence with the most missed exercises', () => {
    let profile = createFreshGuestProfile('5AP');
    profile = recordPracticeResult(profile, 'math-5ap-division', { outcome: 'fail', exerciseId: 'd1' }, at(1));
    profile = recordPracticeResult(profile, LESSON, { outcome: 'fail', exerciseId: 't1' }, at(2));
    profile = recordPracticeResult(profile, LESSON, { outcome: 'fail', exerciseId: 't2' }, at(3));
    const plan = buildWeeklyPlan(buildParentNotebook(profile, '5AP'));
    expect(plan.next?.competenceId).toBe(COMPETENCE);
  });

  it('keeps alone / helped and the missed list when two devices merge', () => {
    let a = createFreshGuestProfile('5AP');
    a = recordPracticeResult(a, LESSON, { outcome: 'success', helped: false, exerciseId: 'x' }, at(1));
    let b = createFreshGuestProfile('5AP');
    b = recordPracticeResult(b, LESSON, { outcome: 'fail', exerciseId: 'y' }, at(5));
    const merged = mergeNotebookProgress(a, b);
    expect(merged.competenceStats![COMPETENCE].alone).toBe(1);
    expect(merged.competenceStats![COMPETENCE].missedExerciseIds).toEqual(['y']);
  });
});

describe('catch-up exercises', () => {
  it('turns missed exercise ids into printable prompts with their correction', () => {
    const items = catchUpExercises(COMPETENCE, ['arabic-5ap-tamyiz-eval3', 'gone-from-content']);
    expect(items).toHaveLength(1);
    expect(items[0].promptAr).toContain('عَسَلاً');
    expect(items[0].answerAr).toContain('ذات');
  });

  it('lists the choices of a multiple-choice exercise', () => {
    const [item] = catchUpExercises(COMPETENCE, ['arabic-5ap-tamyiz-ex1']);
    expect(item.promptAr).toMatch(/أ\) .*ب\) /s);
    expect(item.answerAr.length).toBeGreaterThan(0);
  });
});
