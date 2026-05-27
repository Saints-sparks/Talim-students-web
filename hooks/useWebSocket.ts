import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "@/components/CustomToast";
import { WEBSOCKET_URL } from "@/lib/constants";

// Event types that match the backend gateway
export interface ChatMessage {
  _id: string;
  senderId: string;
  content: string;
  roomId: string;
  senderName: string;
  type: "text" | "voice";
  duration?: number;
  timestamp: Date;
  readBy: string[];
}

export interface NotificationData {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, any>;
  sender?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  read: boolean;
}

export interface ChatRoomData {
  roomId: string;
  name: string;
  type: string;
  participants: Array<{
    _id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    userAvatar?: string | null;
    isActive?: boolean;
    isOnline: boolean;
  }>;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: Date;
    type: string;
  };
  unreadCount: number;
  updatedAt: Date;
  classId?: string;
  courseId?: string;
}

export interface ChatRoomsUpdateData {
  rooms: ChatRoomData[];
  totalRooms: number;
}

export interface ChatRoomJoinedData {
  roomId: string;
  roomName: string;
  roomType: string;
  participants: Array<{
    _id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    userAvatar?: string | null;
    isActive?: boolean;
    isOnline: boolean;
  }>;
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor?: string;
  totalParticipants: number;
}

export interface FetchMessagesData {
  roomId: string;
  messages: ChatMessage[];
  hasMore: boolean;
  nextCursor?: string;
  direction: "before" | "after";
}

export interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";

  // Chat functions
  joinChatRoom: (roomId: string) => void;
  leaveChatRoom: (roomId: string) => void;
  sendChatMessage: (
    message: Omit<ChatMessage, "_id" | "senderId" | "timestamp" | "readBy">
  ) => void;
  markMessageAsRead: (messageId: string) => void;
  fetchChatRooms: (userId?: string) => void;
  fetchMessages: (data: {
    roomId: string;
    cursor?: string;
    direction?: "before" | "after";
    limit?: number;
  }) => void;

  // Event listeners
  onChatMessage: (callback: (message: ChatMessage) => void) => () => void;
  onNotification: (
    callback: (notification: NotificationData) => void
  ) => () => void;
  onChatRoomHistory: (
    callback: (data: { roomId: string; messages: any[] }) => void
  ) => () => void;
  onChatRoomsUpdate: (
    callback: (data: ChatRoomsUpdateData) => void
  ) => () => void;
  onChatRoomJoined: (
    callback: (data: ChatRoomJoinedData) => void
  ) => () => void;
  onMessagesUpdate: (callback: (data: FetchMessagesData) => void) => () => void;
  onUnreadMessagesUpdate: (callback: (data: { userId: string; unreadCount: number }) => void) => () => void;

  // Connection management
  connect: (userId: string) => void;
  disconnect: () => void;
  reconnect: () => void;
}

// Toast deduplication to prevent spam
const lastToastTime = new Map<string, number>();
const TOAST_COOLDOWN = 5000; // 5 seconds between same toasts

function showToast(type: "success" | "error", message: string) {
  const key = `${type}:${message}`;
  const now = Date.now();
  const lastTime = lastToastTime.get(key) || 0;

  if (now - lastTime > TOAST_COOLDOWN) {
    lastToastTime.set(key, now);
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }
}

