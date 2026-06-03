"use client";

import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationToggle() {
  const { isSupported, permission, isSubscribed, isLoading, error, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) {
    return (
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-medium text-gray-900">Browser Notifications</p>
          <p className="text-xs text-gray-400 mt-0.5">Not supported in this browser</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Unavailable</span>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-medium text-gray-900">Browser Notifications</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Blocked by browser —{" "}
            <a
              href="https://support.google.com/chrome/answer/3220216"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              how to enable
            </a>
          </p>
        </div>
        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">Blocked</span>
      </div>
    );
  }

  const handleToggle = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe();
      } else {
        await subscribe();
      }
    } catch {
      // error displayed via hook state
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-900">Browser Notifications</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {isSubscribed
            ? "Receiving grade results, assessment reminders, and school announcements in this browser."
            : "Get notified about grades, assessments, and announcements even when the tab is closed."}
        </p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isSubscribed ? "Disable browser notifications" : "Enable browser notifications"}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isSubscribed ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isSubscribed ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
