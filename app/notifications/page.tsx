"use client";

import React from "react";
import Layout from "@/components/Layout";
import {
  NotificationCategory,
  StudentNotification,
  useNotifications,
} from "@/hooks/useNotifications";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  Loader2,
  MailOpen,
  Megaphone,
  MessageSquare,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type TabKey = "all" | "unread" | NotificationCategory;
type SortKey = "newest" | "oldest" | "unread";

const categoryMeta: Record<
  NotificationCategory,
  {
    label: string;
    badgeClass: string;
    iconClass: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  announcement: {
    label: "Announcement",
    badgeClass: "bg-blue-50 text-blue-700 ring-blue-100",
    iconClass: "bg-blue-50 text-blue-700",
    Icon: Megaphone,
  },
  attendance: {
    label: "Attendance",
    badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    iconClass: "bg-emerald-50 text-emerald-700",
    Icon: CalendarDays,
  },
  academics: {
    label: "Academics",
    badgeClass: "bg-violet-50 text-violet-700 ring-violet-100",
    iconClass: "bg-violet-50 text-violet-700",
    Icon: BookOpen,
  },
  grading: {
    label: "Results",
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-100",
    iconClass: "bg-amber-50 text-amber-700",
    Icon: GraduationCap,
  },
  resources: {
    label: "Resources",
    badgeClass: "bg-cyan-50 text-cyan-700 ring-cyan-100",
    iconClass: "bg-cyan-50 text-cyan-700",
    Icon: FileText,
  },
  messages: {
    label: "Messages",
    badgeClass: "bg-sky-50 text-sky-700 ring-sky-100",
    iconClass: "bg-sky-50 text-sky-700",
    Icon: MessageSquare,
  },
  account: {
    label: "Account",
    badgeClass: "bg-slate-50 text-slate-700 ring-slate-100",
    iconClass: "bg-slate-50 text-slate-700",
    Icon: ShieldCheck,
  },
  other: {
    label: "Others",
    badgeClass: "bg-gray-50 text-gray-700 ring-gray-100",
    iconClass: "bg-gray-50 text-gray-700",
    Icon: Bell,
  },
};

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "announcement", label: "Announcements" },
  { key: "academics", label: "Academics" },
  { key: "resources", label: "Resources" },
  { key: "grading", label: "Results" },
];

const formatTime = (dateString: string) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getFilterLabel = (sortKey: SortKey) => {
  if (sortKey === "oldest") return "Oldest first";
  if (sortKey === "unread") return "Unread first";
  return "Newest first";
};

