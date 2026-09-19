"use client";

import { useCallback, useMemo, useRef, useState, type MutableRefObject } from "react";
import type { Socket } from "socket.io-client";
import type { WebSocketContextType } from "@/hooks/useWebSocket";
import type { ChatMessage, RealtimeChatRoom, RoomState } from "@/types/chat";
import { userIdsOf } from "./listReducers";
import { emptyRoomState } from "./roomReducers";
import type { OutboxEntry, RoomRemovedListener } from "./types";

/** The signed-in user, as the chat store reads it. */
export interface ChatUser {
  userId?: string;
  id?: string;
  _id?: unknown;
  firstName?: string;
  lastName?: string;
  userAvatar?: string;
}

/** The socket's ack-emit helper. */
export type EmitWithAck = WebSocketContextType["emitWithAck"];

type Ref<T> = MutableRefObject<T>;

/**
 * What every chat hook shares. Refs are the source of truth for event
 * handlers (no stale closures); the setters publish them to React state.
 * The object itself never changes identity.
 */
export interface ChatStore {
  socketRef: Ref<Socket | null>;
  userIdsRef: Ref<string[]>;
  userRef: Ref<ChatUser | null | undefined>;
  chatRoomsRef: Ref<RealtimeChatRoom[]>;
  roomStatesRef: Ref<Record<string, RoomState>>;
  selectedRef: Ref<string | null>;
  joinTimersRef: Ref<Map<string, ReturnType<typeof setTimeout>>>;
  inflightSendsRef: Ref<Set<string>>;
  outboxRef: Ref<Map<string, OutboxEntry>>;
  /** Newest message each room was marked read up to, so a read is never re-sent. */
  lastReadSentRef: Ref<Map<string, Pick<ChatMessage, "_id" | "createdAt">>>;
  removedListenersRef: Ref<Set<RoomRemovedListener>>;
  draftsRef: Ref<Map<string, string>>;
  roomListInflightRef: Ref<boolean>;

  setChatRooms: (update: (prev: RealtimeChatRoom[]) => RealtimeChatRoom[]) => void;
  patchRoom: (
    roomId: string,
    patch: Partial<RoomState> | ((room: RoomState) => Partial<RoomState>)
  ) => void;
  /** Forgets a room's message store. */
  removeRoomState: (roomId: string) => void;
  setSelectedRoomId: (roomId: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
  setTotalUnread: (total: number | null) => void;
  /** Empties every state the store publishes. */
  resetState: () => void;
}

/** What the provider renders from. */
export interface ChatStoreState {
  store: ChatStore;
  currentUserIds: string[];
  primaryUserId: string | null;
  chatRooms: RealtimeChatRoom[];
  roomStates: Record<string, RoomState>;
  selectedRoomId: string | null;
  isLoading: boolean;
  error: string | null;
  /** The server's total, or null until it reports one. */
  totalUnread: number | null;
}

/**
 * Owns the chat state: the rooms list, each room's message store, the open
 * room and the refs handlers read. Nothing here talks to the socket.
 *
 * @param socket - The app's socket, or null while signed out.
 * @param user - The signed-in user.
 * @returns The shared store and the state to render.
 */
export function useChatStore(socket: Socket | null, user: ChatUser | null | undefined): ChatStoreState {
  const currentUserIds = useMemo(() => userIdsOf(user), [user]);
  const primaryUserId = currentUserIds[0] || null;

  const [chatRooms, setChatRoomsState] = useState<RealtimeChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUnread, setTotalUnread] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomStates, setRoomStatesState] = useState<Record<string, RoomState>>({});

  const socketRef = useRef(socket);
  const userIdsRef = useRef(currentUserIds);
  const userRef = useRef(user);
  const chatRoomsRef = useRef<RealtimeChatRoom[]>([]);
  const roomStatesRef = useRef<Record<string, RoomState>>({});
  const selectedRef = useRef<string | null>(null);
  const joinTimersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const inflightSendsRef = useRef(new Set<string>());
  const outboxRef = useRef(new Map<string, OutboxEntry>());
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

  const removeRoomState = useCallback((roomId: string) => {
    const { [roomId]: _removed, ...rest } = roomStatesRef.current;
    roomStatesRef.current = rest;
    setRoomStatesState(rest);
  }, []);

  const resetState = useCallback(() => {
    setChatRoomsState([]);
    setRoomStatesState({});
    setSelectedRoomId(null);
    setTotalUnread(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const store = useMemo<ChatStore>(
    () => ({
      socketRef,
      userIdsRef,
      userRef,
      chatRoomsRef,
      roomStatesRef,
      selectedRef,
      joinTimersRef,
      inflightSendsRef,
      outboxRef,
      lastReadSentRef,
      removedListenersRef,
      draftsRef,
      roomListInflightRef,
      setChatRooms,
      patchRoom,
      removeRoomState,
      setSelectedRoomId,
      setIsLoading,
      setError,
      setTotalUnread,
      resetState,
    }),
    [setChatRooms, patchRoom, removeRoomState, resetState]
  );

  return {
    store,
    currentUserIds,
    primaryUserId,
    chatRooms,
    roomStates,
    selectedRoomId,
    isLoading,
    error,
    totalUnread,
  };
}
