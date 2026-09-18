"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { onApiError } from "@/lib/authFetch";

/**
 * A persistent banner while the browser has no connection.
 *
 * Listens to the browser's own online/offline events and to the API client, so
 * a request that fails because the network went away also raises it — the
 * `online` flag alone lies on captive portals and flaky mobile data.
 *
 * @returns The banner, or nothing while the student is online.
 */
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    setOffline(typeof navigator !== "undefined" && navigator.onLine === false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    const unsubscribe = onApiError((error) => {
      if (error.code === "NETWORK_OFFLINE") setOffline(true);
    });

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      unsubscribe();
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-md dark:bg-amber-600"
    >
      <WifiOff className="h-4 w-4" />
      You&apos;re offline. We&apos;ll reconnect automatically.
    </div>
  );
}
