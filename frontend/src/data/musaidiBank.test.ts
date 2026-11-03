import { describe, it, expect } from 'vitest';
import { COURSES_DATA } from './coursesData';
import { buildMusaidiBank, normalizeArabic, searchMusaidi } from './musaidiBank';
import type { CourseLesson } from '../types';

describe('« مساعدي » question bank', () => {
  const bank = buildMusaidiBank(COURSES_DATA);

  it('covers every primary grade with prepared answers', () => {
    for (const grade of ['1AP', '2AP', '3AP', '4AP', '5AP'] as const) {
      expect(bank.filter((i) => i.grade === grade).length, grade).toBeGreaterThan(20);
    }
    for (const item of bank) {
      expect(item.questionAr, item.id).toBeTruthy();
      expect(item.answerAr, item.id).toBeTruthy();
    }
  });

  it('uses unique ids that point back to a catalog lesson', () => {
    const ids = new Set(bank.map((i) => i.id));
    expect(ids.size).toBe(bank.length);
    const lessons = new Set(COURSES_DATA.map((l) => l.id));
    expect(bank.every((i) => lessons.has(i.lessonId))).toBe(true);
  });

  it('never leaks the answer through free hints', () => {
    for (const item of bank) {
      expect(item.hintsAr, item.id).not.toContain(item.answerAr);
    }
    const lesson = {
      id: 'x', grade: '1AP', subject: 'math', titleAr: 't', categoryAr: '', summaryAr: '', rulesAr: [], quiz: [],
      progressiveExercises: [{
        id: 'e1', level: 1, levelLabelAr: '', problemAr: '٣ + ٢ = ؟', hintsAr: [], xpReward: 1, solutionAr: '٥',
        detailedCorrectionAr: 'نعدّ ٣ ثم نضيف ٢\n٥',
        progressiveHints: [{ labelAr: 'تلميح صغير', contentAr: 'استعمل أصابعك' }, { labelAr: 'الحل التفصيلي', contentAr: '٥' }],
      }],
    } as unknown as CourseLesson;
    const [item] = buildMusaidiBank([lesson]);
    expect(item.hintsAr).toEqual(['استعمل أصابعك']);
    expect(item.stepsAr).toEqual(['نعدّ ٣ ثم نضيف ٢']);
  });

  it('searches Arabic without harakat or spelling variants', () => {
    expect(normalizeArabic('الجَمْعُ بِالاحْتِفَاظِ')).toBe('الجمع بالاحتفاظ');
    expect(normalizeArabic('إِلَى مَدْرَسَة')).toBe('الي مدرسه');
    const sample = bank.slice(0, 50);
    const word = normalizeArabic(sample[0].questionAr).split(/\s+/)[0];
    expect(searchMusaidi(sample, word).length).toBeGreaterThan(0);
    expect(searchMusaidi(sample, '   ')).toHaveLength(sample.length);
  });
});
