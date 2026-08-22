import { describe, expect, it } from 'vitest';
import { isToolAvailableForGrade, INTERACTIVE_LABS_LIST } from '../data/subjectsData';
import { defaultLabForGrade, labsEntrySubjectForGrade } from './useAppNavigation';

describe('defaultLabForGrade', () => {
  it('opens a 1AP-safe lab instead of the Arabic conjugator', () => {
    expect(defaultLabForGrade('1AP')).toBe('primary_math_ops');
    expect(defaultLabForGrade('2AP')).toBe('primary_math_ops');

    const lab = INTERACTIVE_LABS_LIST.find((item) => item.id === 'primary_math_ops');
    expect(lab).toBeTruthy();
    expect(isToolAvailableForGrade(lab!, '1AP')).toBe(true);
    expect(isToolAvailableForGrade(lab!, '2AP')).toBe(true);
  });

  it('keeps the conjugator from 3AP upward', () => {
    expect(defaultLabForGrade('3AP')).toBe('arabic_conjugator');
    expect(defaultLabForGrade('5AP')).toBe('arabic_conjugator');

    const conjugator = INTERACTIVE_LABS_LIST.find((item) => item.id === 'arabic_conjugator');
    expect(conjugator).toBeTruthy();
    expect(isToolAvailableForGrade(conjugator!, '1AP')).toBe(false);
    expect(isToolAvailableForGrade(conjugator!, '3AP')).toBe(true);
  });
});

describe('labsEntrySubjectForGrade', () => {
  it('lands 1AP/2AP on the picker instead of auto-opening a lab', () => {
    expect(labsEntrySubjectForGrade('1AP')).toBe('math');
    expect(labsEntrySubjectForGrade('2AP')).toBe('math');
    expect(labsEntrySubjectForGrade('5AP')).toBe('arabic_conjugator');
  });
});


describe('defaultLabForGrade', () => {
  it('opens a 1AP-safe lab instead of the Arabic conjugator', () => {
    expect(defaultLabForGrade('1AP')).toBe('primary_math_ops');
    expect(defaultLabForGrade('2AP')).toBe('primary_math_ops');

    const lab = INTERACTIVE_LABS_LIST.find((item) => item.id === 'primary_math_ops');
    expect(lab).toBeTruthy();
    expect(isToolAvailableForGrade(lab!, '1AP')).toBe(true);
    expect(isToolAvailableForGrade(lab!, '2AP')).toBe(true);
  });

  it('keeps the conjugator from 3AP upward', () => {
    expect(defaultLabForGrade('3AP')).toBe('arabic_conjugator');
    expect(defaultLabForGrade('5AP')).toBe('arabic_conjugator');

    const conjugator = INTERACTIVE_LABS_LIST.find((item) => item.id === 'arabic_conjugator');
    expect(conjugator).toBeTruthy();
    expect(isToolAvailableForGrade(conjugator!, '1AP')).toBe(false);
    expect(isToolAvailableForGrade(conjugator!, '3AP')).toBe(true);
  });
});
