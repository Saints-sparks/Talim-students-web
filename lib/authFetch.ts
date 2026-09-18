import { destroyCookie, setCookie } from "nookies";
import { API_ENDPOINTS } from "@/lib/constants";
import { ApiError } from "@/lib/apiError";
import { sessionStore } from "@/lib/session";

/** Request options accepted by the client (a superset of `fetch`'s). */
export interface RequestConfig extends RequestInit {
  /**
   * Bearer token to send instead of the stored one. Existing callers pass the
   * token they hold in React state; new code should omit it and let the client
   * read the session.
   */
  accessToken?: string | null;
  /**
   * Send without the bearer token and never attempt a token refresh. Use for
   * public auth calls (login, refresh, forgot/reset password): a 401 there
   * means "wrong credentials", not "session expired".
   */
  skipAuth?: boolean;
  /** Abort after this many milliseconds. Default 30 000. */
  timeoutMs?: number;
  /** Set to `false` to surface a 401 instead of refreshing and retrying. */
  retryOnUnauthorized?: boolean;
  /** Internal: set once a request has been retried after a token refresh. */
  _retry?: boolean;
}

/** The canonical success envelope the API wraps responses in. */
interface SuccessEnvelope<T> {
  success: true;
  data: T;
}

type ErrorListener = (error: ApiError) => void;

const DEFAULT_TIMEOUT_MS = 30_000;

const isBrowser = () => typeof window !== "undefined";

/**
 * Persists a freshly minted access token and tells the rest of the app.
 *
 * @param token - The new access token.
 */
