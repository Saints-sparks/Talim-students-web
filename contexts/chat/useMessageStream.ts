"use client";

import { useCallback, useEffect } from "react";
import type { Socket } from "socket.io-client";
import { authFetch } from "@/lib/authFetch";
import { API_BASE_URL } from "@/lib/constants";
import {
  applyMessageDeleted,
  applyMessageDeletedToRooms,
  isSameUser,
  mergeMessages,
  normalizeMessage,
} from "@/lib/chat";
import type { RawChatMessage } from "@/types/chat";
import { subscribe } from "./socketEvents";
import type { ChatStore } from "./useChatStore";

/**
 * Live messages in the open room: new ones as they arrive, and deletions
 * (from the server, or from this user's own delete).
 *
 * @param store - The shared chat store.
 * @param socket - The app's socket, or null while signed out.
 * @param markVisibleAsRead - Called when someone else's message lands in the open room.
 * @returns `deleteStoredMessage`, which deletes over REST and rejects with the server's message.
 */
export function useMessageStream(
  store: ChatStore,
  socket: Socket | null,
  markVisibleAsRead: (roomId: string) => void
) {
  const { userIdsRef, roomStatesRef, selectedRef, patchRoom, setChatRooms } = store;

  const deleteStoredMessage = useCallback(
    async (roomId: string, messageId: string) => {
      let res: Response;
      try {
        res = await authFetch(`${API_BASE_URL}/chat/messages/${encodeURIComponent(messageId)}`, {
          method: "DELETE",
        });
      } catch {
        throw new Error("Couldn't delete the message. Check your connection and try again.");
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
        throw new Error(message || "Couldn't delete the message");
      }
      // The server also sends `message-deleted`; applying it here updates the
      // deleter's screen at once, and applying twice is a no-op.
      const room = roomStatesRef.current[roomId];
      if (room) {
        const messages = applyMessageDeleted(room.messages, messageId);
        if (messages !== room.messages) patchRoom(roomId, { messages });
      }
      setChatRooms((rooms) => applyMessageDeletedToRooms(rooms, roomId, messageId));
    },
    [patchRoom, setChatRooms, roomStatesRef]
  );

  useEffect(() => {
    if (!socket) return;

    const onChatMessage = (raw: RawChatMessage) => {
      const message = normalizeMessage(raw);
      if (!message.roomId || message.roomId !== selectedRef.current) return;
      patchRoom(message.roomId, (room) => ({
        messages: mergeMessages(room.messages, [message]),
      }));
      if (!isSameUser(message.senderId, userIdsRef.current)) {
        markVisibleAsRead(message.roomId);
      }
    };

    // A message in one of my rooms was deleted.
    const onMessageDeleted = (data: { roomId?: string; messageId?: string }) => {
      const roomId = String(data?.roomId || "");
      const messageId = String(data?.messageId || "");
      if (!roomId || !messageId) return;
      const room = roomStatesRef.current[roomId];
      if (room) {
        const messages = applyMessageDeleted(room.messages, messageId);
        if (messages !== room.messages) patchRoom(roomId, { messages });
      }
      setChatRooms((rooms) => applyMessageDeletedToRooms(rooms, roomId, messageId));
    };

    return subscribe(socket, {
      "chat-message": onChatMessage,
      "message-deleted": onMessageDeleted,
    });
  }, [socket, markVisibleAsRead, patchRoom, setChatRooms, selectedRef, userIdsRef, roomStatesRef]);

  return { deleteStoredMessage };
}
