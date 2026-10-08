import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CircuitBuilder } from './CircuitBuilder';

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub);

describe('CircuitBuilder switch toggle', () => {
  it('opens the default circuit and turns the bulb off', async () => {
    render(<CircuitBuilder />);
    expect(document.querySelector('[data-cb-status="closed"]')).not.toBeNull();
    expect(document.querySelector('[data-cb-type="bulb"]')?.getAttribute('data-cb-powered')).toBe('on');

    fireEvent.click(document.querySelector('[data-cb-switch-toggle]') as HTMLElement);

    expect(document.querySelector('[data-cb-type="bulb"]')?.getAttribute('data-cb-powered')).toBe('off');
    await waitFor(() => {
      expect(document.querySelector('[data-cb-status="open"]')).not.toBeNull();
    });
  });

  it('closes the circuit again on the second press', () => {
    render(<CircuitBuilder />);
    const btn = document.querySelector('[data-cb-switch-toggle]') as HTMLElement;
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(document.querySelector('[data-cb-status]')?.getAttribute('data-cb-status')).toBe('closed');
    expect(document.querySelector('[data-cb-type="bulb"]')?.getAttribute('data-cb-powered')).toBe('on');
  });
});
