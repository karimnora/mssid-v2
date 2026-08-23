import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MathInteractive } from './MathInteractive';

describe('MathInteractive written_operation', () => {
  it('shows the official two-column pose', () => {
    render(
      <MathInteractive
        config={{
          type: 'written_operation',
          titleAr: 'الجمع العمودي دون احتفاظ',
          introAr: 'وحدات ثم عشرات.',
          operations: [
            {
              id: 'a',
              labelAr: '23 + 15',
              operationsAr: '  23\n+ 15\n----\n  38',
              solutionAr: 'الناتج 38.',
            },
          ],
        }}
      />,
    );

    expect(screen.getByText('الجمع العمودي دون احتفاظ')).toBeInTheDocument();
    expect(document.querySelector('[data-math-worked-example="two-column"]')).not.toBeNull();
    expect(screen.getByText('23 + 15')).toBeInTheDocument();
    fireEvent.click(screen.getByText('23 + 15'));
    expect(screen.getByText(/الناتج 38/)).toBeInTheDocument();
  });
});
