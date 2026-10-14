import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityExitProvider, useActivityExit, useActivityExitGuard } from './ActivityExitContext';

function Exercise({ leave, language = 'fr' }: { leave: () => void; language?: 'ar' | 'fr' | 'en' }) {
  const [work, setWork] = useState(false);
  const request = useActivityExitGuard(work, language);
  return <><button onClick={() => setWork(true)}>Draw</button><button onClick={() => setWork(false)}>Finish</button>
    <button onClick={() => request(() => request(leave))}>Back</button><input defaultValue="my drawing" /></>;
}

describe('selective activity exit confirmation', () => {
  it('leaves empty and completed activities without a popup', () => {
    const leave = vi.fn();
    render(<ActivityExitProvider><Exercise leave={leave} /></ActivityExitProvider>);
    fireEvent.click(screen.getByText('Back')); expect(leave).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Draw')); fireEvent.click(screen.getByText('Finish'));
    fireEvent.click(screen.getByText('Back')); expect(leave).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('keeps the exercise and focus when continuing, then confirms nested navigation once', () => {
    const leave = vi.fn();
    render(<ActivityExitProvider><Exercise leave={leave} /></ActivityExitProvider>);
    fireEvent.click(screen.getByText('Draw'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'kept strokes' } });
    screen.getByText('Back').focus(); fireEvent.click(screen.getByText('Back'));
    expect(leave).not.toHaveBeenCalled(); expect(screen.getByText('Continuer')).toHaveFocus();
    fireEvent.click(screen.getByText('Continuer'));
    expect(screen.getByRole('textbox')).toHaveValue('kept strokes'); expect(screen.getByText('Back')).toHaveFocus();
    fireEvent.click(screen.getByText('Back')); fireEvent.click(screen.getByText('Quitter'));
    expect(leave).toHaveBeenCalledTimes(1); expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it.each([['ar', 'متابعة', 'خروج'], ['en', 'Continue', 'Leave']] as const)('uses the activity language %s', (language, stay, leaveLabel) => {
    render(<ActivityExitProvider><Exercise leave={vi.fn()} language={language} /></ActivityExitProvider>);
    fireEvent.click(screen.getByText('Draw')); fireEvent.click(screen.getByText('Back'));
    expect(screen.getByRole('button', { name: stay })).toHaveFocus();
    expect(screen.getByRole('button', { name: leaveLabel })).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' }); expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('traps focus and treats native Back as Continue when the popup is already open', () => {
    const leave = vi.fn();
    render(<ActivityExitProvider><Exercise leave={leave} /></ActivityExitProvider>);
    fireEvent.click(screen.getByText('Draw'));
    const firstBack = new Event('mssid:native-back', { cancelable: true });
    act(() => { window.dispatchEvent(firstBack); }); expect(firstBack.defaultPrevented).toBe(true);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true }); expect(screen.getByText('Quitter')).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' }); expect(screen.getByText('Continuer')).toHaveFocus();
    const secondBack = new Event('mssid:native-back', { cancelable: true });
    act(() => { window.dispatchEvent(secondBack); }); expect(secondBack.defaultPrevented).toBe(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(leave).not.toHaveBeenCalled();
  });
  it('requests the browser reload warning only while unfinished work exists', () => {
    render(<ActivityExitProvider><Exercise leave={vi.fn()} /></ActivityExitProvider>);
    const empty = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(empty);
    expect(empty.defaultPrevented).toBe(false);
    fireEvent.click(screen.getByText('Draw'));
    const dirty = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(dirty);
    expect(dirty.defaultPrevented).toBe(true);
  });
  it('drops a stale pending exit when the activity finishes behind the popup', () => {
    const leave = vi.fn();
    render(<ActivityExitProvider><Exercise leave={leave} /></ActivityExitProvider>);
    fireEvent.click(screen.getByText('Draw')); fireEvent.click(screen.getByText('Back'));
    fireEvent.click(screen.getByText('Finish'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(leave).not.toHaveBeenCalled();
  });
});
