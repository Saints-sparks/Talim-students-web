"use client";

import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { subscribe } from "./socketEvents";
import type { ChatStore } from "./useChatStore";

/**
 * Every socket connect (first and reconnects): rejoin the open room (its
 * joined handler backfills the gap), resend pending messages, refresh the list.
 * Also runs once at once when the socket is already connected.
 *
 * @param store - The shared chat store.
 * @param socket - The app's socket, or null while signed out.
 * @param joinRoom - Joins a room.
 * @param flushOutbox - Resends every pending message.
 * @param refreshChatRooms - Asks the server for the room list.
 */
export function useConnectionEvents(
  store: ChatStore,
  socket: Socket | null,
  joinRoom: (roomId: string) => void,
  flushOutbox: () => void,
  refreshChatRooms: () => void
) {
  const { selectedRef } = store;

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      const open = selectedRef.current;
      if (open) joinRoom(open);
      flushOutbox();
      refreshChatRooms();
    };

    const unsubscribe = subscribe(socket, { connect: onConnect });
    if (socket.connected) onConnect();
    return unsubscribe;
  }, [socket, joinRoom, flushOutbox, refreshChatRooms, selectedRef]);
}
