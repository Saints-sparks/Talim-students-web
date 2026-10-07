/**
 * @jest-environment node
 */
/**
 * Live contract check of My tickets (v1.5 §1) through this app's own
 * services, against a running API with the e2e seed (`talimBE-V2/e2e`).
 * Skipped unless `LIVE_API=1`:
 *
 *   LIVE_API=1 LIVE_DB=talim_v15_web NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5086 \
 *     npx jest __tests__/live/tickets
 *
 * The seeded student Ada raises one ticket to each desk with
 * `ticketsService`; the school admin and the platform admin answer with raw
 * requests (their consoles' side). Checks: create (with `context`, which the
 * requester never reads back), the list's `unread`, opening a ticket (unread
 * back to 0), a reply, reopen within 7 days, and 409 `REOPEN_WINDOW_PASSED`
 * and `TICKET_CLOSED` read from `reasonCode`. The reopen window is passed by
 * moving `resolvedAt` back 8 days in that API's database, through the backend
 * checkout's own `mongodb` driver (`LIVE_BACKEND_DIR`, default
 * `../talimBE-V2`). It writes to that database: point it at a throwaway
 * stack only.
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import type { ApiError } from "@/lib/apiError";
import type { Ticket, TicketDesk } from "@/types/tickets";

const LIVE = process.env.LIVE_API === "1";
const API = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
const PASSWORD = process.env.LIVE_PASSWORD ?? "Demo#Pass2026";
const DOMAIN = process.env.LIVE_DOMAIN ?? "e2e.talim.test";
const DB = process.env.LIVE_DB ?? "";
const BACKEND = resolve(process.env.LIVE_BACKEND_DIR ?? "../talimBE-V2");
const RUN = Date.now().toString(36);

/**
 * A request as a desk's console makes it, outside this app's services.
 *
 * @param method - The HTTP method.
 * @param path - The path under the API.
 * @param token - The bearer token, if any.
 * @param body - The JSON body, if any.
 * @returns The status and the body, unwrapped from `{ success, data }`.
 */
async function raw<T = Record<string, unknown>>(method: string, path: string, token?: string, body?: unknown): Promise<{ status: number; body: T }> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const parsed = await res.json().catch(() => null);
  const unwrapped = parsed && typeof parsed === "object" && "success" in parsed && "data" in parsed ? parsed.data : parsed;
  return { status: res.status, body: unwrapped as T };
}

/**
 * Signs a desk's staff member in.
 *
 * @param path - `/auth/login` or `/auth/admin-login`.
 * @param local - The part of the email before the `@`.
 * @returns The access token.
 */
async function staffToken(path: string, local: string): Promise<string> {
  const res = await raw<{ access_token: string }>("POST", path, undefined, { email: `${local}@${DOMAIN}`, password: PASSWORD });
  if (res.status >= 300) throw new Error(`${local} could not sign in: ${res.status}`);
  return res.body.access_token;
}

/**
 * Moves a resolved ticket's `resolvedAt` into the past, in the live API's
 * database, so the 7-day reopen window has passed.
 *
 * @param ticketId - The ticket.
 * @param days - How many days ago it was resolved.
 * @returns Nothing; throws when no resolved ticket was changed.
 */
function ageResolved(ticketId: string, days: number): void {
  if (!DB || ["talim_e2e", "talim_portals"].includes(DB)) throw new Error("Set LIVE_DB to the throwaway stack's database.");
  const script = `const { MongoClient, ObjectId } = require(${JSON.stringify(`${BACKEND}/node_modules/mongodb`)});
(async () => {
  const client = await MongoClient.connect(process.env.LIVE_MONGO);
  const res = await client.db().collection("complaints").updateOne(
    { _id: new ObjectId(process.env.LIVE_ID), status: "resolved" },
    { $set: { resolvedAt: new Date(Date.now() - Number(process.env.LIVE_DAYS) * 864e5) } },
  );
  await client.close();
  if (res.modifiedCount !== 1) { console.error("no resolved ticket aged"); process.exit(1); }
})().catch((error) => { console.error(error); process.exit(1); });`;
  execFileSync(process.execPath, ["-e", script], {
    env: { ...process.env, LIVE_MONGO: `mongodb://127.0.0.1:27017/${DB}?replicaSet=rs0&directConnection=true`, LIVE_ID: ticketId, LIVE_DAYS: String(days) },
    stdio: "pipe",
  });
}

/**
 * What a promise rejected with.
 *
 * @param promise - The call.
 * @returns The error it threw.
 */
async function failure(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    return error as ApiError;
  }
  throw new Error("expected the call to fail");
}

const describeLive = LIVE ? describe : describe.skip;

