"use client";

import { useCallback } from "react";
import { toast } from "@/components/CustomToast";
import {
  useAttachmentUpload,
  type ChatUploadFn,
  type SendableAttachment,
} from "@/components/chat-kit";
import { chatService } from "@/services/chat.service";
import { mergeMessages } from "@/lib/chat";
import type { ChatAck } from "@/types/chat";
import { SEND_TIMEOUT } from "./constants";
import {
  buildOutgoing,
  buildSendPayload,
  discardEntry,
  storedFromAck,
} from "./outbox";
import {
  failMessage,
  localIdOf,
  retryingMessage,
  withUploadProgress,
  withoutMessage,
} from "./roomReducers";
import type { OutgoingMedia } from "./types";
import type { ChatStore } from "./useChatStore";

/** The app's upload helper in the shape the chat kit expects. */
const uploadChatFile: ChatUploadFn = (file, onProgress) =>
  chatService.uploadChatAttachment(file, onProgress);

/**
 * Sending: shows a pending bubble at once, uploads any files, emits the
 * message with a timeout and merges the ack under the same `clientMessageId`.
 * A message that fails stays as failed and can be retried; anything still
 * pending when the socket is offline is resent, oldest first, on reconnect.
 *
 * @param store - The shared chat store.
 * @returns `sendMessage`, `retryMessage`, `deleteFailedMessage`, and `markFailed` / `flushOutbox` for the other hooks.
 */
export function useOutbox(store: ChatStore) {
  const {
    socketRef,
    userIdsRef,
    userRef,
    roomStatesRef,
    inflightSendsRef,
    outboxRef,
    patchRoom,
  } = store;
  const { upload: uploadFiles } = useAttachmentUpload(uploadChatFile);

  /** Frees a media message's local previews and forgets its files. */
  const discardOutboxEntry = useCallback(
    (clientMessageId: string) => {
      discardEntry(outboxRef.current, clientMessageId);
    },
    [outboxRef]
  );

  const markFailed = useCallback(
    (roomId: string, clientMessageId: string, message?: string) => {
      const localId = localIdOf(clientMessageId);
      const room = roomStatesRef.current[roomId];
      if (!room?.messages.some((m) => m._id === localId)) {
        // The bubble is gone (stored copy arrived, deleted, room dropped).
        discardOutboxEntry(clientMessageId);
        return;
      }
      patchRoom(roomId, (current) => ({
        messages: failMessage(current.messages, localId, message),
      }));
    },
    [discardOutboxEntry, patchRoom, roomStatesRef]
  );

  /** Upload progress (0–1) of one file on a pending bubble. */
  const setUploadProgress = useCallback(
    (roomId: string, clientMessageId: string, index: number, fraction: number) => {
      const localId = localIdOf(clientMessageId);
      const room = roomStatesRef.current[roomId];
      const message = room?.messages.find((m) => m._id === localId);
      if (!message || message.uploadProgress?.[index] === fraction) return;
      patchRoom(roomId, (current) => ({
        messages: withUploadProgress(current.messages, localId, index, fraction),
      }));
    },
    [patchRoom, roomStatesRef]
  );

  /** Uploads what isn't uploaded yet, then sends one queued message. Offline: stays pending. */
  const emitSend = useCallback(
    async (roomId: string, clientMessageId: string) => {
      // Offline: the bubble stays pending and is flushed on reconnect.
      if (!socketRef.current?.connected || inflightSendsRef.current.has(clientMessageId)) return;

      const pending = roomStatesRef.current[roomId]?.messages.find(
        (m) => m._id === localIdOf(clientMessageId)
      );
      if (!pending) return;
      const entry = outboxRef.current.get(clientMessageId);

      inflightSendsRef.current.add(clientMessageId);
      let attachments: SendableAttachment[] = [];
      if (entry?.items.length) {
        try {
          attachments = await uploadFiles(entry.items, {
            onProgress: (index, fraction) =>
              setUploadProgress(roomId, clientMessageId, index, fraction),
          });
        } catch (err) {
          inflightSendsRef.current.delete(clientMessageId);
          markFailed(
            roomId,
            clientMessageId,
            err instanceof Error && err.message ? err.message : "Upload failed"
          );
          return;
        }
      }

      const current = socketRef.current;
      if (!current?.connected) {
        // Went offline while uploading: uploaded files are kept, the send waits for reconnect.
        inflightSendsRef.current.delete(clientMessageId);
        return;
      }

      const payload = buildSendPayload(roomId, clientMessageId, pending, entry, attachments);

      current
        .timeout(SEND_TIMEOUT)
        .emit("send-chat-message", payload, (err: unknown, ack: ChatAck) => {
          inflightSendsRef.current.delete(clientMessageId);
          if (err || !ack?.ok) {
            markFailed(
              roomId,
              clientMessageId,
              err ? "Not sent" : ack?.error?.message || "Not sent"
            );
            return;
          }
          if (ack.message) {
            const saved = storedFromAck(ack.message, clientMessageId);
            if (roomStatesRef.current[roomId]) {
              patchRoom(roomId, (room) => ({ messages: mergeMessages(room.messages, [saved]) }));
            }
          }
          discardOutboxEntry(clientMessageId);
        });
    },
    [
      discardOutboxEntry,
      markFailed,
      patchRoom,
      setUploadProgress,
      uploadFiles,
      socketRef,
      inflightSendsRef,
      roomStatesRef,
      outboxRef,
    ]
  );

  const sendMessage = useCallback(
    (roomId: string, text: string, media: OutgoingMedia = {}) => {
      const me = userRef.current;
      const outgoing = buildOutgoing(roomId, text, media, {
        userId: userIdsRef.current[0] || "",
        firstName: me?.firstName,
        lastName: me?.lastName,
        avatar: me?.userAvatar,
      });
      if (!outgoing) return;
      if ("error" in outgoing) {
        toast.error(outgoing.error);
        return;
      }
      const { clientMessageId, pending, entry } = outgoing;
      if (entry) outboxRef.current.set(clientMessageId, entry);
      patchRoom(roomId, (room) => ({ messages: mergeMessages(room.messages, [pending]) }));
      void emitSend(roomId, clientMessageId);
    },
    [emitSend, patchRoom, userRef, userIdsRef, outboxRef]
  );

  const retryMessage = useCallback(
    (roomId: string, clientMessageId: string) => {
      const localId = localIdOf(clientMessageId);
      patchRoom(roomId, (room) => ({
        messages: retryingMessage(room.messages, localId),
      }));
      // Files that already uploaded keep their attachment and are skipped.
      void emitSend(roomId, clientMessageId);
    },
    [emitSend, patchRoom]
  );

  const deleteFailedMessage = useCallback(
    (roomId: string, clientMessageId: string) => {
      if (inflightSendsRef.current.has(clientMessageId)) return;
      const localId = localIdOf(clientMessageId);
      patchRoom(roomId, (room) => ({
        messages: withoutMessage(room.messages, localId),
      }));
      discardOutboxEntry(clientMessageId);
    },
    [discardOutboxEntry, patchRoom, inflightSendsRef]
  );

  const flushOutbox = useCallback(() => {
    Object.values(roomStatesRef.current).forEach((room) => {
      room.messages.forEach((message) => {
        if (message.status === "pending" && message.clientMessageId) {
          void emitSend(room.roomId, message.clientMessageId);
        }
      });
    });
  }, [emitSend, roomStatesRef]);

  return { sendMessage, retryMessage, deleteFailedMessage, markFailed, flushOutbox };
}
