import { test, expect, type Allowed } from "./support/fixtures";
import { ACCOUNTS } from "./support/creds";
import { signInThroughUi } from "./support/auth";

/**
 * Signing in to the Students portal: Ada lands on onboarding (first run on this
 * browser) or Today; a teacher and a parent are refused with "Access denied"
 * and stay on /signin.
 */
const REFUSED: readonly Allowed[] = [
  { kind: "external", match: /fonts\.googleapis\.com|fonts\.gstatic\.com/, reason: "Google Fonts are blocked by the harness; the system font is used." },
  { kind: "http", match: /POST \/auth\/login -> 40[13]/, reason: "The refused sign-in is the point of the test." },
  { kind: "http", match: /POST \/auth\/refresh -> 401/, reason: "A signed-out visit tries the refresh cookie once; there is none." },
  { kind: "console.error", match: /403|401|Access denied|registered as/i, reason: "The client logs the refused sign-in." },
];

test("a student signs in", async ({ page, monitor }) => {
  monitor.clear();
  await signInThroughUi(page, ACCOUNTS.student);
  await expect(page).toHaveURL(/\/(onboarding|dashboard)/, { timeout: 60_000 });
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  expect(monitor.unexpected(REFUSED.filter((a) => !/login/.test(a.match.source)))).toEqual([]);
});

for (const key of ["teacher", "parent"] as const) {
  test(`a ${key} is refused`, async ({ page, monitor }) => {
    monitor.clear();
    await signInThroughUi(page, ACCOUNTS[key]);
    await expect(page.getByRole("alert").filter({ hasText: "Access denied" })).toBeVisible();
    await expect(page).toHaveURL(/\/signin/);
    expect(monitor.unexpected(REFUSED)).toEqual([]);
  });
}
