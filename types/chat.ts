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
  classId?: string;
  courseId?: string;
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

export interface ChatAck {
  ok: boolean;
  error?: { code: string; message: string };
  roomId?: string;
  messageId?: string;
  clientMessageId?: string;
  [key: string]: any;
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
}
