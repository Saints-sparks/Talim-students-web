import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-hot-toast";

// WebSocket connection configuration
const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:5005";

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
  fetchChatRooms: () => void;
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

  // Connection management
  connect: (userId: string) => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const useWebSocket = (): WebSocketContextType => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userIdRef = useRef<string | null>(null);

  // Debug state changes
  useEffect(() => {
    console.log("🔍 WebSocket state changed:", {
      isConnected,
      connectionStatus,
    });
  }, [isConnected, connectionStatus]);

  // Connect to WebSocket
  const connect = useCallback(
    (userId: string) => {
      // Prevent multiple connections
      if (socketRef.current?.connected) {
        console.log("WebSocket already connected, skipping connection attempt");
        return;
      }

      // Prevent multiple connection attempts while connecting
      if (connectionStatus === "connecting") {
        console.log(
          "WebSocket connection in progress, skipping duplicate attempt"
        );
        return;
      }

      console.log("🔌 Attempting to connect to WebSocket...", {
        url: WEBSOCKET_URL,
        userId,
        env: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
      });

      setConnectionStatus("connecting");
      userIdRef.current = userId;

      try {
        const socket = io(WEBSOCKET_URL, {
          query: { userId },
          transports: ["websocket", "polling"],
          timeout: 20000,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 10,
        });

        // Connection successful
        socket.on("connect", () => {
          console.log("🔌 WebSocket connected:", socket.id);
          console.log(
            "🔌 Setting state: isConnected=true, connectionStatus=connected"
          );
          setIsConnected(true);
          setConnectionStatus("connected");
          toast.success("Connected to real-time services");

          // Clear any pending reconnection attempts
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        });

        // Connection failed
        socket.on("connect_error", (error) => {
          console.error("🔌 WebSocket connection error:", error);
          setIsConnected(false);
          setConnectionStatus("error");
          toast.error("Failed to connect to real-time services");
        });

        // Disconnection
        socket.on("disconnect", (reason) => {
          console.log("🔌 WebSocket disconnected:", reason);
          setIsConnected(false);
          setConnectionStatus("disconnected");

          // Don't show toast for intentional disconnections
          if (reason !== "io client disconnect") {
            toast.error("Connection lost");

            // Attempt to reconnect after a delay
            if (userIdRef.current && reason !== "io server disconnect") {
              reconnectTimeoutRef.current = setTimeout(() => {
                console.log("🔄 Attempting to reconnect...");
                reconnect();
              }, 3000);
            }
          }
        });

        // Error handling
        socket.on("error", (error) => {
          console.error("🔌 WebSocket error:", error);
          toast.error("WebSocket error occurred");
        });

        // Reconnection events
        socket.on("reconnect", (attemptNumber) => {
          console.log(
            `🔄 WebSocket reconnected after ${attemptNumber} attempts`
          );
          toast.success("Reconnected to real-time services");
        });

        socket.on("reconnect_error", (error) => {
          console.error("🔄 WebSocket reconnection failed:", error);
        });

        socket.on("reconnect_failed", () => {
          console.error("🔄 WebSocket reconnection failed after max attempts");
          toast.error("Unable to reconnect. Please refresh the page.");
          setConnectionStatus("error");
        });

        socketRef.current = socket;
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setConnectionStatus("error");
        toast.error("Failed to initialize WebSocket connection");
      }
    },
    [connectionStatus]
  ); // Add connectionStatus as dependency

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
    console.log("🔌 WebSocket manually disconnected");
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
      socketRef.current.emit("join-chat-room", { roomId });
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

  const fetchChatRooms = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("fetch-chat-rooms");
      console.log("📨 Fetching chat rooms");
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
        // Show toast notification
        toast.success(`${notification.title}: ${notification.body}`, {
          duration: 4000,
          position: "top-right",
        });

        callback(notification);
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

    // Connection management
    connect,
    disconnect,
    reconnect,
  };
};
