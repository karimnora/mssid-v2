import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MathWorkedExample } from './MathWorkedExample';

describe('MathWorkedExample', () => {
  it('renders the official two-column layout when operationsAr is set', () => {
    render(
      <MathWorkedExample
        solution="132 × 4 = 528"
        operationsAr={'  132\n×   4\n-----\n  528'}
      />,
    );

    const root = document.querySelector('[data-math-worked-example="two-column"]');
    expect(root).not.toBeNull();

    const operations = document.querySelector('[data-math-column="operations"]');
    const solution = document.querySelector('[data-math-column="solution"]');
    expect(operations?.textContent).toContain('العمليات');
    expect(operations?.textContent).toContain('132');
    expect(solution?.textContent).toContain('الحل / الأجوبة');
    expect(solution?.textContent).toContain('528');

    // First column in RTL DOM = العمليات (lands on the right).
    expect(root?.firstElementChild?.getAttribute('data-math-column')).toBe('operations');
  });

  it('falls back to a single solution block without operationsAr', () => {
    render(<MathWorkedExample solution="المربع أضلاعه متساوية" />);
    expect(document.querySelector('[data-math-worked-example="flat"]')).not.toBeNull();
    expect(screen.queryByText('العمليات')).not.toBeInTheDocument();
  });
});
