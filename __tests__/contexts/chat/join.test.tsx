// Characterization of joining rooms: first load vs rejoin, the join timeout,
// and what a socket (re)connect does.
import { act } from "@testing-library/react";
import { JOIN_FAILED_MESSAGE } from "@/contexts/ChatContext";
import {
  at,
  openRoom,
  rawMessage,
  rawRoom,
  renderChat,
  type ChatHarness,
} from "@/test-utils/chatHarness";
import { resetChatMocks, responders, ws, type FakeSocket } from "@/test-utils/chatMocks";

jest.mock("@/contexts/WebSocketContext", () => require("@/test-utils/chatMocks").webSocketContextMock);
jest.mock("@/contexts/AuthContext", () => require("@/test-utils/chatMocks").authContextMock);
jest.mock("@/lib/authFetch", () => require("@/test-utils/chatMocks").authFetchMock);
jest.mock("@/services/chat.service", () => require("@/test-utils/chatMocks").chatServiceMock);
jest.mock("@/components/CustomToast", () => require("@/test-utils/chatMocks").toastMock);

let socket: FakeSocket;
let h: ChatHarness;

const joins = () => socket.sent("join-chat-room");
const fetches = (event: string) => ws.emitWithAck.mock.calls.filter(([name]) => name === event);

beforeEach(async () => {
  jest.useFakeTimers({
    doNotFake: ["nextTick", "queueMicrotask", "setImmediate", "clearImmediate", "hrtime", "performance"],
  });
  socket = resetChatMocks();
  h = await renderChat(socket);
});

afterEach(() => {
  h.unmount();
  jest.useRealTimers();
});

