"use client";

import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationToggle() {
  const { isSupported, permission, isSubscribed, isLoading, error, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) {
    return (
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-slate-200">Browser Notifications</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Not supported in this browser</p>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded">Unavailable</span>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="py-3" role="status">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-900 dark:text-slate-200">Browser Notifications</p>
          <span className="flex-shrink-0 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-slate-700 dark:text-slate-300">
            Off in this browser
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
          Your browser is set not to show Talim alerts, so you will not see pop-up notifications while Talim is closed
          or in the background. Notifications inside Talim keep working as usual.
        </p>
        <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
          To turn them back on, open this site&apos;s settings from your browser&apos;s address bar (usually the icon
          beside the web address), set Notifications to Allow, and reload the page.
        </p>
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
        <p className="text-sm font-medium text-gray-900 dark:text-slate-200">Browser Notifications</p>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
          {isSubscribed
            ? "Receiving grade results, assessment reminders, and school announcements in this browser."
            : "Get notified about grades, assessments, and announcements even when the tab is closed."}
        </p>
        {error && <p className="text-xs text-red-500 dark:text-red-300 mt-1" role="alert">{error}</p>}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isSubscribed ? "Disable browser notifications" : "Enable browser notifications"}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isSubscribed ? "bg-blue-600" : "bg-gray-200 dark:bg-slate-600"
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
