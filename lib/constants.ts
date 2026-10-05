// lib/constants.ts
import type { operations } from "@/types/api";

// The API origin comes from the environment so each deployment (local, preview,
// production) points at its own backend. Next.js inlines NEXT_PUBLIC_* at build
// time, so a missing value fails the build here rather than at runtime.
const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!configuredApiBaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local for local development, or set it in the deployment's environment variables."
  );
}

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

/** The apps the API tells apart by `X-Talim-App` (from the generated contract). */
export type TalimApp = NonNullable<
  NonNullable<operations["AuthenticationController_refreshToken"]["parameters"]["header"]>["X-Talim-App"]
>;

/** The request header that names the calling app to the API. */
export const TALIM_APP_HEADER = "X-Talim-App";

/**
 * This portal's name for the API. Sent on every request from the API client
 * (`lib/authFetch.ts`), so the API keeps the students' refresh token in their
 * own `refreshToken_students` cookie (a parent signed in to another portal in
 * the same browser no longer replaces it) and refuses any other role's sign-in.
 */
export const TALIM_APP: TalimApp = "students";
export const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || API_BASE_URL;

/**
 * The fixed endpoints the auth flow and the inbox use; the learner screens
 * build theirs in `services/learner.service.ts` and `services/account.service.ts`.
 */
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  INTROSPECT: `${API_BASE_URL}/auth/introspect`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
} as const;
