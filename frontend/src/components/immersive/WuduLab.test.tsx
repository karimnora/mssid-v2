import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LocaleProvider } from '../../context/LocaleContext';
import { WuduLab } from './WuduLab';
import { WUDU_STEPS } from '../../data/immersive/wudu';

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
  it('keeps the correct ordering prefix after an error and rewards completion once', () => {
    const onReward = vi.fn();
    render(<LocaleProvider><WuduLab onReward={onReward} /></LocaleProvider>);
    fireEvent.click(document.querySelectorAll('[data-lab-tab]')[1]);
    fireEvent.click(screen.getByRole('button', { name: WUDU_STEPS[0].titleAr }));
    fireEvent.click(screen.getByRole('button', { name: WUDU_STEPS[1].titleAr }));
    fireEvent.click(screen.getByRole('button', { name: WUDU_STEPS[6].titleAr }));
    expect(screen.getByText('2/7')).toBeInTheDocument();
    for (const step of WUDU_STEPS.slice(2)) fireEvent.click(screen.getByRole('button', { name: step.titleAr }));
    expect(screen.getByText('7/7')).toBeInTheDocument();
    expect(onReward).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: WUDU_STEPS[6].titleAr }));
    expect(onReward).toHaveBeenCalledTimes(1);
  });
});
