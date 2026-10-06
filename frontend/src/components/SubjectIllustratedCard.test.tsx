import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LocaleProvider } from '../context/LocaleContext';
import { SubjectIllustratedCard } from './SubjectIllustratedCard';

describe('SubjectIllustratedCard', () => {
  it('keeps opening and listening as independent accessible actions', () => {
    const onClick = vi.fn();
    const onSpeak = vi.fn();
    render(
      <LocaleProvider>
        <SubjectIllustratedCard
          id="math"
          nameAr="الرياضيات"
          nameFr="Mathématiques"
          onClick={onClick}
          showAudio
          onSpeak={onSpeak}
        />
      </LocaleProvider>,
    );

    const card = document.querySelector('[data-subject-card="math"]');
    const actions = card?.querySelectorAll('button');
    expect(actions).toHaveLength(2);
    expect(actions?.[0].contains(actions[1])).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: /استمع إلى الرياضيات/ }));
    expect(onSpeak).toHaveBeenCalledWith('subject-math', 'الرياضيات');
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /الرياضيات.*Mathématiques/ }));
    expect(onClick).toHaveBeenCalledOnce();

    const textPad = document.querySelector('[data-subject-text]');
    expect(textPad?.className).toContain('ps-[76px]');
    expect(textPad?.className).not.toContain('sm:p-5');
    expect(textPad?.className).not.toMatch(/(?:^|\s)p-4(?:\s|$)/);
  });
});
