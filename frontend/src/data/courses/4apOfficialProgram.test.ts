import { describe, expect, it } from 'vitest';
import { COURSES_4AP } from './4AP';
import { ARABIC_4AP } from './4AP/arabic';
import { ENGLISH_4AP } from './4AP/english';
import { HISTORY_GEO_4AP } from './4AP/history_geo';
import { ISLAMIC_4AP } from './4AP/islamic';
import { MATH_4AP } from './4AP/math';
import { SCIENCE_4AP } from './4AP/science';
import { OFFICIAL_EXAMS_DATA } from '../examsData';

const FIVE_AP_MATH_MARKERS = /مليون|999,?999|1,?000,?000|مساحة المربع|مساحة المستطيل|m²|cm²/;
const FIVE_AP_ARABIC_IDS = [
  'arabic-4ap-maf3ul-mutlaq-liajlihi',
  'arabic-4ap-types-of-plurals-duals',
  'arabic-4ap-hamza-mutatarrifa',
];
const FIVE_AP_HISTORY_IDS = [
  'history-4ap-islamic-conquest-maghreb',
  'geo-4ap-population-distribution',
  'geo-4ap-natural-resources',
  'geo-4ap-economic-activities',
];

function stripArabicMarks(text: string): string {
  return text.replace(/[\u064B-\u065F\u0670\u0640\u0651]/g, '');
}

function levelsOf(lesson: (typeof COURSES_4AP)[number]): number[] {
  return Array.from(new Set((lesson.progressiveExercises || []).map((ex) => ex.level))).sort();
}

describe('4AP official program alignment', () => {
  it('covers the five mandatory 4AP math notions without 5AP overflow', () => {
    const blob = MATH_4AP.map((l) => `${l.id} ${l.titleAr} ${l.summaryAr} ${l.rulesAr.join(' ')}`).join('\n');
    expect(blob).toMatch(/99,?999|100,?000|ألف/);
    expect(blob).toMatch(/قسمة إقليدية|القسمة الإقليدية/);
    expect(blob).toMatch(/كسر/);
    expect(blob).toMatch(/تناسب/);
    expect(blob).toMatch(/محيط/);
    expect(MATH_4AP.some((l) => FIVE_AP_MATH_MARKERS.test(`${l.titleAr} ${l.rulesAr.join(' ')}`))).toBe(false);
  });

  it('gives calculation examples the official العمليات column', () => {
    const withOps = MATH_4AP.flatMap((l) => l.examplesAr || []).filter((ex) => ex.operationsAr);
    expect(withOps.length).toBeGreaterThanOrEqual(6);
  });

  it('teaches الأسماء الموصولة and keeps 4AP iʿrab only', () => {
    const blob = ARABIC_4AP.map((l) => `${l.id} ${l.titleAr} ${l.summaryAr} ${l.rulesAr.join(' ')}`).join('\n');
    expect(blob).toMatch(/أسماء موصولة|الاسم الموصول|موصول/);
    for (const id of FIVE_AP_ARABIC_IDS) {
      expect(ARABIC_4AP.find((l) => l.id === id), id).toBeUndefined();
    }
  });

  it('gives each grammar lesson a الكلمة / إعرابها table', () => {
    const grammar = ARABIC_4AP.filter((l) => l.categoryAr === 'التراكيب النحوية');
    expect(grammar.length).toBeGreaterThanOrEqual(4);
    for (const lesson of grammar) {
      expect(lesson.irabTableAr?.length, lesson.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('teaches the water cycle and air/combustion as real 4AP science units', () => {
    const water = SCIENCE_4AP.find((l) => l.id === 'science-4ap-water-cycle');
    const air = SCIENCE_4AP.find((l) => l.id === 'science-4ap-air-combustion');
    expect(water, 'science-4ap-water-cycle').toBeDefined();
    expect(air, 'science-4ap-air-combustion').toBeDefined();
    const waterPlain = stripArabicMarks(`${water!.titleAr} ${water!.summaryAr} ${water!.rulesAr.join(' ')}`);
    const airPlain = stripArabicMarks(`${air!.titleAr} ${air!.summaryAr} ${air!.rulesAr.join(' ')}`);
    expect(waterPlain).toMatch(/دورة/);
    expect(waterPlain).toMatch(/تبخر|بخار/);
    expect(waterPlain).toMatch(/تكاث/);
    expect(waterPlain).toMatch(/تساق|مطر|ثلج/);
    expect(airPlain).toMatch(/احتراق/);
    expect(airPlain).toMatch(/اكسجين|أكسجين/i);
  });

  it('does not keep 5AP history-geo lessons and covers prehistory', () => {
    for (const id of FIVE_AP_HISTORY_IDS) {
      expect(HISTORY_GEO_4AP.find((l) => l.id === id), id).toBeUndefined();
    }
    const blob = HISTORY_GEO_4AP.map((l) => `${l.id} ${l.titleAr} ${l.summaryAr} ${l.rulesAr.join(' ')}`).join('\n');
    expect(blob).toMatch(/ما قبل التاريخ|ما قَبْلَ التَّارِيخ|عين الحنش|أدوات حجرية/);
  });

  it('drops 3AP sourates الشرح and التين from 4AP islamic', () => {
    const blob = ISLAMIC_4AP.map((l) => `${l.id} ${l.titleAr} ${l.summaryAr}`).join('\n');
    expect(blob).not.toMatch(/سورة الشرح|سُورَةُ الشَّرْح/);
    expect(blob).not.toMatch(/سورة التين|سُورَةُ التِّين/);
  });

  it('covers English daily routines without 5AP jobs or present continuous', () => {
    const blob = ENGLISH_4AP.map((l) => `${l.id} ${l.titleAr} ${l.summaryAr} ${l.rulesAr.join(' ')}`).join('\n');
    expect(blob).toMatch(/wake up|get dressed|have breakfast|daily routine/i);
    expect(ENGLISH_4AP.some((l) => /jobs-occupations|present-continuous/.test(l.id))).toBe(false);
  });

  it('gives every 4AP lesson four practice tiers and an evaluation battery', () => {
    for (const lesson of COURSES_4AP) {
      expect(levelsOf(lesson), `${lesson.id} tiers`).toEqual([1, 2, 3, 4]);
      expect(lesson.evaluationExercises?.length, `${lesson.id} eval`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('4AP math exams follow the teaching trimester', () => {
  it('tests division in T2 and perimeter in T3, never both in T1', () => {
    const t1 = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'exam-4ap-math-t1-2026');
    const t2 = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'exam-4ap-math-t2-2026');
    const t3 = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'exam-4ap-math-t3-2026');
    const hw = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'homework-4ap-math-t1-2026');
    expect(t1?.relatedLessonIds).not.toContain('math-4ap-division-euclidean');
    expect(t2?.relatedLessonIds).toContain('math-4ap-division-euclidean');
    expect(t3?.relatedLessonIds?.some((id) => id.includes('perimeter'))).toBe(true);
    expect(hw?.titleAr).not.toMatch(/قسمة إقليدية/);
    expect(`${hw?.exercises.map((e) => e.contentAr).join(' ')} ${hw?.problemExercise.contentAr}`).not.toMatch(/محيط/);
  });
});
