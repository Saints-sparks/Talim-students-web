/**
 * Pure rules for deleting an account (v1.5): the notices sign-in shows, the
 * sign-in URL that carries the date, and where a refusal's message goes.
 * No React.
 */
import { ApiError } from "@/lib/apiError";
import { messageForError } from "@/lib/errorMessages";
import { formatLongDayMonthYear } from "@/lib/learner/format";

/** The sign-in toast when a sign-in cancelled a scheduled deletion (`deletionCancelled: true`). */
export const DELETION_CANCELLED_MESSAGE = "Welcome back. Your account deletion has been cancelled.";

/** The sign-in query parameter that carries the scheduled deletion date (ISO). */
export const DELETION_NOTICE_PARAM = "deletionScheduledFor";

/** The most a deletion reason may hold (the backend's limit). */
export const DELETION_REASON_MAX = 500;

/** Copy for each refusal of `POST /auth/account/deletion`, used when the server sends no message. */
export const DELETION_ERROR_COPY: Readonly<Record<string, string>> = {
  ADMIN_ACCOUNT: "Talim platform admin accounts can't be deleted from here.",
  LAST_SCHOOL_ADMIN: "You are your school's only admin. Make another admin first, or contact Talim support.",
  DELETION_SCHEDULED: "Your account is already scheduled for deletion.",
};

/**
 * The notice sign-in shows after a deletion request.
 *
 * @param scheduledFor - `scheduledFor` from the 200 response (ISO).
 * @returns "Your account will be deleted on 8 November 2026. Sign in before then to cancel."
 */
export function deletionScheduledMessage(scheduledFor: string | null | undefined): string {
  const date = formatLongDayMonthYear(scheduledFor);
  return `Your account will be deleted ${date ? `on ${date}` : "in 30 days"}. Sign in before then to cancel.`;
}

/**
 * The sign-in URL to land on after a deletion request, carrying the date.
 *
 * @param scheduledFor - `scheduledFor` from the 200 response (ISO). The
 *   contract marks it optional (it is sent with `status: "scheduled"` only);
 *   without it the URL is the plain sign-in route.
 * @returns e.g. `/signin?deletionScheduledFor=2026-11-08T10%3A00%3A00.000Z`.
 */
export function deletionScheduledRoute(scheduledFor: string | undefined): string {
  if (!scheduledFor) return "/signin";
  return `/signin?${new URLSearchParams({ [DELETION_NOTICE_PARAM]: scheduledFor }).toString()}`;
}

/** Where the scheduled date waits for the sign-in page (one read, then gone). */
const PENDING_NOTICE_KEY = "talim_student_deletion_notice";

/**
 * Keeps the scheduled date for the sign-in page. Signing out lets the portal
 * guard open sign-in before the dated route is pushed, and the page reads its
 * URL only once, so the date travels this way too.
 *
 * @param scheduledFor - When the account will be erased (ISO date-time).
 * @returns Nothing; a browser that blocks storage keeps only the URL route.
 */
export function rememberDeletionNotice(scheduledFor: string): void {
  try {
    window.sessionStorage.setItem(PENDING_NOTICE_KEY, scheduledFor);
  } catch {
    /* storage blocked: the URL still carries the date when it wins */
  }
}

/**
 * Takes the remembered scheduled date (once) as the sign-in notice.
 *
 * @returns The notice, or null when nothing (or nothing readable) was remembered.
 */
export function takeRememberedDeletionNotice(): string | null {
  try {
    const value = window.sessionStorage.getItem(PENDING_NOTICE_KEY);
    window.sessionStorage.removeItem(PENDING_NOTICE_KEY);
    return value ? deletionNoticeFromSearch(`?${new URLSearchParams({ [DELETION_NOTICE_PARAM]: value }).toString()}`) : null;
  } catch {
    return null;
  }
}

/**
 * The deletion notice a sign-in URL asks for.
 *
 * @param search - `window.location.search`.
 * @returns The notice, or null when the URL carries no readable date.
 */
export function deletionNoticeFromSearch(search: string): string | null {
  const value = new URLSearchParams(search).get(DELETION_NOTICE_PARAM);
  if (!value || Number.isNaN(new Date(value).getTime())) return null;
  return deletionScheduledMessage(value);
}

/**
 * Where a failed deletion request's message belongs: on the password field
 * for a wrong password (a 400 whose field errors name `password`, read with
 * `ApiError.fieldErrors()`), otherwise in the banner over the form. Refusals
 * are keyed on the route's own `code` (`ApiError.reasonCode`), never on
 * message text.
 *
 * @param error - Whatever `POST /auth/account/deletion` threw.
 * @returns The field message or the banner message (the other is null).
 */
export function deletionErrorMessage(error: unknown): { field: string | null; banner: string | null } {
  if (error instanceof ApiError) {
    const password = error.fieldErrors().password;
    if (password) return { field: password, banner: null };
    const reason = error.reasonCode;
    if (reason && DELETION_ERROR_COPY[reason]) return { field: null, banner: error.message || DELETION_ERROR_COPY[reason] };
  }
  return { field: null, banner: messageForError(error, "We couldn't delete your account. Please try again.") };
}
