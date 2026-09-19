// Characterization of read receipts, the room list and unread counts.
import { act } from "@testing-library/react";
import { ownMessageTick } from "@/lib/chat";
import {
  at,
  openRoom,
  rawMessage,
  rawRoom,
  renderChat,
  type ChatHarness,
} from "@/test-utils/chatHarness";
import { resetChatMocks, responders, toastMock, ws, type FakeSocket } from "@/test-utils/chatMocks";

jest.mock("@/contexts/WebSocketContext", () => require("@/test-utils/chatMocks").webSocketContextMock);
jest.mock("@/contexts/AuthContext", () => require("@/test-utils/chatMocks").authContextMock);
jest.mock("@/lib/authFetch", () => require("@/test-utils/chatMocks").authFetchMock);
jest.mock("@/services/chat.service", () => require("@/test-utils/chatMocks").chatServiceMock);
jest.mock("@/components/CustomToast", () => require("@/test-utils/chatMocks").toastMock);

let socket: FakeSocket;
let h: ChatHarness;
let focused: jest.SpyInstance<boolean, []>;

const room = (id: string) => h.chat().chatRooms.find((r) => r.roomId === id);
const markReads = () =>
  ws.emitWithAck.mock.calls.filter(([event]) => event === "mark-room-read").map(([, payload]) => payload);

const activity = (roomId: string, senderId: string, minutes: number, _id = `a${minutes}`) => ({
  roomId,
  lastMessage: {
    _id,
    senderId,
    senderName: "Someone",
    type: "text",
    preview: `preview ${_id}`,
    createdAt: at(minutes),
  },
});

beforeEach(async () => {
  focused = jest.spyOn(document, "hasFocus").mockReturnValue(true);
  socket = resetChatMocks();
  h = await renderChat(socket);
});

afterEach(() => {
  h.unmount();
  focused.mockRestore();
});

describe("messages-read receipts", () => {
  const mine = (id: string, minutes: number) =>
    rawMessage(id, { senderId: "user-1", createdAt: at(minutes) });

  it("adds the reader to my messages created at or before the read time", async () => {
    await openRoom(h, "r1", {
      room: rawRoom("r1"),
      messages: [mine("m1", 1), mine("m2", 2), mine("m3", 3), rawMessage("m4", { createdAt: at(1) })],
    });
    await h.run(() =>
      socket.serverEmit("messages-read", { roomId: "r1", userId: "user-2", readAt: at(2) })
    );

    const byId = Object.fromEntries(h.messages("r1").map((m) => [m._id, m]));
    expect(byId.m1.readBy).toEqual(["user-2"]);
    expect(byId.m2.readBy).toEqual(["user-2"]);
    expect(byId.m3.readBy).toEqual([]); // sent after the read position
    expect(byId.m4.readBy).toEqual([]); // the reader's own message

    // The tick follows: direct messages show "read" once the other person read them.
    expect(ownMessageTick(byId.m1, "one_to_one", ["user-2"])).toBe("read");
    expect(ownMessageTick(byId.m3, "one_to_one", ["user-2"])).toBe("sent");
  });

  it("is idempotent and ignores unknown rooms and incomplete events", async () => {
    await openRoom(h, "r1", { messages: [mine("m1", 1)] });
    const event = { roomId: "r1", userId: "user-2", readAt: at(5) };
    await h.run(() => socket.serverEmit("messages-read", event));
    const first = h.messages("r1");
    await h.run(() => socket.serverEmit("messages-read", event));
    expect(h.messages("r1")).toBe(first);

    await h.run(() => socket.serverEmit("messages-read", { roomId: "nope", userId: "u", readAt: at(5) }));
    await h.run(() => socket.serverEmit("messages-read", { roomId: "r1", readAt: at(5) }));
    await h.run(() => socket.serverEmit("messages-read", { roomId: "r1", userId: "user-2" }));
    expect(h.messages("r1")).toBe(first);
  });
});

