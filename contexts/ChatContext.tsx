"use client";

import React, { createContext, useCallback, useContext, ReactNode } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { JOIN_FAILED_MESSAGE } from "@/contexts/chat/constants";
import { totalUnreadOf } from "@/contexts/chat/listReducers";
import { emptyRoomState } from "@/contexts/chat/roomReducers";
import type {
  ChatContextValue,
  OutgoingMedia,
  RoomRemovalReason,
  RoomRemovedListener,
} from "@/contexts/chat/types";
import { useChatStore } from "@/contexts/chat/useChatStore";
import { useConnectionEvents } from "@/contexts/chat/useConnectionEvents";
import { useMembership } from "@/contexts/chat/useMembership";
import { useMessagePaging } from "@/contexts/chat/useMessagePaging";
import { useMessageStream } from "@/contexts/chat/useMessageStream";
import { useOutbox } from "@/contexts/chat/useOutbox";
import { useReadReceipts } from "@/contexts/chat/useReadReceipts";
import { useResetOnUserChange } from "@/contexts/chat/useResetOnUserChange";
import { useRoomList } from "@/contexts/chat/useRoomList";
import { useRoomSession } from "@/contexts/chat/useRoomSession";
import { useServerErrors } from "@/contexts/chat/useServerErrors";

export { JOIN_FAILED_MESSAGE, emptyRoomState };
export type { ChatContextValue, OutgoingMedia, RoomRemovalReason, RoomRemovedListener };

const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * The students chat store: the room list, each open room's messages, sending,
 * read receipts and membership, kept current from the app's one socket.
 * Composes the hooks in `contexts/chat/`, one per concern.
 *
 * @param props - The provider's children.
 * @returns The provider element.
 */
export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const { socket, isConnected, connectionStatus, emitWithAck } = useWebSocketContext();

  const {
    store,
    currentUserIds,
    primaryUserId,
    chatRooms,
    roomStates,
    selectedRoomId,
    isLoading,
    error,
    totalUnread,
  } = useChatStore(socket, user);

  const { refreshChatRooms } = useRoomList(store, socket, emitWithAck);
  const { markVisibleAsRead } = useReadReceipts(store, socket, emitWithAck);
  const { loadOlderMessages, backfill } = useMessagePaging(
    store,
    socket,
    emitWithAck,
    markVisibleAsRead
  );
  const { sendMessage, retryMessage, deleteFailedMessage, markFailed, flushOutbox } =
    useOutbox(store);
  const { selectRoom, unselectRoom, retryJoin, joinRoom, leaveRoom, failJoin, clearJoinTimer } =
    useRoomSession(store, socket, markVisibleAsRead, backfill);
  const { deleteStoredMessage } = useMessageStream(store, socket, markVisibleAsRead);
  const { leaveGroup, onRoomRemoved } = useMembership(
    store,
    socket,
    leaveRoom,
    clearJoinTimer,
    refreshChatRooms
  );
  useServerErrors(store, socket, failJoin, markFailed);
  useConnectionEvents(store, socket, joinRoom, flushOutbox, refreshChatRooms);
  useResetOnUserChange(store, primaryUserId);

  // Drafts survive switching rooms.
  const getDraft = useCallback(
    (roomId: string) => store.draftsRef.current.get(roomId) || "",
    [store]
  );
  const setDraft = useCallback(
    (roomId: string, text: string) => {
      if (text) store.draftsRef.current.set(roomId, text);
      else store.draftsRef.current.delete(roomId);
    },
    [store]
  );

  const value: ChatContextValue = {
    chatRooms,
    isLoading,
    isConnected,
    connectionStatus,
    error,
    totalUnread: totalUnread ?? totalUnreadOf(chatRooms),
    refreshChatRooms,
    currentUserIds,
    selectedRoomId,
    selectRoom,
    unselectRoom,
    retryJoin,
    roomStates,
    loadOlderMessages,
    sendMessage,
    retryMessage,
    deleteFailedMessage,
    deleteStoredMessage,
    getDraft,
    setDraft,
    leaveGroup,
    onRoomRemoved,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

/**
 * The chat store for the current subtree.
 *
 * @returns The chat context value.
 * @throws When used outside a `ChatProvider`.
 */
export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
