import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it } from 'vitest';
import { NumberLine } from './NumberLine';
import { PlaceValueTable, MAX_SCALED_NUMBER, formatPlaceValue } from './PlaceValueTable';
import { TwoColumnProblem } from './TwoColumnProblem';
it('steps through decimal positions without drift and respects both endpoints', () => {
    function Example() { const [v, set] = useState(0); return <NumberLine min={0} max={1} step={0.1} value={v} onChange={set}/>; }
    render(<Example />);
    expect(screen.getByLabelText('أنقص خطوة')).toBeDisabled();
    for (let i = 0; i < 10; i++)
        fireEvent.click(screen.getByLabelText('أضيف خطوة'));
    expect(screen.getByRole('status')).toHaveTextContent('1');
    expect(screen.getByLabelText('أضيف خطوة')).toBeDisabled();
});
it('carries exact thousandths into whole units and never goes beyond a billion', () => {
    function Example() { const [v, set] = useState(999999n); return <PlaceValueTable value={v} onChange={set}/>; }
    render(<Example />);
    fireEvent.click(screen.getByRole('button', { name: 'الأجزاء العشرية' }));
    fireEvent.click(screen.getByLabelText('أضيف أجزاء من ألف'));
    expect(screen.getAllByRole('status')[0].textContent).toBe('1 000,000');
    expect(formatPlaceValue(MAX_SCALED_NUMBER)).toBe('1 000 000 000,000');
});
it('disables additions at the billion boundary', () => {
    render(<PlaceValueTable value={MAX_SCALED_NUMBER} onChange={() => { throw Error('out of bounds'); }}/>);
    expect(screen.getByLabelText('أضيف آحاد')).toBeDisabled();
});
it('keeps operations on the right, retains a wrong answer and accepts correction', () => {
    render(<TwoColumnProblem problem={{ statement: 'مسألة', left: 125, right: 75, operation: '+', unit: 'دج' }}/>);
    const solution = screen.getByRole('heading', { name: 'الحل / الأجوبة' }), operations = screen.getByRole('heading', { name: 'العمليات' });
    expect(solution.compareDocumentPosition(operations) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.change(screen.getByLabelText('نتيجة المسألة'), { target: { value: '190' } });
    fireEvent.click(screen.getByRole('button', { name: 'أتحقق' }));
    expect(screen.getByRole('status')).toHaveTextContent('جرّب');
    expect(screen.getByLabelText('نتيجة المسألة')).toHaveValue('190');
    fireEvent.change(screen.getByLabelText('نتيجة المسألة'), { target: { value: '200' } });
    fireEvent.click(screen.getByRole('button', { name: 'أتحقق' }));
    expect(screen.getByRole('status')).toHaveTextContent('أحسنت');
});
