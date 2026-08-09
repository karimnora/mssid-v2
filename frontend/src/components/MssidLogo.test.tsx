import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MssidLogo } from './MssidLogo';

describe('MssidLogo Component Unit Tests', () => {
  it('renders logo container with default medium size', () => {
    const { container } = render(<MssidLogo />);
    const logoWrapper = container.firstChild as HTMLElement;

    expect(logoWrapper).toBeInTheDocument();
    expect(logoWrapper.className).toContain('w-11 h-11');
  });

  it('applies custom size classes properly', () => {
    const { container } = render(<MssidLogo size="lg" className="custom-class" />);
    const logoWrapper = container.firstChild as HTMLElement;

    expect(logoWrapper.className).toContain('w-14 h-14');
    expect(logoWrapper.className).toContain('custom-class');
  });
});
