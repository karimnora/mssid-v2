import { describe, expect, it } from 'vitest';
import { getExamKind } from './examKind';
import { OFFICIAL_EXAMS_DATA } from '../data/examsData';

describe('getExamKind', () => {
  it('tags 5AP May certificate sessions as BEP, not trimester compositions', () => {
    const bep = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'exam-2018-math');
    expect(bep).toBeDefined();
    expect(getExamKind(bep!)).toBe('bep');
  });

  it('keeps the 2018 T1 communal paper as a composition once trimester is set', () => {
    const paper = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'exam-2018-trim1-math');
    expect(paper?.trimester).toBe(1);
    expect(getExamKind(paper!)).toBe('composition');
  });

  it('honours explicit devoir kind on original homework papers', () => {
    const devoir = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'homework-2ap-math-t1-2026');
    expect(devoir).toBeDefined();
    expect(getExamKind(devoir!)).toBe('devoir');
  });

  it('tags the 5AP end-of-cycle pack as évaluation des acquis', () => {
    const paper = OFFICIAL_EXAMS_DATA.find((e) => e.id === 'exam-5ap-math-acquis-2026');
    expect(paper).toBeDefined();
    expect(getExamKind(paper!)).toBe('acquis');
    expect(paper!.trimester).toBeUndefined();
  });

  it('never classifies a 1AP paper (initiation year has no formal exams)', () => {
    expect(OFFICIAL_EXAMS_DATA.filter((e) => e.grade === '1AP')).toEqual([]);
  });
});
