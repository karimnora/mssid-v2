import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { COURSES_DATA } from '../coursesData';
import { useLessonPractice } from '../../components/lessonViewer/useLessonPractice';

vi.mock('../../components/preschool/usePreschoolAudio', () => ({ playGentleNudge: vi.fn(), playSuccessChime: vi.fn() }));
const getLesson = (id: string) => COURSES_DATA.find(lesson => lesson.id === id)!;

describe('confirmed pedagogical corrections', () => {
  it('rejects 456 hundreds in 456789 and teaches 4567 hundreds instead', () => {
    const lesson = getLesson('math-5ap-large-numbers');
    const ex = lesson.progressiveExercises!.find(e => e.id === 'math-5ap-large-numbers-ex1b')!;
    const { result } = renderHook(() => useLessonPractice(lesson, vi.fn()));
    act(() => result.current.handlePracticeAnswerChange(ex.id, 'true'));
    act(() => result.current.checkPracticeExercise(ex));
    expect(result.current.practiceCorrect[ex.id]).toBe(false);
    expect(ex.detailedCorrectionAr).toContain(String(Math.floor(456789 / 100)));
    expect(lesson.detailedCourse!.commonMistakes![0].correctionAr).toContain('456');
    expect(lesson.detailedCourse!.commonMistakes![0].correctionAr).not.toContain('4567 مثلاً لعدد الآلاف');
  });

  it('places the millions after units and thousands in its hint', () => {
    const ex = getLesson('math-5ap-large-numbers').progressiveExercises!.find(e => e.id === 'math-5ap-large-numbers-ex1')!;
    expect(ex.hintsAr.join(' ')).toContain('الثالثة');
    expect(ex.hintsAr.join(' ')).not.toContain('الثانية');
  });

  it('asks for the complete sentence when the French correction expects a complete sentence', () => {
    const ex = getLesson('french-5ap-projet1-monde-animal').progressiveExercises!.find(e => e.id === 'french-5ap-animal-ex6')!;
    expect(ex.problemAr).toContain('phrase entière');
    expect(ex.problemAr).not.toContain('uniquement');
    const { result } = renderHook(() => useLessonPractice(getLesson('french-5ap-projet1-monde-animal'), vi.fn()));
    act(() => result.current.handlePracticeAnswerChange(ex.id, 'L’éléphant est grand et il a de longues défenses'));
    act(() => result.current.checkPracticeExercise(ex));
    expect(result.current.practiceCorrect[ex.id]).toBe(true);
  });

  it.each([
    ['english-5ap-school-ex2', 'his', true],
    ['english-5ap-school-ex2', 'Her', false],
    ['english-5ap-school-ex6', 'My brother has a new bike', true],
    ['english-5ap-school-ex6', 'My brother have a new bike.', false],
  ])('checks the targeted English skill in %s for %s', (id, answer, expected) => {
    const lesson = getLesson('english-5ap-unit1-school-family');
    const ex = lesson.progressiveExercises!.find(e => e.id === id)!;
    const { result } = renderHook(() => useLessonPractice(lesson, vi.fn()));
    act(() => result.current.handlePracticeAnswerChange(ex.id, answer));
    act(() => result.current.checkPracticeExercise(ex));
    expect(result.current.practiceCorrect[ex.id]).toBe(expected);
  });

  it('identifies the clarified substance, not the quantity, as tamyiz in the kilogram sentence', () => {
    const lesson = getLesson('arabic-5ap-tamyiz');
    const exercise = lesson.progressiveExercises!.find(ex => ex.id === 'arabic-5ap-tamyiz-ex3')!;
    const kilogramSentence = exercise.matchingPairsAr!.find(pair => pair.leftAr.includes('كِيلُوغْرَاماً'))!;
    expect(kilogramSentence.leftAr.split(' (')[0]).toBe('تَمْراً');
    expect(kilogramSentence.rightAr).toBe('تمييز ذات');
    expect(exercise.solutionAr).not.toContain('كيلوغراماً =');
  });

  it('does not teach a kasra before the omitted alif of qulti', () => {
    const lesson = getLesson('arabic-5ap-morphology-verbs');
    const exercise = lesson.progressiveExercises!.find(ex => ex.id === 'arabic-5ap-morph-ex4')!;
    expect(exercise.options!.find(option => option.isCorrect)!.textAr).toBe('قُلْتِ');
    expect(exercise.detailedCorrectionAr).toContain('تُضَمُّ القَافُ');
    expect(exercise.detailedCorrectionAr).not.toContain('يُكْسَرُ مَا قَبْلَهُ');
  });

  it('accepts the verb alone as requested in the jazm evaluation', () => {
    const lesson = getLesson('arabic-5ap-mutal-verbs-jazm-amr');
    const exercise = lesson.evaluationExercises!.find(ex => ex.id === 'arabic-5ap-mutal-irab-eval3')!;
    const onComplete = vi.fn();
    const { result } = renderHook(() => useLessonPractice(lesson, onComplete));
    act(() => result.current.handlePracticeAnswerChange(exercise.id, 'يجرِ'));
    act(() => result.current.checkPracticeExercise(exercise));
    expect(result.current.practiceCorrect[exercise.id]).toBe(true);
    expect(onComplete).toHaveBeenCalledWith(lesson.id, exercise.xpReward);
  });

  it('does not supply the classification answer in the wada exercise prompt', () => {
    const exercise = COURSES_DATA.filter(l => l.grade === '4AP').flatMap(l => l.progressiveExercises || []).find(ex => ex.id === 'ar4-mutal-ex2')!;
    expect(exercise).toBeDefined();
    expect(exercise.problemAr).not.toContain(exercise.fillBlankAnswerAr!);
    expect(exercise.problemAr).toContain('وَعَدَ');
  });

  it('supplies masses for the 3AP comparison and orders the stone before the water', () => {
    const exercise = COURSES_DATA.flatMap(l => l.progressiveExercises || []).find(ex => ex.id === 'ex3-sc3ap-mat')!;
    expect(exercise).toBeDefined();
    expect(exercise.problemAr.match(/\d+ غ/g)).toEqual(['1 غ', '50 غ', '250 غ']);
    expect(exercise.solutionAr.indexOf('الحجر')).toBeLessThan(exercise.solutionAr.indexOf('الماء'));
    expect(exercise.solutionAr).not.toContain('غالباً');
  });
});
