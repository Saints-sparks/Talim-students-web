"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { getErrorMessage } from "@/lib/apiError";
import { getCurrentSubscription, isPushSupported, pushFlagKey } from "@/lib/webPush";
import { PUSH_STATE_EVENT, disableWebPush, enableWebPush } from "@/lib/webPushSync";

/** The browser's notification permission for this origin. */
export type PushPermission = "default" | "granted" | "denied";

/** What {@link usePushNotifications} returns. */
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
 * Manages this browser's web-push subscription for the signed-in student.
 * Permission is only ever requested from `subscribe`, which the toggle calls
 * from a click. Keeping the backend in step with the browser is
 * `startWebPushSync`'s job (mounted once by `AuthProvider`).
 *
 * @returns Whether push is supported and subscribed, plus subscribe/unsubscribe.
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
  // tells us this subscription was made by the signed-in user. Re-read when
  // the background reconcile changes something.
  useEffect(() => {
    if (!isPushSupported()) return;
    setIsSupported(true);

    let cancelled = false;
    const refresh = () => {
      setPermission(Notification.permission as PushPermission);
      getCurrentSubscription()
        .then((subscription) => {
          if (cancelled) return;
          const mine = Boolean(userId && localStorage.getItem(pushFlagKey(userId)) === "true");
          setIsSubscribed(Boolean(subscription) && mine && Notification.permission === "granted");
        })
        .catch(() => {
          if (!cancelled) setIsSubscribed(false);
        });
    };
    refresh();
    window.addEventListener(PUSH_STATE_EVENT, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(PUSH_STATE_EVENT, refresh);
    };
  }, [userId]);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Only ever called from the toggle's click handler.
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult as PushPermission);

      if (permissionResult !== "granted") {
        throw new Error(
          permissionResult === "denied"
            ? "Notification permission was blocked. Please enable it in your browser settings."
            : "Notification permission was dismissed.",
        );
      }

      await enableWebPush(userId);
      setIsSubscribed(true);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to enable push notifications"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await disableWebPush(userId);
      setIsSubscribed(false);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to disable push notifications"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { isSupported, permission, isSubscribed, isLoading, error, subscribe, unsubscribe };
}
