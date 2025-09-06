"use client";

import { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import GroupMessageBubble from "./GroupMessageBubble";
import ReplyPreview from "./ReplyPreview";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import { useAuthContext } from "@/contexts/AuthContext";
import { RealtimeChatRoom } from "@/hooks/useRealtimeChat";
import { Loader2 } from "lucide-react";

interface GroupChatProps {
  replyingMessage: { sender: string; text: string } | null;
  setReplyingMessage: (msg: any) => void;
  openSubMenu: { index: number; type: string } | null;
  toggleSubMenu: (index: number, type: string) => void;
  onBack: () => void;
  room?: RealtimeChatRoom;
}

const GroupChat = ({
  replyingMessage,
  setReplyingMessage,
  openSubMenu,
  toggleSubMenu,
  onBack,
  room,
}: GroupChatProps) => {
  const { user } = useAuthContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    roomInfo,
    error,
    sendMessage,
    loadMoreMessages,
  } = useRoomMessages(room?.roomId || null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Transform backend messages to UI format
  const transformMessageForUI = (message: any, index: number) => {
    const isCurrentUser =
      message.senderId === user?.id || message.senderId === user?.userId;

    return {
      _id: message._id,
      sender: message.senderName,
      senderType: isCurrentUser ? "self" : "other",
      text: message.content,
      time: new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: message.type || "text",
      avatar: "/image/teachers/english.png", // Default avatar
      color: isCurrentUser ? "text-[#99CCFF]" : "text-[#F39C12]",
      duration: message.duration,
    };
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content, "text");
  };

  const getParticipantsText = () => {
    if (!roomInfo?.participants) return "";

    const participantNames = roomInfo.participants
      .filter((p) => p.userId !== user?.id && p.userId !== user?.userId)
      .map((p) => `${p.firstName || ""} ${p.lastName || ""}`.trim())
      .filter((name) => name.length > 0)
      .slice(0, 6) // Limit to first 6 participants
      .join(", ");

    const remaining = Math.max(0, (roomInfo.totalParticipants || 0) - 6);
    return remaining > 0
      ? `${participantNames} and ${remaining} others`
      : participantNames;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString();
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped: { [key: string]: any[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });

    return grouped;
  };

  if (!room) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p>No room selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full justify-between flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center rounded-tr-lg p-4 border-b bg-white">
        <ChatHeader
          avatar={
            room.avatarInfo.type === "image"
              ? room.avatarInfo.value
              : "/images.png"
          }
          name={room.displayName}
          subtext={getParticipantsText()}
          onBack={onBack}
        />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !isLoading && messages.length > 0 && (
          <div className="text-center py-2">
            <button
              onClick={loadMoreMessages}
              disabled={isLoadingMore}
              className="text-blue-600 text-sm hover:text-blue-800 disabled:opacity-50"
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                "Load older messages"
              )}
            </button>
          </div>
        )}

        {/* Messages grouped by date */}
        {!isLoading &&
          messages.length > 0 &&
          Object.entries(groupMessagesByDate()).map(([date, dayMessages]) => (
            <div key={date}>
              <div className="text-center px-4 py-2 bg-white rounded-md w-fit mx-auto text-xs text-[#030E18] my-4">
                {formatDate(new Date(date))}
              </div>
              {dayMessages.map((message, index) => (
                <GroupMessageBubble
                  key={message._id || index}
                  msg={transformMessageForUI(message, index)}
                  index={index}
                  openSubMenu={openSubMenu}
                  toggleSubMenu={toggleSubMenu}
                  setReplyingMessage={setReplyingMessage}
                />
              ))}
            </div>
          ))}

        {/* Empty State */}
        {!isLoading && messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet.</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        )}

        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyingMessage && (
        <ReplyPreview
          replyingMessage={replyingMessage}
          onCancel={() => setReplyingMessage(null)}
        />
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        replyingMessage={replyingMessage}
        disabled={!room || isLoading}
      />
    </div>
  );
};

export default GroupChat;
