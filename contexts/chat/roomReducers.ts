// Pure transitions of one room's message store. No React, no refs, no socket:
// each takes the current state and returns what changes.
import { mergeMessages } from "@/lib/chat";
import { JOIN_FAILED_MESSAGE } from "./constants";
import type {
  ChatMessage,
  ChatMessagesPage,
  ChatParticipant,
  ChatRoomJoined,
  ChatRoomUpdatedEvent,
  RoomState,
} from "@/types/chat";

/** The store of a room nothing has been loaded for yet. */
export const emptyRoomState = (roomId: string): RoomState => ({
  roomId,
  messages: [],
  status: "idle",
  error: null,
  hasMore: false,
  nextCursor: undefined,
  isLoadingMore: false,
  loadMoreError: null,
  roomName: "",
  roomType: undefined,
  participants: [],
  description: "",
  avatarUrl: "",
});

/** The chat is actually being looked at: tab visible and window focused. */
export const isVisible = () =>
  typeof document === "undefined" ||
  (document.visibilityState === "visible" && document.hasFocus());

/** The local id of a message that has not been stored yet. */
export const localIdOf = (clientMessageId: string) => `local:${clientMessageId}`;

/**
 * `chat-room-joined`: the room is ready with the page merged in and its
 * details refreshed. Paging state comes from the server only on the first
 * load; a rejoin keeps what scrolling back already found.
 *
 * @param room - The room's state before the join.
 * @param data - The join payload.
 * @param incoming - The payload's messages, normalised.
 * @param isFirstLoad - True when no stored message was known before.
 * @returns The fields to change.
 */
export function joinedPatch(
  room: RoomState,
  data: ChatRoomJoined,
  incoming: ChatMessage[],
  isFirstLoad: boolean
): Partial<RoomState> {
  return {
    status: "ready",
    error: null,
    messages: mergeMessages(room.messages, incoming),
    hasMore: isFirstLoad ? Boolean(data.hasMore) : room.hasMore,
    nextCursor: isFirstLoad ? data.nextCursor : room.nextCursor ?? data.nextCursor,
    roomName: data.roomName || data.room?.name || room.roomName,
    roomType: data.roomType || data.room?.type || room.roomType,
    participants:
      (data.room?.participants?.length ? data.room.participants : data.participants) ||
      room.participants,
    description: data.room ? String(data.room.description || "") : room.description,
    avatarUrl: data.room ? String(data.room.avatarUrl || "") : room.avatarUrl,
    createdBy: data.room?.createdBy ? String(data.room.createdBy) : room.createdBy,
  };
}

/**
 * A page of messages: merged in place. An older page (or a plain update) also
 * moves the paging state; a forward page (`after`) leaves it alone.
 *
 * @param room - The room's state before the page.
 * @param page - The page as received.
 * @param incoming - The page's messages, normalised.
 * @returns The fields to change.
 */
export function pagePatch(
  room: RoomState,
  page: ChatMessagesPage,
  incoming: ChatMessage[]
): Partial<RoomState> {
  return {
    messages: mergeMessages(room.messages, incoming),
    ...(page.direction === "after"
      ? {}
      : {
          hasMore: Boolean(page.hasMore),
          nextCursor: page.nextCursor ?? (page.hasMore ? room.nextCursor : undefined),
          isLoadingMore: false,
          loadMoreError: null,
        }),
  };
}

/** Leaving a room keeps a loaded room readable and stops any older-page request. */
export const leavePatch = (room: RoomState): Partial<RoomState> => ({
  status: room.status === "ready" ? "ready" : "idle",
  isLoadingMore: false,
});

/** A failed join: the shared message, or "not available" for an unknown room. */
export const joinFailurePatch = (code?: string): Partial<RoomState> => ({
  status: "error",
  error: code === "NOT_FOUND" ? "This chat isn't available to you." : JOIN_FAILED_MESSAGE,
});

/** `room-updated`: name, description and picture, keeping what the event omits. */
export const roomUpdatePatch = (
  room: RoomState,
  data: ChatRoomUpdatedEvent
): Partial<RoomState> => ({
  roomName: data.name || room.roomName,
  description: data.description === undefined ? room.description : String(data.description || ""),
  avatarUrl: data.avatarUrl === undefined ? room.avatarUrl : String(data.avatarUrl || ""),
});

/** The room's members changed. */
export const participantsPatch = (participants: ChatParticipant[]): Partial<RoomState> => ({
  participants,
});

/** A pending bubble turned failed, with the reason to show. */
export const failMessage = (
  messages: ChatMessage[],
  localId: string,
  message?: string
): ChatMessage[] =>
  messages.map((m) =>
    m._id === localId ? { ...m, status: "failed", error: message || "Not sent" } : m
  );

/** A failed bubble put back to pending for a retry. */
export const retryingMessage = (messages: ChatMessage[], localId: string): ChatMessage[] =>
  messages.map((m) => (m._id === localId ? { ...m, status: "pending", error: undefined } : m));

/** One file's upload progress (0–1) on a pending bubble. */
export const withUploadProgress = (
  messages: ChatMessage[],
  localId: string,
  index: number,
  fraction: number
): ChatMessage[] =>
  messages.map((m) => {
    if (m._id !== localId) return m;
    const progress = [...(m.uploadProgress ?? [])];
    progress[index] = fraction;
    return { ...m, uploadProgress: progress };
  });

/** The list without one local bubble. */
export const withoutMessage = (messages: ChatMessage[], localId: string): ChatMessage[] =>
  messages.filter((m) => m._id !== localId);
