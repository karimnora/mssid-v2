import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AndroidReleaseSettings } from './AndroidReleaseSettings';
import { springBootApi } from '../../services/springBootApi';

describe('AndroidReleaseSettings', () => {
  beforeEach(() => {
    vi.spyOn(springBootApi, 'getAndroidRelease').mockResolvedValue({
      data: { latestVersionCode: 8, minVersionCode: 0 },
      status: 200,
    } as any);
    vi.spyOn(springBootApi, 'updateAndroidRelease').mockResolvedValue({
      data: { latestVersionCode: 9, minVersionCode: 0 },
      status: 200,
    } as any);
  });
  afterEach(() => vi.restoreAllMocks());

  it('loads current Play numbers and saves a new latest versionCode', async () => {
    render(<AndroidReleaseSettings />);
    const latest = await screen.findByRole('spinbutton', { name: 'آخر versionCode على Play' });
    expect(latest).toHaveValue(8);
    fireEvent.change(latest, { target: { value: '9' } });
    fireEvent.click(screen.getByRole('button', { name: 'حفظ أرقام أندرويد' }));
    await waitFor(() => expect(springBootApi.updateAndroidRelease).toHaveBeenCalledWith({
      latestVersionCode: 9,
      minVersionCode: 0,
    }));
    expect(await screen.findByText(/المحفوظ: 9/)).toBeInTheDocument();
  });
});
