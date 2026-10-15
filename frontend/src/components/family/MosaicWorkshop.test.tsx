import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MosaicWorkshop } from './MosaicWorkshop';
import { PremiumLearningLabs } from './PremiumLearningLabs';
vi.mock('../../utils/speech', () => ({ speakText: vi.fn().mockResolvedValue(undefined), stopSpeech: vi.fn() }));
beforeEach(cleanup);
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));
function tiles(n: number) { const board = screen.getByRole('group', { name: 'Mosaïque à construire' }); within(board).getAllByRole('button').slice(0, n).forEach(b => fireEvent.click(b)); }
describe('mosaic learning interaction', () => {
    it('records a failed try then helped success once, and lets a free user replay only discovery', () => {
        const record = vi.fn();
        render(<MosaicWorkshop grade="1AP" fr premium={false} results={{}} onResult={record} onPending={vi.fn()}/>);
        tiles(3);
        click('Vérifier ma mosaïque');
        expect(record).toHaveBeenLastCalledWith('mosaic:1AP:0', 'review');
        fireEvent.click(within(screen.getByRole('group', { name: 'Mosaïque à construire' })).getAllByRole('button')[3]);
        click('Vérifier ma mosaïque');
        expect(record).toHaveBeenLastCalledWith('mosaic:1AP:0', 'helped');
        expect(screen.queryByRole('button', { name: 'Vérifier ma mosaïque' })).not.toBeInTheDocument();
        click('Continuer les mosaïques');
        expect(screen.getByText(/Découverte terminée/)).toBeInTheDocument();
        click('Recommencer ce défi');
        expect(record).toHaveBeenCalledTimes(2);
        expect(screen.queryAllByRole('button', { pressed: true })).toHaveLength(0);
    });
    it('marks hint use and keeps the three premium challenges distinct', () => {
        const record = vi.fn();
        render(<MosaicWorkshop grade="5AP" fr premium results={{}} onResult={record} onPending={vi.fn()}/>);
        click('Un indice');
        tiles(4);
        click('Vérifier ma mosaïque');
        expect(record).toHaveBeenLastCalledWith('mosaic:5AP:0', 'helped');
        click('Continuer les mosaïques');
        tiles(15);
        click('Vérifier ma mosaïque');
        expect(record).toHaveBeenLastCalledWith('mosaic:5AP:1', 'independent');
        click('Continuer les mosaïques');
        tiles(4);
        click('Vérifier ma mosaïque');
        expect(record).toHaveBeenLastCalledWith('mosaic:5AP:2', 'independent');
        click('Continuer les mosaïques');
        expect(screen.getByText(/Parcours terminé/)).toBeInTheDocument();
    });
    it('is accessible from the existing labs and records the added workshop', () => {
        const record = vi.fn();
        render(<PremiumLearningLabs grade="1AP" fr premium onResult={record}/>);
        fireEvent.click(screen.getByRole('button', { name: /Les mosaïques de Didou/ }));
        expect(screen.queryByRole('button', { name: 'Mode histoire' })).not.toBeInTheDocument();
        tiles(4);
        click('Vérifier ma mosaïque');
        expect(record).toHaveBeenCalledWith('mosaic:1AP:0', 'independent');
    });
});
