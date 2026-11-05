import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { readDesignMode, useDesignMode, writeDesignMode } from './designMode';
import { DesignModeSwitch } from '../components/world/DesignModeSwitch';

function Probe() {
  const [mode, setMode] = useDesignMode();
  return <DesignModeSwitch mode={mode} locale="ar" onChange={setMode} />;
}

afterEach(() => window.localStorage.removeItem('mssid_design_mode'));

describe('the family can switch between Didou’s world and the classic interface at any time', () => {
  it('starts in Didou’s world and remembers the choice on the device', () => {
    expect(readDesignMode()).toBe('world');
    writeDesignMode('classic');
    expect(readDesignMode()).toBe('classic');
    writeDesignMode('world');
    expect(readDesignMode()).toBe('world');
  });

  it('always offers the other design, both ways', () => {
    render(<Probe />);
    fireEvent.click(screen.getByRole('button', { name: /الواجهة الكلاسيكية/ }));
    expect(readDesignMode()).toBe('classic');
    fireEvent.click(screen.getByRole('button', { name: /عالم ديدو/ }));
    expect(readDesignMode()).toBe('world');
  });

  it('follows a change made in another tab', () => {
    const onChange = vi.fn();
    render(<DesignModeSwitch mode="world" locale="fr" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Accueil classique' }));
    expect(onChange).toHaveBeenCalledWith('classic');
    render(<Probe />);
    act(() => {
      window.localStorage.setItem('mssid_design_mode', 'classic');
      window.dispatchEvent(new StorageEvent('storage', { key: 'mssid_design_mode' }));
    });
    expect(screen.getByRole('button', { name: /عالم ديدو/ })).toBeTruthy();
  });
});
