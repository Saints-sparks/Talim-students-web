"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import InboxHeader from "@/components/notifications/InboxHeader";
import NotificationDetail from "@/components/notifications/NotificationDetail";
import { ListToolbar, NotificationList, Tabs } from "@/components/notifications/NotificationList";
import { categoryMeta, type SortKey, type TabKey } from "@/components/notifications/meta";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";
import { useNotifications } from "@/hooks/useNotifications";
import { filterNotifications } from "@/lib/notifications/filter";
import type { StudentNotification } from "@/lib/notifications/normalize";
import { cn } from "@/lib/utils";

/**
 * The student's inbox: school announcements and system notifications in one
 * list, with a reading pane beside it.
 *
 * The list and the detail pane each scroll inside their own container, so the
 * page itself never scrolls and the two panes stay aligned.
 *
 * @returns The notifications page.
 */
export default function NotificationsPage() {
  const { isLoading: isAuthLoading } = useAuthContext();
  const { markStepComplete } = useStudentOnboarding();
  const { notifications, loading, error, counts, refetch, markAsRead, markAllAsRead } = useNotifications();

  const [activeTab, setActiveTab] = React.useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("newest");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = React.useState(false);

  React.useEffect(() => {
    markStepComplete("view-notifications");
  }, [markStepComplete]);

  const filteredNotifications = React.useMemo(
    () =>
      filterNotifications(notifications, {
        tab: activeTab,
        query: searchQuery,
        sort: sortKey,
        categoryLabel: (notification) => categoryMeta[notification.category].label,
      }),
    [activeTab, notifications, searchQuery, sortKey]
  );

  React.useEffect(() => {
    if (!filteredNotifications.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !filteredNotifications.some((item) => item.id === selectedId)) {
      setSelectedId(filteredNotifications[0].id);
    }
  }, [filteredNotifications, selectedId]);

  const selectedNotification =
    filteredNotifications.find((notification) => notification.id === selectedId) ?? filteredNotifications[0] ?? null;

  const handleSelect = (notification: StudentNotification) => {
    setSelectedId(notification.id);
    setMobileDetailOpen(true);
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F8F8] dark:bg-[#0B1224]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366] dark:text-blue-300" />
      </div>
    );
  }

  return (
    <Layout>
      <div
        className="h-full overflow-hidden bg-[#F7F9FC] dark:bg-[#0B1224]"
        data-guide-ready={loading ? "false" : "true"}
        aria-busy={loading}
      >
        <div className="flex h-full flex-col gap-4 overflow-hidden px-3 py-4 sm:px-5 lg:px-6">
          <InboxHeader
            unreadCount={counts.unread}
            loading={loading}
            onRefresh={() => void refetch()}
            onMarkAllAsRead={() => void markAllAsRead()}
          />

          <div className="flex min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_430px]">
            <section
              data-guide="notifications-list"
              className={cn(
                "min-h-0 flex-col rounded-2xl border border-[#E5EAF2] bg-white shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44]",
                mobileDetailOpen && selectedNotification ? "hidden lg:flex" : "flex"
              )}
            >
              <Tabs activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />
              <ListToolbar query={searchQuery} onQueryChange={setSearchQuery} sort={sortKey} onSortChange={setSortKey} />
              <NotificationList
                notifications={filteredNotifications}
                selectedId={selectedNotification?.id}
                loading={loading}
                error={error}
                totalCount={notifications.length}
                onSelect={handleSelect}
                onRetry={() => void refetch()}
              />
            </section>

            <section
              data-guide="notifications-detail"
              className={cn(
                "min-h-0 flex-col rounded-2xl border border-[#E5EAF2] bg-white shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44] lg:flex",
                mobileDetailOpen && selectedNotification ? "flex" : "hidden"
              )}
            >
              <NotificationDetail
                notification={selectedNotification}
                onBack={() => setMobileDetailOpen(false)}
                onMarkAsRead={() => {
                  if (selectedNotification) void markAsRead(selectedNotification.id);
                }}
              />
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
