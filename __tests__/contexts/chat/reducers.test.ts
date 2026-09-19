// The chat store's pure transitions, without React or a socket.
import { normalizeMessage } from "@/lib/chat";
import {
  buildRoomList,
  clearUnread,
  totalUnreadOf,
  userIdsOf,
  withActivity,
  withReadAt,
  withRoomRead,
} from "@/contexts/chat/listReducers";
import {
  buildOutgoing,
  buildSendPayload,
  discardAllEntries,
  discardEntry,
  discardRoomEntries,
  storedFromAck,
} from "@/contexts/chat/outbox";
import {
  emptyRoomState,
  failMessage,
  joinFailurePatch,
  joinedPatch,
  leavePatch,
  pagePatch,
  retryingMessage,
  withUploadProgress,
  withoutMessage,
} from "@/contexts/chat/roomReducers";
import type { OutboxEntry } from "@/contexts/chat/types";
import type { RealtimeChatRoom } from "@/types/chat";

const message = (id: string, minutes: number, extra: Record<string, unknown> = {}) =>
  normalizeMessage({
    _id: id,
    roomId: "r1",
    senderId: "user-2",
    text: id,
    createdAt: new Date(Date.UTC(2026, 8, 13, 10, minutes)).toISOString(),
    ...extra,
  });

describe("roomReducers", () => {
  it("joinedPatch takes paging state from the server only on a first load", () => {
    const room = { ...emptyRoomState("r1"), hasMore: true, nextCursor: "mine" };
    const data = { roomId: "r1", hasMore: false, nextCursor: "theirs" };
    expect(joinedPatch(room, data, [], true)).toMatchObject({ hasMore: false, nextCursor: "theirs" });
    expect(joinedPatch(room, data, [], false)).toMatchObject({ hasMore: true, nextCursor: "mine" });
    expect(joinedPatch(emptyRoomState("r1"), data, [], false).nextCursor).toBe("theirs");
  });

  it("pagePatch leaves paging alone for a forward page and moves it for an older one", () => {
    const room = { ...emptyRoomState("r1"), hasMore: true, nextCursor: "c1", isLoadingMore: true };
    expect(pagePatch(room, { direction: "after" }, [])).not.toHaveProperty("hasMore");
    expect(pagePatch(room, { direction: "before", hasMore: false }, [])).toMatchObject({
      hasMore: false,
      nextCursor: undefined,
      isLoadingMore: false,
    });
    expect(pagePatch(room, { direction: "before", hasMore: true }, []).nextCursor).toBe("c1");
  });

  it("failed, retrying and removed bubbles touch only the named local message", () => {
    const list = [message("m1", 1), message("local:x", 2, { _id: "local:x", status: "pending" })];
    const failed = failMessage(list, "local:x");
    expect(failed[1]).toMatchObject({ status: "failed", error: "Not sent" });
    expect(failed[0]).toBe(list[0]);
    expect(retryingMessage(failed, "local:x")[1]).toMatchObject({ status: "pending", error: undefined });
    expect(withoutMessage(list, "local:x")).toHaveLength(1);
    expect(withUploadProgress(list, "local:x", 1, 0.5)[1].uploadProgress).toEqual([undefined, 0.5]);
  });

  it("leaving keeps a ready room ready and idles the rest; a failed join maps NOT_FOUND", () => {
    expect(leavePatch({ ...emptyRoomState("r"), status: "ready" })).toMatchObject({ status: "ready" });
    expect(leavePatch({ ...emptyRoomState("r"), status: "joining" })).toMatchObject({ status: "idle" });
    expect(joinFailurePatch("NOT_FOUND").error).toBe("This chat isn't available to you.");
    expect(joinFailurePatch().error).toBe("Couldn't load this chat");
  });
});

