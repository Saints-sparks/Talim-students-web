"use client";

import { useCallback, useEffect } from "react";
import type { Socket } from "socket.io-client";
import { applyPresenceChanged, isSameUser } from "@/lib/chat";
import type {
  ChatReadEvent,
  ChatRoomActivity,
  ChatRoomUpdatedEvent,
  ChatRoomsUpdate,
} from "@/types/chat";
import { buildRoomList, withActivity, withRoomDetails, withRoomRead } from "./listReducers";
import { isVisible, roomUpdatePatch } from "./roomReducers";
import { subscribe } from "./socketEvents";
import type { ChatStore, EmitWithAck } from "./useChatStore";

/**
 * The chat list: asks the server for the user's rooms and keeps the list, its
 * order, unread badges and room details current from the server's events.
 *
 * @param store - The shared chat store.
 * @param socket - The app's socket, or null while signed out.
 * @param emitWithAck - Emits an event and resolves with the server's ack.
 * @returns `refreshChatRooms`, which asks for the list unless a request is already out.
 */
export function useRoomList(store: ChatStore, socket: Socket | null, emitWithAck: EmitWithAck) {
  const {
    socketRef,
    userIdsRef,
    chatRoomsRef,
    roomStatesRef,
    selectedRef,
    roomListInflightRef,
    setChatRooms,
    patchRoom,
    setIsLoading,
    setError,
    setTotalUnread,
  } = store;

  const refreshChatRooms = useCallback(() => {
    if (!socketRef.current?.connected || roomListInflightRef.current) return;
    roomListInflightRef.current = true;
    if (!chatRoomsRef.current.length) setIsLoading(true);
    emitWithAck("fetch-chat-rooms", {}).then((ack) => {
      roomListInflightRef.current = false;
      if (!ack.ok) {
        setIsLoading(false);
        setError(ack.error?.message || "Couldn't load your chats");
      }
    });
  }, [emitWithAck, socketRef, roomListInflightRef, chatRoomsRef, setIsLoading, setError]);

  useEffect(() => {
    if (!socket) return;

    const onChatRoomActivity = ({ roomId, lastMessage }: ChatRoomActivity) => {
      if (!roomId || !lastMessage) return;
      if (!chatRoomsRef.current.some((r) => r.roomId === roomId)) {
        refreshChatRooms(); // a room we haven't seen yet
        return;
      }
      const mine = isSameUser(lastMessage.senderId, userIdsRef.current);
      const isOpen = selectedRef.current === roomId && isVisible();
      setChatRooms((rooms) => withActivity(rooms, { roomId, lastMessage }, mine, isOpen));
    };

    const onChatRoomsUpdate = (data: ChatRoomsUpdate | null | undefined) => {
      roomListInflightRef.current = false;
      if (!data || !Array.isArray(data.rooms)) {
        setError("Invalid chat rooms data received");
        setIsLoading(false);
        return;
      }
      const open = isVisible() ? selectedRef.current : null;
      const rooms = data.rooms;
      setChatRooms(() => buildRoomList(rooms, userIdsRef.current, open));
      setIsLoading(false);
      setError(null);
    };

    const onUnreadMessagesUpdate = (data: { unreadCount?: number }) => {
      if (typeof data?.unreadCount === "number") setTotalUnread(data.unreadCount);
    };

    // I read this room on another device (or this one): clear its badge.
    const onRoomRead = (data: ChatReadEvent) => {
      const roomId = String(data?.roomId || "");
      if (!roomId || !data?.readAt) return;
      setChatRooms((rooms) => withRoomRead(rooms, roomId, data));
    };

    // Someone I share a room with came online or went offline (first / last device).
    const onPresenceChanged = (data: { userId?: string; isOnline?: boolean }) => {
      const personId = String(data?.userId || "");
      if (!personId || typeof data.isOnline !== "boolean") return;
      const isOnline = data.isOnline;
      setChatRooms((rooms) => applyPresenceChanged(rooms, personId, isOnline, userIdsRef.current));
    };

    const onRoomUpdated = (data: ChatRoomUpdatedEvent) => {
      const roomId = String(data?.roomId || "");
      if (!roomId) return;
      setChatRooms((rooms) => withRoomDetails(rooms, roomId, data));
      if (roomStatesRef.current[roomId]) {
        patchRoom(roomId, (room) => roomUpdatePatch(room, data));
      }
    };

    return subscribe(socket, {
      "chat-room-activity": onChatRoomActivity,
      "chat-rooms-update": onChatRoomsUpdate,
      "unread-messages-update": onUnreadMessagesUpdate,
      "room-read": onRoomRead,
      "presence-changed": onPresenceChanged,
      "room-updated": onRoomUpdated,
    });
  }, [
    socket,
    refreshChatRooms,
    setChatRooms,
    patchRoom,
    setIsLoading,
    setError,
    setTotalUnread,
    userIdsRef,
    chatRoomsRef,
    roomStatesRef,
    selectedRef,
    roomListInflightRef,
  ]);

  return { refreshChatRooms };
}
