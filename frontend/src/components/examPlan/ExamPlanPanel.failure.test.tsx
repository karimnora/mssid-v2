import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExamPlanPanel } from './ExamPlanPanel';
import { buildParentNotebook } from '../../utils/competenceProgress';
import { createFreshGuestProfile } from '../../hooks/useUserProgress';

vi.mock('../../data/coursesData', () => { throw new Error('Resource unavailable'); });
vi.mock('../PremiumOffer', () => ({ PremiumOffer: () => null }));

describe('optional revision resources', () => {
  it('ends the loading state and offers retry when resources fail to load', async () => {
    render(<ExamPlanPanel notebook={buildParentNotebook(createFreshGuestProfile('5AP'), '5AP')}
      storageKey="failed-resources" locale="fr" premium now={new Date(2026, 10, 12)}
      onReviewLesson={vi.fn()} onPrint={vi.fn()} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Les cours restent accessibles séparément');
    expect(screen.getByRole('button', { name: 'Recharger la page' })).toBeEnabled();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
