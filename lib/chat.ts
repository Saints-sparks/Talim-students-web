// lib/chat.ts
// Pure helpers for the chat store: one message normalizer, merge-by-id,
// room list transforms and filters. No React in here.
import type {
  ChatAttachment,
  ChatMessage,
  ChatMessageType,
  ChatParticipant,
  ChatRoomType,
  ChatRoomView,
  ChatRoomUpdatedEvent,
  OwnMessageTick,
  RawChatMessage,
  RawChatRoom,
  RawPersonRef,
  RealtimeChatRoom,
} from "@/types/chat";

export const GROUP_ROOM_TYPES: ChatRoomType[] = [
  "class_group",
  "course_group",
  "parent_group",
  "admin_parent_group",
  "custom_group",
];
export const CLASS_ROOM_TYPES: ChatRoomType[] = ["class_group", "course_group"];

/**
 *
 */
export type ChatRoomFilter = "all" | "classes" | "groups";

const MESSAGE_TYPES: ChatMessageType[] = ["text", "voice", "image", "file"];

const idOf = (value: RawPersonRef): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  const data = value._doc || value;
  return String(data._id || data.userId || data.id || "");
};

const fullName = (person: { firstName?: string; lastName?: string } | null | undefined) =>
  `${person?.firstName || ""} ${person?.lastName || ""}`.trim();

/** A new id for an outgoing message, reused on retry so the server never duplicates it. */
export function newClientMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** The server's `replyTo` snapshot, or undefined when absent or malformed. */
function normalizeReplyTo(raw: RawChatMessage["replyTo"]): ChatMessage["replyTo"] {
  const messageId = raw?.messageId ? String(raw.messageId) : "";
  if (!raw || !messageId) return undefined;
  return {
    messageId,
    senderId: idOf(raw.senderId) || undefined,
    senderName: raw.senderName || "Unknown",
    preview: raw.preview || "",
    type: raw.type,
  };
}

/**
 * Reads the canonical message fields (`text`, `createdAt`, `senderId` string or
 * `sender._id`, attachment objects, `type`) and falls back to the old aliases
 * (`content`, `timestamp`, populated `senderId`, `chatRoomId`, `senderName`).
 */
export function normalizeMessage(raw: RawChatMessage): ChatMessage {
  const populatedSender =
    raw?.senderId && typeof raw.senderId === "object" ? raw.senderId._doc || raw.senderId : null;
  const senderId =
    (typeof raw?.senderId === "string" ? raw.senderId : "") ||
    idOf(raw?.sender as RawPersonRef) ||
    idOf(populatedSender);

  const attachments: ChatAttachment[] = Array.isArray(raw?.attachments)
    ? raw.attachments
        .map((item) => (typeof item === "string" ? { url: item, type: "file" as const } : item))
        .filter((item): item is ChatAttachment => Boolean(item && item.url))
    : [];

  const type: ChatMessageType =
    raw?.type && (MESSAGE_TYPES as string[]).includes(raw.type) ? (raw.type as ChatMessageType) : "text";

  const senderRef = typeof raw?.sender === "object" ? raw.sender : undefined;

  return {
    _id: String(raw?._id || (raw?.clientMessageId ? `local:${raw.clientMessageId}` : "")),
    roomId: String(raw?.roomId || raw?.chatRoomId || ""),
    clientMessageId: raw?.clientMessageId || undefined,
    senderId,
    senderName:
      senderRef?.name || raw?.senderName || fullName(populatedSender) || populatedSender?.name || "",
    senderAvatar: senderRef?.avatar || populatedSender?.userAvatar || populatedSender?.avatar || "",
    text: String(raw?.text ?? raw?.content ?? ""),
    type,
    attachments,
    duration: typeof raw?.duration === "number" ? raw.duration : undefined,
    readBy: Array.isArray(raw?.readBy) ? raw.readBy.map(idOf).filter(Boolean) : [],
    createdAt: new Date(raw?.createdAt || raw?.timestamp || Date.now()).toISOString(),
    status: raw?.status === "pending" || raw?.status === "failed" ? raw.status : "sent",
    error: raw?.error,
    replyTo: normalizeReplyTo(raw?.replyTo),
    isDeleted: raw?.isDeleted === true ? true : undefined,
  };
}

const byTime = (a: ChatMessage, b: ChatMessage) => {
  const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  if (diff !== 0) return diff;
  return a._id < b._id ? -1 : a._id > b._id ? 1 : 0;
};

