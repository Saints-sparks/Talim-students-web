"use client";

import { ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Lock, Loader2, MessageCircle, WifiOff } from "lucide-react";
import MessageInput from "./MessageInput";
import GroupMessageBubble from "./GroupMessageBubble";
import { ReplyBar, type ReplyDraft } from "@/components/chat-kit";
import { focusRing, ghostButton } from "@/components/tl/styles";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import { useChatContext } from "@/contexts/ChatContext";
import {
  isSameUser,
  otherParticipant,
  ownMessageTick,
  participantId,
  participantName,
  readersOf,
} from "@/lib/chat";
import type { ChatMessage, ChatParticipant, ChatRoomType } from "@/types/chat";

const NEAR_BOTTOM_PX = 120;
const LOAD_OLDER_THRESHOLD_PX = 80;

/** The class added for a moment to a message the reader jumped to. */
const JUMP_HIGHLIGHT = "bg-tl-select";

/** What a read-only thread says in place of the composer (B10: direct messages are closed for students). */
export const READ_ONLY_THREAD_NOTE =
  "Direct messages are closed. You can still read this conversation. Message your teachers in your class or subject groups.";

export type ReplyingMessage = ReplyDraft;

interface ChatThreadProps {
  roomId: string;
  header: ReactNode;
  roomType?: ChatRoomType;
  participants: ChatParticipant[];
  replyingMessage: ReplyingMessage | null;
  setReplyingMessage: (msg: ReplyingMessage | null) => void;
  /** Read-only (a closed direct message): no composer, no reply or delete. */
  readOnly?: boolean;
  /** Shown in place of the composer when read-only. */
  readOnlyNote?: ReactNode;
}

/**
 * "Today", "Yesterday" or the local date, for the separators between days.
 *
 * @param date - The day.
 * @returns The label.
 */
const formatDate = (date: Date) => {
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString();
};

/**
 * The open conversation: its messages (older pages load on scroll), the
 * loading, retry and offline states, day separators, replies, and the
 * composer. A read-only thread shows a note instead of the composer and
 * offers no reply or delete.
 *
 * @param props - See {@link ChatThreadProps}.
 * @param props.roomId - The room.
 * @param props.header - The thread's header.
 * @param props.roomType - The room's type (read ticks differ for direct rooms).
 * @param props.participants - The room's members.
 * @param props.replyingMessage - The message being replied to.
 * @param props.setReplyingMessage - Starts or cancels a reply.
 * @param props.readOnly - Whether the thread is read-only.
 * @param props.readOnlyNote - What a read-only thread says.
 * @returns The thread.
 */
