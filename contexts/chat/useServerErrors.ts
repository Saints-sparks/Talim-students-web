"use client";

import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import type { ChatServerError } from "@/types/chat";
import { subscribe } from "./socketEvents";
import type { ChatStore } from "./useChatStore";

/**
 * The server's `error` event: fails the message or the join it names, or stops
 * an older-page request. `UNAUTHENTICATED` is ignored; the socket refreshes
 * the token and retries.
 *
 * @param store - The shared chat store.
 * @param socket - The app's socket, or null while signed out.
 * @param failJoin - Marks the open room's join as failed.
 * @param markFailed - Marks a pending message as failed.
 */
export function useServerErrors(
  store: ChatStore,
  socket: Socket | null,
  failJoin: (roomId: string, failure?: { code?: string; message?: string }) => void,
  markFailed: (roomId: string, clientMessageId: string, message?: string) => void
) {
  const { roomStatesRef, patchRoom } = store;

  useEffect(() => {
    if (!socket) return;

    const onServerError = (payload: ChatServerError | null | undefined) => {
      const code = payload?.code;
      if (code === "UNAUTHENTICATED") return;
      const roomId = payload?.roomId ? String(payload.roomId) : "";
      const clientMessageId = payload?.clientMessageId;

      if (clientMessageId) {
        const owner =
          roomId ||
          Object.values(roomStatesRef.current).find((room) =>
            room.messages.some((m) => m.clientMessageId === clientMessageId)
          )?.roomId;
        if (owner) markFailed(owner, clientMessageId, payload?.message);
        return;
      }
      if (!roomId) return;
      const room = roomStatesRef.current[roomId];
      if (room?.status === "joining") {
        failJoin(roomId, { code, message: payload?.message });
      } else if (room?.isLoadingMore) {
        patchRoom(roomId, {
          isLoadingMore: false,
          loadMoreError: payload?.message || "Couldn't load older messages",
        });
      }
    };

    return subscribe(socket, { error: onServerError });
  }, [socket, failJoin, markFailed, patchRoom, roomStatesRef]);
}
