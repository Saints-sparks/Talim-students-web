// lib/webPush.ts
// Browser push helpers shared by the settings toggle and sign-out.
import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import type { NotificationPreferencesBody, WebPushUnsubscribePayload } from "@/types/apiPayloads";

// Per-user so the next person on a shared browser never inherits the flag.
const STORAGE_KEY_PREFIX = "talim:push-subscribed:";
export const LEGACY_STORAGE_KEY = "talim:push-subscribed";
export const SW_PATH = "/sw.js";
/** Cache the service worker and the page share notes in. Mirrors `public/sw.js`. */
export const SYNC_CACHE = "talim-push-sync";
/** Note left by the service worker: endpoints the server should forget. Mirrors `public/sw.js`. */
export const PENDING_URL = "/__talim_push__/pending";
/** Note left by the page: what the service worker needs to re-subscribe alone. Mirrors `public/sw.js`. */
export const CONFIG_URL = "/__talim_push__/config";

/**
 * The per-user localStorage key recording that this browser is subscribed.
 *
 * @param userId - The signed-in user.
 * @returns The storage key.
 */
export const pushFlagKey = (userId: string) => `${STORAGE_KEY_PREFIX}${userId}`;

/**
 * The per-user localStorage record of the last endpoint registered with the server.
 *
 * @param userId - The signed-in user.
 * @returns The storage key.
 */
export const pushEndpointKey = (userId: string) => `talim:push-endpoint:${userId}`;

/**
 * Decodes a URL-safe base64 VAPID key into the bytes `pushManager.subscribe` expects.
 *
 * @param base64String - The public key from the server.
 * @returns The decoded key.
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
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
 * Reads a JSON note from the cache shared with the service worker.
 *
 * @param url - The note's key.
 * @returns The parsed note, or `null` when missing or unreadable.
 */
export async function readNote<T>(url: string): Promise<T | null> {
  try {
    if (typeof caches === "undefined") return null;
    const cache = await caches.open(SYNC_CACHE);
    const response = await cache.match(url);
    return response ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}

/**
 * Writes (or with `null`, removes) a JSON note in the shared cache.
 *
 * @param url - The note's key.
 * @param value - The note, or `null` to delete it.
 */
export async function writeNote(url: string, value: unknown): Promise<void> {
  try {
    if (typeof caches === "undefined") return;
    const cache = await caches.open(SYNC_CACHE);
    if (value === null) {
      await cache.delete(url);
      return;
    }
    await cache.put(url, new Response(JSON.stringify(value), { headers: { "Content-Type": "application/json" } }));
  } catch {
    // Notes are a hint: reconcile also works from what the browser holds.
  }
}

/**
 * Forgets the per-user flag and endpoint (and the old shared flag).
 *
 * @param userId - The user whose flag to clear.
 */
export function forgetLocalFlags(userId?: string | null): void {
  try {
    if (userId) {
      localStorage.removeItem(pushFlagKey(userId));
      localStorage.removeItem(pushEndpointKey(userId));
    }
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}

/**
 * Sync webPushEnabled (browser push; `pushEnabled` is the phone switch) to the
 * backend NotificationPreference — best-effort, never throws.
 */
export async function syncWebPushPreference(enabled: boolean): Promise<void> {
  try {
    const body: Pick<NotificationPreferencesBody, "webPushEnabled"> = { webPushEnabled: enabled };
    await api.patch(`${API_BASE_URL}/notifications/preferences`, body);
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
    let stored: string | null = null;
    try {
      stored = userId ? localStorage.getItem(pushEndpointKey(userId)) : null;
    } catch {
      // Storage unavailable: the browser's own subscription is still handled below.
    }
    forgetLocalFlags(userId);
    await writeNote(PENDING_URL, null);

    const subscription = await getCurrentSubscription();
    if (!subscription && !stored) return;

    const endpoints = new Set<string>(stored ? [stored] : []);
    if (subscription) endpoints.add(subscription.endpoint);
    await Promise.allSettled([
      // The session is already cleared by now, so the token captured before
      // sign-out is passed explicitly instead of being read from the store.
      ...(accessToken
        ? [...endpoints].map((endpoint) => {
            const body: WebPushUnsubscribePayload = { endpoint };
            return api.delete(`${API_BASE_URL}/notifications/web-push/subscribe`, {
              accessToken,
              retryOnUnauthorized: false,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            });
          })
        : []),
      subscription ? subscription.unsubscribe() : Promise.resolve(),
    ]);
  } catch {
    // Signing out must never fail because of push cleanup.
  }
}
