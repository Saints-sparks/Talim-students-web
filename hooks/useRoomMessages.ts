"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  ChatMessage,
  ChatRoomJoinedData,
  FetchMessagesData,
} from "./useWebSocket";

interface UseRoomMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  roomInfo: {
    roomId: string;
    roomName: string;
    roomType: string;
    participants: any[];
    totalParticipants: number;
  } | null;
  error: string | null;

  // Message operations
  sendMessage: (
    content: string,
    type?: "text" | "voice",
    duration?: number
  ) => void;
  loadMoreMessages: () => void;
  markAsRead: (messageId: string) => void;

  // Real-time events
  onNewMessage: (callback: (message: ChatMessage) => void) => () => void;
  // Typing participants in the room
  typingUsers: Array<{ userId: string; userName?: string }>;
  // Send typing indicator for current user
  sendTyping: (isTyping: boolean) => void;
}

export const useRoomMessages = (
  roomId: string | null
): UseRoomMessagesReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();

  const { user } = useAuthContext();
  const mountedRef = useRef(true);

  // Get WebSocket context with error handling
  let webSocketContext;
  try {
    webSocketContext = useWebSocketContext();
  } catch (error) {
    return {
      messages: [],
      isLoading: false,
      isLoadingMore: false,
      hasMore: false,
      roomInfo: null,
      error: "WebSocket not available",
      sendMessage: () => {},
      loadMoreMessages: () => {},
      markAsRead: () => {},
      onNewMessage: () => () => {},
      typingUsers: [],
      sendTyping: () => {},
    };
  }

  const {
    isConnected,
    sendChatMessage,
    markMessageAsRead,
    fetchMessages,
    onChatRoomJoined,
    onChatMessage,
    onMessagesUpdate,
    sendTyping: wsSendTyping,
    onTyping,
  } = webSocketContext;

  const [typingUsers, setTypingUsers] = useState<
    Array<{ userId: string; userName?: string }>
  >([]);

  // Track typing participants per room
  useEffect(() => {
    if (!isConnected || !roomId || !onTyping) return;

    const unsubscribe = onTyping((data) => {
      if (data.roomId !== roomId) return;

      setTypingUsers((prev) => {
        if (data.isTyping) {
          // add or update
          if (prev.some((p) => p.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, userName: data.userName }];
        } else {
          // remove
          return prev.filter((p) => p.userId !== data.userId);
        }
      });
    });

    return unsubscribe;
  }, [isConnected, roomId, onTyping]);

  // Reset state when room changes
  useEffect(() => {
    if (roomId) {
      setMessages([]);
      setIsLoading(true);
      setIsLoadingMore(false);
      setHasMore(true);
      setRoomInfo(null);
      setError(null);
      setNextCursor(undefined);
    }
  }, [roomId]);

  // Handle room joined event (initial data)
  useEffect(() => {
    if (!isConnected || !roomId) return;

    const unsubscribe = onChatRoomJoined((data: ChatRoomJoinedData) => {
      if (!mountedRef.current || data.roomId !== roomId) return;

      console.log("📨 Room joined data received for student:", data);

      setRoomInfo({
        roomId: data.roomId,
        roomName: data.roomName,
        roomType: data.roomType,
        participants: data.participants,
        totalParticipants: data.totalParticipants,
      });

      // Set initial messages (most recent)
      setMessages(data.messages || []);
      setHasMore(data.hasMore || false);
      setNextCursor(data.nextCursor);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [isConnected, roomId, onChatRoomJoined]);

  // Handle messages update (pagination)
  useEffect(() => {
    if (!isConnected || !roomId) return;

    const unsubscribe = onMessagesUpdate((data: FetchMessagesData) => {
      if (!mountedRef.current || data.roomId !== roomId) return;

      console.log("📨 Messages update received for student:", data);

      if (data.direction === "before") {
        // Loading older messages
        setMessages((prev) => [...data.messages, ...prev]);
      } else {
        // Loading newer messages
        setMessages((prev) => [...prev, ...data.messages]);
      }

      setHasMore(data.hasMore || false);
      setNextCursor(data.nextCursor);
      setIsLoadingMore(false);
    });

    return unsubscribe;
  }, [isConnected, roomId, onMessagesUpdate]);

  // Handle real-time new messages
  useEffect(() => {
    if (!isConnected || !roomId) return;

    const unsubscribe = onChatMessage((message: ChatMessage) => {
      // Handle both roomId and chatRoomId from backend
      const messageRoomId = message.roomId || (message as any).chatRoomId;
      if (!mountedRef.current || messageRoomId !== roomId) return;

      console.log("📨 New real-time message received for student:", message);

      // Add new message to the end
      setMessages((prev) => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;

        // Try to reconcile with optimistic pending messages
        // Match by senderId + content + timestamp proximity (5s)
        const serverTime = new Date(message.timestamp).getTime();
        const optIndex = prev.findIndex(
          (m) =>
            (m as any)._optimistic &&
            m.senderId === message.senderId &&
            m.content === message.content &&
            Math.abs(new Date(m.timestamp).getTime() - serverTime) < 5000
        );

        if (optIndex !== -1) {
          const next = [...prev];
          next[optIndex] = message; // replace optimistic with server message
          return next;
        }

        return [...prev, message];
      });
    });

    return unsubscribe;
  }, [isConnected, roomId, onChatMessage]);

  // Message operations
  const sendMessage = useCallback(
    (content: string, type: "text" | "voice" = "text", duration?: number) => {
      if (!roomId || !isConnected) {
        console.error("Cannot send message: no room selected or not connected");
        return;
      }

      if (!user?.id && !user?.userId) {
        console.error("Cannot send message: no user information");
        return;
      }

      const userName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";

      const messageData = {
        content,
        roomId,
        senderName: userName,
        type,
        ...(duration && { duration }),
      };

      // Optimistic UI: append a local temporary message
      const tempId = `temp_${Date.now()}`;
      const optimisticMessage = {
        _id: tempId,
        senderId: user?.id || user?.userId,
        senderName: userName,
        content,
        roomId,
        type,
        duration,
        timestamp: new Date(),
        readBy: [user?.id || user?.userId],
        _optimistic: true,
      } as any;

      setMessages((prev) => [...prev, optimisticMessage]);
      sendChatMessage(messageData);
      console.log("📨 Student sent message (optimistic):", messageData);
    },
    [roomId, isConnected, user, sendChatMessage]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!roomId || !isConnected) return;
      if (wsSendTyping) {
        wsSendTyping({ roomId, isTyping });
      }
    },
    [roomId, isConnected, wsSendTyping]
  );

  const loadMoreMessages = useCallback(() => {
    if (!roomId || !isConnected || !hasMore || isLoadingMore || !nextCursor) {
      return;
    }

    console.log("📨 Loading more messages for room:", roomId);
    setIsLoadingMore(true);

    fetchMessages({
      roomId,
      cursor: nextCursor,
      direction: "before",
      limit: 20,
    });
  }, [roomId, isConnected, hasMore, isLoadingMore, nextCursor, fetchMessages]);

  const markAsRead = useCallback(
    (messageId: string) => {
      markMessageAsRead(messageId);
    },
    [markMessageAsRead]
  );

  // Event handlers for external use
  const onNewMessage = useCallback(
    (callback: (message: ChatMessage) => void) => {
      return onChatMessage((message: ChatMessage) => {
        if (message.roomId === roomId) {
          callback(message);
        }
      });
    },
    [roomId, onChatMessage]
  );

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    roomInfo,
    error,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    onNewMessage,
    typingUsers,
    sendTyping,
  };
};
