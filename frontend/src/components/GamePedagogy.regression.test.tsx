import React from 'react';
import { it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { LessonPracticePanel } from './lessonViewer/LessonPracticePanel';
import { COURSES_DATA } from '../data/coursesData';
import { stripArabicTashkeel } from '../utils/textFormatter';
import { LocaleProvider } from '../context/LocaleContext';

it('keeps tanwin game choices visible when vocalization is off', () => {
  const lesson = COURSES_DATA.find(lesson => lesson.id === 'arabic-1ap-t3-tanween')!;
  render(<LocaleProvider><LessonPracticePanel lesson={{ ...lesson, progressiveExercises: [] }}
    practice={{} as React.ComponentProps<typeof LessonPracticePanel>['practice']}
    renderArabicText={text => stripArabicTashkeel(text ?? '')} gameAnswers={{}}
    onSelectGameOption={vi.fn()} onResetGame={vi.fn()} playful /></LocaleProvider>);
  const emptyButtons = [...document.querySelectorAll('button')].filter(button => !button.textContent?.trim());
  expect(emptyButtons).toHaveLength(0);
});
