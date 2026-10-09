import { test as setup, expect } from "@playwright/test";
import { ACCOUNTS, authFile } from "./support/creds";
import { apiLogin } from "./support/api";
import { signInThroughUi, skipOnboarding, subOf } from "./support/auth";

/** Signs Ada in once (onboarding marked dismissed) and stores the session for the other specs. */
setup("sign in student", async ({ page }) => {
  await signInThroughUi(page, ACCOUNTS.student);
  await expect(page).toHaveURL(/\/(onboarding|dashboard)/, { timeout: 60_000 });
  await skipOnboarding(page, subOf(await apiLogin(ACCOUNTS.student)));
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 60_000 });
  await page.context().storageState({ path: authFile("student") });
});
