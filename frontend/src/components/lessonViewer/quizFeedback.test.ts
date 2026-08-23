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
});