function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
  const { markStepComplete } = useStudentOnboarding();
  const {
    notifications,
    loading,
    error,
    counts,
    refetch,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const [activeTab, setActiveTab] = React.useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("newest");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  React.useEffect(() => {
    markStepComplete("view-notifications");
  }, [markStepComplete]);

  const filteredNotifications = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = notifications.filter((notification) => {
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "unread"
            ? notification.unread
            : notification.category === activeTab;

      const matchesSearch = query
        ? [
            notification.title,
            notification.message,
            notification.senderName,
            notification.sourceLabel,
            categoryMeta[notification.category].label,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        : true;

      return matchesTab && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortKey === "unread") {
        if (a.unread !== b.unread) return a.unread ? -1 : 1;
      }

      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortKey === "oldest" ? aTime - bTime : bTime - aTime;
    });
  }, [activeTab, notifications, searchQuery, sortKey]);

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
    filteredNotifications.find((notification) => notification.id === selectedId) ||
    filteredNotifications[0] ||
    null;

  const handleSelectNotification = (notification: StudentNotification) => {
    setSelectedId(notification.id);
    setMobileDetailOpen(true);
  };

  const handleMarkSelectedRead = async () => {
    if (!selectedNotification) return;
    await markAsRead(selectedNotification.id);
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F8F8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
      </div>
    );
  }

  return (
    <Layout>
      <div
        className="h-full overflow-hidden bg-[#F7F9FC]"
        data-guide-ready={loading ? "false" : "true"}
        aria-busy={loading}
      >
        <div className="flex h-full flex-col gap-4 overflow-hidden px-3 py-4 sm:px-5 lg:px-6">
          <Header
            unreadCount={counts.unread}
            loading={loading}
            onRefresh={refetch}
            onMarkAllAsRead={markAllAsRead}
          />

          <div className="flex min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_430px]">
            <section
              data-guide="notifications-list"
              className={cn(
                "min-h-0 rounded-2xl border border-[#E5EAF2] bg-white shadow-sm",
                mobileDetailOpen && selectedNotification ? "hidden lg:flex" : "flex",
                "flex-col",
              )}
            >
              <Tabs activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />

              <div className="flex flex-col gap-3 border-b border-[#E8EDF5] p-4 md:flex-row" data-guide="notifications-search-sort">
                <div className="flex h-11 flex-1 items-center rounded-xl border border-[#DCE5F2] bg-white px-3 transition focus-within:border-[#003366] focus-within:ring-4 focus-within:ring-[#003366]/10">
                  <Search className="mr-2 h-4 w-4 text-[#738195]" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-full border-0 p-0 text-sm shadow-none focus-visible:ring-0"
                    placeholder="Search notifications..."
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="rounded-full p-1 text-[#738195] transition hover:bg-[#EDF2F8] hover:text-[#102A43]"
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
                      className="h-11 justify-between rounded-xl border-[#DCE5F2] bg-white text-[#344054] shadow-none md:w-44"
                    >
                      <span className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4 rotate-90 text-[#738195]" />
                        {getFilterLabel(sortKey)}
                      </span>
                      <ChevronDown className="h-4 w-4 text-[#738195]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="font-manrope">
                    <DropdownMenuItem onClick={() => setSortKey("newest")}>Newest first</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortKey("oldest")}>Oldest first</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortKey("unread")}>Unread first</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <NotificationList
                notifications={filteredNotifications}
                selectedId={selectedNotification?.id}
                loading={loading}
                error={error}
                totalCount={notifications.length}
                onSelect={handleSelectNotification}
                onRetry={refetch}
              />
            </section>

            <section
              data-guide="notifications-detail"
              className={cn(
                "min-h-0 rounded-2xl border border-[#E5EAF2] bg-white shadow-sm lg:flex",
                mobileDetailOpen && selectedNotification ? "flex" : "hidden",
                "flex-col",
              )}
            >
              <NotificationDetail
                notification={selectedNotification}
                onBack={() => setMobileDetailOpen(false)}
                onMarkAsRead={handleMarkSelectedRead}
              />
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Header({
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
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between" data-guide="notifications-header">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#003366] text-white shadow-sm shadow-[#003366]/20">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#101828]">Notifications</h1>
            <p className="text-sm text-[#667085]">
              Stay updated on announcements, resources, grades, messages, and Talim alerts.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="outline"
          className="h-10 rounded-xl border-[#DCE5F2] bg-white text-[#344054] shadow-none"
        >
          <Settings className="h-4 w-4" />
          Notification Settings
        </Button>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="h-10 rounded-xl border-[#DCE5F2] bg-white text-[#344054] shadow-none"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
        <Button
          onClick={onMarkAllAsRead}
          disabled={!unreadCount}
          className="h-10 rounded-xl bg-[#003366] text-white shadow-sm shadow-[#003366]/20 hover:bg-[#00264D]"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </Button>
      </div>
    </header>
  );
}

