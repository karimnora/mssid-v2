import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { PreschoolGardenMission } from './PreschoolGardenMission';
import { gardenStorageKey, readGardenResults } from '../../utils/gardenMissionProgress';
const state = vi.hoisted(() => ({ owner: 'user:9:child:1' }));
vi.mock('../../hooks/useCahierAccess', () => ({ useCahierAccess: () => ({ authUser: { id: 9 }, access: { premium: true }, loading: false, error: false }) }));
vi.mock('../../utils/progressOwner', () => ({ getActiveProgressOwner: () => state.owner }));
vi.mock('../../utils/speech', () => ({ speakText: vi.fn().mockResolvedValue(undefined), stopSpeech: vi.fn() }));
beforeEach(() => { cleanup(); localStorage.clear(); state.owner = 'user:9:child:1'; });
describe('preschool garden ownership', () => {
    it('saves actual attempts and never overlays a second child or another learning language', () => {
        const view = render(<PreschoolGardenMission language="fr" onExit={vi.fn()}/>);
        within(screen.getByRole('group', { name: 'Emplacements du potager' })).getAllByRole('button').slice(0, 3).forEach(b => fireEvent.click(b));
        fireEvent.click(screen.getByRole('button', { name: 'Vérifier mon défi' }));
        expect(readGardenResults(gardenStorageKey(state.owner, 'preschool', 'fr'), 'preschool')['garden-mission:preschool:0'].outcome).toBe('independent');
        state.owner = 'user:9:child:2';
        view.rerender(<PreschoolGardenMission language="fr" onExit={vi.fn()}/>);
        expect(screen.getByLabelText('Défis réussis')).toHaveTextContent('0 / 6');
        state.owner = 'user:9:child:1';
        view.rerender(<PreschoolGardenMission language="en" onExit={vi.fn()}/>);
        expect(screen.getByLabelText('Successful challenges')).toHaveTextContent('0 / 6');
    });
    it('rejects an active profile belonging to another account', () => {
        state.owner = 'user:44:child:1';
        render(<PreschoolGardenMission language="fr" onExit={vi.fn()}/>);
        expect(readGardenResults(gardenStorageKey('user:9', 'preschool', 'fr'), 'preschool')).toEqual({});
        expect(localStorage.getItem(gardenStorageKey(state.owner, 'preschool', 'fr'))).toBeNull();
    });
});