describe("chat-room-joined", () => {
  it("first load: stores the page, paging state and room details", async () => {
    await h.run(() => h.chat().selectRoom("r1"));
    expect(h.room("r1")).toMatchObject({ status: "joining", error: null });
    expect(joins()[0].payload).toEqual({ roomId: "r1" });

    await h.run(() =>
      socket.serverEmit("chat-room-joined", {
        roomId: "r1",
        messages: [rawMessage("m2", { createdAt: at(2) }), rawMessage("m1", { createdAt: at(1) })],
        hasMore: true,
        nextCursor: "cursor-1",
        room: rawRoom("r1", { name: "Chat", createdBy: "user-2" }),
      })
    );

    expect(h.room("r1")).toMatchObject({
      status: "ready",
      hasMore: true,
      nextCursor: "cursor-1",
      roomType: "one_to_one",
      createdBy: "user-2",
    });
    expect(h.messages("r1").map((m) => m._id)).toEqual(["m1", "m2"]);
    // A room we had not listed yet joins the list.
    expect(h.chat().chatRooms.map((r) => r.roomId)).toEqual(["r1"]);
  });

  it("ignores a join for a room that is not the open one", async () => {
    await h.run(() => h.chat().selectRoom("r1"));
    await h.run(() =>
      socket.serverEmit("chat-room-joined", { roomId: "r2", messages: [rawMessage("x", { roomId: "r2" })] })
    );
    expect(h.room("r2")).toBeUndefined();
    expect(h.room("r1")?.status).toBe("joining");
  });

  it("rejoin: keeps cached messages and paging state when the new page overlaps them", async () => {
    await openRoom(h, "r1", {
      messages: [rawMessage("m1", { createdAt: at(1) }), rawMessage("m2", { createdAt: at(2) })],
      hasMore: true,
      nextCursor: "cursor-1",
    });
    await h.run(() => h.chat().unselectRoom());
    expect(socket.sent("leave-chat-room")[0].payload).toEqual({ roomId: "r1" });
    expect(h.room("r1")?.status).toBe("ready"); // cached, still readable

    await h.run(() => h.chat().selectRoom("r1"));
    expect(h.room("r1")?.status).toBe("joining");
    expect(h.messages("r1")).toHaveLength(2); // shown instantly while rejoining

    await h.run(() =>
      socket.serverEmit("chat-room-joined", {
        roomId: "r1",
        messages: [rawMessage("m2", { createdAt: at(2) }), rawMessage("m3", { createdAt: at(3) })],
        hasMore: false, // ignored on a rejoin
        nextCursor: "other",
      })
    );

    expect(h.messages("r1").map((m) => m._id)).toEqual(["m1", "m2", "m3"]);
    expect(h.room("r1")).toMatchObject({ status: "ready", hasMore: true, nextCursor: "cursor-1" });
    expect(fetches("fetch-messages")).toHaveLength(0); // no gap, so no backfill
  });

  it("rejoin: backfills, page by page, what arrived while away and is not in the first page", async () => {
    await openRoom(h, "r1", {
      messages: [rawMessage("m1", { createdAt: at(1) })],
      hasMore: false,
    });
    await h.run(() => h.chat().unselectRoom());

    const pages: Record<string, unknown> = {
      m1: { ok: true, messages: [rawMessage("m2", { createdAt: at(2) })], hasMore: true, prevCursor: "m2" },
      m2: { ok: true, messages: [rawMessage("m3", { createdAt: at(3) })], hasMore: false },
    };
    responders["fetch-messages"] = (payload) =>
      pages[(payload as { cursor: string }).cursor] as never;

    await h.run(() => h.chat().selectRoom("r1"));
    await h.run(() =>
      socket.serverEmit("chat-room-joined", {
        roomId: "r1",
        messages: [rawMessage("m9", { createdAt: at(9) })], // newest page misses the gap
        hasMore: true,
        nextCursor: "cursor-new",
      })
    );

    expect(fetches("fetch-messages").map(([, payload]) => payload)).toEqual([
      { roomId: "r1", cursor: "m1", direction: "after", limit: 100 },
      { roomId: "r1", cursor: "m2", direction: "after", limit: 100 },
    ]);
    expect(h.messages("r1").map((m) => m._id)).toEqual(["m1", "m2", "m3", "m9"]);
    // Backfilling forward must not disturb the paging state for older history.
    expect(h.room("r1")).toMatchObject({ hasMore: false, nextCursor: "cursor-new" });
  });

  it("clears the join timer once joined", async () => {
    await h.run(() => h.chat().selectRoom("r1"));
    await h.run(() => socket.serverEmit("chat-room-joined", { roomId: "r1", messages: [] }));
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });
    expect(h.room("r1")?.status).toBe("ready");
  });
});

describe("join timeout and failures", () => {
  it("fails the join after 10 seconds with the shared message", async () => {
    await h.run(() => h.chat().selectRoom("r1"));
    await act(async () => {
      jest.advanceTimersByTime(9_999);
    });
    expect(h.room("r1")?.status).toBe("joining");
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(h.room("r1")).toMatchObject({ status: "error", error: JOIN_FAILED_MESSAGE });
  });

  it("does not start the timeout while offline; it starts when the join is finally sent", async () => {
    socket.connected = false;
    await h.run(() => h.chat().selectRoom("r1"));
    expect(joins()).toHaveLength(0);
    await act(async () => {
      jest.advanceTimersByTime(60_000);
    });
    expect(h.room("r1")?.status).toBe("joining"); // never times out offline

    socket.connected = true;
    await h.run(() => socket.serverEmit("connect"));
    expect(joins()).toHaveLength(1);

    await act(async () => {
      jest.advanceTimersByTime(9_999);
    });
    expect(h.room("r1")?.status).toBe("joining");
    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(h.room("r1")?.status).toBe("error");
  });

  it("maps a NOT_FOUND ack to the unavailable message", async () => {
    await h.run(() => h.chat().selectRoom("r1"));
    await h.run(() => joins()[0].ack?.({ ok: false, error: { code: "NOT_FOUND", message: "x" } }));
    expect(h.room("r1")).toMatchObject({ status: "error", error: "This chat isn't available to you." });
  });

  it("leaves the join pending on an UNAUTHENTICATED ack (the socket retries after a refresh)", async () => {
    await h.run(() => h.chat().selectRoom("r1"));
    await h.run(() => joins()[0].ack?.({ ok: false, error: { code: "UNAUTHENTICATED", message: "x" } }));
    expect(h.room("r1")?.status).toBe("joining");
  });

  it("fails a joining room on a server error event, and retryJoin joins again", async () => {
    await h.run(() => h.chat().selectRoom("r1"));
    await h.run(() => socket.serverEmit("error", { code: "FORBIDDEN", roomId: "r1", message: "no" }));
    expect(h.room("r1")).toMatchObject({ status: "error", error: JOIN_FAILED_MESSAGE });

    await h.run(() => h.chat().retryJoin("r1"));
    expect(h.room("r1")).toMatchObject({ status: "joining", error: null });
    expect(joins()).toHaveLength(2);
  });

  it("retryJoin only applies to the open room", async () => {
    await h.run(() => h.chat().selectRoom("r1"));
    await h.run(() => h.chat().retryJoin("r2"));
    expect(joins()).toHaveLength(1);
  });
});

