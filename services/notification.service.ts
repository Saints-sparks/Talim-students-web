import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";

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

/** A page of notifications, as the list endpoints return it. */
export interface NotificationListResponse {
  data?: RawNotification[];
  announcements?: RawNotification[];
  meta?: { total: number; page: number; lastPage: number; limit: number };
}

/**
 * The per-student notification preference document. Only the switches this app
 * actually shows are declared; the API's `whitelist` rejects anything else.
 */
export interface NotificationPreferences {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  webPushEnabled?: boolean;
  inAppEnabled?: boolean;
  announcementsEnabled?: boolean;
  attendanceEnabled?: boolean;
  gradingEnabled?: boolean;
  resourcesEnabled?: boolean;
  messagesEnabled?: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
}

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
   * The signed-in student's notification feed.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param params - Paging and filters.
   * @returns A page of notifications.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getNotifications: (accessToken: string | undefined, params: NotificationQuery = {}) =>
    api.get<NotificationListResponse>(`${API_ENDPOINTS.NOTIFICATIONS}${buildQuery({ page: 1, limit: 10, ...params })}`, {
      accessToken,
    }),

  /**
   * School announcements addressed to one recipient.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param userId - The signed-in student's user-account id.
   * @param page - 1-based page number.
   * @param limit - Page size.
   * @returns A page of announcements.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getAnnouncements: (accessToken: string | undefined, userId: string, page = 1, limit = 10) =>
    api.get<NotificationListResponse>(
      `${API_ENDPOINTS.NOTIFICATIONS}/announcements/receiver/${userId}${buildQuery({ page, limit })}`,
      { accessToken }
    ),

  /**
   * Marks one notification read for the signed-in student.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param notificationId - The notification to mark.
   * @param userId - The reader's user-account id.
   * @returns Nothing useful; the server answers 200 or 204.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  markNotificationAsRead: (accessToken: string | undefined, notificationId: string, userId: string) =>
    api.put<unknown>(`${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`, { userId }, { accessToken }),

  /**
   * Marks one announcement read for the signed-in student.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @param announcementId - The announcement to mark.
   * @param userId - The reader's user-account id.
   * @returns Nothing useful; the server answers 200 or 204.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  markAnnouncementAsRead: (accessToken: string | undefined, announcementId: string, userId: string) =>
    api.put<unknown>(
      `${API_ENDPOINTS.NOTIFICATIONS}/announcements/${announcementId}/read`,
      { userId },
      { accessToken }
    ),

  /**
   * The signed-in student's notification preferences.
   *
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The stored preference document.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getPreferences: (accessToken?: string) =>
    api.get<NotificationPreferences>(`${API_ENDPOINTS.NOTIFICATIONS}/preferences`, { accessToken }),

  /**
   * Updates one or more notification preferences.
   *
   * @param patch - Only the switches that changed; the API whitelists fields.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The updated preference document.
   * @throws {ApiError} `VALIDATION_FAILED` when a field is not on the DTO.
   */
  updatePreferences: (patch: NotificationPreferences, accessToken?: string) =>
    api.patch<NotificationPreferences>(`${API_ENDPOINTS.NOTIFICATIONS}/preferences`, patch, { accessToken }),
};
