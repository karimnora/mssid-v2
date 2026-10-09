import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const locale of ['fr','ar'])test(`native account status without checkout in ${locale}`,async({page})=>{
 const fr=locale==='fr';const say=(a:string,b:string)=>fr?a:b;let active=false;let receiptCalls=0;
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(loc=>{localStorage.setItem('mssid_locale_preference',loc);Math.random=()=>0;(window as any).androidBridge={};},locale);
 await page.route('**/api/**',route=>{
  const path=new URL(route.request().url()).pathname;
  if(path.endsWith('/receipt/upload'))receiptCalls++;
  if(path.endsWith('/users/me'))return route.fulfill({json:{id:7,nom:'Parent Test',email:'parent@example.test',role:active?'ROLE_PREMIUM':'ROLE_FREE',grade:'1AP'}});
  if(path.endsWith('/payments/subscription'))return route.fulfill({json:{status:active?'ACTIVE':'NONE',startDate:active?'2026-10-10':null,endDate:active?'2027-10-10':null}});
  if(path.endsWith('/cahiers/access'))return route.fulfill({json:{premium:active,limit:3,remaining:0,unlockedIds:[],allowed:true,resetsAt:'2030-01-06T23:00:00Z'}});
  return route.fulfill({json:{}});
 });
 await page.goto('/labs/cahiers_lab?g=1AP');await page.locator('[data-cahier]').first().click();
 await page.getByRole('dialog').getByRole('button',{name:say('Mon abonnement','اشتراكي'),exact:true}).click();
 const gate=page.getByRole('dialog',{name:say('Espace parents','بوابة الوالدين')});await gate.getByRole('spinbutton').fill('20');await gate.getByRole('button',{name:say('Continuer','متابعة')}).click();
 const status=page.locator('[data-subscription-status]');await expect(status.getByRole('status')).toHaveText(say('Aucun abonnement actif','لا يوجد اشتراك نشط'));
 await expect(status.locator('form,input[type=file],a')).toHaveCount(0);await expect(status.getByRole('radio')).toHaveCount(0);
 active=true;await status.getByRole('button',{name:say('Actualiser mes accès','تحديث صلاحياتي')}).click();await expect(status.getByRole('status')).toHaveText(say('Abonnement actif','اشتراك نشط'));await expect(status).toContainText('2027');
 expect(receiptCalls).toBe(0);const a11y=await new AxeBuilder({page}).include('[data-subscription-status]').withTags(['wcag2a','wcag2aa']).analyze();expect(a11y.violations).toEqual([]);
 await status.getByRole('button',{name:say('Fermer','إغلاق')}).click();await expect(status).toHaveCount(0);
});
