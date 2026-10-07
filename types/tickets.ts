/**
 * The v1.5 ticket routes this app calls, as aliases of the generated contract
 * (`./api.d.ts`, from `talimBE-V2/docs/api-types.d.ts`; refresh it with
 * `npm run types:api`). Shapes are described in
 * `talimBE-V2/docs/v1.5-platform-sync.md`, "v1.5 as built" → "Tickets as built".
 *
 * Only the limits the contract states in prose (and the DTOs enforce) are
 * written by hand here.
 */
import type { RequestBody, RequestQuery, Schema } from "./apiContract";

/** One ticket with its thread (`GET /tickets/:id`, and every write's answer). */
export type Ticket = Schema<"TicketDto">;
/** One row of a ticket list (`GET /tickets/mine`). */
export type TicketSummary = Schema<"TicketSummaryDto">;
/** One page of `GET /tickets/mine`. */
export type TicketPage = Schema<"TicketListResponseDto">;
/** One message in a ticket's thread. */
export type TicketMessage = Schema<"TicketMessageDto">;
/** A file on a ticket message. */
export type Attachment = Schema<"TicketAttachmentDto">;
/** Where the requester was when raising a ticket; desk staff see it, the requester never does. */
export type TicketContext = Schema<"TicketContextInputDto">;

/** Which desk a ticket sits on: the requester's school, or Talim support. */
export type TicketDesk = Ticket["desk"];
/** What a ticket is about. */
export type TicketArea = Ticket["area"];
/** Workflow status. */
export type TicketStatus = Ticket["status"];
/** How the caller may use a ticket: `requester`, `desk` or `observer` (read only). */
export type TicketAccess = Ticket["access"];
/** One message's author. */
export type TicketAuthor = TicketMessage["author"];

/**
 * The roles that raise tickets or write on them. The contract types
 * `requester.role` and `author.role` as a plain string; these are its values.
 */
export type TicketRole = "student" | "parent" | "teacher" | "school_admin" | "school_sub_admin" | "admin";

/** Query of `GET /tickets/mine`. */
export type MyTicketsQuery = NonNullable<RequestQuery<"/tickets/mine">>;
/** Body of `POST /tickets`. Students may raise one to either desk. */
export type CreateTicketPayload = RequestBody<"/tickets">;
/** Body of `POST /tickets/:id/messages` as a requester sends it (`internal` and `status` are desk-only). */
export type PostTicketMessagePayload = Omit<RequestBody<"/tickets/{id}/messages">, "internal" | "status">;

/** Subject length the API allows. */
export const TICKET_SUBJECT_MIN = 3;
export const TICKET_SUBJECT_MAX = 140;
/** Message length the API allows. */
export const TICKET_BODY_MIN = 1;
export const TICKET_BODY_MAX = 5000;
/** How long after `resolvedAt` the requester may reopen (409 `REOPEN_WINDOW_PASSED` after). */
export const TICKET_REOPEN_WINDOW_DAYS = 7;
/** Longest `context` values `POST /tickets` takes. */
export const TICKET_CONTEXT_LIMITS = { path: 500, appVersion: 50, userAgent: 500 } as const;