export default function ChatThread({
  roomId,
  header,
  roomType,
  participants,
  replyingMessage,
  setReplyingMessage,
  readOnly = false,
  readOnlyNote = READ_ONLY_THREAD_NOTE,
}: ChatThreadProps) {
  const { currentUserIds } = useChatContext();
  const {
    messages,
    status,
    error,
    isLoading,
    isLoadingMore,
    loadMoreError,
    hasMore,
    isConnected,
    sendMessage,
    loadMoreMessages,
    retryJoin,
    retryMessage,
    deleteFailedMessage,
    draft,
    setDraft,
    deleteMessage,
  } = useRoomMessages(roomId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);
  const initialScrollDoneRef = useRef(false);
  const lastMessageIdRef = useRef<string | undefined>(undefined);
  const firstMessageIdRef = useRef<string | undefined>(undefined);
  const restoreScrollRef = useRef<{ height: number; top: number } | null>(null);

  const isMine = useCallback(
    (message: ChatMessage) => isSameUser(message.senderId, currentUserIds),
    [currentUserIds]
  );

  // Keep the reading position: jump to the bottom on first load, hold position
  // when older pages are prepended, and follow new messages only when the user
  // is already near the bottom or sent the message.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const first = messages[0];
    const last = messages[messages.length - 1];

    if (container && messages.length) {
      if (!initialScrollDoneRef.current) {
        container.scrollTop = container.scrollHeight;
        initialScrollDoneRef.current = true;
      } else if (restoreScrollRef.current && first?._id !== firstMessageIdRef.current) {
        const { height, top } = restoreScrollRef.current;
        container.scrollTop = container.scrollHeight - height + top;
        restoreScrollRef.current = null;
      } else if (
        last &&
        last._id !== lastMessageIdRef.current &&
        (nearBottomRef.current || (isMine(last) && last.status !== "sent"))
      ) {
        messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
      }
    }

    firstMessageIdRef.current = first?._id;
    lastMessageIdRef.current = last?._id;
  }, [messages, isMine]);

  useEffect(() => {
    if (!isLoadingMore) restoreScrollRef.current = null;
  }, [isLoadingMore]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    nearBottomRef.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < NEAR_BOTTOM_PX;

    if (
      container.scrollTop < LOAD_OLDER_THRESHOLD_PX &&
      hasMore &&
      !isLoadingMore &&
      !loadMoreError &&
      initialScrollDoneRef.current
    ) {
      restoreScrollRef.current = { height: container.scrollHeight, top: container.scrollTop };
      loadMoreMessages();
    }
  }, [hasMore, isLoadingMore, loadMoreError, loadMoreMessages]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      nearBottomRef.current = true;
      sendMessage(content, { replyTo: replyingMessage ?? undefined });
      setReplyingMessage(null);
    },
    [sendMessage, replyingMessage, setReplyingMessage]
  );

  // Read state: the other person's ids (direct messages) and my newest stored message (groups).
  const other = roomType === "one_to_one" ? otherParticipant(participants, currentUserIds) : undefined;
  const otherIds = other ? [other._id, other.userId].filter(Boolean).map(String) : [];
  let latestOwnSentId: string | undefined;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (isMine(messages[i]) && messages[i].status === "sent") {
      latestOwnSentId = messages[i]._id;
      break;
    }
  }

  const handleSendFiles = useCallback(
    (files: File[], caption: string) => {
      if (!files.length) return;
      nearBottomRef.current = true;
      sendMessage(caption, { files, replyTo: replyingMessage ?? undefined });
      setReplyingMessage(null);
    },
    [sendMessage, replyingMessage, setReplyingMessage]
  );

  const handleSendVoice = useCallback(
    (file: File, duration: number) => {
      nearBottomRef.current = true;
      sendMessage("", { voice: { file, duration }, replyTo: replyingMessage ?? undefined });
      setReplyingMessage(null);
    },
    [sendMessage, replyingMessage, setReplyingMessage]
  );

  // Every id a member goes by → the member, so each bubble finds its sender without a scan.
  const participantsById = useMemo(() => {
    const map = new Map<string, ChatParticipant>();
    participants.forEach((p) => {
      const id = participantId(p);
      if (id) map.set(id, p);
      if (p.userId) map.set(String(p.userId), p);
    });
    return map;
  }, [participants]);

  const toBubble = (message: ChatMessage) => {
    const participant = participantsById.get(message.senderId);
    const mine = isMine(message);
    const readers =
      mine && roomType !== "one_to_one" && message._id === latestOwnSentId
        ? readersOf(message, currentUserIds).length
        : 0;
    const senderName =
      message.senderName || (participant ? participantName(participant, "") : "") || (mine ? "You" : "Unknown");

    return {
      _id: message._id,
      clientMessageId: message.clientMessageId,
      sender: senderName,
      senderType: mine ? "self" : "other",
      text: message.text,
      time: new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: message.type,
      duration: message.duration,
      attachments: message.attachments,
      replyTo: message.replyTo,
      isDeleted: message.isDeleted,
      uploadProgress: message.uploadProgress,
      status: message.status,
      error: message.error,
      tick: mine ? ownMessageTick(message, roomType, otherIds) : undefined,
      readByLabel: readers > 0 ? `Read by ${readers}` : undefined,
    };
  };

  const loadedIds = new Set(messages.map((m) => m._id));

  /** Delete is offered for my own messages, and in a group for others' (the server decides who may). */
  const deleteHandlerFor = (message: ChatMessage) => {
    if (readOnly) return undefined;
    if (message.status !== "sent" || message.isDeleted) return undefined;
    if (!isMine(message) && roomType === "one_to_one") return undefined;
    return () => deleteMessage(message._id);
  };

  const jump = (messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add(JUMP_HIGHLIGHT);
    window.setTimeout(() => el.classList.remove(JUMP_HIGHLIGHT), 1200);
  };

  const groupedByDate = messages.reduce<Array<{ date: string; items: ChatMessage[] }>>(
    (groups, message) => {
      const date = new Date(message.createdAt).toDateString();
      const current = groups[groups.length - 1];
      if (current && current.date === date) current.items.push(message);
      else groups.push({ date, items: [message] });
      return groups;
    },
    []
  );

  const inlineRetry = `inline-flex min-h-[44px] items-center rounded-md px-1 font-bold underline ${focusRing}`;

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-tl-surface text-tl-ink">
      {header}

      {!isConnected && (
        <div
          role="status"
          className="flex items-center gap-2 border-b border-tl-line-soft bg-tl-warning-bg px-5 py-2 text-[13px] text-tl-warning"
        >
          <WifiOff className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
          <span>You&apos;re offline. Messages you send will go out when you reconnect.</span>
        </div>
      )}

      <div
        className="min-h-0 flex-1 overflow-y-auto px-[clamp(12px,2vw,20px)] py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tl-link"
        ref={containerRef}
        onScroll={handleScroll}
        role="region"
        aria-label="Messages"
        tabIndex={0}
        data-guide="messages-body"
      >
        {isLoadingMore && (
          <div role="status" className="flex items-center justify-center gap-2 py-3 text-sm text-tl-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span>Loading more messages…</span>
          </div>
        )}

        {loadMoreError && !isLoadingMore && (
          <p role="alert" className="flex items-center justify-center gap-1 py-2 text-[13px] text-tl-danger">
            {loadMoreError} ·{" "}
            <button type="button" className={inlineRetry} onClick={loadMoreMessages}>
              Retry
            </button>
          </p>
        )}

        {status === "error" && messages.length > 0 && (
          <p role="alert" className="flex items-center justify-center gap-1 py-2 text-[13px] text-tl-danger">
            {error || "Couldn't load this chat"} ·{" "}
            <button type="button" className={inlineRetry} onClick={retryJoin}>
              Retry
            </button>
          </p>
        )}

        {status === "error" && messages.length === 0 ? (
          <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-[15px] text-tl-danger">{error || "Couldn't load this chat"}</p>
            <button type="button" className={ghostButton} onClick={retryJoin}>
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div role="status" className="flex h-full flex-col items-center justify-center gap-3 text-tl-muted">
            <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
            <p className="text-sm">Loading messages…</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <MessageCircle className="h-10 w-10 text-tl-faint" aria-hidden />
            <p className="text-base font-bold text-tl-ink">No messages yet</p>
            <p className="text-sm text-tl-muted">
              {readOnly ? "There is nothing in this conversation." : "Send a message to start the conversation."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {groupedByDate.map(({ date, items }) => (
              <div key={date} className="flex flex-col gap-3.5">
                <div className="flex justify-center">
                  <span className="rounded-full border border-tl-line bg-tl-subtle px-3 py-1 text-xs font-bold text-tl-muted">
                    {formatDate(new Date(date))}
                  </span>
                </div>
                {items.map((message) => (
                  <div
                    key={message.clientMessageId || message._id}
                    id={`msg-${message._id}`}
                    className="rounded-2xl transition-colors duration-500"
                  >
                    <GroupMessageBubble
                      msg={toBubble(message)}
                      showSenderName={roomType !== "one_to_one"}
                      onReply={readOnly ? undefined : setReplyingMessage}
                      onDeleteMessage={deleteHandlerFor(message)}
                      onJump={message.replyTo && loadedIds.has(message.replyTo.messageId) ? jump : undefined}
                      onRetry={
                        message.clientMessageId
                          ? () => retryMessage(message.clientMessageId as string)
                          : undefined
                      }
                      onDelete={
                        message.clientMessageId
                          ? () => deleteFailedMessage(message.clientMessageId as string)
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {readOnly ? (
        <div role="note" className="flex items-start gap-2.5 border-t border-tl-line-soft bg-tl-subtle px-5 py-4 text-sm leading-relaxed text-tl-body">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-tl-muted" aria-hidden />
          <p>{readOnlyNote}</p>
        </div>
      ) : (
        <>
          {replyingMessage && (
            <ReplyBar reply={replyingMessage} onCancel={() => setReplyingMessage(null)} className="mx-3 sm:mx-5" />
          )}
          <MessageInput
            onSendMessage={handleSendMessage}
            onSendFiles={handleSendFiles}
            onSendVoice={handleSendVoice}
            initialValue={draft}
            onDraftChange={setDraft}
          />
        </>
      )}
    </div>
  );
}
