// lib/webPush.ts
// Browser push helpers shared by the settings toggle and sign-out.
import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";

// Per-user so the next person on a shared browser never inherits the flag.
const STORAGE_KEY_PREFIX = "talim:push-subscribed:";
export const LEGACY_STORAGE_KEY = "talim:push-subscribed";
export const SW_PATH = "/sw.js";

/**
 * The per-user localStorage key recording that this browser is subscribed.
 *
 * @param userId - The signed-in user.
 * @returns The storage key.
 */
export const pushFlagKey = (userId: string) => `${STORAGE_KEY_PREFIX}${userId}`;

/**
 * Decodes a URL-safe base64 VAPID key into the bytes `pushManager.subscribe` expects.
 *
 * @param base64String - The public key from the server.
 * @returns The decoded key.
 */
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

/**
 * Whether this browser can do web push at all (service worker, PushManager, Notification).
 *
 * @returns True when push is available.
 */
export const isPushSupported = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

/**
 * The browser's current push subscription for our service worker, if any.
 *
 * @returns The subscription, or `null` when there is none or push is unsupported.
 */
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
    await api.patch(`${API_BASE_URL}/notifications/preferences`, { webPushEnabled: enabled });
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
      // The session is already cleared by now, so the token captured before
      // sign-out is passed explicitly instead of being read from the store.
      accessToken
        ? api.delete(`${API_BASE_URL}/notifications/web-push/subscribe`, {
            accessToken,
            retryOnUnauthorized: false,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint }),
          })
        : Promise.resolve(),
      subscription.unsubscribe(),
    ]);
  } catch {
    // Signing out must never fail because of push cleanup.
  }
}
