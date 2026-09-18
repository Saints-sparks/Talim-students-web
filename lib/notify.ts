import { toast } from "@/components/CustomToast";
import { messageForError } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";

/**
 * Shows the student one sentence about a failure, keyed on `error.code`, and
 * logs the detail for the developer. This is the only way the app turns a
 * thrown value into a toast — so the wording stays consistent everywhere.
 *
 * @param scope - Area it came from, e.g. "settings".
 * @param error - Whatever was thrown.
 * @param fallback - Shown when the error carries nothing usable.
 */
export function notifyError(scope: string, error: unknown, fallback?: string): void {
  logger.error(scope, fallback ?? "Request failed", error);
  toast.error(messageForError(error, fallback));
}

/**
 * Confirms a completed action.
 *
 * @param message - What just succeeded, in the student's words.
 */
export function notifySuccess(message: string): void {
  toast.success(message);
}
