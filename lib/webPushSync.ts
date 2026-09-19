/**
 * Keeps the backend's web-push row in step with the browser.
 *
 * The backend keeps one row per push endpoint. Browsers can rotate or revoke
 * an endpoint behind the app's back, and the service worker (which has no
 * session token) is the first to hear about it:
 *
 * - `public/sw.js` re-subscribes on `pushsubscriptionchange` and leaves a note
 *   in the Cache API (`PENDING_URL`) naming the endpoints the server should
 *   forget, then pings open tabs.
 * - {@link startWebPushSync} runs {@link reconcileWebPush} on app start, when a
 *   tab is pinged, and when the browser permission changes.
 *
 * Everything here is best-effort and never throws, and nothing here ever asks
 * for notification permission: that only happens from a user gesture.
 */
import { API_BASE_URL } from "@/lib/constants";
import { api } from "@/lib/authFetch";
import {
  CONFIG_URL,
  PENDING_URL,
  SW_PATH,
  forgetLocalFlags,
  getCurrentSubscription,
  isPushSupported,
  pushEndpointKey,
  pushFlagKey,
  readNote,
  syncWebPushPreference,
  urlBase64ToUint8Array,
  writeNote,
} from "@/lib/webPush";

/** Fired on `window` when reconcile changed what the toggle should show. */
export const PUSH_STATE_EVENT = "talim:push-state-changed";

const SUBSCRIBE_URL = `${API_BASE_URL}/notifications/web-push/subscribe`;
const VAPID_URL = `${API_BASE_URL}/notifications/web-push/vapid-public-key`;

/** What {@link reconcileWebPush} did. */
export type ReconcileResult =
  | "unsupported"
  | "no-user"
  | "idle"
  | "healed"
  | "resubscribed"
  | "cleared"
  | "failed";

/** What the service worker needs to re-subscribe without the page. */
interface SyncConfig {
  apiBaseUrl?: string;
  vapidKey?: string;
}

/**
 * Tells the service worker where the API is and which VAPID key we use, so it
 * can re-subscribe when no tab is open.
 *
 * @param config - Fields to merge into the saved config.
 */
async function saveSyncConfig(config: SyncConfig): Promise<void> {
  const existing = (await readNote<SyncConfig>(CONFIG_URL)) ?? {};
  await writeNote(CONFIG_URL, { ...existing, apiBaseUrl: API_BASE_URL, ...config });
}

/**
 * The endpoints the service worker says the server should forget.
 *
 * @returns Stale endpoints, or an empty list.
 */
async function readStaleEndpoints(): Promise<string[]> {
  const pending = await readNote<{ staleEndpoints?: string[] }>(PENDING_URL);
  return pending?.staleEndpoints ?? [];
}

/**
 * The service worker registration, registering it the first time.
 *
 * @returns The registration.
 */
async function getOrRegisterSW(): Promise<ServiceWorkerRegistration> {
  let registration = await navigator.serviceWorker.getRegistration(SW_PATH);
  if (!registration) {
    registration = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
    await navigator.serviceWorker.ready;
  }
  return registration;
}

/**
 * The server's VAPID public key. Public route: a 401 must not trigger a refresh.
 *
 * @returns The key.
 * @throws When the server does not return one.
 */
async function getVapidKey(): Promise<string> {
  const { publicKey } = await api.get<{ publicKey: string }>(VAPID_URL, { skipAuth: true });
  if (!publicKey) throw new Error("Unable to load push configuration from server");
  return publicKey;
}

/**
 * Subscribes this browser to push with the server's key. Permission has
 * already been granted; this never prompts.
 *
 * @returns The subscription and the key it was made with.
 */
async function subscribeBrowser(): Promise<{ subscription: PushSubscription; vapidKey: string }> {
  const [vapidKey, registration] = await Promise.all([getVapidKey(), getOrRegisterSW()]);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidKey),
  });
  return { subscription, vapidKey };
}

/**
 * Registers a subscription with the backend (idempotent on the endpoint).
 *
 * @param subscription - The browser's subscription.
 * @returns The endpoint that was registered.
 */
async function registerSubscription(subscription: PushSubscription): Promise<string> {
  const { endpoint, keys } = subscription.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
  await api.post(SUBSCRIBE_URL, { endpoint, keys, userAgent: navigator.userAgent });
  return endpoint;
}

/**
 * Asks the backend to forget an endpoint, with the live session.
 *
 * @param endpoint - The push endpoint.
 */
async function forgetServerSubscription(endpoint: string): Promise<void> {
  await api.delete(SUBSCRIBE_URL, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });
}

/**
 * Records that this user has this browser subscribed, and where.
 *
 * @param userId - The signed-in user.
 * @param endpoint - The endpoint just registered.
 */
async function rememberSubscription(userId: string, endpoint: string): Promise<void> {
  try {
    localStorage.setItem(pushFlagKey(userId), "true");
    localStorage.setItem(pushEndpointKey(userId), endpoint);
  } catch {
    // Storage can be unavailable; the browser's own subscription still decides.
  }
  await writeNote(PENDING_URL, null);
}

