"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { ChatRoomData, ChatRoomsUpdateData, ChatMessage } from "./useWebSocket";

export interface RealtimeChatRoom extends ChatRoomData {
  displayName: string;
  avatarInfo: {
    type: "image" | "initials";
    value: string;
    bgColor?: string;
  };
  isOnline?: boolean;
  lastSeen?: Date;
}

interface UseRealtimeChatReturn {
  chatRooms: RealtimeChatRoom[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;

  // Chat room operations
  refreshChatRooms: () => void;
  searchChatRooms: (searchTerm: string) => RealtimeChatRoom[];
  getFilteredChatRooms: (type?: string) => RealtimeChatRoom[];

  // Room selection and management
  selectedRoomId: string | null;
  selectRoom: (roomId: string) => void;
  unselectRoom: () => void;

  // Message operations
  sendMessage: (
    content: string,
    type?: "text" | "voice",
    duration?: number
  ) => void;
  markAsRead: (messageId: string) => void;
  markRoomAsRead: (roomId: string) => void;

  // Real-time events
  onNewMessage: (callback: (message: ChatMessage) => void) => () => void;
  onRoomUpdate: (
    callback: (roomId: string, room: RealtimeChatRoom) => void
  ) => () => void;
}

export const useRealtimeChat = (): UseRealtimeChatReturn => {
  const [chatRooms, setChatRooms] = useState<RealtimeChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const { user } = useAuthContext();

  // Get WebSocket context with error handling
  let webSocketContext;
  try {
    webSocketContext = useWebSocketContext();
  } catch (error) {
    // Return a default state if context is not available
    return {
      chatRooms: [],
      isLoading: false,
      isConnected: false,
      error: "WebSocket not available",
      refreshChatRooms: () => {},
      searchChatRooms: () => [],
      getFilteredChatRooms: () => [],
      selectedRoomId: null,
      selectRoom: () => {},
      unselectRoom: () => {},
      sendMessage: () => {},
      markAsRead: () => {},
      markRoomAsRead: () => {},
      onNewMessage: () => () => {},
      onRoomUpdate: () => () => {},
    };
  }

  const {
    socket,
    isConnected,
    connectionStatus,
    fetchChatRooms,
    onChatRoomsUpdate,
    onChatMessage,
    sendChatMessage,
    joinChatRoom,
    leaveChatRoom,
    markMessageAsRead,
    markRoomAsRead: wsMarkRoomAsRead,
    onPresence,
  } = webSocketContext;

  const searchTermRef = useRef<string>("");
  const mountedRef = useRef(true);

  // Initial chat rooms fetch when connected
  useEffect(() => {
    // For students app, prioritize user.id over user.userId
    const userId = user?.id || user?.userId;

    console.log("🔍 useRealtimeChat connection check:", {
      isConnected,
      user: user
        ? {
            id: user?.id,
            userId: user?.userId,
            firstName: user?.firstName,
            lastName: user?.lastName,
            role: user?.role,
          }
        : null,
      hasUserId: !!userId,
      socketConnected: socket?.connected,
    });

    if (isConnected && userId && socket?.connected) {
      console.log("🔄 Fetching chat rooms for student user:", userId);
      setIsLoading(true);
      setError(null);
      fetchChatRooms(userId);
    } else {
      console.log("🔍 Not fetching chat rooms:", {
        isConnected,
        hasUserId: !!userId,
        socketConnected: socket?.connected,
      });
    }
  }, [isConnected, user?.id, user?.userId, socket?.connected, fetchChatRooms]);

  // Transform chat room data for better UX - Students focus on groups
  const transformChatRoom = useCallback(
    (room: ChatRoomData): RealtimeChatRoom => {
      let displayName = room.name || "Chat Room";
      let avatarInfo: RealtimeChatRoom["avatarInfo"] = {
        type: "initials",
        value: "CR",
        bgColor: generateColorFromString(room.roomId),
      };
      let isOnline = false;

      // Handle different room types - Students mainly use group/class chats
      switch (room.type) {
        case "group":
        case "class":
        case "class_group":
          // For group/class chats, use the room name directly
          displayName = room.name || `Class ${room.classId || "Chat"}`;
          avatarInfo = {
            type: "initials",
            value: displayName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            bgColor: generateColorFromString(room.roomId),
          };
          // Check if any teachers are online
          isOnline = room.participants.some(
            (p) => p.role === "teacher" && p.isOnline
          );
          break;

        case "one_to_one":
          // Although students mainly use groups, handle private chats if they exist
          const otherParticipant = room.participants.find(
            (p) => p.userId !== user?.id && p.userId !== user?.userId
          );

          if (otherParticipant) {
            displayName =
              `${otherParticipant.firstName || ""} ${
                otherParticipant.lastName || ""
              }`.trim() || "Unknown User";
            isOnline = otherParticipant.isOnline || false;

            if (otherParticipant.userAvatar) {
              avatarInfo = {
                type: "image",
                value: otherParticipant.userAvatar,
              };
            } else {
              const initials = `${otherParticipant.firstName?.[0] || ""}${
                otherParticipant.lastName?.[0] || ""
              }`.toUpperCase();
              avatarInfo = {
                type: "initials",
                value: initials || "U",
                bgColor: generateColorFromString(otherParticipant.userId),
              };
            }
          }
          break;
      }

      // Transform lastMessage to match expected format
      let transformedLastMessage = room.lastMessage;
      if (room.lastMessage && (room.lastMessage as any).text) {
        transformedLastMessage = {
          ...room.lastMessage,
          content: (room.lastMessage as any).text,
        };
      }

      return {
        ...room,
        displayName,
        avatarInfo,
        isOnline,
        lastMessage: transformedLastMessage,
      };
    },
    [user?.id, user?.userId]
  );

  // Handle real-time chat rooms updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onChatRoomsUpdate((data: ChatRoomsUpdateData) => {
      console.log("📨 Chat rooms update received for student:", data);
      console.log(
        "🔍 Room types found:",
        data.rooms.map((r) => ({
          roomId: r.roomId,
          name: r.name,
          type: r.type,
        }))
      );

      if (!mountedRef.current) return;

      try {
        // Filter for group/class chats primarily - students don't typically use private chats
        const groupRooms = data.rooms.filter(
          (room) =>
            room.type === "group" ||
            room.type === "class" ||
            room.type === "class_group"
        );

        console.log(
          "🎯 Filtered group rooms:",
          groupRooms.map((r) => ({
            roomId: r.roomId,
            name: r.name,
            type: r.type,
          }))
        );

        const transformedRooms = groupRooms.map(transformChatRoom);

        console.log(
          "✨ Transformed rooms for students:",
          transformedRooms.map((r) => ({
            roomId: r.roomId,
            displayName: r.displayName,
            type: r.type,
            participantCount: r.participants.length,
          }))
        );

        // Sort by last message time
        const sortedRooms = transformedRooms.sort((a, b) => {
          const timeA = a.lastMessage?.timestamp
            ? new Date(a.lastMessage.timestamp).getTime()
            : 0;
          const timeB = b.lastMessage?.timestamp
            ? new Date(b.lastMessage.timestamp).getTime()
            : 0;
          return timeB - timeA;
        });

        setChatRooms(sortedRooms);
        setIsLoading(false);
        setError(null);

        console.log(
          `📨 Updated ${sortedRooms.length} group chat rooms for student`,
          {
            roomNames: sortedRooms.map((r) => r.displayName),
            totalRooms: data.totalRooms,
            filteredFrom: data.rooms.length,
          }
        );
      } catch (err) {
        console.error("Error processing chat rooms update:", err);
        setError("Failed to process chat rooms");
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [isConnected, onChatRoomsUpdate, transformChatRoom]);

  // Handle presence updates: update participants' isOnline flags
  useEffect(() => {
    if (!isConnected || !onPresence) return;

    const unsubscribe = onPresence((data) => {
      if (!mountedRef.current) return;

      const { userId, isOnline } = data;
      setChatRooms((prev) =>
        prev.map((room) => {
          const updatedParticipants = room.participants.map((p: any) => {
            const participantData = p._doc || p;
            const pid =
              participantData.userId ||
              participantData._id ||
              p.userId ||
              p._id;
            if (pid === userId) {
              return { ...p, isOnline };
            }
            return p;
          });

          // If any participant changed online status, update room's isOnline
          const isRoomOnline = updatedParticipants.some(
            (p: any) => p.isOnline && p.role === "teacher"
          );

          return {
            ...room,
            participants: updatedParticipants,
            isOnline: isRoomOnline,
          };
        })
      );
    });

    return unsubscribe;
  }, [isConnected, onPresence]);

  // Handle real-time messages
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onChatMessage((message: ChatMessage) => {
      console.log("📨 New message received in student app:", message);

      if (!mountedRef.current) return;

      // Update the chat room's last message
      setChatRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) => {
          if (room.roomId === message.roomId) {
            return {
              ...room,
              lastMessage: {
                content: message.content,
                senderId: message.senderId,
                senderName: message.senderName,
                timestamp: message.timestamp,
                type: message.type,
              },
              updatedAt: message.timestamp,
              // Increment unread count if not from current user
              unreadCount:
                message.senderId !== user?.id &&
                message.senderId !== user?.userId
                  ? room.unreadCount + 1
                  : room.unreadCount,
            };
          }
          return room;
        });

        // Re-sort by last message time
        return updatedRooms.sort((a, b) => {
          const timeA = a.lastMessage?.timestamp
            ? new Date(a.lastMessage.timestamp).getTime()
            : 0;
          const timeB = b.lastMessage?.timestamp
            ? new Date(b.lastMessage.timestamp).getTime()
            : 0;
          return timeB - timeA;
        });
      });
    });

    return unsubscribe;
  }, [isConnected, onChatMessage, user?.id, user?.userId]);

  // Chat room operations
  const refreshChatRooms = useCallback(() => {
    if (isConnected) {
      console.log("🔄 Manual refresh triggered for student");
      setIsLoading(true);
      fetchChatRooms(user?.id || user?.userId);
    }
  }, [isConnected, fetchChatRooms]);

  const searchChatRooms = useCallback(
    (searchTerm: string): RealtimeChatRoom[] => {
      searchTermRef.current = searchTerm.toLowerCase();

      if (!searchTerm.trim()) {
        return chatRooms;
      }

      return chatRooms.filter(
        (room) =>
          room.displayName.toLowerCase().includes(searchTermRef.current) ||
          room.participants.some((p) =>
            `${p.firstName || ""} ${p.lastName || ""}`
              .toLowerCase()
              .includes(searchTermRef.current)
          )
      );
    },
    [chatRooms]
  );

  const getFilteredChatRooms = useCallback(
    (type?: string): RealtimeChatRoom[] => {
      if (!type || type === "all") {
        return chatRooms;
      }

      // Students primarily filter by subject/class types
      if (type === "classes") {
        return chatRooms.filter(
          (room) => room.type === "class" || room.type === "class_group"
        );
      }

      if (type === "groups") {
        return chatRooms.filter((room) => room.type === "group");
      }

      return chatRooms;
    },
    [chatRooms]
  );

  // Room selection
  const selectRoom = useCallback(
    (roomId: string) => {
      if (selectedRoomId === roomId) return;

      // Leave current room if any
      if (selectedRoomId) {
        leaveChatRoom(selectedRoomId);
      }

      // Join new room
      setSelectedRoomId(roomId);
      joinChatRoom(roomId);

      console.log(`📨 Student joined chat room: ${roomId}`);
    },
    [selectedRoomId, joinChatRoom, leaveChatRoom]
  );

  const unselectRoom = useCallback(() => {
    if (selectedRoomId) {
      leaveChatRoom(selectedRoomId);
      setSelectedRoomId(null);
      console.log("📨 Student left current chat room");
    }
  }, [selectedRoomId, leaveChatRoom]);

  // Message operations
  const sendMessage = useCallback(
    (content: string, type: "text" | "voice" = "text", duration?: number) => {
      if (!selectedRoomId) {
        console.error("No room selected for sending message");
        return;
      }

      if (!user?.id && !user?.userId) {
        console.error("No user information available");
        return;
      }

      const userName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";

      const messageData = {
        content,
        roomId: selectedRoomId,
        senderName: userName,
        type,
        ...(duration && { duration }),
      };

      sendChatMessage(messageData);
      console.log("📨 Student sent message:", messageData);
    },
    [selectedRoomId, user, sendChatMessage]
  );

  const markAsRead = useCallback(
    (messageId: string) => {
      markMessageAsRead(messageId);
    },
    [markMessageAsRead]
  );

  const markRoomAsRead = useCallback(
    (roomId: string) => {
      // locally clear unread count for the room
      setChatRooms((prev) =>
        prev.map((r) => (r.roomId === roomId ? { ...r, unreadCount: 0 } : r))
      );

      try {
        // try server-side mark (if supported)
        markRoomAsRead?.(roomId as any);
      } catch (err) {
        // ignore if not available
      }
    },
    [markMessageAsRead]
  );

  // Event handlers for external use
  const onNewMessage = useCallback(
    (callback: (message: ChatMessage) => void) => {
      return onChatMessage(callback);
    },
    [onChatMessage]
  );

  const onRoomUpdate = useCallback(
    (callback: (roomId: string, room: RealtimeChatRoom) => void) => {
      // This would be implemented if needed for real-time room updates
      return () => {};
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (selectedRoomId) {
        leaveChatRoom(selectedRoomId);
      }
    };
  }, [selectedRoomId, leaveChatRoom]);

  return {
    chatRooms,
    isLoading,
    isConnected,
    error,
    refreshChatRooms,
    searchChatRooms,
    getFilteredChatRooms,
    selectedRoomId,
    selectRoom,
    unselectRoom,
    sendMessage,
    markAsRead,
    markRoomAsRead,
    onNewMessage,
    onRoomUpdate,
  };
};

// Utility function to generate consistent colors from strings
function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
