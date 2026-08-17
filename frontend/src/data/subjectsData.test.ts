import { describe, it, expect } from 'vitest';
import { isSubjectFeatureEnabled, SUBJECTS_LIST } from './subjectsData';
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
