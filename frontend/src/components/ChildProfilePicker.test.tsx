import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChildProfilePicker } from './ChildProfilePicker';
import { springBootApi } from '../services/springBootApi';
import { LocaleProvider } from '../context/LocaleContext';

vi.spyOn(Math, 'random').mockReturnValue(0);

function renderPicker(props: Partial<React.ComponentProps<typeof ChildProfilePicker>> = {}) {
  const onSelectChild = props.onSelectChild ?? vi.fn();
  const onSkip = props.onSkip ?? vi.fn();
  return {
    onSelectChild,
    onSkip,
    ...render(
      <LocaleProvider>
        <ChildProfilePicker isOpen onSelectChild={onSelectChild} onSkip={onSkip} />
      </LocaleProvider>,
    ),
  };
}

describe('ChildProfilePicker', () => {
  beforeEach(() => {
    vi.spyOn(springBootApi, 'getChildProfiles').mockResolvedValue({
      status: 200,
      data: [{ id: 1, displayName: 'لينا', grade: '1AP', avatar: '🦊' }],
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  it('lists children and selects one without a parent gate', async () => {
    const { onSelectChild } = renderPicker();
    fireEvent.click(await screen.findByText('لينا'));
    expect(onSelectChild).toHaveBeenCalledWith(expect.objectContaining({ id: 1, displayName: 'لينا' }));
  });

  it('opens the parent gate before creating a child', async () => {
    const createSpy = vi.spyOn(springBootApi, 'createChildProfile');
    renderPicker();
    fireEvent.click(await screen.findByRole('button', { name: /إضافة طفل/ }));
    expect(screen.getByRole('dialog', { name: 'بوابة الوالدين' })).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('does not create when the parent gate is cancelled', async () => {
    const createSpy = vi.spyOn(springBootApi, 'createChildProfile');
    renderPicker();
    fireEvent.click(await screen.findByRole('button', { name: /إضافة طفل/ }));
    fireEvent.click(screen.getByRole('button', { name: 'إغلاق' }));
    expect(createSpy).not.toHaveBeenCalled();
    expect(screen.queryByLabelText(/الاسم/)).not.toBeInTheDocument();
  });

  it('creates after a correct parent-gate answer then selects the new child', async () => {
    vi.spyOn(springBootApi, 'createChildProfile').mockResolvedValue({
      status: 201,
      data: { id: 9, displayName: 'يوسف', grade: '2AP', avatar: '🦁' },
    } as any);
    vi.spyOn(springBootApi, 'getChildProfiles')
      .mockResolvedValueOnce({
        status: 200,
        data: [],
      } as any)
      .mockResolvedValue({
        status: 200,
        data: [{ id: 9, displayName: 'يوسف', grade: '2AP', avatar: '🦁' }],
      } as any);

    const { onSelectChild } = renderPicker();
    fireEvent.click(await screen.findByRole('button', { name: /إضافة طفل/ }));
    fireEvent.change(screen.getByLabelText('اكتب الناتج هنا'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));

    await screen.findByRole('button', { name: 'حفظ' });
    fireEvent.change(screen.getByLabelText('الاسم أو اللقب'), { target: { value: 'يوسف' } });
    fireEvent.click(screen.getByRole('button', { name: 'حفظ' }));

    await waitFor(() => {
      expect(onSelectChild).toHaveBeenCalledWith(expect.objectContaining({ id: 9, displayName: 'يوسف' }));
    });
  });

  it('lets the parent continue without a child profile', async () => {
    const { onSkip } = renderPicker();
    fireEvent.click(await screen.findByRole('button', { name: /متابعة بدون ملف طفل/ }));
    expect(onSkip).toHaveBeenCalled();
  });
  it('handles malformed profile lists without crashing and keeps the account fallback usable', async () => {
    vi.spyOn(springBootApi, 'getChildProfiles').mockResolvedValue({ status: 200, data: {} } as any);
    const { onSkip } = renderPicker();
    expect(await screen.findByText('تعذر جلب الملفات من الخادم. يمكنك المتابعة بالحساب.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /متابعة بدون ملف طفل/ }));
    expect(onSkip).toHaveBeenCalled();
  });
});
