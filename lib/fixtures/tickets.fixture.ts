/**
 * Fixture support tickets (v1.5 §1) for dev and the tests: an in-memory
 * store seeded with four tickets (waiting on the student with one unread
 * reply, open, resolved two days ago, resolved ten days ago), typed with the
 * generated `TicketDto` so a contract change fails the type-check here too.
 * It answers like the API: opening or writing on a ticket marks it read; 409
 * with the API's reason at the top-level `code` (`TICKET_CLOSED`,
 * `REOPEN_WINDOW_PASSED`, `MESSAGE_CAP`, `INVALID_TRANSITION`). Loaded only
 * through `fixturesEnabled()` (dev) or by tests.
 */
import { ApiError } from "@/lib/apiError";
import { MAX_TICKET_ATTACHMENTS, TICKET_MESSAGE_CAP, canReopen } from "@/lib/support/tickets";
import {
  TICKET_REOPEN_WINDOW_DAYS,
  type CreateTicketPayload,
  type MyTicketsQuery,
  type PostTicketMessagePayload,
  type Ticket,
  type TicketMessage,
  type TicketPage,
  type TicketSummary,
} from "@/types/tickets";

/** The fixture student's user id. */
export const FIXTURE_REQUESTER_ID = "user-fixture-student";

/** The fixture student's school. */
export const FIXTURE_SCHOOL_ID = "school-easy-sparks";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const SCHOOL = { id: FIXTURE_SCHOOL_ID, name: "Easy Sparks College" };
const ME = { id: FIXTURE_REQUESTER_ID, name: "Musa Adele", role: "student" };

/**
 * An ISO time some milliseconds before `now`.
 *
 * @param now - The reference time.
 * @param ms - How long before.
 * @returns The ISO string.
 */
function ago(now: Date, ms: number): string {
  return new Date(now.getTime() - ms).toISOString();
}

/**
 * One public message, from the student or a member of staff.
 *
 * @param id - Its id.
 * @param from - "me", or the staff member's name and role.
 * @param body - The text.
 * @param createdAt - When.
 * @returns The message.
 */
function message(id: string, from: "me" | { name: string; role: "admin" | "school_admin" }, body: string, createdAt: string): TicketMessage {
  const author = from === "me" ? { ...ME } : { id: `staff-${from.role}`, name: from.name, role: from.role };
  return { id, author, body, attachments: [], internal: false, createdAt };
}

/**
 * A full ticket as the API answers it to its requester, from the fields
 * that differ between tickets.
 *
 * @param fields - What differs.
 * @returns The ticket.
 */
function ticket(fields: Pick<Ticket, "id" | "reference" | "desk" | "area" | "subject" | "status" | "createdAt" | "lastActivityAt" | "messages"> & Partial<Ticket>): Ticket {
  const resolvedAt = fields.resolvedAt ?? null;
  return {
    priority: "normal",
    school: SCHOOL,
    childId: null,
    child: null,
    assignee: null,
    escalatedFrom: null,
    access: "requester",
    firstResponseAt: null,
    resolvedAt,
    closedAt: null,
    reopenableUntil: fields.status === "resolved" && resolvedAt ? new Date(Date.parse(resolvedAt) + TICKET_REOPEN_WINDOW_DAYS * DAY_MS).toISOString() : null,
    escalatedAt: null,
    context: null,
    requester: { ...ME },
    messageCount: fields.messages.length,
    unread: 0,
    ...fields,
  };
}

/**
 * The four seeded tickets, times relative to `now`.
 *
 * @param now - The reference time.
 * @returns The tickets, newest activity first.
 */
