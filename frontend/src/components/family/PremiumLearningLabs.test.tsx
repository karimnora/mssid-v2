import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PremiumLearningLabs } from './PremiumLearningLabs';
import { speakText, stopSpeech } from '../../utils/speech';
import { marketAmounts, premiumLabResultId, SHADOW_EXPERIMENTS, shadowLength } from '../../data/family/premiumLabJourneys';
import { familyStorageKey, prioritizedModules, readFamilyResults } from '../../utils/familyLearning';
import type { PrimaryGrade } from '../../types';
vi.mock('../../utils/speech', () => ({ speakText: vi.fn().mockResolvedValue(undefined), stopSpeech: vi.fn() }));
beforeEach(() => { cleanup(); localStorage.clear(); vi.clearAllMocks(); });
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

describe('Didou premium adventures', () => {
  it('records counting, price and change independently and ignores a repeated correct check', () => {
    const record = vi.fn(); render(<PremiumLearningLabs grade="3AP" fr premium onResult={record}/>);
    for (let i = 0; i < 4; i++) click('Prendre un sachet sur l’étal');
    click('Vérifier'); expect(record).toHaveBeenLastCalledWith('adventure:3AP:market:0', 'independent');
    click('Continuer'); fireEvent.change(screen.getByRole('textbox'), { target: { value: '0' } }); click('Vérifier');
    expect(record).toHaveBeenLastCalledWith('adventure:3AP:market:1', 'review');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '٥٠٠' } }); click('Vérifier');
    expect(record).toHaveBeenLastCalledWith('adventure:3AP:market:1', 'helped');
    expect(screen.queryByRole('button', { name: 'Vérifier' })).not.toBeInTheDocument();
    click('Continuer'); fireEvent.change(screen.getByRole('textbox'), { target: { value: '500' } }); click('Vérifier'); click('Continuer');
    expect(screen.getByText(/Mission terminée/)).toBeInTheDocument();
    expect(record).toHaveBeenLastCalledWith('adventure:3AP:market:2', 'independent');
    expect(record).toHaveBeenCalledTimes(4);
  });
  it('retains a real replayable free discovery and never exposes the next paid calculation', () => {
    render(<PremiumLearningLabs grade="1AP" fr premium={false} onResult={vi.fn()}/>);
    click('Ajouter un sachet'); click('Ajouter un sachet'); click('Vérifier'); click('Continuer');
    expect(screen.getByText(/Mission découverte terminée/)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); click('Rejouer');
    expect(screen.getByRole('button', { name: 'Ajouter un sachet' })).toBeEnabled();
  });
  it('records wrong predictions, requires retry, and preserves help on the successful retry', () => {
    const record = vi.fn(); render(<PremiumLearningLabs grade="4AP" fr premium onResult={record}/>);
    fireEvent.click(screen.getByRole('button', { name: /L’atelier des ombres/ }));
    click('Plus longue'); click('Tester ma prédiction');
    expect(record).toHaveBeenLastCalledWith('adventure:4AP:science:0', 'review');
    expect(screen.queryByRole('button', { name: 'Expérience suivante' })).not.toBeInTheDocument();
    click('Réessayer l’expérience'); click('Plus courte'); click('Tester ma prédiction');
    expect(record).toHaveBeenLastCalledWith('adventure:4AP:science:0', 'helped');
    click('Expérience suivante'); click('Plus longue'); click('Tester ma prédiction');
    expect(record).toHaveBeenLastCalledWith('adventure:4AP:science:1', 'independent');
    click('Expérience suivante'); click('Plus courte'); click('Tester ma prédiction'); click('Expérience suivante');
    expect(screen.getByText(/Mission terminée/)).toBeInTheDocument();
  });
  it('reads the Arabic lesson in Arabic even with French navigation and stops it when leaving', async () => {
    const view = render(<PremiumLearningLabs grade="1AP" fr premium onResult={vi.fn()}/>);
    fireEvent.click(screen.getByRole('button', { name: /L’aventure du lecteur/ }));
    await act(async () => click('Écouter Didou'));
    expect(speakText).toHaveBeenCalledWith('أَيْنَ الْقِطَّةُ؟', 'ar-SA');
    await act(async () => click('Écouter le récit en arabe'));
    expect(speakText).toHaveBeenLastCalledWith(expect.any(String), 'ar-SA');
    view.unmount(); expect(stopSpeech).toHaveBeenCalled();
  });
  it('keeps the parent observations after reload and isolated by child', () => {
    const id = premiumLabResultId('2AP', 'science', 0);
    const key = familyStorageKey('user:7:child:1', '2AP');
    localStorage.setItem(key, JSON.stringify({ [id]: { outcome: 'review', at: '2026-10-15T10:00:00Z', completedAt: '2026-10-14T10:00:00Z' }, 'adventure:2AP:science:99': { outcome: 'independent', at: '2026-10-15T10:00:00Z' } }));
    const results = readFamilyResults(key);
    expect(results[id]?.outcome).toBe('review'); expect(Object.keys(results)).toEqual([id]);
    expect(readFamilyResults(familyStorageKey('user:7:child:2', '2AP'))).toEqual({});
    render(<PremiumLearningLabs grade="2AP" fr premium results={results} onResult={vi.fn()}/>);
    fireEvent.click(screen.getByText('Repères pour le parent'));
    expect(screen.getByText('À reprendre')).toBeInTheDocument();
    expect(screen.getByText('1/9 défis réussis')).toBeInTheDocument();
  });
  it('opens distinct thematic problems for Premium while keeping discovery rights unchanged', () => {
    const record = vi.fn();
    const view = render(<PremiumLearningLabs grade="3AP" fr premium={false} onResult={record}/>);
    fireEvent.click(screen.getByText('Choisir mon aventure'));
    expect(screen.getByRole('button', {name:/Le jardin de l’école/})).toBeDisabled();
    view.rerender(<PremiumLearningLabs grade="3AP" fr premium onResult={record}/>);
    fireEvent.click(screen.getByRole('button', {name:/Le jardin de l’école/}));
    for(let i=0;i<3;i++) click('Ajouter un sachet'); click('Vérifier');
    expect(record).toHaveBeenLastCalledWith('adventure:3AP:garden:market:0', 'independent');
    click('Continuer'); fireEvent.change(screen.getByRole('textbox'), {target:{value:'225'}}); click('Vérifier');
    expect(record).toHaveBeenLastCalledWith('adventure:3AP:garden:market:1', 'independent');
    fireEvent.click(screen.getByRole('button', {name:/L’aventure du lecteur/}));
    fireEvent.click(screen.getByRole('button', {name:'إِلَى أَصُصٍ.'}));
    expect(record).toHaveBeenLastCalledWith('adventure:3AP:garden:story:0', 'independent');
  });
  it('uses the lab difficulty when preparing the guided week', () => {
    expect(prioritizedModules('3AP', { 'adventure:3AP:market:2': { outcome: 'review', at: '2026-10-15T10:00:00Z' } })[0].domain).toBe('measures');
  });
  it('keeps the market amounts valid in all five grades and the shadow experiments physically consistent', () => {
    for (const grade of ['1AP', '2AP', '3AP', '4AP', '5AP'] as PrimaryGrade[]) {
      const amounts = marketAmounts(grade); expect(amounts.total + amounts.change).toBe(amounts.payment); expect(amounts.change).toBeGreaterThanOrEqual(0);
    }
    expect(shadowLength(20, 45)).toBeCloseTo(20);
    for (const experiment of SHADOW_EXPERIMENTS) {
      expect(Number(experiment.before.angle !== experiment.after.angle) + Number(experiment.before.height !== experiment.after.height)).toBe(1);
      const delta = shadowLength(experiment.after.height, experiment.after.angle) - shadowLength(experiment.before.height, experiment.before.angle);
      expect(delta > 0 ? 'longer' : 'shorter').toBe(experiment.prediction);
    }
  });
});
