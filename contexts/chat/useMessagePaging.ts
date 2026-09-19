"use client";

import { useCallback, useEffect } from "react";
import type { Socket } from "socket.io-client";
import { normalizeMessage } from "@/lib/chat";
import type { ChatMessage, ChatMessagesPage } from "@/types/chat";
import { BACKFILL_MAX_PAGES, BACKFILL_PAGE_SIZE, PAGE_SIZE } from "./constants";
import { pagePatch } from "./roomReducers";
import { subscribe } from "./socketEvents";
import type { ChatStore, EmitWithAck } from "./useChatStore";

/**
 * History: merges pages of messages into the open room, loads older pages on
 * demand, and catches up on what arrived while the room was closed.
 *
 * @param store - The shared chat store.
 * @param socket - The app's socket, or null while signed out.
 * @param emitWithAck - Emits an event and resolves with the server's ack.
 * @param markVisibleAsRead - Called after a page lands in the open room.
 * @returns `applyPage`, `loadOlderMessages` and `backfill`.
 */
export function useMessagePaging(
  store: ChatStore,
  socket: Socket | null,
  emitWithAck: EmitWithAck,
  markVisibleAsRead: (roomId: string) => void
) {
  const { roomStatesRef, selectedRef, patchRoom } = store;

  const applyPage = useCallback(
    (page: ChatMessagesPage) => {
      const roomId = String(page?.roomId || "");
      if (!roomId || roomId !== selectedRef.current) return;
      const incoming: ChatMessage[] = (page.messages || []).map(normalizeMessage);

      patchRoom(roomId, (room) => pagePatch(room, page, incoming));
      markVisibleAsRead(roomId);
    },
    [markVisibleAsRead, patchRoom, selectedRef]
  );

  const loadOlderMessages = useCallback(
    (roomId: string) => {
      const room = roomStatesRef.current[roomId];
      if (!room || room.isLoadingMore || !room.hasMore || !room.nextCursor) return;

      patchRoom(roomId, { isLoadingMore: true, loadMoreError: null });
      emitWithAck("fetch-messages", {
        roomId,
        cursor: room.nextCursor,
        direction: "before",
        limit: PAGE_SIZE,
      }).then((ack) => {
        if (ack.ok) {
          applyPage({ roomId, direction: "before", ...ack });
        } else if (roomStatesRef.current[roomId]?.isLoadingMore) {
          patchRoom(roomId, {
            isLoadingMore: false,
            loadMoreError: ack.error?.message || "Couldn't load older messages",
          });
        }
      });
    },
    [applyPage, emitWithAck, patchRoom, roomStatesRef]
  );

  /** Fetches what arrived after the newest message we already had (reconnect / reopen). */
  const backfill = useCallback(
    async (roomId: string, cursor: string) => {
      let next: string | undefined = cursor;
      for (let page = 0; page < BACKFILL_MAX_PAGES && next; page++) {
        const ack = await emitWithAck("fetch-messages", {
          roomId,
          cursor: next,
          direction: "after",
          limit: BACKFILL_PAGE_SIZE,
        });
        if (!ack.ok || selectedRef.current !== roomId) return;
        applyPage({ roomId, direction: "after", ...ack });
        next = ack.hasMore ? ack.prevCursor : undefined;
      }
    },
    [applyPage, emitWithAck, selectedRef]
  );

  useEffect(() => {
    if (!socket) return;
    const onMessagesUpdate = (data: ChatMessagesPage) => applyPage(data);
    return subscribe(socket, { "messages-update": onMessagesUpdate });
  }, [socket, applyPage]);

  return { applyPage, loadOlderMessages, backfill };
}
