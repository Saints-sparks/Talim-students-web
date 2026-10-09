import { expect, type Page } from "@playwright/test";

/**
 * The app opens a first-visit tour over each page (and dims it). Closes it if
 * it shows up within `waitMs`; the tour appears a moment after the page does.
 */
export async function dismissGuide(page: Page, waitMs = 5_000): Promise<void> {
  const close = page.getByRole("button", { name: "Close guide" });
  const shown = await close
    .waitFor({ state: "visible", timeout: waitMs })
    .then(() => true)
    .catch(() => false);
  // Escape closes the guide (useAppGuide); a click can miss when the card sits partly off a phone's screen.
  if (shown) await page.keyboard.press("Escape");
  if (await close.count()) await close.click({ force: true }).catch(() => undefined);
  await expect(close).toHaveCount(0);
}