describe("selecting and connecting", () => {
  it("leaves the previous room when another is selected", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().selectRoom("r2"));
    expect(socket.sent("leave-chat-room")[0].payload).toEqual({ roomId: "r1" });
    expect(h.chat().selectedRoomId).toBe("r2");
    expect(h.room("r1")?.status).toBe("ready");
    expect(h.room("r2")?.status).toBe("joining");
  });

  it("on reconnect rejoins the open room, resends pending messages and refreshes the list", async () => {
    await openRoom(h, "r1");
    const before = fetches("fetch-chat-rooms").length;
    socket.connected = false;
    await h.run(() => h.chat().sendMessage("r1", "queued"));

    socket.connected = true;
    await h.run(() => socket.serverEmit("connect"));

    expect(joins()).toHaveLength(2);
    expect(socket.sent("send-chat-message")).toHaveLength(1);
    expect(fetches("fetch-chat-rooms").length).toBe(before + 1);
  });

  it("asks for the room list once while a request is unanswered", async () => {
    await h.run(() => socket.serverEmit("chat-rooms-update", { rooms: [] }));
    let answer: (ack: { ok: boolean }) => void = () => {};
    responders["fetch-chat-rooms"] = () => new Promise((resolve) => (answer = resolve));
    const before = fetches("fetch-chat-rooms").length;

    await h.run(() => h.chat().refreshChatRooms());
    await h.run(() => h.chat().refreshChatRooms());
    expect(fetches("fetch-chat-rooms").length).toBe(before + 1);

    await h.run(() => answer({ ok: true }));
    await h.run(() => h.chat().refreshChatRooms());
    expect(fetches("fetch-chat-rooms").length).toBe(before + 2);
  });

  it("reports a failed room-list request", async () => {
    responders["fetch-chat-rooms"] = () => ({ ok: false, error: { code: "TIMEOUT", message: "Slow" } });
    await h.run(() => h.chat().refreshChatRooms());
    expect(h.chat().error).toBe("Slow");
    expect(h.chat().isLoading).toBe(false);
  });

  it("unsubscribes every socket listener on unmount", async () => {
    const events = [
      "connect", "chat-room-joined", "messages-update", "chat-message", "chat-room-activity",
      "chat-rooms-update", "unread-messages-update", "messages-read", "room-read",
      "message-deleted", "room-updated", "participants-changed", "error",
    ];
    events.forEach((event) => expect(socket.listenerCount(event)).toBe(1));
    h.unmount();
    events.forEach((event) => expect(socket.listenerCount(event)).toBe(0));
    h = await renderChat(socket); // so afterEach can unmount
  });
});
