import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolModulePicker } from './PreschoolModulePicker';
import { PRESCHOOL_MODULES } from '../../data/preschool';

vi.mock('./usePreschoolAudio', () => ({
  usePreschoolSpeech: () => ({ speak: vi.fn() }),
  playSuccessChime: vi.fn(),
  playBubblePop: vi.fn(),
}));

const renderHub = (onSelectSpecialTool = vi.fn(), onSelectModule = vi.fn()) =>
  render(
    <PreschoolModulePicker
      modules={PRESCHOOL_MODULES}
      language="fr"
      completedByModule={{}}
      onSelectModule={onSelectModule}
      onSelectSpecialTool={onSelectSpecialTool}
      onExit={vi.fn()}
    />,
  );

describe('PreschoolModulePicker — 3-door hub', () => {
  it('home shows three doors and hides the learning paths', () => {
    renderHub();
    expect(screen.getByText('Ateliers')).toBeInTheDocument();
    expect(screen.getByText('Apprendre')).toBeInTheDocument();
    expect(screen.getByText('Jouer')).toBeInTheDocument();
    expect(screen.queryByText('Le Bateau des Lettres')).not.toBeInTheDocument();
    expect(screen.queryByText('Tableau Magique')).not.toBeInTheDocument();
  });

  it('Jouer opens the games hub directly', () => {
    const onSelectSpecialTool = vi.fn();
    renderHub(onSelectSpecialTool);
    fireEvent.click(screen.getByText('Jouer'));
    expect(onSelectSpecialTool).toHaveBeenCalledWith('games');
  });

  it('Apprendre uses a world funnel before listing modules', () => {
    const onSelectModule = vi.fn();
    renderHub(vi.fn(), onSelectModule);
    fireEvent.click(screen.getByText('Apprendre'));
    expect(screen.getByText('Lettres, chiffres et formes')).toBeInTheDocument();
    expect(screen.queryByText('Le Bateau des Lettres')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Lettres, chiffres et formes'));
    expect(screen.getByText('Le Bateau des Lettres')).toBeInTheDocument();
    expect(screen.getByText('Mes Premiers Nombres')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Le Bateau des Lettres'));
    expect(onSelectModule).toHaveBeenCalledWith('preschool-letters');
  });

  it('science world lists seasons then days-and-months', () => {
    const onSelectModule = vi.fn();
    renderHub(vi.fn(), onSelectModule);
    fireEvent.click(screen.getByText('Apprendre'));
    fireEvent.click(screen.getByText('Sciences et monde'));
    expect(screen.getByText('Les Quatre Saisons')).toBeInTheDocument();
    expect(screen.getByText('Jours et mois')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Jours et mois'));
    expect(onSelectModule).toHaveBeenCalledWith('preschool-calendar');
  });
});
