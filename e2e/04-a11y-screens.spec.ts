import fs from "node:fs";
import { test, expect } from "./support/fixtures";
import { THEME_KEY, authFile } from "./support/creds";
import { STUDENT_SCREENS } from "./support/pages";
import { dismissGuide } from "./support/ui";
import { axeFindings } from "./support/axe";

/**
 * Every student screen (plus a subject's page and the Help tab) in both
 * themes: axe WCAG 2.1 A/AA (e2e/reports/axe-screens.json) and a full-page
 * screenshot into e2e/screenshots/<desktop-light|desktop-dark|mobile>/
 * (gitignored). Any axe violation fails the theme's test, listed by page.
 */
test.use({ storageState: authFile("student") });

for (const theme of ["light", "dark"] as const) {
  test(`axe and screenshots, ${theme}`, async ({ page }) => {
    test.setTimeout(600_000);
    await page.emulateMedia({ colorScheme: theme });
    await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [THEME_KEY, theme] as const);
    const dir = `e2e/screenshots/desktop-${theme}`;
    fs.mkdirSync(dir, { recursive: true });

    await page.goto("/subjects");
    const subject = await page.locator('a[href^="/subjects/"]').first().getAttribute("href");
    const routes = [
      ...STUDENT_SCREENS.map((s) => ({ path: s.path, slug: s.slug, content: s.content })),
      ...(subject ? [{ path: subject, slug: "subject-detail", content: /./ }] : []),
      { path: "/settings?tab=help", slug: "settings-help", content: /My tickets/ },
    ];
    const failures: string[] = [];
    for (const route of routes) {
      await page.goto(route.path);
      await expect(page.locator(".animate-pulse:visible")).toHaveCount(0, { timeout: 30_000 });
      await expect(page.getByText(route.content).filter({ visible: true }).first()).toBeVisible();
      await dismissGuide(page, 2_000);
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
      await page.waitForTimeout(600);
      expect(await page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(theme === "dark");
      await page.screenshot({ path: `${dir}/${route.slug}.png`, fullPage: true });
      const label = `${route.slug} (${theme})`;
      for (const f of await axeFindings(page, label, "screens")) failures.push(`${label}: ${f.rule} [${f.impact}] ${f.targets.join(" | ")}`);
    }
    expect(failures).toEqual([]);
  });
}

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("screenshots, mobile light", async ({ page }) => {
    test.setTimeout(300_000);
    await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [THEME_KEY, "light"] as const);
    fs.mkdirSync("e2e/screenshots/mobile", { recursive: true });
    for (const screen of STUDENT_SCREENS) {
      await page.goto(screen.path);
      await expect(page.locator(".animate-pulse:visible")).toHaveCount(0, { timeout: 30_000 });
      await expect(page.getByText(screen.content).filter({ visible: true }).first()).toBeVisible();
      await dismissGuide(page, 2_000);
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
      await page.waitForTimeout(600);
      // No sideways scrolling on a phone: neither the page nor the layout viewport may grow past 390px
      // (Chrome widens the layout viewport to fit overflowing content, so innerWidth alone hides it).
      const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - 390);
      expect(overflow, `${screen.path} scrolls sideways by ${overflow}px`).toBeLessThanOrEqual(1);
      await page.screenshot({ path: `e2e/screenshots/mobile/${screen.slug}.png`, fullPage: true });
    }
  });
});
