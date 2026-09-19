"use client";

import { useCallback, useEffect } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "@/components/CustomToast";
import { authFetch } from "@/lib/authFetch";
import { API_BASE_URL } from "@/lib/constants";
import { isSameUser, participantId } from "@/lib/chat";
import type { ChatParticipantsChangedEvent } from "@/types/chat";
import { withParticipants } from "./listReducers";
import { discardRoomEntries } from "./outbox";
import { participantsPatch } from "./roomReducers";
import { subscribe } from "./socketEvents";
import type { RoomRemovalReason, RoomRemovedListener } from "./types";
import type { ChatStore } from "./useChatStore";

/**
 * Membership: leaving a group, being removed from one, and members joining or
 * leaving. A room I am no longer in is forgotten and listeners are told.
 *
 * @param store - The shared chat store.
 * @param socket - The app's socket, or null while signed out.
 * @param leaveRoom - Leaves the open room on the socket.
 * @param clearJoinTimer - Cancels a room's join timeout.
 * @param refreshChatRooms - Asks the server for the room list.
 * @returns `leaveGroup` and `onRoomRemoved`.
 */
export function useMembership(
  store: ChatStore,
  socket: Socket | null,
  leaveRoom: (roomId: string) => void,
  clearJoinTimer: (roomId: string) => void,
  refreshChatRooms: () => void
) {
  const {
    userIdsRef,
    chatRoomsRef,
    roomStatesRef,
    selectedRef,
    inflightSendsRef,
    outboxRef,
    lastReadSentRef,
    draftsRef,
    removedListenersRef,
    setChatRooms,
    patchRoom,
    removeRoomState,
    setSelectedRoomId,
  } = store;

  /** Drops a room I'm no longer in: leaves it if open, forgets it, tells the user. */
  const dropRoom = useCallback(
    (roomId: string, reason: RoomRemovalReason) => {
      const listRoom = chatRoomsRef.current.find((r) => r.roomId === roomId);
      const state = roomStatesRef.current[roomId];
      if (!listRoom && !state) return; // already handled (REST reply and socket event)

      if (selectedRef.current === roomId) {
        leaveRoom(roomId);
        selectedRef.current = null;
        setSelectedRoomId(null);
      }
      clearJoinTimer(roomId);
      removeRoomState(roomId);
      setChatRooms((rooms) => rooms.filter((r) => r.roomId !== roomId));
      draftsRef.current.delete(roomId);
      lastReadSentRef.current.delete(roomId);
      discardRoomEntries(outboxRef.current, roomId, inflightSendsRef.current);

      const name = listRoom?.displayName || state?.roomName || "the group";
      if (reason === "left") toast.info(`You left ${name}`);
      else toast.warning(`You were removed from ${name}`);
      removedListenersRef.current.forEach((listener) => listener(roomId, reason));
    },
    [
      clearJoinTimer,
      leaveRoom,
      setChatRooms,
      removeRoomState,
      setSelectedRoomId,
      chatRoomsRef,
      roomStatesRef,
      selectedRef,
      draftsRef,
      lastReadSentRef,
      outboxRef,
      inflightSendsRef,
      removedListenersRef,
    ]
  );

  const onRoomRemoved = useCallback(
    (listener: RoomRemovedListener) => {
      removedListenersRef.current.add(listener);
      return () => {
        removedListenersRef.current.delete(listener);
      };
    },
    [removedListenersRef]
  );

  const leaveGroup = useCallback(
    async (roomId: string): Promise<{ ok: boolean; message?: string }> => {
      const ids = userIdsRef.current;
      const participants =
        chatRoomsRef.current.find((r) => r.roomId === roomId)?.participants ||
        roomStatesRef.current[roomId]?.participants ||
        [];
      const me = participants.find((p) =>
        [participantId(p), p.userId].filter(Boolean).some((id) => ids.includes(String(id)))
      );
      const myId = me ? participantId(me) : ids[0];
      if (!myId) return { ok: false, message: "Couldn't leave the group. Please try again." };

      try {
        const res = await authFetch(
          `${API_BASE_URL}/chat/rooms/${encodeURIComponent(roomId)}/participants/${encodeURIComponent(myId)}/remove`,
          { method: "PATCH" }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
          return { ok: false, message: message || "Couldn't leave the group. Please try again." };
        }
      } catch {
        return { ok: false, message: "Couldn't leave the group. Check your connection and try again." };
      }
      dropRoom(roomId, "left");
      return { ok: true };
    },
    [dropRoom, userIdsRef, chatRoomsRef, roomStatesRef]
  );

  useEffect(() => {
    if (!socket) return;

    const onParticipantsChanged = (data: ChatParticipantsChangedEvent) => {
      const roomId = String(data?.roomId || "");
      if (!roomId) return;
      const ids = userIdsRef.current;
      if ((data.removed || []).some((id) => ids.includes(String(id)))) {
        dropRoom(roomId, isSameUser(data.by, ids) ? "left" : "removed");
        return;
      }
      if (!chatRoomsRef.current.some((r) => r.roomId === roomId)) {
        // Added to a room we don't list yet.
        if ((data.added || []).some((id) => ids.includes(String(id)))) refreshChatRooms();
      }
      if (!Array.isArray(data.participants)) return;
      const participants = data.participants;
      setChatRooms((rooms) => withParticipants(rooms, roomId, participants, ids));
      if (roomStatesRef.current[roomId]) patchRoom(roomId, participantsPatch(participants));
    };

    return subscribe(socket, { "participants-changed": onParticipantsChanged });
  }, [
    socket,
    dropRoom,
    patchRoom,
    refreshChatRooms,
    setChatRooms,
    userIdsRef,
    chatRoomsRef,
    roomStatesRef,
  ]);

  return { leaveGroup, onRoomRemoved };
}
