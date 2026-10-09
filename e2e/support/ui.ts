import { expect, type Page } from "@playwright/test";

/**
 * The app opens a first-visit tour over each page (and dims it). Closes it if
 * it shows up within `waitMs`; the tour appears a moment after the page does.
 */
export async function dismissGuide(page: Page, waitMs = 5_000): Promise<void> {
  const close = page.getByRole("button", { name: "Close guide" });
  await close
    .waitFor({ state: "visible", timeout: waitMs })
    .then(() => close.click())
    .catch(() => undefined);
  await expect(close).toHaveCount(0);
}
