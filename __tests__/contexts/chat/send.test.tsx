// Characterization of the chat store's send path: optimistic bubble, ack merge,
// failure and retry, and the outbox that survives going offline.
import { openRoom, rawMessage, renderChat, type ChatHarness } from "@/test-utils/chatHarness";
import { chatServiceMock, resetChatMocks, toastMock, type FakeSocket } from "@/test-utils/chatMocks";

jest.mock("@/contexts/WebSocketContext", () => require("@/test-utils/chatMocks").webSocketContextMock);
jest.mock("@/contexts/AuthContext", () => require("@/test-utils/chatMocks").authContextMock);
jest.mock("@/lib/authFetch", () => require("@/test-utils/chatMocks").authFetchMock);
jest.mock("@/services/chat.service", () => require("@/test-utils/chatMocks").chatServiceMock);
jest.mock("@/components/CustomToast", () => require("@/test-utils/chatMocks").toastMock);

/** Fake only the clock, so bubbles get distinct times and React/promises keep running. */
const useClock = () =>
  jest.useFakeTimers({
    now: new Date("2026-09-13T12:00:00.000Z"),
    doNotFake: [
      "nextTick",
      "queueMicrotask",
      "setImmediate",
      "clearImmediate",
      "setInterval",
      "clearInterval",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "requestIdleCallback",
      "cancelIdleCallback",
      "hrtime",
      "performance",
    ],
  });

let socket: FakeSocket;
let h: ChatHarness;

const file = (name: string, type: string) => new File(["abc"], name, { type });
const sends = () => socket.sent("send-chat-message");
const payloadOf = (index: number) => sends()[index].payload as Record<string, unknown>;

beforeEach(async () => {
  useClock();
  URL.createObjectURL = jest.fn(() => "blob:preview");
  URL.revokeObjectURL = jest.fn();
  socket = resetChatMocks();
  h = await renderChat(socket);
});

afterEach(() => {
  h.unmount();
  jest.useRealTimers();
});

describe("optimistic send and ack", () => {
  it("shows a pending bubble at once and emits it with a timeout", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "  hello  "));

    const [pending] = h.messages("r1");
    expect(pending).toMatchObject({
      status: "pending",
      text: "hello",
      senderId: "user-1",
      senderName: "Ada Nwosu",
      type: "text",
    });
    expect(pending._id).toBe(`local:${pending.clientMessageId}`);
    expect(sends()[0].timeoutMs).toBe(10000);
    expect(payloadOf(0)).toEqual({
      roomId: "r1",
      text: "hello",
      type: "text",
      clientMessageId: pending.clientMessageId,
    });
  });

  it("ignores an empty message", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "   "));
    expect(h.messages("r1")).toHaveLength(0);
    expect(sends()).toHaveLength(0);
  });

  it("merges the ack into the pending bubble under the same clientMessageId", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;

    await h.run(() =>
      sends()[0].ack?.(null, {
        ok: true,
        message: rawMessage("m100", { clientMessageId, senderId: "user-1", text: "hello" }),
      })
    );

    expect(h.messages("r1")).toHaveLength(1);
    expect(h.messages("r1")[0]).toMatchObject({
      _id: "m100",
      status: "sent",
      clientMessageId,
      text: "hello",
    });
  });

  it("keeps one message when the broadcast arrives before the ack", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;
    const stored = rawMessage("m100", { clientMessageId, senderId: "user-1", text: "hello" });

    await h.run(() => socket.serverEmit("chat-message", stored));
    expect(h.messages("r1").map((m) => m._id)).toEqual(["m100"]);

    await h.run(() => sends()[0].ack?.(null, { ok: true, message: stored }));
    expect(h.messages("r1").map((m) => m._id)).toEqual(["m100"]);
    expect(h.messages("r1")[0].status).toBe("sent");
  });

  it("fills in the clientMessageId when the stored copy lacks it", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;

    await h.run(() =>
      sends()[0].ack?.(null, { ok: true, message: rawMessage("m100", { senderId: "user-1" }) })
    );

    expect(h.messages("r1")).toHaveLength(1);
    expect(h.messages("r1")[0]).toMatchObject({ _id: "m100", clientMessageId });
  });

  it("does not emit a message twice while its first send is unanswered", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;

    await h.run(() => h.chat().retryMessage("r1", clientMessageId));
    await h.run(() => socket.serverEmit("connect"));

    expect(sends()).toHaveLength(1);
  });
});

