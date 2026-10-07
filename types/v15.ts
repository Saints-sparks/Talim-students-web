/**
 * Hand-written types for the v1.5 routes this app calls.
 *
 * Source: `talimBE-V2/docs/v1.5-platform-sync.md` (contract of 2026-10-06),
 * §1 Tickets (the requester routes) and §3 Version. The backend is being
 * built in parallel, so these are NOT yet in the generated `api.d.ts`.
 * The shapes match Talim Admin's `src/types/v15.ts` field for field.
 *
 * When `talimBE-V2/docs/api-types.d.ts` carries `/tickets/*`, run
 * `npm run types:api` and replace each type below with its generated
 * equivalent, then delete this file.
 *
 * Fields tagged `NOT IN CONTRACT` are ones the screens need that the
 * contract does not define yet; the screens degrade gracefully without them.
 */

// ─── Shared ───────────────────────────────────────────────────────────────────

/**
 * Pagination block of a `{ data, meta }` list, as every paginated route in
 * the API serialises it. The contract writes only `meta`.
 */
export interface PageMeta {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

/** A file on a ticket message (§1 `attachments`). */
export interface Attachment {
  url: string;
  name: string;
  mimeType: string;
  /** Bytes. */
  size: number;
}

/** An id and a display name. */
export interface IdName {
  id: string;
  name: string;
}

// ─── §1 Tickets ───────────────────────────────────────────────────────────────

/** Which desk a ticket sits on: the requester's school, or Talim support. */
export type TicketDesk = "school" | "talim";

/** What the ticket is about (§1 `area`). */
export type TicketArea =
  | "grading"
  | "attendance"
  | "timetable"
  | "messages"
  | "signing_in"
  | "payments"
  | "fees"
  | "results"
  | "transport"
  | "behaviour"
  | "other";

/** Workflow status (§1 `status`). A resolved ticket can be reopened within 7 days. */
export type TicketStatus = "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";

/** Triage priority (§1 `priority`). Set by desk staff; the requester only sees it. */
export type TicketPriority = "low" | "normal" | "high" | "urgent";

/** The roles that raise tickets or write on them. */
export type TicketRole = "student" | "parent" | "teacher" | "school_admin" | "school_sub_admin" | "admin";

/** Who raised the ticket (§1 `requester`). */
export interface TicketRequester {
  userId: string;
  role: TicketRole;
  /** NOT IN CONTRACT: the requester's display name, for the queue and the detail page. */
  name?: string;
  /** NOT IN CONTRACT: the requester's email, for the detail page (desk staff only). */
  email?: string;
}

/** The author of one message (§1 `messages[].author`). */
export interface TicketAuthor {
  id: string;
  name: string;
  role: TicketRole;
}

/** One message in a ticket's thread (§1 `messages[]`). */
export interface TicketMessage {
  id: string;
  author: TicketAuthor;
  /** 1..5000 characters. */
  body: string;
  attachments: Attachment[];
  /** An internal note. `GET /tickets/:id` removes these for the requester, so this is always false here. */
  internal: boolean;
  createdAt: string;
}

/**
 * One row of a list. The contract names `TicketSummary` but does not spell
 * it out; this is the `Ticket` model without `messages`.
 */
export interface TicketSummary {
  /** NOT IN CONTRACT by name: the ticket's id (the model shows only `reference`). */
  id: string;
  /** "TS-XXXXX" on the Talim desk; the school desk keeps its complaint format. */
  reference: string;
  desk: TicketDesk;
  schoolId: string | null;
  /** NOT IN CONTRACT: the school's name, for the "All schools" view and the detail page. */
  school?: IdName | null;
  requester: TicketRequester;
  /** The child a parent's ticket is about. */
  childId?: string | null;
  area: TicketArea;
  /** 3..140 characters. */
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: string | null;
  /** NOT IN CONTRACT: the assignee's name, so the queue need not look staff up per row. */
  assignee?: IdName | null;
  escalatedFrom?: "school" | null;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  lastActivityAt: string;
  /** NOT IN CONTRACT: when the ticket was raised (Mongo `createdAt`). */
  createdAt?: string;
  /**
   * NOT IN CONTRACT: whether a staff reply or status change arrived since the
   * requester last opened the ticket. Without it the list shows last activity only.
   */
  unread?: boolean;
}

/** A ticket with its thread (`GET /tickets/:id`; internal notes removed for the requester). */
export interface Ticket extends TicketSummary {
  messages: TicketMessage[];
}

/** One page of a ticket list. */
export interface TicketPage {
  data: TicketSummary[];
  meta: PageMeta;
}

/** Query of `GET /tickets/mine`. */
export interface MyTicketsQuery {
  status?: TicketStatus;
  page?: number;
  limit?: number;
}

/**
 * Body of `POST /tickets`.
 * - A student or parent may raise a ticket to `school` or `talim`.
 * - Staff of a school (teachers) may raise one to `talim` only.
 * - A parent names the child (`childId`); the ticket uses that child's school.
 */
export interface CreateTicketPayload {
  desk: TicketDesk;
  area: TicketArea;
  /** 3..140 characters. */
  subject: string;
  /** 1..5000 characters: the first message. */
  body: string;
  attachments?: Attachment[];
  childId?: string;
}

/**
 * Body of `POST /tickets/:id/messages`. Desk staff may also send
 * `internal: true`; the requester never does, so it is left out here.
 * Answers 409 when the ticket is closed or holds 500 messages.
 */
export interface PostTicketMessagePayload {
  /** 1..5000 characters. */
  body: string;
  attachments?: Attachment[];
}

/** Subject length the contract allows (§1 `subject`). */
export const TICKET_SUBJECT_MIN = 3;
export const TICKET_SUBJECT_MAX = 140;
/** Message length the contract allows (§1 `messages[].body`). */
export const TICKET_BODY_MIN = 1;
export const TICKET_BODY_MAX = 5000;
/** How long after `resolvedAt` the requester may reopen (§1; 409 after). */
export const TICKET_REOPEN_WINDOW_DAYS = 7;

/**
 * Where a support notification leads (§1 Notifications: category `support`,
 * target `{ page: "support", ticketId }`). NOT IN CONTRACT yet in the
 * generated `NotificationTargetDto`, whose `page` enum lacks `support` and
 * which has no `ticketId`.
 */
export interface SupportNotificationTarget {
  page: "support";
  ticketId: string;
}

// ─── §3 Version ───────────────────────────────────────────────────────────────

/** `GET /version` (public). This app shows its own `package.json` version instead. */
export interface VersionInfo {
  version: string;
  commit: string | null;
  builtAt: string | null;
}
