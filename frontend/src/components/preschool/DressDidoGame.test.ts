import { describe, expect, it } from 'vitest';
import { DRESS_DIDO_LEVELS } from './DressDidoGame';
import { garmentEmoji } from './preschoolGarments';

describe('Dress Dido clothing distinctions', () => {
  const byWeather = (emoji: string) => DRESS_DIDO_LEVELS.find((level) => level.emoji === emoji);

  it('does not reuse the billed cap for bonnet or straw hat', () => {
    const hot = byWeather('☀️')!.garments.find((g) => g.correct && g.slot === 'head');
    const snow = byWeather('❄️')!.garments.find((g) => g.correct && g.slot === 'head');
    const beach = byWeather('🏖️')!.garments.find((g) => g.correct && g.slot === 'head');
    const sahara = byWeather('🏜️')!.garments.find((g) => g.correct && g.slot === 'head');

    expect(hot?.kind).toBe('casquette');
    expect(snow?.kind).toBe('bonnet');
    expect(beach?.kind).toBe('strawHat');
    expect(sahara?.kind).toBe('strawHat');
    expect(new Set([hot!.kind, snow!.kind, beach!.kind]).size).toBe(3);
    expect(garmentEmoji('casquette')).toBe('🧢');
    expect(garmentEmoji('strawHat')).toBe('👒');
    expect(garmentEmoji('bonnet')).toBeUndefined();
  });

  it('names casquette, bonnet and straw hat with different Arabic words', () => {
    const blob = JSON.stringify(DRESS_DIDO_LEVELS);
    expect(blob).toContain('قُبَّعَة');
    expect(blob).toContain('طَاقِيَّة');
    expect(blob).toContain('قُبَّعَةُ قَشّ');
    expect(blob).not.toMatch(/كاسكيط|كَاسْكِيط/);
    expect(blob).toContain('casquette');
    expect(blob).toContain('bonnet');
    expect(blob).toContain('chapeau de paille');
    expect(byWeather('❄️')!.garments.find((g) => g.kind === 'bonnet')?.labelAr).toBe('طَاقِيَّة');
    expect(byWeather('☀️')!.garments.find((g) => g.kind === 'casquette')?.labelAr).toBe('قُبَّعَة');
    expect(byWeather('🏖️')!.garments.find((g) => g.kind === 'strawHat')?.labelAr).toBe('قُبَّعَةُ قَشّ');
  });

  it('does not dress bedtime with the same t-shirt glyph as a day shirt', () => {
    const sleep = byWeather('🌙')!.garments.find((g) => g.id === 'pjs');
    const school = byWeather('🎒')!.garments.find((g) => g.id === 'tee');
    expect(sleep?.kind).toBe('pajama');
    expect(school?.kind).toBe('tee');
    expect(sleep?.kind).not.toBe(school?.kind);
  });

  it('gives rain its own yellow coat and wellies, not the winter coat', () => {
    const rain = byWeather('🌧️')!;
    const snow = byWeather('❄️')!;
    expect(rain.garments.find((g) => g.correct && g.slot === 'body')?.kind).toBe('raincoat');
    expect(snow.garments.find((g) => g.correct && g.slot === 'body')?.kind).toBe('winterCoat');
    expect(rain.garments.find((g) => g.correct && g.slot === 'feet')?.kind).toBe('rainBoots');
  });
});
