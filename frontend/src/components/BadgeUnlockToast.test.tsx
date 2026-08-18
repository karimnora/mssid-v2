import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BadgeUnlockToast } from './BadgeUnlockToast';
import { Badge } from '../types';

const confettiMock = vi.fn();
vi.mock('canvas-confetti', () => ({
  default: (...args: unknown[]) => confettiMock(...args),
}));

const badge: Badge = {
  id: 'b_math_star',
  titleAr: 'نجم الرياضيات',
  descriptionAr: 'أكملت 5 دروس رياضيات',
  icon: '⭐',
} as Badge;

describe('BadgeUnlockToast', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when the queue is empty', () => {
    const { container } = render(<BadgeUnlockToast queue={[]} onDismiss={vi.fn()} />);
    expect(container.querySelector('[class*="pointer-events-auto"]')).not.toBeInTheDocument();
  });

  it('shows the first badge in the queue', () => {
    render(<BadgeUnlockToast queue={[badge]} onDismiss={vi.fn()} />);
    expect(screen.getByText('نجم الرياضيات')).toBeInTheDocument();
    expect(screen.getByText('أكملت 5 دروس رياضيات')).toBeInTheDocument();
  });

  // Regression coverage for the harvested-idea addition: a badge unlock is the one milestone
  // celebration in the app that had zero visual payoff beyond the toast text itself.
  it('fires confetti once when a new badge appears in the queue', () => {
    render(<BadgeUnlockToast queue={[badge]} onDismiss={vi.fn()} />);
    expect(confettiMock).toHaveBeenCalledTimes(1);
  });

  it('does not fire confetti again for the same badge on re-render', () => {
    const { rerender } = render(<BadgeUnlockToast queue={[badge]} onDismiss={vi.fn()} />);
    expect(confettiMock).toHaveBeenCalledTimes(1);
    rerender(<BadgeUnlockToast queue={[badge]} onDismiss={vi.fn()} />);
    expect(confettiMock).toHaveBeenCalledTimes(1);
  });

  it('dismisses on the close button click', () => {
    const onDismiss = vi.fn();
    render(<BadgeUnlockToast queue={[badge]} onDismiss={onDismiss} />);
    act(() => {
      screen.getByLabelText('إغلاق').click();
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
