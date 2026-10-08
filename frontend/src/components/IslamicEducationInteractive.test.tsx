import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IslamicEducationInteractive } from './IslamicEducationInteractive';
import { SURAH_FATIHA, SURAH_IKHLAS, SURAH_NAS } from '../data/courses/1AP/shortSurahs';
import { SURAH_DUHA, SURAH_SHAMS } from '../data/courses/4AP/shortSurahs';
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

describe('IslamicEducationInteractive quran explorer', () => {
  beforeEach(() => {
    lastAudio = null;
    vi.stubGlobal('Audio', FakeAudio);
  });

  it('shows every ayah of Al-Fatiha plus Warsh recitation, without TTS', () => {
    render(
      <IslamicEducationInteractive
        config={{
          type: 'quran_explorer',
          titleAr: 'سُورَةُ الفَاتِحَةِ كَامِلَةً',
          introAr: 'اقرأ السورة كلها.',
          verses: SURAH_FATIHA,
        }}
      />
    );
    expect(document.querySelector('[data-islamic-tool="quran-explorer"]')).toBeTruthy();
    expect(document.querySelector('[data-full-surah="سُورَةُ الفَاتِحَةِ"]')?.querySelectorAll('button')).toHaveLength(7);
    expect(screen.getByText('اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'استمع لتلاوة السورة' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'استمع لتلاوة الآية' })).toBeInTheDocument();
    expect(screen.getByText(/ياسين الجزائري/)).toBeInTheDocument();
    expect(document.querySelector('[data-tap-speak]')).toBeNull();
  });

  it('loads the Warsh ayah file when the child taps listen on the verse', () => {
    render(
      <IslamicEducationInteractive
        config={{
          type: 'quran_explorer',
          titleAr: 'سُورَةُ الفَاتِحَةِ كَامِلَةً',
          introAr: 'اقرأ السورة كلها.',
          verses: SURAH_FATIHA,
        }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'استمع لتلاوة الآية' }));
    expect(lastAudio?.play).toHaveBeenCalled();
    expect(lastAudio?.src).toBe(primaryAyahUrl(1, 1));
    expect(document.querySelector('[data-quran-basmala]')).toBeNull();
  });

  it('shows a visual basmala then plays Ikhlas verse 1 (Warsh file already includes the spoken basmala)', () => {
    render(
      <IslamicEducationInteractive
        config={{
          type: 'quran_explorer',
          titleAr: 'سُورَةُ الإِخْلَاصِ',
          introAr: 'اقرأ.',
          verses: SURAH_IKHLAS,
        }}
      />
    );
    expect(document.querySelector('[data-quran-basmala]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'استمع لتلاوة السورة' }));
    expect(lastAudio?.play).toHaveBeenCalled();
    expect(lastAudio?.src).toBe(primaryAyahUrl(112, 1));
  });

  it('lets the child switch surah and still see the whole text', () => {
    render(
      <IslamicEducationInteractive
        config={{
          type: 'quran_explorer',
          titleAr: 'سورتان',
          introAr: 'اقرأ.',
          verses: [...SURAH_IKHLAS, ...SURAH_NAS],
        }}
      />
    );
    expect(screen.getByText('قُلْ هُوَ اللَّهُ أَحَدٌ')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /سُورَةُ النَّاسِ/ }));
    expect(screen.getByText('قُلْ أَعُوذُ بِرَبِّ النَّاسِ')).toBeInTheDocument();
    expect(screen.getByText('مِنَ الْجِنَّةِ وَالنَّاسِ')).toBeInTheDocument();
    expect(screen.queryByText('قُلْ هُوَ اللَّهُ أَحَدٌ')).not.toBeInTheDocument();
  });

  it('shows every ayah of Ad-Duha and Ash-Shams for 4AP hifz', () => {
    render(
      <IslamicEducationInteractive
        config={{
          type: 'quran_explorer',
          titleAr: 'اقرأ واحفظ سورتي الضحى والشمس كاملتين',
          introAr: 'السورتان كاملتان للقراءة والحفظ.',
          verses: [...SURAH_DUHA, ...SURAH_SHAMS],
        }}
      />
    );
    expect(document.querySelector('[data-full-surah="سُورَةُ الضُّحَى"]')?.querySelectorAll('button')).toHaveLength(11);
    expect(screen.getByText('وَالضُّحَىٰ')).toBeInTheDocument();
    expect(screen.getByText('وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /سُورَةُ الشَّمْسِ/ }));
    expect(document.querySelector('[data-full-surah="سُورَةُ الشَّمْسِ"]')?.querySelectorAll('button')).toHaveLength(15);
    expect(screen.getByText('وَالشَّمْسِ وَضُحَاهَا')).toBeInTheDocument();
    expect(screen.getByText('وَلَا يَخَافُ عُقْبَاهَا')).toBeInTheDocument();
  });
});
