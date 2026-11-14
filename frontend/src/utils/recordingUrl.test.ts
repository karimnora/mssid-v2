import { describe, expect, it } from 'vitest';
import { resolveRecordingUrl } from './recordingUrl';

describe('resolveRecordingUrl', () => {
  const course = '/sounds/preschool/ar/course-cedar-0001546aacb65384.mp3';

  it('plays course recordings from the public site in the Android app', () => {
    expect(resolveRecordingUrl(course, true)).toBe(`https://mssid-dz.com${course}`);
  });

  it('keeps the local file on the web, where the site serves it itself', () => {
    expect(resolveRecordingUrl(course, false)).toBe(course);
  });

  it('keeps bundled recordings local in the Android app', () => {
    for (const src of ['/sounds/preschool/ar/reading-school-1.mp3', '/sounds/preschool/fr/letter-a.mp3', '/sounds/box/thunder.mp3']) {
      expect(resolveRecordingUrl(src, true)).toBe(src);
    }
  });
});
