"use client";

import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Loader2, MessageCircle, WifiOff } from "lucide-react";
import MessageInput from "./MessageInput";
import GroupMessageBubble from "./GroupMessageBubble";
import { ReplyBar, type ReplyDraft } from "@/components/chat-kit";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import { useChatContext } from "@/contexts/ChatContext";
import { generateColorFromString } from "@/lib/colorUtils";
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

export type ReplyingMessage = ReplyDraft;

interface ChatThreadProps {
  roomId: string;
  header: ReactNode;
  roomType?: ChatRoomType;
  participants: ChatParticipant[];
  replyingMessage: ReplyingMessage | null;
  setReplyingMessage: (msg: ReplyingMessage | null) => void;
}

const formatDate = (date: Date) => {
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString();
};

/** Messages list, loading/error states and composer shared by group and private chats. */
export default function ChatThread({
  roomId,
  header,
  roomType,
  participants,
  replyingMessage,
  setReplyingMessage,
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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const findParticipant = (senderId: string) =>
    participants.find((p) => participantId(p) === senderId || p.userId === senderId);

  const toBubble = (message: ChatMessage) => {
    const participant = findParticipant(message.senderId);
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
      avatar: message.senderAvatar || participant?.userAvatar || "",
      color: generateColorFromString(senderName || message.senderId || "unknown"),
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
    if (message.status !== "sent" || message.isDeleted) return undefined;
    if (!isMine(message) && roomType === "one_to_one") return undefined;
    return () => deleteMessage(message._id);
  };

  const jump = (messageId: string) => {
    const el = document.getElementById(`msg-${messageId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("bg-blue-50");
    window.setTimeout(() => el.classList.remove("bg-blue-50"), 1200);
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

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <style jsx>{`
        .messages-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .messages-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {header}

      {!isConnected && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-amber-800 bg-amber-50 border-y border-amber-200">
          <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
          <span>You're offline. Messages you send will go out when you reconnect.</span>
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50 messages-container"
        ref={containerRef}
        onScroll={handleScroll}
        data-guide="messages-body"
      >
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading more messages...</span>
            </div>
          </div>
        )}

        {loadMoreError && !isLoadingMore && (
          <div className="flex justify-center py-3">
            <p className="text-xs text-red-600">
              {loadMoreError} ·{" "}
              <button className="underline hover:text-red-800" onClick={loadMoreMessages}>
                Retry
              </button>
            </p>
          </div>
        )}

        {status === "error" && messages.length > 0 && (
          <div className="flex justify-center py-2">
            <p className="text-xs text-red-600">
              {error || "Couldn't load this chat"} ·{" "}
              <button className="underline hover:text-red-800" onClick={retryJoin}>
                Retry
              </button>
            </p>
          </div>
        )}

        {status === "error" && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 mb-3">{error || "Couldn't load this chat"}</p>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                onClick={retryJoin}
              >
                Retry
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-8">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedByDate.map(({ date, items }) => (
              <div key={date} className="space-y-3">
                <div className="flex justify-center">
                  <div className="px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200">
                    <span className="text-xs font-medium text-gray-600">
                      {formatDate(new Date(date))}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {items.map((message) => (
                    <div
                      key={message.clientMessageId || message._id}
                      id={`msg-${message._id}`}
                      className="transition-colors duration-500"
                    >
                    <GroupMessageBubble
                      msg={toBubble(message)}
                      showSenderName={roomType !== "one_to_one"}
                      onReply={setReplyingMessage}
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
              </div>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {replyingMessage && (
        <ReplyBar reply={replyingMessage} onCancel={() => setReplyingMessage(null)} className="mx-2 sm:mx-4" />
      )}

      <MessageInput
        onSendMessage={handleSendMessage}
        onSendFiles={handleSendFiles}
        onSendVoice={handleSendVoice}
        initialValue={draft}
        onDraftChange={setDraft}
      />
    </div>
  );
}
