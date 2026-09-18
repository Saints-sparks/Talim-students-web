// services/settings.service.ts
import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";

/** The body `POST /auth/change-password` declares. All three are required. */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  /** Must equal `newPassword`; the API rejects the request otherwise. */
  confirmPassword: string;
}

/** What the API returns after a successful password change. */
export interface ChangePasswordResult {
  /** The old sessions are revoked, so this token replaces the current one. */
  access_token: string;
  message: string;
}

/** The chat preferences a student can set (`UpdateChatPreferencesDto`). */
export interface ChatPreferences {
  messageNotifications?: boolean;
  allowTeacherMessages?: boolean;
  schoolAnnouncements?: boolean;
  readReceipts?: boolean;
}

export const settingsService = {
  /**
   * Changes the signed-in student's password.
   *
   * Uses `POST /auth/change-password`, which every role may call — the
   * `/settings/security/change-password` alias is gated to school admins and
   * answers 403 for a student.
   *
   * @param payload - Current password, new password and its confirmation.
   * @returns A fresh access token and the server's confirmation message.
   * @throws {ApiError} `VALIDATION_FAILED` for a wrong, weak or reused password.
   */
  changePassword: (payload: ChangePasswordPayload): Promise<ChangePasswordResult> =>
    api.post<ChangePasswordResult>(`${API_BASE_URL}/auth/change-password`, payload),

  /**
   * The signed-in student's chat preferences.
   *
   * @returns The stored preferences.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getChatPreferences: (): Promise<ChatPreferences> => api.get<ChatPreferences>(`${API_BASE_URL}/chat/preferences`),

  /**
   * Updates one or more chat preferences.
   *
   * @param patch - Only the switches that changed; the API whitelists fields.
   * @returns The updated preferences.
   * @throws {ApiError} `VALIDATION_FAILED` when a field is not on the DTO.
   */
  updateChatPreferences: (patch: ChatPreferences): Promise<ChatPreferences> =>
    api.patch<ChatPreferences>(`${API_BASE_URL}/chat/preferences`, patch),
};
