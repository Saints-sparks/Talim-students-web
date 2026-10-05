import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import { fixturesEnabled, fixtureVariant } from "@/lib/fixtures/flag";
import type { NotificationPreferencesBody } from "@/types/apiPayloads";

/** Filters the notification list endpoint accepts. */
export type NotificationQuery = {
  page?: number;
  limit?: number;
  recipientId?: string;
  source?: string;
  category?: string;
  type?: string;
};

/**
 * One notification or announcement exactly as the API returns it. The fields
 * vary by source, so normalisation lives in `lib/notifications/normalize.ts`
 * rather than being assumed here.
 * HAND-WRITTEN (not `NotificationItemDto`): the normaliser also reads announcements and older payloads (`content`, `body`, `read`, `sender`…).
 */
export interface RawNotification {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
  content?: string;
  body?: string;
  type?: string;
  category?: string;
  source?: string;
  sourceLabel?: string;
  senderId?: unknown;
  sender?: unknown;
  createdBy?: unknown;
  senderName?: string;
  senderEmail?: string;
  senderDisplay?: { name?: string; email?: string };
  schoolName?: string;
  school?: { name?: string };
  schoolId?: { name?: string } | string;
  attachments?: string[];
  attachment?: string;
  metadata?: Record<string, unknown>;
  priority?: "low" | "medium" | "high";
  readBy?: unknown;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  publishedAt?: string;
  scheduledFor?: string;
  [key: string]: unknown;
}

/** A page of notifications, as the list endpoints return it (loose like {@link RawNotification}, which it lists). */
export interface NotificationListResponse {
  data?: RawNotification[];
  announcements?: RawNotification[];
  meta?: { total: number; page: number; lastPage: number; limit: number };
}

/**
 * The per-student notification preference document. The field names are
 * exactly those on `UpdateNotificationPreferenceDto`: the API runs
 * `forbidNonWhitelisted`, so one extra key makes the whole PATCH a 400.
 *
 * Note these do not line up with the `NotificationCategory` enum — `results`
 * covers the `grading` category, `announcements` covers `announcement`, and
 * there is no switch for `academics`, `account` or `other`.
 */
export type NotificationPreferences = Pick<
  NotificationPreferencesBody,
  // `webPushEnabled` is browser push, separate from `pushEnabled` (the phone switch).
  // `quietHoursStart`/`End` are 24-hour `HH:mm`, and `timezone` an IANA zone
  // such as "Africa/Lagos"; anything malformed is a 400.
  | "pushEnabled"
  | "webPushEnabled"
  | "emailEnabled"
  | "messagesEnabled"
  | "announcementsEnabled"
  | "attendanceEnabled"
  | "feesEnabled"
  | "resultsEnabled"
  | "timetableEnabled"
  | "resourcesEnabled"
  | "securityEnabled"
  | "systemEnabled"
  | "quietHoursEnabled"
  | "quietHoursStart"
  | "quietHoursEnd"
  | "timezone"
>;

/**
 * Serialises a filter object into a query string, dropping empty values.
 *
 * @param params - The filters to send.
 * @returns A `?a=b` string, or an empty string when there is nothing to send.
 */
function buildQuery(params: NotificationQuery = {}): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") searchParams.set(key, String(value));
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export const notificationService = {
  /**
   * The signed-in student's notification feed: the one inbox (A10), school
   * announcements included as rows with their own read state.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param params - Paging and filters.
   * @returns A page of notifications.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getNotifications: async (accessToken: string | undefined, params: NotificationQuery = {}): Promise<NotificationListResponse> => {
    if (fixturesEnabled()) {
      const items = (await import("@/lib/fixtures/learner.fixture")).makeRawNotifications(fixtureVariant()) as RawNotification[];
      return { data: items, meta: { total: items.length, page: 1, lastPage: 1, limit: params.limit ?? 10 } };
    }
    return api.get<NotificationListResponse>(`${API_ENDPOINTS.NOTIFICATIONS}${buildQuery({ page: 1, limit: 10, ...params })}`, {
      accessToken,
    });
  },

  /**
   * Marks one notification read for the signed-in student.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param notificationId - The notification to mark. The reader is always the
   *   authenticated user, and the endpoint declares no body, so none is sent.
   * @returns Nothing useful; the server answers 200 or 204.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  markNotificationAsRead: async (accessToken: string | undefined, notificationId: string): Promise<unknown> => {
    if (fixturesEnabled()) return null;
    return api.put<unknown>(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`, undefined, { accessToken });
  },

  /**
   * The signed-in student's notification preferences.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The stored preference document.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getPreferences: async (accessToken?: string): Promise<NotificationPreferences> => {
    if (fixturesEnabled()) return {};
    return api.get<NotificationPreferences>(`${API_ENDPOINTS.NOTIFICATIONS}/preferences`, { accessToken });
  },

  /**
   * Updates one or more notification preferences.
   *
   * @param patch - Only the switches that changed; the API whitelists fields.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The updated preference document.
   * @throws {ApiError} `VALIDATION_FAILED` when a field is not on the DTO.
   */
  updatePreferences: async (patch: NotificationPreferences, accessToken?: string): Promise<NotificationPreferences> => {
    if (fixturesEnabled()) return patch;
    return api.patch<NotificationPreferences>(`${API_ENDPOINTS.NOTIFICATIONS}/preferences`, patch, { accessToken });
  },
};
