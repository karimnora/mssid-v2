import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const locale of ['fr','ar'])for(const premium of [false,true]){
 test(`family studio on mobile ${locale} ${premium?'Premium':'free'}`,async({page},testInfo)=>{
  const fr=locale==='fr';const say=(a:string,b:string)=>fr?a:b;
  await page.setViewportSize({width:390,height:844});
  await page.addInitScript(loc=>localStorage.setItem('mssid_locale_preference',loc),locale);
  await page.route('**/api/**',route=>{
   const path=new URL(route.request().url()).pathname;
   if(path.endsWith('/users/me'))return route.fulfill({json:{id:7,nom:'Parent Test',email:'parent@example.test',role:premium?'ROLE_PREMIUM':'ROLE_FREE',grade:'5AP'}});
   if(path.endsWith('/cahiers/access'))return route.fulfill({json:{premium,limit:3,remaining:3,unlockedIds:[],allowed:true,resetsAt:'2030-01-06T23:00:00Z'}});
   return route.fulfill({json:{}});
  });
  await page.goto('/labs/cahiers_lab?g=5AP');
  const studio=page.locator('[data-family-studio]');await expect(studio).toBeVisible({timeout:30000});
  await studio.locator('[data-family-service="entry"]').click();await studio.getByRole('button',{name:new RegExp(say('Diagnostic de départ','تشخيص البداية'))}).click();
  await expect(studio.locator('[data-family-task="4AP-n1"]')).toBeVisible();
  await studio.locator('[data-family-service="evaluation"]').click();await studio.getByRole('combobox').first().selectOption('decimals');await studio.getByRole('combobox').last().selectOption('7');
  await expect(studio.locator('[data-family-task="5AP-d1"]')).toBeVisible();
  await studio.locator('[data-family-task="5AP-d1"] input').fill('٤,٢٥');await studio.getByRole('button',{name:say('Vérifier ma réponse','أتحقق من إجابتي')}).click();await expect(studio.getByRole('status')).toContainText(say('Réponse correcte','إجابة صحيحة'));
  if(premium){
   await studio.getByRole('button',{name:say('Imprimer le programme','أطبع البرنامج')}).click();const print=page.getByRole('dialog',{name:say('Imprimer mon programme','طباعة برنامجي')});await expect(print.locator('.family-print-page')).toHaveCount(7);
   await print.getByRole('button',{name:say('Afficher les corrigés','أعرض التصحيح')}).click();await expect(print.locator('.family-answer-space')).toHaveCount(0);
   if(fr){await page.emulateMedia({media:'print'});await page.pdf({path:testInfo.outputPath('v2-family-corrected.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});}
   await page.keyboard.press('Escape');await expect(print).not.toBeVisible();
  }else await expect(studio.getByRole('button',{name:say('Imprimer le programme','أطبع البرنامج')})).toHaveCount(0);
  await studio.locator('[data-family-service="labs"]').click();await studio.getByRole('button',{name:say('Mode histoire','وضع القصة')}).click();
  for(let i=0;i<3;i++)await studio.getByRole('button',{name:say('Ajouter un sachet','إضافة كيس')}).click();
  await studio.getByRole('button',{name:say('Vérifier','أتحقق'),exact:true}).click();await studio.getByRole('button',{name:say('Continuer','أتابع'),exact:true}).click();
  if(premium){await studio.getByRole('textbox').fill('3750');await studio.getByRole('button',{name:say('Vérifier','أتحقق'),exact:true}).click();await studio.getByRole('button',{name:say('Continuer','أتابع'),exact:true}).click();await studio.getByRole('textbox').fill('1250');await studio.getByRole('button',{name:say('Vérifier','أتحقق'),exact:true}).click();await studio.getByRole('button',{name:say('Continuer','أتابع'),exact:true}).click();}
  await expect(studio.getByText(new RegExp(say(premium?'Mission terminée':'Mission découverte terminée',premium?'انتهت المهمة':'انتهت مهمة الاكتشاف')))).toBeVisible();
  await studio.getByRole('button',{name:new RegExp(say('L’aventure du lecteur','مغامرة القارئ'))}).click();await studio.getByRole('button',{name:'الْخَوْفُ مِنْ ضَيَاعِ الْكُتُبِ.'}).click();await expect(studio.getByRole('status')).toContainText(say('Bonne piste','إجابة مناسبة'));
  await studio.getByRole('button',{name:new RegExp(say('L’atelier des ombres','ورشة الظلال'))}).click();await studio.getByRole('button',{name:say('Plus courte','أقصر'),exact:true}).click();await studio.getByRole('button',{name:say('Tester ma prédiction','أختبر توقّعي')}).click();await expect(studio.getByRole('status')).toContainText(say('Ta prédiction correspond','توقّعك يوافق'));
  if(premium&&fr){await studio.locator('.studio-stage').scrollIntoViewIfNeeded();await page.screenshot({path:testInfo.outputPath('v2-family-lab-mobile.png')});}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const a11y=await new AxeBuilder({page}).include('[data-family-studio]').withTags(['wcag2a','wcag2aa']).analyze();expect(a11y.violations).toEqual([]);
 });
}
