import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LocaleProvider } from '../context/LocaleContext';
import { FiniteLabQuiz } from './FiniteLabQuiz';
import { WUDU_QUIZ } from '../data/immersive/wudu';
import { SALAT_QUIZ } from '../data/immersive/salat';
import { speakText } from '../utils/speech';

vi.mock('../utils/speech', () => ({ speakText: vi.fn().mockResolvedValue(undefined), stopSpeech: vi.fn() }));

describe('FiniteLabQuiz', () => {
  it('finishes after the question bank, advances after an error, and requires an explicit restart', () => {
    const onAnswer = vi.fn();
    render(<LocaleProvider><FiniteLabQuiz questions={WUDU_QUIZ} onAnswer={onAnswer} /></LocaleProvider>);
    for (const [index, question] of WUDU_QUIZ.entries()) {
      const option = index === 0 ? question.optionsAr.find(text => text !== question.correctAr)! : question.correctAr;
      const answer = screen.getByRole('button', { name: option });
      fireEvent.click(answer);
      fireEvent.click(answer);
      expect(onAnswer).toHaveBeenCalledTimes(index + 1);
      expect(document.querySelector('[data-quiz-explanation]')).toHaveTextContent(question.explanationAr!);
      fireEvent.click(document.querySelector('[data-quiz-next]')!);
    }
    expect(document.querySelector('[data-quiz-finished]')).toBeInTheDocument();
    expect(document.querySelector('[data-finite-lab-quiz]')).not.toBeInTheDocument();
    fireEvent.click(document.querySelector('[data-quiz-restart]')!);
    fireEvent.click(screen.getByRole('button', { name: WUDU_QUIZ[0].correctAr }));
    expect(onAnswer).toHaveBeenLastCalledWith(true, true);
    fireEvent.click(document.querySelector('[data-quiz-next]')!);
    fireEvent.click(screen.getByRole('button', { name: WUDU_QUIZ[1].correctAr }));
    expect(onAnswer).toHaveBeenLastCalledWith(true, false);
  });

  it('reads the precise question and explanation on demand without including other quiz text', () => {
    render(<LocaleProvider><FiniteLabQuiz questions={SALAT_QUIZ} onAnswer={vi.fn()} /></LocaleProvider>);
    fireEvent.click(document.querySelector('[data-quiz-listen]')!);
    expect(speakText).toHaveBeenLastCalledWith(SALAT_QUIZ[0].questionAr, 'ar-SA');
    fireEvent.click(screen.getByRole('button', { name: SALAT_QUIZ[0].correctAr }));
    fireEvent.click(document.querySelector('[data-quiz-explanation-listen]')!);
    expect(speakText).toHaveBeenLastCalledWith(SALAT_QUIZ[0].explanationAr, 'ar-SA');
  });
});
