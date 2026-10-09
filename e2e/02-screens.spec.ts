import { test, expect, type Allowed } from "./support/fixtures";
import { authFile } from "./support/creds";
import { STUDENT_SCREENS } from "./support/pages";
import { dismissGuide } from "./support/ui";

/**
 * Every student screen loads for Ada: its heading and seeded content, no
 * skeleton left, and no uncaught error, console.error or failed API call.
 * Subjects opens a subject's page.
 */
const ALLOW: readonly Allowed[] = [
  { kind: "external", match: /fonts\.googleapis\.com|fonts\.gstatic\.com/, reason: "Google Fonts are blocked by the harness; the system font is used." },
];

test.use({ storageState: authFile("student") });

for (const screen of STUDENT_SCREENS) {
  test(`${screen.path} loads`, async ({ page, monitor }) => {
    monitor.clear();
    await page.goto(screen.path);
    await expect(page.locator(".animate-pulse:visible")).toHaveCount(0, { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1, name: screen.heading })).toBeVisible();
    await expect(page.getByText(screen.content).filter({ visible: true }).first()).toBeVisible();
    await dismissGuide(page, 2_000);
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
    expect(monitor.unexpected(ALLOW), `unexpected findings on ${screen.path}`).toEqual([]);
  });
}

test("a subject's page opens from Subjects", async ({ page, monitor }) => {
  monitor.clear();
  await page.goto("/subjects");
  await dismissGuide(page, 2_000);
  const link = page.locator('a[href^="/subjects/"]').filter({ hasText: "Mathematics" }).first();
  await link.click();
  await expect(page).toHaveURL(/\/subjects\/[a-f0-9]{24}/);
  await expect(page.locator(".animate-pulse:visible")).toHaveCount(0, { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1, name: /Mathematics/ })).toBeVisible();
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
  expect(monitor.unexpected(ALLOW)).toEqual([]);
});
