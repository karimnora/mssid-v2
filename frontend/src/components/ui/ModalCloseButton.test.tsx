import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ModalCloseButton } from './ModalCloseButton';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import { JourneyRibbon } from '../journey/JourneyRibbon';
import { FirstStepsModal } from '../onboarding/FirstStepsModal';
import { ChildProfilePicker } from '../ChildProfilePicker';

vi.mock('../../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));

beforeEach(() => setStoredLocale('fr'));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Every popup has a close button', () => {
  it('labels the button in Arabic and French and calls onClose', () => {
    const close = vi.fn();
    render(<ModalCloseButton onClose={close} />, { wrapper: LocaleProvider });
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(close).toHaveBeenCalledOnce();
    cleanup();
    setStoredLocale('ar');
    render(<ModalCloseButton onClose={close} />, { wrapper: LocaleProvider });
    expect(screen.getByRole('button', { name: 'أغلق' })).toBeInTheDocument();
  });

  it('Didou journey ribbon: the cross runs the first (dismiss) choice', () => {
    const no = vi.fn();
    const yes = vi.fn();
    render(
      <JourneyRibbon text="On commence ?" listenLabel="Écouter" buttons={[{ label: 'Non', onClick: no }, { label: 'Oui', onClick: yes }]} />,
      { wrapper: LocaleProvider },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(no).toHaveBeenCalledOnce();
    expect(yes).not.toHaveBeenCalled();
  });

  it('first-steps screen can be closed, even at the grade step', () => {
    const close = vi.fn();
    render(
      <FirstStepsModal
        user={{ id: 1, nom: 'A', email: 'a@test.invalid', role: 'ROLE_FREE', gradeSet: false, parentEmailSet: false }}
        needGrade
        needParent
        journeyAvailable
        onChooseGrade={vi.fn()}
        onDone={vi.fn()}
        onClose={close}
      />,
      { wrapper: LocaleProvider },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(close).toHaveBeenCalledOnce();
  });

  it('child picker closes like « skip »', () => {
    const skip = vi.fn();
    render(<ChildProfilePicker isOpen onSelectChild={vi.fn()} onSkip={skip} />, { wrapper: LocaleProvider });
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(skip).toHaveBeenCalledOnce();
  });
});
