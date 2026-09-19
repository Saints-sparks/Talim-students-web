"use client";

import { useCallback, useMemo } from "react";
import { emptyRoomState, useChatContext, type OutgoingMedia } from "@/contexts/ChatContext";
import type { RoomState } from "@/types/chat";

/**
 *
 */
export interface UseRoomMessagesReturn extends RoomState {
  /** True only while the first page is loading (cached messages show instantly). */
  isLoading: boolean;
  isConnected: boolean;
  /** Text, or files / a voice note with the text as caption. */
  sendMessage: (text: string, media?: OutgoingMedia) => void;
  loadMoreMessages: () => void;
  retryJoin: () => void;
  retryMessage: (clientMessageId: string) => void;
  deleteFailedMessage: (clientMessageId: string) => void;
  /** Deletes a stored message. Rejects with the server's message. */
  deleteMessage: (messageId: string) => Promise<void>;
  draft: string;
  setDraft: (text: string) => void;
}

/** The message store for one room, backed by the app-wide ChatProvider. */
export const useRoomMessages = (roomId: string | null): UseRoomMessagesReturn => {
  const chat = useChatContext();
  const {
    roomStates,
    isConnected,
    sendMessage: send,
    loadOlderMessages,
    retryJoin: rejoin,
    retryMessage: resend,
    deleteFailedMessage: removeFailed,
    deleteStoredMessage,
    getDraft,
    setDraft: storeDraft,
  } = chat;

  const room = useMemo(
    () => (roomId ? roomStates[roomId] : undefined) ?? emptyRoomState(roomId || ""),
    [roomId, roomStates]
  );

  const sendMessage = useCallback(
    (text: string, media?: OutgoingMedia) => roomId && send(roomId, text, media),
    [roomId, send]
  );
  const loadMoreMessages = useCallback(
    () => roomId && loadOlderMessages(roomId),
    [roomId, loadOlderMessages]
  );
  const retryJoin = useCallback(() => roomId && rejoin(roomId), [roomId, rejoin]);
  const retryMessage = useCallback(
    (clientMessageId: string) => roomId && resend(roomId, clientMessageId),
    [roomId, resend]
  );
  const deleteFailedMessage = useCallback(
    (clientMessageId: string) => roomId && removeFailed(roomId, clientMessageId),
    [roomId, removeFailed]
  );
  const deleteMessage = useCallback(
    (messageId: string) => (roomId ? deleteStoredMessage(roomId, messageId) : Promise.resolve()),
    [roomId, deleteStoredMessage]
  );
  const setDraft = useCallback(
    (text: string) => roomId && storeDraft(roomId, text),
    [roomId, storeDraft]
  );

  return {
    ...room,
    isLoading: (room.status === "joining" || room.status === "idle") && room.messages.length === 0,
    isConnected,
    sendMessage,
    loadMoreMessages,
    retryJoin,
    retryMessage,
    deleteFailedMessage,
    deleteMessage,
    draft: roomId ? getDraft(roomId) : "",
    setDraft,
  };
};
