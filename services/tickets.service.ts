/**
 * The requester's support-ticket routes (v1.5 §1: one ticket system, two
 * desks), replacing the old `POST /support/tickets` report. Behind
 * `fixturesEnabled()` every call answers from the in-memory fixture store.
 */
import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import { fixturesEnabled } from "@/lib/fixtures/flag";
import { toQuery } from "@/services/learner.service";
import { chatService } from "@/services/chat.service";
import type { ChatUploadFn } from "@/components/chat-kit/useAttachmentUpload";
import type { CreateTicketPayload, MyTicketsQuery, PostTicketMessagePayload, Ticket, TicketPage } from "@/types/v15";

/**
 * Lazily loads the fixture store (dev only).
 *
 * @returns The store.
 */
async function fixtures() {
  return (await import("@/lib/fixtures/tickets.fixture")).fixtureTicketStore;
}

/**
 * The URL of one ticket's route.
 *
 * @param id - The ticket's id.
 * @param action - The sub-route ("messages", "reopen", "close"), if any.
 * @returns The absolute URL.
 */
function ticketUrl(id: string, action?: string): string {
  const base = `${API_BASE_URL}/tickets/${encodeURIComponent(id)}`;
  return action ? `${base}/${action}` : base;
}

export const ticketsService = {
  /**
   * One page of the student's own tickets, newest activity first.
   *
   * @param query - Optional status filter and paging.
   * @returns `{ data, meta }`.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async listMine(query: MyTicketsQuery = {}): Promise<TicketPage> {
    if (fixturesEnabled()) return (await fixtures()).listMine(query);
    return api.get<TicketPage>(`${API_BASE_URL}/tickets/mine${toQuery({ status: query.status, page: query.page, limit: query.limit })}`);
  },

  /**
   * One ticket with its thread (internal notes already removed by the API).
   *
   * @param id - The ticket's id.
   * @returns The ticket.
   * @throws {ApiError} `NOT_FOUND` for a ticket that is not the student's.
   */
  async get(id: string): Promise<Ticket> {
    if (fixturesEnabled()) return (await fixtures()).get(id);
    return api.get<Ticket>(ticketUrl(id));
  },

  /**
   * Raises a ticket to the school or to Talim support.
   *
   * @param payload - Desk, area, subject, first message and attachments.
   * @returns The new ticket.
   * @throws {ApiError} `VALIDATION_FAILED` for fields outside the contract's limits.
   */
  async create(payload: CreateTicketPayload): Promise<Ticket> {
    if (fixturesEnabled()) return (await fixtures()).create(payload);
    return api.post<Ticket>(`${API_BASE_URL}/tickets`, payload);
  },

  /**
   * Adds the student's reply. The caller refetches the ticket afterwards,
   * whatever this answers.
   *
   * @param id - The ticket's id.
   * @param payload - The text and attachments.
   * @returns The API's answer (the ticket, by the contract).
   * @throws {ApiError} `CONFLICT` (409) when the ticket is closed or holds 500 messages.
   */
  async reply(id: string, payload: PostTicketMessagePayload): Promise<unknown> {
    if (fixturesEnabled()) return (await fixtures()).reply(id, payload);
    return api.post<unknown>(ticketUrl(id, "messages"), payload);
  },

  /**
   * Reopens a resolved ticket.
   *
   * @param id - The ticket's id.
   * @returns The API's answer.
   * @throws {ApiError} `CONFLICT` (409) more than 7 days after it was resolved.
   */
  async reopen(id: string): Promise<unknown> {
    if (fixturesEnabled()) return (await fixtures()).reopen(id);
    return api.post<unknown>(ticketUrl(id, "reopen"));
  },

  /**
   * Closes the student's own ticket.
   *
   * @param id - The ticket's id.
   * @returns The API's answer.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async close(id: string): Promise<unknown> {
    if (fixturesEnabled()) return (await fixtures()).close(id);
    return api.post<unknown>(ticketUrl(id, "close"));
  },

  /**
   * Uploads one ticket attachment with the chat kit's helper
   * (`POST /upload/chat-attachment`). The fixtures answer a placeholder URL.
   *
   * @param file - The picked file.
   * @param onProgress - Called with the fraction uploaded so far.
   * @returns The stored file's URL and metadata.
   * @throws {Error} When the upload fails or returns no URL.
   */
  uploadAttachment: ((file, onProgress) => {
    if (fixturesEnabled()) {
      onProgress?.(1);
      return Promise.resolve({ url: `https://fixtures.talim.test/uploads/${encodeURIComponent(file.name)}`, name: file.name, mimeType: file.type, size: file.size });
    }
    return chatService.uploadChatAttachment(file, onProgress);
  }) as ChatUploadFn,
};
