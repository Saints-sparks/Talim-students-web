import { ApiError, type ApiErrorCode, getErrorMessage } from "@/lib/apiError";

/**
 * One user-facing sentence per error code. Keyed on `error.code` — never on
 * message text, which the server is free to reword.
 */
const MESSAGE_BY_CODE: Record<ApiErrorCode, string> = {
  UNAUTHENTICATED: "Your session has ended. Please sign in again.",
  TOKEN_EXPIRED: "Your session has expired. Please sign in again.",
  FORBIDDEN: "You don't have access to this.",
  PASSWORD_CHANGE_REQUIRED: "Please set a new password before continuing.",
  TENANT_MISMATCH: "This belongs to a different school.",
  VALIDATION_FAILED: "Some details need attention.",
  BAD_REQUEST: "We couldn't complete that request.",
  NOT_FOUND: "We couldn't find that.",
  CONFLICT: "That conflicts with something that already exists.",
  PAYLOAD_TOO_LARGE: "That file is too large.",
  RATE_LIMITED: "Too many attempts. Please wait a moment and try again.",
  PAYMENT_PROVIDER_ERROR: "The payment provider is unavailable right now.",
  INSUFFICIENT_BALANCE: "There isn't enough balance for that.",
  DUPLICATE_REFERENCE: "That has already been submitted.",
  WALLET_UNAVAILABLE: "Payments are unavailable right now.",
  INVALID_STATE_TRANSITION: "That can't be done at this stage.",
  INTERNAL_ERROR: "Something went wrong on our side. Please try again.",
  SERVICE_UNAVAILABLE: "We couldn't reach the server. Please try again in a moment.",
  NETWORK_OFFLINE: "You're offline. Check your connection and try again.",
  REQUEST_TIMEOUT: "The server took too long to respond. Please try again.",
  UNKNOWN: "Something went wrong. Please try again.",
};

/**
 * The one sentence to show a student for a failure — the app's single toast
 * and error-state vocabulary. Branches on `error.code`; anything that is not
 * an `ApiError` falls back to its message, then to the caller's fallback.
 *
 * @param error - Whatever was thrown.
 * @param fallback - Used when nothing better is available.
 * @returns A sentence safe to show a student.
 */
export function messageForError(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) {
    // A server-written message is more specific than the generic per-code one,
    // except for the codes where the server's text is developer-facing.
    const generic: ApiErrorCode[] = ["INTERNAL_ERROR", "UNKNOWN", "BAD_REQUEST"];
    if (!generic.includes(error.code) && error.message) return error.message;
    return MESSAGE_BY_CODE[error.code];
  }
  return getErrorMessage(error, fallback);
}
