import { describe, expect, it } from 'vitest';
import {
  parseAppLocation,
  serializeAppLocation,
  toAppHref,
  viewFromNavState,
  mobileTabForView,
  isSafeLessonId,
  isLabSubjectId,
} from './appLocation';

describe('parseAppLocation', () => {
  it('maps / to home and reads grade from ?g=', () => {
    expect(parseAppLocation('/', '?g=3AP')).toEqual({
      view: { name: 'home' },
      grade: '3AP',
    });
  });

  it('ignores an invalid grade and still resolves the view', () => {
    expect(parseAppLocation('/exams', '?g=6AP')).toEqual({
      view: { name: 'exams' },
      grade: null,
    });
  });

  it('resolves preschool aliases to eveil', () => {
    expect(parseAppLocation('/eveil').view).toEqual({ name: 'eveil' });
    expect(parseAppLocation('/preschool').view).toEqual({ name: 'eveil' });
    expect(parseAppLocation('/creche').view).toEqual({ name: 'eveil' });
  });

  it('opens a safe lesson id and rejects path traversal', () => {
    expect(parseAppLocation('/lesson/math-5ap-numbers').view).toEqual({
      name: 'lesson',
      lessonId: 'math-5ap-numbers',
    });
    expect(parseAppLocation('/lesson/../secret').view).toEqual({ name: 'courses' });
    expect(parseAppLocation('/lesson/').view).toEqual({ name: 'courses' });
  });

  it('accepts a known lab tool and falls back to the labs hub for unknown tools', () => {
    expect(parseAppLocation('/labs/geometry').view).toEqual({
      name: 'labs',
      toolId: 'geometry',
    });
    expect(parseAppLocation('/labs/not_a_real_tool').view).toEqual({ name: 'labs' });
    expect(parseAppLocation('/labs').view).toEqual({ name: 'labs' });
  });

  it('unknown paths fall back to home instead of a blank screen', () => {
    expect(parseAppLocation('/this-does-not-exist').view).toEqual({ name: 'home' });
  });
});

describe('serializeAppLocation / toAppHref', () => {
  it('round-trips each primary view with the grade query', () => {
    const cases = [
      { view: { name: 'home' as const }, href: '/?g=5AP' },
      { view: { name: 'eveil' as const }, href: '/eveil?g=5AP' },
      { view: { name: 'admin' as const }, href: '/admin?g=5AP' },
      { view: { name: 'courses' as const }, href: '/courses?g=1AP' },
      { view: { name: 'lesson' as const, lessonId: 'math-5ap-numbers' }, href: '/lesson/math-5ap-numbers?g=5AP' },
      { view: { name: 'labs' as const, toolId: 'soroban' as const }, href: '/labs/soroban?g=3AP' },
      { view: { name: 'exams' as const }, href: '/exams?g=4AP' },
      { view: { name: 'challenges' as const }, href: '/challenges?g=2AP' },
    ];

    for (const { view, href } of cases) {
      const grade = href.slice(href.indexOf('g=') + 2) as '1AP' | '2AP' | '3AP' | '4AP' | '5AP';
      expect(toAppHref(view, grade)).toBe(href);
      const { pathname, search } = serializeAppLocation(view, grade);
      expect(parseAppLocation(pathname, search).view).toEqual(view);
    }
  });
});

describe('viewFromNavState', () => {
  const base = {
    isAdminConsoleActive: false,
    isPreschoolActive: false,
    isHomeActive: false,
    selectedLessonId: null as string | null,
    mainCategory: 'courses' as const,
    selectedSubject: 'math' as const,
  };

  it('gives admin and eveil priority over the rest of the stack', () => {
    expect(viewFromNavState({ ...base, isAdminConsoleActive: true, isHomeActive: true }).name).toBe('admin');
    expect(viewFromNavState({ ...base, isPreschoolActive: true }).name).toBe('eveil');
  });

  it('encodes an open lesson ahead of the category', () => {
    expect(viewFromNavState({ ...base, selectedLessonId: 'arabic-1ap-alif' })).toEqual({
      name: 'lesson',
      lessonId: 'arabic-1ap-alif',
    });
  });
});

describe('mobileTabForView / isSafeLessonId', () => {
  it('maps views onto the four mobile tabs', () => {
    expect(mobileTabForView({ name: 'home' })).toBe('home');
    expect(mobileTabForView({ name: 'lesson', lessonId: 'x' })).toBe('courses');
    expect(mobileTabForView({ name: 'exams' })).toBe('courses');
    expect(mobileTabForView({ name: 'labs', toolId: 'geometry' })).toBe('games');
    expect(mobileTabForView({ name: 'challenges' })).toBe('games');
  });

  it('rejects empty or dotted lesson ids', () => {
    expect(isSafeLessonId('math-5ap-numbers')).toBe(true);
    expect(isSafeLessonId('')).toBe(false);
    expect(isSafeLessonId('../x')).toBe(false);
  });
});

describe('isLabSubjectId', () => {
  it('includes the Algerian market and other tools missing from the old nav hardcode', () => {
    expect(isLabSubjectId('algerian_market')).toBe(true);
    expect(isLabSubjectId('wilayas_map')).toBe(true);
    expect(isLabSubjectId('primary_math_ops')).toBe(true);
    expect(isLabSubjectId('math')).toBe(false);
    expect(isLabSubjectId('exams')).toBe(false);
  });
});

