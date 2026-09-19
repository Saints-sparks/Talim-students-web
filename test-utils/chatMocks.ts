// Test doubles for the edges of the chat store: the socket, the auth and
// WebSocket contexts, REST and the toast. Everything between them (the
// provider, its reducers, the outbox) is the real code under test.
//
// Test files wire these in with, for example:
//   jest.mock("@/contexts/WebSocketContext", () => require("@/test-utils/chatMocks").webSocketContextMock);
import type { ChatAck } from "@/types/chat";

type Listener = (...args: unknown[]) => void;

/** One call to `emit` (directly or through `timeout(ms)`) with its ack callback. */
export interface EmittedEvent {
  event: string;
  payload: unknown;
  /** Set when sent through `socket.timeout(ms).emit`. */
  timeoutMs?: number;
  /** The callback: `(ack)` for a plain emit, `(err, ack)` for a timeout emit. */
  ack?: (...args: unknown[]) => void;
}

/** A socket.io client stand-in: records what the app emits and lets a test play the server. */
export class FakeSocket {
  connected = true;
  emitted: EmittedEvent[] = [];
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, listener: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)?.add(listener);
    return this;
  }

  off(event: string, listener: Listener) {
    this.listeners.get(event)?.delete(listener);
    return this;
  }

  emit(event: string, payload?: unknown, ack?: (...args: unknown[]) => void) {
    this.emitted.push({ event, payload, ack });
    return true;
  }

  timeout(timeoutMs: number) {
    return {
      emit: (event: string, payload?: unknown, ack?: (...args: unknown[]) => void) => {
        this.emitted.push({ event, payload, timeoutMs, ack });
        return true;
      },
    };
  }

  /** The server pushes an event to the app. */
  serverEmit(event: string, payload?: unknown) {
    Array.from(this.listeners.get(event) ?? []).forEach((listener) => listener(payload));
  }

  /** Number of app-side listeners for an event (to prove unsubscribing). */
  listenerCount(event: string) {
    return this.listeners.get(event)?.size ?? 0;
  }

  /** Everything the app emitted for one event, oldest first. */
  sent(event: string) {
    return this.emitted.filter((entry) => entry.event === event);
  }
}

/** What `useWebSocketContext()` returns; tests mutate it, then re-render. */
export const ws: {
  socket: FakeSocket | null;
  isConnected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  emitWithAck: jest.Mock<Promise<ChatAck>, [string, unknown?, number?]>;
  connect: jest.Mock;
  disconnect: jest.Mock;
  reconnect: jest.Mock;
} = {
  socket: null,
  isConnected: true,
  connectionStatus: "connected",
  emitWithAck: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  reconnect: jest.fn(),
};

/** The acks `emitWithAck` resolves with, by event name (default `{ ok: true }`). */
export const responders: Record<string, (payload: unknown) => ChatAck | Promise<ChatAck>> = {};

/** The signed-in user `useAuthContext()` returns. */
export const auth: { user: Record<string, unknown> | null } = { user: null };

export const ME = {
  userId: "user-1",
  id: "user-1",
  firstName: "Ada",
  lastName: "Nwosu",
  userAvatar: "",
};

export const webSocketContextMock = {
  useWebSocketContext: () => ws,
  useWebSocketContextSafe: () => ws,
  WebSocketProvider: ({ children }: { children: unknown }) => children,
};

export const authContextMock = {
  useAuthContext: () => auth,
};

export const authFetchMock = {
  authFetch: jest.fn(),
  refreshAccessToken: jest.fn(),
};

export const chatServiceMock = {
  chatService: { uploadChatAttachment: jest.fn() },
};

export const toastMock = {
  toast: { info: jest.fn(), warning: jest.fn(), error: jest.fn(), success: jest.fn() },
};

/** A fresh connected socket, a signed-in user and cleared mocks. Call in `beforeEach`. */
export function resetChatMocks(): FakeSocket {
  const socket = new FakeSocket();
  ws.socket = socket;
  ws.isConnected = true;
  ws.connectionStatus = "connected";
  Object.keys(responders).forEach((key) => delete responders[key]);
  ws.emitWithAck.mockReset();
  ws.emitWithAck.mockImplementation(async (event, payload) => {
    const respond = responders[event];
    return respond ? respond(payload) : { ok: true };
  });
  auth.user = { ...ME };
  authFetchMock.authFetch.mockReset();
  authFetchMock.refreshAccessToken.mockReset();
  chatServiceMock.chatService.uploadChatAttachment.mockReset();
  Object.values(toastMock.toast).forEach((fn) => fn.mockReset());
  return socket;
}
