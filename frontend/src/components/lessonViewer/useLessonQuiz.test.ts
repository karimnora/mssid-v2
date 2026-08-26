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
    expect(result.current.quizAnswered).toBe(true);
  });

  it('marks the quiz answered even when a 1AP child picks a wrong option', () => {
    const { result } = renderHook(() =>
      useLessonQuiz({ lesson, quizAlreadyValidated: false, onCompleteQuiz: vi.fn() })
    );
    act(() => {
      result.current.handleSelectOption('q1', 'b');
      result.current.handleSelectOption('q2', 'd');
    });
    expect(result.current.quizAnswered).toBe(true);
    expect(result.current.quizFullyPassed).toBe(false);
  });

  // Regression test for a locked-forever question (review externe #2, principe "zero frustration") :
  // a wrong guess used to be a dead end (selectedAnswers[questionId] !== undefined blocked any
  // further click on that question). It must now be a real retry, not just a recorded miss.
  it('lets the student try again after a wrong guess, and awards XP once they get it right', () => {
    const onCompleteQuiz = vi.fn();
    const { result } = renderHook(() =>
      useLessonQuiz({ lesson, quizAlreadyValidated: false, onCompleteQuiz })
    );

    act(() => {
      result.current.handleSelectOption('q1', 'b'); // wrong
    });
    expect(onCompleteQuiz).not.toHaveBeenCalled();
    expect(result.current.selectedAnswers.q1).toBe('b');

    act(() => {
      result.current.handleSelectOption('q1', 'a'); // retry, correct this time
    });
    expect(onCompleteQuiz).toHaveBeenCalledWith('math-1ap-nombres', 15);
    expect(result.current.selectedAnswers.q1).toBe('a');
    expect(result.current.awardedQuizIds.has('q1')).toBe(true);
  });

  it('ignores further clicks on a question once it has been answered correctly (no double XP)', () => {
    const onCompleteQuiz = vi.fn();
    const { result } = renderHook(() =>
      useLessonQuiz({ lesson, quizAlreadyValidated: false, onCompleteQuiz })
    );

    act(() => {
      result.current.handleSelectOption('q1', 'a'); // correct
    });
    expect(onCompleteQuiz).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleSelectOption('q1', 'b'); // locked now, must be a no-op
    });
    expect(onCompleteQuiz).toHaveBeenCalledTimes(1);
    expect(result.current.selectedAnswers.q1).toBe('a');
  });
});
