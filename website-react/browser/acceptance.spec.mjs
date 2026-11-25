import {test,expect} from '@playwright/test';
import {syntheticTrace} from '../../src/synthetic.mjs';
test('dashboard filter, import privacy, rejection and reset',async({page})=>{
 const remote=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/')&&!r.url().startsWith('data:'))remote.push(r.url());});
 await page.goto('/');const dashboard=page.locator('#dashboard');await expect(dashboard.getByRole('heading',{name:'Trace explorer'})).toBeVisible();
 await expect(dashboard.locator('tbody tr')).toHaveCount(5);
 await dashboard.getByLabel('Status',{exact:true}).selectOption('error');await expect(dashboard.locator('tbody tr')).toHaveCount(1);
 await expect(dashboard.locator('tbody')).toContainText('timeout');
 const trace=structuredClone(syntheticTrace);trace.spans[0].name='private-label';trace.spans[0].metadata={model:'private-model'};
 const second=structuredClone(trace);second.traceId='9'.repeat(32);second.spans.forEach(s=>s.traceId=second.traceId);
 const input=dashboard.getByLabel('Import local JSONL');
 await input.setInputFiles({name:'synthetic.jsonl',mimeType:'application/x-ndjson',buffer:Buffer.from(JSON.stringify(trace)+'\n'+JSON.stringify(second))});
 await expect(dashboard.getByRole('status')).toContainText('Local import');await expect(dashboard.locator('tbody tr')).toHaveCount(5);
 await expect(dashboard).not.toContainText('private-label');await expect(dashboard).not.toContainText('private-model');
 await dashboard.getByLabel('Trace',{exact:true}).selectOption(second.traceId);await expect(dashboard.getByLabel('Trace',{exact:true})).toHaveValue(second.traceId);
 await input.setInputFiles({name:'bad.jsonl',mimeType:'application/x-ndjson',buffer:Buffer.from('{bad')});await expect(dashboard.getByRole('alert')).toContainText('Import rejected');await expect(dashboard.locator('tbody tr')).toHaveCount(5);
 await dashboard.getByRole('button',{name:'Reset synthetic example'}).click();await expect(dashboard.getByRole('status')).toContainText('Synthetic example');await expect(dashboard.locator('tbody')).toContainText('agent.request');expect(remote).toEqual([]);
});
test('mobile layout and keyboard-operable dashboard controls',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');const dashboard=page.locator('#dashboard');const reset=dashboard.getByRole('button',{name:'Reset synthetic example'});await reset.focus();await expect(reset).toBeFocused();await page.keyboard.press('Enter');await expect(dashboard.getByRole('status')).toContainText('Synthetic example');await expect(dashboard.getByLabel('Status',{exact:true})).toBeEnabled();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
