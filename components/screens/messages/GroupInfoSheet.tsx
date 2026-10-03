"use client";

import React, { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { FileText, Link2, Loader2, LogOut, PlayCircle } from "lucide-react";
import { Lightbox } from "@/components/chat-kit";
import { Sheet } from "@/components/tl/Sheet";
import { focusRing, ghostButton } from "@/components/tl/styles";
import { useChatContext } from "@/contexts/ChatContext";
import { useRoomMedia } from "@/hooks/useRoomMedia";
import { LEAVABLE_ROOM_TYPES } from "@/lib/chat";
import { formatBytes, formatDayMonth, initialsOf } from "@/lib/learner/format";
import type { ChatParticipant, ChatRoomType } from "@/types/chat";
import type { RoomMediaKind, RoomMediaPage } from "@/types/learner";
import { memberRows } from "./threads";

/** The dialog's tabs, in the design's order. */
export type InfoTab = "members" | RoomMediaKind;

/** Tab keys and labels. Videos are their own kind (B10 `kind=video`). */
export const INFO_TABS: ReadonlyArray<{ key: InfoTab; label: string }> = [
  { key: "members", label: "Members" },
  { key: "image", label: "Images" },
  { key: "video", label: "Videos" },
  { key: "link", label: "Links" },
  { key: "document", label: "Documents" },
];

/** What each media tab says when nothing was shared. */
export const MEDIA_EMPTY: Record<RoomMediaKind, string> = {
  image: "No images shared yet.",
  video: "No videos shared yet.",
  link: "No links shared yet.",
  document: "No documents shared yet.",
};

/** Props for {@link GroupInfoSheet}. */
export interface GroupInfoSheetProps {
  /** Whether the dialog shows. */
  open: boolean;
  /** Open/close callback. */
  onOpenChange: (open: boolean) => void;
  /** The room. */
  roomId: string;
  /** Its type (decides whether "Leave group" shows). */
  roomType?: ChatRoomType;
  /** Its name. */
  name: string;
  /** "Mr Seyi Tinubu and 26 others". */
  membersText: string;
  /** Its members. */
  participants: ChatParticipant[];
}

/**
 * Group info: Members, Images, Videos, Links and Documents as a real tablist
 * (arrow keys, Home and End move between tabs). Each media tab loads its own
 * kind (`GET /chat/rooms/:id/media?kind=`) only while it shows. Students may
 * leave the group types they are allowed to leave.
 *
 * @param props - See {@link GroupInfoSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @param props.roomId - The room.
 * @param props.roomType - Its type.
 * @param props.name - Its name.
 * @param props.membersText - The members line.
 * @param props.participants - Its members.
 * @returns The dialog.
 */
export function GroupInfoSheet({ open, onOpenChange, roomId, roomType, name, membersText, participants }: GroupInfoSheetProps) {
  const [tab, setTab] = useState<InfoTab>("members");
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (open) setTab("members");
  }, [open]);

  const tabId = (key: InfoTab) => `${baseId}-tab-${key}`;
  const panelId = `${baseId}-panel`;

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = INFO_TABS.findIndex((t) => t.key === tab);
    const last = INFO_TABS.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (index + 1) % INFO_TABS.length
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (index - 1 + INFO_TABS.length) % INFO_TABS.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next === -1) return;
    event.preventDefault();
    setTab(INFO_TABS[next].key);
    tabRefs.current[next]?.focus();
  };

  const canLeave = Boolean(roomType && LEAVABLE_ROOM_TYPES.includes(roomType));

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      eyebrowText="Group info"
      title={name}
      subtitle={membersText}
      maxWidthClass="sm:max-w-[660px]"
      footer={canLeave ? <LeaveGroup roomId={roomId} name={name} onLeft={() => onOpenChange(false)} /> : undefined}
    >
      <div
        role="tablist"
        aria-label="Group info"
        onKeyDown={onTabKeyDown}
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
        data-guide="messages-info-tabs"
      >
        {INFO_TABS.map((t, index) => {
          const selected = t.key === tab;
          return (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId(t.key)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(t.key)}
              className={`min-h-[44px] shrink-0 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${focusRing} ${
                selected ? "bg-tl-select text-tl-brand" : "text-tl-muted hover:bg-tl-bg hover:text-tl-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={panelId} aria-labelledby={tabId(tab)} tabIndex={0} className={`min-h-[160px] rounded-md ${focusRing}`}>
        {tab === "members" ? (
          <MemberList participants={participants} />
        ) : (
          <MediaPanel key={tab} roomId={roomId} kind={tab} enabled={open} />
        )}
      </div>
    </Sheet>
  );
}

/**
 * The Members tab: teachers first, the student marked "(you)".
 *
 * @param props - Component props.
 * @param props.participants - The room's members.
 * @returns The list.
 */
function MemberList({ participants }: { participants: ChatParticipant[] }) {
  const { currentUserIds } = useChatContext();
  const rows = useMemo(() => memberRows(participants, currentUserIds), [participants, currentUserIds]);
  if (!rows.length) return <p className="mt-6 text-center text-[15px] text-tl-faint">No members to show yet.</p>;
  return (
    <ul aria-label="Members">
      {rows.map((member) => (
        <li key={member.key} className="flex items-center gap-3 border-t border-tl-line-soft py-3 first:border-t-0">
          {member.avatar ? (
            <span aria-hidden className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-tl-track">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={member.avatar} alt="" className="h-full w-full object-cover" loading="lazy" />
            </span>
          ) : (
            <span
              aria-hidden
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${
                member.role === "Teacher" ? "bg-tl-brand-fill text-tl-on-brand" : "bg-tl-track text-tl-muted"
              }`}
            >
              {initialsOf(member.name.replace(/ \(you\)$/, ""))}
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold text-tl-ink">{member.name}</div>
            <div className="text-[13px] text-tl-muted">{member.role}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Props for {@link MediaPanel}. */
interface MediaPanelProps {
  /** The room. */
  roomId: string;
  /** Which kind this tab shows. */
  kind: RoomMediaKind;
  /** Whether the dialog is open (the request waits until it is). */
  enabled: boolean;
}

/**
 * One media tab: loading, error with retry, the per-kind empty line, or the
 * items (image thumbnails that open the lightbox; videos, documents and links
 * that open in a new tab).
 *
 * @param props - See {@link MediaPanelProps}.
 * @param props.roomId - The room.
 * @param props.kind - The kind.
 * @param props.enabled - Whether to load.
 * @returns The tab's content.
 */
function MediaPanel({ roomId, kind, enabled }: MediaPanelProps) {
  const { data, isLoading, error, refetch } = useRoomMedia(roomId, kind, enabled);

  if (isLoading) {
    return (
      <p role="status" className="mt-6 flex items-center justify-center gap-2 text-sm text-tl-muted">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading…
      </p>
    );
  }
  if (error) {
    return (
      <div role="alert" className="mt-4 flex flex-col items-start gap-3">
        <p className="text-sm text-tl-body">{error}</p>
        <button type="button" onClick={refetch} className={ghostButton}>
          Try again
        </button>
      </div>
    );
  }
  const items = data?.items ?? [];
  if (!items.length) return <p className="mt-10 text-center text-[15px] text-tl-faint">{MEDIA_EMPTY[kind]}</p>;
  if (kind === "image") return <ImageGrid items={items} />;
  return (
    <ul>
      {items.map((item) => (
        <li key={`${item.messageId}-${item.url}`} className="border-t border-tl-line-soft first:border-t-0">
          <MediaRow item={item} />
        </li>
      ))}
    </ul>
  );
}

type MediaItem = RoomMediaPage["items"][number];

/**
 * Image thumbnails; each opens the chat kit's lightbox at that image.
 *
 * @param props - Component props.
 * @param props.items - The images.
 * @returns The grid.
 */
function ImageGrid({ items }: { items: MediaItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const images = useMemo(() => items.map((item) => ({ url: item.url, name: item.name ?? undefined })), [items]);
  return (
    <>
      <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
        {items.map((item, i) => (
          <li key={`${item.messageId}-${item.url}`}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open image ${i + 1} of ${items.length}${item.name ? `, ${item.name}` : ""}`}
              className={`block aspect-square w-full overflow-hidden rounded-xl bg-tl-track ${focusRing}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </>
  );
}

/**
 * A video, document or link: a link that opens in a new tab, with its size,
 * who shared it and when.
 *
 * @param props - Component props.
 * @param props.item - The shared item.
 * @returns The row.
 */
function MediaRow({ item }: { item: MediaItem }) {
  const Icon = item.kind === "video" ? PlayCircle : item.kind === "link" ? Link2 : FileText;
  const label = item.kind === "link" ? item.url : item.name || (item.kind === "video" ? "Video" : "Document");
  const meta = [formatBytes(item.size), item.sender?.name, formatDayMonth(item.sentAt)].filter(Boolean).join(" · ");
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-[44px] items-center gap-3 rounded-xl px-1 py-3 hover:bg-tl-subtle ${focusRing}`}
    >
      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tl-select text-tl-brand">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block break-all text-[15px] font-bold text-tl-link">
          {label}
          <span className="sr-only"> (opens in a new tab)</span>
        </span>
        {meta ? <span className="block text-[13px] text-tl-muted">{meta}</span> : null}
      </span>
    </a>
  );
}

/** The outlined red button for leaving a group. */
const dangerButton = `inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[13px] border border-tl-danger bg-tl-surface px-[18px] py-3 text-[15px] font-bold text-tl-danger transition-colors hover:bg-tl-danger-bg disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

/** Props for {@link LeaveGroup}. */
interface LeaveGroupProps {
  /** The room. */
  roomId: string;
  /** Its name, for the confirmation. */
  name: string;
  /** Called once the student has left. */
  onLeft: () => void;
}

/**
 * "Leave group" with a confirmation step. The chat store drops the room and
 * the screen goes back to the list (`onRoomRemoved`).
 *
 * @param props - See {@link LeaveGroupProps}.
 * @param props.roomId - The room.
 * @param props.name - Its name.
 * @param props.onLeft - Called after leaving.
 * @returns The control.
 */
function LeaveGroup({ roomId, name, onLeft }: LeaveGroupProps) {
  const { leaveGroup } = useChatContext();
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leave = async () => {
    setLeaving(true);
    setError(null);
    const result = await leaveGroup(roomId);
    setLeaving(false);
    if (result.ok) onLeft();
    else setError(result.message || "Couldn't leave the group. Please try again.");
  };

  if (!confirming) {
    return (
      <button type="button" className={dangerButton} onClick={() => setConfirming(true)}>
        <LogOut className="h-4 w-4" aria-hidden /> Leave group
      </button>
    );
  }
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm text-tl-body">Leave {name}? You&apos;ll stop getting its messages.</p>
      {error ? (
        <p role="alert" className="text-sm text-tl-danger">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2.5">
        <button type="button" className={ghostButton} onClick={() => setConfirming(false)} disabled={leaving}>
          Cancel
        </button>
        <button type="button" className={dangerButton} onClick={() => void leave()} disabled={leaving}>
          {leaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Leave
        </button>
      </div>
    </div>
  );
}
