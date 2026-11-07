async function capture(page, options) {
    await page.locator('img').evaluateAll(images => Promise.all(images.filter(img => img.getBoundingClientRect().width > 0).map(img => img.decode())));
    return page.screenshot(options);
}
// Real UI, isolated fictitious profile; writes only into the requested review folder.
const { chromium } = require('@playwright/test');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const target = new URL(process.env.CAPTURE_BASE_URL || 'http://localhost:3002');
if (!['localhost', '127.0.0.1'].includes(target.hostname))
    throw Error('Capture only a local test build; never a real account');
const base = path.resolve(process.argv[2] || path.join(root, 'frontend/.capture-review'));
if (base.startsWith(path.join(root, 'frontend/src/assets')))
    throw Error('Use a separate review directory');
fs.mkdirSync(base, { recursive: true });
const { COURSES_DATA } = require('tsx/cjs/api').require('../src/data/coursesData.ts', __filename);
const lesson = COURSES_DATA.find(l => l.id === 'math-5ap-fractions');
assert(lesson, 'Pilot missing');
const badges = Array.from(fs.readFileSync(path.join(root, 'frontend/src/data/badgesData.ts'), 'utf8').matchAll(/id:\s*['"]([^'"]+)/g), m => m[1]);
(async () => {
    const b = await chromium.launch({ headless: true, channel: 'chromium' }), report = [];
    try {
        for (const mode of ['journey'])
            for (const [w, h] of [[390, 844]]) {
                const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce', hasTouch: w < 600 });
                const voiceIds = ["42f02365fc39ba70", "5e512cbfd791540a", "26d41b7aaf308346", "fff18a6d74e314b8", "5e512cbfd791540a", "26d41b7aaf308346", "759b698a173dcabf"];
                const errors = [];
                await p.addInitScript(() => { const NativeDate = Date; const fixed = Date.parse('2026-11-07T10:00:00Z'); window.Date = class extends NativeDate {
                    constructor(...args) { super(...(args.length ? args : [fixed])); }
                    static now() { return fixed; }
                }; window.__voiceRequests = []; const play = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__voiceRequests.push(this.src); return play.call(this); }; });
                p.on('pageerror', e => errors.push(e.message));
                await p.addInitScript(badges => { localStorage.setItem('mssid_active_child_id', 'account'); localStorage.setItem('mssid_locale_preference', 'ar'); localStorage.setItem('mssid_pwa_dismissed_time', String(Date.now())); localStorage.setItem('mssid_user_profile', JSON.stringify({ badges })); localStorage.setItem('mssid_design_mode', 'world'); }, badges);
                await p.route('**/api/**', r => r.fulfill({ json: r.request().url().includes('/users/me') ? { id: 991, nom: 'سارة', email: 'preview@example.test', role: 'ROLE_FREE', grade: '5AP', gradeSet: true, parentEmailSet: true, emailVerified: true, badges, completedLessonIds: [] } : r.request().url().endsWith('/children') ? [] : {} }));
                if (mode === 'direct')
                    await p.goto('' + target.origin + '/lesson/math-5ap-fractions?g=5AP');
                else {
                    await p.goto('' + target.origin + '/journey?g=5AP');
                    await p.locator('[data-home-lessons]').click();
                    await capture(p, { path: base + '/offer-home.png' });
                    await p.locator('[data-home-demo]').click();
                }
                const scene = p.locator('[data-village-lesson-scene]');
                await scene.waitFor({ timeout: 45000 });
                await p.evaluate(() => document.fonts.ready);
                assert.notEqual(await p.locator('#root').evaluate(el => getComputedStyle(el).display), 'none');
                assert.equal(await p.locator('#root').getAttribute('aria-hidden'), null);
                assert(!await p.locator('#root').evaluate(el => el.inert));
                assert(await p.locator('[data-app-header]').evaluate(el => getComputedStyle(el).display === 'none' && el.inert));
                const rect = await scene.boundingBox();
                assert(rect.x === 0 && rect.y === 0 && Math.round(rect.width) === w && Math.round(rect.height) === h);
                assert.equal(await scene.locator('select').count(), 0);
                assert.equal(await p.locator('[data-demo-profile]').count(), 1);
                await p.waitForTimeout(1000);
                const progressBefore = await p.evaluate(() => Object.fromEntries(['mssid_user_profile', 'mssid_quiz_first_awards', 'mssid_quiz_game_xp', 'mssid_quiz_revision_day'].map(k => [k, localStorage.getItem(k)])));
                assert.equal(await scene.locator('[data-fraction-mission],[data-fraction-mode],.pilot-result-tabs').count(), 0);
                await capture(p, { path: base + '/premium-demo-' + mode + '-welcome-' + w + '.png' });
                await capture(p, { path: base + '/offer-voice.png' });
                const next = p.locator('[data-linear-next]');
                await next.click();
                await p.waitForFunction(id => window.__voiceRequests.at(-1)?.includes(id), voiceIds[0]);
                assert(await next.isDisabled());
                for (let step = 0; step < 6; step++) {
                    const work = p.locator('[data-fraction-step="' + step + '"]');
                    await work.waitFor();
                    const lab = step >= 3;
                    if (step % 3 === 0) {
                        assert.equal(await work.locator('[data-loose-part=available]').count(), lab ? 7 : 17);
                        assert.equal(await work.locator('.fraction-whole').count(), 0);
                        if (step === 0) {
                            await capture(p, { path: base + '/loose-parts-' + mode + '-' + w + '.png' });
                            const parts = work.locator('[data-fraction-part]');
                            await parts.first().scrollIntoViewIfNeeded();
                            const sizes = await parts.evaluateAll(els => els.map(el => { const r = el.getBoundingClientRect(); return { w: r.width, h: r.height }; }));
                            assert(sizes.every(r => r.w >= 59.9 && r.h >= 59.9));
                            const firstPart = work.locator('[data-fraction-part][aria-pressed="false"]').first();
                            if (w < 600)
                                await firstPart.tap();
                            else
                                await firstPart.click();
                            await p.locator('[data-activity-navigation]').click();
                            const pending = p.getByRole('dialog');
                            await pending.waitFor();
                            await pending.getByRole('button').first().click();
                            assert.equal((await work.locator('[data-fraction-rest]').innerText()).trim(), '1');
                            const touchTop = (await work.locator('.fraction-parts-tray').boundingBox()).y;
                            for (let groupPart = 0; groupPart < 4; groupPart++) {
                                const part = work.locator('[data-fraction-part][aria-pressed="false"]').first();
                                if (w < 600)
                                    await part.tap();
                                else
                                    await part.click();
                            }
                            assert.equal(await work.locator('[data-return-whole]').count(), 1);
                            assert.equal(await work.locator('[data-loose-part=available]').count(), 12);
                            assert(Math.abs((await work.locator('.fraction-parts-tray').boundingBox()).y - touchTop) < 2);
                            for (let i = 0; i < 12; i++) {
                                const part = work.locator('[data-fraction-part][aria-pressed="false"]:not(:disabled)').first();
                                if (w < 600)
                                    await part.tap();
                                else
                                    await part.click();
                            }
                            assert.equal((await work.locator('[data-fraction-whole]').innerText()).trim(), '3');
                            assert.equal((await work.locator('[data-fraction-rest]').innerText()).trim(), '2');
                            assert.equal(await work.locator('[data-return-whole]').count(), 3);
                            await capture(p, { path: base + '/offer-manipulation.png' });
                        }
                        else {
                            for (let i = 0; i < 2; i++)
                                await work.getByRole('button', { name: 'أضيف وحدة', exact: true }).click();
                            await work.getByRole('button', { name: 'أضيف جزءًا', exact: true }).click();
                        }
                    }
                    else if (step % 3 === 1)
                        await work.locator('[data-fraction-lower="' + (lab ? 2 : 3) + '"]').click();
                    else
                        await work.locator('[data-fraction-factor="' + (lab ? 2 : 5) + '"]').click();
                    await work.locator('[data-fraction-check]').click();
                    assert(await next.isEnabled());
                    await next.click();
                    await p.waitForFunction(id => window.__voiceRequests.at(-1)?.includes(id), voiceIds[step + 1]);
                }
                await p.locator('[data-fraction-step="6"]').waitFor();
                assert(await next.isDisabled());
                await p.locator('[data-fraction-explain="1"]').click();
                assert(await next.isDisabled());
                await p.locator('[data-fraction-explain="0"]').click();
                await next.click();
                await p.locator('[data-pilot-rule]').waitFor();
                await next.click();
                const ex = p.locator('[data-pilot-exercise]:not([hidden])');
                await p.locator('[data-pilot-help]').click();
                assert((await ex.innerText()).includes(lesson.progressiveExercises[0].hintsAr[0]));
                await ex.getByText('8', { exact: true }).click();
                await ex.getByRole('button', { name: 'تحقق من الإجابة' }).click();
                await p.locator('[data-pilot-companion="cheer"]').waitFor();
                await capture(p, { path: base + '/offer-support.png' });
                await p.locator('[data-session-parent]').click();
                assert.equal(await p.locator('[data-session-report]').count(), 0);
                const gate = p.getByRole('dialog');
                const nums = (await gate.innerText()).match(/(\d+)\s*\+\s*(\d+)\s*=/);
                assert(nums);
                await gate.getByRole('spinbutton').fill(String(+nums[1] + +nums[2]));
                await gate.locator('[type="submit"]').click();
                await p.locator('[data-session-report]').waitFor();
                await capture(p, { path: base + '/offer-report.png' });
                assert((await p.locator('[data-session-report]').innerText()).includes('نجح مع مساعدة أو بعد خطأ: 1'));
                await p.locator('[data-session-next]').click();
                for (let i = 0; i < lesson.progressiveExercises.length; i++)
                    await next.click();
                await next.click();
                assert.equal(await p.locator('[data-primary-cta="finish-lesson"]').count(), 0);
                for (const q of lesson.quiz)
                    await p.locator('[data-quiz-question="' + q.id + '"] [data-quiz-option-id="' + q.options.find(o => o.isCorrect).id + '"]').click();
                await p.locator('[data-primary-cta="finish-lesson"]').waitFor();
                assert(await scene.evaluate(el => el.scrollWidth <= el.clientWidth));
                assert.deepEqual(errors, []);
                const progressAfter = await p.evaluate(() => Object.fromEntries(['mssid_user_profile', 'mssid_quiz_first_awards', 'mssid_quiz_game_xp', 'mssid_quiz_revision_day'].map(k => [k, localStorage.getItem(k)])));
                assert.deepEqual(progressAfter, progressBefore);
                assert.equal(await p.evaluate(() => JSON.parse(localStorage.getItem('mssid_premium_funnel_counts_v1')).demo_complete), 1);
                await p.locator('[data-activity-navigation]').click();
                const confirmation = p.getByRole('dialog');
                if (await confirmation.count())
                    await confirmation.getByRole('button').last().click();
                await scene.waitFor({ state: 'detached' });
                assert.notEqual(await p.locator('#root').evaluate(el => getComputedStyle(el).display), 'none');
                assert.equal(await p.locator('#root').getAttribute('aria-hidden'), null);
                assert(!await p.locator('#root').evaluate(el => el.inert));
                report.push({ mode, width: w, height: h, fullscreen: true, rootRestored: true, demoIsolated: true, demoCompletionCounted: true, rootRemainsAccessible: true, loosePartsReact: true, directTouch: true, stableTouchTargets: true, exitCancelPreservesParts: true, targets60: true, linearSevenSteps: true, recordedSevenAnnouncements: true, protectedReport: true, originalQuiz: true, noOverflow: true, errors });
                console.log(JSON.stringify(report.at(-1)));
                const files = [];
                for (const [name, source] of Object.entries({ home: 'home', voice: 'voice', manipulation: 'manipulation', support: 'support', report: 'report' })) {
                    const png = fs.readFileSync(path.join(base, 'offer-' + source + '.png'));
                    const data = await p.evaluate(async (bytes) => { const bitmap = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: 'image/png' })); const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height; canvas.getContext('2d').drawImage(bitmap, 0, 0); return canvas.toDataURL('image/webp', .78).split(',')[1]; }, Array.from(png));
                    const buffer = Buffer.from(data, 'base64');
                    const file = name + '.webp';
                    fs.writeFileSync(path.join(base, file), buffer);
                    files.push({ file, bytes: buffer.length, sha256: crypto.createHash('sha256').update(buffer).digest('hex') });
                }
                fs.writeFileSync(path.join(base, 'capture-provenance.json'), JSON.stringify({ source: 'Arabic 390x844, explicit isolated demo, mocked APIs, deterministic fictitious profile and date; visually review before replacing assets', files, lessonHash: crypto.createHash('sha256').update(JSON.stringify(lesson)).digest('hex') }, null, 2));
                fs.writeFileSync(path.join(base, 'index.html'), '<!doctype html><meta charset="utf-8"><title>Captures à relire</title><h1>Profil fictif - captures à relire avant remplacement</h1>' + files.map(f => '<img alt="' + f.file + '" style="width:195px;vertical-align:top;margin:8px" src="' + f.file + '">').join(''));
                await p.close();
            }
    }
    finally {
        await b.close();
        fs.writeFileSync(base + '/premium-capture-report.json', JSON.stringify(report, null, 2));
    }
})().catch(e => { console.error(e); process.exitCode = 1; });
