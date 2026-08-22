import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IslamicEducationInteractive } from './IslamicEducationInteractive';
import { SURAH_FATIHA, SURAH_IKHLAS, SURAH_NAS } from '../data/courses/1AP/shortSurahs';

describe('IslamicEducationInteractive quran explorer', () => {
  it('shows every ayah of Al-Fatiha and no audio control', () => {
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
    expect(screen.queryByLabelText(/استمع/)).not.toBeInTheDocument();
    expect(document.querySelector('[data-tap-speak]')).toBeNull();
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
});
