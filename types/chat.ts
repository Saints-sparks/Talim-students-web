// types/chat.ts
// Shapes from the backend chat contract (talimBE-V2/docs/chat-realtime-contract.md).

export type ChatRoomType =
  | "one_to_one"
  | "class_group"
  | "course_group"
  | "parent_group"
  | "admin_parent_group"
  | "custom_group";

export type ChatMessageType = "text" | "voice" | "image" | "file";

export interface ChatAttachment {
  url: string;
  type: "image" | "audio" | "video" | "document" | "file";
  /** Audio only: an MP3 of a WebM/Ogg/WAV note, play this when present. */
  playbackUrl?: string;
  name?: string;
  mimeType?: string;
  size?: number;
  duration?: number;
  width?: number;
  height?: number;
}

export interface ChatParticipant {
  _id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  userAvatar?: string | null;
  isActive?: boolean;
  isOnline: boolean;
}

/** A room as sent by `GET /chat/rooms`, `chat-rooms-update` and `chat-room-joined.room`. */
export interface ChatRoomView {
  _id: string;
  roomId?: string; // deprecated alias of _id
  type: ChatRoomType;
  name: string;
  description?: string; // groups only
  avatarUrl?: string | null; // groups only
  lastReadAt?: string; // when the current user last read this room
  classId?: string;
  courseId?: string;
  createdBy?: string;
  participants: ChatParticipant[];
  lastMessage: null | {
    _id?: string;
    senderId: string;
    senderName: string;
    type: ChatMessageType;
    preview?: string;
    createdAt?: string;
    content?: string; // deprecated, = preview
    timestamp?: string; // older servers
  };
  unreadCount: number;
  updatedAt: string;
}

/** `lastMessage` of `chat-room-activity`. */
export interface ChatRoomActivity {
  roomId: string;
  lastMessage: {
    _id: string;
    senderId: string;
    senderName: string;
    type: ChatMessageType;
    preview: string;
    createdAt: string;
  };
}

/** The socket acknowledgement `emitWithAck` resolves with, for any event. */
/**
 * A room exactly as the socket or REST API sends it — a looser cousin of
 * `ChatRoomView` for payloads that omit fields or spell `lastMessage`
 * differently (`preview` vs `content` vs `text`), before `toRealtimeRoom`
 * normalises it.
 */
export interface RawChatRoom {
  _id?: string;
  roomId?: string;
  type?: ChatRoomType;
  name?: string;
  description?: string;
  avatarUrl?: string | null;
  lastReadAt?: string;
  classId?: string;
  courseId?: string;
  createdBy?: RawPersonRef;
  participants?: ChatParticipant[];
  lastMessage?: {
    senderId?: RawPersonRef;
    senderName?: string;
    type?: ChatMessageType;
    preview?: string;
    content?: string;
    text?: string;
    createdAt?: string;
    timestamp?: string;
  } | null;
  unreadCount?: number;
  updatedAt?: string;
}

/**
 * A Mongoose document as it sometimes arrives over the socket: either already
 * plain, or still wrapped in Mongoose's internal `_doc`. Every raw-payload
 * helper in `lib/chat.ts` unwraps this once before reading fields.
 */
export interface RawDocument {
  _doc?: RawDocument;
  _id?: string;
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  avatar?: string;
  userAvatar?: string | null;
  isOnline?: boolean;
}

/** A person reference as the API sends it: a bare id, or a populated document. */
export type RawPersonRef = string | RawDocument | null | undefined;

/** One message exactly as the socket or REST API sends it, before normalising. */
export interface RawChatMessage {
  _id?: string;
  clientMessageId?: string;
  roomId?: string;
  chatRoomId?: string;
  senderId?: RawPersonRef;
  sender?: { name?: string; avatar?: string } | RawPersonRef;
  senderName?: string;
  attachments?: Array<string | ChatAttachment>;
  type?: string;
  text?: string;
  content?: string;
  duration?: number;
  readBy?: RawPersonRef[];
  createdAt?: string | number | Date;
  timestamp?: string | number | Date;
  status?: string;
  error?: ChatMessage["error"];
}

export interface ChatAck {
  ok: boolean;
  error?: { code: string; message: string };
  roomId?: string;
  messageId?: string;
  clientMessageId?: string;
  /** `fetch-messages`: whether another page is available. */
  hasMore?: boolean;
  /** `fetch-messages`: cursor for the next page. */
  prevCursor?: string;
  /** `mark-read`: when the read receipt was recorded. */
  readAt?: string;
  /** `send-message`: the stored message, in its raw (un-normalised) shape. */
  message?: Record<string, unknown>;
  [key: string]: unknown;
}

export type MessageStatus = "sent" | "pending" | "failed";

/** The one message shape the UI works with (see `normalizeMessage`). */
export interface ChatMessage {
  _id: string;
  roomId: string;
  clientMessageId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  type: ChatMessageType;
  attachments: ChatAttachment[];
  duration?: number;
  readBy: string[];
  createdAt: string;
  status: MessageStatus;
  error?: string;
  /** Local only: upload progress (0–1) per attachment while sending. */
  uploadProgress?: number[];
}

export interface RealtimeChatRoom {
  roomId: string;
  name: string;
  type: ChatRoomType;
  participants: ChatParticipant[];
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
    type: string;
  };
  unreadCount: number;
  updatedAt: string;
  classId?: string;
  courseId?: string;
  createdBy?: string;
  /** Groups only. */
  description: string;
  /** Groups only. */
  avatarUrl: string;
  /** Read position of the current user (the createdAt of the newest message read). */
  lastReadAt?: string;
  displayName: string;
  avatarInfo: {
    type: "image" | "initials";
    value: string;
    bgColor?: string;
  };
  isOnline?: boolean;
}

export type RoomJoinStatus = "idle" | "joining" | "ready" | "error";

export interface RoomState {
  roomId: string;
  messages: ChatMessage[];
  status: RoomJoinStatus;
  error: string | null;
  hasMore: boolean;
  nextCursor?: string;
  isLoadingMore: boolean;
  loadMoreError: string | null;
  roomName: string;
  roomType?: ChatRoomType;
  participants: ChatParticipant[];
  description: string;
  avatarUrl: string;
  createdBy?: string;
}

/** `messages-read` (another member) and `room-read` (my other device). */
export interface ChatReadEvent {
  roomId: string;
  userId?: string;
  upToMessageId?: string;
  readAt: string;
}

/** `room-updated`. */
export interface ChatRoomUpdatedEvent {
  roomId: string;
  name?: string;
  description?: string | null;
  avatarUrl?: string | null;
  updatedBy?: string;
}

/** `participants-changed`. */
export interface ChatParticipantsChangedEvent {
  roomId: string;
  added?: string[];
  removed?: string[];
  by?: string;
  participants?: ChatParticipant[];
}

/** Tick state of one of my own messages. */
export type OwnMessageTick = "pending" | "failed" | "sent" | "read";