describe("listReducers", () => {
  const room = (id: string, extra: Partial<RealtimeChatRoom> = {}) =>
    ({ roomId: id, unreadCount: 0, updatedAt: "2026-09-13T10:00:00.000Z", participants: [], ...extra }) as RealtimeChatRoom;

  it("collects the user's ids without duplicates", () => {
    expect(userIdsOf({ userId: "a", id: "a", _id: "b" })).toEqual(["a", "b"]);
    expect(userIdsOf(null)).toEqual([]);
  });

  it("clearUnread and withReadAt keep the same array when nothing changes and never move a read back", () => {
    const rooms = [room("r1"), room("r2", { unreadCount: 2, lastReadAt: "2026-09-13T10:05:00.000Z" })];
    expect(clearUnread(rooms, "r1")).toBe(rooms);
    expect(clearUnread(rooms, "r2")[1].unreadCount).toBe(0);
    expect(withReadAt(rooms, "r2", "2026-09-13T10:01:00.000Z")[1].lastReadAt).toBe("2026-09-13T10:05:00.000Z");
    expect(withReadAt(rooms, "r2", "2026-09-13T10:09:00.000Z")[1].lastReadAt).toBe("2026-09-13T10:09:00.000Z");
  });

  it("withActivity bumps unread for others only, and sorts the newest to the top", () => {
    const rooms = [room("r1", { updatedAt: "2026-09-13T10:02:00.000Z" }), room("r2")];
    const activity = {
      roomId: "r2",
      lastMessage: { _id: "m", senderId: "u2", senderName: "B", type: "text" as const, preview: "hi", createdAt: "2026-09-13T10:09:00.000Z" },
    };
    const theirs = withActivity(rooms, activity, false, false);
    expect(theirs.map((r) => r.roomId)).toEqual(["r2", "r1"]);
    expect(theirs[0].unreadCount).toBe(1);
    expect(withActivity(rooms, activity, true, false)[0].unreadCount).toBe(0);
    expect(withActivity(rooms, activity, false, true)[0].unreadCount).toBe(0);
  });

  it("buildRoomList zeroes only the open room, and totalUnreadOf sums the badges", () => {
    const list = buildRoomList(
      [
        { _id: "r1", type: "custom_group", unreadCount: 3 },
        { _id: "r2", type: "custom_group", unreadCount: 2 },
      ],
      ["u1"],
      "r1"
    );
    expect(list.find((r) => r.roomId === "r1")?.unreadCount).toBe(0);
    expect(totalUnreadOf(list)).toBe(2);
  });

  it("withRoomRead keeps the badge when a newer message exists", () => {
    const rooms = [
      room("r1", { unreadCount: 2, lastMessage: { content: "", senderId: "", senderName: "", type: "text", timestamp: "2026-09-13T10:05:00.000Z" } }),
    ];
    expect(withRoomRead(rooms, "r1", { roomId: "r1", readAt: "2026-09-13T10:01:00.000Z" })[0].unreadCount).toBe(2);
    expect(withRoomRead(rooms, "r1", { roomId: "r1", readAt: "2026-09-13T10:06:00.000Z" })[0].unreadCount).toBe(0);
  });
});

describe("outbox", () => {
  const sender = { userId: "u1", firstName: "Ada", lastName: "Nwosu" };

  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => "blob:p");
    URL.revokeObjectURL = jest.fn();
  });

  it("builds nothing for an empty message and an error for a refused file", () => {
    expect(buildOutgoing("r1", "  ", {}, sender)).toBeNull();
    expect(buildOutgoing("", "hi", {}, sender)).toBeNull();
    const bad = buildOutgoing("r1", "", { files: [new File(["x"], "a.exe")] }, sender);
    expect(bad).toEqual({ error: expect.stringContaining("a.exe") });
  });

  it("builds a text bubble with no outbox entry and a plain payload", () => {
    const built = buildOutgoing("r1", " hi ", {}, sender);
    if (!built || "error" in built) throw new Error("expected a message");
    expect(built.entry).toBeUndefined();
    expect(built.pending).toMatchObject({ text: "hi", status: "pending", senderName: "Ada Nwosu" });
    expect(buildSendPayload("r1", built.clientMessageId, built.pending, undefined, [])).toEqual({
      roomId: "r1",
      text: "hi",
      type: "text",
      clientMessageId: built.clientMessageId,
    });
  });

  it("builds a voice note with a preview, progress slots and its duration in the payload", () => {
    const built = buildOutgoing("r1", "", { voice: { file: new File(["x"], "n.webm", { type: "audio/webm" }), duration: 7 } }, sender);
    if (!built || "error" in built || !built.entry) throw new Error("expected a voice message");
    expect(built.pending).toMatchObject({ type: "voice", uploadProgress: [0], duration: 7 });
    expect(built.entry.previewUrls).toEqual(["blob:p"]);
    expect(buildSendPayload("r1", built.clientMessageId, built.pending, built.entry, [])).toMatchObject({
      type: "voice",
      duration: 7,
    });
  });

  it("discards entries and revokes their previews, sparing sends in flight", () => {
    const entry = (roomId: string): OutboxEntry => ({ roomId, type: "image", items: [], previewUrls: ["blob:a"] });
    const outbox = new Map([["c1", entry("r1")], ["c2", entry("r1")], ["c3", entry("r2")]]);
    discardEntry(outbox, "c1");
    expect(outbox.has("c1")).toBe(false);
    discardRoomEntries(outbox, "r1", new Set(["c2"]));
    expect(outbox.has("c2")).toBe(true); // in flight
    discardAllEntries(outbox);
    expect(outbox.size).toBe(0);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(3);
  });

  it("storedFromAck keeps the server's clientMessageId, else the one sent", () => {
    expect(storedFromAck({ _id: "m1" }, "cid").clientMessageId).toBe("cid");
    expect(storedFromAck({ _id: "m1", clientMessageId: "theirs" }, "cid").clientMessageId).toBe("theirs");
  });
});
