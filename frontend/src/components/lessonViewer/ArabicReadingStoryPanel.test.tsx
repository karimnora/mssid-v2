import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArabicReadingStoryPanel } from './ArabicReadingStoryPanel';

const story = {
  titleAr: 'نَصُّ الحَيِّ',
  characters: [
    { nameAr: 'لَيْلَى', roleAr: 'بِنْتٌ', emoji: '👧' },
    { nameAr: 'عُمَرُ', roleAr: 'يَجْرِي', emoji: '👦' },
  ],
  scenes: [
    { id: 's1', emoji: '🌳', textAr: 'فِي حَيِّنَا حَدِيقَةٌ.' },
    { id: 's2', emoji: '🏃', textAr: 'يَجْرِي عُمَرُ فِي المَمَرِّ.' },
  ],
};

describe('ArabicReadingStoryPanel', () => {
  it('keeps vocalized audio text when the display hides vowel marks', () => {
    const onSpeak = vi.fn();
    render(<ArabicReadingStoryPanel story={story} renderArabicText={text => (text ?? '').replace(/[\u064B-\u065F]/g, '')} onSpeak={onSpeak} />);
    fireEvent.click(document.querySelector('[data-tap-speak="scene-s1"]')!);
    expect(onSpeak).toHaveBeenCalledWith('scene-s1', story.scenes[0].textAr);
  });
  it('shows character roster and scene cards with speakers', () => {
    const onSpeak = vi.fn();
    render(
      <ArabicReadingStoryPanel story={story} renderArabicText={(t) => t || ''} onSpeak={onSpeak} speakingKey={null} />,
    );
    expect(document.querySelector('[data-reading-story="2ap"]')).toBeTruthy();
    expect(document.querySelector('[data-reading-characters]')).toBeTruthy();
    expect(screen.getByText('لَيْلَى')).toBeInTheDocument();
    expect(screen.getByText('عُمَرُ')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-reading-scene]').length).toBe(2);

    fireEvent.click(document.querySelector('[data-tap-speak="scene-s2"]')!);
    expect(onSpeak).toHaveBeenCalledWith('scene-s2', expect.stringMatching(/عُمَرُ/));
  });
});
