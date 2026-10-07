/**
 * Pure rules and words for support tickets (v1.5 §1: one ticket system, two
 * desks). No React and no requests here, so every rule is unit-tested:
 * which desks and areas a role may pick, the new-ticket checks, the status
 * and area labels, the 7-day reopen window and the words for a 409.
 */
import { ApiError, messageForStatus } from "@/lib/apiError";
import { formatDate } from "@/lib/learner/format";
import type { PillTone } from "@/components/tl/styles";
import {
  TICKET_BODY_MAX,
  TICKET_BODY_MIN,
  TICKET_CONTEXT_LIMITS,
  TICKET_REOPEN_WINDOW_DAYS,
  TICKET_SUBJECT_MAX,
  TICKET_SUBJECT_MIN,
  type Ticket,
  type TicketArea,
  type TicketAuthor,
  type TicketContext,
  type TicketDesk,
  type TicketRole,
  type TicketStatus,
  type TicketSummary,
} from "@/types/tickets";

/** Most files one ticket message carries (Talim Admin's `MAX_ATTACHMENTS`). */
export const MAX_TICKET_ATTACHMENTS = 5;

/** How many messages a ticket holds before the API answers 409 (§1). */
export const TICKET_MESSAGE_CAP = 500;

const DAY_MS = 24 * 60 * 60 * 1000;

/* ───────────────────────────── where tickets live ───────────────────────────── */

/**
 * The URL of Settings → Help with My tickets, optionally with one ticket's
 * thread open. A support notification (`{ page: 'support', ticketId }`)
 * leads here.
 *
 * @param ticketId - The ticket to open, if any.
 * @returns `/settings?tab=help`, or `/settings?tab=help&ticket=<id>`.
 */
export function supportHref(ticketId?: string | null): string {
  const id = ticketId?.trim();
  return id ? `/settings?tab=help&ticket=${encodeURIComponent(id)}` : "/settings?tab=help";
}

/**
 * Reads `?ticket=` (a ticket id from a deep link).
 *
 * @param raw - The query value.
 * @returns The id, or null when missing or blank.
 */
export function parseTicketParam(raw: string | null | undefined): string | null {
  const id = (raw ?? "").trim();
  return id || null;
}

/* ───────────────────────────── desks and areas ───────────────────────────── */

/**
 * The desks a role may raise a ticket to: students and parents choose their
 * school or Talim support; teachers and other school staff go to Talim only.
 *
 * @param role - The requester's role.
 * @returns The allowed desks, school first.
 */
export function allowedDesks(role: TicketRole): TicketDesk[] {
  return role === "student" || role === "parent" ? ["school", "talim"] : ["talim"];
}

/** What each area is called on screen. */
export const AREA_LABELS: Record<TicketArea, string> = {
  grading: "Grading",
  attendance: "Attendance",
  timetable: "Timetable",
  messages: "Messages",
  signing_in: "Signing in",
  payments: "Payments",
  fees: "Fees",
  results: "Results",
  transport: "Transport",
  behaviour: "Behaviour",
  other: "Something else",
};

/** The areas each role is offered, in the order the chips show them; always ending with `other`. */
const AREAS_BY_ROLE: Record<"teacher" | "student" | "parent", readonly TicketArea[]> = {
  teacher: ["grading", "attendance", "timetable", "messages", "results", "signing_in", "other"],
  student: ["results", "attendance", "timetable", "messages", "signing_in", "fees", "transport", "behaviour", "other"],
  parent: ["payments", "fees", "results", "attendance", "timetable", "messages", "transport", "behaviour", "signing_in", "other"],
};

/**
 * The areas a role is offered. School staff other than teachers get the
 * teachers' list.
 *
 * @param role - The requester's role.
 * @returns The areas, ending with `other`.
 */
export function areasFor(role: TicketRole): readonly TicketArea[] {
  if (role === "student" || role === "parent") return AREAS_BY_ROLE[role];
  return AREAS_BY_ROLE.teacher;
}

