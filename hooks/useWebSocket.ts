import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-hot-toast";

// WebSocket connection configuration
const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:5005";
// "https://talim-be-dev.onrender.com";

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

  // Optional: mark whole room as read
  markRoomAsRead: (roomId: string) => void;

  // Typing indicator helpers
  sendTyping: (data: { roomId: string; isTyping: boolean }) => void;
  onTyping: (
    callback: (data: {
      roomId: string;
      userId: string;
      isTyping: boolean;
      userName?: string;
    }) => void
  ) => () => void;

  // Presence updates (user online/offline)
  sendPresence: (data: { userId: string; isOnline: boolean }) => void;
  onPresence: (
    callback: (data: {
      userId: string;
      isOnline: boolean;
      lastSeen?: string;
    }) => void
  ) => () => void;

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
      console.log("loginUserId", userId);

      // Prevent multiple connections
      if (socketRef.current?.connected) {
        console.log("🔌 Already connected to WebSocket");
        return;
      }

      // Prevent multiple connection attempts while connecting
      if (connectionStatus === "connecting") {
        console.log("🔌 Connection in progress, skipping duplicate attempt");
        return;
      }

      // Check cooldown period
      const now = Date.now();
      if (
        reconnectAttemptsRef.current >= maxReconnectAttempts &&
        now - lastFailedAttemptRef.current < reconnectCooldown
      ) {
        console.log("🔌 Still in cooldown period, skipping connection attempt");
        return;
      }

      // Reset attempts if cooldown period has passed
      if (now - lastFailedAttemptRef.current >= reconnectCooldown) {
        reconnectAttemptsRef.current = 0;
      }

      console.log(`🔌 Connecting to WebSocket with userId: ${userId}`);
      setConnectionStatus("connecting");
      userIdRef.current = userId;

      try {
        const socket = io(WEBSOCKET_URL, {
          auth: { userId },
          transports: ["websocket"],
          upgrade: false,
          rememberUpgrade: false,
          timeout: 10000,
          // Disable automatic reconnection to prevent double reconnection
          reconnection: false,
        });

        // Connection successful
        socket.on("connect", () => {
          console.log("🔌 WebSocket connected successfully");
          setIsConnected(true);
          setConnectionStatus("connected");

          // Only show success toast on reconnection after failures
          if (reconnectAttemptsRef.current > 0) {
            showToast("success", "Connection restored");
          }

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

          if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.log(
              `🔌 Max reconnection attempts (${maxReconnectAttempts}) reached. Entering cooldown.`
            );
            showToast("error", "Unable to connect to real-time services");
          } else if (reconnectAttemptsRef.current === 1) {
            // Only show error on first attempt to avoid spam
            showToast("error", "Connection failed, retrying...");
          }
        });

        // Disconnection
        socket.on("disconnect", (reason) => {
          console.log("🔌 WebSocket disconnected:", reason);
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
                console.log(
                  `🔄 Attempting to reconnect... (attempt ${
                    reconnectAttemptsRef.current + 1
                  }/${maxReconnectAttempts})`
                );
                reconnect();
              }, delay);
            } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
              console.log(
                "🔌 Max reconnection attempts reached. Manual reconnection required."
              );
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
    console.log("🔌 WebSocket manually disconnected");
  }, []);

  const sendTyping = useCallback(
    (data: { roomId: string; isTyping: boolean }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("typing", data);
      }
    },
    []
  );

  const sendPresence = useCallback(
    (data: { userId: string; isOnline: boolean }) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("presence", data);
      }
    },
    []
  );

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
      console.log(`📨 Joined chat room: ${roomId}`);
    } else {
      toast.error("Not connected to chat service");
    }
  }, []);

  const leaveChatRoom = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave-chat-room", { roomId });
      console.log(`📨 Left chat room: ${roomId}`);
    }
  }, []);

  const sendChatMessage = useCallback(
    (
      message: Omit<ChatMessage, "_id" | "senderId" | "timestamp" | "readBy">
    ) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("send-chat-message", message);
        console.log(`📨 Sent message to room: ${message.roomId}`);
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

  // Mark entire room as read (optional server support)
  const markRoomAsRead = useCallback((roomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("mark-room-read", { roomId });
      console.log(`📨 Marked room as read: ${roomId}`);
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
      console.log("📨 Fetching chat rooms for user:", id);
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
        console.log(`📨 Fetching messages for room: ${data.roomId}`);
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
        console.log("🔔 Received notification:", notification);
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

      socketRef.current.on("messages-update", callback);
      return () => {
        socketRef.current?.off("messages-update", callback);
      };
    },
    []
  );

  const onTyping = useCallback(
    (
      callback: (data: {
        roomId: string;
        userId: string;
        isTyping: boolean;
        userName?: string;
      }) => void
    ) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("typing", callback);
      return () => {
        socketRef.current?.off("typing", callback as any);
      };
    },
    []
  );

  const onPresence = useCallback(
    (
      callback: (data: {
        userId: string;
        isOnline: boolean;
        lastSeen?: string;
      }) => void
    ) => {
      if (!socketRef.current) return () => {};

      socketRef.current.on("presence", callback);
      return () => {
        socketRef.current?.off("presence", callback as any);
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
    sendTyping,
    sendPresence,
    markRoomAsRead,

    // Event listeners
    onChatMessage,
    onNotification,
    onChatRoomHistory,
    onChatRoomsUpdate,
    onChatRoomJoined,
    onMessagesUpdate,
    onTyping,
    onPresence,

    // Connection management
    connect,
    disconnect,
    reconnect,
  };
};
