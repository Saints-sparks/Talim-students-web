/**
 * Error codes the Talim API returns in `error.code`. Mirrors
 * `talimBE-V2/src/common/http/api-error-code.enum.ts`; the last three are
 * raised client-side and never come from the server.
 */
export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "TOKEN_EXPIRED"
  | "FORBIDDEN"
  | "PASSWORD_CHANGE_REQUIRED"
  | "TENANT_MISMATCH"
  | "VALIDATION_FAILED"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "PAYMENT_PROVIDER_ERROR"
  | "INSUFFICIENT_BALANCE"
  | "DUPLICATE_REFERENCE"
  | "WALLET_UNAVAILABLE"
  | "INVALID_STATE_TRANSITION"
  | "INTERNAL_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "NETWORK_OFFLINE"
  | "REQUEST_TIMEOUT"
  | "UNKNOWN";

/** One field-level problem from a `VALIDATION_FAILED` response. */
export interface ApiErrorDetail {
  /** Name of the offending field, when the server knows it. */
  field?: string;
  /** Human-readable explanation of what is wrong with it. */
  reason: string;
}

/** Shape of a failed response body (see talimBE-V2/docs/api-contract.md). */
interface ApiErrorBody {
  success?: false;
  statusCode?: number;
  message?: string | string[];
  error?: { code?: string; message?: string; details?: ApiErrorDetail[] } | string;
  requestId?: string;
}

const KNOWN_CODES = new Set<ApiErrorCode>([
  "UNAUTHENTICATED",
  "TOKEN_EXPIRED",
  "FORBIDDEN",
  "PASSWORD_CHANGE_REQUIRED",
  "TENANT_MISMATCH",
  "VALIDATION_FAILED",
  "BAD_REQUEST",
  "NOT_FOUND",
  "CONFLICT",
  "PAYLOAD_TOO_LARGE",
  "RATE_LIMITED",
  "PAYMENT_PROVIDER_ERROR",
  "INSUFFICIENT_BALANCE",
  "DUPLICATE_REFERENCE",
  "WALLET_UNAVAILABLE",
  "INVALID_STATE_TRANSITION",
  "INTERNAL_ERROR",
  "SERVICE_UNAVAILABLE",
]);

/**
 * Fallback user-facing message per HTTP status, for servers that return none.
 *
 * @param status - The HTTP status of the failed response.
 * @returns A sentence safe to show a student.
 */
function messageForStatus(status: number): string {
  if (status === 401) return "Sign in to continue.";
  if (status === 403) return "You don't have access to this.";
  if (status === 404) return "We couldn't find that.";
  if (status === 409) return "That conflicts with something that already exists.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status >= 500) return "Something went wrong on our side. Please try again.";
  return "The request could not be completed.";
}

/**
 * Maps an HTTP status onto a stable code, for servers that return none.
 *
 * @param status - The HTTP status of the failed response.
 * @returns The closest matching `ApiErrorCode`.
 */
function codeForStatus(status: number): ApiErrorCode {
  if (status === 401) return "UNAUTHENTICATED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 413) return "PAYLOAD_TOO_LARGE";
  if (status === 429) return "RATE_LIMITED";
  if (status === 503) return "SERVICE_UNAVAILABLE";
  if (status >= 500) return "INTERNAL_ERROR";
  return status === 400 ? "BAD_REQUEST" : "UNKNOWN";
}

/**
 * The one error type every service throws. Pages branch on `code`, show
 * `message` to the student, and map `details` onto form fields.
 *
 * @example
 * try { await api.put("/notifications/prefs", body); }
 * catch (err) {
 *   if (err instanceof ApiError && err.code === "VALIDATION_FAILED") setErrors(err.fieldErrors());
 *   else toast.error(getErrorMessage(err));
 * }
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details: ApiErrorDetail[];
  readonly requestId?: string;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number,
    details: ApiErrorDetail[] = [],
    requestId?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
    this.requestId = requestId;
  }

  /**
   * Builds an error from a non-2xx response. Understands both the canonical
   * envelope (`error.code`) and Nest's legacy `{ statusCode, message }` shape.
   *
   * @param response - The failed response.
   * @param body - Its parsed JSON body, if any.
   * @returns The typed error to throw.
   */
  static fromResponse(response: Response, body: ApiErrorBody | null): ApiError {
    const status = response.status;
    const requestId = body?.requestId ?? response.headers.get("x-request-id") ?? undefined;
    const errorObj = body && typeof body.error === "object" ? body.error : undefined;

    let code: ApiErrorCode = codeForStatus(status);
    if (errorObj?.code && KNOWN_CODES.has(errorObj.code as ApiErrorCode)) {
      code = errorObj.code as ApiErrorCode;
    }

    let details: ApiErrorDetail[] = errorObj?.details ?? [];
    let message = errorObj?.message ?? (typeof body?.message === "string" ? body.message : undefined);

    // Legacy ValidationPipe shape: message is an array of constraint strings.
    if (Array.isArray(body?.message)) {
      code = "VALIDATION_FAILED";
      details = body.message.map((reason) => ({ reason: String(reason) }));
      message = "Some fields need attention.";
    }

    if (status === 401 && message && /expired/i.test(message)) code = "TOKEN_EXPIRED";
    if (!message || (status >= 500 && !errorObj)) message = messageForStatus(status);

    return new ApiError(code, message, status, details, requestId);
  }

  /**
   * The device has no network connection.
   *
   * @returns The offline error.
   */
  static offline(): ApiError {
    return new ApiError("NETWORK_OFFLINE", "You're offline. Check your connection and try again.", 0);
  }

  /**
   * The request never reached the server (DNS, CORS, server down).
   *
   * @returns The unreachable error.
   */
  static unreachable(): ApiError {
    return new ApiError("SERVICE_UNAVAILABLE", "We couldn't reach the server. Please try again in a moment.", 0);
  }

  /**
   * The request exceeded the client timeout.
   *
   * @returns The timeout error.
   */
  static timeout(): ApiError {
    return new ApiError("REQUEST_TIMEOUT", "The server took too long to respond. Please try again.", 0);
  }

  /** True when the session is gone and the student must sign in again. */
  get isAuthError(): boolean {
    return this.code === "UNAUTHENTICATED" || this.code === "TOKEN_EXPIRED";
  }

  /** True when retrying without changing anything could succeed. */
  get isTransient(): boolean {
    return (
      this.code === "NETWORK_OFFLINE" ||
      this.code === "SERVICE_UNAVAILABLE" ||
      this.code === "REQUEST_TIMEOUT" ||
      this.code === "RATE_LIMITED" ||
      this.status >= 500
    );
  }

  /**
   * Field-level errors as `{ [field]: reason }`, for binding to form inputs.
   * Details without a field are dropped; use `message` for those.
   *
   * @returns One reason per field, first occurrence wins.
   */
  fieldErrors(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const d of this.details) if (d.field && !out[d.field]) out[d.field] = d.reason;
    return out;
  }
}

/**
 * A user-safe message for any thrown value. Use this in `catch` blocks instead
 * of `err.message`, which may be a stack-ish string for non-API errors.
 *
 * @param err - Whatever was thrown.
 * @param fallback - Shown when the error carries no usable message.
 * @returns A sentence safe to show a student.
 */
export function getErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error && err.message && !/^(TypeError|Failed to fetch)/.test(err.message)) return err.message;
  return fallback;
}
