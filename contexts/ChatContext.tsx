"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { toast } from "@/components/CustomToast";
import { authFetch } from "@/lib/authFetch";
import { API_BASE_URL } from "@/lib/constants";
import { chatService } from "@/services/chat.service";
import type { ConnectionStatus } from "@/hooks/useWebSocket";
import {
  MAX_FILES_PER_MESSAGE,
  TOO_MANY_FILES_MESSAGE,
  fileKind,
  messageTypeFor,
  useAttachmentUpload,
  validateFile,
  type AttachmentKind,
  type ChatUploadFn,
  type SendableAttachment,
  type UploadItem,
} from "@/components/chat-kit";
import type {
  ChatAck,
  ChatAttachment,
  ChatMessage,
  ChatParticipantsChangedEvent,
  ChatReadEvent,
  ChatRoomActivity,
  ChatRoomUpdatedEvent,
  RealtimeChatRoom,
  RoomState,
} from "@/types/chat";
import {
  applyMessagesRead,
  applyParticipants,
  applyRoomDetails,
  isSameUser,
  laterTime,
  mergeMessages,
  needsReadMark,
  newClientMessageId,
  newestReadableMessage,
  newestServerMessageId,
  normalizeMessage,
  participantId,
  sortRooms,
  toRealtimeRoom,
} from "@/lib/chat";

const JOIN_TIMEOUT = 10000;
const SEND_TIMEOUT = 10000;
const PAGE_SIZE = 20;
const BACKFILL_PAGE_SIZE = 100;
const BACKFILL_MAX_PAGES = 10;

export const JOIN_FAILED_MESSAGE = "Couldn't load this chat";

/** Files or a voice note sent with a message; the text becomes their caption. */
export interface OutgoingMedia {
  files?: File[];
  voice?: { file: File; duration: number };
}

/** A media message waiting to upload and send. */
interface OutboxEntry {
  roomId: string;
  type: ChatMessage["type"];
  /** Voice note length, seconds. */
  duration?: number;
  /** Each file keeps its uploaded attachment, so a retry only uploads what failed. */
  items: UploadItem[];
  /** Object URLs of the pending bubble's previews, revoked when sent or deleted. */
  previewUrls: string[];
}