/**
 * Merges incoming messages into a room's list by `_id`, replacing a pending
 * bubble whose `clientMessageId` matches a server copy. Result is sorted by
 * `createdAt` (oldest first). Never drops messages already in the list.
 */
export function mergeMessages(existing: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  if (!incoming.length) return existing;

  const byId = new Map<string, ChatMessage>();
  existing.forEach((message) => byId.set(message._id, message));

  incoming.forEach((message) => {
    if (!message._id) return;
    if (message.clientMessageId) {
      const localId = `local:${message.clientMessageId}`;
      if (localId !== message._id) byId.delete(localId);
    }
    const previous = byId.get(message._id);
    // A server copy always wins over a local one; keep read state we already know.
    byId.set(
      message._id,
      previous
        ? { ...message, readBy: Array.from(new Set([...previous.readBy, ...message.readBy])) }
        : message
    );
  });

  return Array.from(byId.values()).sort(byTime);
}

/** The newest message the server has confirmed, used as the `after` cursor on reconnect. */
export function newestServerMessageId(messages: ChatMessage[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].status === "sent" && !messages[i]._id.startsWith("local:")) {
      return messages[i]._id;
    }
  }
  return undefined;
}

/**
 *
 */
export const isSameUser = (id: string | undefined, userIds: string[]) =>
  Boolean(id) && userIds.includes(String(id));

const timeOf = (iso?: string) => {
  const time = iso ? new Date(iso).getTime() : NaN;
  return Number.isNaN(time) ? null : time;
};

/** True when `a` comes after `b` in history order (createdAt, then _id). */
export function isNewerMessage(
  a: Pick<ChatMessage, "_id" | "createdAt">,
  b: Pick<ChatMessage, "_id" | "createdAt">
): boolean {
  const diff = (timeOf(a.createdAt) ?? 0) - (timeOf(b.createdAt) ?? 0);
  if (diff !== 0) return diff > 0;
  return a._id > b._id;
}

/** The newest stored message from someone else: what `mark-room-read` should point at. */
export function newestReadableMessage(
  messages: ChatMessage[],
  userIds: string[]
): ChatMessage | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (
      message.status === "sent" &&
      message._id &&
      !message._id.startsWith("local:") &&
      !isSameUser(message.senderId, userIds)
    ) {
      return message;
    }
  }
  return undefined;
}

/**
 * Whether a room still needs `mark-room-read` for `candidate`: not when I'm
 * already in its `readBy`, when my read position already covers it, or when a
 * read for it (or something newer) was already sent.
 */
export function needsReadMark(
  candidate: ChatMessage | undefined,
  userIds: string[],
  lastReadAt: string | undefined,
  lastSent: Pick<ChatMessage, "_id" | "createdAt"> | undefined
): candidate is ChatMessage {
  if (!candidate) return false;
  if (candidate.readBy.some((reader) => userIds.includes(reader))) return false;
  const readTime = timeOf(lastReadAt);
  const createdTime = timeOf(candidate.createdAt);
  if (readTime !== null && createdTime !== null && createdTime <= readTime) return false;
  if (lastSent && (lastSent._id === candidate._id || !isNewerMessage(candidate, lastSent))) {
    return false;
  }
  return true;
}

/**
 * `messages-read`: adds `userId` to `readBy` on messages from other senders
 * created at or before `readAt`. Returns the same array when nothing changed.
 */
export function applyMessagesRead(
  messages: ChatMessage[],
  userId: string,
  readAt: string
): ChatMessage[] {
  const readTime = timeOf(readAt);
  if (!userId || readTime === null) return messages;
  let changed = false;
  const next = messages.map((message) => {
    if (
      message.status !== "sent" ||
      message.senderId === userId ||
      message.readBy.includes(userId)
    ) {
      return message;
    }
    const createdTime = timeOf(message.createdAt);
    if (createdTime === null || createdTime > readTime) return message;
    changed = true;
    return { ...message, readBy: [...message.readBy, userId] };
  });
  return changed ? next : messages;
}

/** Later of two ISO timestamps (read positions only move forward). */
export function laterTime(a?: string, b?: string): string | undefined {
  const ta = timeOf(a);
  const tb = timeOf(b);
  if (ta === null) return tb === null ? undefined : b;
  if (tb === null) return a;
  return tb > ta ? b : a;
}

/** Readers of one of my messages, excluding me (and the sender). */
export function readersOf(message: ChatMessage, userIds: string[]): string[] {
  return Array.from(
    new Set(
      message.readBy.filter(
        (reader) => reader && !userIds.includes(reader) && reader !== message.senderId
      )
    )
  );
}

