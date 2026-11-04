import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Icon3d, LAB_ICON3D, type Icon3dName } from './Icon3d';

const NAMES: Icon3dName[] = ['algeria', 'museum', 'market', 'flags', 'mountains', 'graduation', 'notebook', 'book', 'drop', 'prayerMat', 'mosque', 'trafficLight', 'abacus', 'calculator', 'geometry', 'fraction', 'grid', 'clock', 'times', 'flask', 'bulb', 'magnifier', 'heart', 'earthCycle', 'speech', 'pen', 'tifinagh', 'letters', 'trophy', 'planet', 'balloons', 'map', 'puzzle', 'star'];

describe('3D icons', () => {
  it('draws every icon with safe, unique gradient ids even when repeated on a page', () => {
    const { container } = render(<>{NAMES.map((n) => <span key={n}><Icon3d name={n} /><Icon3d name={n} /></span>)}</>);
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^[a-zA-Z0-9_-]+$/.test(id))).toBe(true);
    for (const svg of container.querySelectorAll('svg')) expect(svg.childElementCount).toBeGreaterThan(1);
  });

  it('gives every catalogue lab an icon of the family', () => {
    expect(Object.values(LAB_ICON3D).every((name) => NAMES.includes(name))).toBe(true);
    expect(Object.keys(LAB_ICON3D).length).toBeGreaterThanOrEqual(37);
  });
});
