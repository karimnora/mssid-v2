import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { flagIsoFromEmoji, isFlagEmoji, PreschoolFlagMark } from './PreschoolFlagMark';
import { PreschoolAsset } from './PreschoolAsset';

describe('PreschoolFlagMark', () => {
  it('reads ISO codes from regional-indicator emojis', () => {
    expect(flagIsoFromEmoji('🇩🇿')).toBe('DZ');
    expect(flagIsoFromEmoji('🇯🇵')).toBe('JP');
    expect(flagIsoFromEmoji('🇧🇷')).toBe('BR');
    expect(flagIsoFromEmoji('🇫🇷')).toBe('FR');
    expect(flagIsoFromEmoji('🇬🇧')).toBe('GB');
    expect(isFlagEmoji('🦊')).toBe(false);
    expect(isFlagEmoji('DZ')).toBe(false);
  });

  it('paints a real Algerian flag instead of the letters DZ', () => {
    const { container } = render(<PreschoolFlagMark asset="🇩🇿" size={72} />);
    const svg = container.querySelector('svg[data-flag="DZ"]');
    expect(svg).toBeTruthy();
    expect(container.textContent).toBe('');
    const fills = [...container.querySelectorAll('rect, circle, polygon')].map((n) =>
      n.getAttribute('fill'),
    );
    expect(fills).toContain('#006233');
    expect(fills).toContain('#D21034');
  });

  it('renders Japan and Brazil as distinct flags', () => {
    const jp = render(<PreschoolFlagMark asset="🇯🇵" />);
    expect(jp.container.querySelector('svg[data-flag="JP"]')).toBeTruthy();
    jp.unmount();
    const br = render(<PreschoolFlagMark asset="🇧🇷" />);
    expect(br.container.querySelector('svg[data-flag="BR"]')).toBeTruthy();
  });
});

describe('PreschoolAsset flags', () => {
  it('routes a flag emoji through PreschoolFlagMark', () => {
    const { container } = render(<PreschoolAsset asset="🇩🇿" size={48} />);
    expect(container.querySelector('svg[data-flag="DZ"]')).toBeTruthy();
  });
});