describe("failed sends", () => {
  it("keeps a rejected message as failed with the server's reason", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    await h.run(() =>
      sends()[0].ack?.(null, { ok: false, error: { code: "TOO_LONG", message: "Too long" } })
    );

    expect(h.messages("r1")).toHaveLength(1);
    expect(h.messages("r1")[0]).toMatchObject({ status: "failed", error: "Too long", text: "hello" });
  });

  it("marks a timed-out send as failed with a generic reason", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    await h.run(() => sends()[0].ack?.(new Error("timeout")));

    expect(h.messages("r1")[0]).toMatchObject({ status: "failed", error: "Not sent" });
  });

  it("retries a failed message under the same clientMessageId and clears the error", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;
    await h.run(() => sends()[0].ack?.(new Error("timeout")));

    await h.run(() => h.chat().retryMessage("r1", clientMessageId));
    expect(h.messages("r1")[0]).toMatchObject({ status: "pending", error: undefined });
    expect(sends()).toHaveLength(2);
    expect(payloadOf(1).clientMessageId).toBe(clientMessageId);

    await h.run(() =>
      sends()[1].ack?.(null, {
        ok: true,
        message: rawMessage("m100", { clientMessageId, senderId: "user-1", text: "hello" }),
      })
    );
    expect(h.messages("r1")).toHaveLength(1);
    expect(h.messages("r1")[0]).toMatchObject({ _id: "m100", status: "sent" });
  });

  it("removes a failed message on delete, but not one that is still sending", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;

    await h.run(() => h.chat().deleteFailedMessage("r1", clientMessageId));
    expect(h.messages("r1")).toHaveLength(1); // in flight: refused

    await h.run(() => sends()[0].ack?.(new Error("timeout")));
    await h.run(() => h.chat().deleteFailedMessage("r1", clientMessageId));
    expect(h.messages("r1")).toHaveLength(0);
  });

  it("fails the matching bubble on a server error event, finding the room by clientMessageId", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;

    await h.run(() =>
      socket.serverEmit("error", { code: "FORBIDDEN", message: "Muted", clientMessageId })
    );
    expect(h.messages("r1")[0]).toMatchObject({ status: "failed", error: "Muted" });
  });

  it("leaves a pending bubble alone on an UNAUTHENTICATED error (the socket refreshes the token)", async () => {
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "hello"));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;

    await h.run(() =>
      socket.serverEmit("error", { code: "UNAUTHENTICATED", message: "expired", clientMessageId })
    );
    expect(h.messages("r1")[0].status).toBe("pending");
  });
});

