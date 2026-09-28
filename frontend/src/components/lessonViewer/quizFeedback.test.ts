import { describe, expect, it } from 'vitest';
import { getQuizFeedback, quizFeedbackSpeakText } from './quizFeedback';
import type { QuizQuestion } from '../../types';

const question: QuizQuestion = {
  id: 'q1-divfrac',
  questionAr: 'الكسر الذي يعبر عن النصف هو:',
  options: [
    { id: 'a', textAr: '1/2', isCorrect: true, explanationAr: 'صحيح! 1/2 يقرأ النصف.' },
    { id: 'b', textAr: '1/4', isCorrect: false, explanationAr: '1/4 هو الرُّبُعُ، وليس النِّصْفَ. النصف يقسم الشيء إلى جزأين متساويين.' },
  ],
};

describe('getQuizFeedback', () => {
  it('explains the mistaken option first, then the correct one', () => {
    const feedback = getQuizFeedback(question, 'b');
    expect(feedback?.isCorrect).toBe(false);
    expect(feedback?.primaryAr).toContain('الرُّبُعُ');
    expect(feedback?.correctAr).toContain('1/2');
    expect(quizFeedbackSpeakText(feedback!)).toContain('الصواب:');
  });

  it('uses the correct option explanation after a right answer', () => {
    const feedback = getQuizFeedback(question, 'a');
    expect(feedback?.isCorrect).toBe(true);
    expect(feedback?.primaryAr).toContain('النصف');
    expect(feedback?.correctAr).toBeUndefined();
  });

  it('skips one-word explanations and names the chosen option instead', () => {
    const thin: QuizQuestion = {
      id: 'q-thin',
      questionAr: 'هل 2 + 2 = 4؟',
      hintAr: 'اجمع الوحدات: اثنان زائد اثنين يساوي أربعة.',
      options: [
        { id: 'a', textAr: 'نعم', isCorrect: true, explanationAr: 'نعم' },
        { id: 'b', textAr: 'لا', isCorrect: false, explanationAr: 'لا' },
      ],
    };
    const wrong = getQuizFeedback(thin, 'b');
    expect(wrong?.primaryAr).not.toBe('لا');
    expect(wrong?.primaryAr).toContain('اجمع الوحدات');

    const right = getQuizFeedback(thin, 'a');
    expect(right?.primaryAr).toContain('اجمع الوحدات');

    const noHint: QuizQuestion = { ...thin, hintAr: undefined };
    const wrongNoHint = getQuizFeedback(noHint, 'b');
    expect(wrongNoHint?.primaryAr).toContain('غير مناسب');
    expect(wrongNoHint?.primaryAr).toContain('لا');
  });
});
