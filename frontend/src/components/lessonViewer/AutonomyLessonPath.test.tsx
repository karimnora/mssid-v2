import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { COURSES_DATA } from '../../data/coursesData';
import { useLessonPractice } from './useLessonPractice';
import { AutonomyLessonPath } from './AutonomyLessonPath';

vi.mock('../preschool/usePreschoolAudio', () => ({ playGentleNudge: vi.fn(), playSuccessChime: vi.fn() }));

function mountPath(id: string) {
  const lesson = COURSES_DATA.find(l => l.id === id)!;
  const onComplete = vi.fn();
  const onPractice = vi.fn();
  function Harness() {
    const practice = useLessonPractice(lesson, onComplete);
    return <AutonomyLessonPath lesson={lesson} path={lesson.learningPath!} practice={practice} renderArabicText={t => t ?? ''} onGoToPractice={onPractice} />;
  }
  render(<Harness />);
  return { onComplete, onPractice };
}

describe('child authored learning path', () => {
  it('keeps subtraction left to right inside the Arabic prerequisite', () => {
    mountPath('math-5ap-division');
    const prerequisite = screen.getByText(/سأستعملهما لأقسم/);
    expect(prerequisite.textContent).toContain('\u206617 − 16 = 1\u2069');
  });

  it('shows the real place-value example, then guides a retry without awarding an incorrect answer', () => {
    const { onComplete } = mountPath('math-4ap-numbers-under-100k');
    expect(screen.getByRole('table')).toBeInTheDocument();
    // Tapping a digit reveals its value: 4 in the hundreds column is worth 400.
    fireEvent.click(screen.getByRole('button', { name: /^4 — / }));
    expect(document.querySelector('[data-place-value-result]')?.textContent).toContain('400');
    expect(screen.queryByText(/السوبرماركت/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'أتابع' }));
    expect(document.querySelector('[data-math-worked-example="two-column"]')).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'أتابع' }));
    expect(screen.getByRole('button', { name: 'أتابع' })).toBeDisabled();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /تحقق من الإجابة/ }));
    expect(screen.getByRole('button', { name: 'أتابع' })).toBeDisabled();
    expect(onComplete).not.toHaveBeenCalled();
    // First miss: no correction to copy, and the retry brings the first hint by itself.
    expect(document.querySelector('[data-math-worked-example]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /حاول مرة أخرى/ }));
    expect(screen.getByText(/الرقم 2 هنا لا يمثل وحدتين/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '200' } });
    fireEvent.click(screen.getByRole('button', { name: /تحقق من الإجابة/ }));
    expect(screen.getByRole('button', { name: 'أتابع' })).toBeEnabled();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('finishes the division mission only after a new grouping problem is answered', () => {
    const { onPractice } = mountPath('math-5ap-division');
    expect(screen.getAllByText(/^حصة \d$/)).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: 'أتابع' }));
    fireEvent.click(screen.getByRole('button', { name: 'أتابع' }));
    for (const answer of ['3', '5']) {
      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: answer } });
      fireEvent.click(screen.getByRole('button', { name: /تحقق من الإجابة/ }));
      fireEvent.click(screen.getByRole('button', { name: 'أتابع' }));
    }
    expect(screen.getByText(/أضع 52 بطاقة/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'أنتقل إلى التدريبات' })).toBeDisabled();
    // The previous step's answer (5) must not pass the transfer by coincidence.
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /تحقق من الإجابة/ }));
    expect(screen.getByRole('button', { name: 'أنتقل إلى التدريبات' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /حاول مرة أخرى/ }));
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '6' } });
    fireEvent.click(screen.getByRole('button', { name: /تحقق من الإجابة/ }));
    fireEvent.click(screen.getByRole('button', { name: 'أنتقل إلى التدريبات' }));
    expect(onPractice).toHaveBeenCalledTimes(1);
  });

  it('lays a French mission out left to right and never sends Arabic glosses to the French voice', () => {
    const lesson = COURSES_DATA.find(l => l.id === 'french-3ap-p2-seq3-home-sounds')!;
    const onSpeak = vi.fn();
    function Harness() {
      const practice = useLessonPractice(lesson, vi.fn());
      return <AutonomyLessonPath lesson={lesson} path={lesson.learningPath!} practice={practice} renderArabicText={t => t ?? ''} onGoToPractice={vi.fn()} speakingKey={null} onSpeak={onSpeak} />;
    }
    render(<Harness />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveAttribute('dir', 'ltr');
    // Tapping a preposition shows its meaning, Arabic gloss included, on screen.
    fireEvent.click(screen.getByRole('button', { name: 'sous' }));
    expect(document.querySelector('[data-sentence-part-result]')?.textContent).toContain('تحت');
    fireEvent.click(screen.getByRole('button', { name: 'أتابع' }));
    expect(screen.getByRole('columnheader', { name: 'La phrase' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'أتابع' }));
    // Guided question: "… à l’intérieur de la cuisine (في)." The gloss is displayed but not spoken.
    expect(screen.getByText(/à l’intérieur de la cuisine \(في\)/)).toHaveAttribute('dir', 'ltr');
    screen.getAllByRole('button', { name: 'استمع' }).forEach(button => fireEvent.click(button));
    const spokenTexts = onSpeak.mock.calls.map(call => call[1] as string);
    expect(spokenTexts.length).toBeGreaterThan(0);
    expect(spokenTexts.every(text => !/[\u0600-\u06FF]/.test(text))).toBe(true);
    // One wrong try keeps the answer hidden, then the right choice unlocks the next step.
    fireEvent.click(screen.getByRole('button', { name: 'sur' }));
    fireEvent.click(screen.getByRole('button', { name: /تحقق من الإجابة/ }));
    expect(screen.getByRole('button', { name: 'أتابع' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /حاول مرة أخرى/ }));
    fireEvent.click(screen.getByRole('button', { name: 'dans' }));
    fireEvent.click(screen.getByRole('button', { name: /تحقق من الإجابة/ }));
    expect(screen.getByRole('button', { name: 'أتابع' })).toBeEnabled();
  });

  it('rewards the end of a mission and offers the second mission of the lesson', () => {
    const { onPractice } = mountPath('math-4ap-perimeter-squares-rectangles');
    const lesson = COURSES_DATA.find(l => l.id === 'math-4ap-perimeter-squares-rectangles')!;
    const pool = [...lesson.progressiveExercises ?? [], ...lesson.evaluationExercises ?? []];
    const solve = (path: NonNullable<typeof lesson.learningPath>) => {
      for (const step of path.steps) {
        if ('exerciseId' in step) {
          const answer = pool.find(ex => ex.id === step.exerciseId)!.calculationAnswer!;
          fireEvent.change(screen.getByRole('spinbutton'), { target: { value: String(answer) } });
          fireEvent.click(screen.getByRole('button', { name: /تحقق من الإجابة/ }));
        }
        if (step !== path.steps.at(-1)) fireEvent.click(screen.getByRole('button', { name: 'أتابع' }));
      }
    };
    solve(lesson.learningPath!);
    const done = document.querySelector('[data-path-complete]')!;
    expect(done.textContent).toContain('أحسنت');
    expect(document.querySelector('[data-mission-xp]')?.textContent).toMatch(/^\+\d+ XP$/);
    // The first mission ends on an invitation to the second one, on another notion of the lesson.
    fireEvent.click(document.querySelector('[data-start-next-mission]')!);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain('المهمة الثانية');
    expect(document.querySelector('[data-geometry-figure="rectangle"]')).toBeTruthy();
    solve(lesson.learningPath!.next!);
    expect(document.querySelector('[data-start-next-mission]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'أنتقل إلى التدريبات' }));
    expect(onPractice).toHaveBeenCalledTimes(1);
  });
});

