import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { isColorDot, isGeometricShape, PreschoolColorDot } from './PreschoolShapeMark';

describe('PreschoolShapeMark color vs shape', () => {
  it('treats the blue disc as a color, not a hollow circle', () => {
    expect(isColorDot('🔵')).toBe(true);
    expect(isGeometricShape('🔵')).toBe(false);
    expect(isGeometricShape('⚪')).toBe(true);
  });

  it('paints the blue disc with a real blue fill', () => {
    const { container } = render(<PreschoolColorDot asset="🔵" size={64} />);
    const svg = container.querySelector('svg[data-color-dot="blue"]');
    expect(svg).toBeTruthy();
    const circle = svg!.querySelector('circle');
    expect(circle?.getAttribute('fill')).toBe('#3b82f6');
  });
});
