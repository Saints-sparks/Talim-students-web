import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import MessageBubble from "./PrivateMessageBubble";
import { Phone, Search, Video } from "lucide-react";
import MessageInput from "./MessageInput";
import TypingDots from "./TypingDots";
import ChatHeader from "./ChatHeader";
import ReplyPreview from "./ReplyPreview";
import { useEffect, useRef, useState } from 'react';
import { useRoomMessages } from "@/hooks/useRoomMessages";
import { useAuthContext } from "@/contexts/AuthContext";


interface PrivateChatProps {
  replyingMessage: { sender: string; text: string } | null;
  setReplyingMessage: (msg: any) => void;
  openSubMenu: { index: number; type: string } | null;
  toggleSubMenu: (index: number, type: string) => void;
  onBack: () => void;
  room?: any; // RealtimeChatRoom
}

export default function PrivateChat({
  replyingMessage,
  setReplyingMessage,
  openSubMenu,
  toggleSubMenu,
  onBack,
  room,
}: PrivateChatProps) {
  const roomId = room?.roomId || null;
  const { messages, isLoading, sendMessage, markAsRead, typingUsers, sendTyping } = useRoomMessages(
    roomId
  );

  const { user } = useAuthContext();

  // Simple dummy fallback if messages are empty (design/dev preview)
  const dummyMessages = [
    {
      _id: "m1",
      senderId: "t1",
      senderName: "Mrs Yetunde Adebayo",
      content: "Hi everyone! Don't forget the creative writing assignment is due tomorrow.",
      type: "text",
      timestamp: new Date(),
      readBy: [],
    },
    {
      _id: "m2",
      senderId: user?.id || user?.userId || "me",
      senderName: "me",
      content: "Got it!",
      type: "text",
      timestamp: new Date(),
      readBy: [],
    },
  ];

  // If there are no real rooms and no messages (offline/dev), provide a richer dummy
  const FALLBACK_ROOM_MESSAGES = [
    ...dummyMessages,
    {
      _id: 'm3',
      senderId: 't1',
      senderName: 'Mrs Yetunde Adebayo',
      content: "Here's a voice note",
      type: 'voice',
      duration: 8,
      timestamp: new Date(),
      readBy: [],
    },
  ];

  // When messages load for the room, mark unread messages as read
  // (Phase 1 requirement)
  const currentMessages = messages && messages.length > 0 ? messages : FALLBACK_ROOM_MESSAGES;

  // mark unread as read when we open the room
  // call markAsRead for each message not read by current user
  // guard to avoid spamming if markAsRead not available



  // Mark unread messages as read once when messages arrive
  const _markedRef = useRef(false);
  useEffect(() => {
    if (_markedRef.current) return;
    if (!messages || messages.length === 0) return;
    if (!markAsRead || !user) return;

    messages.forEach((m: any) => {
      const alreadyRead = Array.isArray(m.readBy) && (m.readBy.includes(user.id) || m.readBy.includes(user.userId));
      if (!alreadyRead && m._id) {
        try {
          markAsRead(m._id);
        } catch (err) {
          // ignore
        }
      }
    });

    _markedRef.current = true;
  }, [messages, markAsRead, user]);

  // Helper: map ChatMessage -> msg props expected by PrivateMessageBubble
  const mapToBubble = (m: any) => ({
    sender: m.senderName || "",
    senderType: m.senderId === (user?.id || user?.userId) ? "student" : "teacher",
    avatar: m.senderId === (user?.id || user?.userId) ? "/image/students/me.png" : "/image/teachers/english.png",
    color: m.senderId === (user?.id || user?.userId) ? "green" : "blue",
    type: m.type || "text",
    text: m.content,
    duration: m.duration && `${m.duration}s`,
    time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
  });

  // Wire MessageInput send
  const handleSend = async (content: string) => {
    if (sendMessage) {
      // optimistic: append locally via websocket (server should echo back)
      sendMessage(content, "text");
    }
  };
  // Auto-scroll to bottom when messages change (smart behavior)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  // On scroll, determine if user is near bottom
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 200; // px
      const atBottom = el.scrollHeight - (el.scrollTop + el.clientHeight) < threshold;
      setIsNearBottom(atBottom);
      if (atBottom) setNewMessagesCount(0);
    };

    el.addEventListener("scroll", onScroll);
    // initial check
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // When new messages arrive, auto-scroll only if user is near bottom
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    if (isNearBottom) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    } else {
      setNewMessagesCount((c) => c + 1);
    }
  }, [currentMessages?.length, isNearBottom]);

  // Helper to build date label
  const getDateLabel = (dateStr: any) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isSameDay = d.toDateString() === today.toDateString();
    if (isSameDay) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 7) {
      return d.toLocaleDateString([], { weekday: 'short' });
    }

    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Build items with separators
  const items: Array<any> = [];
  let lastDateKey: string | null = null;
  (currentMessages || []).forEach((m: any) => {
    const dateKey = new Date(m.timestamp).toDateString();
    if (dateKey !== lastDateKey) {
      items.push({ type: 'separator', key: `sep_${dateKey}`, label: getDateLabel(m.timestamp) });
      lastDateKey = dateKey;
    }
    items.push({ type: 'message', message: m });
  });

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center rounded-tr-lg p-4 border-b bg-white">
        <ChatHeader
          avatar={room?.avatarInfo?.type === 'image' ? room.avatarInfo.value : '/image/teachers/english.png'}
          name={room?.displayName || 'Conversation'}
          status={room?.isOnline ? 'online' : undefined}
          onBack={onBack}
          participants={room?.participants}
        />
        {/* Additional action icons can be added here if needed */}
      </div>
      <div className="relative flex-1">
        <div ref={messagesContainerRef} className="absolute inset-0 overflow-y-auto scrollbar-hide p-4">
          {items.map((it, idx) => {
            if (it.type === 'separator') {
              return (
                <div key={it.key} className="text-center px-4 py-2 bg-white rounded-md w-fit mx-auto text-xs text-[#030E18] my-4">
                  {it.label}
                </div>
              );
            }

            const msg = it.message;
            const index = idx; // index for dropdown keys
            return (
              <MessageBubble
                key={msg._id || index}
                msg={mapToBubble(msg)}
                index={index}
                openSubMenu={openSubMenu}
                toggleSubMenu={toggleSubMenu}
                setReplyingMessage={setReplyingMessage}
              />
            );
          })}
        </div>

        {/* New messages button */}
        {newMessagesCount > 0 && (
          <div className="absolute right-4 bottom-24">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg"
              onClick={() => {
                const el = messagesContainerRef.current;
                if (!el) return;
                el.scrollTop = el.scrollHeight;
                setNewMessagesCount(0);
              }}
            >
              {newMessagesCount} new
            </button>
          </div>
        )}
      </div>
      {replyingMessage && (
        // Assuming you have a ReplyPreview component to show reply info
        <ReplyPreview
          replyingMessage={replyingMessage}
          onCancel={() => setReplyingMessage(null)}
        />
      )}
      {/* Typing indicator */}
      {typingUsers && typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500 flex items-center gap-2">
          <span className="font-medium">{typingUsers[0].userName || 'Someone'}</span>
          <span className="text-gray-400">is typing</span>
          <TypingDots />
        </div>
      )}

      <MessageInput onSendMessage={handleSend} onTyping={(isTyping) => sendTyping && sendTyping(isTyping)} />
    </div>
  );
}