describe("outbox", () => {
  it("keeps offline messages pending and resends them in order on reconnect", async () => {
    await openRoom(h, "r1");
    socket.connected = false;

    await h.run(() => h.chat().sendMessage("r1", "first"));
    jest.setSystemTime(new Date("2026-09-13T12:00:01.000Z"));
    await h.run(() => h.chat().sendMessage("r1", "second"));
    jest.setSystemTime(new Date("2026-09-13T12:00:02.000Z"));
    await h.run(() => h.chat().sendMessage("r1", "third"));

    expect(h.messages("r1").map((m) => [m.text, m.status])).toEqual([
      ["first", "pending"],
      ["second", "pending"],
      ["third", "pending"],
    ]);
    expect(sends()).toHaveLength(0);

    socket.connected = true;
    await h.run(() => socket.serverEmit("connect"));

    expect(sends().map((_, i) => payloadOf(i).text)).toEqual(["first", "second", "third"]);
    const ids = h.messages("r1").map((m) => m.clientMessageId);
    expect(sends().map((_, i) => payloadOf(i).clientMessageId)).toEqual(ids);
  });

  it("uploads a media message's files once connected, then sends them as attachments", async () => {
    const upload = chatServiceMock.chatService.uploadChatAttachment;
    upload.mockResolvedValue({ url: "https://cdn.test/pic.png" });
    await openRoom(h, "r1");
    socket.connected = false;

    await h.run(() => h.chat().sendMessage("r1", "look", { files: [file("pic.png", "image/png")] }));
    expect(h.messages("r1")[0]).toMatchObject({ status: "pending", type: "image", text: "look" });
    expect(h.messages("r1")[0].attachments[0].url).toBe("blob:preview");
    expect(upload).not.toHaveBeenCalled();

    socket.connected = true;
    await h.run(() => socket.serverEmit("connect"));

    expect(upload).toHaveBeenCalledTimes(1);
    expect(payloadOf(0)).toMatchObject({
      roomId: "r1",
      text: "look",
      type: "image",
      attachments: [expect.objectContaining({ url: "https://cdn.test/pic.png", type: "image" })],
    });

    const clientMessageId = h.messages("r1")[0].clientMessageId as string;
    await h.run(() =>
      sends()[0].ack?.(null, {
        ok: true,
        message: rawMessage("m100", { clientMessageId, senderId: "user-1", type: "image" }),
      })
    );
    expect(h.messages("r1")[0]).toMatchObject({ _id: "m100", status: "sent" });
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
  });

  it("fails a message whose upload fails, and a retry uploads only what failed", async () => {
    const upload = chatServiceMock.chatService.uploadChatAttachment;
    let bFails = true;
    upload.mockImplementation(async (f: File) => {
      if (f.name === "b.png" && bFails) throw new Error("Boom");
      return { url: `https://cdn.test/${f.name}` };
    });
    await openRoom(h, "r1");

    await h.run(() =>
      h.chat().sendMessage("r1", "", { files: [file("a.png", "image/png"), file("b.png", "image/png")] })
    );
    expect(h.messages("r1")[0]).toMatchObject({ status: "failed", error: "Boom" });
    expect(sends()).toHaveLength(0);
    expect(upload).toHaveBeenCalledTimes(2);

    bFails = false;
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;
    await h.run(() => h.chat().retryMessage("r1", clientMessageId));

    expect(upload).toHaveBeenCalledTimes(3);
    expect(upload.mock.calls[2][0].name).toBe("b.png");
    const attachments = payloadOf(0).attachments as Array<{ url: string }>;
    expect(attachments.map((a) => a.url)).toEqual(["https://cdn.test/a.png", "https://cdn.test/b.png"]);
  });

  it("frees the previews when a failed media message is deleted", async () => {
    chatServiceMock.chatService.uploadChatAttachment.mockRejectedValue(new Error("Boom"));
    await openRoom(h, "r1");
    await h.run(() => h.chat().sendMessage("r1", "", { files: [file("a.png", "image/png")] }));
    const clientMessageId = h.messages("r1")[0].clientMessageId as string;

    await h.run(() => h.chat().deleteFailedMessage("r1", clientMessageId));
    expect(h.messages("r1")).toHaveLength(0);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
  });

  it("rejects too many files and bad files without creating a bubble", async () => {
    const { toast } = toastMock;
    await openRoom(h, "r1");
    const many = Array.from({ length: 11 }, (_, i) => file(`p${i}.png`, "image/png"));
    await h.run(() => h.chat().sendMessage("r1", "", { files: many }));
    await h.run(() => h.chat().sendMessage("r1", "", { files: [file("virus.exe", "application/x-msdownload")] }));

    expect(toast.error).toHaveBeenCalledTimes(2);
    expect(h.messages("r1")).toHaveLength(0);
  });
});
