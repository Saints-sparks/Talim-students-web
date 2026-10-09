import type { Page } from "@playwright/test";
import { test, expect, type Allowed } from "./support/fixtures";
import { ACCOUNTS, authFile } from "./support/creds";
import { apiCall, apiLogin, unwrap } from "./support/api";
import { dismissGuide } from "./support/ui";

/**
 * My tickets (Settings → Help, v1.5 §1) through the student's UI: raise a
 * ticket to the school, find it in the list, see the school's reply arrive as
 * "1 new", and reply from the thread. Each run makes its own "E2E <run>" ticket.
 */
const RUN = Date.now().toString(36).slice(-5);
const ALLOW: readonly Allowed[] = [];

interface Ticket {
  id: string;
  reference: string;
  desk: string;
  messages: { body: string }[];
}

test.use({ storageState: authFile("student") });
test.describe.configure({ mode: "serial" });

let ticket: Ticket;
const subject = `E2E ${RUN}: my Basic Science total is blank`;

/** Opens Settings → Help and waits for My tickets. */
async function openHelp(page: Page): Promise<void> {
  const loaded = page.waitForResponse((r) => /\/tickets\/mine(\?|$)/.test(r.url()) && r.ok());
  await page.goto("/settings?tab=help");
  await loaded;
  await dismissGuide(page, 2_000);
  await expect(page.locator(".animate-pulse:visible")).toHaveCount(0, { timeout: 30_000 });
}

test("raise a ticket to the school; it is listed", async ({ page, monitor }) => {
  monitor.clear();
  await openHelp(page);
  await page.getByRole("button", { name: "New ticket" }).first().click();
  const sheet = page.getByRole("dialog", { name: "How can we help?" });
  await sheet.getByRole("radiogroup", { name: "Who should help?" }).getByRole("radio", { name: /^My school/ }).click();
  await sheet.getByRole("radiogroup", { name: "What is it about?" }).getByRole("radio", { name: "Results" }).click();
  await sheet.getByLabel("Subject").fill(subject);
  await sheet.getByLabel("Message").fill("My Basic Science total shows a dash on the Results page.");
  const sent = page.waitForResponse((r) => /\/tickets$/.test(r.url()) && r.request().method() === "POST");
  await sheet.getByRole("button", { name: "Send ticket" }).click();
  const res = await sent;
  expect(res.status()).toBe(201);
  ticket = unwrap<Ticket>(await res.json());
  expect(res.request().postDataJSON()).toMatchObject({ desk: "school", area: "results", subject });

  const thread = page.getByRole("dialog", { name: subject });
  await expect(thread).toContainText(ticket.reference);
  await page.keyboard.press("Escape");
  await expect(thread).toHaveCount(0);
  await expect(page.getByRole("list", { name: "My tickets" })).toContainText(subject);
  expect(monitor.unexpected(ALLOW)).toEqual([]);
});

test("the school's reply shows as new; the student replies", async ({ page, monitor }) => {
  const admin = await apiLogin(ACCOUNTS.schoolAdmin);
  const staffReply = `E2E ${RUN}: thanks Ada, your teacher is entering the scores.`;
  await apiCall(admin, "POST", `/tickets/${ticket.id}/messages`, { body: staffReply });

  monitor.clear();
  await openHelp(page);
  const row = page.getByRole("list", { name: "My tickets" }).getByRole("listitem").filter({ hasText: subject });
  await expect(row).toContainText("1 new");
  await row.getByRole("button").first().click();
  const thread = page.getByRole("dialog", { name: subject });
  await expect(thread.getByRole("list", { name: "Messages" })).toContainText(staffReply);

  const mine = `E2E ${RUN}: thank you!`;
  await thread.getByLabel("Your reply").fill(mine);
  const posted = page.waitForResponse((r) => r.url().endsWith(`/tickets/${ticket.id}/messages`) && r.request().method() === "POST");
  await thread.getByRole("button", { name: "Send reply" }).click();
  expect((await posted).status()).toBe(201);
  await expect(thread.getByRole("list", { name: "Messages" })).toContainText(mine);

  const seen = await apiCall<Ticket>(admin, "GET", `/tickets/${ticket.id}`);
  expect(seen.messages.map((m) => m.body)).toEqual(expect.arrayContaining([staffReply, mine]));
  expect(monitor.unexpected(ALLOW)).toEqual([]);
});