describe("marking the open room read", () => {
  beforeEach(async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", { rooms: [rawRoom("r1", { unreadCount: 3 })] })
    );
  });

  it("sends one mark-room-read for the newest message from someone else, never twice", async () => {
    await openRoom(h, "r1", {
      room: rawRoom("r1", { unreadCount: 3 }),
      messages: [rawMessage("m1", { createdAt: at(1) }), rawMessage("m2", { createdAt: at(2) })],
    });
    expect(markReads()).toEqual([{ roomId: "r1", upToMessageId: "m2" }]);
    expect(room("r1")?.unreadCount).toBe(0);
    expect(room("r1")?.lastReadAt).toBe(at(2)); // from the message when the ack has no readAt

    await h.run(() => socket.serverEmit("messages-update", { roomId: "r1", messages: [], direction: "after" }));
    expect(markReads()).toHaveLength(1);

    await h.run(() => socket.serverEmit("chat-message", rawMessage("m3", { createdAt: at(3) })));
    expect(markReads()).toEqual([
      { roomId: "r1", upToMessageId: "m2" },
      { roomId: "r1", upToMessageId: "m3" },
    ]);
  });

  it("does not mark my own message as needing a read", async () => {
    await openRoom(h, "r1", { messages: [rawMessage("m1", { senderId: "user-1", createdAt: at(1) })] });
    await h.run(() =>
      socket.serverEmit("chat-message", rawMessage("m2", { senderId: "user-1", createdAt: at(2) }))
    );
    expect(markReads()).toHaveLength(0);
  });

  it("retries after a failed mark-room-read on the next trigger", async () => {
    responders["mark-room-read"] = () => ({ ok: false, error: { code: "X", message: "no" } });
    await openRoom(h, "r1", { messages: [rawMessage("m1", { createdAt: at(1) })] });
    expect(markReads()).toHaveLength(1);

    responders["mark-room-read"] = () => ({ ok: true, readAt: at(9) });
    await h.run(() => socket.serverEmit("messages-update", { roomId: "r1", messages: [], direction: "after" }));
    expect(markReads()).toHaveLength(2);
    expect(room("r1")?.lastReadAt).toBe(at(9));
  });

  it("waits while the window is unfocused, then marks on focus", async () => {
    focused.mockReturnValue(false);
    await openRoom(h, "r1", { messages: [rawMessage("m1", { createdAt: at(1) })] });
    expect(markReads()).toHaveLength(0);

    focused.mockReturnValue(true);
    await act(async () => {
      window.dispatchEvent(new Event("focus"));
    });
    expect(markReads()).toEqual([{ roomId: "r1", upToMessageId: "m1" }]);
  });
});

describe("chat-rooms-update", () => {
  it("sorts rooms newest first by last message time", async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", {
        rooms: [
          rawRoom("old", { updatedAt: at(1) }),
          rawRoom("new", { updatedAt: at(9) }),
          rawRoom("mid", {
            updatedAt: at(0),
            lastMessage: { senderId: "user-2", senderName: "B", type: "text", preview: "hi", createdAt: at(5) },
          }),
        ],
      })
    );
    expect(h.chat().chatRooms.map((r) => r.roomId)).toEqual(["new", "mid", "old"]);
    expect(h.chat().isLoading).toBe(false);
    expect(h.chat().error).toBeNull();
  });

  it("zeroes the unread count of the open room only", async () => {
    await openRoom(h, "r1");
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", {
        rooms: [rawRoom("r1", { unreadCount: 4 }), rawRoom("r2", { unreadCount: 2 })],
      })
    );
    expect(room("r1")?.unreadCount).toBe(0);
    expect(room("r2")?.unreadCount).toBe(2);
  });

  it("keeps the open room's badge while the window is not focused", async () => {
    await openRoom(h, "r1");
    focused.mockReturnValue(false);
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", { rooms: [rawRoom("r1", { unreadCount: 4 })] })
    );
    expect(room("r1")?.unreadCount).toBe(4);
  });

  it("reports invalid data", async () => {
    await h.run(() => socket.serverEmit("chat-rooms-update", { rooms: "nope" }));
    expect(h.chat().error).toBe("Invalid chat rooms data received");
    expect(h.chat().isLoading).toBe(false);
  });
});

