import { afterEach, describe, expect, it } from 'vitest';
import { lastActivityTitle, readLastLessonActivity, readLastActivity, writeLastActivity } from './lastActivity';
import { setActiveProgressOwner } from './progressOwner';

describe('lastActivity', () => {
  afterEach(() => {
    localStorage.clear();
    setActiveProgressOwner(null);
  });

  it('stores and reads a lesson resume target', () => {
    writeLastActivity({
      kind: 'lesson',
      lessonId: 'math-1ap-t1-spatial-relations',
      subject: 'math',
      grade: '1AP',
      titleAr: 'الفضاء',
      titleFr: 'L’espace',
    });
    const stored = readLastActivity();
    expect(stored?.kind).toBe('lesson');
    expect(stored && stored.kind === 'lesson' ? stored.lessonId : '').toBe('math-1ap-t1-spatial-relations');
    expect(lastActivityTitle(stored!, 'fr')).toBe('L’espace');
    expect(lastActivityTitle(stored!, 'ar')).toBe('الفضاء');
  });

  it('retains the last lesson after a lab, without sharing it with a sibling', () => {
    setActiveProgressOwner(7,1);
    writeLastActivity({kind:'lesson',lessonId:'math-5ap-fractions',subject:'math',grade:'5AP',titleAr:'الكسور'});
    writeLastActivity({kind:'lab',toolId:'math',grade:'5AP',titleAr:'ورشة'});
    expect(readLastActivity()?.kind).toBe('lab');
    expect(readLastLessonActivity()?.lessonId).toBe('math-5ap-fractions');
    setActiveProgressOwner(7,2);
    expect(readLastLessonActivity()).toBeNull();
  });

  it('ignores a truncated or typed-wrong payload instead of crashing', () => {
    localStorage.setItem('mssid_last_activity', '{"kind":"lesson"}');
    expect(readLastActivity()).toBeNull();
    localStorage.setItem('mssid_last_activity', '{not json');
    expect(readLastActivity()).toBeNull();
  });

  it('keeps a resume target on one profile from appearing after another person logs in', () => {
    writeLastActivity({
      kind: 'lesson',
      lessonId: 'math-1ap-t1-spatial-relations',
      subject: 'math',
      grade: '1AP',
      titleAr: 'الفضاء',
    });
    setActiveProgressOwner(42);
    expect(readLastActivity()).toBeNull();
  });
});
