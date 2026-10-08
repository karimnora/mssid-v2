import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PreschoolApp } from './PreschoolApp';

vi.mock('./PreschoolMagicBoard', () => ({
  PreschoolMagicBoard: ({ onExit }: { onExit: () => void }) => <button onClick={onExit}>Retour du tableau</button>,
}));
vi.mock('./GamesHub', () => ({ GamesHub: () => <div>Jeux</div> }));
vi.mock('./PreschoolMuteButton', () => ({ PreschoolMuteButton: () => null }));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('mssid_preschool_language', 'fr');
});

describe('PreschoolApp navigation', () => {
  it('returns from the magic board to the workshops list', () => {
    render(<PreschoolApp onExit={vi.fn()} />);
    fireEvent.click(screen.getByText('Ateliers'));
    fireEvent.click(screen.getByText('Tableau Magique'));
    fireEvent.click(screen.getByText('Retour du tableau'));
    expect(screen.getByText('Tableau Magique')).toBeInTheDocument();
    expect(screen.getByText('Piano et mélodies')).toBeInTheDocument();
    expect(screen.queryByText('Choisis une porte et joue avec Dido !')).not.toBeInTheDocument();
  });

  it('returns from a learning path to the previously selected group', () => {
    render(<PreschoolApp onExit={vi.fn()} />);
    fireEvent.click(screen.getByText('Apprendre'));
    fireEvent.click(screen.getByText('Lettres, chiffres et formes'));
    fireEvent.click(screen.getByText('Mes premières lettres'));
    fireEvent.click(screen.getByRole('button', { name: 'Retour' }));
    expect(screen.getByText('Mes premières lettres')).toBeInTheDocument();
    expect(screen.getByText('De 0 à 5')).toBeInTheDocument();
  });
});
