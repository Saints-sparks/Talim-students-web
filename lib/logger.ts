/**
 * Client-side logging.
 *
 * Pages and services used bare `console.error`, which shipped stack traces and
 * request payloads to every student's browser console in production. Route
 * diagnostics through here instead: in development it prints with a scope, in
 * production it stays silent unless `NEXT_PUBLIC_DEBUG_LOGS` is set.
 *
 * A logged error is never a substitute for showing the student what happened —
 * log for the developer, then surface a message keyed on `error.code`.
 */
const enabled = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEBUG_LOGS === "true";

/**
 * Formats the scope prefix once, e.g. `[results]`.
 *
 * @param scope - Area the entry came from.
 * @returns The bracketed prefix.
 */
function prefix(scope: string): string {
  return `[${scope}]`;
}

export const logger = {
  /**
   * Reports a failure the student has already been told about some other way.
   *
   * @param scope - Area it came from, e.g. "results" or "auth".
   * @param message - What was being attempted.
   * @param error - The thrown value, if any.
   */
  error(scope: string, message: string, error?: unknown): void {
    if (!enabled) return;
    console.error(prefix(scope), message, error ?? "");
  },

  /**
   * Reports something unexpected that did not break the flow.
   *
   * @param scope - Area it came from.
   * @param message - What happened.
   * @param detail - Optional extra context.
   */
  warn(scope: string, message: string, detail?: unknown): void {
    if (!enabled) return;
    console.warn(prefix(scope), message, detail ?? "");
  },

  /**
   * Development-only trace. Never shown in production builds.
   *
   * @param scope - Area it came from.
   * @param message - What happened.
   * @param detail - Optional extra context.
   */
  debug(scope: string, message: string, detail?: unknown): void {
    if (!enabled) return;
    console.debug(prefix(scope), message, detail ?? "");
  },
};
