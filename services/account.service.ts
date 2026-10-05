/**
 * Account, support and inbox calls the redesign adds (round-4 §29–§35 and the
 * portals contract B10–B12), for every role. Behind `fixturesEnabled()` they
 * answer from the dev fixtures, except sign-out, which always calls the API.
 */
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import { fixturesEnabled, fixtureVariant } from "@/lib/fixtures/flag";
import { toQuery } from "@/services/learner.service";
import type {
  AuthSession,
  NotificationCounts,
  PasswordPolicy,
  ReadAllResult,
  RevokeOthersResult,
  RevokeSessionResult,
  RoomMediaKind,
  RoomMediaPage,
  SupportTicketBody,
  SupportTicketResult,
} from "@/types/learner";

/**
 * Lazily loads the fixture module (dev only).
 *
 * @returns The fixture builders.
 */
async function fixtures() {
  return import("@/lib/fixtures/learner.fixture");
}

export const accountService = {
  /**
   * Ends the session on the server: revokes the refresh token and clears the
   * refresh cookie. Sent with the current bearer token (or the one given) but
   * never refreshed on a 401 (an expired session is already over).
   *
   * @param accessToken - A token to send instead of the stored one (a refused
   *   sign-in has not stored its token).
   * @returns Nothing.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async logout(accessToken?: string): Promise<void> {
    await api.post<unknown>(`${API_BASE_URL}/auth/logout`, undefined, { accessToken, retryOnUnauthorized: false, timeoutMs: 5000 });
  },

  /**
   * §34: the password rules, so the form can check them before sending.
   *
   * @returns The policy (public route).
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getPasswordPolicy(): Promise<PasswordPolicy> {
    if (fixturesEnabled()) return (await fixtures()).makePasswordPolicy();
    return api.get<PasswordPolicy>(`${API_BASE_URL}/auth/password-policy`, { skipAuth: true });
  },

  /**
   * §34: where the student is signed in.
   *
   * @returns One entry per active session, `current` marking this browser.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getSessions(): Promise<AuthSession[]> {
    if (fixturesEnabled()) return (await fixtures()).makeSessions();
    return api.get<AuthSession[]>(`${API_BASE_URL}/auth/sessions`);
  },

  /**
   * §34: signs one session out.
   *
   * @param sessionId - The session's id from {@link accountService.getSessions}.
   * @returns `{ id, revoked, current }`.
   * @throws {ApiError} `NOT_FOUND` for a session that is not the student's.
   */
  async revokeSession(sessionId: string): Promise<RevokeSessionResult> {
    if (fixturesEnabled()) return { id: sessionId, revoked: true, current: false };
    return api.delete<RevokeSessionResult>(`${API_BASE_URL}/auth/sessions/${encodeURIComponent(sessionId)}`);
  },

  /**
   * §34: signs every other session out.
   *
   * @returns How many were revoked.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async revokeOtherSessions(): Promise<RevokeOthersResult> {
    if (fixturesEnabled()) return { revoked: 1 };
    return api.post<RevokeOthersResult>(`${API_BASE_URL}/auth/sessions/revoke-others`);
  },

  /**
   * §35: sends a problem report to the Talim support team (not the school).
   *
   * @param body - The area, the description and the page context.
   * @returns The ticket reference ("TS-7KQ2P").
   * @throws {ApiError} `VALIDATION_FAILED` for a description outside 10–2000 characters.
   */
  async createSupportTicket(body: SupportTicketBody): Promise<SupportTicketResult> {
    if (fixturesEnabled()) return { reference: "TS-7KQ2P", createdAt: new Date().toISOString() };
    return api.post<SupportTicketResult>(`${API_BASE_URL}/support/tickets`, body);
  },

  /**
   * Saves a new profile photo (already uploaded to Cloudinary).
   *
   * @param avatarUrl - The photo's https URL.
   * @returns The server's answer.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async updateAvatar(avatarUrl: string): Promise<unknown> {
    if (fixturesEnabled()) return { avatarUrl };
    return api.put<unknown>(`${API_BASE_URL}/auth/profile/avatar`, { avatarUrl });
  },

  /**
   * §30: unread and total counts per category, for the bell and the badges.
   *
   * @returns The counts.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async getNotificationCounts(): Promise<NotificationCounts> {
    if (fixturesEnabled()) return (await fixtures()).makeNotificationCounts(fixtureVariant());
    return api.get<NotificationCounts>(`${API_ENDPOINTS.NOTIFICATIONS}/counts`);
  },

  /**
   * §30: marks every notification and announcement read in one call.
   *
   * @returns How many were newly marked.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  async markAllNotificationsRead(): Promise<ReadAllResult> {
    if (fixturesEnabled()) return { updated: 2, message: "Marked as read" };
    return api.patch<ReadAllResult>(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`);
  },

  /**
   * §29/B10: one page of what was shared in a group, by kind.
   *
   * @param roomId - The room.
   * @param kind - `image`, `video`, `document` or `link`.
   * @param cursor - Where the previous page ended.
   * @returns The page and the per-kind counts.
   * @throws {ApiError} `FORBIDDEN` for a room the student is not in.
   */
  async getRoomMedia(roomId: string, kind: RoomMediaKind, cursor?: string | null): Promise<RoomMediaPage> {
    if (fixturesEnabled()) return (await fixtures()).makeRoomMedia(kind);
    return api.get<RoomMediaPage>(`${API_BASE_URL}/chat/rooms/${encodeURIComponent(roomId)}/media${toQuery({ kind, cursor, limit: 30 })}`);
  },
};
