import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LessonStepFooter } from './LessonStepFooter';
import { LessonStep } from './shared';

const steps: LessonStep[] = [
  { id: 'explanation', labelAr: 'شرح', icon: null, activeClass: '', badgeColor: '' },
  { id: 'quiz', labelAr: 'اختبار', icon: null, activeClass: '', badgeColor: '' },
];

const nextLesson = {
  id: 'l2',
  grade: '1AP' as const,
  subject: 'math' as const,
  categoryAr: '',
  titleAr: 'الدرس الثاني',
  summaryAr: '',
  rulesAr: [],
  quiz: [],
};

describe('LessonStepFooter', () => {
  it('shows a single next-step CTA mid-lesson', () => {
    render(
      <LessonStepFooter
        availableSteps={steps}
        currentStepIndex={0}
        isLastStep={false}
        nextStep={steps[1]}
        prevStep={null}
        nextLesson={nextLesson}
        renderArabicText={(t) => t || ''}
        compact
        hasQuiz
        quizPassed={false}
        onGoToStep={vi.fn()}
        onFinishLesson={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /التالي/ })).toBeInTheDocument();
    expect(document.querySelector('[data-primary-cta="finish-lesson"]')).toBeNull();
    expect(screen.queryByText(/الدرس الموالي/)).not.toBeInTheDocument();
  });

  it('does not unlock the next lesson until the quiz is passed', () => {
    render(
      <LessonStepFooter
        availableSteps={steps}
        currentStepIndex={1}
        isLastStep
        nextStep={null}
        prevStep={steps[0]}
        nextLesson={nextLesson}
        renderArabicText={(t) => t || ''}
        compact
        hasQuiz
        quizPassed={false}
        onGoToStep={vi.fn()}
        onFinishLesson={vi.fn()}
      />
    );
    expect(screen.getByText(/أجب عن الاختبار/)).toBeInTheDocument();
    expect(document.querySelector('[data-primary-cta="finish-lesson"]')).toBeNull();
  });

  it('finishes the lesson after a successful quiz', async () => {
    const onFinishLesson = vi.fn();
    render(
      <LessonStepFooter
        availableSteps={steps}
        currentStepIndex={1}
        isLastStep
        nextStep={null}
        prevStep={steps[0]}
        nextLesson={nextLesson}
        renderArabicText={(t) => t || ''}
        compact
        hasQuiz
        quizPassed
        onGoToStep={vi.fn()}
        onFinishLesson={onFinishLesson}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /الدرس الموالي/ }));
    expect(onFinishLesson).toHaveBeenCalledTimes(1);
  });

  it('lets a 1AP child continue after answering, with a short mobile CTA', async () => {
    const onFinishLesson = vi.fn();
    render(
      <LessonStepFooter
        availableSteps={steps}
        currentStepIndex={1}
        isLastStep
        nextStep={null}
        prevStep={steps[0]}
        nextLesson={nextLesson}
        renderArabicText={(t) => t || ''}
        compact
        playful
        hasQuiz
        quizPassed
        onGoToStep={vi.fn()}
        onFinishLesson={onFinishLesson}
      />
    );
    expect(document.querySelector('[data-lesson-footer="playful"]')).toBeTruthy();
    expect(screen.getByText('الدرس الثاني')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /الدَّرْسُ التَّالِي/ }));
    expect(onFinishLesson).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/الدرس الموالي/)).not.toBeInTheDocument();
  });

  it('keeps 1AP waiting until every quiz question is answered', () => {
    render(
      <LessonStepFooter
        availableSteps={steps}
        currentStepIndex={1}
        isLastStep
        nextStep={null}
        prevStep={steps[0]}
        nextLesson={nextLesson}
        renderArabicText={(t) => t || ''}
        compact
        playful
        hasQuiz
        quizPassed={false}
        onGoToStep={vi.fn()}
        onFinishLesson={vi.fn()}
      />
    );
    expect(screen.getByText(/أَجِبْ ثُمَّ نَذْهَبُ/)).toBeInTheDocument();
    expect(document.querySelector('[data-primary-cta="finish-lesson"]')).toBeNull();
  });
});
