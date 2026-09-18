"use client";

import { AlertCircle, ChevronDown, ChevronRight, Loader2, MailOpen, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { categoryMeta, formatDate, formatTime, sortLabel, TABS, type SortKey, type TabKey } from "@/components/notifications/meta";
import type { NotificationCounts, StudentNotification } from "@/lib/notifications/normalize";

/**
 * The category tabs, each with its count.
 *
 * @param props - Component props.
 * @param props.activeTab - Which tab is selected.
 * @param props.counts - How many notifications sit in each.
 * @param props.onTabChange - Called with the newly selected tab.
 * @returns The tab bar.
 */
export function Tabs({
  activeTab,
  counts,
  onTabChange,
}: {
  activeTab: TabKey;
  counts: NotificationCounts;
  onTabChange: (tab: TabKey) => void;
}) {
  return (
    <div className="border-b border-[#E8EDF5] p-3 dark:border-[#30435F]" data-guide="notifications-tabs">
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#E5EAF2] bg-[#F8FAFD] p-1 dark:border-[#30435F] dark:bg-[#111C31] sm:grid sm:grid-cols-6 sm:gap-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition sm:h-10 sm:min-h-0 sm:text-sm",
                isActive
                  ? "bg-white text-[#003366] shadow-sm ring-1 ring-[#DCE5F2] dark:bg-[#1B2A44] dark:text-blue-200 dark:ring-[#30435F]"
                  : "text-[#667085] hover:bg-white/80 hover:text-[#101828] dark:text-slate-300 dark:hover:bg-[#1B2A44] dark:hover:text-white"
              )}
            >
              <span className="whitespace-nowrap">{tab.label}</span>
              <span
                className={cn(
                  "min-w-5 rounded-full px-1.5 py-0.5 text-xs",
                  isActive
                    ? "bg-[#E7F0FF] text-[#003366] dark:bg-blue-900/50 dark:text-blue-100"
                    : "bg-[#EDF2F8] text-[#667085] dark:bg-[#243853] dark:text-slate-300"
                )}
              >
                {counts[tab.key] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The search box and sort dropdown above the list.
 *
 * @param props - Component props.
 * @param props.query - Current search text.
 * @param props.onQueryChange - Called as the student types.
 * @param props.sort - Active sort order.
 * @param props.onSortChange - Called when the sort changes.
 * @returns The toolbar.
 */
export function ListToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
}) {
  return (
    <div
      data-guide="notifications-search-sort"
      className="flex flex-col gap-3 border-b border-[#E8EDF5] p-4 dark:border-[#30435F] md:flex-row"
    >
      <div className="flex h-11 flex-1 items-center rounded-xl border border-[#DCE5F2] bg-white px-3 transition focus-within:border-[#003366] focus-within:ring-4 focus-within:ring-[#003366]/10 dark:border-[#30435F] dark:bg-[#111C31]">
        <Search className="mr-2 h-4 w-4 text-[#738195] dark:text-slate-400" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="h-full border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 dark:text-slate-100"
          placeholder="Search notifications..."
          aria-label="Search notifications"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="rounded-full p-1 text-[#738195] transition hover:bg-[#EDF2F8] hover:text-[#102A43] dark:hover:bg-[#243853] dark:hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-11 justify-between rounded-xl border-[#DCE5F2] bg-white text-[#344054] shadow-none dark:border-[#30435F] dark:bg-[#111C31] dark:text-slate-200 md:w-44"
          >
            <span className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4 rotate-90 text-[#738195]" />
              {sortLabel(sort)}
            </span>
            <ChevronDown className="h-4 w-4 text-[#738195]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="font-manrope">
          <DropdownMenuItem onClick={() => onSortChange("newest")}>Newest first</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("oldest")}>Oldest first</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("unread")}>Unread first</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * One row in the inbox.
 *
 * @param props - Component props.
 * @param props.notification - The notification to render.
 * @param props.selected - Whether it is the one open in the detail pane.
 * @param props.onSelect - Called when the row is clicked.
 * @returns The row element.
 */
function NotificationRow({
  notification,
  selected,
  onSelect,
}: {
  notification: StudentNotification;
  selected: boolean;
  onSelect: (notification: StudentNotification) => void;
}) {
  const meta = categoryMeta[notification.category];
  const Icon = meta.Icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={cn(
        "group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-[#EEF2F7] px-4 py-4 text-left transition hover:bg-[#F8FBFF] dark:border-[#243853] dark:hover:bg-[#1B2A44]",
        selected && "bg-[#F4F8FF] ring-1 ring-inset ring-[#83B7FF] dark:bg-[#1B3558] dark:ring-blue-500"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn("h-2.5 w-2.5 rounded-full", notification.unread ? "bg-[#0B74DE]" : "bg-[#CBD5E1] dark:bg-slate-600")}
          aria-label={notification.unread ? "Unread" : "Read"}
        />
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", meta.iconClass)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="truncate text-sm font-semibold text-[#101828] dark:text-white">{notification.title}</p>
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1", meta.badgeClass)}>
            {meta.label}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#667085] dark:text-slate-300">{notification.message}</p>
        <p className="mt-2 text-xs text-[#8A95A5] dark:text-slate-400">{notification.sourceLabel}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right text-xs text-[#667085] dark:text-slate-400 sm:block">
          <p>{formatTime(notification.createdAt)}</p>
          <p>{formatDate(notification.createdAt)}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-[#98A2B3] transition group-hover:translate-x-0.5 group-hover:text-[#003366] dark:group-hover:text-blue-300" />
      </div>
    </button>
  );
}

/**
 * The scrollable list, with its loading, error and empty states.
 *
 * @param props - Component props.
 * @param props.notifications - The filtered notifications.
 * @param props.selectedId - Which one is open.
 * @param props.loading - Whether the first load is in flight.
 * @param props.error - A message keyed on `error.code`, or `null`.
 * @param props.totalCount - How many exist before filtering.
 * @param props.onSelect - Called when a row is clicked.
 * @param props.onRetry - Refetches after a failure.
 * @returns The list element.
 */
export function NotificationList({
  notifications,
  selectedId,
  loading,
  error,
  totalCount,
  onSelect,
  onRetry,
}: {
  notifications: StudentNotification[];
  selectedId?: string;
  loading: boolean;
  error: string | null;
  totalCount: number;
  onSelect: (notification: StudentNotification) => void;
  onRetry: () => void;
}) {
  if (loading && !notifications.length) {
    return (
      <div className="flex min-h-[360px] flex-1 items-center justify-center" role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-3 text-[#667085] dark:text-slate-300">
          <Loader2 className="h-8 w-8 animate-spin text-[#003366] dark:text-blue-300" />
          <p className="text-sm">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error && !notifications.length) {
    return (
      <div className="flex min-h-[360px] flex-1 items-center justify-center p-6" role="alert">
        <div className="max-w-sm rounded-2xl border border-red-100 bg-red-50 p-5 text-center dark:border-red-900/50 dark:bg-red-900/20">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-600 dark:text-red-400" />
          <p className="font-medium text-red-700 dark:text-red-200">{error}</p>
          <Button
            onClick={onRetry}
            className="mt-4 rounded-xl bg-[#003366] text-white hover:bg-[#00264D] dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="flex min-h-[360px] flex-1 items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF5FF] text-[#003366] dark:bg-[#1B3558] dark:text-blue-200">
            <MailOpen className="h-8 w-8" />
          </div>
          <p className="font-semibold text-[#101828] dark:text-white">
            {totalCount ? "No notifications match your filters" : "No notifications yet"}
          </p>
          <p className="mt-1 text-sm text-[#667085] dark:text-slate-300">
            {totalCount
              ? "Try changing your search or tab."
              : "New updates from your school and Talim will appear here."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* D6: the rows scroll inside this container, never the page. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            selected={notification.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#E8EDF5] px-4 py-3 text-xs text-[#667085] dark:border-[#30435F] dark:text-slate-400">
        <span>
          Showing {notifications.length} of {totalCount} notifications
        </span>
        <span className="hidden sm:inline">School and Talim updates in one inbox</span>
      </div>
    </div>
  );
}
