import { describe, it, expect } from 'vitest';
import { COURSES_DATA } from './coursesData';
import { SUBJECTS_LIST, GRADE_ORDER, isToolAvailableForGrade } from './subjectsData';

// Regression guard for the Soroban incident: `interactiveTool: 'soroban'` had been copy-pasted
// onto ~half of the 1AP/2AP math lessons even though subjectsData.ts itself declares the Soroban
// tool as `minGrade: '3AP'`. Nothing enforced that policy at the lesson level, so it silently
// drifted for years across many content commits. This test makes that drift fail CI instead.
// Tools whose LessonInteractiveTools.tsx rendering is gated on the lesson's OWN config object
// (see `toolRequiresConfig` there: science_lab needs lesson.gameplay_simulation, math_lab needs
// lesson.mathInteractive, etc.). For these, the subjectsData minGrade describes a different,
// curated standalone experience (e.g. the "Grand Laboratoire Scientifique" hub tile showcases
// advanced desert-ecosystem simulations) — NOT the lesson-authored content actually shown when
// embedded, which can legitimately be grade-appropriate at any grade. Keep this list in sync with
// `toolRequiresConfig` in LessonInteractiveTools.tsx.
const CONFIG_DRIVEN_TOOLS = new Set([
  'science_lab',
  'math_lab',
  'islamic_lab',
  'civics_lab',
  'history_geo_lab',
  'french_dialogue_lab',
  'english_dialogue_lab',
]);

describe('lesson interactiveTool respects the tool\'s declared minGrade', () => {
  const subjectById = new Map<string, (typeof SUBJECTS_LIST)[number]>(
    SUBJECTS_LIST.map((s) => [s.id, s]),
  );

  const lessonsWithTool = COURSES_DATA.filter(
    (lesson) => !!lesson.interactiveTool && !CONFIG_DRIVEN_TOOLS.has(lesson.interactiveTool),
  );

  it('has lessons with an interactiveTool to check (sanity check for this test itself)', () => {
    expect(lessonsWithTool.length).toBeGreaterThan(0);
  });

  it.each(lessonsWithTool.map((lesson) => [lesson.id, lesson.grade, lesson.interactiveTool!] as const))(
    '%s (%s) → %s is allowed at this grade',
    (lessonId, grade, interactiveTool) => {
      const tool = subjectById.get(interactiveTool);
      // A generic, grade-blind tool (e.g. 'unit_converter', 'arabic_canvas') with no standalone
      // subjectsData entry or no declared minGrade has no policy to check against.
      if (!tool || !tool.minGrade) return;

      expect(
        isToolAvailableForGrade(tool, grade),
        `Lesson "${lessonId}" (${grade}) uses interactiveTool "${interactiveTool}", ` +
          `but that tool is declared minGrade: '${tool.minGrade}' in subjectsData.ts. ` +
          `Either remove the tool from this lesson or lower/justify its minGrade.`,
      ).toBe(true);
    },
  );

  it('GRADE_ORDER covers every grade used in COURSES_DATA', () => {
    const gradesInUse = new Set(COURSES_DATA.map((l) => l.grade));
    gradesInUse.forEach((grade) => {
      expect(GRADE_ORDER).toContain(grade);
    });
  });
});
