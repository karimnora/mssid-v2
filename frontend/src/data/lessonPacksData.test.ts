import { describe, expect, it } from 'vitest';
import { LESSON_PACKS_CATALOG } from './lessonPacksData';
import { COURSES_DATA } from './coursesData';
import { PRESCHOOL_MODULES } from './preschool';

describe('LESSON_PACKS_CATALOG lessonsCount', () => {
  it('matches live COURSES_DATA / PRESCHOOL_MODULES counts', () => {
    const byGrade = (grade: string) => COURSES_DATA.filter((l) => l.grade === grade).length;

    const expected: Record<string, number> = {
      pack_baraem_t1: PRESCHOOL_MODULES.length,
      pack_1ap_full: byGrade('1AP'),
      pack_2ap_full: byGrade('2AP'),
      pack_3ap_full: byGrade('3AP'),
      pack_4ap_full: byGrade('4AP'),
      pack_5ap_full: byGrade('5AP'),
    };

    for (const pack of LESSON_PACKS_CATALOG) {
      expect(pack.lessonsCount, pack.id).toBe(expected[pack.id]);
    }
  });
});
