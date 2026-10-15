import {test,expect,type Page} from '@playwright/test';
import {ENRICHMENT_MODULES} from '../src/data/family/enrichmentContent';
const module=ENRICHMENT_MODULES.find(m=>m.grade==='2AP'&&m.domain==='operations')!;
async function prepare(page:Page,observations:Record<string,unknown>,userId=7,offline={value:false}) {
 await page.setViewportSize({width:360,height:800});await page.addInitScript(()=>{localStorage.setItem('mssid_locale_preference','fr');localStorage.setItem('mssid_active_child_id','account');});
 await page.route('**/api/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  if(path.endsWith('/users/me'))return route.fulfill({json:{id:userId,nom:'Parent Test',email:'parent@example.test',role:'ROLE_PREMIUM',grade:'2AP'}});
  if(path.endsWith('/cahiers/access'))return route.fulfill({json:{premium:true,limit:3,remaining:3,unlockedIds:[],allowed:true,resetsAt:'2030-01-01T00:00:00Z'}});
  if(path.includes('/learning/')){if(offline.value)return route.abort('failed');if(route.request().method()==='PUT')Object.assign(observations,route.request().postDataJSON());return route.fulfill({json:observations});}
  return route.fulfill({json:{}});
 });
 await page.goto('/labs/cahiers_lab?g=2AP&workshop='+encodeURIComponent(module.id));
 await expect(page.locator('[data-enrichment-reader]')).toBeVisible({timeout:30000});
}
test('workshop observations survive another device without leaking to another account',async({browser})=>{
 const stored:Record<string,unknown>={};const first=await browser.newContext();const a=await first.newPage();await prepare(a,stored);
 const task=a.locator('[data-family-task="'+module.tasks[0].id+'"]');await task.locator('input').fill(module.tasks[0].accepted![0]);await task.getByRole('button',{name:'Vérifier ma réponse',exact:true}).click();
 await expect.poll(()=>Object.keys(stored).length).toBe(1);await first.close();
 const second=await browser.newContext();const b=await second.newPage();await prepare(b,stored);await expect(b.locator('[data-learning-sync="synced"]')).toBeVisible();
 expect(await b.evaluate(()=>JSON.parse(localStorage.getItem('mssid_family_learning_v1:user:7:2AP')??'{}'))).toHaveProperty(module.tasks[0].id);
 await b.goto('/?g=2AP');await b.locator('[data-nav-profile]').click();await b.getByRole('button',{name:'Carnet de suivi',exact:true}).click();
 const gate=b.getByRole('dialog').last();const numbers=(await gate.innerText()).match(/(\d+)\s*\+\s*(\d+)/)!;await gate.locator('input').fill(String(Number(numbers[1])+Number(numbers[2])));await gate.locator('button[type="submit"]').click();
 const summary=b.locator('[data-family-parent-summary]');await expect(summary).toBeVisible();await expect(summary.locator('[data-learning-sync="synced"]')).toBeVisible();await b.screenshot({path:'build/v2-parent-summary-mobile.png',fullPage:true});
 await summary.getByRole('button',{name:'Imprimer ce bilan'}).click();await expect(b.locator('.printable-sheet')).toContainText('Les 7 derniers jours');await b.keyboard.press('Escape');await expect(b.locator('.printable-sheet')).toHaveCount(0);
 const third=await browser.newContext();const c=await third.newPage();await prepare(c,{},8);await expect(c.locator('[data-learning-sync="synced"]')).toBeVisible();expect(await c.evaluate(()=>JSON.parse(localStorage.getItem('mssid_family_learning_v1:user:8:2AP')??'{}'))).toEqual({});await second.close();await third.close();
});
test('offline work stays local until explicit retry synchronizes it',async({page})=>{
 const stored:Record<string,unknown>={},offline={value:true};await prepare(page,stored,7,offline);
 const task=page.locator('[data-family-task="'+module.tasks[0].id+'"]');await task.locator('input').fill(module.tasks[0].accepted![0]);await task.getByRole('button',{name:'Vérifier ma réponse',exact:true}).click();await expect(page.locator('[data-learning-sync="pending"]')).toBeVisible({timeout:60000});expect(Object.keys(stored)).toHaveLength(0);
 offline.value=false;await page.evaluate(()=>window.dispatchEvent(new Event('online')));await expect(page.locator('[data-learning-sync="synced"]')).toBeVisible();expect(stored).toHaveProperty(module.tasks[0].id);
});

test('two siblings keep separate synchronized observations on one device',async({page})=>{
 const id=module.tasks[0].id;const stored={11:{[id]:{outcome:'helped',at:'2026-10-15T10:00:00Z',completedAt:'2026-10-15T10:00:00Z'}},12:{}};
 await page.addInitScript(()=>{localStorage.setItem('mssid_locale_preference','fr');if(!['11','12'].includes(localStorage.getItem('mssid_active_child_id')??''))localStorage.setItem('mssid_active_child_id','11');});
 await page.route('**/api/**',route=>{
  const url=new URL(route.request().url()),path=url.pathname;
  if(path.endsWith('/users/me'))return route.fulfill({json:{id:7,nom:'Parent Test',email:'parent@example.test',role:'ROLE_PREMIUM',grade:'2AP'}});
  if(path.endsWith('/children'))return route.fulfill({json:[{id:11,displayName:'Lina',grade:'2AP'},{id:12,displayName:'Sami',grade:'2AP'}]});
  if(path.endsWith('/cahiers/access'))return route.fulfill({json:{premium:true,limit:3,remaining:3,unlockedIds:[],allowed:true,resetsAt:'2030-01-01T00:00:00Z'}});
  if(path.includes('/learning/'))return route.fulfill({json:stored[Number(url.searchParams.get('childId')) as 11|12]??{}});
  return route.fulfill({json:{}});
 });
 await page.goto('/labs/cahiers_lab?g=2AP&workshop='+encodeURIComponent(module.id));await expect(page.locator('[data-learning-sync="synced"]')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('mssid_family_learning_v1:user:7:child:11:2AP')??'{}'))).toHaveProperty(id);
 await page.evaluate(()=>localStorage.setItem('mssid_active_child_id','12'));await page.reload();await expect(page.locator('[data-learning-sync="synced"]')).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('mssid_family_learning_v1:user:7:child:12:2AP')??'{}'))).toEqual({});
});
