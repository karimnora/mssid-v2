import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('../../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));
vi.mock('../../utils/immersiveFeedback', () => ({ playPop: vi.fn(), playSoftMiss: vi.fn(), playSoftSuccess: vi.fn() }));
vi.mock('../../context/LocaleContext', () => ({ useLocaleContext: () => ({ locale: 'ar', direction: 'rtl' }) }));

import { MissionPlayer } from './MissionPlayer';
import { MATH_5AP_MISSIONS } from '../../data/missions/math5ap';

const division = MATH_5AP_MISSIONS.find((m) => m.id === 'mission-math-5ap-division')!;
const next = () => fireEvent.click(document.querySelector('[data-mission-next]')!);
/** Scenes change with an exit animation: wait for the next one to be on screen. */
const scene = (kind: string) => waitFor(() => expect(document.querySelector(`[data-scene="${kind}"]`)).toBeTruthy());

describe('MissionPlayer', () => {
  it('plays the division mission: boxes, the rule, a wrong answer explained, stars at the end', async () => {
    const onResult = vi.fn();
    const onFinish = vi.fn();
    render(<MissionPlayer mission={division} onExit={vi.fn()} onResult={onResult} onFinish={onFinish} />);

    next(); // story → boxes
    await scene('group');
    expect((document.querySelector('[data-mission-next]') as HTMLButtonElement).disabled).toBe(true);
    for (let i = 0; i < 13; i++) fireEvent.click(document.querySelector('[data-mission-fill]')!);
    expect(document.querySelector('[data-mission-fill]')).toBeNull();
    fireEvent.change(document.querySelector('[data-mission-boxes]')!, { target: { value: '13' } });
    fireEvent.change(document.querySelector('[data-mission-rest]')!, { target: { value: '1' } });
    fireEvent.click(document.querySelector('[data-mission-check]')!);
    expect(onResult).toHaveBeenLastCalledWith({ outcome: 'success', helped: false, exerciseId: 'mission-math-5ap-division:fill-boxes' });

    next(); // → rule, revealed step by step
    await scene('explain');
    for (let i = 0; i < 5; i++) next();
    await scene('choose');

    fireEvent.click(screen.getByRole('button', { name: '73' }));
    expect(screen.getByText(/6 × 73 = 438/)).toBeTruthy();
    expect(onResult).toHaveBeenLastCalledWith({ outcome: 'fail', exerciseId: 'mission-math-5ap-division:quotient-437' });
    fireEvent.click(screen.getByRole('button', { name: '72' }));
    expect(onResult).toHaveBeenLastCalledWith({ outcome: 'success', helped: true, exerciseId: 'mission-math-5ap-division:quotient-437' });

    const answer = (value: string) => {
      fireEvent.change(document.querySelector('[data-mission-input]')!, { target: { value } });
      fireEvent.click(document.querySelector('[data-mission-check]')!);
    };
    next(); await scene('numeric'); answer('6'); // the remainder can never equal the divisor
    expect(screen.getByText(/البَاقِي أَصْغَرُ دَائِماً/)).toBeTruthy();
    answer('5');
    next(); await waitFor(() => expect(screen.getByText(/200 تِلْمِيذٍ، 45/)).toBeTruthy()); answer('5'); // buses (challenge, first try)
    next(); await waitFor(() => expect(screen.getByText(/÷ 8/)).toBeTruthy()); answer('125'); // chairs (challenge, first try)
    next(); await scene('choose'); fireEvent.click(screen.getByRole('button', { name: 'نَعَمْ، صَحِيحَةٌ' })); // check (challenge, first try)
    next(); // → memo card
    await scene('recap');
    next(); // finish
    expect(onFinish).toHaveBeenCalledWith(3);
    await waitFor(() => expect(document.querySelector('[data-mission-end="3"]')).toBeTruthy());
  }, 30000);
});