/**
 * A desk's name: "My school" (with the school's name when known) or
 * "Talim support".
 *
 * @param desk - The desk.
 * @param schoolName - The requester's (or the child's) school, when known.
 * @returns The label.
 */
export function deskLabel(desk: TicketDesk, schoolName?: string | null): string {
  if (desk === "talim") return "Talim support";
  const name = schoolName?.trim();
  return name ? `My school (${name})` : "My school";
}

/* ───────────────────────────── statuses ───────────────────────────── */

/** Label and chip tone per status (the tones are the `tl` pill tokens, AA in both themes). */
export const STATUS_META: Record<TicketStatus, { label: string; tone: PillTone }> = {
  open: { label: "Open", tone: "info" },
  in_progress: { label: "In progress", tone: "accent" },
  waiting_on_user: { label: "Waiting on you", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  closed: { label: "Closed", tone: "muted" },
};

/* ───────────────────────────── new ticket ───────────────────────────── */

/** What the student has filled in on the New ticket sheet. */
export interface NewTicketDraft {
  /** The chosen desk, or null before a choice. */
  desk: TicketDesk | null;
  /** The chosen area, or null before a choice. */
  area: TicketArea | null;
  subject: string;
  /** The first message. */
  body: string;
  /** How many files are attached. */
  attachmentCount: number;
  /** The child the ticket is about (parents only). */
  childId?: string | null;
}

/** The fields of the New ticket sheet that can carry an error. */
export type NewTicketField = "desk" | "area" | "subject" | "body" | "attachments" | "childId";

/** One sentence per field that needs attention; empty when the draft can be sent. */
export type NewTicketErrors = Partial<Record<NewTicketField, string>>;

/**
 * Checks a new ticket before it is sent, with the limits of the contract:
 * an allowed desk, an area, a subject of 3–140 and a message of 1–5000
 * characters (both trimmed), at most 5 files, and a child for a parent.
 *
 * @param draft - The sheet's fields.
 * @param role - The requester's role.
 * @returns The errors per field (an empty object when valid).
 */
export function validateNewTicket(draft: NewTicketDraft, role: TicketRole): NewTicketErrors {
  const errors: NewTicketErrors = {};
  if (!draft.desk) errors.desk = "Choose who should help: your school or Talim support.";
  else if (!allowedDesks(role).includes(draft.desk)) errors.desk = "Tickets from your account go to Talim support.";
  if (!draft.area) errors.area = "Choose what it is about.";
  const subject = draft.subject.trim().length;
  if (subject < TICKET_SUBJECT_MIN) errors.subject = `Give it a subject of at least ${TICKET_SUBJECT_MIN} characters.`;
  else if (subject > TICKET_SUBJECT_MAX) errors.subject = `Keep the subject to ${TICKET_SUBJECT_MAX} characters.`;
  const body = draft.body.trim().length;
  if (body < TICKET_BODY_MIN) errors.body = "Write what you need help with.";
  else if (body > TICKET_BODY_MAX) errors.body = `Keep the message to ${TICKET_BODY_MAX} characters.`;
  if (draft.attachmentCount > MAX_TICKET_ATTACHMENTS) errors.attachments = `Attach up to ${MAX_TICKET_ATTACHMENTS} files.`;
  if (role === "parent" && !draft.childId) errors.childId = "Choose which child this is about.";
  return errors;
}

/**
 * Checks a reply before it is sent: 1–5000 characters (trimmed) and at most
 * 5 files.
 *
 * @param body - The reply's text.
 * @param attachmentCount - How many files are attached.
 * @returns The sentence to show, or null when it can be sent.
 */
export function validateReply(body: string, attachmentCount: number): string | null {
  const length = body.trim().length;
  if (length < TICKET_BODY_MIN) return "Write a reply first.";
  if (length > TICKET_BODY_MAX) return `Keep the reply to ${TICKET_BODY_MAX} characters.`;
  if (attachmentCount > MAX_TICKET_ATTACHMENTS) return `Attach up to ${MAX_TICKET_ATTACHMENTS} files.`;
  return null;
}

/* ───────────────────────────── reopen window ───────────────────────────── */

/** What the reopen window is read from: the status, `resolvedAt`, and the detail's `reopenableUntil`. */
export type ReopenFields = Pick<TicketSummary, "status" | "resolvedAt"> & Partial<Pick<Ticket, "reopenableUntil">>;

/**
 * The last moment a resolved ticket can be reopened: the server's
 * `reopenableUntil` when the detail carries it, else `resolvedAt` plus 7 days.
 *
 * @param ticket - The ticket's status, `resolvedAt` and `reopenableUntil`.
 * @returns The deadline, or null when the ticket is not resolved.
 */
export function reopenDeadline(ticket: ReopenFields): Date | null {
  if (ticket.status !== "resolved") return null;
  const until = new Date(ticket.reopenableUntil ?? "").getTime();
  if (!Number.isNaN(until)) return new Date(until);
  if (!ticket.resolvedAt) return null;
  const resolved = new Date(ticket.resolvedAt).getTime();
  return Number.isNaN(resolved) ? null : new Date(resolved + TICKET_REOPEN_WINDOW_DAYS * DAY_MS);
}

/**
 * Whether the requester may still reopen a resolved ticket.
 *
 * @param ticket - The ticket's status, `resolvedAt` and `reopenableUntil`.
 * @param now - The current time.
 * @returns True within 7 days of `resolvedAt`.
 */
export function canReopen(ticket: ReopenFields, now: Date = new Date()): boolean {
  const deadline = reopenDeadline(ticket);
  return deadline !== null && now.getTime() <= deadline.getTime();
}

/**
 * The hint under Reopen: "You can reopen until 14 Oct 2026".
 *
 * @param deadline - From {@link reopenDeadline}.
 * @returns The sentence.
 */
export function reopenHint(deadline: Date): string {
  return `You can reopen until ${formatDate(deadline.toISOString())}.`;
}

/* ───────────────────────────── 409 words ───────────────────────────── */

/** A reply to a closed ticket. */
export const CLOSED_TICKET_TEXT = "This ticket is closed, so it takes no more replies. Raise a new ticket if you still need help.";

/**
 * A reopen after the 7-day window.
 *
 * @param reference - The ticket's reference, to quote on the new one.
 * @returns The sentence.
 */
export function reopenExpiredText(reference: string): string {
  return `This ticket was resolved more than ${TICKET_REOPEN_WINDOW_DAYS} days ago, so it can't be reopened. Raise a new ticket and mention ${reference}.`;
}

/**
 * A reply to a ticket that holds the most messages the API keeps.
 *
 * @param reference - The ticket's reference, to quote on the new one.
 * @returns The sentence.
 */
export function messageCapText(reference: string): string {
  return `This ticket has reached its limit of ${TICKET_MESSAGE_CAP} messages, so it takes no more replies. Raise a new ticket and mention ${reference}.`;
}

/** What the requester was doing when the API answered. */
export type TicketAction = "reply" | "reopen" | "close";

/**
 * Whether an error is the API's 409 for a ticket.
 *
 * @param error - Whatever was thrown.
 * @returns True for a 409.
 */
export function isConflict(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 409;
}

/** The ticket's status moved on, so the action no longer applies. */
export const INVALID_TRANSITION_TEXT = "This ticket's status has changed, so that can't be done now. It has been reloaded; check it and try again.";

/** Someone else changed the ticket at the same moment. */
export const TICKET_CHANGED_TEXT = "This ticket changed since you opened it. It has been reloaded; check it and try again.";

/**
 * The words for a 409 on a ticket, from the API's reason (the top-level
 * `code`): `TICKET_CLOSED`, `REOPEN_WINDOW_PASSED`, `MESSAGE_CAP`,
 * `INVALID_TRANSITION` or `TICKET_CHANGED`. Without a known reason the
 * server's own message wins, else the ticket as last loaded decides.
 *
 * @param error - The 409.
 * @param action - What was being done.
 * @param ticket - The ticket as last loaded.
 * @returns The sentence to show.
 */
export function conflictMessage(error: ApiError, action: TicketAction, ticket: Pick<TicketSummary, "status" | "reference">): string {
  switch (error.reasonCode) {
    case "TICKET_CLOSED":
      return CLOSED_TICKET_TEXT;
    case "REOPEN_WINDOW_PASSED":
      return reopenExpiredText(ticket.reference);
    case "MESSAGE_CAP":
      return messageCapText(ticket.reference);
    case "INVALID_TRANSITION":
      return INVALID_TRANSITION_TEXT;
    case "TICKET_CHANGED":
      return TICKET_CHANGED_TEXT;
    default:
      break;
  }
  const server = error.message?.trim();
  if (server && server !== messageForStatus(409)) return server;
  if (ticket.status === "closed") return CLOSED_TICKET_TEXT;
  if (action === "reopen") return reopenExpiredText(ticket.reference);
  if (action === "reply") return messageCapText(ticket.reference);
  return TICKET_CHANGED_TEXT;
}

/* ───────────────────────────── unread and context ───────────────────────────── */

/**
 * The "N new" badge of a ticket row: messages from staff since the student
 * last opened it (`unread`; opening the ticket clears it on the server).
 *
 * @param ticket - The ticket's `unread`.
 * @returns e.g. "2 new", or null when there is nothing new.
 */
export function unreadLabel(ticket: Pick<TicketSummary, "unread">): string | null {
  const count = Number(ticket.unread) || 0;
  return count > 0 ? `${count.toLocaleString("en-GB")} new` : null;
}

/**
 * Where the student is, for desk staff (`context` on `POST /tickets`): the
 * page, this app's version and the browser, each cut to the length the API takes.
 *
 * @param appVersion - This app's version.
 * @param where - The page and user agent; read from `window` when left out.
 * @param where.path - The page, e.g. `/settings`.
 * @param where.userAgent - The browser's user agent.
 * @returns The context, with only the values that are known.
 */
export function ticketContext(appVersion: string, where?: { path?: string | null; userAgent?: string | null }): TicketContext {
  const path = where ? where.path : typeof window === "undefined" ? null : `${window.location.pathname}${window.location.search}`;
  const userAgent = where ? where.userAgent : typeof navigator === "undefined" ? null : navigator.userAgent;
  const context: TicketContext = {};
  if (path) context.path = path.slice(0, TICKET_CONTEXT_LIMITS.path);
  if (appVersion) context.appVersion = appVersion.slice(0, TICKET_CONTEXT_LIMITS.appVersion);
  if (userAgent) context.userAgent = userAgent.slice(0, TICKET_CONTEXT_LIMITS.userAgent);
  return context;
}

/* ───────────────────────────── thread and list words ───────────────────────────── */

/**
 * Who wrote a message: "You" for the requester, else the author's name and
 * their side ("Talim support" for Talim staff, "School" for school staff).
 *
 * @param author - The message's author.
 * @param requesterId - The ticket's requester (`requester.id`).
 * @returns The name and the side, or null for the requester.
 */
export function authorLine(author: TicketAuthor, requesterId: string): { name: string; side: string | null } {
  if (author.id === requesterId) return { name: "You", side: null };
  return { name: author.name?.trim() || (author.role === "admin" ? "Talim" : "Your school"), side: author.role === "admin" ? "Talim support" : "School" };
}

/**
 * How long ago something happened, for "Updated 5 min ago".
 *
 * @param iso - An ISO instant.
 * @param now - The current time.
 * @returns "just now", "5 min ago", "3 h ago", "yesterday", "4 days ago", else "12 Sep 2026".
 */
export function relativeTime(iso: string | null | undefined, now: Date = new Date()): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.max(0, Math.floor((now.getTime() - then) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(iso);
}