/**
 * Tick for one of my messages. Direct messages count as read when the other
 * person is in `readBy`; groups show "Read by N" instead, so they stop at "sent".
 */
export function ownMessageTick(
  message: ChatMessage,
  roomType: ChatRoomType | undefined,
  otherIds: string[]
): OwnMessageTick {
  if (message.status === "pending") return "pending";
  if (message.status === "failed") return "failed";
  if (roomType === "one_to_one" && message.readBy.some((reader) => otherIds.includes(reader))) {
    return "read";
  }
  return "sent";
}

/** hsl colour used for room initials (kept identical to the previous list styling). */
export function roomColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 *
 */
export function participantId(participant: RawPersonRef): string {
  if (typeof participant === "string") return participant;
  const data = participant?._doc || participant;
  return String(data?._id || data?.userId || data?.id || "");
}

/**
 * The display name for a chat participant, whether raw or already-clean.
 *
 * @param participant - A bare id, a raw document, or nothing.
 * @param fallback - Shown when no name can be built.
 * @returns The name to show.
 */
export function participantName(participant: RawPersonRef, fallback = "Unknown User"): string {
  const data = (typeof participant === "object" && participant?._doc) || participant || {};
  if (typeof data !== "object") return fallback;
  return fullName(data) || data.name || data.email || fallback;
}

/** The other person in a direct message: the participant whose id isn't mine. */
export function otherParticipant(
  participants: ChatParticipant[] = [],
  userIds: string[]
): ChatParticipant | undefined {
  return participants.find((p) => {
    const ids = [p._id, p.userId].filter(Boolean).map(String);
    return ids.length > 0 && !ids.some((id) => userIds.includes(id));
  });
}

/**
 *
 */
export function isGroupRoomType(type?: string) {
  return Boolean(type) && type !== "one_to_one";
}

function groupAvatarInfo(name: string, avatarUrl: string): RealtimeChatRoom["avatarInfo"] {
  return avatarUrl
    ? { type: "image", value: avatarUrl }
    : {
        type: "initials",
        value: initialsOf(name) || "CR",
        bgColor: roomColorFromString(name),
      };
}

const groupHasTeacherOnline = (participants: ChatParticipant[], userIds: string[]) =>
  participants.some(
    (p) => p.role === "teacher" && p.isOnline && !userIds.includes(participantId(p))
  );

/** `room-updated`: new name, description and picture for a group in the list. */
export function applyRoomDetails(
  room: RealtimeChatRoom,
  update: ChatRoomUpdatedEvent
): RealtimeChatRoom {
  if (room.type === "one_to_one") return room;
  const name = typeof update.name === "string" && update.name ? update.name : room.name;
  const description =
    update.description === undefined ? room.description : String(update.description || "");
  const avatarUrl =
    update.avatarUrl === undefined ? room.avatarUrl : String(update.avatarUrl || "");
  const displayName = name || room.displayName;
  return {
    ...room,
    name,
    description,
    avatarUrl,
    displayName,
    avatarInfo: groupAvatarInfo(displayName, avatarUrl),
  };
}

/** `participants-changed`: the room's members after the change. */
export function applyParticipants(
  room: RealtimeChatRoom,
  participants: ChatParticipant[],
  userIds: string[]
): RealtimeChatRoom {
  if (room.type === "one_to_one") return room;
  return { ...room, participants, isOnline: groupHasTeacherOnline(participants, userIds) };
}

export const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teacher: "Teacher",
  parent: "Parent",
  school_admin: "School admin",
  school_sub_admin: "School admin",
  admin: "Admin",
};

/**
 *
 */