/** The app's upload helper in the shape the chat kit expects. */
const uploadChatFile: ChatUploadFn = (file, onProgress) =>
  chatService.uploadChatAttachment(file, onProgress);

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

  // Drafts survive switching rooms
  getDraft: (roomId: string) => string;
  setDraft: (roomId: string, text: string) => void;

  // Membership
  /** Leaves a group (removes me). Resolves with the server's message on failure. */
  leaveGroup: (roomId: string) => Promise<{ ok: boolean; message?: string }>;
  /** Called when a room is dropped because I left or was removed (e.g. to navigate away). */
  onRoomRemoved: (listener: RoomRemovedListener) => () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const emptyRoomState = (roomId: string): RoomState => ({
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
const isVisible = () =>
  typeof document === "undefined" ||
  (document.visibilityState === "visible" && document.hasFocus());

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const { socket, isConnected, connectionStatus, emitWithAck } = useWebSocketContext();

  const currentUserIds = useMemo(
    () =>
      Array.from(
        new Set(
          [user?.userId, user?.id, (user as any)?._id].filter(Boolean).map(String)
        )
      ),
    [user]
  );
  const primaryUserId = currentUserIds[0] || null;

  const [chatRooms, setChatRoomsState] = useState<RealtimeChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUnread, setTotalUnread] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomStates, setRoomStatesState] = useState<Record<string, RoomState>>({});

  // Refs are the source of truth for event handlers (no stale closures).
  const socketRef = useRef(socket);
  const userIdsRef = useRef(currentUserIds);
  const userRef = useRef(user);
  const chatRoomsRef = useRef<RealtimeChatRoom[]>([]);
  const roomStatesRef = useRef<Record<string, RoomState>>({});
  const selectedRef = useRef<string | null>(null);
  const joinTimersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const inflightSendsRef = useRef(new Set<string>());
  const outboxRef = useRef(new Map<string, OutboxEntry>());
  const { upload: uploadFiles } = useAttachmentUpload(uploadChatFile);
  // Newest message each room was marked read up to, so a read is never re-sent.
  const lastReadSentRef = useRef(new Map<string, Pick<ChatMessage, "_id" | "createdAt">>());
  const removedListenersRef = useRef(new Set<RoomRemovedListener>());
  const draftsRef = useRef(new Map<string, string>());
  const roomListInflightRef = useRef(false);

  socketRef.current = socket;
  userIdsRef.current = currentUserIds;
  userRef.current = user;

  const setChatRooms = useCallback(
    (update: (prev: RealtimeChatRoom[]) => RealtimeChatRoom[]) => {
      chatRoomsRef.current = update(chatRoomsRef.current);
      setChatRoomsState(chatRoomsRef.current);
    },
    []
  );

  const patchRoom = useCallback(
    (roomId: string, patch: Partial<RoomState> | ((room: RoomState) => Partial<RoomState>)) => {
      const prev = roomStatesRef.current;
      const room = prev[roomId] ?? emptyRoomState(roomId);
      const changes = typeof patch === "function" ? patch(room) : patch;
      roomStatesRef.current = { ...prev, [roomId]: { ...room, ...changes } };
      setRoomStatesState(roomStatesRef.current);
    },
    []
  );

  const clearJoinTimer = useCallback((roomId: string) => {
    const timer = joinTimersRef.current.get(roomId);
    if (timer) clearTimeout(timer);
    joinTimersRef.current.delete(roomId);
  }, []);

  // ── Chat list ──────────────────────────────────────────────────────────────

  const refreshChatRooms = useCallback(() => {
    if (!socketRef.current?.connected || roomListInflightRef.current) return;
    roomListInflightRef.current = true;
    if (!chatRoomsRef.current.length) setIsLoading(true);
    emitWithAck("fetch-chat-rooms", {}).then((ack) => {
      roomListInflightRef.current = false;
      if (!ack.ok) {
        setIsLoading(false);
        setError(ack.error?.message || "Couldn't load your chats");
      }
    });
  }, [emitWithAck]);

  // ── Read state ─────────────────────────────────────────────────────────────

  /**
   * Marks the open room read up to the newest message from someone else, with
   * one `mark-room-read`, only while the chat is on screen and the window has focus.
   */
  const markVisibleAsRead = useCallback(
    (roomId: string) => {
      if (!isVisible() || selectedRef.current !== roomId) return;
      const room = roomStatesRef.current[roomId];
      if (!socketRef.current?.connected || !room || room.status !== "ready") return;

      setChatRooms((rooms) =>
        rooms.some((r) => r.roomId === roomId && r.unreadCount > 0)
          ? rooms.map((r) => (r.roomId === roomId ? { ...r, unreadCount: 0 } : r))
          : rooms
      );

      const ids = userIdsRef.current;
      const candidate = newestReadableMessage(room.messages, ids);
      const listRoom = chatRoomsRef.current.find((r) => r.roomId === roomId);
      const previous = lastReadSentRef.current.get(roomId);
      if (!needsReadMark(candidate, ids, listRoom?.lastReadAt, previous)) return;

      lastReadSentRef.current.set(roomId, { _id: candidate._id, createdAt: candidate.createdAt });
      emitWithAck("mark-room-read", { roomId, upToMessageId: candidate._id }).then((ack) => {
        if (ack.ok) {
          const readAt = typeof ack.readAt === "string" ? ack.readAt : candidate.createdAt;
          setChatRooms((rooms) =>
            rooms.map((r) =>
              r.roomId === roomId ? { ...r, lastReadAt: laterTime(r.lastReadAt, readAt) } : r
            )
          );
          return;
        }
        // Let the next trigger (new message, focus, reconnect) try again.
        if (lastReadSentRef.current.get(roomId)?._id === candidate._id) {
          if (previous) lastReadSentRef.current.set(roomId, previous);
          else lastReadSentRef.current.delete(roomId);
        }
      });
    },
    [emitWithAck, setChatRooms]
  );

  // ── Joining ────────────────────────────────────────────────────────────────

  const failJoin = useCallback(
    (roomId: string, failure?: { code?: string; message?: string }) => {
      // A rejected handshake is retried by the socket after a token refresh.
      if (failure?.code === "UNAUTHENTICATED") return;
      if (selectedRef.current !== roomId) return;
      clearJoinTimer(roomId);
      patchRoom(roomId, {
        status: "error",
        error:
          failure?.code === "NOT_FOUND"
            ? "This chat isn't available to you."
            : JOIN_FAILED_MESSAGE,
      });
    },
    [clearJoinTimer, patchRoom]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      clearJoinTimer(roomId);
      patchRoom(roomId, { status: "joining", error: null });

      // While offline the join is sent by the `connect` handler instead, and the
      // offline banner explains the wait, so the timeout only runs once sent.
      const current = socketRef.current;
      if (current?.connected) {
        joinTimersRef.current.set(
          roomId,
          setTimeout(() => {
            joinTimersRef.current.delete(roomId);
            if (roomStatesRef.current[roomId]?.status === "joining") {
              failJoin(roomId);
            }
          }, JOIN_TIMEOUT)
        );
        current.emit("join-chat-room", { roomId }, (ack: ChatAck) => {
          if (ack && ack.ok === false) failJoin(roomId, ack.error);
        });
      }
    },
    [clearJoinTimer, failJoin, patchRoom]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      clearJoinTimer(roomId);
      if (socketRef.current?.connected) {
        socketRef.current.emit("leave-chat-room", { roomId });
      }
      patchRoom(roomId, (room) => ({
        status: room.status === "ready" ? "ready" : "idle",
        isLoadingMore: false,
      }));
    },
    [clearJoinTimer, patchRoom]
  );

  const selectRoom = useCallback(
    (roomId: string) => {
      if (!roomId) return;
      const previous = selectedRef.current;
      if (previous && previous !== roomId) leaveRoom(previous);

      selectedRef.current = roomId;
      setSelectedRoomId(roomId);
      // Re-selecting (e.g. after Back or a failed join) always joins again.
      joinRoom(roomId);
    },
    [joinRoom, leaveRoom]
  );

  const unselectRoom = useCallback(() => {
    const previous = selectedRef.current;
    if (!previous) return;
    leaveRoom(previous);
    selectedRef.current = null;
    setSelectedRoomId(null);
  }, [leaveRoom]);

  const retryJoin = useCallback(
    (roomId: string) => {
      if (selectedRef.current === roomId) joinRoom(roomId);
    },
    [joinRoom]
  );

  // ── Membership ─────────────────────────────────────────────────────────────

  /** Drops a room I'm no longer in: leaves it if open, forgets it, tells the user. */
  const dropRoom = useCallback(
    (roomId: string, reason: RoomRemovalReason) => {
      const listRoom = chatRoomsRef.current.find((r) => r.roomId === roomId);
      const state = roomStatesRef.current[roomId];
      if (!listRoom && !state) return; // already handled (REST reply and socket event)

      if (selectedRef.current === roomId) {
        leaveRoom(roomId);
        selectedRef.current = null;
        setSelectedRoomId(null);
      }
      clearJoinTimer(roomId);
      const { [roomId]: _removed, ...rest } = roomStatesRef.current;
      roomStatesRef.current = rest;
      setRoomStatesState(rest);
      setChatRooms((rooms) => rooms.filter((r) => r.roomId !== roomId));
      draftsRef.current.delete(roomId);
      lastReadSentRef.current.delete(roomId);
      outboxRef.current.forEach((entry, clientMessageId) => {
        if (entry.roomId !== roomId || inflightSendsRef.current.has(clientMessageId)) return;
        entry.previewUrls.forEach((url) => URL.revokeObjectURL(url));
        outboxRef.current.delete(clientMessageId);
      });

      const name = listRoom?.displayName || state?.roomName || "the group";
      if (reason === "left") toast.info(`You left ${name}`);
      else toast.warning(`You were removed from ${name}`);
      removedListenersRef.current.forEach((listener) => listener(roomId, reason));
    },
    [clearJoinTimer, leaveRoom, setChatRooms]
  );

  const onRoomRemoved = useCallback((listener: RoomRemovedListener) => {
    removedListenersRef.current.add(listener);
    return () => {
      removedListenersRef.current.delete(listener);
    };
  }, []);

  const leaveGroup = useCallback(
    async (roomId: string): Promise<{ ok: boolean; message?: string }> => {
      const ids = userIdsRef.current;
      const participants =
        chatRoomsRef.current.find((r) => r.roomId === roomId)?.participants ||
        roomStatesRef.current[roomId]?.participants ||
        [];
      const me = participants.find((p) =>
        [participantId(p), p.userId].filter(Boolean).some((id) => ids.includes(String(id)))
      );
      const myId = me ? participantId(me) : ids[0];
      if (!myId) return { ok: false, message: "Couldn't leave the group. Please try again." };

      try {
        const res = await authFetch(
          `${API_BASE_URL}/chat/rooms/${encodeURIComponent(roomId)}/participants/${encodeURIComponent(myId)}/remove`,
          { method: "PATCH" }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
          return { ok: false, message: message || "Couldn't leave the group. Please try again." };
        }
      } catch {
        return { ok: false, message: "Couldn't leave the group. Check your connection and try again." };
      }
      dropRoom(roomId, "left");
      return { ok: true };
    },
    [dropRoom]
  );

  // ── Paging ─────────────────────────────────────────────────────────────────

  const applyPage = useCallback(
    (page: any) => {
      const roomId = String(page?.roomId || "");
      if (!roomId || roomId !== selectedRef.current) return;
      const incoming: ChatMessage[] = (page.messages || []).map(normalizeMessage);

      patchRoom(roomId, (room) => ({
        messages: mergeMessages(room.messages, incoming),
        ...(page.direction === "after"
          ? {}
          : {
              hasMore: Boolean(page.hasMore),
              nextCursor: page.nextCursor ?? (page.hasMore ? room.nextCursor : undefined),
              isLoadingMore: false,
              loadMoreError: null,
            }),
      }));
      markVisibleAsRead(roomId);
    },
    [markVisibleAsRead, patchRoom]
  );

  const loadOlderMessages = useCallback(
    (roomId: string) => {
      const room = roomStatesRef.current[roomId];
      if (!room || room.isLoadingMore || !room.hasMore || !room.nextCursor) return;

      patchRoom(roomId, { isLoadingMore: true, loadMoreError: null });
      emitWithAck("fetch-messages", {
        roomId,
        cursor: room.nextCursor,
        direction: "before",
        limit: PAGE_SIZE,
      }).then((ack) => {
        if (ack.ok) {
          applyPage({ roomId, direction: "before", ...ack });
        } else if (roomStatesRef.current[roomId]?.isLoadingMore) {
          patchRoom(roomId, {
            isLoadingMore: false,
            loadMoreError: ack.error?.message || "Couldn't load older messages",
          });
        }
      });
    },
    [applyPage, emitWithAck, patchRoom]
  );

  /** Fetches what arrived after the newest message we already had (reconnect / reopen). */
  const backfill = useCallback(
    async (roomId: string, cursor: string) => {
      let next: string | undefined = cursor;
      for (let page = 0; page < BACKFILL_MAX_PAGES && next; page++) {
        const ack = await emitWithAck("fetch-messages", {
          roomId,
          cursor: next,
          direction: "after",
          limit: BACKFILL_PAGE_SIZE,
        });
        if (!ack.ok || selectedRef.current !== roomId) return;
        applyPage({ roomId, direction: "after", ...ack });
        next = ack.hasMore ? ack.prevCursor : undefined;
      }
    },
    [applyPage, emitWithAck]
  );

  // ── Sending ────────────────────────────────────────────────────────────────

  /** Frees a media message's local previews and forgets its files. */
  const discardOutboxEntry = useCallback((clientMessageId: string) => {
    const entry = outboxRef.current.get(clientMessageId);
    if (!entry) return;
    entry.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    outboxRef.current.delete(clientMessageId);
  }, []);

  const markFailed = useCallback(
    (roomId: string, clientMessageId: string, message?: string) => {
      const localId = `local:${clientMessageId}`;
      const room = roomStatesRef.current[roomId];
      if (!room?.messages.some((m) => m._id === localId)) {
        // The bubble is gone (stored copy arrived, deleted, room dropped).
        discardOutboxEntry(clientMessageId);
        return;
      }
      patchRoom(roomId, (current) => ({
        messages: current.messages.map((m) =>
          m._id === localId ? { ...m, status: "failed", error: message || "Not sent" } : m
        ),
      }));
    },
    [discardOutboxEntry, patchRoom]
  );

  /** Upload progress (0–1) of one file on a pending bubble. */
  const setUploadProgress = useCallback(
    (roomId: string, clientMessageId: string, index: number, fraction: number) => {
      const localId = `local:${clientMessageId}`;
      const room = roomStatesRef.current[roomId];
      const message = room?.messages.find((m) => m._id === localId);
      if (!message || message.uploadProgress?.[index] === fraction) return;
      patchRoom(roomId, (current) => ({
        messages: current.messages.map((m) => {
          if (m._id !== localId) return m;
          const progress = [...(m.uploadProgress ?? [])];
          progress[index] = fraction;
          return { ...m, uploadProgress: progress };
        }),
      }));
    },
    [patchRoom]
  );

  /** Uploads what isn't uploaded yet, then sends one queued message. Offline: stays pending. */
  const emitSend = useCallback(
    async (roomId: string, clientMessageId: string) => {
      // Offline: the bubble stays pending and is flushed on reconnect.
      if (!socketRef.current?.connected || inflightSendsRef.current.has(clientMessageId)) return;

      const pending = roomStatesRef.current[roomId]?.messages.find(
        (m) => m._id === `local:${clientMessageId}`
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

      const payload = {
        roomId,
        text: pending.text,
        type: entry ? entry.type : "text",
        clientMessageId,
        ...(attachments.length ? { attachments } : {}),
        ...(entry?.type === "voice" && entry.duration !== undefined
          ? { duration: entry.duration }
          : {}),
      };

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
            const saved = normalizeMessage({
              ...ack.message,
              clientMessageId: ack.message.clientMessageId || clientMessageId,
            });
            if (roomStatesRef.current[roomId]) {
              patchRoom(roomId, (room) => ({ messages: mergeMessages(room.messages, [saved]) }));
            }
          }
          discardOutboxEntry(clientMessageId);
        });
    },
    [discardOutboxEntry, markFailed, patchRoom, setUploadProgress, uploadFiles]
  );

  const sendMessage = useCallback(
    (roomId: string, text: string, media: OutgoingMedia = {}) => {
      const trimmed = text.trim();
      const files = media.voice ? [media.voice.file] : media.files ?? [];
      if (!roomId || (!trimmed && files.length === 0)) return;
      if (files.length > MAX_FILES_PER_MESSAGE) {
        toast.error(TOO_MANY_FILES_MESSAGE);
        return;
      }
      const invalid = media.voice ? null : files.map(validateFile).find(Boolean);
      if (invalid) {
        toast.error(invalid);
        return;
      }

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

      if (files.length) {
        outboxRef.current.set(clientMessageId, {
          roomId,
          type,
          duration,
          items: files.map((file, index) => ({ file, kind: kinds[index], duration })),
          previewUrls,
        });
      }

      const me = userRef.current;
      const pending: ChatMessage = {
        _id: `local:${clientMessageId}`,
        roomId,
        clientMessageId,
        senderId: userIdsRef.current[0] || "",
        senderName: `${me?.firstName || ""} ${me?.lastName || ""}`.trim(),
        senderAvatar: me?.userAvatar || "",
        text: trimmed,
        type,
        attachments,
        duration,
        readBy: [],
        createdAt: new Date().toISOString(),
        status: "pending",
        uploadProgress: files.length ? files.map(() => 0) : undefined,
      };
      patchRoom(roomId, (room) => ({ messages: mergeMessages(room.messages, [pending]) }));
      void emitSend(roomId, clientMessageId);
    },
    [emitSend, patchRoom]
  );

  const retryMessage = useCallback(
    (roomId: string, clientMessageId: string) => {
      const localId = `local:${clientMessageId}`;
      patchRoom(roomId, (room) => ({
        messages: room.messages.map((m) =>
          m._id === localId ? { ...m, status: "pending", error: undefined } : m
        ),
      }));
      // Files that already uploaded keep their attachment and are skipped.
      void emitSend(roomId, clientMessageId);
    },
    [emitSend, patchRoom]
  );

  const deleteFailedMessage = useCallback(
    (roomId: string, clientMessageId: string) => {
      if (inflightSendsRef.current.has(clientMessageId)) return;
      const localId = `local:${clientMessageId}`;
      patchRoom(roomId, (room) => ({
        messages: room.messages.filter((m) => m._id !== localId),
      }));
      discardOutboxEntry(clientMessageId);
    },
    [discardOutboxEntry, patchRoom]
  );

  const flushOutbox = useCallback(() => {
    Object.values(roomStatesRef.current).forEach((room) => {
      room.messages.forEach((message) => {
        if (message.status === "pending" && message.clientMessageId) {
          void emitSend(room.roomId, message.clientMessageId);
        }
      });
    });
  }, [emitSend]);

  // ── Drafts ─────────────────────────────────────────────────────────────────

  const getDraft = useCallback((roomId: string) => draftsRef.current.get(roomId) || "", []);
  const setDraft = useCallback((roomId: string, text: string) => {
    if (text) draftsRef.current.set(roomId, text);
    else draftsRef.current.delete(roomId);
  }, []);

  // ── Socket events ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!socket) return;

    // Every connect (first and reconnects): rejoin the open room (its joined
    // handler backfills the gap), resend pending messages, refresh the list.
    const onConnect = () => {
      const open = selectedRef.current;
      if (open) joinRoom(open);
      flushOutbox();
      refreshChatRooms();
    };

    const onChatRoomJoined = (data: any) => {
      const roomId = String(data?.roomId || "");
      if (!roomId || roomId !== selectedRef.current) return;
      clearJoinTimer(roomId);

      const incoming: ChatMessage[] = (data.messages || []).map(normalizeMessage);
      const before = roomStatesRef.current[roomId] ?? emptyRoomState(roomId);
      const newestKnown = newestServerMessageId(before.messages);
      const isFirstLoad = !newestKnown;

      patchRoom(roomId, (room) => ({
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
      }));

      if (data.room && !chatRoomsRef.current.some((r) => r.roomId === roomId)) {
        setChatRooms((rooms) =>
          sortRooms([...rooms, toRealtimeRoom(data.room, userIdsRef.current)])
        );
      }

      // Messages that arrived while we were away and aren't in this first page.
      if (newestKnown && !incoming.some((m) => m._id === newestKnown)) {
        void backfill(roomId, newestKnown);
      }
      markVisibleAsRead(roomId);
    };

    const onMessagesUpdate = (data: any) => applyPage(data);

    const onChatMessage = (raw: any) => {
      const message = normalizeMessage(raw);
      if (!message.roomId || message.roomId !== selectedRef.current) return;
      patchRoom(message.roomId, (room) => ({
        messages: mergeMessages(room.messages, [message]),
      }));
      if (!isSameUser(message.senderId, userIdsRef.current)) {
        markVisibleAsRead(message.roomId);
      }
    };

    const onChatRoomActivity = ({ roomId, lastMessage }: ChatRoomActivity) => {
      if (!roomId || !lastMessage) return;
      if (!chatRoomsRef.current.some((r) => r.roomId === roomId)) {
        refreshChatRooms(); // a room we haven't seen yet
        return;
      }
      const mine = isSameUser(lastMessage.senderId, userIdsRef.current);
      const isOpen = selectedRef.current === roomId && isVisible();
      setChatRooms((rooms) =>
        sortRooms(
          rooms.map((room) =>
            room.roomId === roomId
              ? {
                  ...room,
                  lastMessage: {
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
        )
      );
    };

    const onChatRoomsUpdate = (data: any) => {
      roomListInflightRef.current = false;
      if (!data || !Array.isArray(data.rooms)) {
        setError("Invalid chat rooms data received");
        setIsLoading(false);
        return;
      }
      const open = isVisible() ? selectedRef.current : null;
      setChatRooms(() =>
        sortRooms(
          data.rooms.map((room: any) => {
            const item = toRealtimeRoom(room, userIdsRef.current);
            // The open chat is being marked read right now.
            return item.roomId === open ? { ...item, unreadCount: 0 } : item;
          })
        )
      );
      setIsLoading(false);
      setError(null);
    };

    const onUnreadMessagesUpdate = (data: { unreadCount?: number }) => {
      if (typeof data?.unreadCount === "number") setTotalUnread(data.unreadCount);
    };

    // Another member read up to a message: update ticks on my copies.
    const onMessagesRead = (data: ChatReadEvent) => {
      const roomId = String(data?.roomId || "");
      const userId = String(data?.userId || "");
      const room = roomStatesRef.current[roomId];
      if (!room || !userId || !data?.readAt) return;
      const messages = applyMessagesRead(room.messages, userId, data.readAt);
      if (messages !== room.messages) patchRoom(roomId, { messages });
    };

    // I read this room on another device (or this one): clear its badge.
    const onRoomRead = (data: ChatReadEvent) => {
      const roomId = String(data?.roomId || "");
      if (!roomId || !data?.readAt) return;
      const readTime = new Date(data.readAt).getTime();
      setChatRooms((rooms) =>
        rooms.map((room) => {
          if (room.roomId !== roomId) return room;
          const lastTime = new Date(room.lastMessage?.timestamp || 0).getTime();
          // A message newer than the read position keeps the badge.
          const covered = Number.isNaN(readTime) || Number.isNaN(lastTime) || lastTime <= readTime;
          return {
            ...room,
            lastReadAt: laterTime(room.lastReadAt, data.readAt),
            unreadCount: covered ? 0 : room.unreadCount,
          };
        })
      );
    };

    const onRoomUpdated = (data: ChatRoomUpdatedEvent) => {
      const roomId = String(data?.roomId || "");
      if (!roomId) return;
      setChatRooms((rooms) =>
        rooms.map((room) => (room.roomId === roomId ? applyRoomDetails(room, data) : room))
      );
      if (roomStatesRef.current[roomId]) {
        patchRoom(roomId, (room) => ({
          roomName: data.name || room.roomName,
          description:
            data.description === undefined ? room.description : String(data.description || ""),
          avatarUrl: data.avatarUrl === undefined ? room.avatarUrl : String(data.avatarUrl || ""),
        }));
      }
    };

    const onParticipantsChanged = (data: ChatParticipantsChangedEvent) => {
      const roomId = String(data?.roomId || "");
      if (!roomId) return;
      const ids = userIdsRef.current;
      if ((data.removed || []).some((id) => ids.includes(String(id)))) {
        dropRoom(roomId, isSameUser(data.by, ids) ? "left" : "removed");
        return;
      }
      if (!chatRoomsRef.current.some((r) => r.roomId === roomId)) {
        // Added to a room we don't list yet.
        if ((data.added || []).some((id) => ids.includes(String(id)))) refreshChatRooms();
      }
      if (!Array.isArray(data.participants)) return;
      const participants = data.participants;
      setChatRooms((rooms) =>
        rooms.map((room) =>
          room.roomId === roomId ? applyParticipants(room, participants, ids) : room
        )
      );
      if (roomStatesRef.current[roomId]) patchRoom(roomId, { participants });
    };

    const onServerError = (payload: any) => {
      const code = payload?.code;
      if (code === "UNAUTHENTICATED") return;
      const roomId = payload?.roomId ? String(payload.roomId) : "";
      const clientMessageId = payload?.clientMessageId;

      if (clientMessageId) {
        const owner =
          roomId ||
          Object.values(roomStatesRef.current).find((room) =>
            room.messages.some((m) => m.clientMessageId === clientMessageId)
          )?.roomId;
        if (owner) markFailed(owner, clientMessageId, payload?.message);
        return;
      }
      if (!roomId) return;
      const room = roomStatesRef.current[roomId];
      if (room?.status === "joining") {
        failJoin(roomId, { code, message: payload?.message });
      } else if (room?.isLoadingMore) {
        patchRoom(roomId, {
          isLoadingMore: false,
          loadMoreError: payload?.message || "Couldn't load older messages",
        });
      }
    };

    socket.on("connect", onConnect);
    socket.on("chat-room-joined", onChatRoomJoined);
    socket.on("messages-update", onMessagesUpdate);
    socket.on("chat-message", onChatMessage);
    socket.on("chat-room-activity", onChatRoomActivity);
    socket.on("chat-rooms-update", onChatRoomsUpdate);
    socket.on("unread-messages-update", onUnreadMessagesUpdate);
    socket.on("messages-read", onMessagesRead);
    socket.on("room-read", onRoomRead);
    socket.on("room-updated", onRoomUpdated);
    socket.on("participants-changed", onParticipantsChanged);
    socket.on("error", onServerError);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("chat-room-joined", onChatRoomJoined);
      socket.off("messages-update", onMessagesUpdate);
      socket.off("chat-message", onChatMessage);
      socket.off("chat-room-activity", onChatRoomActivity);
      socket.off("chat-rooms-update", onChatRoomsUpdate);
      socket.off("unread-messages-update", onUnreadMessagesUpdate);
      socket.off("messages-read", onMessagesRead);
      socket.off("room-read", onRoomRead);
      socket.off("room-updated", onRoomUpdated);
      socket.off("participants-changed", onParticipantsChanged);
      socket.off("error", onServerError);
    };
  }, [
    socket,
    applyPage,
    backfill,
    clearJoinTimer,
    dropRoom,
    failJoin,
    flushOutbox,
    joinRoom,
    markFailed,
    markVisibleAsRead,
    patchRoom,
    refreshChatRooms,
    setChatRooms,
  ]);

  // Mark what arrived while the tab was hidden or the window unfocused once it's back.
  useEffect(() => {
    const onReturn = () => {
      if (isVisible() && selectedRef.current) markVisibleAsRead(selectedRef.current);
    };
    document.addEventListener("visibilitychange", onReturn);
    window.addEventListener("focus", onReturn);
    return () => {
      document.removeEventListener("visibilitychange", onReturn);
      window.removeEventListener("focus", onReturn);
    };
  }, [markVisibleAsRead]);

  // A different (or no) user: start from a clean slate.
  useEffect(() => {
    const timers = joinTimersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
      chatRoomsRef.current = [];
      roomStatesRef.current = {};
      selectedRef.current = null;
      inflightSendsRef.current.clear();
      lastReadSentRef.current.clear();
      outboxRef.current.forEach((entry) => entry.previewUrls.forEach((url) => URL.revokeObjectURL(url)));
      outboxRef.current.clear();
      draftsRef.current.clear();
      roomListInflightRef.current = false;
      setChatRoomsState([]);
      setRoomStatesState({});
      setSelectedRoomId(null);
      setTotalUnread(null);
      setError(null);
      setIsLoading(false);
    };
  }, [primaryUserId]);

  const unreadFromRooms = chatRooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0);

  const value: ChatContextValue = {
    chatRooms,
    isLoading,
    isConnected,
    connectionStatus,
    error,
    totalUnread: totalUnread ?? unreadFromRooms,
    refreshChatRooms,
    currentUserIds,
    selectedRoomId,
    selectRoom,
    unselectRoom,
    retryJoin,
    roomStates,
    loadOlderMessages,
    sendMessage,
    retryMessage,
    deleteFailedMessage,
    getDraft,
    setDraft,
    leaveGroup,
    onRoomRemoved,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

export { emptyRoomState };
