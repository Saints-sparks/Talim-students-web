"use client";

import { useCallback, useEffect } from "react";
import type { Socket } from "socket.io-client";
import { newestServerMessageId, normalizeMessage } from "@/lib/chat";
import type { ChatAck, ChatMessage, ChatRoomJoined } from "@/types/chat";
import { JOIN_TIMEOUT } from "./constants";
import { withJoinedRoom } from "./listReducers";
import { emptyRoomState, joinFailurePatch, joinedPatch, leavePatch } from "./roomReducers";
import { subscribe } from "./socketEvents";
import type { ChatStore } from "./useChatStore";

/**
 * Which room is open and whether it is joined: selecting, leaving and
 * retrying a join, the join timeout, and applying the server's join reply.
 * A room is joined only while it is open on screen.
 *
 * @param store - The shared chat store.
 * @param socket - The app's socket, or null while signed out.
 * @param markVisibleAsRead - Called once a joined room has its messages.
 * @param backfill - Fetches messages newer than a cursor, for a rejoin with a gap.
 * @returns The room controls, plus `joinRoom`, `leaveRoom`, `failJoin` and `clearJoinTimer` for the other hooks.
 */
export function useRoomSession(
  store: ChatStore,
  socket: Socket | null,
  markVisibleAsRead: (roomId: string) => void,
  backfill: (roomId: string, cursor: string) => Promise<void>
) {
  const {
    socketRef,
    userIdsRef,
    chatRoomsRef,
    roomStatesRef,
    selectedRef,
    joinTimersRef,
    setChatRooms,
    patchRoom,
    setSelectedRoomId,
  } = store;

  const clearJoinTimer = useCallback(
    (roomId: string) => {
      const timer = joinTimersRef.current.get(roomId);
      if (timer) clearTimeout(timer);
      joinTimersRef.current.delete(roomId);
    },
    [joinTimersRef]
  );

  const failJoin = useCallback(
    (roomId: string, failure?: { code?: string; message?: string }) => {
      // A rejected handshake is retried by the socket after a token refresh.
      if (failure?.code === "UNAUTHENTICATED") return;
      if (selectedRef.current !== roomId) return;
      clearJoinTimer(roomId);
      patchRoom(roomId, joinFailurePatch(failure?.code));
    },
    [clearJoinTimer, patchRoom, selectedRef]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      clearJoinTimer(roomId);
      patchRoom(roomId, { status: "joining", error: null });

      // While offline the join is sent by the `connect` handler instead, and the
      // offline banner explains the wait, so the timeout only runs once sent.
      const current = socketRef.current;
      if (current?.connected) {
        joinTimersRef.current.set(
          roomId,
          setTimeout(() => {
            joinTimersRef.current.delete(roomId);
            if (roomStatesRef.current[roomId]?.status === "joining") {
              failJoin(roomId);
            }
          }, JOIN_TIMEOUT)
        );
        current.emit("join-chat-room", { roomId }, (ack: ChatAck) => {
          if (ack && ack.ok === false) failJoin(roomId, ack.error);
        });
      }
    },
    [clearJoinTimer, failJoin, patchRoom, socketRef, joinTimersRef, roomStatesRef]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      clearJoinTimer(roomId);
      if (socketRef.current?.connected) {
        socketRef.current.emit("leave-chat-room", { roomId });
      }
      patchRoom(roomId, leavePatch);
    },
    [clearJoinTimer, patchRoom, socketRef]
  );

  const selectRoom = useCallback(
    (roomId: string) => {
      if (!roomId) return;
      const previous = selectedRef.current;
      if (previous && previous !== roomId) leaveRoom(previous);

      selectedRef.current = roomId;
      setSelectedRoomId(roomId);
      // Re-selecting (e.g. after Back or a failed join) always joins again.
      joinRoom(roomId);
    },
    [joinRoom, leaveRoom, selectedRef, setSelectedRoomId]
  );

  const unselectRoom = useCallback(() => {
    const previous = selectedRef.current;
    if (!previous) return;
    leaveRoom(previous);
    selectedRef.current = null;
    setSelectedRoomId(null);
  }, [leaveRoom, selectedRef, setSelectedRoomId]);

  const retryJoin = useCallback(
    (roomId: string) => {
      if (selectedRef.current === roomId) joinRoom(roomId);
    },
    [joinRoom, selectedRef]
  );

  useEffect(() => {
    if (!socket) return;

    const onChatRoomJoined = (data: ChatRoomJoined) => {
      const roomId = String(data?.roomId || "");
      if (!roomId || roomId !== selectedRef.current) return;
      clearJoinTimer(roomId);

      const incoming: ChatMessage[] = (data.messages || []).map(normalizeMessage);
      const before = roomStatesRef.current[roomId] ?? emptyRoomState(roomId);
      const newestKnown = newestServerMessageId(before.messages);
      const isFirstLoad = !newestKnown;

      patchRoom(roomId, (room) => joinedPatch(room, data, incoming, isFirstLoad));

      const joinedRoom = data.room;
      if (joinedRoom && !chatRoomsRef.current.some((r) => r.roomId === roomId)) {
        setChatRooms((rooms) => withJoinedRoom(rooms, joinedRoom, userIdsRef.current));
      }

      // Messages that arrived while we were away and aren't in this first page.
      if (newestKnown && !incoming.some((m) => m._id === newestKnown)) {
        void backfill(roomId, newestKnown);
      }
      markVisibleAsRead(roomId);
    };

    return subscribe(socket, { "chat-room-joined": onChatRoomJoined });
  }, [
    socket,
    backfill,
    clearJoinTimer,
    markVisibleAsRead,
    patchRoom,
    setChatRooms,
    selectedRef,
    roomStatesRef,
    chatRoomsRef,
    userIdsRef,
  ]);

  return { selectRoom, unselectRoom, retryJoin, joinRoom, leaveRoom, failJoin, clearJoinTimer };
}
