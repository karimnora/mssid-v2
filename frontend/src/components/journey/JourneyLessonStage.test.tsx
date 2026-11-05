import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { JourneyLessonStage } from './JourneyLessonStage';
import { DidouPortrait } from '../world/DidouPortrait';
import { WORLD_DECOR } from '../world/worldArt';
import { WorldAmbience } from '../world/WorldAmbience';
import { journeyForGrade } from '../../data/journey/journeyWorlds';

describe('a journey lesson in its painted world (pilot: Constantine)', () => {
  it('lets Didou welcome the child once, and only then shows the lesson', () => {
    const say = vi.fn();
    render(
      <JourneyLessonStage worldId="constantine" decor={WORLD_DECOR.constantine} locale="ar" lessonTitle="القسمة الإقليدية" say={say}>
        <p>محتوى الدرس</p>
      </JourneyLessonStage>,
    );
    const dialog = screen.getByRole('dialog', { name: 'ديدو يرحّب بك' });
    expect(dialog.textContent).toContain('«القسمة الإقليدية»');
    expect(say).toHaveBeenCalledTimes(1);
    // Nothing of the lesson shows (or talks) behind Didou's welcome.
    expect(screen.queryByText('محتوى الدرس')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'استمع' }));
    expect(say).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('button', { name: 'هيّا!' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('محتوى الدرس')).toBeTruthy();
  });
});

describe('the eight painted worlds', () => {
  it('each has a landscape and a portrait decor, and some life over it', () => {
    const ids = journeyForGrade('1AP')!.map((w) => w.id);
    expect(ids).toHaveLength(8);
    for (const id of ids) {
      expect(WORLD_DECOR[id].landscape).toBeTruthy();
      expect(WORLD_DECOR[id].portrait).toBeTruthy();
      const { container, unmount } = render(<svg><WorldAmbience id={id} /></svg>);
      expect(container.querySelectorAll('.wa > *').length).toBeGreaterThan(0);
      unmount();
    }
  });
});

describe('rendered Didou', () => {
  it('keeps the bust API and switches pose', () => {
    const { container } = render(<DidouPortrait size={64} pose="cheer" label="ديدو" />);
    const svg = container.querySelector('[data-didou-portrait]')!;
    expect(svg.getAttribute('data-pose')).toBe('cheer');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.querySelector('image')?.getAttribute('href')).toBeTruthy();
  });
});
