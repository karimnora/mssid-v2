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
});
