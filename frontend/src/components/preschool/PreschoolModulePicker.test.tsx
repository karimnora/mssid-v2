import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolModulePicker } from './PreschoolModulePicker';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { resetFeatureFlagOverride, setFeatureFlagOverride } from '../../featureFlags';

vi.mock('./usePreschoolAudio', () => ({
  usePreschoolSpeech: () => ({ speak: vi.fn() }),
  usePreschoolMute: () => ({ muted: false, toggle: vi.fn(), setMuted: vi.fn() }),
  playSuccessChime: vi.fn(),
  playBubblePop: vi.fn(),
}));

const renderHub = (onSelectSpecialTool = vi.fn(), onSelectModule = vi.fn()) => {
  const Hub = () => {
    const [view, setView] = useState<'home' | 'ateliers' | 'apprendre'>('home');
    const [learnGroup, setLearnGroup] = useState<'foundations' | 'science' | 'civics' | 'create' | null>(null);
    return <PreschoolModulePicker
      modules={PRESCHOOL_MODULES}
      language="fr"
      completedByModule={{}}
      onSelectModule={onSelectModule}
      onSelectSpecialTool={onSelectSpecialTool}
      onExit={vi.fn()}
      view={view}
      onViewChange={setView}
      learnGroup={learnGroup}
      onLearnGroupChange={setLearnGroup}
    />;
  };
  return render(<Hub />);
};

const renderPicker = (onOpenParentBilan?: () => void) =>
  render(
    <PreschoolModulePicker
      modules={PRESCHOOL_MODULES}
      language="fr"
      completedByModule={{}}
      onSelectModule={vi.fn()}
      onSelectSpecialTool={vi.fn()}
      onExit={vi.fn()}
      view="home"
      onViewChange={vi.fn()}
      learnGroup={null}
      onLearnGroupChange={vi.fn()}
      onOpenParentBilan={onOpenParentBilan}
    />,
  );

describe('PreschoolModulePicker — 3-door hub', () => {
  it('home shows three doors and hides the learning paths', () => {
    renderHub();
    expect(screen.getByText('Ateliers')).toBeInTheDocument();
    expect(screen.getByText('Apprendre')).toBeInTheDocument();
    expect(screen.getByText('Jouer')).toBeInTheDocument();
    expect(screen.queryByText('Mes premières lettres')).not.toBeInTheDocument();
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
    expect(screen.queryByText('Mes premières lettres')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Lettres, chiffres et formes'));
    expect(screen.getByText('Mes premières lettres')).toBeInTheDocument();
    expect(screen.getByText('Encore des lettres')).toBeInTheDocument();
    expect(screen.getByText('De 0 à 5')).toBeInTheDocument();
    expect(screen.getByText('De 6 à 10')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Mes premières lettres'));
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

  it('hides the parent icon when preschoolParentBilan is off', () => {
    resetFeatureFlagOverride('preschoolParentBilan');
    renderPicker(vi.fn());
    expect(screen.queryByRole('button', { name: 'Espace parent' })).not.toBeInTheDocument();
  });

  it('shows the parent icon only when preschoolParentBilan is on', () => {
    setFeatureFlagOverride('preschoolParentBilan', true);
    renderPicker(vi.fn());
    expect(screen.getByRole('button', { name: 'Espace parent' })).toBeInTheDocument();
    resetFeatureFlagOverride('preschoolParentBilan');
  });

  it('opens the printable worksheets modal from the home banner', () => {
    renderHub();
    fireEvent.click(screen.getByText('Imprime des fiches d’exercices papier pour ton enfant'));
    expect(document.querySelector('.sheet-print-modal')).toBeTruthy();
    expect(document.querySelector('[data-preschool-printable="true"]')).toBeTruthy();
  });
});

