import { expect, type Page } from "@playwright/test";
import type { Account } from "./creds";

/** Signs in through the real form at /signin (with "Keep me signed in"). */
export async function signInThroughUi(page: Page, account: Pick<Account, "email" | "password">): Promise<void> {
  await page.goto("/signin");
  await page.locator("#identifier").fill(account.email);
  await page.locator("#password").fill(account.password);
  await page.getByLabel("Keep me signed in").check();
  await page.getByRole("button", { name: "Sign in" }).click();
}

/** The user id in an access token (`sub`). */
export function subOf(token: string): string {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")).sub as string;
}

/**
 * Marks the first-run setup as dismissed on this browser, as "Skip for now"
 * would, so sign-in goes to Today instead of /onboarding.
 */
export async function skipOnboarding(page: Page, userId: string): Promise<void> {
  await page.evaluate((id) => {
    const key = `student_onboarding_${id}`;
    const prior = JSON.parse(localStorage.getItem(key) ?? "{}");
    localStorage.setItem(key, JSON.stringify({ ...prior, setupDismissed: true }));
  }, userId);
  await expect.poll(() => page.evaluate((id) => localStorage.getItem(`student_onboarding_${id}`), userId)).toContain("setupDismissed");
}
