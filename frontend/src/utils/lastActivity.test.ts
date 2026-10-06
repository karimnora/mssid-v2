import { afterEach, describe, expect, it } from 'vitest';
import { lastActivityTitle, readLastActivity, writeLastActivity } from './lastActivity';

describe('lastActivity', () => {
  afterEach(() => {
    localStorage.clear();
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

  it('ignores a truncated or typed-wrong payload instead of crashing', () => {
    localStorage.setItem('mssid_last_activity', '{"kind":"lesson"}');
    expect(readLastActivity()).toBeNull();
    localStorage.setItem('mssid_last_activity', '{not json');
    expect(readLastActivity()).toBeNull();
  });
});
