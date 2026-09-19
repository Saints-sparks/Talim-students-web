/**
 * @jest-environment node
 */
import { readFileSync } from "fs";
import { join } from "path";
import vm from "vm";

/**
 * Runs `public/sw.js` in a sandbox that looks like a service worker scope, and
 * fires `pushsubscriptionchange` at it. This checks the worker's logic; it does
 * not talk to a real push service.
 */
const SOURCE = readFileSync(join(__dirname, "../../public/sw.js"), "utf8");
const PENDING = "/__talim_push__/pending";
const CONFIG = "/__talim_push__/config";

interface Scope {
  fire: (event: Record<string, unknown>) => Promise<void>;
  notes: Map<string, string>;
  subscribe: jest.Mock;
  postMessage: jest.Mock;
  fetch: jest.Mock;
}

/**
 * Builds the sandbox and loads the worker into it.
 *
 * @param options - What the worker's registration and clients do.
 * @returns Handles to drive and inspect the worker.
 */
function loadWorker(options: { subscribeFails?: boolean; currentSubscription?: unknown } = {}): Scope {
  const notes = new Map<string, string>();
  const cache = {
    match: async (url: string) => (notes.has(url) ? new Response(notes.get(url)) : undefined),
    put: async (url: string, response: Response) => void notes.set(url, await response.text()),
  };
  const subscribe = jest.fn(async () => {
    if (options.subscribeFails) throw new Error("permission gone");
    return { endpoint: "https://push.example/new" };
  });
  const postMessage = jest.fn();
  const fetchMock = jest.fn();
  const handlers: Record<string, (event: unknown) => void> = {};
  const self = {
    location: { origin: "https://app.example" },
    addEventListener: (type: string, handler: (event: unknown) => void) => {
      handlers[type] = handler;
    },
    registration: {
      pushManager: { getSubscription: async () => options.currentSubscription ?? null, subscribe },
      showNotification: jest.fn(),
    },
  };
  const sandbox = {
    self,
    caches: { open: async () => cache },
    clients: { matchAll: async () => [{ postMessage }], openWindow: jest.fn() },
    fetch: fetchMock,
    atob: (value: string) => Buffer.from(value, "base64").toString("binary"),
    Response,
    Uint8Array,
    URL,
    Set,
    Date,
    JSON,
    Promise,
    Array,
  };
  vm.runInNewContext(SOURCE, sandbox);

  return {
    notes,
    subscribe,
    postMessage,
    fetch: fetchMock,
    fire: async (event) => {
      let pending: Promise<unknown> = Promise.resolve();
      handlers.pushsubscriptionchange({ ...event, waitUntil: (promise: Promise<unknown>) => (pending = promise) });
      await pending;
    },
  };
}

const note = (scope: Scope, url: string) => JSON.parse(scope.notes.get(url) ?? "null");

describe("service worker: pushsubscriptionchange", () => {
  it("keeps the browser's new subscription, notes the old endpoint and pings open tabs", async () => {
    const worker = loadWorker();

    await worker.fire({
      oldSubscription: { endpoint: "https://push.example/old" },
      newSubscription: { endpoint: "https://push.example/new" },
    });

    expect(worker.subscribe).not.toHaveBeenCalled();
    expect(note(worker, PENDING).staleEndpoints).toEqual(["https://push.example/old"]);
    expect(worker.postMessage).toHaveBeenCalledWith({ type: "PUSH_SUBSCRIPTION_CHANGED" });
  });

  it("re-subscribes with the old subscription's key when the browser gave no new one", async () => {
    const worker = loadWorker();
    const key = new Uint8Array([1, 2, 3]);

    await worker.fire({ oldSubscription: { endpoint: "https://push.example/old", options: { applicationServerKey: key } } });

    expect(worker.subscribe).toHaveBeenCalledWith({ userVisibleOnly: true, applicationServerKey: key });
    expect(note(worker, PENDING).staleEndpoints).toEqual(["https://push.example/old"]);
  });

  it("falls back to the key the page saved, when the old subscription carries none", async () => {
    const worker = loadWorker();
    worker.notes.set(CONFIG, JSON.stringify({ vapidKey: "AQID" })); // bytes 1, 2, 3

    await worker.fire({});

    const [{ applicationServerKey }] = worker.subscribe.mock.calls[0] as unknown as [{ applicationServerKey: Uint8Array }];
    expect(Array.from(applicationServerKey)).toEqual([1, 2, 3]);
  });

  it("fetches the public key from the API as a last resort, plain or enveloped", async () => {
    const worker = loadWorker();
    worker.notes.set(CONFIG, JSON.stringify({ apiBaseUrl: "https://api.example" }));
    worker.fetch.mockResolvedValue({ ok: true, json: async () => ({ success: true, data: { publicKey: "AQID" } }) });

    await worker.fire({});

    expect(worker.fetch).toHaveBeenCalledWith("https://api.example/notifications/web-push/vapid-public-key");
    expect(worker.subscribe).toHaveBeenCalled();
  });

  it("still leaves a note and pings tabs when re-subscribing fails, so the page can finish on load", async () => {
    const worker = loadWorker({ subscribeFails: true });

    await expect(
      worker.fire({ oldSubscription: { endpoint: "https://push.example/old", options: { applicationServerKey: new Uint8Array([1]) } } }),
    ).resolves.toBeUndefined();

    expect(note(worker, PENDING).staleEndpoints).toEqual(["https://push.example/old"]);
    expect(worker.postMessage).toHaveBeenCalledWith({ type: "PUSH_SUBSCRIPTION_CHANGED" });
  });

  it("does not lose an earlier unfinished rotation, and never lists the live endpoint as stale", async () => {
    const worker = loadWorker();
    worker.notes.set(PENDING, JSON.stringify({ staleEndpoints: ["https://push.example/first", "https://push.example/new"] }));

    await worker.fire({
      oldSubscription: { endpoint: "https://push.example/second" },
      newSubscription: { endpoint: "https://push.example/new" },
    });

    expect(note(worker, PENDING).staleEndpoints.sort()).toEqual(["https://push.example/first", "https://push.example/second"]);
  });
});
