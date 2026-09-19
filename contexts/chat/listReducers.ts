// Pure transitions of the chat list (the sidebar's rooms). No React, no refs.
import {
  applyParticipants,
  applyRoomDetails,
  laterTime,
  sortRooms,
  toRealtimeRoom,
} from "@/lib/chat";
import type {
  ChatParticipant,
  ChatReadEvent,
  ChatRoomActivity,
  ChatRoomUpdatedEvent,
  RawChatRoom,
  RealtimeChatRoom,
} from "@/types/chat";

/** Every id the signed-in user is known by (`userId`, `id`, `_id`), without duplicates. */
export const userIdsOf = (
  user: { userId?: string; id?: string; _id?: unknown } | null | undefined
): string[] =>
  Array.from(
    new Set(
      [user?.userId, user?.id, typeof user?._id === "string" ? user._id : undefined]
        .filter(Boolean)
        .map(String)
    )
  );

/** The room's unread badge cleared; the same array when it was already zero. */
export const clearUnread = (rooms: RealtimeChatRoom[], roomId: string): RealtimeChatRoom[] =>
  rooms.some((r) => r.roomId === roomId && r.unreadCount > 0)
    ? rooms.map((r) => (r.roomId === roomId ? { ...r, unreadCount: 0 } : r))
    : rooms;

/** My read position in a room moved forward (it never moves back). */
export const withReadAt = (
  rooms: RealtimeChatRoom[],
  roomId: string,
  readAt: string
): RealtimeChatRoom[] =>
  rooms.map((r) =>
    r.roomId === roomId ? { ...r, lastReadAt: laterTime(r.lastReadAt, readAt) } : r
  );

/** `chat-room-activity`: a new last message, the room re-sorted, and the badge bumped for others' messages. */
export function withActivity(
  rooms: RealtimeChatRoom[],
  { roomId, lastMessage }: ChatRoomActivity,
  mine: boolean,
  isOpen: boolean
): RealtimeChatRoom[] {
  return sortRooms(
    rooms.map((room) =>
      room.roomId === roomId
        ? {
            ...room,
            lastMessage: {
              _id: lastMessage._id,
              content: lastMessage.preview || "",
              senderId: lastMessage.senderId,
              senderName: lastMessage.senderName,
              timestamp: lastMessage.createdAt,
              type: lastMessage.type,
            },
            updatedAt: lastMessage.createdAt || room.updatedAt,
            unreadCount: mine || isOpen ? room.unreadCount : room.unreadCount + 1,
          }
        : room
    )
  );
}

/**
 * `chat-rooms-update`: the whole list, sorted. The open chat (when on screen)
 * shows no badge, since it is being marked read right now.
 */
export const buildRoomList = (
  raw: RawChatRoom[],
  userIds: string[],
  openRoomId: string | null
): RealtimeChatRoom[] =>
  sortRooms(
    raw.map((room) => {
      const item = toRealtimeRoom(room, userIds);
      return item.roomId === openRoomId ? { ...item, unreadCount: 0 } : item;
    })
  );

/** `room-read` (I read it on another device): read position moves, the badge clears if covered. */
export const withRoomRead = (
  rooms: RealtimeChatRoom[],
  roomId: string,
  data: ChatReadEvent
): RealtimeChatRoom[] => {
  const readTime = new Date(data.readAt).getTime();
  return rooms.map((room) => {
    if (room.roomId !== roomId) return room;
    const lastTime = new Date(room.lastMessage?.timestamp || 0).getTime();
    // A message newer than the read position keeps the badge.
    const covered = Number.isNaN(readTime) || Number.isNaN(lastTime) || lastTime <= readTime;
    return {
      ...room,
      lastReadAt: laterTime(room.lastReadAt, data.readAt),
      unreadCount: covered ? 0 : room.unreadCount,
    };
  });
};

/** A joined room the list did not have yet, added and sorted in. */
export const withJoinedRoom = (
  rooms: RealtimeChatRoom[],
  joined: RawChatRoom,
  userIds: string[]
): RealtimeChatRoom[] => sortRooms([...rooms, toRealtimeRoom(joined, userIds)]);

/** `room-updated` applied to one room of the list. */
export const withRoomDetails = (
  rooms: RealtimeChatRoom[],
  roomId: string,
  data: ChatRoomUpdatedEvent
): RealtimeChatRoom[] =>
  rooms.map((room) => (room.roomId === roomId ? applyRoomDetails(room, data) : room));

/** `participants-changed` applied to one room of the list. */
export const withParticipants = (
  rooms: RealtimeChatRoom[],
  roomId: string,
  participants: ChatParticipant[],
  userIds: string[]
): RealtimeChatRoom[] =>
  rooms.map((room) =>
    room.roomId === roomId ? applyParticipants(room, participants, userIds) : room
  );

/** Unread messages summed across the list. */
export const totalUnreadOf = (rooms: RealtimeChatRoom[]): number =>
  rooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0);
