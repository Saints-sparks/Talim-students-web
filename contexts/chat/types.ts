import type { ConnectionStatus } from "@/hooks/useWebSocket";
import type { ReplyDraft, UploadItem } from "@/components/chat-kit";
import type { ChatMessage, RealtimeChatRoom, RoomState } from "@/types/chat";

/** Files or a voice note sent with a message; the text becomes their caption. */
export interface OutgoingMedia {
  files?: File[];
  voice?: { file: File; duration: number };
  /** The message being replied to. */
  replyTo?: ReplyDraft;
}

/** A media message waiting to upload and send. */
export interface OutboxEntry {
  roomId: string;
  type: ChatMessage["type"];
  /** Voice note length, seconds. */
  duration?: number;
  /** Each file keeps its uploaded attachment, so a retry only uploads what failed. */
  items: UploadItem[];
  /** Object URLs of the pending bubble's previews, revoked when sent or deleted. */
  previewUrls: string[];
}

/** Why a room left my list: I left it, or someone removed me. */
export type RoomRemovalReason = "left" | "removed";
export type RoomRemovedListener = (roomId: string, reason: RoomRemovalReason) => void;

export interface ChatContextValue {
  // Chat list
  chatRooms: RealtimeChatRoom[];
  isLoading: boolean;
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  error: string | null;
  /** Total unread messages across all rooms, as reported by the server. */
  totalUnread: number;
  refreshChatRooms: () => void;
  currentUserIds: string[];

  // Room selection — a room is joined only while it is open on screen
  selectedRoomId: string | null;
  selectRoom: (roomId: string) => void;
  unselectRoom: () => void;
  retryJoin: (roomId: string) => void;

  // Per-room message stores
  roomStates: Record<string, RoomState>;
  loadOlderMessages: (roomId: string) => void;
  /** Sends text, or files / a voice note with the text as caption. */
  sendMessage: (roomId: string, text: string, media?: OutgoingMedia) => void;
  retryMessage: (roomId: string, clientMessageId: string) => void;
  deleteFailedMessage: (roomId: string, clientMessageId: string) => void;
  /** Deletes a stored message (mine, or any if I can manage the room). Rejects with the server's message. */
  deleteStoredMessage: (roomId: string, messageId: string) => Promise<void>;

  // Drafts survive switching rooms
  getDraft: (roomId: string) => string;
  setDraft: (roomId: string, text: string) => void;

  // Membership
  /** Leaves a group (removes me). Resolves with the server's message on failure. */
  leaveGroup: (roomId: string) => Promise<{ ok: boolean; message?: string }>;
  /** Called when a room is dropped because I left or was removed (e.g. to navigate away). */
  onRoomRemoved: (listener: RoomRemovedListener) => () => void;
}