/**
 * Turns browser push on for a user who just asked to (permission has already
 * been granted by the toggle's click). Throws so the toggle can show the failure.
 *
 * @param userId - The signed-in user, when known.
 */
export async function enableWebPush(userId?: string | null): Promise<void> {
  const { subscription, vapidKey } = await subscribeBrowser();
  const endpoint = await registerSubscription(subscription);
  if (userId) await rememberSubscription(userId, endpoint);
  await saveSyncConfig({ vapidKey });
  await syncWebPushPreference(true);
}

/**
 * Turns browser push off for a user who just asked to. Throws so the toggle
 * can show the failure.
 *
 * @param userId - The signed-in user, when known.
 */
export async function disableWebPush(userId?: string | null): Promise<void> {
  await syncWebPushPreference(false);
  const subscription = await getCurrentSubscription();
  if (subscription) {
    await forgetServerSubscription(subscription.endpoint);
    await subscription.unsubscribe();
  }
  forgetLocalFlags(userId);
  await writeNote(PENDING_URL, null);
}

/**
 * Makes the backend agree with the browser for a user who opted in. Safe to
 * call as often as you like and never prompts:
 *
 * - permission `granted` and a subscription held: re-register it (idempotent),
 *   and forget endpoints the service worker says were rotated away;
 * - permission `granted` but the subscription is gone: re-subscribe silently;
 * - permission `denied` / `default` while the flag says subscribed: clear the
 *   flag and forget the server record.
 *
 * @param userId - The signed-in user; without one there is nothing to do.
 * @returns What happened. Never throws.
 */
export async function reconcileWebPush(userId: string | null | undefined): Promise<ReconcileResult> {
  try {
    if (!isPushSupported()) return "unsupported";
    if (!userId) return "no-user";
    if (localStorage.getItem(pushFlagKey(userId)) !== "true") return "idle";

    if (Notification.permission !== "granted") {
      await clearRevoked(userId);
      notifyStateChanged();
      return "cleared";
    }

    let subscription = await getCurrentSubscription();
    let resubscribed = false;
    let vapidKey: string | undefined;
    if (!subscription) {
      ({ subscription, vapidKey } = await subscribeBrowser());
      resubscribed = true;
    }

    const endpoint = await registerSubscription(subscription);
    const previous = localStorage.getItem(pushEndpointKey(userId));
    const stale = new Set([...(await readStaleEndpoints()), ...(previous ? [previous] : [])]);
    stale.delete(endpoint);
    await Promise.allSettled([...stale].map((old) => forgetServerSubscription(old)));

    await rememberSubscription(userId, endpoint);
    await saveSyncConfig(vapidKey ? { vapidKey } : {});
    if (resubscribed || stale.size > 0) notifyStateChanged();
    return resubscribed ? "resubscribed" : "healed";
  } catch {
    return "failed";
  }
}

/**
 * The browser took notifications away (or reset them) while we thought we were
 * subscribed: forget the flag first, then tell the server.
 *
 * @param userId - The user whose subscription is gone.
 */
async function clearRevoked(userId: string): Promise<void> {
  const stored = localStorage.getItem(pushEndpointKey(userId));
  forgetLocalFlags(userId);
  const subscription = await getCurrentSubscription().catch(() => null);
  const endpoints = new Set([...(await readStaleEndpoints()), ...(stored ? [stored] : [])]);
  if (subscription) endpoints.add(subscription.endpoint);
  await Promise.allSettled([
    ...[...endpoints].map((endpoint) => forgetServerSubscription(endpoint)),
    subscription ? subscription.unsubscribe() : Promise.resolve(),
  ]);
  await writeNote(PENDING_URL, null);
}

/** Tells any mounted toggle to re-read the browser's state. */
function notifyStateChanged(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PUSH_STATE_EVENT));
}

/**
 * Keeps the backend subscription in step with the browser for the signed-in
 * user: reconciles now, again whenever the service worker reports a rotated
 * subscription, and again when the browser permission changes.
 *
 * @param userId - The signed-in user.
 * @returns A function that stops listening.
 */
export function startWebPushSync(userId: string): () => void {
  if (!isPushSupported()) return () => undefined;
  const run = (): void => {
    void reconcileWebPush(userId);
  };
  run();

  const onMessage = (event: MessageEvent): void => {
    if ((event.data as { type?: string } | null)?.type === "PUSH_SUBSCRIPTION_CHANGED") run();
  };
  navigator.serviceWorker.addEventListener("message", onMessage);

  let permissionStatus: PermissionStatus | null = null;
  let disposed = false;
  navigator.permissions
    ?.query({ name: "notifications" })
    .then((status) => {
      if (disposed) return;
      permissionStatus = status;
      status.addEventListener("change", run);
    })
    .catch(() => undefined);

  return () => {
    disposed = true;
    navigator.serviceWorker.removeEventListener("message", onMessage);
    permissionStatus?.removeEventListener("change", run);
  };
}
