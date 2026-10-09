import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const locale of ['fr','ar'])test(`free guided support on mobile in ${locale}`,async({page},testInfo)=>{
 const fr=locale==='fr';const say=(a:string,b:string)=>fr?a:b;let aiCalls=0;
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(loc=>{localStorage.setItem('mssid_locale_preference',loc);Math.random=()=>0;},locale);
 await page.route('**/api/**',route=>{
  const path=new URL(route.request().url()).pathname;if(/\/(ai|gemini)\//.test(path))aiCalls++;
  if(path.endsWith('/users/me'))return route.fulfill({json:{id:7,nom:'Parent Test',email:'parent@example.test',role:'ROLE_FREE',grade:'1AP'}});
  return route.fulfill({json:{}});
 });
 await page.goto('/?g=1AP');await page.getByRole('button',{name:say('Accompagnement guidé','المرافقة الموجّهة'),exact:true}).click();
 const dialog=page.getByRole('dialog',{name:say('Mon accompagnement MSSID','مرافقتي مع مسيد')});await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:'2AP',exact:true}).click();await dialog.getByRole('combobox').selectOption('math-2ap-c-addition-carry');
 await dialog.getByRole('button',{name:say('Un indice','مساعدة'),exact:true}).click();
 await dialog.getByRole('button',{name:say('Explique la méthode','اشرح الطريقة')}).click();
 await dialog.getByRole('button',{name:say('Un exemple similaire','مثال مشابه')}).click();
 await dialog.getByRole('button',{name:'85',exact:true}).click();await expect(dialog.getByRole('status')).toContainText('85');
 expect(aiCalls).toBe(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const a11y=await new AxeBuilder({page}).include('[data-learning-focus]').withTags(['wcag2a','wcag2aa']).analyze();expect(a11y.violations).toEqual([]);
 if(fr)await page.screenshot({path:testInfo.outputPath('v2-guided-mobile.png')});
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();expect(aiCalls).toBe(0);
});
