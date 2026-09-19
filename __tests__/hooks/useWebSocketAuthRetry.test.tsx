// The socket refreshes the access token once per rejected handshake, and gives
// up (status "error") rather than looping when the server still refuses.
import { act, renderHook } from "@testing-library/react";
import { io } from "socket.io-client";
import { refreshAccessToken } from "@/lib/authFetch";
import { useWebSocket } from "@/hooks/useWebSocket";

jest.mock("socket.io-client", () => ({ io: jest.fn() }));
jest.mock("@/lib/authFetch", () => ({ refreshAccessToken: jest.fn() }));

type Listener = (...args: unknown[]) => void;

/** A socket.io client that lets the test play the server. */
class StubSocket {
  connected = false;
  active = false;
  connect = jest.fn(() => {
    this.active = true;
  });
  disconnect = jest.fn();
  removeAllListeners = jest.fn();
  acks: Array<(err: unknown, ack?: unknown) => void> = [];
  private handlers = new Map<string, Listener[]>();
  io = { on: jest.fn(), removeAllListeners: jest.fn() };

  on(event: string, listener: Listener) {
    this.handlers.set(event, [...(this.handlers.get(event) ?? []), listener]);
    return this;
  }
  timeout() {
    return {
      emit: (_event: string, _payload: unknown, cb: (err: unknown, ack?: unknown) => void) => {
        this.acks.push(cb);
      },
    };
  }
  emit() {}
  fire(event: string, payload?: unknown) {
    (this.handlers.get(event) ?? []).forEach((listener) => listener(payload));
  }
}

const refresh = refreshAccessToken as jest.Mock;
let stub: StubSocket;

/** Lets the refresh promise settle inside act. */
const settle = () => act(async () => {});

beforeEach(() => {
  stub = new StubSocket();
  (io as jest.Mock).mockReturnValue(stub);
  refresh.mockReset();
  refresh.mockResolvedValue(undefined);
});

function setup() {
  const view = renderHook(() => useWebSocket());
  act(() => view.result.current.connect("user-1"));
  return view;
}

describe("unauthenticated socket errors", () => {
  it("refreshes the token once and reconnects", async () => {
    const { result } = setup();
    act(() => stub.fire("connect_error", { message: "UNAUTHENTICATED" }));
    await settle();

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(stub.connect).toHaveBeenCalledTimes(1);
    expect(result.current.connectionStatus).toBe("error");
  });

  it("does not refresh a second time while the server keeps refusing", async () => {
    const { result } = setup();
    act(() => stub.fire("connect_error", { message: "UNAUTHENTICATED" }));
    await settle();
    act(() => stub.fire("connect_error", { data: { code: "UNAUTHENTICATED" } }));
    await settle();
    act(() => stub.fire("exception", { code: "UNAUTHENTICATED" }));
    await settle();

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(result.current.connectionStatus).toBe("error");
  });

  it("allows another refresh once the server has accepted a request", async () => {
    setup();
    act(() => stub.fire("connect_error", { message: "UNAUTHENTICATED" }));
    await settle();

    stub.connected = true;
    act(() => stub.fire("connect"));
    act(() => stub.acks[0](null, { ok: true })); // fetch-unread-count accepted
    act(() => stub.fire("exception", { error: { code: "UNAUTHENTICATED" } }));
    await settle();

    expect(refresh).toHaveBeenCalledTimes(2);
  });

  it("when already connected, waits for the server's disconnect before reconnecting", async () => {
    setup();
    stub.connected = true;
    act(() => stub.fire("connect"));
    act(() => stub.fire("exception", { code: "UNAUTHENTICATED" }));
    await settle();
    expect(stub.connect).not.toHaveBeenCalled();

    stub.connected = false;
    act(() => stub.fire("disconnect", "io server disconnect"));
    expect(stub.connect).toHaveBeenCalledTimes(1);
  });

  it("ignores other connection errors", async () => {
    const { result } = setup();
    act(() => stub.fire("connect_error", new Error("xhr poll error")));
    await settle();
    expect(refresh).not.toHaveBeenCalled();
    expect(result.current.connectionStatus).toBe("error");
  });

  it("reports an error when the refresh itself fails", async () => {
    refresh.mockRejectedValue(new Error("expired"));
    const { result } = setup();
    act(() => stub.fire("connect_error", { message: "UNAUTHENTICATED" }));
    await settle();
    expect(stub.connect).not.toHaveBeenCalled();
    expect(result.current.connectionStatus).toBe("error");
  });

  it("emitWithAck answers offline without touching the socket", async () => {
    const { result } = setup();
    let ack: unknown;
    await act(async () => {
      ack = await result.current.emitWithAck("fetch-chat-rooms", {});
    });
    expect(ack).toMatchObject({ ok: false, error: { code: "OFFLINE" } });
  });
});
