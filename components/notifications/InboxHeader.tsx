"use client";

import { useRouter } from "next/navigation";
import { Bell, CheckCheck, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The inbox title bar: refresh, mark-all-read and a way into the notification
 * settings that govern what arrives here.
 *
 * @param props - Component props.
 * @param props.unreadCount - How many are unread.
 * @param props.loading - Whether a refresh is in flight.
 * @param props.onRefresh - Refetches both feeds.
 * @param props.onMarkAllAsRead - Marks every unread item read.
 * @returns The header element.
 */
export default function InboxHeader({
  unreadCount,
  loading,
  onRefresh,
  onMarkAllAsRead,
}: {
  unreadCount: number;
  loading: boolean;
  onRefresh: () => void;
  onMarkAllAsRead: () => void;
}) {
  const router = useRouter();

  return (
    <header
      data-guide="notifications-header"
      className="flex flex-col gap-4 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-4 shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44] lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#003366] text-white shadow-sm shadow-[#003366]/20 dark:bg-blue-700">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#101828] dark:text-white">Notifications</h1>
          <p className="text-sm text-[#667085] dark:text-slate-300">
            Stay updated on announcements, resources, grades, messages, and Talim alerts.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          onClick={() => router.push("/settings")}
          className="h-10 rounded-xl border-[#DCE5F2] bg-white text-[#344054] shadow-none dark:border-[#30435F] dark:bg-[#111C31] dark:text-slate-200"
        >
          <Settings className="h-4 w-4" />
          Notification Settings
        </Button>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="h-10 rounded-xl border-[#DCE5F2] bg-white text-[#344054] shadow-none dark:border-[#30435F] dark:bg-[#111C31] dark:text-slate-200"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
        <Button
          onClick={onMarkAllAsRead}
          disabled={!unreadCount}
          className="h-10 rounded-xl bg-[#003366] text-white shadow-sm shadow-[#003366]/20 hover:bg-[#00264D] dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>
    </header>
  );
}
