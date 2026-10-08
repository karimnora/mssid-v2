import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ParentGateButton, PreschoolParentBilan } from './PreschoolParentBilan';

describe('ParentGateButton', () => {
  it('opens a math gate on click and unlocks only with the correct sum', () => {
    const onUnlock = vi.fn();
    render(<ParentGateButton language="fr" onUnlock={onUnlock} />);

    fireEvent.click(screen.getByRole('button', { name: 'Espace parent' }));
    expect(screen.getByText('Espace parent')).toBeInTheDocument();

    const prompt = screen.getByText(/^\d+ \+ \d+ = \?$/);
    const [a, b] = prompt.textContent!.match(/\d+/g)!.map(Number);

    fireEvent.change(screen.getByPlaceholderText('Saisissez le résultat'), {
      target: { value: String(a + b - 1) },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
    expect(onUnlock).not.toHaveBeenCalled();
    expect(screen.getByText('Réponse incorrecte.')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Saisissez le résultat'), {
      target: { value: String(a + b) },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continuer' }));
    expect(onUnlock).toHaveBeenCalledTimes(1);
  });
});

describe('PreschoolParentBilan', () => {
  it('shows one child recap and honest statuses, not a two-child switcher', () => {
    render(
      <PreschoolParentBilan
        language="fr"
        childName="Amine"
        todayCount={1}
        streak={2}
        completedCount={3}
        modules={[{ title: 'De 0 à 5', done: 1, total: 6 }]}
        nextStep={{ title: 'Un', moduleTitle: 'De 0 à 5' }}
        rows={[
          { activityId: 'num-0', moduleId: 'preschool-numbers-0-5', title: 'Zéro', status: 'tried', count: 2, lastAt: '2026-10-08' },
          { activityId: 'num-1', moduleId: 'preschool-numbers-0-5', title: 'Un', status: 'skipped', count: 1, lastAt: '2026-10-08' },
        ]}
        onSaveName={vi.fn()}
        onPlayNext={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('Amine')).toBeInTheDocument();
    expect(screen.queryByText('Enfant 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Enfant 2')).not.toBeInTheDocument();
    expect(screen.getByText('Essai')).toBeInTheDocument();
    expect(screen.getByText('Passé')).toBeInTheDocument();
    expect(screen.queryByText('Plusieurs fois')).not.toBeInTheDocument();
  });
});