function persistAccessToken(token: string): void {
  if (!isBrowser()) return;

  localStorage.setItem("accessToken", token);
  sessionStore.setToken(token);
  setCookie(null, "access_token", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  window.dispatchEvent(new CustomEvent("auth-token-refreshed", { detail: { accessToken: token } }));
}

/** Drops every trace of the session and fires `auth-refresh-failed`. */
function clearClientAuth(): void {
  if (!isBrowser()) return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  destroyCookie(null, "access_token");
  destroyCookie(null, "refresh_token");
  sessionStore.clear();

  window.dispatchEvent(new CustomEvent("auth-refresh-failed"));
}

let refreshPromise: Promise<string> | null = null;

/**
 * Exchanges the refresh cookie for a new access token (single-flight: every
 * caller during a refresh awaits the same promise). On failure the client
 * session is cleared and `auth-refresh-failed` is fired, which AuthContext
 * turns into a sign-out.
 *
 * @returns The new access token.
 * @throws {ApiError} When the refresh cookie is gone or rejected.
 */
export async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = fetch(API_ENDPOINTS.REFRESH, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new ApiError("TOKEN_EXPIRED", "Your session has expired. Please sign in again.", response.status);
        }
        const body = unwrapEnvelope(await response.json().catch(() => null)) as {
          access_token?: string;
        } | null;
        if (!body?.access_token) {
          throw new ApiError("TOKEN_EXPIRED", "Your session has expired. Please sign in again.", response.status);
        }
        persistAccessToken(body.access_token);
        return body.access_token;
      })
      .catch((error) => {
        clearClientAuth();
        throw error instanceof ApiError
          ? error
          : new ApiError("TOKEN_EXPIRED", "Your session has expired. Please sign in again.", 401);
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

/**
 * Unwraps the canonical `{ success, data }` envelope. Responses that predate
 * the envelope are returned untouched, so a mixed API keeps working.
 *
 * @param body - The parsed response body.
 * @returns The payload the caller asked for.
 */
export function unwrapEnvelope(body: unknown): unknown {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const envelope = body as Partial<SuccessEnvelope<unknown>>;
    if (envelope.success === true && "data" in envelope) return envelope.data;
  }
  return body;
}

const errorListeners = new Set<ErrorListener>();

/**
 * Subscribes to every `ApiError` the client produces — the offline banner and
 * the global toast use this, so pages don't each handle connectivity.
 *
 * @param listener - Called with each error as it is raised.
 * @returns An unsubscribe function.
 */
export function onApiError(listener: ErrorListener): () => void {
  errorListeners.add(listener);
  return () => {
    errorListeners.delete(listener);
  };
}

/**
 * Tells every listener about an error without letting one break a request.
 *
 * @param error - The error that was raised.
 */
function emitError(error: ApiError): void {
  for (const listener of errorListeners) {
    try {
      listener(error);
    } catch {
      /* a listener must never break a request */
    }
  }
}

/**
 * The token to send with a request: the caller's override, then the session,
 * then whatever is still in storage from a previous page load.
 *
 * @param override - A token the caller passed explicitly.
 * @returns The bearer token, or `null` when signed out.
 */
function resolveToken(override?: string | null): string | null {
  if (override) return override;
  return sessionStore.getToken();
}

/**
 * Performs `fetch` with a timeout and connectivity handling. Throws `ApiError`
 * for offline / unreachable / timed-out requests; returns the `Response` of any
 * status otherwise.
 *
 * @param input - URL or Request to send.
 * @param config - Fetch options plus `timeoutMs`.
 * @returns The raw response.
 */
async function doFetch(input: RequestInfo | URL, config: RequestConfig): Promise<Response> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    const error = ApiError.offline();
    emitError(error);
    throw error;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const upstream = config.signal;
  if (upstream) upstream.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    return await fetch(input, { ...config, signal: controller.signal });
  } catch (err) {
    if (upstream?.aborted) throw err;
    let error: ApiError;
    if ((err as Error)?.name === "AbortError") {
      error = ApiError.timeout();
    } else if (typeof navigator !== "undefined" && navigator.onLine === false) {
      error = ApiError.offline();
    } else {
      error = ApiError.unreachable();
    }
    emitError(error);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Builds the headers for one request: the caller's, plus `Accept` and the
 * bearer token unless `skipAuth` was set.
 *
 * @param config - The request configuration.
 * @param tokenOverride - Token to use instead of the resolved one (on retry).
 * @returns Headers ready to hand to `fetch`.
 */
function buildHeaders(config: RequestConfig, tokenOverride?: string | null): Headers {
  const headers = new Headers(config.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (config.skipAuth) return headers;

  const token = tokenOverride ?? resolveToken(config.accessToken);
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

/**
 * The single HTTP entry point. Attaches the bearer token, refreshes it once on
 * 401 (single-flight), and reports offline / unreachable / timed-out requests
 * as `ApiError`s so pages never see a raw `TypeError`.
 *
 * Returns the raw `Response` for any status. Prefer the typed `api` facade
 * below, which parses the body, unwraps the envelope and throws `ApiError`.
 *
 * @param input - Absolute URL (or `Request`) to call.
 * @param options - Fetch options plus `accessToken`, `skipAuth`, `timeoutMs`.
 * @returns The raw response.
 */
export async function authFetch(input: RequestInfo | URL, options: RequestConfig = {}): Promise<Response> {
  const { accessToken, retryOnUnauthorized = true, skipAuth, timeoutMs, _retry, headers, credentials, ...rest } = options;
  const config: RequestConfig = { ...rest, accessToken, skipAuth, timeoutMs, headers };

  const response = await doFetch(input, {
    ...rest,
    headers: buildHeaders(config),
    credentials: credentials ?? "include",
    timeoutMs,
    signal: options.signal,
  });

  if (response.status !== 401 || skipAuth || !retryOnUnauthorized || _retry) return response;

  const nextToken = await refreshAccessToken();
  return doFetch(input, {
    ...rest,
    headers: buildHeaders(config, nextToken),
    credentials: credentials ?? "include",
    timeoutMs,
    signal: options.signal,
  });
}

/**
 * Sends a request and parses the JSON body, unwrapping the `{ success, data }`
 * envelope. Any non-2xx becomes an `ApiError` carrying the server's
 * `error.code`, message and field details.
 *
 * @typeParam T - Shape of the payload inside the envelope.
 * @param url - Absolute URL to call.
 * @param config - Fetch options plus `accessToken`, `skipAuth`, `timeoutMs`.
 * @returns The parsed payload (`null` for an empty body such as a 204).
 * @throws {ApiError} On any non-2xx, offline, unreachable or timed-out request.
 */
export async function requestJson<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const response = await authFetch(url, config);
  const text = await response.text().catch(() => "");

  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    const error = ApiError.fromResponse(response, body as Parameters<typeof ApiError.fromResponse>[1]);
    emitError(error);
    throw error;
  }

  return unwrapEnvelope(body) as T;
}

/**
 * Builds a JSON (or FormData) request config for a body-carrying method.
 *
 * @param method - HTTP verb to use.
 * @param data - Body to send; `FormData` is passed through untouched.
 * @param config - The caller's request options.
 * @returns A config ready for `requestJson`.
 */
function bodyConfig(method: string, data: unknown, config: RequestConfig): RequestConfig {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const headers = new Headers(config.headers);
  if (!isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return {
    ...config,
    method,
    headers,
    body: data === undefined ? undefined : isFormData ? (data as FormData) : JSON.stringify(data),
  };
}

/**
 * Typed facade over the client: every method parses the body, unwraps the
 * envelope and throws `ApiError` on any non-2xx, offline, unreachable or
 * timed-out request. Use this in all new and migrated code — never call
 * `fetch` directly.
 *
 * @example
 * const courses = await api.get<PublishedCourse[]>(`${API_BASE_URL}/…`);
 */
export const api = {
  /**
   * `GET` returning the parsed payload.
   *
   * @typeParam T - Shape of the payload.
   * @param url - Absolute URL to call.
   * @param config - Request options.
   * @returns The parsed payload.
   */
  get: <T = unknown>(url: string, config: RequestConfig = {}) => requestJson<T>(url, { ...config, method: "GET" }),

  /**
   * `POST` returning the parsed payload.
   *
   * @typeParam T - Shape of the payload.
   * @param url - Absolute URL to call.
   * @param data - Body to send.
   * @param config - Request options.
   * @returns The parsed payload.
   */
  post: <T = unknown>(url: string, data?: unknown, config: RequestConfig = {}) =>
    requestJson<T>(url, bodyConfig("POST", data, config)),

  /**
   * `PUT` returning the parsed payload.
   *
   * @typeParam T - Shape of the payload.
   * @param url - Absolute URL to call.
   * @param data - Body to send.
   * @param config - Request options.
   * @returns The parsed payload.
   */
  put: <T = unknown>(url: string, data?: unknown, config: RequestConfig = {}) =>
    requestJson<T>(url, bodyConfig("PUT", data, config)),

  /**
   * `PATCH` returning the parsed payload.
   *
   * @typeParam T - Shape of the payload.
   * @param url - Absolute URL to call.
   * @param data - Body to send.
   * @param config - Request options.
   * @returns The parsed payload.
   */
  patch: <T = unknown>(url: string, data?: unknown, config: RequestConfig = {}) =>
    requestJson<T>(url, bodyConfig("PATCH", data, config)),

  /**
   * `DELETE` returning the parsed payload.
   *
   * @typeParam T - Shape of the payload.
   * @param url - Absolute URL to call.
   * @param config - Request options.
   * @returns The parsed payload.
   */
  delete: <T = unknown>(url: string, config: RequestConfig = {}) => requestJson<T>(url, { ...config, method: "DELETE" }),
};
