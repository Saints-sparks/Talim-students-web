/**
 * Fixture support tickets (v1.5 §1) for dev while the backend's `/tickets`
 * routes are built: an in-memory store seeded with four tickets (open,
 * waiting on the student, resolved two days ago, resolved ten days ago) that
 * answers like the API, including its 409s (a reply on a closed ticket, a
 * reopen after the 7-day window). Loaded only through `fixturesEnabled()`
 * (dev) or by tests.
 */
import { ApiError } from "@/lib/apiError";
import { MAX_TICKET_ATTACHMENTS, TICKET_MESSAGE_CAP, canReopen } from "@/lib/support/tickets";
import type {
  CreateTicketPayload,
  MyTicketsQuery,
  PostTicketMessagePayload,
  Ticket,
  TicketMessage,
  TicketPage,
  TicketSummary,
} from "@/types/v15";

/** The fixture student's user id, the requester of every seeded ticket. */
export const FIXTURE_REQUESTER_ID = "user-fixture-student";

/** The fixture student's school. */
export const FIXTURE_SCHOOL_ID = "school-easy-sparks";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/**
 * An instant some time before `now`.
 *
 * @param now - The reference time.
 * @param ms - How long before.
 * @returns The ISO instant.
 */
function ago(now: Date, ms: number): string {
  return new Date(now.getTime() - ms).toISOString();
}

/**
 * A message of the seeded threads.
 *
 * @param id - The message id.
 * @param from - "me" for the student, else the staff member's name and role.
 * @param body - The text.
 * @param createdAt - When it was written.
 * @returns The message.
 */
function message(id: string, from: "me" | { name: string; role: "admin" | "school_admin" }, body: string, createdAt: string): TicketMessage {
  const author =
    from === "me"
      ? { id: FIXTURE_REQUESTER_ID, name: "Musa Adele", role: "student" as const }
      : { id: `staff-${from.role}`, name: from.name, role: from.role };
  return { id, author, body, attachments: [], internal: false, createdAt };
}

/**
 * The four seeded tickets, dated relative to `now` so the reopen window
 * behaves the same on any day.
 *
 * @param now - The reference time.
 * @returns The tickets, newest activity first.
 */
export function seedTickets(now: Date = new Date()): Ticket[] {
  const base = {
    schoolId: FIXTURE_SCHOOL_ID,
    requester: { userId: FIXTURE_REQUESTER_ID, role: "student" as const },
    priority: "normal" as const,
    childId: null,
  };
  return [
    {
      ...base,
      id: "ticket-waiting",
      reference: "TS-4K7QM",
      desk: "talim",
      area: "signing_in",
      subject: "Signed out every time I close the tab",
      status: "waiting_on_user",
      firstResponseAt: ago(now, 3 * HOUR_MS),
      lastActivityAt: ago(now, 3 * HOUR_MS),
      createdAt: ago(now, 26 * HOUR_MS),
      unread: true,
      messages: [
        message("m-w1", "me", "Each time I close the tab and come back I have to sign in again.", ago(now, 26 * HOUR_MS)),
        message("m-w2", { name: "Amaka Obi", role: "admin" }, "Thanks, Musa. Which browser are you using, and is it in private mode?", ago(now, 3 * HOUR_MS)),
      ],
    },
    {
      ...base,
      id: "ticket-open",
      reference: "CMP-2026-0142",
      desk: "school",
      area: "timetable",
      subject: "Two lessons at 10:00 on Wednesday",
      status: "open",
      lastActivityAt: ago(now, 5 * HOUR_MS),
      createdAt: ago(now, 5 * HOUR_MS),
      unread: false,
      messages: [message("m-o1", "me", "My timetable shows Biology and French both at 10:00 on Wednesday.", ago(now, 5 * HOUR_MS))],
    },
    {
      ...base,
      id: "ticket-resolved",
      reference: "CMP-2026-0131",
      desk: "school",
      area: "results",
      subject: "Biology total shows blank",
      status: "resolved",
      firstResponseAt: ago(now, 3 * DAY_MS),
      resolvedAt: ago(now, 2 * DAY_MS),
      lastActivityAt: ago(now, 2 * DAY_MS),
      createdAt: ago(now, 4 * DAY_MS),
      unread: false,
      messages: [
        message("m-r1", "me", "My Biology total is blank on the report card.", ago(now, 4 * DAY_MS)),
        message("m-r2", { name: "Mrs Funmi Bello", role: "school_admin" }, "Your teacher has published the exam score. The total shows now.", ago(now, 2 * DAY_MS)),
      ],
    },
    {
      ...base,
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
      unread: false,
      messages: [
        message("m-x1", "me", "Voice notes in my class group show 0:00 and do not play.", ago(now, 12 * DAY_MS)),
        message("m-x2", { name: "Amaka Obi", role: "admin" }, "Fixed in today's update. Refresh the page and they will play.", ago(now, 10 * DAY_MS)),
      ],
    },
  ];
}

/**
 * The list row of a ticket (the ticket without its thread).
 *
 * @param ticket - The ticket.
 * @returns The summary.
 */
