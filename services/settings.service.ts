// services/settings.service.ts
import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import { fixturesEnabled } from "@/lib/fixtures/flag";
import type { ChangePasswordBody, ChatPreferencesBody } from "@/types/apiPayloads";

/**
 * The body `POST /auth/change-password` declares (`ChangePasswordDto`), from
 * the generated contract. All three are required, and `confirmPassword` must
 * equal `newPassword` or the API rejects the request.
 */
export type ChangePasswordPayload = ChangePasswordBody;

/** What the API returns after a successful password change. */
export interface ChangePasswordResult {
  /** The old sessions are revoked, so this token replaces the current one. */
  access_token: string;
  message: string;
}

/**
 * The chat preferences a student can set (`UpdateChatPreferencesDto`), from the
 * generated contract. `showOnlineStatus` off means you always show offline to others.
 */
export type ChatPreferences = ChatPreferencesBody & {
  /**
   * B10 `ChatPreference.messagePreview`: when false, push text reads "New
   * message". Not in the vendored contract yet (hand-added).
   */
  messagePreview?: boolean;
};

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
  changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResult> => {
    if (fixturesEnabled()) return { access_token: "", message: "Password changed" };
    return api.post<ChangePasswordResult>(`${API_BASE_URL}/auth/change-password`, payload);
  },

  /**
   * The signed-in student's chat preferences.
   *
   * @returns The stored preferences.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getChatPreferences: async (): Promise<ChatPreferences> => {
    if (fixturesEnabled()) return { showOnlineStatus: true, readReceipts: true, messagePreview: true };
    return api.get<ChatPreferences>(`${API_BASE_URL}/chat/preferences`);
  },

  /**
   * Updates one or more chat preferences.
   *
   * @param patch - Only the switches that changed; the API whitelists fields.
   * @returns The updated preferences.
   * @throws {ApiError} `VALIDATION_FAILED` when a field is not on the DTO.
   */
  updateChatPreferences: async (patch: ChatPreferences): Promise<ChatPreferences> => {
    if (fixturesEnabled()) return patch;
    return api.patch<ChatPreferences>(`${API_BASE_URL}/chat/preferences`, patch);
  },
};
