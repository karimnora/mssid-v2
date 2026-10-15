import { THEMED_READING } from '../src/data/family/themedAdventures';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const [locale, width] of [['fr',360],['ar',390],['fr',768],['fr',1366]] as const) {
 test('immersive adventures ' + locale + ' ' + width, async ({ page }, testInfo) => {
  const fr = locale === 'fr'; const say = (a: string, b: string) => fr ? a : b;
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(loc => localStorage.setItem('mssid_locale_preference',loc), locale);
  await page.route('**/api/**', route => {
   const path = new URL(route.request().url()).pathname;
   if (path.endsWith('/users/me')) return route.fulfill({ json: {id:7,nom:'Parent Test',email:'parent@example.test',role:'ROLE_PREMIUM',grade:'3AP'} });
   if (path.endsWith('/cahiers/access')) return route.fulfill({ json: {premium:true,limit:3,remaining:3,unlockedIds:[],allowed:true,resetsAt:'2030-01-06T23:00:00Z'} });
   return route.fulfill({json:{}});
  });
  await page.goto('/labs/cahiers_lab?g=3AP');
  const studio = page.locator('[data-family-studio]');
  await studio.getByRole('button',{name:new RegExp(say('Laboratoires Premium','مختبرات Premium'))}).click();
  let stage = studio.locator('[data-adventure="market"]');
  await expect(stage).toBeVisible();
  await stage.screenshot({path:testInfo.outputPath('market.png'),style:'[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}'});
  for(let i=0;i<4;i++) await stage.getByRole('button',{name:say('Prendre un sachet sur l’étal','أضيف كيساً من البسطة'),exact:true}).click();
  await stage.getByRole('button',{name:say('Vérifier','أتحقق'),exact:true}).click();
  await expect(stage.getByRole('status').filter({hasText:say('Tu as placé exactement','وضعت')})).toBeVisible();
  await studio.getByRole('button',{name:new RegExp(say('L’atelier des ombres','ورشة الظلال'))}).click();
  stage = studio.locator('[data-adventure="science"]');
  await stage.getByRole('button',{name:say('Plus longue','أطول'),exact:true}).click();
  await stage.getByRole('button',{name:say('Tester ma prédiction','أختبر توقّعي')}).click();
  await expect(stage.getByRole('button',{name:say('Expérience suivante','التجربة التالية')})).toHaveCount(0);
  await stage.getByRole('button',{name:say('Réessayer l’expérience','أعيد التجربة')}).click();
  await stage.getByRole('button',{name:say('Plus courte','أقصر'),exact:true}).click();
  await stage.getByRole('button',{name:say('Tester ma prédiction','أختبر توقّعي')}).click();
  await stage.screenshot({path:testInfo.outputPath('science.png'),style:'[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}'});
  await studio.getByRole('button',{name:new RegExp(say('L’aventure du lecteur','مغامرة القارئ'))}).click();
  stage = studio.locator('[data-adventure="story"]');
  await expect(stage.getByRole('button',{name:say('Écouter le récit en arabe','أستمع إلى القصة بالعربية')})).toBeVisible();
  await stage.screenshot({path:testInfo.outputPath('reading.png'),style:'[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}'});
  await studio.getByText(say('Repères pour le parent','ملاحظات للوالد'),{exact:true}).click();
  await expect(studio.getByText(say('Réussi seul','نجح وحده'),{exact:true})).toBeVisible();
  await expect(studio.getByText(say('Avec aide','بمساعدة'),{exact:true})).toBeVisible();
  await page.reload();
  await studio.getByRole('button',{name:new RegExp(say('Laboratoires Premium','مختبرات Premium'))}).click();
  await studio.getByText(say('Repères pour le parent','ملاحظات للوالد'),{exact:true}).click();
  await expect(studio.getByText(say('Avec aide','بمساعدة'),{exact:true})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const audit = await new AxeBuilder({page}).include('.premium-adventures').withTags(['wcag2a','wcag2aa']).analyze();
  expect(audit.violations).toEqual([]);
 });
}

for (const locale of ['fr','ar'] as const) {
 test('themed collection and exit protection ' + locale, async ({ page }, testInfo) => {
  const fr = locale === 'fr'; const say = (a:string,b:string) => fr ? a : b;
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(loc=>localStorage.setItem('mssid_locale_preference',loc),locale);
  await page.route('**/api/**',route=>{
   const path=new URL(route.request().url()).pathname;
   if(path.endsWith('/users/me'))return route.fulfill({json:{id:7,nom:'Parent Test',email:'parent@example.test',role:'ROLE_PREMIUM',grade:'3AP'}});
   if(path.endsWith('/cahiers/access'))return route.fulfill({json:{premium:true,limit:3,remaining:3,unlockedIds:[],allowed:true,resetsAt:'2030-01-06T23:00:00Z'}});
   return route.fulfill({json:{}});
  });
  await page.goto('/labs/cahiers_lab?g=3AP');
  const studio=page.locator('[data-family-studio]');
  await studio.getByRole('button',{name:new RegExp(say('Laboratoires Premium','مختبرات Premium'))}).click();
  await expect(studio.getByRole('alert')).toHaveCount(0);
  await studio.locator('.adventure-collection summary').click();
  await studio.getByRole('button',{name:say('Le jardin de l’école','حديقة المدرسة'),exact:true}).click();
  let stage=studio.locator('[data-adventure="market"]');
  await expect(stage).toHaveAttribute('data-adventure-theme','garden');
  await stage.screenshot({path:testInfo.outputPath('garden-market.png'),style:'[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}'});
  for(let i=0;i<3;i++)await stage.getByRole('button',{name:say('Ajouter un sachet','إضافة كيس'),exact:true}).click();
  await stage.getByRole('button',{name:say('Vérifier','أتحقق'),exact:true}).click();
  await stage.getByRole('button',{name:say('Continuer','أتابع'),exact:true}).click();
  for(const answer of ['225','275']){
   await stage.getByRole('textbox').fill(answer);
   await stage.getByRole('button',{name:say('Vérifier','أتحقق'),exact:true}).click();
   await stage.getByRole('button',{name:say('Continuer','أتابع'),exact:true}).click();
  }
  await studio.getByRole('button',{name:new RegExp(say('L’aventure du lecteur','مغامرة القارئ'))}).click();
  stage=studio.locator('[data-adventure="story"]');
  await stage.screenshot({path:testInfo.outputPath('garden-reading.png'),style:'[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}'});
  for(const task of THEMED_READING.garden['3AP'].tasks){
   await stage.getByRole('button',{name:task.correct,exact:true}).click();
   await stage.getByRole('button',{name:say('Suite de l’aventure','أتابع المغامرة'),exact:true}).click();
  }
  await studio.getByRole('button',{name:new RegExp(say('L’atelier des ombres','ورشة الظلال'))}).click();
  stage=studio.locator('[data-adventure="science"]');
  for(const prediction of [say('Plus courte','أقصر'),say('Plus longue','أطول'),say('Plus courte','أقصر')]){
   await stage.getByRole('button',{name:prediction,exact:true}).click();
   await stage.getByRole('button',{name:say('Tester ma prédiction','أختبر توقّعي')}).click();
   await stage.getByRole('button',{name:say('Expérience suivante','التجربة التالية')}).click();
  }
  await expect(studio.getByText(say('9/9 défis réussis','9/9 تحديات ناجحة'),{exact:true})).toBeVisible();
  await studio.getByRole('button',{name:say('La bibliothèque de la Casbah','مكتبة القصبة'),exact:true}).click();
  stage=studio.locator('[data-adventure="market"]');
  await expect(stage).toHaveAttribute('data-adventure-theme','library');
  await expect(studio.getByText(say('0/9 défis réussis','0/9 تحديات ناجحة'),{exact:true})).toBeVisible();
  await stage.screenshot({path:testInfo.outputPath('library-market.png'),style:'[data-nav-child], [data-nav-compact], .fixed{visibility:hidden!important}'});
  await stage.getByRole('button',{name:say('Ajouter un livre','إضافة كتاب'),exact:true}).click();
  await studio.getByRole('button',{name:say('Le jardin de l’école','حديقة المدرسة'),exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:say('Continuer','متابعة'),exact:true}).click();
  await expect(stage).toHaveAttribute('data-adventure-theme','library');
  await studio.getByRole('button',{name:say('Le jardin de l’école','حديقة المدرسة'),exact:true}).click();
  await page.getByRole('dialog').getByRole('button',{name:say('Quitter','خروج'),exact:true}).click();
  await expect(studio.getByText(say('9/9 défis réussis','9/9 تحديات ناجحة'),{exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const a11y=await new AxeBuilder({page}).include('.premium-adventures').withTags(['wcag2a','wcag2aa']).analyze();
  expect(a11y.violations).toEqual([]);
 });
}
