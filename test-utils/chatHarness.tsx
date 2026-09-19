// Renders the real ChatProvider against the doubles in `chatMocks.ts` and gives
// tests a live view of the context value plus helpers to play the server.
import React from "react";
import { act, render } from "@testing-library/react";
import { ChatProvider, useChatContext, type ChatContextValue } from "@/contexts/ChatContext";
import type { ChatMessage, RawChatMessage, RawChatRoom, RoomState } from "@/types/chat";
import type { FakeSocket } from "@/test-utils/chatMocks";
import { ME } from "@/test-utils/chatMocks";

export interface ChatHarness {
  /** The latest context value (re-read after every `act`). */
  chat: () => ChatContextValue;
  socket: FakeSocket;
  /** Runs `fn` inside `act`, flushing effects and pending promises. */
  run: (fn: () => void | Promise<void>) => Promise<void>;
  /** The state of one room, or undefined before it was touched. */
  room: (roomId: string) => RoomState | undefined;
  /** The message list of one room. */
  messages: (roomId: string) => ChatMessage[];
  unmount: () => void;
  rerender: () => void;
}

function Probe({ into }: { into: { current: ChatContextValue | null } }) {
  into.current = useChatContext();
  return null;
}

/** Mounts the provider and lets its `connect` / rooms bootstrap settle. */
export async function renderChat(socket: FakeSocket): Promise<ChatHarness> {
  const into: { current: ChatContextValue | null } = { current: null };
  const tree = () => (
    <ChatProvider>
      <Probe into={into} />
    </ChatProvider>
  );
  let view!: ReturnType<typeof render>;
  await act(async () => {
    view = render(tree());
  });
  const chat = () => into.current as ChatContextValue;
  const run = async (fn: () => void | Promise<void>) => {
    await act(async () => {
      await fn();
    });
  };
  return {
    chat,
    socket,
    run,
    room: (roomId) => chat().roomStates[roomId],
    messages: (roomId) => chat().roomStates[roomId]?.messages ?? [],
    unmount: () => view.unmount(),
    rerender: () => view.rerender(tree()),
  };
}

// ─── Payload builders ────────────────────────────────────────────────────────

/** A server message; defaults to one from the other person in room `r1`. */
export const rawMessage = (
  id: string,
  overrides: Partial<RawChatMessage> = {}
): RawChatMessage => ({
  _id: id,
  roomId: "r1",
  senderId: "user-2",
  sender: { name: "Bola Ade", avatar: "" },
  text: `text ${id}`,
  type: "text",
  attachments: [],
  readBy: [],
  createdAt: "2026-09-13T10:00:00.000Z",
  ...overrides,
});

/** An ISO time `minutes` after a fixed base, to keep fixtures ordered. */
export const at = (minutes: number) =>
  new Date(Date.UTC(2026, 8, 13, 10, minutes, 0)).toISOString();

/** A direct-message room shaped like `chat-rooms-update` sends it. */
export const rawRoom = (id: string, overrides: Partial<RawChatRoom> = {}): RawChatRoom => ({
  _id: id,
  type: "one_to_one",
  name: "",
  participants: [
    { _id: ME.userId, userId: ME.userId, firstName: "Ada", lastName: "Nwosu", isOnline: true },
    { _id: "user-2", userId: "user-2", firstName: "Bola", lastName: "Ade", isOnline: false },
  ],
  lastMessage: null,
  unreadCount: 0,
  updatedAt: at(0),
  ...overrides,
});

/** Selects a room and answers its join with the given first page. */
export async function openRoom(
  h: ChatHarness,
  roomId: string,
  joined: Record<string, unknown> = {}
) {
  await h.run(() => h.chat().selectRoom(roomId));
  await h.run(() =>
    h.socket.serverEmit("chat-room-joined", {
      roomId,
      messages: [],
      hasMore: false,
      ...joined,
    })
  );
}
