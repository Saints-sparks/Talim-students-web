"use client";

import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { CountBadge } from "@/components/tl/bits";
import { EmptyNote } from "@/components/tl/states";
import { cardFrame, fieldControl, ghostButton, pill, pillTone } from "@/components/tl/styles";
import type { RealtimeChatRoom } from "@/types/chat";
import { RoomAvatar } from "./RoomAvatar";
import { DIRECT_MARKER, filterThreads, isReadOnlyRoom, membersLabel, previewOf } from "./threads";

/** Props for {@link ThreadList}. */
export interface ThreadListProps {
  /** The rooms, already in list order. */
  rooms: RealtimeChatRoom[];
  /** The open room (`?room=`). */
  selectedId: string | null;
  /** Opens a room. */
  onSelect: (roomId: string) => void;
  /** True while the first room list loads. */
  isLoading: boolean;
  /** Why the room list could not load. */
  error: string | null;
  /** Asks for the room list again. */
  onRetry: () => void;
}

/**
 * The left column: a search box and one row per group (class group first,
 * then subject groups), with old direct rooms last and marked read-only.
 *
 * @param props - See {@link ThreadListProps}.
 * @param props.rooms - The ordered rooms.
 * @param props.selectedId - The open room.
 * @param props.onSelect - Opens a room.
 * @param props.isLoading - Whether the list is loading.
 * @param props.error - The load error.
 * @param props.onRetry - Retries the load.
 * @returns The list card.
 */
export function ThreadList({ rooms, selectedId, onSelect, isLoading, error, onRetry }: ThreadListProps) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => filterThreads(rooms, query), [rooms, query]);

  let body: React.ReactNode;
  if (isLoading && rooms.length === 0) {
    body = (
      <p role="status" className="flex items-center gap-2 px-4 py-6 text-sm text-tl-muted">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading your groups…
      </p>
    );
  } else if (error && rooms.length === 0) {
    body = (
      <div role="alert" className="flex flex-col items-start gap-3 px-4 py-6">
        <p className="text-sm text-tl-body">{error}</p>
        <button type="button" onClick={onRetry} className={ghostButton}>
          Try again
        </button>
      </div>
    );
  } else if (rooms.length === 0) {
    body = <EmptyNote title="No groups yet.">Your class group and subject groups appear here.</EmptyNote>;
  } else if (visible.length === 0) {
    body = (
      <p role="status" className="px-4 py-6 text-sm text-tl-muted">
        No conversations match “{query.trim()}”.
      </p>
    );
  } else {
    body = (
      <ul>
        {visible.map((room) => (
          <li key={room.roomId}>
            <ThreadRow room={room} selected={room.roomId === selectedId} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section aria-label="Conversations" data-guide="messages-list" className={`${cardFrame} flex flex-col min-[980px]:h-full`}>
      <div className="p-3" data-guide="messages-search">
        <label htmlFor="messages-search" className="sr-only">
          Search conversations
        </label>
        <input
          id="messages-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search conversations"
          title="Find a group"
          autoComplete="off"
          className={fieldControl}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
    </section>
  );
}

/** A focus ring drawn inside a full-width row, so the card's edge does not clip it. */
export const insetFocus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tl-link";

/** Props for {@link ThreadRow}. */
interface ThreadRowProps {
  /** The room. */
  room: RealtimeChatRoom;
  /** Whether it is open. */
  selected: boolean;
  /** Opens it. */
  onSelect: (roomId: string) => void;
}

/**
 * One thread: avatar, name, the last message and the unread count. A direct
 * room is marked "Direct · read only".
 *
 * @param props - See {@link ThreadRowProps}.
 * @param props.room - The room.
 * @param props.selected - Whether it is open.
 * @param props.onSelect - Opens it.
 * @returns The row button.
 */
function ThreadRow({ room, selected, onSelect }: ThreadRowProps) {
  const readOnly = isReadOnlyRoom(room.type);
  const name = room.displayName || room.name || "Conversation";
  const imageUrl = room.avatarInfo?.type === "image" ? room.avatarInfo.value : "";
  const unread = room.unreadCount;

  return (
    <button
      type="button"
      onClick={() => onSelect(room.roomId)}
      aria-current={selected ? "true" : undefined}
      title={membersLabel(room.participants, room.type)}
      className={`flex min-h-[44px] w-full items-center gap-3 border-t border-tl-line-soft px-4 py-3.5 text-left transition-colors ${
        selected ? "bg-tl-select" : "hover:bg-tl-subtle"
      } ${insetFocus}`}
    >
      <RoomAvatar name={name} type={room.type} courseId={room.courseId} imageUrl={imageUrl} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold text-tl-ink">{name}</span>
        <span className="mt-[3px] block truncate text-[13px] text-tl-muted">{previewOf(room)}</span>
        {readOnly ? <span className={`${pill} ${pillTone.muted} mt-1.5 px-2 py-0.5 text-xs`}>{DIRECT_MARKER}</span> : null}
      </span>
      {unread > 0 ? (
        <>
          <span aria-hidden>
            <CountBadge count={unread} className="shrink-0" />
          </span>
          <span className="sr-only">, {unread} unread</span>
        </>
      ) : null}
    </button>
  );
}
