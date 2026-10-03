/**
 * Pure helpers for the Messages screen: the order of the thread list, search,
 * the "teacher and N others" line and the members list. Students message in
 * groups only (B10); an old direct room stays readable but read-only.
 */
import { participantId, participantName } from "@/lib/chat";
import type { ChatParticipant, ChatRoomType, RealtimeChatRoom } from "@/types/chat";

/** The marker on a direct room in the thread list. */
export const DIRECT_MARKER = "Direct · read only";

/** List position of each room type: class group, subject groups, other groups, then old direct rooms. */
const RANK: Record<ChatRoomType, number> = {
  class_group: 0,
  course_group: 1,
  parent_group: 2,
  admin_parent_group: 2,
  custom_group: 2,
  one_to_one: 3,
};

/**
 * Whether a room is read-only for a student (a direct message, B10).
 *
 * @param type - The room's type, when known.
 * @returns True for a direct room.
 */
export function isReadOnlyRoom(type: ChatRoomType | undefined): boolean {
  return type === "one_to_one";
}

/**
 * The thread list's order: the class group first, then subject groups, other
 * groups and read-only direct rooms. Within a kind the store's order (newest
 * activity first) is kept.
 *
 * @param rooms - The rooms as the chat store holds them.
 * @returns A new, ordered array.
 */
export function orderThreads(rooms: RealtimeChatRoom[]): RealtimeChatRoom[] {
  return rooms
    .map((room, index) => ({ room, index, rank: RANK[room.type] ?? 2 }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.room);
}

/**
 * The threads whose name contains the search text (any case).
 *
 * @param rooms - The ordered rooms.
 * @param query - What the student typed.
 * @returns The matching rooms, in the same order.
 */
export function filterThreads(rooms: RealtimeChatRoom[], query: string): RealtimeChatRoom[] {
  const term = query.trim().toLowerCase();
  if (!term) return rooms;
  return rooms.filter((room) => (room.displayName || room.name).toLowerCase().includes(term));
}

/**
 * The last message's line under a thread's name.
 *
 * @param room - The room.
 * @returns The preview text.
 */
export function previewOf(room: RealtimeChatRoom): string {
  const last = room.lastMessage;
  if (!last) return "No messages yet";
  if (last.content) return last.content;
  if (last.type === "voice") return "Voice note";
  if (last.type === "image") return "Photo";
  if (last.type === "file") return "File";
  return "New message";
}

/**
 * The group's teacher: the first participant whose role is teacher.
 *
 * @param participants - The room's members.
 * @returns The teacher, if any.
 */
export function teacherOf(participants: ChatParticipant[]): ChatParticipant | undefined {
  return participants.find((p) => p.role === "teacher");
}

/**
 * The line under a thread's name: "Mr Seyi Tinubu and 26 others", "12
 * members", or the read-only marker for a direct room.
 *
 * @param participants - The room's members.
 * @param type - The room's type.
 * @returns The label.
 */
export function membersLabel(participants: ChatParticipant[], type: ChatRoomType | undefined): string {
  if (isReadOnlyRoom(type)) return "Direct message · read only";
  const teacher = teacherOf(participants);
  if (!teacher) {
    const count = participants.length;
    return `${count} member${count === 1 ? "" : "s"}`;
  }
  const others = participants.length - 1;
  const name = participantName(teacher, "Your teacher");
  return others > 0 ? `${name} and ${others} other${others === 1 ? "" : "s"}` : name;
}

/** One row of the info dialog's Members tab. */
export interface MemberRow {
  /** A stable key. */
  key: string;
  /** The name, with "(you)" for the student. */
  name: string;
  /** "Teacher" or "Member". */
  role: "Teacher" | "Member";
  /** The photo, when there is one. */
  avatar: string;
}

/**
 * The Members tab: teachers first, then everyone else in the room's order,
 * the signed-in student marked "(you)".
 *
 * @param participants - The room's members.
 * @param currentUserIds - Every id the student goes by.
 * @returns The rows.
 */
export function memberRows(participants: ChatParticipant[], currentUserIds: string[]): MemberRow[] {
  const mine = new Set(currentUserIds.map(String));
  const rows = participants.map((p, index) => {
    const ids = [participantId(p), p.userId].filter(Boolean).map(String);
    const isMe = ids.some((id) => mine.has(id));
    const isTeacher = p.role === "teacher";
    const name = participantName(p, "Member");
    const row: MemberRow = {
      key: ids[0] || `member-${index}`,
      name: isMe ? `${name} (you)` : name,
      role: isTeacher ? "Teacher" : "Member",
      avatar: p.userAvatar || "",
    };
    return { isTeacher, index, row };
  });
  return rows
    .sort((a, b) => Number(b.isTeacher) - Number(a.isTeacher) || a.index - b.index)
    .map((entry) => entry.row);
}

/**
 * The picture to show for a room: a group's own picture, or the other
 * person's photo for a direct room.
 *
 * @param room - The room from the list, when it is there.
 * @param fallback - The joined room's picture.
 * @returns A URL, or an empty string for initials.
 */
export function roomImage(room: RealtimeChatRoom | undefined, fallback = ""): string {
  if (!room) return fallback;
  if (room.type === "one_to_one") return room.avatarInfo?.type === "image" ? room.avatarInfo.value : "";
  return room.avatarUrl || fallback;
}