function summaryOf(ticket: Ticket): TicketSummary {
  const { messages: _messages, ...summary } = ticket;
  return summary;
}

/**
 * A 404 as the API answers it.
 *
 * @returns The error.
 */
function notFound(): ApiError {
  return new ApiError("NOT_FOUND", "We couldn't find that ticket.", 404);
}

/**
 * A 409 without a server message, so the screens show their own words.
 *
 * @returns The error.
 */
function conflict(): ApiError {
  return new ApiError("CONFLICT", "", 409);
}

/** The fixture API: the requester's `/tickets` routes over an in-memory list. */
export interface TicketFixtureStore {
  listMine(query?: MyTicketsQuery): TicketPage;
  get(id: string): Ticket;
  create(payload: CreateTicketPayload): Ticket;
  reply(id: string, payload: PostTicketMessagePayload): Ticket;
  reopen(id: string): Ticket;
  close(id: string): Ticket;
  /** Puts the seeded tickets back (tests). */
  reset(): void;
}

/**
 * A fresh fixture store.
 *
 * @param clock - The current time (tests pass a fixed one).
 * @returns The store.
 */
export function createTicketStore(clock: () => Date = () => new Date()): TicketFixtureStore {
  let tickets = seedTickets(clock());
  let counter = 0;

  /**
   * One ticket by id, or a 404.
   *
   * @param id - The ticket's id.
   * @returns The stored ticket (mutable).
   */
  const find = (id: string): Ticket => {
    const ticket = tickets.find((item) => item.id === id);
    if (!ticket) throw notFound();
    return ticket;
  };

  /**
   * A copy, so callers never hold the store's objects.
   *
   * @param ticket - The stored ticket.
   * @returns A deep copy.
   */
  const copy = (ticket: Ticket): Ticket => JSON.parse(JSON.stringify(ticket)) as Ticket;

  return {
    listMine(query = {}) {
      const limit = query.limit ?? 20;
      const page = query.page ?? 1;
      const matching = tickets
        .filter((ticket) => !query.status || ticket.status === query.status)
        .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
      const lastPage = Math.max(1, Math.ceil(matching.length / limit));
      return {
        data: matching.slice((page - 1) * limit, page * limit).map((ticket) => summaryOf(copy(ticket))),
        meta: { total: matching.length, page, lastPage, limit },
      };
    },

    get(id) {
      const ticket = find(id);
      ticket.unread = false;
      return copy(ticket);
    },

    create(payload) {
      counter += 1;
      const now = clock().toISOString();
      const id = `ticket-new-${counter}`;
      const ticket: Ticket = {
        id,
        reference: payload.desk === "talim" ? `TS-NEW${counter}` : `CMP-2026-90${counter}`,
        desk: payload.desk,
        schoolId: FIXTURE_SCHOOL_ID,
        requester: { userId: FIXTURE_REQUESTER_ID, role: "student" },
        childId: payload.childId ?? null,
        area: payload.area,
        subject: payload.subject.trim(),
        status: "open",
        priority: "normal",
        lastActivityAt: now,
        createdAt: now,
        unread: false,
        messages: [
          {
            id: `${id}-m1`,
            author: { id: FIXTURE_REQUESTER_ID, name: "Musa Adele", role: "student" },
            body: payload.body.trim(),
            attachments: (payload.attachments ?? []).slice(0, MAX_TICKET_ATTACHMENTS),
            internal: false,
            createdAt: now,
          },
        ],
      };
      tickets = [ticket, ...tickets];
      return copy(ticket);
    },

    reply(id, payload) {
      const ticket = find(id);
      if (ticket.status === "closed" || ticket.messages.length >= TICKET_MESSAGE_CAP) throw conflict();
      const now = clock().toISOString();
      ticket.messages.push({
        id: `${id}-m${ticket.messages.length + 1}`,
        author: { id: FIXTURE_REQUESTER_ID, name: "Musa Adele", role: "student" },
        body: payload.body.trim(),
        attachments: (payload.attachments ?? []).slice(0, MAX_TICKET_ATTACHMENTS),
        internal: false,
        createdAt: now,
      });
      if (ticket.status === "waiting_on_user") ticket.status = "open";
      ticket.lastActivityAt = now;
      return copy(ticket);
    },

    reopen(id) {
      const ticket = find(id);
      if (!canReopen(ticket, clock())) throw conflict();
      ticket.status = "open";
      ticket.resolvedAt = null;
      ticket.lastActivityAt = clock().toISOString();
      return copy(ticket);
    },

    close(id) {
      const ticket = find(id);
      if (ticket.status === "closed") throw conflict();
      const now = clock().toISOString();
      ticket.status = "closed";
      ticket.closedAt = now;
      ticket.lastActivityAt = now;
      return copy(ticket);
    },

    reset() {
      tickets = seedTickets(clock());
      counter = 0;
    },
  };
}

/** The store dev mode answers from (one per page load). */
export const fixtureTicketStore = createTicketStore();
