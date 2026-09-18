import type { StudentNotification } from "@/lib/notifications/normalize";
import type { SortKey, TabKey } from "@/components/notifications/meta";

/**
 * Filters the inbox by tab and free-text search, then orders it.
 *
 * Search covers the title, body, sender and source so a student can find a
 * notification by any of the words actually on screen.
 *
 * @param notifications - Every notification in the inbox.
 * @param options - The active tab, query and sort.
 * @param options.tab - Which tab is selected.
 * @param options.query - The raw search box contents.
 * @param options.sort - How to order the result.
 * @param options.categoryLabel - Maps a notification to its visible category label.
 * @returns The notifications to render, in order.
 */
export function filterNotifications(
  notifications: StudentNotification[],
  options: {
    tab: TabKey;
    query: string;
    sort: SortKey;
    categoryLabel: (notification: StudentNotification) => string;
  }
): StudentNotification[] {
  const needle = options.query.trim().toLowerCase();

  const filtered = notifications.filter((notification) => {
    const matchesTab =
      options.tab === "all"
        ? true
        : options.tab === "unread"
          ? notification.unread
          : notification.category === options.tab;
    if (!matchesTab) return false;
    if (!needle) return true;

    return [
      notification.title,
      notification.message,
      notification.senderName,
      notification.sourceLabel,
      options.categoryLabel(notification),
    ]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return filtered.sort((a, b) => {
    if (options.sort === "unread" && a.unread !== b.unread) return a.unread ? -1 : 1;
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return options.sort === "oldest" ? aTime - bTime : bTime - aTime;
  });
}
