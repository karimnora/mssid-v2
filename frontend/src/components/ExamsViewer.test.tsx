import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamsViewer } from './ExamsViewer';
import { LocaleProvider } from '../context/LocaleContext';

const renderExams = (grade: '1AP' | '2AP' | '5AP', onOpenCourses = vi.fn()) =>
  render(
    <LocaleProvider>
      <ExamsViewer grade={grade} onOpenCourses={onOpenCourses} />
    </LocaleProvider>
  );

describe('ExamsViewer bank', () => {
  it('shows the subject bank on 2AP instead of a single next-exam CTA', async () => {
    renderExams('2AP');
    expect(document.querySelector('[data-exam-layout="grid"]')).toBeTruthy();
    expect(document.querySelector('[data-exam-layout="funnel"]')).toBeNull();
    await userEvent.click(document.querySelector('[data-exam-subject="math"]') as HTMLElement);
    expect(document.querySelector('[data-next-exam-cta]')).toBeNull();
    expect(screen.getAllByText('فتح ورقة الامتحان').length).toBeGreaterThan(0);
    expect(screen.getByText('جميع الفصول')).toBeInTheDocument();
  });

  it('hides timer and print on a 2AP paper', async () => {
    renderExams('2AP');
    await userEvent.click(document.querySelector('[data-exam-subject="math"]') as HTMLElement);
    await userEvent.click(screen.getAllByText('فتح ورقة الامتحان')[0]);
    expect(screen.queryByText('طباعة')).not.toBeInTheDocument();
    expect(screen.queryByText(/إظهار كافة الحلول/)).not.toBeInTheDocument();
  });

  it('sends 1AP to courses instead of an empty bank or average calculator', async () => {
    const onOpenCourses = vi.fn();
    renderExams('1AP', onOpenCourses);
    expect(document.querySelector('[data-exam-layout="empty"]')).toBeTruthy();
    expect(screen.queryByText(/حاسبة المعدل/)).not.toBeInTheDocument();
    expect(screen.queryByText('فتح ورقة الامتحان')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /فتح دروس السنة الأولى/ }));
    expect(onOpenCourses).toHaveBeenCalledTimes(1);
  });

  it('does not show the average calculator on 2AP', () => {
    renderExams('2AP');
    expect(screen.queryByText(/حاسبة المعدل/)).not.toBeInTheDocument();
  });
});
