// The outbox: media messages waiting to upload and send, and the pure steps of
// building an outgoing message. No React; the hook that drives it is `useOutbox`.
import {
  MAX_FILES_PER_MESSAGE,
  TOO_MANY_FILES_MESSAGE,
  fileKind,
  messageTypeFor,
  validateFile,
  type AttachmentKind,
  type SendableAttachment,
} from "@/components/chat-kit";
import { newClientMessageId, normalizeMessage } from "@/lib/chat";
import type { ChatAck, ChatAttachment, ChatMessage } from "@/types/chat";
import { localIdOf } from "./roomReducers";
import type { OutboxEntry, OutgoingMedia } from "./types";

/** Who is sending, for the pending bubble. */
export interface OutgoingSender {
  userId: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

/** A message ready to show and send. */
export interface OutgoingMessage {
  clientMessageId: string;
  pending: ChatMessage;
  /** Present when there are files to upload. */
  entry?: OutboxEntry;
}

/** Frees a media message's local previews and forgets its files. */
export function discardEntry(outbox: Map<string, OutboxEntry>, clientMessageId: string): void {
  const entry = outbox.get(clientMessageId);
  if (!entry) return;
  entry.previewUrls.forEach((url) => URL.revokeObjectURL(url));
  outbox.delete(clientMessageId);
}

/** Forgets a room's queued media, except sends that are already in flight. */
export function discardRoomEntries(
  outbox: Map<string, OutboxEntry>,
  roomId: string,
  inflight: Set<string>
): void {
  outbox.forEach((entry, clientMessageId) => {
    if (entry.roomId !== roomId || inflight.has(clientMessageId)) return;
    entry.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    outbox.delete(clientMessageId);
  });
}

/** Forgets everything queued (signing out or switching user). */
export function discardAllEntries(outbox: Map<string, OutboxEntry>): void {
  outbox.forEach((entry) => entry.previewUrls.forEach((url) => URL.revokeObjectURL(url)));
  outbox.clear();
}

/**
 * Checks and builds an outgoing message and its pending bubble.
 *
 * @param roomId - The room it goes to.
 * @param text - The typed text (trimmed here); the caption when there are files.
 * @param media - Files or a voice note, and the message being replied to.
 * @param sender - The signed-in user.
 * @returns `null` when there is nothing to send, `{ error }` when a file is refused, else the message.
 */
export function buildOutgoing(
  roomId: string,
  text: string,
  media: OutgoingMedia,
  sender: OutgoingSender
): OutgoingMessage | { error: string } | null {
  const trimmed = text.trim();
  const files = media.voice ? [media.voice.file] : media.files ?? [];
  if (!roomId || (!trimmed && files.length === 0)) return null;
  if (files.length > MAX_FILES_PER_MESSAGE) return { error: TOO_MANY_FILES_MESSAGE };
  const invalid = media.voice ? null : files.map(validateFile).find(Boolean);
  if (invalid) return { error: invalid };

  const clientMessageId = newClientMessageId();
  const kinds: AttachmentKind[] = files.map((file) => (media.voice ? "audio" : fileKind(file)));
  const type = messageTypeFor(kinds, Boolean(media.voice));
  const duration = media.voice?.duration;
  const previewUrls: string[] = [];

  // The pending bubble shows local previews until the stored copy replaces it.
  const attachments: ChatAttachment[] = files.map((file, index) => {
    const kind = kinds[index];
    let url = "";
    if (kind === "image" || kind === "video" || kind === "audio") {
      url = URL.createObjectURL(file);
      previewUrls.push(url);
    }
    return {
      url,
      type: kind,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      ...(kind === "audio" && duration !== undefined ? { duration } : {}),
    };
  });

  const entry: OutboxEntry | undefined = files.length
    ? {
        roomId,
        type,
        duration,
        items: files.map((file, index) => ({ file, kind: kinds[index], duration })),
        previewUrls,
      }
    : undefined;

  const pending: ChatMessage = {
    _id: localIdOf(clientMessageId),
    roomId,
    clientMessageId,
    senderId: sender.userId,
    senderName: `${sender.firstName || ""} ${sender.lastName || ""}`.trim(),
    senderAvatar: sender.avatar || "",
    text: trimmed,
    type,
    attachments,
    duration,
    readBy: [],
    createdAt: new Date().toISOString(),
    status: "pending",
    uploadProgress: files.length ? files.map(() => 0) : undefined,
    replyTo: media.replyTo
      ? {
          messageId: media.replyTo.messageId,
          senderName: media.replyTo.senderName,
          preview: media.replyTo.preview,
        }
      : undefined,
  };
  return { clientMessageId, pending, entry };
}

/** The `send-chat-message` payload for a pending bubble, with its uploaded attachments. */
export function buildSendPayload(
  roomId: string,
  clientMessageId: string,
  pending: ChatMessage,
  entry: OutboxEntry | undefined,
  attachments: SendableAttachment[]
) {
  return {
    roomId,
    text: pending.text,
    type: entry ? entry.type : "text",
    clientMessageId,
    ...(attachments.length ? { attachments } : {}),
    ...(pending.replyTo ? { replyToId: pending.replyTo.messageId } : {}),
    ...(entry?.type === "voice" && entry.duration !== undefined
      ? { duration: entry.duration }
      : {}),
  };
}

/** The stored copy from a send ack, carrying the `clientMessageId` it was sent with. */
export function storedFromAck(
  message: NonNullable<ChatAck["message"]>,
  clientMessageId: string
): ChatMessage {
  return normalizeMessage({
    ...message,
    clientMessageId:
      typeof message.clientMessageId === "string" && message.clientMessageId
        ? message.clientMessageId
        : clientMessageId,
  });
}
