"use client";

import { useCallback, useEffect } from "react";
import type { Socket } from "socket.io-client";
import {
  applyMessagesRead,
  needsReadMark,
  newestReadableMessage,
} from "@/lib/chat";
import type { ChatReadEvent } from "@/types/chat";
import { clearUnread, withReadAt } from "./listReducers";
import { isVisible } from "./roomReducers";
import { subscribe } from "./socketEvents";
import type { ChatStore, EmitWithAck } from "./useChatStore";

/**
 * Read state: marks the open room read as messages arrive, and applies other
 * members' read receipts to my messages.
 *
 * @param store - The shared chat store.
 * @param socket - The app's socket, or null while signed out.
 * @param emitWithAck - Emits an event and resolves with the server's ack.
 * @returns `markVisibleAsRead`, to call whenever new messages land in the open room.
 */
export function useReadReceipts(store: ChatStore, socket: Socket | null, emitWithAck: EmitWithAck) {
  const {
    socketRef,
    userIdsRef,
    chatRoomsRef,
    roomStatesRef,
    selectedRef,
    lastReadSentRef,
    setChatRooms,
    patchRoom,
  } = store;

  /**
   * Marks the open room read up to the newest message from someone else, with
   * one `mark-room-read`, only while the chat is on screen and the window has focus.
   */
  const markVisibleAsRead = useCallback(
    (roomId: string) => {
      if (!isVisible() || selectedRef.current !== roomId) return;
      const room = roomStatesRef.current[roomId];
      if (!socketRef.current?.connected || !room || room.status !== "ready") return;

      setChatRooms((rooms) => clearUnread(rooms, roomId));

      const ids = userIdsRef.current;
      const candidate = newestReadableMessage(room.messages, ids);
      const listRoom = chatRoomsRef.current.find((r) => r.roomId === roomId);
      const previous = lastReadSentRef.current.get(roomId);
      if (!needsReadMark(candidate, ids, listRoom?.lastReadAt, previous)) return;

      lastReadSentRef.current.set(roomId, { _id: candidate._id, createdAt: candidate.createdAt });
      emitWithAck("mark-room-read", { roomId, upToMessageId: candidate._id }).then((ack) => {
        if (ack.ok) {
          const readAt = typeof ack.readAt === "string" ? ack.readAt : candidate.createdAt;
          setChatRooms((rooms) => withReadAt(rooms, roomId, readAt));
          return;
        }
        // Let the next trigger (new message, focus, reconnect) try again.
        if (lastReadSentRef.current.get(roomId)?._id === candidate._id) {
          if (previous) lastReadSentRef.current.set(roomId, previous);
          else lastReadSentRef.current.delete(roomId);
        }
      });
    },
    [
      emitWithAck,
      setChatRooms,
      socketRef,
      userIdsRef,
      chatRoomsRef,
      roomStatesRef,
      selectedRef,
      lastReadSentRef,
    ]
  );

  // Another member read up to a message: update ticks on my copies.
  useEffect(() => {
    if (!socket) return;
    const onMessagesRead = (data: ChatReadEvent) => {
      const roomId = String(data?.roomId || "");
      const userId = String(data?.userId || "");
      const room = roomStatesRef.current[roomId];
      if (!room || !userId || !data?.readAt) return;
      const messages = applyMessagesRead(room.messages, userId, data.readAt);
      if (messages !== room.messages) patchRoom(roomId, { messages });
    };
    return subscribe(socket, { "messages-read": onMessagesRead });
  }, [socket, patchRoom, roomStatesRef]);

  // Mark what arrived while the tab was hidden or the window unfocused once it's back.
  useEffect(() => {
    const onReturn = () => {
      if (isVisible() && selectedRef.current) markVisibleAsRead(selectedRef.current);
    };
    document.addEventListener("visibilitychange", onReturn);
    window.addEventListener("focus", onReturn);
    return () => {
      document.removeEventListener("visibilitychange", onReturn);
      window.removeEventListener("focus", onReturn);
    };
  }, [markVisibleAsRead, selectedRef]);

  return { markVisibleAsRead };
}
