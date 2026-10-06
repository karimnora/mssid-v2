import { describe, expect, it, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { isToolAvailableForGrade, INTERACTIVE_LABS_LIST } from '../data/subjectsData';
import { defaultLabForGrade, labsEntrySubjectForGrade, useAppNavigation } from './useAppNavigation';
import { GRADE_STORAGE_KEY } from '../navigation/appLocation';
import { CourseLesson } from '../types';

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

// Regression test: labsCatalogOpen used to live as a plain useState in App.tsx, outside this
// hook's history-tracked state entirely. Browser/hardware back navigation would correctly restore
// selectedSubject via popstate, but leave labsCatalogOpen stuck on its last value — so going back
// from an open lab could land the user on a *different* lab instead of the catalog they came from.
describe('labs catalog state survives browser back navigation', () => {
  beforeEach(() => {
    window.localStorage.removeItem(GRADE_STORAGE_KEY);
    window.history.replaceState(null, '', '/');
  });

  it('restores labsCatalogOpen when going back from an open lab to the catalog', async () => {
    const { result } = renderHook(() => useAppNavigation({ isLessonLocked: () => false }));

    act(() => {
      result.current.handleSelectPole('labs');
      result.current.setLabsCatalogOpen(true);
    });
    expect(result.current.labsCatalogOpen).toBe(true);

    act(() => {
      result.current.openLab('arabic_conjugator');
      result.current.setLabsCatalogOpen(false);
    });
    expect(result.current.selectedSubject).toBe('arabic_conjugator');
    expect(result.current.labsCatalogOpen).toBe(false);

    // Simulate the browser/hardware back button — popstate fires asynchronously in jsdom.
    await act(async () => {
      window.history.back();
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.labsCatalogOpen).toBe(true);
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
    expect(result.current.mobileTab).toBe('exercises');

    act(() => {
      result.current.goHome();
      result.current.handleSelectPole('labs');
    });
    expect(result.current.mobileTab).toBe('games');

    act(() => {
      result.current.goHome();
      result.current.handleSelectPole('challenges');
    });
    expect(result.current.mobileTab).toBe('exercises');

    act(() => {
      result.current.goHome();
      result.current.handleMobileTab('exercises');
    });
    expect(result.current.mainCategory).toBe('exams');
    expect(result.current.mobileTab).toBe('exercises');
    expect(result.current.isHomeActive).toBe(false);
  });
});

describe('primary back button returns to the parent screen', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('returns from a lesson to courses without putting that lesson back in the browser history', async () => {
    const lesson: CourseLesson = {
      id: 'back-test-lesson', grade: '1AP', subject: 'math', categoryAr: 'الحساب',
      titleAr: 'درس', summaryAr: '', rulesAr: [], quiz: [],
    };
    const { result } = renderHook(() => useAppNavigation({ isLessonLocked: () => false }));
    act(() => result.current.handleSelectPole('courses'));
    act(() => result.current.handleSelectLesson(lesson));
    expect(window.location.pathname).toBe('/lesson/back-test-lesson');

    act(() => result.current.goBack());
    expect(result.current.selectedLesson).toBeNull();
    expect(result.current.mainCategory).toBe('courses');
    expect(window.location.pathname).toBe('/courses');

    await act(async () => {
      window.history.back();
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(result.current.selectedLesson).toBeNull();
  });

  it('returns from a lab to its catalogue, then to home', () => {
    const { result } = renderHook(() => useAppNavigation({ isLessonLocked: () => false }));
    act(() => {
      result.current.handleSelectPole('labs');
      result.current.setLabsCatalogOpen(true);
    });
    act(() => {
      result.current.openLab('primary_math_ops');
      result.current.setLabsCatalogOpen(false);
    });
    act(() => result.current.goBack());
    expect(result.current.labsCatalogOpen).toBe(true);
    expect(result.current.isHomeActive).toBe(false);
    act(() => result.current.goBack());
    expect(result.current.isHomeActive).toBe(true);
  });
});
