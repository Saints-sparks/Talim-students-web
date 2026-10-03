"use client";

import React, { useState } from "react";
import { ChevronLeft, Info } from "lucide-react";
import ChatThread, { type ReplyingMessage } from "@/components/messages/ChatThread";
import { cardFrame, focusRing } from "@/components/tl/styles";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import type { RealtimeChatRoom } from "@/types/chat";
import { GroupInfoSheet } from "./GroupInfoSheet";
import { RoomAvatar } from "./RoomAvatar";
import { isReadOnlyRoom, membersLabel, roomImage } from "./threads";

/** Props for {@link ThreadPane}. */
export interface ThreadPaneProps {
  /** The open room (`?room=`). */
  roomId: string;
  /** The room from the list, once it is there (a deep link may arrive first). */
  room?: RealtimeChatRoom;
  /** Back to the list (narrow screens). */
  onBack: () => void;
  /** The message being replied to in this room. */
  replyingMessage: ReplyingMessage | null;
  /** Starts or cancels a reply. */
  setReplyingMessage: (message: ReplyingMessage | null) => void;
}

/**
 * The right column: the thread's header (avatar, name, "teacher and N
 * others", Group info), its messages and the composer. A direct room is
 * read-only: the composer is replaced by a note and there is no group info.
 *
 * @param props - See {@link ThreadPaneProps}.
 * @param props.roomId - The room.
 * @param props.room - The room from the list.
 * @param props.onBack - Back to the list.
 * @param props.replyingMessage - The reply in progress.
 * @param props.setReplyingMessage - Starts or cancels a reply.
 * @returns The thread card.
 */
export function ThreadPane({ roomId, room, onBack, replyingMessage, setReplyingMessage }: ThreadPaneProps) {
  const joined = useRoomMessages(roomId);
  const [infoOpen, setInfoOpen] = useState(false);

  // Live room data: the list (patched by room-updated / participants-changed) first, then the join's answer.
  const participants = room?.participants?.length ? room.participants : joined.participants;
  const name = room?.displayName || joined.roomName || "Conversation";
  const roomType = room?.type || joined.roomType;
  const readOnly = isReadOnlyRoom(roomType);
  const membersText = membersLabel(participants, roomType);

  const header = (
    <div className="flex items-center gap-3 border-b border-tl-line-soft px-[clamp(12px,2vw,20px)] py-3.5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to conversations"
        className={`-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-tl-muted hover:bg-tl-bg hover:text-tl-ink min-[980px]:hidden ${focusRing}`}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <RoomAvatar name={name} type={roomType} courseId={room?.courseId} imageUrl={roomImage(room, joined.avatarUrl)} />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[17px] font-extrabold tracking-[-0.2px] text-tl-ink">{name}</h2>
        <p className="mt-0.5 truncate text-[13px] text-tl-muted">{membersText}</p>
      </div>
      {readOnly ? null : (
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          aria-label="Group info"
          title="Group info — members, images, videos, links and documents"
          data-guide="messages-info"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-tl-line text-tl-muted transition-colors hover:bg-tl-bg hover:text-tl-ink ${focusRing}`}
        >
          <Info className="h-[18px] w-[18px]" aria-hidden />
        </button>
      )}
    </div>
  );

  return (
    <section aria-label={name} data-guide="messages-thread" className={`${cardFrame} flex h-full min-h-0 min-w-0 flex-col`}>
      <ChatThread
        roomId={roomId}
        roomType={roomType}
        participants={participants}
        replyingMessage={readOnly ? null : replyingMessage}
        setReplyingMessage={setReplyingMessage}
        header={header}
        readOnly={readOnly}
      />
      {readOnly ? null : (
        <GroupInfoSheet
          open={infoOpen}
          onOpenChange={setInfoOpen}
          roomId={roomId}
          roomType={roomType}
          name={name}
          membersText={membersText}
          participants={participants}
        />
      )}
    </section>
  );
}
