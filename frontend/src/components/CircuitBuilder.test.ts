import { describe, expect, it } from 'vitest';
import {
  circuitViewSize,
  clampToCanvas,
  defaultCircuitLayout,
  DEFAULT_WIRES,
  simulateCircuit,
  spawnInView,
  wireWouldShortComponent,
  type CBComp,
} from './CircuitBuilder';

describe('CircuitBuilder layout', () => {
  it('fits a phone-width canvas instead of a 640 px strip', () => {
    const size = circuitViewSize(360);
    expect(size.w).toBe(360);
    expect(size.h).toBeGreaterThanOrEqual(400);
    expect(size.w).toBeLessThan(640);
  });

  it('places the default battery, switch and bulb inside the canvas', () => {
    const { w, h } = circuitViewSize(360);
    const comps = defaultCircuitLayout(w, h);
    for (const c of comps) {
      expect(c.x).toBeGreaterThan(50);
      expect(c.x).toBeLessThan(w - 50);
      expect(c.y).toBeGreaterThan(30);
      expect(c.y).toBeLessThan(h - 30);
    }
    expect(comps.find((c) => c.type === 'bulb')!.x).toBeLessThan(w);
  });

  it('spawns new parts in the visible area', () => {
    const w = 360;
    const h = 420;
    for (let i = 0; i < 20; i += 1) {
      const pos = spawnInView(w, h, () => i / 19);
      expect(pos.x).toBeGreaterThanOrEqual(66);
      expect(pos.x).toBeLessThanOrEqual(w - 66);
      expect(pos.y).toBeGreaterThanOrEqual(48);
      expect(pos.y).toBeLessThanOrEqual(h - 48);
    }
  });

  it('clamps a part that would sit off-screen', () => {
    const stray: CBComp = {
      id: 'x',
      type: 'bulb',
      x: 900,
      y: -20,
      switchOpen: false,
      diodeReversed: false,
      resistorVal: 100,
      voltage: 4.5,
    };
    const clamped = clampToCanvas(stray, 360, 420);
    expect(clamped.x).toBeLessThanOrEqual(360 - 55);
    expect(clamped.y).toBeGreaterThanOrEqual(37);
  });
});

describe('CircuitBuilder simulation', () => {
  const layout = defaultCircuitLayout(360, 420);

  it('powers the bulb when the default switch is closed', () => {
    const result = simulateCircuit(layout, DEFAULT_WIRES);
    expect(result.closed).toBe(true);
    expect(result.powered.has('bulb0')).toBe(true);
  });

  it('turns the bulb off when the switch is opened', () => {
    const open = layout.map((c) => c.id === 'sw0' ? { ...c, switchOpen: true } : c);
    const result = simulateCircuit(open, DEFAULT_WIRES);
    expect(result.closed).toBe(false);
    expect(result.powered.has('bulb0')).toBe(false);
  });

  it('rejects a wire that would short a switch so the lamp cannot stay stuck on', () => {
    expect(wireWouldShortComponent('sw0', 'sw0')).toBe(true);
    expect(wireWouldShortComponent('sw0', 'bulb0')).toBe(false);
  });

  it('keeps the bulb on if a bypass wire really shorts around the open switch', () => {
    const open = layout.map((c) => c.id === 'sw0' ? { ...c, switchOpen: true } : c);
    const bypass = [...DEFAULT_WIRES, { id: 'short', from: 'sw0', fromT: 'A' as const, to: 'sw0', toT: 'B' as const }];
    const result = simulateCircuit(open, bypass);
    expect(result.closed).toBe(true);
    expect(result.powered.has('bulb0')).toBe(true);
  });
});