function Tabs({
  activeTab,
  counts,
  onTabChange,
}: {
  activeTab: TabKey;
  counts: Record<TabKey, number>;
  onTabChange: (tab: TabKey) => void;
}) {
  return (
    <div className="border-b border-[#E8EDF5] p-3" data-guide="notifications-tabs">
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#E5EAF2] bg-[#F8FAFD] p-1 sm:grid sm:grid-cols-6 sm:gap-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs sm:text-sm font-medium transition sm:h-10 sm:min-h-0",
                isActive
                  ? "bg-white text-[#003366] shadow-sm ring-1 ring-[#DCE5F2]"
                  : "text-[#667085] hover:bg-white/80 hover:text-[#101828]",
              )}
            >
              <span className="whitespace-nowrap">{tab.label}</span>
              <span
                className={cn(
                  "min-w-5 rounded-full px-1.5 py-0.5 text-xs",
                  isActive ? "bg-[#E7F0FF] text-[#003366]" : "bg-[#EDF2F8] text-[#667085]",
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

function NotificationList({
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
      <div className="flex min-h-[360px] flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#667085]">
          <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
          <p className="text-sm">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error && !notifications.length) {
    return (
      <div className="flex min-h-[360px] flex-1 items-center justify-center p-6">
        <div className="max-w-sm rounded-2xl border border-red-100 bg-red-50 p-5 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-600" />
          <p className="font-medium text-red-700">{error}</p>
          <Button onClick={onRetry} className="mt-4 rounded-xl bg-[#003366] text-white hover:bg-[#00264D]">
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF5FF] text-[#003366]">
            <MailOpen className="h-8 w-8" />
          </div>
          <p className="font-semibold text-[#101828]">No notifications found</p>
          <p className="mt-1 text-sm text-[#667085]">
            Try changing your search or filter. New updates from your school and Talim will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
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

      <div className="flex items-center justify-between border-t border-[#E8EDF5] px-4 py-3 text-xs text-[#667085]">
        <span>
          Showing {notifications.length} of {totalCount} notifications
        </span>
        <span className="hidden sm:inline">School and Talim updates in one inbox</span>
      </div>
    </div>
  );
}

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
        "group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-[#EEF2F7] px-4 py-4 text-left transition hover:bg-[#F8FBFF]",
        selected && "bg-[#F4F8FF] ring-1 ring-inset ring-[#83B7FF]",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            notification.unread ? "bg-[#0B74DE]" : "bg-[#CBD5E1]",
          )}
          aria-label={notification.unread ? "Unread" : "Read"}
        />
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", meta.iconClass)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="truncate text-sm font-semibold text-[#101828]">{notification.title}</p>
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1", meta.badgeClass)}>
            {meta.label}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#667085]">{notification.message}</p>
        <p className="mt-2 text-xs text-[#8A95A5]">{notification.sourceLabel}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right text-xs text-[#667085] sm:block">
          <p>{formatTime(notification.createdAt)}</p>
          <p>{formatDate(notification.createdAt)}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-[#98A2B3] transition group-hover:translate-x-0.5 group-hover:text-[#003366]" />
      </div>
    </button>
  );
}

function NotificationDetail({
  notification,
  onBack,
  onMarkAsRead,
}: {
  notification: StudentNotification | null;
  onBack: () => void;
  onMarkAsRead: () => void;
}) {
  if (!notification) {
    return (
      <div className="flex min-h-[360px] flex-1 items-center justify-center p-6 text-center">
        <div>
          <Bell className="mx-auto mb-3 h-10 w-10 text-[#98A2B3]" />
          <p className="font-medium text-[#101828]">Select a notification</p>
          <p className="mt-1 text-sm text-[#667085]">Choose an update from the list to read the full details.</p>
        </div>
      </div>
    );
  }

  const meta = categoryMeta[notification.category];
  const Icon = meta.Icon;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-[#E8EDF5] px-4 py-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-[#344054] transition hover:bg-[#F2F6FB] lg:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="hidden items-center gap-2 text-sm font-medium text-[#667085] lg:flex">
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl", meta.iconClass)}>
            <Icon className="h-4 w-4" />
          </span>
          Detail
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-9 w-9 rounded-xl text-[#667085]"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold leading-7 text-[#101828]">{notification.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
              <span className={cn("rounded-full px-2 py-0.5 font-semibold ring-1", meta.badgeClass)}>
                {meta.label}
              </span>
              <span className="rounded-full bg-[#EFF5FF] px-2 py-0.5 font-semibold text-[#003366] ring-1 ring-[#DCEBFF]">
                {notification.sourceLabel}
              </span>
              <span>{formatTime(notification.createdAt)} - {formatDate(notification.createdAt)}</span>
              {notification.unread ? (
                <span className="flex items-center gap-1 font-semibold text-[#0B74DE]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0B74DE]" />
                  Unread
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[#667085]">
                  <Check className="h-3.5 w-3.5" />
                  Read
                </span>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF3FF] via-white to-[#FFF6DF] p-5">
            <div className="flex min-h-[120px] items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[#003366] shadow-sm">
                <Icon className="h-9 w-9" />
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#D4A017] text-white shadow-sm">
                  <Bell className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm leading-6 text-[#344054]">
            {notification.message.split("\n").map((line, index) => (
              <p key={`${notification.id}-line-${index}`}>{line}</p>
            ))}
          </div>

          <div className="rounded-2xl border border-[#E8EDF5] bg-[#FBFCFE] p-4">
            <p className="text-xs font-semibold uppercase text-[#8A95A5]">From</p>
            <p className="mt-1 font-medium text-[#101828]">{notification.senderName}</p>
            {notification.senderEmail ? (
              <p className="text-sm text-[#667085]">{notification.senderEmail}</p>
            ) : null}
          </div>

          {notification.related.length ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-[#101828]">Related</p>
              <div className="flex flex-wrap gap-2">
                {notification.related.map((item, index) => (
                  <a
                    key={`${item.label}-${index}`}
                    href={item.href || "#"}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl bg-[#EFF5FF] px-3 py-2 text-sm font-medium text-[#003366] ring-1 ring-[#DCEBFF]",
                      !item.href && "pointer-events-none",
                    )}
                  >
                    <Users className="h-4 w-4" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {notification.attachments.length ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-[#101828]">
                Attachments ({notification.attachments.length})
              </p>
              <div className="space-y-2">
                {notification.attachments.map((attachment, index) => (
                  <a
                    key={`${attachment}-${index}`}
                    href={attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-[#E8EDF5] bg-white p-3 text-sm transition hover:border-[#BFD7FF] hover:bg-[#F8FBFF]"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <FileText className="h-5 w-5" />
                      </span>
                      <span className="truncate font-medium text-[#344054]">
                        {attachment.split("/").pop() || `Attachment ${index + 1}`}
                      </span>
                    </span>
                    <Download className="h-4 w-4 text-[#667085]" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2 border-t border-[#E8EDF5] p-4">
        <Button
          variant="outline"
          onClick={onMarkAsRead}
          disabled={!notification.unread}
          className="h-11 flex-1 rounded-xl border-[#DCE5F2] bg-white text-[#344054] shadow-none"
        >
          <Check className="h-4 w-4" />
          Mark as read
        </Button>
        <Button
          variant="outline"
          className="h-11 w-12 rounded-xl border-[#DCE5F2] bg-white text-[#344054] shadow-none"
          aria-label="Delete notification"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default NotificationsPage;
