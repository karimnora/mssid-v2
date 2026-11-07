import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PremiumFunnelPanel } from './PremiumFunnelPanel';
import { springBootApi } from '../../services/springBootApi';
afterEach(() => vi.restoreAllMocks());
it('shows server totals as actions, with an export for the administrator', async () => {
  vi.spyOn(springBootApi, 'getPremiumFunnel').mockResolvedValue({ status: 200, data: [{ day: '2026-11-07', grade: '5AP', event: 'offer_open', total: 23 }] });
  render(<PremiumFunnelPanel />);
  expect(await screen.findByText('23')).toBeVisible();
  expect(screen.getByText('Offre consultée')).toBeVisible();
  expect(screen.getByRole('button', { name: /Exporter/ })).toBeVisible();
  expect(screen.getByText(/pas des familles uniques/)).toBeVisible();
});
it('does not replace an unavailable server with local or invented counts', async () => {
  vi.spyOn(springBootApi, 'getPremiumFunnel').mockResolvedValue({ status: 500, error: 'offline' });
  render(<PremiumFunnelPanel />);
  expect(await screen.findByRole('alert')).toHaveTextContent('indisponibles');
  expect(screen.queryByRole('table')).toBeNull();
});
