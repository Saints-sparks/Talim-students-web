import {
  applyMessageDeleted,
  applyMessageDeletedToRooms,
  DELETED_PREVIEW,
  normalizeMessage,
} from "@/lib/chat";
import type { RealtimeChatRoom } from "@/types/chat";

const view = (overrides: Record<string, unknown> = {}) => ({
  _id: "m1",
  roomId: "r1",
  senderId: "u1",
  sender: { name: "Ada Obi", avatar: "" },
  text: "Hello",
  type: "text",
  attachments: [],
  readBy: [],
  createdAt: "2026-09-13T10:00:00.000Z",
  ...overrides,
});

describe("replies and deleted messages", () => {
  it("reads the server's replyTo snapshot", () => {
    const message = normalizeMessage(
      view({ replyTo: { messageId: "m0", senderId: "u2", senderName: "Bola Ade", preview: "Photo", type: "image" } })
    );
    expect(message.replyTo).toEqual({
      messageId: "m0",
      senderId: "u2",
      senderName: "Bola Ade",
      preview: "Photo",
      type: "image",
    });
    expect(normalizeMessage(view()).replyTo).toBeUndefined();
    expect(normalizeMessage(view({ replyTo: { preview: "no id" } })).replyTo).toBeUndefined();
  });

  it("flags a deleted message", () => {
    expect(normalizeMessage(view({ isDeleted: true, text: "" })).isDeleted).toBe(true);
    expect(normalizeMessage(view()).isDeleted).toBeUndefined();
  });

  it("applyMessageDeleted blanks the message in place and is a no-op the second time", () => {
    const first = normalizeMessage(view({ attachments: [{ url: "https://res.cloudinary.com/x/a.png", type: "image" }] }));
    const other = normalizeMessage(view({ _id: "m2", text: "Second" }));
    const thread = [first, other];

    const next = applyMessageDeleted(thread, "m1");
    expect(next[0]).toMatchObject({ _id: "m1", text: "", attachments: [], isDeleted: true });
    expect(next[1]).toBe(other);
    expect(applyMessageDeleted(next, "m1")).toBe(next);
    expect(applyMessageDeleted(thread, "missing")).toBe(thread);
  });

  it("previews a room as deleted only when its last message was deleted", () => {
    const rooms = [
      { roomId: "r1", lastMessage: { _id: "m9", content: "See you", senderId: "u1", senderName: "Ada", timestamp: "", type: "text" } },
    ] as unknown as RealtimeChatRoom[];

    const next = applyMessageDeletedToRooms(rooms, "r1", "m9");
    expect(next[0].lastMessage?.content).toBe(DELETED_PREVIEW);
    expect(applyMessageDeletedToRooms(next, "r1", "m9")).toBe(next);
    expect(applyMessageDeletedToRooms(rooms, "r1", "m1")).toBe(rooms);
    expect(applyMessageDeletedToRooms(rooms, "other", "m9")).toBe(rooms);
  });
});
