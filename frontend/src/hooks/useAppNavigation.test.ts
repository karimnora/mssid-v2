import { describe, expect, it, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { isToolAvailableForGrade, INTERACTIVE_LABS_LIST } from '../data/subjectsData';
import { defaultLabForGrade, labsEntrySubjectForGrade, useAppNavigation } from './useAppNavigation';
import { GRADE_STORAGE_KEY } from '../navigation/appLocation';

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
  it('opens a grade-safe lab for 1AP/2AP like older grades', () => {
    expect(labsEntrySubjectForGrade('1AP')).toBe('primary_math_ops');
    expect(labsEntrySubjectForGrade('2AP')).toBe('primary_math_ops');
    expect(labsEntrySubjectForGrade('5AP')).toBe('arabic_conjugator');
  });
});

describe('guest boot grade', () => {
  beforeEach(() => {
    window.localStorage.removeItem(GRADE_STORAGE_KEY);
    window.history.replaceState(null, '', '/');
  });

  it('boots on 1AP when the URL has no grade and storage is empty', () => {
    const { result } = renderHook(() => useAppNavigation({ isLessonLocked: () => false }));
    expect(result.current.grade).toBe('1AP');
  });

  it('restores the last picked grade from storage', () => {
    window.localStorage.setItem(GRADE_STORAGE_KEY, '3AP');
    const { result } = renderHook(() => useAppNavigation({ isLessonLocked: () => false }));
    expect(result.current.grade).toBe('3AP');
  });

  it('persists a grade change', () => {
    const { result } = renderHook(() => useAppNavigation({ isLessonLocked: () => false }));
    act(() => {
      result.current.handleGradeChange('4AP');
    });
    expect(result.current.grade).toBe('4AP');
    expect(window.localStorage.getItem(GRADE_STORAGE_KEY)).toBe('4AP');
  });
});

describe('mobile footer tab follows the open view', () => {
  it('leaves Accueil when opening courses, exams, labs, or challenges from home', () => {
    const { result } = renderHook(() => useAppNavigation({ isLessonLocked: () => false }));

    act(() => {
      result.current.goHome();
    });
    expect(result.current.mobileTab).toBe('home');

    act(() => {
      result.current.handleSelectPole('courses');
    });
    expect(result.current.mobileTab).toBe('courses');
    expect(result.current.isHomeActive).toBe(false);

    act(() => {
      result.current.goHome();
      result.current.handleSelectPole('exams');
    });
    expect(result.current.mobileTab).toBe('courses');

    act(() => {
      result.current.goHome();
      result.current.handleSelectPole('labs');
    });
    expect(result.current.mobileTab).toBe('games');

    act(() => {
      result.current.goHome();
      result.current.handleSelectPole('challenges');
    });
    expect(result.current.mobileTab).toBe('games');
  });
});
