import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import type { CourseLesson } from '../../types';
import type { MusaidiItem } from '../../data/musaidiBank';
import { MusaidiTwin } from './MusaidiTwin';
import { arabicTimes } from './MusaidiParentSummary';
import { TwoColumnCorrection } from '../manipulations/TwoColumnProblem';

afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear(); });

const options = [
  { id: 'a', textAr: '9', isCorrect: true },
  { id: 'b', textAr: '6', isCorrect: false },
];
const lesson = {
  id: 'math-5ap-fractions', grade: '5AP', subject: 'math', trimester: 1, titleAr: 'الكسور',
  quiz: [{ id: 'q1', questionAr: '3/5 = ?/15', options }],
  progressiveExercises: [{ id: 'ex1', type: 'qcm', problemAr: '3/5 = ?/15', options }],
} as unknown as CourseLesson;
const item = (kind: 'quiz' | 'exercise'): MusaidiItem => ({
  id: `math-5ap-fractions:${kind}:${kind === 'quiz' ? 'q1' : 'ex1'}`, sourceId: kind === 'quiz' ? 'q1' : 'ex1',
  competenceId: 'math-5ap-c-fractions', lessonId: lesson.id, grade: '5AP', subject: 'math', trimester: 1,
  kind, questionAr: '3/5 = ?/15', hintsAr: [], answerAr: '9', stepsAr: [],
} as MusaidiItem);
const renderTwin = (kind: 'quiz' | 'exercise', onPracticeResult = vi.fn()) => {
  setStoredLocale('fr');
  render(<LocaleProvider><MusaidiTwin item={item(kind)} courses={[lesson]} onPracticeResult={onPracticeResult} /></LocaleProvider>);
  return onPracticeResult;
};
const choices = () => screen.getAllByRole('button').map(b => b.textContent);

describe('musaidi twin', () => {
  it('shuffles the authored order, where the right answer is stored first', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    renderTwin('quiz');
    expect(choices()).toEqual(['6', '9']);
  });

  it('keeps one order while the child answers', () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0);
    renderTwin('quiz');
    random.mockReturnValue(0.99);
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    expect(choices()).toEqual(['6', '9']);
  });

  it('records a missed quiz twin on the skill without a never-cleared exercise id', () => {
    const result = renderTwin('quiz');
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    expect(result).toHaveBeenCalledWith(lesson.id, expect.objectContaining({ outcome: 'fail', helped: true, competenceId: 'math-5ap-c-fractions' }));
    expect(result.mock.calls[0][1].exerciseId).toBeUndefined();
  });

  it('still links a missed exercise twin to its lesson exercise', () => {
    const result = renderTwin('exercise');
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    expect(result).toHaveBeenCalledWith(lesson.id, expect.objectContaining({ outcome: 'fail', exerciseId: 'ex1' }));
  });
});

describe('parent summary wording', () => {
  const text = (n: number) => { const { container, unmount } = render(<>{arabicTimes(n)}</>); const t = container.textContent; unmount(); return t; };
  it('uses the Arabic counted forms', () => {
    expect(text(1)).toBe('مرة واحدة');
    expect(text(2)).toBe('مرتين');
    expect(text(3)).toBe('3 مرات');
    expect(text(10)).toBe('10 مرات');
    expect(text(11)).toBe('11 مرة');
    expect(text(103)).toBe('103 مرات');
  });
});

describe('two-column correction', () => {
  it('lets Arabic operation lines read right to left while number lines stay left to right', () => {
    const { container } = render(<TwoColumnCorrection solution={<p>89 000</p>} operations={'89 250\nالحد الأدنى: 89 000'} />);
    const lines = [...container.querySelectorAll('[data-two-columns] [dir="auto"]')].map(l => l.textContent);
    expect(lines).toEqual(['89 250', 'الحد الأدنى: 89 000']);
    expect(container.querySelector('h4')?.textContent).toBe('الحل');
  });
});
