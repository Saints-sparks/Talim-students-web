"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Paperclip } from "lucide-react";
import { CountBadge, PageHeader } from "@/components/tl/bits";
import { EmptyNote, ScreenError, ScreenLoading } from "@/components/tl/states";
import { card, cardFrame, chip, focusRing, pill, pillTone, primaryButton } from "@/components/tl/styles";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNotificationCounts } from "@/hooks/useNotificationCounts";
import { useNotifications } from "@/hooks/useNotifications";
import { formatLongDate, relativeWhen } from "@/lib/learner/format";
import { categoryTag } from "@/lib/learner/targets";
import type { NotificationCounts, StudentNotification } from "@/lib/notifications/normalize";
import { UPDATE_FILTERS, actionFor, attachmentName, chipCounts, matchesFilter, type UpdateFilter } from "./updates";

/** Wide enough for the list and the detail side by side (the design's 980px). */
const WIDE_QUERY = "(min-width: 980px)";

/** A focus ring drawn inside a full-width row, so the card's edge does not clip it. */
const insetFocus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tl-link";

/** Props for {@link UpdatesView}. */
export interface UpdatesViewProps {
  /** The inbox, newest first. */
  notifications: StudentNotification[];
  /** Counts of the loaded list, per chip. */
  counts: NotificationCounts;
  /** The server's unread total (`/notifications/counts`), for the bell. */
  unreadTotal: number;
  /** Whether the list and the detail sit side by side. */
  isWide: boolean;
  /** Marks one update read (when it is opened). */
  onOpen: (id: string) => void;
  /** Marks everything read in one call. */
  onMarkAll: () => void;
  /** True while "Mark all as read" is saving. */
  isMarkingAll: boolean;
  /** A failed read action, shown above the list. */
  error?: string | null;
  /** "Today" is measured from here. */
  now?: Date | string;
}

/**
 * The Updates screen's content: the header with the bell, the filter chips
 * and "Mark all as read", the list and the selected update's detail. On wide
 * screens the newest update in the filter shows by default (without marking
 * it read); below 980px the detail appears under the list once one is opened.
 *
 * @param props - See {@link UpdatesViewProps}.
 * @param props.notifications - The inbox.
 * @param props.counts - Counts per chip.
 * @param props.unreadTotal - The server's unread total.
 * @param props.isWide - The layout.
 * @param props.onOpen - Marks one read.
 * @param props.onMarkAll - Marks all read.
 * @param props.isMarkingAll - Whether that is saving.
 * @param props.error - A failed read action.
 * @param props.now - The reference time.
 * @returns The screen.
 */
