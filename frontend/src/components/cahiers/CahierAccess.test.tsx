import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CompetenceCahierSheet } from './CompetenceCahierSheet';
import { COMPETENCE_CAHIERS } from '../../../content-authoring/competenceCahiers';
import { setStoredLocale } from '../../localePreference';
import { LocaleProvider } from '../../context/LocaleContext';
import { springBootApi, type CahierAccess } from '../../services/springBootApi';
const state = vi.hoisted(() => ({ user: { id: 7, role: 'ROLE_FREE' } as any }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ authUser: state.user }) }));
const document = COMPETENCE_CAHIERS[0];
const snapshot: CahierAccess = { premium: false, limit: 3, remaining: 3, resetsAt: '2026-10-11T23:00:00Z', unlockedIds: [], allowed: true };
function show() { return render(<LocaleProvider><CompetenceCahierSheet cahier={document} onClose={vi.fn()} /></LocaleProvider>); }
beforeEach(() => {
  vi.restoreAllMocks(); state.user = { id: 7, role: 'ROLE_FREE' };
  vi.spyOn(springBootApi,'getCahierContent').mockResolvedValue({status:200,data:document});
  setStoredLocale('fr');
  vi.spyOn(springBootApi, 'getCahierAccess').mockResolvedValue({ status: 200, data: snapshot });
  vi.spyOn(springBootApi, 'unlockCahier').mockResolvedValue({ status: 200, data: { ...snapshot, remaining: 2, unlockedIds: [document.competenceId] } });
});
describe('family cahier access', () => {
  it('preview does not spend a credit, explicit unlock opens the real sheet', async () => {
    show();
    const button = await screen.findByRole('button', { name: 'Débloquer ce cahier — 1 crédit' });
    expect(springBootApi.unlockCahier).not.toHaveBeenCalled();
    expect(screen.queryByText(document.exercises[1].promptAr)).not.toBeInTheDocument();
    fireEvent.click(button); fireEvent.click(button);
    await screen.findByText(document.exercises[1].promptAr);
    expect(springBootApi.unlockCahier).toHaveBeenCalledTimes(1);
  });
  it('a previously unlocked document opens at zero credits without spending again', async () => {
    vi.mocked(springBootApi.getCahierAccess).mockResolvedValue({ status: 200, data: { ...snapshot, remaining: 0, unlockedIds: [document.competenceId] } });
    show(); await screen.findByText(document.exercises[1].promptAr);
    expect(springBootApi.unlockCahier).not.toHaveBeenCalled();
  });
  it('at the limit offers renewal or Premium without automatically opening a payment dialog', async () => {
    vi.mocked(springBootApi.getCahierAccess).mockResolvedValue({ status: 200, data: { ...snapshot, remaining: 0 } });
    show(); await screen.findByText(/Les 3 nouveaux cahiers gratuits/);
    expect(screen.getByText(/Renouvellement le/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuer gratuitement' })).toBeInTheDocument();
    expect(screen.queryByText(document.exercises[1].promptAr)).not.toBeInTheDocument();
    expect(springBootApi.unlockCahier).not.toHaveBeenCalled();
  });
  it('Premium opens all exercises without weekly credits', async () => {
    vi.mocked(springBootApi.getCahierAccess).mockResolvedValue({ status: 200, data: { ...snapshot, premium: true, remaining: 0 } });
    show(); await screen.findByText(document.exercises[1].promptAr);
    expect(springBootApi.unlockCahier).not.toHaveBeenCalled();
  });
  it('guests get a preview and a free-account explanation without backend writes', async () => {
    state.user = null; show();
    await screen.findByText(/Connectez-vous depuis l’accueil/);
    expect(springBootApi.getCahierAccess).not.toHaveBeenCalled();
    expect(springBootApi.unlockCahier).not.toHaveBeenCalled();
  });
  it('network failure keeps the preview available and does not spend a credit', async () => {
    vi.mocked(springBootApi.getCahierAccess).mockResolvedValue({ status: 0, error: 'offline' });
    show(); await screen.findByRole('alert');
    expect(springBootApi.unlockCahier).not.toHaveBeenCalled();
    expect(screen.getByText(document.exercises[0].promptAr)).toBeInTheDocument();
  });
  it('can retry a failed unlock without closing the sheet', async () => {
    vi.mocked(springBootApi.unlockCahier).mockResolvedValueOnce({status:500,error:'offline'}).mockResolvedValueOnce({status:200,data:{...snapshot,allowed:true,remaining:2,unlockedIds:[document.competenceId]}});
    show();fireEvent.click(await screen.findByRole('button',{name:'Débloquer ce cahier — 1 crédit'}));
    await screen.findByRole('alert');fireEvent.click(screen.getByRole('button',{name:'Réessayer'}));
    fireEvent.click(await screen.findByRole('button',{name:'Débloquer ce cahier — 1 crédit'}));
    await screen.findByText(document.exercises[1].promptAr);expect(springBootApi.unlockCahier).toHaveBeenCalledTimes(2);
  });
  it('a concurrent quota denial never displays the full document', async () => {
    vi.mocked(springBootApi.unlockCahier).mockResolvedValue({ status: 429, data: { ...snapshot, remaining: 0, allowed: false } });
    show(); fireEvent.click(await screen.findByRole('button', { name: 'Débloquer ce cahier — 1 crédit' }));
    await waitFor(() => expect(springBootApi.unlockCahier).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(document.exercises[1].promptAr)).not.toBeInTheDocument();
  });
});
