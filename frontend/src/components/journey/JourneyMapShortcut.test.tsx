import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { JourneyMapShortcut } from './JourneyMapShortcut';
import { SubjectArt3d, SUBJECT_ART_IDS } from '../subjectArt3d';

vi.mock('../../context/LocaleContext', () => ({ useLocaleContext: () => ({ locale: 'ar' }) }));

describe('free home shortcut to Didou’s map', () => {
  it('opens the map, or the planet for a grade without a map yet', () => {
    const onOpen = vi.fn();
    const { rerender } = render(<JourneyMapShortcut onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button', { name: 'افتح خريطة رحلة ديدو' }));
    expect(onOpen).toHaveBeenCalledTimes(1);
    rerender(<JourneyMapShortcut onOpen={onOpen} hasMap={false} />);
    expect(screen.getByRole('button', { name: 'افتح كوكب ديدو' })).toBeTruthy();
  });
});

describe('3D subject drawings', () => {
  it('draws the ten subjects with gradient ids that never collide on one page', () => {
    const { container } = render(<>{SUBJECT_ART_IDS.map((id) => <div key={id}><SubjectArt3d id={id} /><SubjectArt3d id={id} /></div>)}</>);
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id);
    expect(SUBJECT_ART_IDS).toHaveLength(10);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-zA-Z0-9_-]+$/.test(id))).toBe(true);
    expect(render(<SubjectArt3d id="unknown" />).container.innerHTML).toBe('');
  });
});
