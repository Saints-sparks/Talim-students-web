"use client";

import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  LEGACY_STORAGE_KEY,
  SW_PATH,
  getCurrentSubscription,
  isPushSupported,
  pushAuthFetch,
  pushFlagKey,
  syncWebPushPreference,
  urlBase64ToUint8Array,
} from "@/lib/webPush";

/**
 *
 */
export type PushPermission = "default" | "granted" | "denied";

/**
 *
 */
export interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: PushPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

/**
 *
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const { user } = useAuthContext();
  const userId = user?.userId || user?.id || null;

  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<PushPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The browser's real subscription decides the toggle; the per-user flag only
  // tells us this subscription was made by the signed-in user.
  useEffect(() => {
    if (!isPushSupported()) return;
    setIsSupported(true);
    setPermission(Notification.permission as PushPermission);

    let cancelled = false;
    getCurrentSubscription()
      .then((subscription) => {
        if (cancelled) return;
        const mine = Boolean(userId && localStorage.getItem(pushFlagKey(userId)) === "true");
        setIsSubscribed(Boolean(subscription) && mine);
      })
      .catch(() => {
        if (!cancelled) setIsSubscribed(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const getVapidKey = useCallback(async (): Promise<string> => {
    const res = await fetch(`${API_BASE_URL}/notifications/web-push/vapid-public-key`);
    if (!res.ok) throw new Error("Unable to load push configuration from server");
    const { publicKey } = await res.json();
    return publicKey;
  }, []);

  const getOrRegisterSW = useCallback(async (): Promise<ServiceWorkerRegistration> => {
    let reg = await navigator.serviceWorker.getRegistration(SW_PATH);
    if (!reg) {
      reg = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
      await navigator.serviceWorker.ready;
    }
    return reg;
  }, []);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult as PushPermission);

      if (permissionResult !== "granted") {
        throw new Error(
          permissionResult === "denied"
            ? "Notification permission was blocked. Please enable it in your browser settings."
            : "Notification permission was dismissed.",
        );
      }

      const [vapidKey, registration] = await Promise.all([
        getVapidKey(),
        getOrRegisterSW(),
      ]);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const subJson = subscription.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      const res = await pushAuthFetch(`${API_BASE_URL}/notifications/web-push/subscribe`, {
        method: "POST",
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          userAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to save push subscription on server");
      }

      if (userId) localStorage.setItem(pushFlagKey(userId), "true");
      setIsSubscribed(true);

      await syncWebPushPreference(true);
    } catch (err: any) {
      setError(err.message || "Failed to enable push notifications");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getVapidKey, getOrRegisterSW, userId]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await syncWebPushPreference(false);

      const subscription = await getCurrentSubscription();

      if (subscription) {
        await pushAuthFetch(`${API_BASE_URL}/notifications/web-push/subscribe`, {
          method: "DELETE",
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      if (userId) localStorage.removeItem(pushFlagKey(userId));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      setIsSubscribed(false);
    } catch (err: any) {
      setError(err.message || "Failed to disable push notifications");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { isSupported, permission, isSubscribed, isLoading, error, subscribe, unsubscribe };
}