export const roleLabel = (role?: string) =>
  (role && ROLE_LABELS[role]) ||
  (role ? role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ") : "Member");

export const ROOM_TYPE_LABELS: Record<ChatRoomType, string> = {
  one_to_one: "Direct message",
  class_group: "Class group",
  course_group: "Subject group",
  parent_group: "Parent group",
  admin_parent_group: "School and parents",
  custom_group: "Group",
};

/** Groups a member may leave on their own. */
export const LEAVABLE_ROOM_TYPES: ChatRoomType[] = ["custom_group", "parent_group"];

/** Turns a `RoomView` into the list item the sidebar renders. */
export function toRealtimeRoom(room: ChatRoomView | RawChatRoom, userIds: string[]): RealtimeChatRoom {
  const roomId = String(room?._id || room?.roomId || "");
  const participants: ChatParticipant[] = Array.isArray(room?.participants) ? room.participants : [];
  const type: ChatRoomType = room?.type || "custom_group";

  const description = type === "one_to_one" ? "" : String(room?.description || "");
  const avatarUrl = type === "one_to_one" ? "" : String(room?.avatarUrl || "");

  let displayName = room?.name || "Chat Room";
  let avatarInfo = groupAvatarInfo(displayName, avatarUrl);
  let isOnline = false;

  if (type === "one_to_one") {
    const other = otherParticipant(participants, userIds);
    if (other) {
      displayName = participantName(other);
      isOnline = Boolean(other.isOnline);
      avatarInfo = other.userAvatar
        ? { type: "image", value: other.userAvatar }
        : {
            type: "initials",
            value: initialsOf(displayName) || "U",
            bgColor: roomColorFromString(participantId(other) || displayName),
          };
    }
  } else {
    isOnline = groupHasTeacherOnline(participants, userIds);
  }

  const last = room?.lastMessage as
    | (ChatRoomView["lastMessage"] & { text?: string })
    | RawChatRoom["lastMessage"]
    | undefined
    | null;
  const lastMessage = last
    ? {
        _id: (last as { _id?: string })._id ? String((last as { _id?: string })._id) : undefined,
        content: String(last.preview ?? last.content ?? last.text ?? ""),
        senderId: idOf(last.senderId),
        senderName: last.senderName || "",
        timestamp: String(last.createdAt || last.timestamp || room?.updatedAt || ""),
        type: last.type || "text",
      }
    : undefined;

  return {
    roomId,
    name: room?.name || "",
    type,
    participants,
    lastMessage,
    unreadCount: Number(room?.unreadCount) || 0,
    updatedAt: String(room?.updatedAt || lastMessage?.timestamp || ""),
    classId: room?.classId,
    courseId: room?.courseId,
    createdBy: room?.createdBy ? idOf(room.createdBy) : undefined,
    description,
    avatarUrl,
    lastReadAt: room?.lastReadAt ? String(room.lastReadAt) : undefined,
    displayName,
    avatarInfo,
    isOnline,
  };
}

const roomTime = (room: RealtimeChatRoom) =>
  new Date(room.lastMessage?.timestamp || room.updatedAt || 0).getTime() || 0;

/**
 *
 */
export const sortRooms = (rooms: RealtimeChatRoom[]) =>
  [...rooms].sort((a, b) => roomTime(b) - roomTime(a));

/**
 *
 */
export function filterRooms(rooms: RealtimeChatRoom[], filter: ChatRoomFilter, searchTerm = "") {
  let result = rooms;
  if (filter === "classes") {
    result = result.filter((room) => CLASS_ROOM_TYPES.includes(room.type));
  } else if (filter === "groups") {
    result = result.filter((room) => GROUP_ROOM_TYPES.includes(room.type));
  }

  const term = searchTerm.trim().toLowerCase();
  if (!term) return result;
  return result.filter(
    (room) =>
      room.displayName.toLowerCase().includes(term) ||
      room.participants.some((p) => fullName(p).toLowerCase().includes(term))
  );
}

/**
 * Marks a message deleted the way the server stores it: blank text and
 * attachments. Returns the same array when it isn't loaded or is already deleted.
 */
export function applyMessageDeleted(messages: ChatMessage[], messageId: string): ChatMessage[] {
  const at = messages.findIndex((m) => m._id === messageId);
  if (at === -1 || messages[at].isDeleted) return messages;
  const next = messages.slice();
  next[at] = { ...messages[at], text: "", attachments: [], isDeleted: true, uploadProgress: undefined };
  return next;
}

/** Preview shown for a room whose last message was deleted. */
export const DELETED_PREVIEW = "This message was deleted";

/** A message was deleted: when it is its room's last, the list previews it as deleted. */
export function applyMessageDeletedToRooms(
  rooms: RealtimeChatRoom[],
  roomId: string,
  messageId: string
): RealtimeChatRoom[] {
  const at = rooms.findIndex((r) => r.roomId === roomId);
  const last = at === -1 ? undefined : rooms[at].lastMessage;
  if (!last || last._id !== messageId || last.content === DELETED_PREVIEW) return rooms;
  const next = rooms.slice();
  next[at] = { ...rooms[at], lastMessage: { ...last, content: DELETED_PREVIEW } };
  return next;
}
