import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLessonQuiz } from './useLessonQuiz';
import { CourseLesson } from '../../types';

vi.mock('../preschool/usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
}));

const lesson: CourseLesson = {
  id: 'math-1ap-nombres',
  grade: '1AP',
  subject: 'math',
  categoryAr: 'أعداد',
  titleAr: 'الأعداد',
  summaryAr: '',
  rulesAr: ['قاعدة'],
  quiz: [
    {
      id: 'q1',
      questionAr: '1+1؟',
      options: [
        { id: 'a', textAr: '2', isCorrect: true, explanationAr: 'نعم' },
        { id: 'b', textAr: '3', isCorrect: false, explanationAr: 'لا' },
      ],
    },
    {
      id: 'q2',
      questionAr: '2+1؟',
      options: [
        { id: 'c', textAr: '3', isCorrect: true, explanationAr: 'نعم' },
        { id: 'd', textAr: '4', isCorrect: false, explanationAr: 'لا' },
      ],
    },
  ],
};

describe('useLessonQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('awards XP per correct answer but validates the lesson only at 100%', () => {
    const onCompleteQuiz = vi.fn();
    const onQuizFullyValidated = vi.fn();
    const { result } = renderHook(() =>
      useLessonQuiz({ lesson, quizAlreadyValidated: false, onCompleteQuiz, onQuizFullyValidated })
    );

    act(() => {
      result.current.handleSelectOption('q1', 'a');
    });
    expect(onCompleteQuiz).toHaveBeenCalledWith('math-1ap-nombres', 15);
    expect(onQuizFullyValidated).not.toHaveBeenCalled();
    expect(result.current.quizFullyPassed).toBe(false);

    act(() => {
      result.current.handleSelectOption('q2', 'c');
    });
    expect(onQuizFullyValidated).toHaveBeenCalledWith('math-1ap-nombres');
    expect(result.current.quizFullyPassed).toBe(true);
  });
});
