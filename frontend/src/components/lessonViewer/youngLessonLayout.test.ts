import { describe, expect, it } from 'vitest';
import { parsePlayfulSnippet } from './youngLessonLayout';

describe('parsePlayfulSnippet counting pictures', () => {
  it('keeps every picture of a quantity instead of the first one only', () => {
    expect(parsePlayfulSnippet('كم عدد التفاحات؟ 🍎🍎🍎').emoji).toBe('🍎🍎🍎');
    expect(parsePlayfulSnippet('معك 3 بالونات 🎈🎈🎈 وأعطتك أمك بالونين 🎈🎈.').emoji).toBe('🎈🎈🎈 🎈🎈');
  });

  it('still shows one picture when the text has a single illustration', () => {
    expect(parsePlayfulSnippet('أين تجلس القطة؟ 🐱').emoji).toBe('🐱');
  });
});
