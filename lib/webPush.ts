// lib/webPush.ts
// Browser push helpers shared by the settings toggle and sign-out.
import { API_BASE_URL } from "@/lib/constants";

// Per-user so the next person on a shared browser never inherits the flag.
const STORAGE_KEY_PREFIX = "talim:push-subscribed:";
export const LEGACY_STORAGE_KEY = "talim:push-subscribed";
export const SW_PATH = "/sw.js";

export const pushFlagKey = (userId: string) => `${STORAGE_KEY_PREFIX}${userId}`;

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || null;
}

export async function pushAuthFetch(
  url: string,
  options: RequestInit = {},
  token: string | null = getAccessToken(),
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

export const isPushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const reg = await navigator.serviceWorker.getRegistration(SW_PATH);
  return (await reg?.pushManager.getSubscription()) ?? null;
}

/**
 * Sync webPushEnabled (browser push; `pushEnabled` is the phone switch) to the
 * backend NotificationPreference — best-effort, never throws.
 */
export async function syncWebPushPreference(enabled: boolean): Promise<void> {
  try {
    await pushAuthFetch(`${API_BASE_URL}/notifications/preferences`, {
      method: "PATCH",
      body: JSON.stringify({ webPushEnabled: enabled }),
    });
  } catch {
    // Non-fatal — subscription state is already persisted by the browser
  }
}

/**
 * Signing out: stop this browser receiving the user's pushes. Pass the access
 * token captured before the session is cleared. Best-effort, never throws.
 */
export async function unsubscribeBrowserPush(
  accessToken: string | null,
  userId?: string | null,
): Promise<void> {
  try {
    if (userId) localStorage.removeItem(pushFlagKey(userId));
    localStorage.removeItem(LEGACY_STORAGE_KEY);

    const subscription = await getCurrentSubscription();
    if (!subscription) return;

    const endpoint = subscription.endpoint;
    await Promise.allSettled([
      accessToken
        ? pushAuthFetch(
            `${API_BASE_URL}/notifications/web-push/subscribe`,
            { method: "DELETE", body: JSON.stringify({ endpoint }) },
            accessToken,
          )
        : Promise.resolve(),
      subscription.unsubscribe(),
    ]);
  } catch {
    // Signing out must never fail because of push cleanup.
  }
}