export function UpdatesView({ notifications, counts, unreadTotal, isWide, onOpen, onMarkAll, isMarkingAll, error, now }: UpdatesViewProps) {
  const [filter, setFilter] = useState<UpdateFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const focusDetail = useRef(false);
  const detailHeading = useRef<HTMLHeadingElement>(null);

  const visible = useMemo(() => notifications.filter((item) => matchesFilter(item, filter)), [notifications, filter]);
  const byId = useMemo(() => new Map(notifications.map((item) => [item.id, item])), [notifications]);
  const perChip = useMemo(() => chipCounts(counts), [counts]);

  // An opened update stays in the detail even if it leaves the filter (Unread, once read).
  const selected = (selectedId ? byId.get(selectedId) : undefined) ?? (isWide ? visible[0] : undefined) ?? null;

  useEffect(() => {
    if (!focusDetail.current) return;
    focusDetail.current = false;
    detailHeading.current?.focus();
  }, [selectedId]);

  const open = (item: StudentNotification) => {
    setSelectedId(item.id);
    if (!isWide) focusDetail.current = true;
    if (item.unread) onOpen(item.id);
  };

  const pickFilter = (next: UpdateFilter) => {
    setFilter(next);
    setSelectedId(null);
  };

  const filterLabel = UPDATE_FILTERS.find((f) => f.key === filter)?.label ?? "All";
  const hasUnread = counts.unread > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3.5" data-guide="updates-header">
        <span aria-hidden className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[15px] bg-tl-select text-tl-brand">
          <Bell className="h-[23px] w-[23px]" />
          <CountBadge count={unreadTotal} className="absolute -right-1.5 -top-1.5" />
        </span>
        <PageHeader title="Updates" subtitle="Announcements from your school and alerts from Talim." />
      </div>

      {notifications.length === 0 ? (
        <div className={card}>
          <EmptyNote title="You're all caught up.">Announcements and alerts will appear here.</EmptyNote>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Show" className="flex flex-wrap gap-2" data-guide="updates-filters">
              {UPDATE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={filter === f.key}
                  title={f.tip}
                  onClick={() => pickFilter(f.key)}
                  className={chip(filter === f.key)}
                >
                  {f.label}
                  <span className="ml-1.5 tabular-nums opacity-80">{perChip[f.key]}</span>
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onMarkAll}
              disabled={!hasUnread || isMarkingAll}
              aria-busy={isMarkingAll || undefined}
              title="Clear every unread marker"
              data-guide="updates-mark-all"
              className={`inline-flex min-h-[44px] items-center rounded-md px-1 text-sm font-bold text-tl-link hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline ${focusRing}`}
            >
              {isMarkingAll ? "Marking all as read…" : "Mark all as read"}
            </button>
            <p role="status" className="sr-only">
              {isMarkingAll ? "Marking everything as read" : hasUnread ? `${counts.unread} unread` : "Everything is read"}
            </p>
          </div>

          {error ? (
            <p role="alert" className="rounded-2xl bg-tl-danger-bg px-4 py-3 text-sm text-tl-danger">
              {error}
            </p>
          ) : null}

          <div className="grid grid-cols-1 items-start gap-4 min-[980px]:grid-cols-[minmax(0,1fr)_minmax(260px,380px)]">
            <section aria-label={`${filterLabel} updates`} data-guide="updates-list" className={cardFrame}>
              {visible.length ? (
                <ul>
                  {visible.map((item) => (
                    <li key={item.id} className="border-t border-tl-line-soft first:border-t-0">
                      <UpdateRow item={item} selected={item.id === selected?.id} onOpen={open} now={now} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-10 text-center text-[15px] text-tl-muted">Nothing in {filterLabel} yet.</p>
              )}
            </section>

            {selected ? <UpdateDetail item={selected} headingRef={detailHeading} /> : null}
          </div>
        </>
      )}
    </div>
  );
}

/** Props for {@link UpdateRow}. */
interface UpdateRowProps {
  /** The update. */
  item: StudentNotification;
  /** Whether it is the one in the detail. */
  selected: boolean;
  /** Opens it. */
  onOpen: (item: StudentNotification) => void;
  /** The reference time. */
  now?: Date | string;
}

/**
 * One update in the list: the unread dot, title, an excerpt and when.
 *
 * @param props - See {@link UpdateRowProps}.
 * @param props.item - The update.
 * @param props.selected - Whether it is shown in the detail.
 * @param props.onOpen - Opens it.
 * @param props.now - The reference time.
 * @returns The row button.
 */
function UpdateRow({ item, selected, onOpen, now }: UpdateRowProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-current={selected ? "true" : undefined}
      title={`From ${item.senderName}`}
      className={`flex min-h-[44px] w-full items-start gap-3 px-[18px] py-4 text-left transition-colors ${
        selected ? "bg-tl-select" : "hover:bg-tl-subtle"
      } ${insetFocus}`}
    >
      <span aria-hidden className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${item.unread ? "bg-tl-link" : "bg-tl-control"}`} />
      <span className="min-w-0 flex-1">
        <span className={`block text-[15px] text-tl-ink ${item.unread ? "font-extrabold" : "font-bold"}`}>
          {item.title}
          {item.unread ? <span className="sr-only"> (unread)</span> : null}
        </span>
        <span className="mt-1 line-clamp-2 block text-sm leading-normal text-tl-muted">{item.message}</span>
      </span>
      <span className="whitespace-nowrap text-[13px] text-tl-faint">{relativeWhen(item.createdAt, now)}</span>
    </button>
  );
}

/** Props for {@link UpdateDetail}. */
interface UpdateDetailProps {
  /** The update. */
  item: StudentNotification;
  /** Receives focus when an update is opened on a narrow screen. */
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}

/**
 * The opened update: its tag, title, date, the full text, who sent it, any
 * attachments, and the button to where it points (none when it points
 * nowhere in the app).
 *
 * @param props - See {@link UpdateDetailProps}.
 * @param props.item - The update.
 * @param props.headingRef - The heading's ref.
 * @returns The detail card.
 */
function UpdateDetail({ item, headingRef }: UpdateDetailProps) {
  const action = actionFor(item);
  return (
    <section aria-labelledby="update-detail-title" data-guide="updates-detail" className={`${card} min-w-0`}>
      <span className={`${pill} ${pillTone.info}`}>{categoryTag(item.category)}</span>
      <h2
        id="update-detail-title"
        ref={headingRef}
        tabIndex={-1}
        className="mt-3.5 text-[19px] font-extrabold tracking-[-0.3px] text-tl-ink [text-wrap:pretty] focus:outline-none"
      >
        {item.title}
      </h2>
      <p className="mt-1.5 text-[13px] text-tl-muted">
        <time dateTime={item.createdAt}>{formatLongDate(item.createdAt)}</time>
      </p>
      <p className="mt-3.5 whitespace-pre-line break-words text-base leading-relaxed text-tl-body">{item.message}</p>
      {item.attachments.length ? (
        <ul aria-label="Attachments" className="mt-4 flex flex-col gap-1">
          {item.attachments.map((url, index) => (
            <li key={`${url}-${index}`}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-md text-sm font-bold text-tl-link hover:underline ${focusRing}`}
              >
                <Paperclip className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{attachmentName(url, index)}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-[18px] border-t border-tl-line-soft pt-4 text-[13px] text-tl-muted">From {item.senderName}</p>
      {action ? (
        <Link href={action.href} className={`${primaryButton} mt-4`}>
          {action.label}
        </Link>
      ) : null}
    </section>
  );
}

/**
 * The Updates screen (`/updates`): the merged inbox (`useNotifications`), the
 * unread count for the bell (`useNotificationCounts`), and one `PATCH
 * /notifications/read-all` for "Mark all as read". Opening the screen
 * completes the "view notifications" onboarding step.
 *
 * @returns The screen with its loading and error states.
 */
export default function UpdatesScreen() {
  const { markStepComplete } = useStudentOnboarding();
  const { notifications, loading, error, counts, refetch, markAsRead, markAllAsRead, isMarkingAll } = useNotifications();
  const { unread } = useNotificationCounts();
  const isWide = useMediaQuery(WIDE_QUERY);

  useEffect(() => {
    markStepComplete("view-notifications");
  }, [markStepComplete]);

  if (loading) return <ScreenLoading label="Loading your updates" blocks={3} />;
  if (error && notifications.length === 0) {
    return <ScreenError message={error} onRetry={() => void refetch()} />;
  }
  return (
    <UpdatesView
      notifications={notifications}
      counts={counts}
      unreadTotal={unread}
      isWide={isWide}
      onOpen={(id) => void markAsRead(id)}
      onMarkAll={() => void markAllAsRead()}
      isMarkingAll={isMarkingAll}
      error={error}
    />
  );
}