export const useWebSocket = (): WebSocketContextType => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userIdRef = useRef<string | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const lastFailedAttemptRef = useRef(0);

  const maxReconnectAttempts = 3;
  const reconnectCooldown = 30000; // 30 seconds cooldown

  // Connect to WebSocket
  const connect = useCallback(
    (userId: string) => {
      // Prevent multiple connections
      if (socketRef.current?.connected) {
        return;
      }

      // Prevent multiple connection attempts while connecting
      if (connectionStatus === "connecting") {
        return;
      }

      // Check cooldown period
      const now = Date.now();
      if (
        reconnectAttemptsRef.current >= maxReconnectAttempts &&
        now - lastFailedAttemptRef.current < reconnectCooldown
      ) {
        return;
      }

      // Reset attempts if cooldown period has passed
      if (now - lastFailedAttemptRef.current >= reconnectCooldown) {
        reconnectAttemptsRef.current = 0;
      }

      setConnectionStatus("connecting");
      userIdRef.current = userId;

      try {
        const socket = io(WEBSOCKET_URL, {
          query: { userId },
          auth: { userId },
          transports: ["websocket", "polling"],
          timeout: 10000,
          reconnection: false,
        });

        // Connection successful
        socket.on("connect", () => {
          setIsConnected(true);
          setConnectionStatus("connected");

          reconnectAttemptsRef.current = 0; // Reset attempts on successful connection

          // Clear any pending reconnection timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        });

        // Connection failed
        socket.on("connect_error", (error) => {
          console.error("🔌 WebSocket connection error:", error);
          reconnectAttemptsRef.current++;
          lastFailedAttemptRef.current = Date.now();
          setIsConnected(false);
          setConnectionStatus("error");
        });

        // Disconnection
        socket.on("disconnect", (reason) => {
          setIsConnected(false);
          setConnectionStatus("disconnected");

          // Don't show toast for intentional disconnections
          if (reason !== "io client disconnect") {
            showToast("error", "Connection lost");

            // Only attempt to reconnect if we haven't exceeded max attempts
            if (
              userIdRef.current &&
              reason !== "io server disconnect" &&
              reconnectAttemptsRef.current < maxReconnectAttempts
            ) {
              const delay = Math.min(
                3000 * Math.pow(2, reconnectAttemptsRef.current),
                30000
              ); // Exponential backoff
              reconnectTimeoutRef.current = setTimeout(() => {
                reconnect();
              }, delay);
            }
          }
        });

        // Error handling
        socket.on("error", (error) => {
          console.error("� WebSocket error:", error);
          // Don't show toast for every error to avoid spam
        });

        socketRef.current = socket;
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setConnectionStatus("error");
        showToast("error", "Failed to initialize WebSocket connection");
      }
    },
    [connectionStatus]
  );

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus("disconnected");
    userIdRef.current = null;
    reconnectAttemptsRef.current = 0; // Reset attempts on manual disconnect
  }, []);

  // Reconnect to WebSocket
  const reconnect = useCallback(() => {
    if (userIdRef.current) {
      disconnect();
      setTimeout(() => {
        connect(userIdRef.current!);
      }, 1000);
    }
  }, [connect, disconnect]);

  // Chat functions
  const joinChatRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      const id = userIdRef.current;
      if (!id) {
        toast.error("User ID required to join chat room");
        return;
      }
      socketRef.current.emit("join-chat-room", { roomId, userId: id });
    } else {
      toast.error("Not connected to chat service");
    }
  }, []);

  const leaveChatRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave-chat-room", { roomId });
    }
  }, []);

  const sendChatMessage = useCallback(
    (
      message: Omit<ChatMessage, "_id" | "senderId" | "timestamp" | "readBy">
    ) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("send-chat-message", message);
      } else {
        toast.error("Not connected to chat service");
      }
    },
    []
  );

  const markMessageAsRead = useCallback((messageId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("mark-message-read", { messageId });
    }
  }, []);

  const fetchChatRooms = useCallback((userId?: string) => {
    if (socketRef.current?.connected) {
      const id = userId || userIdRef.current;
      if (!id) {
        toast.error("User ID required to fetch chat rooms");
        return;
      }
      socketRef.current.emit("fetch-chat-rooms", { userId: id });
    } else {
      toast.error("Not connected to chat service");
    }
  }, []);

  const fetchMessages = useCallback(
    (data: {
      roomId: string;
      cursor?: string;
      direction?: "before" | "after";
      limit?: number;
    }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("fetch-messages", data);
      } else {
        toast.error("Not connected to chat service");
      }
    },
    []
  );

  // Event listeners
  const onChatMessage = useCallback(
    (callback: (message: ChatMessage) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("chat-message", callback);
      return () => {
        socketRef.current?.off("chat-message", callback);
      };
    },
    []
  );

  const onNotification = useCallback(
    (callback: (notification: NotificationData) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("notification", (notification: NotificationData) => {
        callback(notification);

        // Show toast notification with deduplication
        showToast("success", notification.title);
      });

      return () => {
        socketRef.current?.off("notification", callback);
      };
    },
    []
  );

  const onChatRoomHistory = useCallback(
    (callback: (data: { roomId: string; messages: any[] }) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("chat-room-history", callback);
      return () => {
        socketRef.current?.off("chat-room-history", callback);
      };
    },
    []
  );

  const onChatRoomsUpdate = useCallback(
    (callback: (data: ChatRoomsUpdateData) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("chat-rooms-update", callback);
      return () => {
        socketRef.current?.off("chat-rooms-update", callback);
      };
    },
    []
  );

  const onChatRoomJoined = useCallback(
    (callback: (data: ChatRoomJoinedData) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("chat-room-joined", callback);
      return () => {
        socketRef.current?.off("chat-room-joined", callback);
      };
    },
    []
  );

  const onMessagesUpdate = useCallback(
    (callback: (data: FetchMessagesData) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("messages-fetched", callback);
      return () => {
        socketRef.current?.off("messages-fetched", callback);
      };
    },
    []
  );

  const onUnreadMessagesUpdate = useCallback(
    (callback: (data: { userId: string; unreadCount: number }) => void) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("unread-messages-update", callback);
      return () => {
        socketRef.current?.off("unread-messages-update", callback);
      };
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionStatus,

    // Chat functions
    joinChatRoom,
    leaveChatRoom,
    sendChatMessage,
    markMessageAsRead,
    fetchChatRooms,
    fetchMessages,

    // Event listeners
    onChatMessage,
    onNotification,
    onChatRoomHistory,
    onChatRoomsUpdate,
    onChatRoomJoined,
    onMessagesUpdate,
    onUnreadMessagesUpdate,

    // Connection management
    connect,
    disconnect,
    reconnect,
  };
};