describe("unread counts", () => {
  beforeEach(async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", {
        rooms: [rawRoom("r1", { updatedAt: at(1) }), rawRoom("r2", { updatedAt: at(2), unreadCount: 1 })],
      })
    );
  });

  it("sums the rooms until the server reports a total", async () => {
    expect(h.chat().totalUnread).toBe(1);
    await h.run(() => socket.serverEmit("unread-messages-update", { unreadCount: 7 }));
    expect(h.chat().totalUnread).toBe(7);
    await h.run(() => socket.serverEmit("unread-messages-update", { unreadCount: "x" }));
    expect(h.chat().totalUnread).toBe(7);
  });

  it("chat-room-activity counts someone else's message in a closed room and moves it to the top", async () => {
    await h.run(() => socket.serverEmit("chat-room-activity", activity("r1", "user-2", 10)));
    expect(room("r1")).toMatchObject({ unreadCount: 1, updatedAt: at(10) });
    expect(room("r1")?.lastMessage).toMatchObject({ content: "preview a10", senderId: "user-2" });
    expect(h.chat().chatRooms.map((r) => r.roomId)).toEqual(["r1", "r2"]);
  });

  it("does not count my own message, nor one in the open room I am looking at", async () => {
    await h.run(() => socket.serverEmit("chat-room-activity", activity("r1", "user-1", 10)));
    expect(room("r1")?.unreadCount).toBe(0);

    await openRoom(h, "r2");
    await h.run(() => socket.serverEmit("chat-room-activity", activity("r2", "user-2", 11)));
    expect(room("r2")?.unreadCount).toBe(0);
  });

  it("refreshes the list for activity in a room it does not know", async () => {
    const before = ws.emitWithAck.mock.calls.length;
    await h.run(() => socket.serverEmit("chat-room-activity", activity("stranger", "user-2", 10)));
    expect(ws.emitWithAck.mock.calls.length).toBe(before + 1);
    expect(ws.emitWithAck.mock.calls[before][0]).toBe("fetch-chat-rooms");
  });

  it("room-read from another device clears the badge unless a newer message exists", async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", {
        rooms: [
          rawRoom("r1", {
            unreadCount: 2,
            lastMessage: { senderId: "user-2", senderName: "B", type: "text", preview: "x", createdAt: at(5) },
          }),
        ],
      })
    );
    await h.run(() => socket.serverEmit("room-read", { roomId: "r1", readAt: at(3) }));
    expect(room("r1")).toMatchObject({ unreadCount: 2, lastReadAt: at(3) });
    await h.run(() => socket.serverEmit("room-read", { roomId: "r1", readAt: at(6) }));
    expect(room("r1")).toMatchObject({ unreadCount: 0, lastReadAt: at(6) });
  });
});

describe("message-deleted", () => {
  it("blanks the message and previews the room as deleted when it was the last one", async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", {
        rooms: [
          rawRoom("r1", {
            lastMessage: {
              _id: "m1", senderId: "user-2", senderName: "B", type: "text", preview: "hi", createdAt: at(1),
            } as never,
          }),
        ],
      })
    );
    await openRoom(h, "r1", { messages: [rawMessage("m1", { createdAt: at(1) })] });
    await h.run(() => socket.serverEmit("message-deleted", { roomId: "r1", messageId: "m1" }));

    expect(h.messages("r1")[0]).toMatchObject({ text: "", isDeleted: true });
    expect(room("r1")?.lastMessage?.content).toBe("This message was deleted");
  });
});

describe("removal from a room", () => {
  it("drops the room, its state and the open selection, and tells listeners", async () => {
    const listener = jest.fn();
    let off: () => void = () => {};
    await h.run(() => {
      off = h.chat().onRoomRemoved(listener);
    });
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", { rooms: [rawRoom("r1", { type: "custom_group" })] })
    );
    await openRoom(h, "r1");

    await h.run(() =>
      socket.serverEmit("participants-changed", { roomId: "r1", removed: ["user-1"], by: "user-9" })
    );

    expect(h.chat().chatRooms).toHaveLength(0);
    expect(h.room("r1")).toBeUndefined();
    expect(h.chat().selectedRoomId).toBeNull();
    expect(listener).toHaveBeenCalledWith("r1", "removed");
    expect(toastMock.toast.warning).toHaveBeenCalledTimes(1);
    off();
  });
});
