import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MultiplicationGroupsVisual, buildRepeatedAdditionSum } from './MultiplicationGroupsVisual';

describe('MultiplicationGroupsVisual', () => {
  it('builds repeated addition sum', () => {
    expect(buildRepeatedAdditionSum(3, 4)).toBe('4 + 4 + 4');
    expect(buildRepeatedAdditionSum(2, 3)).toBe('3 + 3');
  });

  it('renders group rows and equation', () => {
    render(<MultiplicationGroupsVisual groups={2} perGroup={3} itemEmoji="⭐" />);
    expect(document.querySelector('[data-multiplication-visual]')).toBeTruthy();
    expect(screen.getByText('2 × 3 = 3 + 3 = 6')).toBeInTheDocument();
    expect(screen.getAllByText('⭐')).toHaveLength(6);
  });
});
