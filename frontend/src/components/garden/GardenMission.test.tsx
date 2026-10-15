import React, { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { GardenMission } from './GardenMission';
import { GARDEN_PLANS, type GardenBand } from '../../data/garden/gardenMission';
import type { FamilyResults } from '../../utils/familyLearning';
import { recordGardenResult } from '../../utils/gardenMissionProgress';
import { ActivityExitProvider } from '../../context/ActivityExitContext';
import { speakText, stopSpeech } from '../../utils/speech';
vi.mock('../../utils/speech', () => ({ speakText: vi.fn().mockResolvedValue(undefined), stopSpeech: vi.fn() }));
beforeEach(() => { cleanup(); vi.clearAllMocks(); });
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));
function Harness({ premium = true, band = '1AP', initial = {}, onRecord = vi.fn() }: {
    premium?: boolean;
    band?: GardenBand;
    initial?: FamilyResults;
    onRecord?: (id: string, outcome: string) => void;
}) {
    const [results, setResults] = useState(initial);
    return <ActivityExitProvider><GardenMission band={band} language="fr" premium={premium} results={results} onResult={(id, outcome) => { onRecord(id, outcome); setResults(p => recordGardenResult(p, id, outcome)); }}/></ActivityExitProvider>;
}
function sow(n: number) { within(screen.getByRole('group', { name: 'Emplacements du potager' })).getAllByRole('button').slice(0, n).forEach(b => fireEvent.click(b)); click('Vérifier mon défi'); }
function supplies(answer: string) { click('Continuer la mission'); fireEvent.change(screen.getByRole('textbox'), { target: { value: answer } }); click('Vérifier mon défi'); click('Terminer cette séance'); }
describe('guided garden mission', () => {
    it('keeps a replayable free two-challenge session without revealing paid sessions', () => {
        const record = vi.fn();
        render(<Harness premium={false} onRecord={record}/>);
        sow(6);
        supplies('2');
        expect(screen.getByText(/La séance découverte est terminée/)).toBeInTheDocument();
        expect(screen.queryByRole('group', { name: 'Les pots à arroser' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Prendre soin/ })).toBeDisabled();
        click('Rejouer la découverte');
        expect(screen.getByRole('group', { name: 'Emplacements du potager' })).toBeInTheDocument();
        expect(record).toHaveBeenCalledTimes(2);
    });
    it('preserves work when touching the current session and when canceling a restart', () => {
        render(<Harness />);
        const first = within(screen.getByRole('group', { name: 'Emplacements du potager' })).getAllByRole('button')[0];
        fireEvent.click(first);
        fireEvent.click(screen.getByRole('button', { name: /Préparer le jardin/ }));
        expect(first).toHaveAttribute('aria-pressed', 'true');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        click('Recommencer ce défi');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Continuer' }));
        expect(first).toHaveAttribute('aria-pressed', 'true');
    });
    it('completes three sessions and records a deferred adult observation honestly', () => {
        const record = vi.fn();
        render(<Harness onRecord={record}/>);
        sow(6);
        supplies('2');
        click('Ouvrir la séance suivante');
        for (let i = 1; i <= 3; i++) {
            click('Arroser le pot ' + i);
            click('Arroser le pot ' + i);
        }
        click('Vérifier mon défi');
        click('Continuer la mission');
        click('Sami');
        click('Terminer cette séance');
        click('Ouvrir la séance suivante');
        for (let i = 1; i <= 2; i++)
            for (let j = 0; j < 3; j++)
                click('Ajouter au panier ' + i);
        click('Vérifier mon défi');
        click('Continuer la mission');
        click('Faire l’observation plus tard');
        expect(screen.getByText('Le carnet du jardin')).toBeInTheDocument();
        expect(record).toHaveBeenLastCalledWith('garden-mission:1AP:5', 'review');
        expect(screen.getByLabelText('Défis réussis')).toHaveTextContent('5 / 6');
        expect(screen.getByText('À reprendre ensemble')).toBeInTheDocument();
    });
    it('distinguishes hints and wrong attempts from independent success without duplicate success', () => {
        const record = vi.fn();
        render(<Harness onRecord={record}/>);
        click('Un indice');
        sow(6);
        expect(record).toHaveBeenLastCalledWith('garden-mission:1AP:0', 'helped');
        expect(screen.queryByRole('button', { name: 'Vérifier mon défi' })).not.toBeInTheDocument();
        click('Continuer la mission');
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '1' } });
        click('Vérifier mon défi');
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '٢' } });
        click('Vérifier mon défi');
        expect(record).toHaveBeenLastCalledWith('garden-mission:1AP:1', 'helped');
        expect(record).toHaveBeenCalledTimes(3);
    });
    it('plays English preschool guidance and stops it on unmount', async () => {
        const view = render(<GardenMission band="preschool" language="en" premium results={{}} onResult={vi.fn()}/>);
        await act(async () => click('Listen to Didou'));
        expect(speakText).toHaveBeenLastCalledWith(GARDEN_PLANS.preschool.tasks[0].prompt.en, 'en-US');
        expect(screen.queryByText('Écouter Didou')).not.toBeInTheDocument();
        view.unmount();
        expect(stopSpeech).toHaveBeenCalled();
    });
    it('does not treat listening to the story as help', async () => {
        const initial = Object.fromEntries(GARDEN_PLANS['1AP'].tasks.slice(0, 3).map(t => [t.id, { outcome: 'independent' as const, at: '2026-10-15T11:00:00Z' }]));
        const record = vi.fn();
        render(<Harness initial={initial} onRecord={record}/>);
        await act(async () => click('Écouter le récit'));
        click('Sami');
        expect(record).toHaveBeenLastCalledWith('garden-mission:1AP:3', 'independent');
    });
    it('requires the existing parent gate before recording an adult success', () => {
        const initial = Object.fromEntries(GARDEN_PLANS['1AP'].tasks.slice(0, 5).map(t => [t.id, { outcome: 'independent' as const, at: '2026-10-15T11:00:00Z' }]));
        const record = vi.fn();
        render(<Harness initial={initial} onRecord={record}/>);
        expect(screen.queryByRole('button', { name: 'Réussi sans aide' })).not.toBeInTheDocument();
        click('Espace parent');
        const dialog = screen.getByRole('dialog');
        const sum = dialog.textContent!.match(/(\d+) \+ (\d+) = \?/)!;
        fireEvent.change(within(dialog).getByRole('spinbutton'), { target: { value: String(Number(sum[1]) + Number(sum[2])) } });
        fireEvent.click(within(dialog).getByRole('button', { name: 'Continuer' }));
        click('Réussi sans aide');
        expect(record).toHaveBeenLastCalledWith('garden-mission:1AP:5', 'independent');
        expect(screen.getByLabelText('Défis réussis')).toHaveTextContent('6 / 6');
    });
});
