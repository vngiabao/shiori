import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const choice of ["undecided", "enabled", "paused"] as const) {
  test(`signed-in welcome enters study and preserves ${choice} sync consent`, async ({
    page,
  }) => {
    test.skip(
      !!process.env.APP_URL && new URL(process.env.APP_URL).port !== "5174",
      "This isolated auth fixture runs only on the dev server; it does not use real credentials.",
    );
    await page.route("**/src/auth.ts*", (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: `
        const user={id:'welcome-test-user',email:'reader@example.test',name:'Reader',provider:'google'};
        let state={revision:0,epoch:'welcome-test',deleted:false,schema_version:1,rows:[]};
        export const authConfigured=true;
        export const emailConfigured=false;
        export async function currentAccount(){return user;}
        export function oauthConfigured(){return true;}
        export async function sendEmailCode(){throw new Error('Unexpected email sign-in');}
        export async function verifyEmailCode(){throw new Error('Unexpected email sign-in');}
        export async function signInWith(){throw new Error('Already signed in');}
        export async function signOut(){throw new Error('Continuing must not sign out');}
        export async function supabase(){return {
          auth:{onAuthStateChange(){return {data:{subscription:{unsubscribe(){}}}};}},
          rpc(name,p){return {abortSignal:async()=>{
            if(name==='shiori_sync_pull')return {data:{...state,next:null},error:null};
            if(name==='shiori_sync_push'){
              const m=new Map(state.rows.map(r=>[r.kind+':'+r.id,r]));
              for(const r of p.p_rows)m.set(r.kind+':'+r.id,r);
              state={...state,revision:state.revision+1,rows:[...m.values()]};
              return {data:state,error:null};
            }
            throw new Error('Unexpected RPC');
          }};}
        };}
      `,
      }),
    );
    await page.goto("/");
    const proceed = page.getByRole("button", {
      name: "Continue to study",
      exact: true,
    });
    await expect(proceed).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Start without an account",
        exact: true,
      }),
    ).toHaveCount(0);
    if (choice !== "undecided") {
      await page.getByText("Cloud sync options", { exact: true }).click();
      await page
        .getByRole("button", {
          name: "Add this device’s progress",
          exact: true,
        })
        .click();
      await expect(
        page.getByText("Your progress is synced.", { exact: true }),
      ).toBeVisible();
      if (choice === "paused") {
        await page
          .getByRole("button", { name: "Keep on this device", exact: true })
          .click();
        await expect(
          page.getByText(
            "Kept on this device. Nothing will be uploaded until you enable sync.",
            { exact: true },
          ),
        ).toBeVisible();
        await page.getByText("Cloud sync options", { exact: true }).click();
      }
    }
    if (choice === "paused") {
      await page.evaluate(async () => {
        await document.fonts.ready;
        const art = document.querySelector<HTMLElement>(".mascot");
        const src =
          art &&
          getComputedStyle(art).backgroundImage.match(
            /url\(["']?(.*?)["']?\)/,
          )?.[1];
        if (src) {
          const image = new Image();
          image.src = src;
          await image.decode();
        }
      });
      await page.screenshot({
        path: "output/signed-in-welcome-desktop.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 375, height: 812 });
      await page.screenshot({
        path: "output/signed-in-welcome-mobile.png",
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
    await proceed.click();
    await page.getByLabel("What should Violetto call you?").fill("Reader");
    await page.getByRole("radio", { name: /Kana first/ }).check();
    await page
      .getByRole("button", { name: "Open my first letter", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Your next letter is ready." }),
    ).toBeVisible();
    await page.goto("/#settings");
    await expect(
      page.getByText("Signed in as reader@example.test", { exact: true }),
    ).toBeVisible();
    const saved = await page.evaluate(async () => {
      const modulePath = "/src/db.ts";
      const { db } = await import(modulePath);
      return {
        sync: await db.syncState.get("local"),
        profile: await db.profiles.get("local"),
      };
    });
    expect(saved.sync.enabled).toBe(choice === "enabled");
    expect(saved.sync.includeText ?? false).toBe(false);
    expect(saved.profile.path).toBe("kana");
    expect(saved.profile.name).toBe("Reader");
  });
}
