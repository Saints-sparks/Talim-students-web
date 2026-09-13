import { destroyCookie, setCookie } from "nookies";
import { API_ENDPOINTS } from "@/lib/constants";

type AuthFetchOptions = RequestInit & {
  accessToken?: string | null;
  retryOnUnauthorized?: boolean;
};

type RefreshResponse = {
  access_token: string;
};

let refreshPromise: Promise<string> | null = null;

const isBrowser = () => typeof window !== "undefined";

const persistAccessToken = (token: string) => {
  if (!isBrowser()) return;

  localStorage.setItem("accessToken", token);
  setCookie(null, "access_token", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  window.dispatchEvent(
    new CustomEvent("auth-token-refreshed", { detail: { accessToken: token } })
  );
};

const clearClientAuth = () => {
  if (!isBrowser()) return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  destroyCookie(null, "access_token");
  destroyCookie(null, "refresh_token");

  window.dispatchEvent(new CustomEvent("auth-refresh-failed"));
};

/**
 * Exchanges the refresh cookie for a new access token (single-flight). On
 * failure the client session is cleared and `auth-refresh-failed` is fired,
 * which the AuthContext turns into a sign-out.
 */
export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = fetch(API_ENDPOINTS.REFRESH, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Session expired. Please log in again.");
        }

        const data = (await response.json()) as RefreshResponse;
        if (!data.access_token) {
          throw new Error("Refresh response did not include an access token.");
        }

        persistAccessToken(data.access_token);
        return data.access_token;
      })
      .catch((error) => {
        clearClientAuth();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const authFetch = async (
  input: RequestInfo | URL,
  options: AuthFetchOptions = {}
): Promise<Response> => {
  const {
    accessToken,
    retryOnUnauthorized = true,
    headers,
    credentials,
    ...fetchOptions
  } = options;

  const token =
    accessToken ?? (isBrowser() ? localStorage.getItem("accessToken") : null);

  const requestHeaders = new Headers(headers);
  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...fetchOptions,
    headers: requestHeaders,
    credentials: credentials ?? "include",
  });

  if (!retryOnUnauthorized || response.status !== 401) {
    return response;
  }

  const nextToken = await refreshAccessToken();
  const retryHeaders = new Headers(headers);
  retryHeaders.set("Authorization", `Bearer ${nextToken}`);

  return fetch(input, {
    ...fetchOptions,
    headers: retryHeaders,
    credentials: credentials ?? "include",
  });
};
