import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuranLabInteractive } from './QuranLabInteractive';
import { primaryAyahUrl } from '../data/quranRecitation';

let lastAudio: FakeAudio | null = null;

class FakeAudio {
  src = '';
  preload = '';
  paused = true;
  play = vi.fn(() => {
    this.paused = false;
    return Promise.resolve();
  });
  pause = vi.fn(() => {
    this.paused = true;
  });
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  removeAttribute = vi.fn((name: string) => {
    if (name === 'src') this.src = '';
  });
  constructor() {
    lastAudio = this;
  }
}

describe('QuranLabInteractive', () => {
  beforeEach(() => {
    lastAudio = null;
    vi.stubGlobal('Audio', FakeAudio);
  });

  it('opens preschool An-Nasr with a visual basmala and plays verse 1', () => {
    render(<QuranLabInteractive />);
    expect(screen.getByText('مختبر السور القصيرة')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /سُورَةُ النَّصْرِ/ }));
    expect(document.querySelector('[data-quran-lab-surah="nasr"]')).toBeTruthy();
    expect(document.querySelector('[data-quran-basmala]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'استمع لتلاوة السورة' }));
    expect(lastAudio?.src).toBe(primaryAyahUrl(110, 1));
  });
});
