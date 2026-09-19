// Characterization of the rest of the store: REST deletes, leaving a group,
// room details, drafts and the reset when the signed-in user changes.
import { act } from "@testing-library/react";
import {
  at,
  openRoom,
  rawMessage,
  rawRoom,
  renderChat,
  type ChatHarness,
} from "@/test-utils/chatHarness";
import {
  ME,
  auth,
  authFetchMock,
  resetChatMocks,
  toastMock,
  ws,
  type FakeSocket,
} from "@/test-utils/chatMocks";

jest.mock("@/contexts/WebSocketContext", () => require("@/test-utils/chatMocks").webSocketContextMock);
jest.mock("@/contexts/AuthContext", () => require("@/test-utils/chatMocks").authContextMock);
jest.mock("@/lib/authFetch", () => require("@/test-utils/chatMocks").authFetchMock);
jest.mock("@/services/chat.service", () => require("@/test-utils/chatMocks").chatServiceMock);
jest.mock("@/components/CustomToast", () => require("@/test-utils/chatMocks").toastMock);

let socket: FakeSocket;
let h: ChatHarness;

const response = (ok: boolean, body: unknown = {}) => ({ ok, json: async () => body }) as Response;
const room = (id: string) => h.chat().chatRooms.find((r) => r.roomId === id);

beforeEach(async () => {
  socket = resetChatMocks();
  h = await renderChat(socket);
});

afterEach(() => h.unmount());

describe("deleteStoredMessage", () => {
  beforeEach(async () => {
    await openRoom(h, "r1", { messages: [rawMessage("m1", { createdAt: at(1) })] });
  });

  it("deletes over REST and blanks the message at once", async () => {
    authFetchMock.authFetch.mockResolvedValue(response(true));
    await h.run(() => h.chat().deleteStoredMessage("r1", "m1"));

    expect(authFetchMock.authFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/chat\/messages\/m1$/),
      { method: "DELETE" }
    );
    expect(h.messages("r1")[0]).toMatchObject({ text: "", isDeleted: true });
  });

  it("rejects with the server's first message", async () => {
    authFetchMock.authFetch.mockResolvedValue(response(false, { message: ["Not yours", "other"] }));
    await expect(h.chat().deleteStoredMessage("r1", "m1")).rejects.toThrow("Not yours");
    expect(h.messages("r1")[0].isDeleted).toBeUndefined();
  });

  it("rejects with a connection message when the request itself fails", async () => {
    authFetchMock.authFetch.mockRejectedValue(new Error("offline"));
    await expect(h.chat().deleteStoredMessage("r1", "m1")).rejects.toThrow(/Check your connection/);
  });
});

describe("leaveGroup", () => {
  beforeEach(async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", {
        rooms: [
          rawRoom("g1", {
            type: "custom_group",
            name: "Chess club",
            participants: [
              { _id: "p-me", userId: "user-1", firstName: "Ada", isOnline: true },
              { _id: "p-2", userId: "user-2", firstName: "Bola", isOnline: false },
            ],
          }),
        ],
      })
    );
  });

  it("removes me by my participant id, drops the room and says so", async () => {
    authFetchMock.authFetch.mockResolvedValue(response(true));
    const listener = jest.fn();
    await h.run(() => {
      h.chat().onRoomRemoved(listener);
    });
    let result: { ok: boolean; message?: string } | undefined;
    await h.run(async () => {
      result = await h.chat().leaveGroup("g1");
    });

    expect(result).toEqual({ ok: true });
    expect(authFetchMock.authFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/chat\/rooms\/g1\/participants\/p-me\/remove$/),
      { method: "PATCH" }
    );
    expect(room("g1")).toBeUndefined();
    expect(toastMock.toast.info).toHaveBeenCalledWith("You left Chess club");
    expect(listener).toHaveBeenCalledWith("g1", "left");
  });

  it("reports the server's reason and keeps the room when it refuses", async () => {
    authFetchMock.authFetch.mockResolvedValue(response(false, { message: "Owners cannot leave" }));
    let result: { ok: boolean; message?: string } | undefined;
    await h.run(async () => {
      result = await h.chat().leaveGroup("g1");
    });
    expect(result).toEqual({ ok: false, message: "Owners cannot leave" });
    expect(room("g1")).toBeDefined();
  });
});

describe("room details", () => {
  it("room-updated renames a group in the list and in the open room", async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", {
        rooms: [rawRoom("g1", { type: "custom_group", name: "Old", description: "d" })],
      })
    );
    await openRoom(h, "g1", { roomName: "Old" });
    await h.run(() =>
      socket.serverEmit("room-updated", { roomId: "g1", name: "New", description: null })
    );
    expect(room("g1")).toMatchObject({ name: "New", displayName: "New", description: "" });
    expect(h.room("g1")).toMatchObject({ roomName: "New", description: "" });
  });

  it("participants-changed replaces the members of a group in the list and the open room", async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", { rooms: [rawRoom("g1", { type: "custom_group" })] })
    );
    await openRoom(h, "g1");
    const participants = [
      { _id: "p-me", userId: "user-1", isOnline: true },
      { _id: "p-3", userId: "user-3", role: "teacher", isOnline: true },
    ];
    await h.run(() => socket.serverEmit("participants-changed", { roomId: "g1", participants }));
    expect(room("g1")?.participants).toEqual(participants);
    expect(room("g1")?.isOnline).toBe(true); // a teacher is online
    expect(h.room("g1")?.participants).toEqual(participants);
  });

  it("refreshes the list when I am added to a room it does not have", async () => {
    const before = ws.emitWithAck.mock.calls.length;
    await h.run(() =>
      socket.serverEmit("participants-changed", { roomId: "new", added: ["user-1"], by: "user-9" })
    );
    expect(ws.emitWithAck.mock.calls.length).toBe(before + 1);
  });
});

describe("drafts and reset", () => {
  it("keeps a draft per room until it is emptied", async () => {
    h.chat().setDraft("r1", "half a thought");
    expect(h.chat().getDraft("r1")).toBe("half a thought");
    expect(h.chat().getDraft("r2")).toBe("");
    h.chat().setDraft("r1", "");
    expect(h.chat().getDraft("r1")).toBe("");
  });

  it("starts from a clean slate when a different user signs in", async () => {
    await h.run(() =>
      socket.serverEmit("chat-rooms-update", { rooms: [rawRoom("r1", { unreadCount: 2 })] })
    );
    await openRoom(h, "r1", { messages: [rawMessage("m1")] });
    h.chat().setDraft("r1", "draft");
    await h.run(() => socket.serverEmit("unread-messages-update", { unreadCount: 5 }));

    auth.user = { ...ME, userId: "user-7", id: "user-7" };
    await act(async () => {
      h.rerender();
    });

    expect(h.chat().chatRooms).toEqual([]);
    expect(h.chat().roomStates).toEqual({});
    expect(h.chat().selectedRoomId).toBeNull();
    expect(h.chat().getDraft("r1")).toBe("");
    expect(h.chat().totalUnread).toBe(0);
    expect(h.chat().currentUserIds).toEqual(["user-7"]);
  });
});
