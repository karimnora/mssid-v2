import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ElectricityLabInteractive } from './ElectricityLabInteractive';
import { LocaleProvider } from '../context/LocaleContext';

const renderLab = () =>
  render(
    <LocaleProvider>
      <ElectricityLabInteractive />
    </LocaleProvider>,
  );

describe('ElectricityLabInteractive switch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-08T00:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens the circuit and updates the explanation when the switch is turned off', () => {
    renderLab();
    expect(document.querySelector('[data-elec-status]')?.textContent).toContain('انحياز أمامي');
    expect(document.querySelector('[data-elec-explain]')?.textContent).toContain('القاطعة مغلقة');
    expect(document.querySelector('[data-elec-flow]')?.getAttribute('data-elec-flow')).toBe('on');

    fireEvent.click(document.querySelector('[data-elec-switch]') as HTMLElement);

    expect(document.querySelector('[data-elec-status]')?.textContent).toContain('القاطعة مفتوحة');
    expect(document.querySelector('[data-elec-status]')?.textContent).toContain('التيار لا يمر');
    expect(document.querySelector('[data-elec-explain]')?.textContent).toContain('قطع الحلقة');
    expect(document.querySelector('[data-elec-flow]')?.getAttribute('data-elec-flow')).toBe('off');
  });

  it('turns the current back on after a second press, and ignores a double-fire from the same tap', () => {
    renderLab();
    const btn = document.querySelector('[data-elec-switch]') as HTMLElement;
    fireEvent.click(btn);
    expect(document.querySelector('[data-elec-flow]')?.getAttribute('data-elec-flow')).toBe('off');

    fireEvent.click(btn);
    expect(document.querySelector('[data-elec-flow]')?.getAttribute('data-elec-flow')).toBe('off');

    vi.advanceTimersByTime(300);
    fireEvent.click(btn);
    expect(document.querySelector('[data-elec-flow]')?.getAttribute('data-elec-flow')).toBe('on');
  });

  it('opens both series bulbs when the switch is opened', () => {
    renderLab();
    fireEvent.click(document.querySelector('[data-elec-tab="series_parallel"]') as HTMLElement);
    expect(document.querySelector('[data-elec-bulb="1"]')?.getAttribute('data-elec-lit')).toBe('on');
    expect(document.querySelector('[data-elec-bulb="2"]')?.getAttribute('data-elec-lit')).toBe('on');

    fireEvent.click(document.querySelector('[data-elec-switch-series]') as HTMLElement);

    expect(document.querySelector('[data-elec-bulb="1"]')?.getAttribute('data-elec-lit')).toBe('off');
    expect(document.querySelector('[data-elec-bulb="2"]')?.getAttribute('data-elec-lit')).toBe('off');
  });
});
