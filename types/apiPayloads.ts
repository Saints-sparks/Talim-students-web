/**
 * Request payloads of every write endpoint the student portal calls, taken
 * from the backend contract (`./api.d.ts`) instead of written by hand.
 *
 * The API runs `whitelist + forbidNonWhitelisted`: a field the DTO does not
 * declare is a 400, and a renamed one is silently dropped or rejected. Building
 * a body against one of these aliases makes `tsc` compare the client's payload
 * with the DTO, so a backend change that the portal has not followed fails the
 * type-check instead of failing in production.
 */
import type { MultipartBody, RequestBody } from "./apiContract";

// ─── Authentication ─────────────────────────────────────────────────────────

/** `POST /auth/login`. */
export type LoginPayload = RequestBody<"/auth/login">;
/** `POST /auth/introspect`. */
export type IntrospectPayload = RequestBody<"/auth/introspect">;
/** `POST /auth/forgot-password`. */
export type ForgotPasswordPayload = RequestBody<"/auth/forgot-password">;
/** `POST /auth/reset-password`. */
export type ResetPasswordPayload = RequestBody<"/auth/reset-password">;
/** `POST /auth/change-password`. */
export type ChangePasswordBody = RequestBody<"/auth/change-password">;
/**
 * `PUT /auth/profile/avatar` with a hosted image URL. The contract publishes
 * this endpoint as multipart only (`avatar` file + `avatarUrl`), so the JSON
 * form is derived from the multipart field rather than from a JSON body.
 */
export type AvatarUrlPayload = Required<Pick<MultipartBody<"/auth/profile/avatar", "put">, "avatarUrl">>;

// ─── Notifications and preferences ──────────────────────────────────────────

/** `PATCH /notifications/preferences`. */
export type NotificationPreferencesBody = RequestBody<"/notifications/preferences", "patch">;
/** `PATCH /chat/preferences`. */
export type ChatPreferencesBody = RequestBody<"/chat/preferences", "patch">;
/** `PUT /notifications/announcements/:id/read`. */
export type MarkAnnouncementReadBody = RequestBody<"/notifications/announcements/{id}/read", "put">;
/** `POST /notifications/web-push/subscribe`. */
export type WebPushSubscribePayload = RequestBody<"/notifications/web-push/subscribe">;
/** `DELETE /notifications/web-push/subscribe` (the endpoint travels in the body). */
export type WebPushUnsubscribePayload = RequestBody<"/notifications/web-push/subscribe", "delete">;

// ─── Academics and chat ─────────────────────────────────────────────────────

/** `POST /curriculum/by-course-term`. */
export type CurriculumByCourseTermBody = RequestBody<"/curriculum/by-course-term">;
/** `POST /chat/rooms`. */
export type CreateChatRoomBody = RequestBody<"/chat/rooms">;
