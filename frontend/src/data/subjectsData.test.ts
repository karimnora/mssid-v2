import { describe, it, expect } from 'vitest';
import { isSubjectFeatureEnabled, isToolAvailableForGrade, SUBJECTS_LIST, COURSE_SUBJECTS_LIST } from './subjectsData';
import { SubjectInfo } from '../types';

const baseSubject: SubjectInfo = {
  id: 'math',
  nameAr: 'test',
  nameFr: 'test',
  icon: 'Calculator',
  color: '',
  bgLight: '',
  description: '',
};

describe('isSubjectFeatureEnabled (flag-gated subject/tool visibility)', () => {
  it('is always visible when the subject has no featureFlag', () => {
    expect(isSubjectFeatureEnabled(baseSubject, {})).toBe(true);
    expect(isSubjectFeatureEnabled(baseSubject, { tamazight: false })).toBe(true);
  });

  it('is hidden when its featureFlag is off (or missing from the flags map)', () => {
    const gated: SubjectInfo = { ...baseSubject, featureFlag: 'tamazight' };
    expect(isSubjectFeatureEnabled(gated, { tamazight: false })).toBe(false);
    expect(isSubjectFeatureEnabled(gated, {})).toBe(false);
  });

  it('is visible when its featureFlag is on', () => {
    const gated: SubjectInfo = { ...baseSubject, featureFlag: 'tamazight' };
    expect(isSubjectFeatureEnabled(gated, { tamazight: true })).toBe(true);
  });

  it('does not react to an unrelated flag being on', () => {
    const gated: SubjectInfo = { ...baseSubject, featureFlag: 'advancedLabs' };
    expect(isSubjectFeatureEnabled(gated, { tamazight: true, advancedLabs: false })).toBe(false);
  });

  // Regression: the flag-functionality audit found tamazight/educationalCalculator/writingLab/
  // advancedLabs were declared in featureFlags.ts but never actually gated anything — this locks in
  // that every entry meant to be gated in the real catalog actually carries its tag.
  it('tags every subject/tool entry meant to be flag-gated in the real catalog', () => {
    const flagged = SUBJECTS_LIST.filter((s) => !!s.featureFlag).map((s) => s.id).sort();
    expect(flagged).toEqual(
      ['educational_calculator', 'electricity', 'geometry', 'science_lab', 'tamazight', 'tamazight_curriculum', 'tamazight_lab', 'touch_writing'].sort()
    );
  });
});

// Regression: 1AP/2AP briefly showed "matières" (French, English, History-Géo) that have zero
// lesson content at that level — src/data/courses/1AP and 2AP/ never had french.ts/english.ts/
// history_geo.ts files, only 3AP onward does. These 3 course subjects were missing a `minGrade`
// entirely (unlike tamazight, which already had one), so isToolAvailableForGrade treated them as
// grade-agnostic and showed them everywhere.
describe('course subjects that only exist from 3AP onward are hidden for 1AP/2AP', () => {
  const gatedIds = ['french', 'english', 'history_geo'];

  it('french, english and history_geo all declare minGrade: 3AP', () => {
    gatedIds.forEach((id) => {
      const subject = COURSE_SUBJECTS_LIST.find((s) => s.id === id);
      expect(subject?.minGrade, `${id} should declare minGrade`).toBe('3AP');
    });
  });

  it('are hidden for 1AP and 2AP, visible from 3AP onward', () => {
    const subjects = gatedIds.map((id) => COURSE_SUBJECTS_LIST.find((s) => s.id === id)!);
    subjects.forEach((s) => {
      expect(isToolAvailableForGrade(s, '1AP')).toBe(false);
      expect(isToolAvailableForGrade(s, '2AP')).toBe(false);
      expect(isToolAvailableForGrade(s, '3AP')).toBe(true);
      expect(isToolAvailableForGrade(s, '4AP')).toBe(true);
      expect(isToolAvailableForGrade(s, '5AP')).toBe(true);
    });
  });

  it('1AP/2AP see only the 5 official subjects: arabic, math, science, islamic, civics', () => {
    ['1AP', '2AP'].forEach((grade) => {
      const visible = COURSE_SUBJECTS_LIST.filter((s) => isToolAvailableForGrade(s, grade as any)).map((s) => s.id).sort();
      expect(visible).toEqual(['arabic', 'civics', 'islamic', 'math', 'science'].sort());
    });
  });
});
