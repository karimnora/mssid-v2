import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParentGateModal } from './ParentGateModal';

describe('ParentGateModal', () => {
  it('does not render when isOpen is false', () => {
    render(<ParentGateModal isOpen={false} onClose={vi.fn()} onVerified={vi.fn()} />);
    expect(screen.queryByText('بوابة الوالدين')).not.toBeInTheDocument();
  });

  it('calls onVerified only when the arithmetic answer is correct', () => {
    const onVerified = vi.fn();
    render(<ParentGateModal isOpen={true} onClose={vi.fn()} onVerified={onVerified} />);

    const prompt = screen.getByText(/^\d+ \+ \d+ = \?$/);
    const [a, b] = prompt.textContent!.match(/\d+/g)!.map(Number);

    fireEvent.change(screen.getByPlaceholderText('اكتب الناتج هنا'), { target: { value: String(a + b - 1) } });
    fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
    expect(onVerified).not.toHaveBeenCalled();
    expect(screen.getByText('إجابة غير صحيحة، حاول مجدداً.')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('اكتب الناتج هنا'), { target: { value: String(a + b) } });
    fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
    expect(onVerified).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<ParentGateModal isOpen={true} onClose={onClose} onVerified={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'إغلاق' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