export function seedTickets(now: Date = new Date()): Ticket[] {
  return [
    ticket({
      id: "ticket-waiting",
      reference: "TS-4K7QM",
      desk: "talim",
      area: "signing_in",
      subject: "Signed out every time I close the tab",
      status: "waiting_on_user",
      firstResponseAt: ago(now, 3 * HOUR_MS),
      lastActivityAt: ago(now, 3 * HOUR_MS),
      createdAt: ago(now, 26 * HOUR_MS),
      unread: 1,
      messages: [
        message("m-w1", "me", "Each time I close the tab and come back I have to sign in again.", ago(now, 26 * HOUR_MS)),
        message("m-w2", { name: "Amaka Obi", role: "admin" }, "Thanks, Musa. Which browser are you using, and is it in private mode?", ago(now, 3 * HOUR_MS)),
      ],
    }),
    ticket({
      id: "ticket-open",
      reference: "TCKT-20260142",
      desk: "school",
      area: "timetable",
      subject: "Two lessons at 10:00 on Wednesday",
      status: "open",
      lastActivityAt: ago(now, 5 * HOUR_MS),
      createdAt: ago(now, 5 * HOUR_MS),
      messages: [message("m-o1", "me", "My timetable shows Biology and French both at 10:00 on Wednesday.", ago(now, 5 * HOUR_MS))],
    }),
    ticket({
      id: "ticket-resolved",
      reference: "TCKT-20260131",
      desk: "school",
      area: "results",
      subject: "Biology total shows blank",
      status: "resolved",
      firstResponseAt: ago(now, 3 * DAY_MS),
      resolvedAt: ago(now, 2 * DAY_MS),
      lastActivityAt: ago(now, 2 * DAY_MS),
      createdAt: ago(now, 4 * DAY_MS),
      messages: [
        message("m-r1", "me", "My Biology total is blank on the report card.", ago(now, 4 * DAY_MS)),
        message("m-r2", { name: "Mrs Funmi Bello", role: "school_admin" }, "Your teacher has published the exam score. The total shows now.", ago(now, 2 * DAY_MS)),
      ],
    }),
    ticket({
      id: "ticket-old",
      reference: "TS-9PX2D",
      desk: "talim",
      area: "messages",
      subject: "Voice notes do not play",
      status: "resolved",
      firstResponseAt: ago(now, 11 * DAY_MS),
      resolvedAt: ago(now, 10 * DAY_MS),
      lastActivityAt: ago(now, 10 * DAY_MS),
      createdAt: ago(now, 12 * DAY_MS),
      messages: [
        message("m-x1", "me", "Voice notes in my class group show 0:00 and do not play.", ago(now, 12 * DAY_MS)),
        message("m-x2", { name: "Amaka Obi", role: "admin" }, "Fixed in today's update. Refresh the page and they will play.", ago(now, 10 * DAY_MS)),
      ],
    }),
  ];
}

/**
 * A ticket's list row: everything but the detail-only fields.
 *
 * @param stored - The ticket.
 * @returns The summary.
 */
function summaryOf(stored: Ticket): TicketSummary {
  const { messages: _messages, reopenableUntil: _until, escalatedAt: _escalatedAt, context: _context, ...summary } = stored;
  return summary;
}

/**
 * The API's 404 for a ticket that is not the student's.
 *
 * @returns The error.
 */
function notFound(): ApiError {
  return new ApiError("NOT_FOUND", "We couldn't find that ticket.", 404);
}

/**
 * The API's 409, its reason at the top-level `code`.
 *
 * @param reason - e.g. `TICKET_CLOSED`.
 * @returns The error.
 */
function conflict(reason: string): ApiError {
  return new ApiError("CONFLICT", "", 409, [], undefined, reason);
}

/** The store's calls, one per route. */
export interface TicketFixtureStore {
  listMine(query?: MyTicketsQuery): TicketPage;
  get(id: string): Ticket;
  create(payload: CreateTicketPayload): Ticket;
  reply(id: string, payload: PostTicketMessagePayload): Ticket;
  reopen(id: string): Ticket;
  close(id: string): Ticket;
  reset(): void;
}

/**
 * A fresh in-memory store.
 *
 * @param clock - The current time (tests pin it).
 * @returns The store.
 */