describeLive("v1.5 My tickets against the live API (student)", () => {
  jest.setTimeout(30_000);
  /** The app's modules, loaded once the environment is set. */
  const load = () => ({
    auth: require("@/services/auth.service").authService,
    tickets: require("@/services/tickets.service").ticketsService as typeof import("@/services/tickets.service").ticketsService,
    rules: require("@/lib/support/tickets") as typeof import("@/lib/support/tickets"),
    session: require("@/lib/session").sessionStore,
    appVersion: (require("@/lib/appInfo") as typeof import("@/lib/appInfo")).APP_VERSION,
  });
  let s: ReturnType<typeof load>;
  let studentId = "";
  const desks: Record<TicketDesk, { token: string; ticket?: Ticket }> = { school: { token: "" }, talim: { token: "" } };

  beforeAll(async () => {
    s = load();
    const login = await s.auth.login({ email: `ada.student@${DOMAIN}`, password: PASSWORD, deviceToken: "web-token", platform: "web" });
    const introspected = await s.auth.introspect(login.access_token);
    s.session.set(introspected.user, login.access_token);
    studentId = String(introspected.user.userId);
    desks.school.token = await staffToken("/auth/login", "admin");
    desks.talim.token = await staffToken("/auth/admin-login", "platform");
  });

  it.each(["school", "talim"] as const)("raises a ticket to the %s desk with context, which only the desk reads", async (desk) => {
    const context = s.rules.ticketContext(s.appVersion, { path: "/settings?tab=help", userAgent: "jest-live (Talim Students)" });
    const created = await s.tickets.create({ desk, area: "timetable", subject: `Live ${desk} ${RUN}`, body: "Two lessons at 10:00.", context });
    expect(created).toMatchObject({ desk, status: "open", access: "requester", unread: 0, messageCount: 1, context: null });
    expect(created.requester.id).toBe(studentId);
    expect(created.reference).toMatch(desk === "talim" ? /^TS-/ : /^TCKT-/);
    const seen = await raw<Ticket>("GET", `/tickets/${created.id}`, desks[desk].token);
    expect(seen.body.context).toEqual({ path: "/settings?tab=help", appVersion: s.appVersion, userAgent: "jest-live (Talim Students)" });
    desks[desk].ticket = created;
  });

  it.each(["school", "talim"] as const)("lists %s-desk replies as unread, and opening the ticket clears them", async (desk) => {
    const { token, ticket } = desks[desk];
    const id = ticket!.id;
    expect((await raw("POST", `/tickets/${id}/messages`, token, { body: "Which day is it?" })).status).toBe(201);
    expect((await raw("POST", `/tickets/${id}/messages`, token, { body: "Internal note.", internal: true })).status).toBe(201);
    const row = (await s.tickets.listMine({ page: 1, limit: 50 })).data.find((item) => item.id === id);
    expect(row).toMatchObject({ unread: 1, messageCount: 2, status: "in_progress" });
    expect(s.rules.unreadLabel(row!)).toBe("1 new");
    const opened = await s.tickets.get(id);
    expect(opened.messages.map((message) => message.body)).toEqual(["Two lessons at 10:00.", "Which day is it?"]);
    expect((await s.tickets.listMine({ page: 1, limit: 50 })).data.find((item) => item.id === id)?.unread).toBe(0);
  });

  it.each(["school", "talim"] as const)("replies on the %s ticket, and reopens it within 7 days", async (desk) => {
    const { token, ticket } = desks[desk];
    const replied = await s.tickets.reply(ticket!.id, { body: "Wednesday." });
    expect(replied.messageCount).toBe(3);
    expect(replied.messages.at(-1)?.author.id).toBe(studentId);
    expect((await raw("PATCH", `/tickets/${ticket!.id}`, token, { status: "resolved" })).status).toBe(200);
    const resolved = await s.tickets.get(ticket!.id);
    expect(s.rules.canReopen(resolved)).toBe(true);
    expect((await s.tickets.reopen(ticket!.id)).status).toBe("open");
  });

  it.each(["school", "talim"] as const)("answers 409 REOPEN_WINDOW_PASSED and TICKET_CLOSED on the %s ticket", async (desk) => {
    const { token, ticket } = desks[desk];
    const id = ticket!.id;
    expect((await raw("PATCH", `/tickets/${id}`, token, { status: "resolved" })).status).toBe(200);
    ageResolved(id, 8);
    const stale = await s.tickets.get(id);
    expect(s.rules.canReopen(stale)).toBe(false);
    const reopen = await failure(s.tickets.reopen(id));
    expect([reopen.status, reopen.reasonCode]).toEqual([409, "REOPEN_WINDOW_PASSED"]);
    expect(s.rules.conflictMessage(reopen, "reopen", stale)).toBe(s.rules.reopenExpiredText(stale.reference));
    const reply = await failure(s.tickets.reply(id, { body: "Still wrong." }));
    expect([reply.status, reply.reasonCode]).toEqual([409, "REOPEN_WINDOW_PASSED"]);
    const closed = await s.tickets.close(id);
    expect(closed.status).toBe("closed");
    const late = await failure(s.tickets.reply(id, { body: "One more thing." }));
    expect([late.status, late.reasonCode]).toEqual([409, "TICKET_CLOSED"]);
    expect(s.rules.conflictMessage(late, "reply", closed)).toBe(s.rules.CLOSED_TICKET_TEXT);
  });
});
