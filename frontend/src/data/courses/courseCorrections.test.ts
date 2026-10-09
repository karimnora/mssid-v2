import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { COURSES_DATA } from '../coursesData';
import { useLessonPractice } from '../../components/lessonViewer/useLessonPractice';

vi.mock('../../components/preschool/usePreschoolAudio', () => ({ playGentleNudge: vi.fn(), playSuccessChime: vi.fn() }));
const getLesson = (id: string) => COURSES_DATA.find(lesson => lesson.id === id)!;

describe('confirmed pedagogical corrections', () => {
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