export function createTicketStore(clock: () => Date = () => new Date()): TicketFixtureStore {
  let tickets = seedTickets(clock());
  let counter = 0;

  const find = (id: string): Ticket => {
    const found = tickets.find((item) => item.id === id);
    if (!found) throw notFound();
    return found;
  };

  const copy = (stored: Ticket): Ticket => JSON.parse(JSON.stringify(stored)) as Ticket;

  /** Puts a ticket back in the queue, as a requester's reply or reopen does. */
  const backToQueue = (stored: Ticket) => {
    stored.status = stored.assignee ? "in_progress" : "open";
    stored.resolvedAt = null;
    stored.reopenableUntil = null;
  };

  return {
    listMine(query = {}) {
      const limit = query.limit ?? 20;
      const page = query.page ?? 1;
      const matching = tickets
        .filter((item) => !query.status || item.status === query.status)
        .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
      const lastPage = Math.max(1, Math.ceil(matching.length / limit));
      return {
        data: matching.slice((page - 1) * limit, page * limit).map((item) => summaryOf(copy(item))),
        meta: { total: matching.length, page, lastPage, limit },
      };
    },

    get(id) {
      const stored = find(id);
      stored.unread = 0;
      return copy(stored);
    },

    create(payload) {
      counter += 1;
      const now = clock().toISOString();
      const id = `ticket-new-${counter}`;
      const created = ticket({
        id,
        reference: payload.desk === "talim" ? `TS-NEW${counter}` : `TCKT-2026090${counter}`,
        desk: payload.desk,
        childId: payload.childId ?? null,
        area: payload.area,
        subject: payload.subject.trim(),
        status: "open",
        lastActivityAt: now,
        createdAt: now,
        messages: [
          {
            id: `${id}-m1`,
            author: { ...ME },
            body: payload.body.trim(),
            attachments: (payload.attachments ?? []).slice(0, MAX_TICKET_ATTACHMENTS),
            internal: false,
            createdAt: now,
          },
        ],
      });
      tickets = [created, ...tickets];
      return copy(created);
    },

    reply(id, payload) {
      const stored = find(id);
      if (stored.status === "closed") throw conflict("TICKET_CLOSED");
      if (stored.status === "resolved" && !canReopen(stored, clock())) throw conflict("REOPEN_WINDOW_PASSED");
      if (stored.messages.length >= TICKET_MESSAGE_CAP) throw conflict("MESSAGE_CAP");
      const now = clock().toISOString();
      stored.messages.push({
        id: `${id}-m${stored.messages.length + 1}`,
        author: { ...ME },
        body: payload.body.trim(),
        attachments: (payload.attachments ?? []).slice(0, MAX_TICKET_ATTACHMENTS),
        internal: false,
        createdAt: now,
      });
      stored.messageCount = stored.messages.length;
      if (stored.status === "waiting_on_user" || stored.status === "resolved") backToQueue(stored);
      stored.lastActivityAt = now;
      stored.unread = 0;
      return copy(stored);
    },

    reopen(id) {
      const stored = find(id);
      if (stored.status !== "resolved") throw conflict("INVALID_TRANSITION");
      if (!canReopen(stored, clock())) throw conflict("REOPEN_WINDOW_PASSED");
      backToQueue(stored);
      stored.lastActivityAt = clock().toISOString();
      stored.unread = 0;
      return copy(stored);
    },

    close(id) {
      const stored = find(id);
      if (stored.status === "closed") return copy(stored);
      const now = clock().toISOString();
      stored.status = "closed";
      stored.closedAt = now;
      stored.reopenableUntil = null;
      stored.lastActivityAt = now;
      stored.unread = 0;
      return copy(stored);
    },

    reset() {
      tickets = seedTickets(clock());
      counter = 0;
    },
  };
}

/** The store dev mode answers from (one per page load). */
export const fixtureTicketStore = createTicketStore();
