// Characterization of loading older messages: position, hasMore, nextCursor.
import { at, openRoom, rawMessage, renderChat, type ChatHarness } from "@/test-utils/chatHarness";
import { resetChatMocks, responders, ws, type FakeSocket } from "@/test-utils/chatMocks";
import type { ChatAck } from "@/types/chat";

jest.mock("@/contexts/WebSocketContext", () => require("@/test-utils/chatMocks").webSocketContextMock);
jest.mock("@/contexts/AuthContext", () => require("@/test-utils/chatMocks").authContextMock);
jest.mock("@/lib/authFetch", () => require("@/test-utils/chatMocks").authFetchMock);
jest.mock("@/services/chat.service", () => require("@/test-utils/chatMocks").chatServiceMock);
jest.mock("@/components/CustomToast", () => require("@/test-utils/chatMocks").toastMock);

let socket: FakeSocket;
let h: ChatHarness;

const pageFetches = () =>
  ws.emitWithAck.mock.calls.filter(([event]) => event === "fetch-messages").map(([, payload]) => payload);
const ids = () => h.messages("r1").map((m) => m._id);

/** A `fetch-messages` reply the test resolves by hand. */
function deferAck() {
  let resolve: (ack: ChatAck) => void = () => {};
  responders["fetch-messages"] = () => new Promise<ChatAck>((done) => (resolve = done));
  return (ack: ChatAck) => resolve(ack);
}

beforeEach(async () => {
  socket = resetChatMocks();
  h = await renderChat(socket);
  await openRoom(h, "r1", {
    messages: [
      rawMessage("m5", { createdAt: at(5) }),
      rawMessage("m6", { createdAt: at(6) }),
    ],
    hasMore: true,
    nextCursor: "c1",
  });
});

afterEach(() => h.unmount());

describe("loadOlderMessages", () => {
  it("requests the page before the cursor and prepends it, keeping newer messages in place", async () => {
    const answer = deferAck();
    await h.run(() => h.chat().loadOlderMessages("r1"));
    expect(pageFetches()).toEqual([
      { roomId: "r1", cursor: "c1", direction: "before", limit: 20 },
    ]);
    expect(h.room("r1")).toMatchObject({ isLoadingMore: true, loadMoreError: null });

    // A live message lands while the older page is in flight.
    await h.run(() => socket.serverEmit("chat-message", rawMessage("m7", { createdAt: at(7) })));

    await h.run(() =>
      answer({
        ok: true,
        messages: [
          rawMessage("m3", { createdAt: at(3) }),
          rawMessage("m4", { createdAt: at(4) }),
        ] as never,
        hasMore: true,
        nextCursor: "c2",
      })
    );

    expect(ids()).toEqual(["m3", "m4", "m5", "m6", "m7"]);
    expect(h.room("r1")).toMatchObject({
      hasMore: true,
      nextCursor: "c2",
      isLoadingMore: false,
      loadMoreError: null,
    });
  });

  it("clears the cursor on the last page", async () => {
    responders["fetch-messages"] = () => ({
      ok: true,
      messages: [rawMessage("m4", { createdAt: at(4) })] as never,
      hasMore: false,
    });
    await h.run(() => h.chat().loadOlderMessages("r1"));
    expect(ids()).toEqual(["m4", "m5", "m6"]);
    expect(h.room("r1")).toMatchObject({ hasMore: false, nextCursor: undefined });
  });

  it("keeps the old cursor when the server says there is more but sends none", async () => {
    responders["fetch-messages"] = () => ({
      ok: true,
      messages: [rawMessage("m4", { createdAt: at(4) })] as never,
      hasMore: true,
    });
    await h.run(() => h.chat().loadOlderMessages("r1"));
    expect(h.room("r1")).toMatchObject({ hasMore: true, nextCursor: "c1" });
  });

  it("does not stack requests while one is loading", async () => {
    deferAck();
    await h.run(() => h.chat().loadOlderMessages("r1"));
    await h.run(() => h.chat().loadOlderMessages("r1"));
    expect(pageFetches()).toHaveLength(1);
  });

  it("does nothing when there is no more history", async () => {
    responders["fetch-messages"] = () => ({ ok: true, messages: [] as never, hasMore: false });
    await h.run(() => h.chat().loadOlderMessages("r1"));
    await h.run(() => h.chat().loadOlderMessages("r1"));
    expect(pageFetches()).toHaveLength(1);
    await h.run(() => h.chat().loadOlderMessages("unknown-room"));
    expect(pageFetches()).toHaveLength(1);
  });

  it("keeps the messages and reports the error when the fetch fails, and can be retried", async () => {
    responders["fetch-messages"] = () => ({ ok: false, error: { code: "TIMEOUT", message: "Slow" } });
    await h.run(() => h.chat().loadOlderMessages("r1"));
    expect(ids()).toEqual(["m5", "m6"]);
    expect(h.room("r1")).toMatchObject({
      isLoadingMore: false,
      loadMoreError: "Slow",
      hasMore: true,
      nextCursor: "c1",
    });

    responders["fetch-messages"] = () => ({
      ok: true,
      messages: [rawMessage("m4", { createdAt: at(4) })] as never,
      hasMore: false,
    });
    await h.run(() => h.chat().loadOlderMessages("r1"));
    expect(ids()).toEqual(["m4", "m5", "m6"]);
    expect(h.room("r1")?.loadMoreError).toBeNull();
  });

  it("stops the spinner when the server reports an error for the room", async () => {
    deferAck();
    await h.run(() => h.chat().loadOlderMessages("r1"));
    await h.run(() => socket.serverEmit("error", { code: "X", roomId: "r1", message: "Oops" }));
    expect(h.room("r1")).toMatchObject({ isLoadingMore: false, loadMoreError: "Oops" });
  });

  it("drops a page that arrives after the room was closed", async () => {
    const answer = deferAck();
    await h.run(() => h.chat().loadOlderMessages("r1"));
    await h.run(() => h.chat().unselectRoom());
    await h.run(() =>
      answer({ ok: true, messages: [rawMessage("m4", { createdAt: at(4) })] as never, hasMore: false })
    );
    expect(ids()).toEqual(["m5", "m6"]);
  });
});

describe("messages-update", () => {
  it("a forward page merges messages without touching the paging state", async () => {
    await h.run(() =>
      socket.serverEmit("messages-update", {
        roomId: "r1",
        direction: "after",
        messages: [rawMessage("m7", { createdAt: at(7) })],
        hasMore: false,
      })
    );
    expect(ids()).toEqual(["m5", "m6", "m7"]);
    expect(h.room("r1")).toMatchObject({ hasMore: true, nextCursor: "c1" });
  });

  it("ignores a page for a room that is not open", async () => {
    await h.run(() =>
      socket.serverEmit("messages-update", { roomId: "r2", messages: [rawMessage("x", { roomId: "r2" })] })
    );
    expect(h.room("r2")).toBeUndefined();
  });
});
