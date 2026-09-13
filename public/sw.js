/* Talim Students — Web Push Service Worker */

const DEFAULT_ICON = "/icons/icon-192x192.png";
const DEFAULT_BADGE = "/icons/badge-72x72.png";

/** Same-origin absolute URL for a notification's target. */
function resolveUrl(url) {
  try {
    const resolved = new URL(url || "/dashboard", self.location.origin);
    return resolved.origin === self.location.origin
      ? resolved.href
      : new URL("/dashboard", self.location.origin).href;
  } catch (e) {
    return new URL("/dashboard", self.location.origin).href;
  }
}

/** True when a client window is showing the same page (path + ?room=). */
function isSamePage(clientUrl, targetUrl) {
  try {
    const a = new URL(clientUrl);
    const b = new URL(targetUrl);
    return (
      a.origin === b.origin &&
      a.pathname === b.pathname &&
      (a.searchParams.get("room") || "") === (b.searchParams.get("room") || "")
    );
  } catch (e) {
    return false;
  }
}

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "Talim", body: event.data.text() };
  }

  const payload = data.data || {};
  const options = {
    body: data.body || "",
    icon: data.icon || DEFAULT_ICON,
    badge: data.badge || DEFAULT_BADGE,
    tag: data.tag || "talim-notification",
    renotify: Boolean(data.tag),
    data: payload,
    requireInteraction: data.requireInteraction || false,
    silent: false,
  };

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Don't notify about the chat the user is looking at right now.
        if (payload.url) {
          const target = resolveUrl(payload.url);
          const viewing = clientList.some(
            (client) => client.focused && isSamePage(client.url, target)
          );
          if (viewing) return;
        }
        return self.registration.showNotification(
          data.title || "Talim Notification",
          options
        );
      })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = resolveUrl(event.notification.data?.url);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const client =
          clientList.find((c) => isSamePage(c.url, url)) ||
          clientList.find((c) => "focus" in c);
        if (client) {
          // The app routes to the url (see RealtimeAlerts).
          client.postMessage({ type: "OPEN_URL", url });
          return client.focus();
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
