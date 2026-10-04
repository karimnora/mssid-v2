import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LocaleProvider } from '../../context/LocaleContext';
import { SoukLab } from './SoukLab';

describe('SoukLab', () => {
  it('adds bread and returns 50 DA of change from a 100 DA note', () => {
    const onReward = vi.fn();
    render(
      <LocaleProvider>
        <SoukLab grade="1AP" onReward={onReward} />
      </LocaleProvider>,
    );

    fireEvent.click(document.querySelector('[data-souk-stall="bread"]') as HTMLElement);
    fireEvent.click(document.querySelector('[data-souk-add="bread"]') as HTMLElement);
    fireEvent.click(document.querySelector('[data-souk-cash="100"]') as HTMLElement);
    fireEvent.click(document.querySelector('[data-souk-pay="true"]') as HTMLElement);

    expect(screen.getByText(/البَاقِي: 50 دج/)).toBeInTheDocument();
    expect(onReward).toHaveBeenCalled();
  });
});
