// lib/constants.ts
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
