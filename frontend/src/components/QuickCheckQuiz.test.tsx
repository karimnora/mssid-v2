import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuickCheckQuiz } from './QuickCheckQuiz';

const options = [
  { labelAr: 'أربعة', isCorrect: false },
  { labelAr: 'خمسة', isCorrect: true },
  { labelAr: 'ستة', isCorrect: false },
];

describe('QuickCheckQuiz', () => {
  it('renders the question and every option, unanswered', () => {
    render(<QuickCheckQuiz questionAr="كم ناتج 2 + 3؟" options={options} />);
    expect(screen.getByText(/كم ناتج 2 \+ 3؟/)).toBeInTheDocument();
    expect(screen.getByText('أربعة')).toBeInTheDocument();
    expect(screen.getByText('خمسة')).toBeInTheDocument();
    expect(screen.getByText('ستة')).toBeInTheDocument();
  });

  it('calls onCorrect and shows success feedback when the correct option is picked', () => {
    const onCorrect = vi.fn();
    render(<QuickCheckQuiz questionAr="كم ناتج 2 + 3؟" options={options} onCorrect={onCorrect} />);

    fireEvent.click(screen.getByText('خمسة'));

    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/أحسنت! إجابة صحيحة/)).toBeInTheDocument();
  });

  it('shows a retry hint (never calls onCorrect) when a wrong option is picked, and stays answerable', () => {
    const onCorrect = vi.fn();
    render(<QuickCheckQuiz questionAr="كم ناتج 2 + 3؟" options={options} onCorrect={onCorrect} />);

    fireEvent.click(screen.getByText('أربعة'));

    expect(onCorrect).not.toHaveBeenCalled();
    expect(screen.getByText(/جرّب اختياراً آخر/)).toBeInTheDocument();

    // Still able to pick the correct one afterwards.
    fireEvent.click(screen.getByText('خمسة'));
    expect(onCorrect).toHaveBeenCalledTimes(1);
  });

  it('locks further selection once the correct answer is found', () => {
    const onCorrect = vi.fn();
    render(<QuickCheckQuiz questionAr="كم ناتج 2 + 3؟" options={options} onCorrect={onCorrect} />);

    fireEvent.click(screen.getByText('خمسة'));
    fireEvent.click(screen.getByText('أربعة'));

    expect(onCorrect).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when given an empty options list', () => {
    const { container } = render(<QuickCheckQuiz questionAr="سؤال بلا خيارات" options={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
