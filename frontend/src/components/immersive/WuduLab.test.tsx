import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LocaleProvider } from '../../context/LocaleContext';
import { WuduLab } from './WuduLab';

const renderLab = () => render(
  <LocaleProvider>
    <WuduLab onReward={vi.fn()} />
  </LocaleProvider>,
);

describe('WuduLab', () => {
  it('does not skip ahead when the child taps the wrong body part', () => {
    renderLab();
    expect(screen.getByText('النِّيَّةُ وَالبَسْمَلَةُ')).toBeInTheDocument();
    fireEvent.click(document.querySelector('[data-wudu-target="feet"]') as HTMLElement);
    expect(screen.getByText('النِّيَّةُ وَالبَسْمَلَةُ')).toBeInTheDocument();
    fireEvent.click(document.querySelector('[data-wudu-target="niyyah"]') as HTMLElement);
    expect(screen.getByText('غَسْلُ اليَدَيْنِ')).toBeInTheDocument();
  });
});
