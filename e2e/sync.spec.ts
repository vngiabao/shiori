import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("mocked cloud consent, text opt-in and account controls preserve the settings design", async ({
  page,
}) => {
  await page.route("**/src/auth.ts*", async (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `
 let user=null; let notify=()=>{}; let state={revision:0,epoch:'local-test',deleted:false,schema_version:1,rows:[]};
 window.__cloud=state;
 export const authConfigured=true;
 export const emailConfigured=true;
 export async function currentAccount(){return user;}
 export function oauthConfigured(){return false;}
 export async function sendEmailCode(email){window.__email=email;}
 export async function verifyEmailCode(email,token){user={id:'test-user',email,name:'Test',provider:'email'};notify('SIGNED_IN');return user;}
 export async function signInWith(){throw new Error('Google is mocked in this test.');}
 export async function signOut(){user=null;notify('SIGNED_OUT');}
 export async function supabase(){return {auth:{onAuthStateChange(fn){notify=fn;return {data:{subscription:{unsubscribe(){}}}};}},rpc(name,p){return {abortSignal:async()=>{if(name==='shiori_sync_pull')return {data:{...state,next:null},error:null};if(name==='shiori_sync_push'){const m=new Map(state.rows.map(r=>[r.kind+':'+r.id,r]));for(const r of p.p_rows)m.set(r.kind+':'+r.id,r);state={...state,revision:state.revision+1,rows:[...m.values()]};window.__cloud=state;return {data:state,error:null};}throw new Error('Unexpected RPC');}};}};}
 `,
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Start without an account" }).click();
  await page.getByLabel("What should Violetto call you?").fill("Reader");
  await page.getByRole("button", { name: "Open my first letter" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next letter is ready." }),
  ).toBeVisible();
  await page.goto("/#settings");
  await page.getByLabel("Email address").fill("reader@example.test");
  await page.getByRole("button", { name: "Send sign-in email" }).click();
  await page.getByLabel("Email code").fill("123456");
  await page.getByRole("button", { name: "Verify code" }).click();
  await expect(
    page.getByRole("button", { name: "Add this device’s progress" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __cloud: { rows: unknown[] } }).__cloud.rows
          .length,
    ),
  ).toBe(0);
  await page
    .locator(".sync-panel")
    .screenshot({ path: "output/sync-consent-desktop.png" });
  await page.getByRole("button", { name: "Keep on this device" }).click();
  await expect(page.getByText("Kept on this device. Nothing will be uploaded until you enable sync.", {exact:true})).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Send sign-in email" }),
  ).toBeVisible();
  await page.getByLabel("Email address").fill("reader@example.test");
  await page.getByRole("button", { name: "Send sign-in email" }).click();
  await page.getByLabel("Email code").fill("123456");
  await page.getByRole("button", { name: "Verify code" }).click();
  await expect(
    page.getByText("Cloud sync is paused. Local learning still works.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Add this device’s progress" })
    .click();
  await expect(
    page.getByText("Your progress is synced.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("checkbox", {
      name: "Also sync personal text",
      exact: false,
    }),
  ).not.toBeChecked();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.locator(".sync-panel").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "output/sync-settings-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Send sign-in email" }),
  ).toBeVisible();
});
