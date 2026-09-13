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

export type ChatRoomFilter = "all" | "classes" | "groups";

const MESSAGE_TYPES: ChatMessageType[] = ["text", "voice", "image", "file"];

const idOf = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const data = value._doc || value;
    return String(data._id || data.userId || data.id || "");
  }
  return String(value);
};

const fullName = (person: any) =>
  `${person?.firstName || ""} ${person?.lastName || ""}`.trim();

/** A new id for an outgoing message, reused on retry so the server never duplicates it. */
export function newClientMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Reads the canonical message fields (`text`, `createdAt`, `senderId` string or
 * `sender._id`, attachment objects, `type`) and falls back to the old aliases
 * (`content`, `timestamp`, populated `senderId`, `chatRoomId`, `senderName`).
 */
export function normalizeMessage(raw: any): ChatMessage {
  const populatedSender =
    raw?.senderId && typeof raw.senderId === "object" ? raw.senderId._doc || raw.senderId : null;
  const senderId =
    (typeof raw?.senderId === "string" ? raw.senderId : "") ||
    idOf(raw?.sender) ||
    idOf(populatedSender);

  const attachments: ChatAttachment[] = Array.isArray(raw?.attachments)
    ? raw.attachments
        .map((item: any) =>
          typeof item === "string" ? { url: item, type: "file" as const } : item
        )
        .filter((item: any) => item && item.url)
    : [];

  const type: ChatMessageType = MESSAGE_TYPES.includes(raw?.type) ? raw.type : "text";

  return {
    _id: String(raw?._id || (raw?.clientMessageId ? `local:${raw.clientMessageId}` : "")),
    roomId: String(raw?.roomId || raw?.chatRoomId || ""),
    clientMessageId: raw?.clientMessageId || undefined,
    senderId,
    senderName:
      raw?.sender?.name || raw?.senderName || fullName(populatedSender) || populatedSender?.name || "",
    senderAvatar:
      raw?.sender?.avatar || populatedSender?.userAvatar || populatedSender?.avatar || "",
    text: String(raw?.text ?? raw?.content ?? ""),
    type,
    attachments,
    duration: typeof raw?.duration === "number" ? raw.duration : undefined,
    readBy: Array.isArray(raw?.readBy) ? raw.readBy.map(idOf).filter(Boolean) : [],
    createdAt: new Date(raw?.createdAt || raw?.timestamp || Date.now()).toISOString(),
    status: raw?.status === "pending" || raw?.status === "failed" ? raw.status : "sent",
    error: raw?.error,
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

export const isSameUser = (id: string | undefined, userIds: string[]) =>
  Boolean(id) && userIds.includes(String(id));

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

export function participantId(participant: any): string {
  const data = participant?._doc || participant || {};
  return String(data._id || data.userId || data.id || "");
}

export function participantName(participant: any, fallback = "Unknown User"): string {
  const data = participant?._doc || participant || {};
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

export function isGroupRoomType(type?: string) {
  return Boolean(type) && type !== "one_to_one";
}

/** Turns a `RoomView` into the list item the sidebar renders. */
export function toRealtimeRoom(room: ChatRoomView | any, userIds: string[]): RealtimeChatRoom {
  const roomId = String(room?._id || room?.roomId || "");
  const participants: ChatParticipant[] = Array.isArray(room?.participants) ? room.participants : [];
  const type: ChatRoomType = room?.type || "custom_group";

  let displayName = room?.name || "Chat Room";
  let avatarInfo: RealtimeChatRoom["avatarInfo"] = {
    type: "initials",
    value: initialsOf(displayName) || "CR",
    bgColor: roomColorFromString(displayName),
  };
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
    isOnline = participants.some(
      (p) => p.role === "teacher" && p.isOnline && !userIds.includes(participantId(p))
    );
  }

  const last = room?.lastMessage;
  const lastMessage = last
    ? {
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
    displayName,
    avatarInfo,
    isOnline,
  };
}

const roomTime = (room: RealtimeChatRoom) =>
  new Date(room.lastMessage?.timestamp || room.updatedAt || 0).getTime() || 0;

export const sortRooms = (rooms: RealtimeChatRoom[]) =>
  [...rooms].sort((a, b) => roomTime(b) - roomTime(a));

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
