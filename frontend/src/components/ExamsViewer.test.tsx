import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamsViewer } from './ExamsViewer';
import { LocaleProvider } from '../context/LocaleContext';

const renderExams = (grade: '1AP' | '2AP' | '3AP' | '5AP', onOpenCourses = vi.fn()) =>
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
    expect(screen.queryByText('جميع الفصول')).not.toBeInTheDocument();
  });

  it('hides timer and solutions on a 2AP paper but keeps print', async () => {
    renderExams('2AP');
    await userEvent.click(document.querySelector('[data-exam-subject="math"]') as HTMLElement);
    await userEvent.click(screen.getAllByText('فتح ورقة الامتحان')[0]);
    expect(screen.getByText('طباعة الموضوع')).toBeInTheDocument();
    expect(document.querySelector('[data-exam-print="true"]')).toBeTruthy();
    expect(document.querySelector('[data-exam-print-corrige="true"]')).toBeTruthy();
    expect(document.querySelector('.printable-sheet')).toBeTruthy();
    expect(document.querySelector('[data-exam-print-identity="true"]')).toBeTruthy();
    expect(screen.queryByText(/إظهار كافة الحلول/)).not.toBeInTheDocument();
  });

  it('marks the open 5AP paper as printable so window.print is not blank', async () => {
    renderExams('5AP');
    await userEvent.click(document.querySelector('[data-exam-subject="math"]') as HTMLElement);
    await userEvent.click(screen.getAllByText('فتح ورقة الامتحان')[0]);
    expect(screen.getByText('طباعة الموضوع')).toBeInTheDocument();
    expect(screen.getByText('طباعة التصحيح')).toBeInTheDocument();
    expect(document.querySelector('.printable-sheet')).toBeTruthy();
    expect(document.querySelector('[data-exam-print-identity="true"]')).toBeTruthy();
    expect(document.querySelector('[data-print-mode="subject"]')).toBeTruthy();
  });

  it('marks the open 3AP paper as printable', async () => {
    renderExams('3AP');
    await userEvent.click(document.querySelector('[data-exam-subject="math"]') as HTMLElement);
    await userEvent.click(screen.getAllByText('فتح ورقة الامتحان')[0]);
    expect(screen.getByText('طباعة الموضوع')).toBeInTheDocument();
    expect(document.querySelector('.printable-sheet')).toBeTruthy();
    expect(document.querySelector('[data-exam-print-identity="true"]')).toBeTruthy();
  });

  it('lists at least 3 composition papers for 5AP math T1', async () => {
    renderExams('5AP');
    await userEvent.click(document.querySelector('[data-exam-kind="composition"]') as HTMLElement);
    await userEvent.click(document.querySelector('[data-exam-subject="math"]') as HTMLElement);
    await userEvent.click(document.querySelector('[data-exam-trimester="1"]') as HTMLElement);
    expect(screen.getAllByText('فتح ورقة الامتحان').length).toBeGreaterThanOrEqual(3);
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

  it('lands 5AP on the évaluation des acquis pack without trimester tabs', () => {
    renderExams('5AP');
    expect(document.querySelector('[data-exam-kind="acquis"]')).toBeTruthy();
    expect(document.querySelector('[data-exam-filter-trail]')?.textContent).toMatch(/مكتسبات/);
    expect(document.querySelector('[data-exam-trimester]')).toBeNull();
    expect(document.querySelector('[data-exam-subject="math"]')).toBeTruthy();
    expect(document.querySelector('[data-exam-subject="arabic"]')).toBeTruthy();
    expect(document.querySelector('[data-exam-subject="science"]')).toBeTruthy();
  });

  it('shows trimester tabs once the parent switches to compositions', async () => {
    renderExams('5AP');
    await userEvent.click(document.querySelector('[data-exam-kind="composition"]') as HTMLElement);
    expect(document.querySelector('[data-exam-trimester="all"]')).toBeTruthy();
    expect(document.querySelector('[data-exam-trimester="1"]')).toBeTruthy();
  });

  it('lists a science homework paper on 3AP T2', async () => {
    renderExams('3AP');
    await userEvent.click(document.querySelector('[data-exam-kind="devoir"]') as HTMLElement);
    await userEvent.click(document.querySelector('[data-exam-subject="science"]') as HTMLElement);
    await userEvent.click(document.querySelector('[data-exam-trimester="2"]') as HTMLElement);
    expect(screen.getAllByText('فتح ورقة الامتحان').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/النبات وغذاء الحيوان/)).toBeInTheDocument();
  });
});
