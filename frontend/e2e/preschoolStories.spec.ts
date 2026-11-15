import { findRecordedSpeech } from '../src/utils/recordedSpeech';
import { test, expect } from '@playwright/test';
import { NARRATED_STORIES } from '../src/data/preschool/narratedStories';

for (const language of ['fr', 'ar', 'en'] as const) {
  test(`a child can hear, retry and retell a recorded story in ${language}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(language => {
      localStorage.setItem('mssid_locale_preference', 'fr');
      localStorage.setItem('mssid_preschool_language', language);
      Object.defineProperty(window.speechSynthesis, 'getVoices', { value: () => [] });
    }, language);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    const media: string[] = [];
    page.on('response', response => { if ([200, 206].includes(response.status())) media.push(response.url()); });
    await page.goto('/eveil');
    const labels = {
      fr: ['Apprendre', 'Tracé et créatif', 'Petites histoires', 'On joue avec l’histoire ▶', 'Je continue ▶', 'Je l’ai racontée !'],
      ar: ['أَتَعَلَّم', 'الْخَطّ وَالْإِبْدَاع', 'قِصَصٌ صَغِيرَة', 'نَلْعَبُ مَعَ الْقِصَّة ◀', 'أُوَاصِلُ ◀', 'قُلْتُهَا!'],
      en: ['Learn', 'Writing and art', 'Little stories', 'Let’s play with the story ▶', 'Continue ▶', 'I told the story!'],
    }[language];
    await page.getByText(labels[0], { exact: true }).click();
    await page.getByText(labels[1], { exact: true }).click();
    await page.getByText(labels[2], { exact: true }).click();
    const activity = NARRATED_STORIES[0];
    await page.getByRole('button', { name: activity.i18n[language].title, exact: true }).click();
    await expect(page.locator('[data-narrated-story="listen"]')).toBeVisible();
    // Explicit user gesture must play the recording even when there are no native voices.
    await page.locator('[data-narrated-story="listen"] > button').first().click();
    await expect.poll(() => media.some(url => url.endsWith(findRecordedSpeech(activity.i18n[language].promptAudio, language)!.src))).toBe(true);
    await page.getByRole('button', { name: labels[3], exact: true }).click();
    for (const question of activity.narratedStory!.questions) {
      const wrong = question.choices.find(c => c.id !== question.correctId)!;
      await page.getByRole('button', { name: wrong.label[language], exact: true }).click();
      await expect(page.getByRole('status').last()).toBeVisible();
      const correct = question.choices.find(c => c.id === question.correctId)!;
      await page.getByRole('button', { name: correct.label[language], exact: true }).click();
      await page.getByRole('button', { name: labels[4], exact: true }).click();
    }
    await expect(page.locator('[data-narrated-story="retell"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`story-${language}.png`), fullPage: true });
    await page.getByRole('button', { name: labels[5], exact: true }).click();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('mssid_preschool_progress:child-1') ?? '[]'))).toContain(activity.id);
  });
}
