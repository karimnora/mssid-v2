import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParentNotebookModal } from './ParentNotebookModal';
import { CemPrepLab } from './immersive/CemPrepLab';
import { CEM_PAPERS } from '../data/immersive/cemPrep';
import { setStoredLocale } from '../localePreference';
import { LocaleProvider } from '../context/LocaleContext';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
const state = vi.hoisted(() => ({ role: 'ROLE_FREE' }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ authUser: { id: 7, role: state.role } }) }));
describe('free family accompaniment', () => {
  it('keeps the next revision and simple summary free while reserving history and sharing', () => {
    state.role = 'ROLE_FREE'; setStoredLocale('fr');
    render(<LocaleProvider><ParentNotebookModal isOpen onClose={vi.fn()} userProfile={createFreshGuestProfile('1AP')} onReviewLesson={vi.fn()} /></LocaleProvider>);
    expect(screen.getByText(/Bilan simple/)).toBeInTheDocument();
    expect(screen.getByText(/Votre prochaine révision reste gratuite/)).toBeInTheDocument();
    expect(screen.queryByText(/Copier le bilan/)).not.toBeInTheDocument();
  });
  it('offers a real first CEM exercise without the rest of the paid parcours', () => {
    state.role = 'ROLE_FREE';
    render(<LocaleProvider><CemPrepLab /></LocaleProvider>);
    expect(screen.getByText(CEM_PAPERS[0].exercises[0].titleAr)).toBeInTheDocument();
    expect(screen.queryByText(CEM_PAPERS[0].exercises[1].titleAr)).not.toBeInTheDocument();
  });
  it('Premium sees the complete CEM paper', () => {
    state.role = 'ROLE_PREMIUM';
    render(<LocaleProvider><CemPrepLab /></LocaleProvider>);
    expect(screen.getByText(CEM_PAPERS[0].exercises[1].titleAr)).toBeInTheDocument();
  });
});
