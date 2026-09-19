/**
 * @jest-environment jsdom
 */
import { CONFIG_URL, PENDING_URL, SYNC_CACHE, pushEndpointKey, pushFlagKey, unsubscribeBrowserPush } from "@/lib/webPush";
import { reconcileWebPush, startWebPushSync } from "@/lib/webPushSync";
import { api } from "@/lib/authFetch";

jest.mock("@/lib/authFetch", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

// jsdom ships no fetch primitives; the shared-cache notes are stored as Responses.
if (typeof globalThis.Response === "undefined") {
  class TestResponse {
    constructor(private readonly body: string) {}
    text = async () => this.body;
    json = async () => JSON.parse(this.body);
  }
  Object.defineProperty(globalThis, "Response", { value: TestResponse, configurable: true });
}

const USER = "u1";
const requestMock = api.delete as jest.Mock;
const postMock = api.post as jest.Mock;
const getMock = api.get as jest.Mock;

/** An in-memory stand-in for `caches`, holding JSON notes by URL. */
function fakeCaches(): { notes: Map<string, string>; api: unknown } {
  const notes = new Map<string, string>();
  const cache = {
    match: async (url: string) => (notes.has(url) ? new Response(notes.get(url)) : undefined),
    put: async (url: string, response: Response) => void notes.set(url, await response.text()),
    delete: async (url: string) => notes.delete(url),
  };
  return { notes, api: { open: async (name: string) => (name === SYNC_CACHE ? cache : Promise.reject(new Error(name))) } };
}

interface Browser {
  subscription: { endpoint: string; toJSON: () => unknown; unsubscribe: jest.Mock } | null;
  subscribe: jest.Mock;
  requestPermission: jest.Mock;
  notes: Map<string, string>;
  messageListeners: Array<(event: MessageEvent) => void>;
}

/** Makes `navigator.serviceWorker`, `PushManager`, `Notification` and `caches` behave like a push-capable browser. */
function stubBrowser(options: { permission: NotificationPermission; endpoint: string | null }): Browser {
  const makeSub = (endpoint: string) => ({
    endpoint,
    toJSON: () => ({ endpoint, keys: { p256dh: "p", auth: "a" } }),
    unsubscribe: jest.fn().mockResolvedValue(true),
  });
  const browser = {
    subscription: options.endpoint ? makeSub(options.endpoint) : null,
    subscribe: jest.fn(),
    requestPermission: jest.fn(),
    notes: new Map<string, string>(),
    messageListeners: [] as Array<(event: MessageEvent) => void>,
  } as Browser;
  browser.subscribe.mockImplementation(async () => {
    browser.subscription = makeSub("https://push.example/new");
    return browser.subscription;
  });

  const { notes, api: cachesApi } = fakeCaches();
  browser.notes = notes;
  Object.defineProperty(globalThis, "caches", { value: cachesApi, configurable: true });
  Object.defineProperty(window, "PushManager", { value: class {}, configurable: true });
  Object.defineProperty(window, "Notification", {
    value: { permission: options.permission, requestPermission: browser.requestPermission },
    configurable: true,
  });
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      ready: Promise.resolve(),
      getRegistration: jest.fn().mockResolvedValue({
        pushManager: { getSubscription: async () => browser.subscription, subscribe: browser.subscribe },
      }),
      register: jest.fn(),
      addEventListener: (_: string, listener: (event: MessageEvent) => void) => browser.messageListeners.push(listener),
      removeEventListener: (_: string, listener: (event: MessageEvent) => void) => {
        browser.messageListeners = browser.messageListeners.filter((l) => l !== listener);
      },
    },
  });
  Object.defineProperty(navigator, "permissions", { configurable: true, value: undefined });
  return browser;
}

/** Marks `USER` as having turned browser push on, last registered at `endpoint`. */
function optedIn(endpoint?: string): void {
  localStorage.setItem(pushFlagKey(USER), "true");
  if (endpoint) localStorage.setItem(pushEndpointKey(USER), endpoint);
}

/** The endpoints the server was told to forget. */
function forgotten(): string[] {
  return requestMock.mock.calls.map(([, config]) => JSON.parse(config.body).endpoint);
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  postMock.mockResolvedValue({});
  getMock.mockResolvedValue({ publicKey: "AQAB" });
  requestMock.mockResolvedValue({});
});

describe("reconcileWebPush", () => {
  it("does nothing for a user who never turned push on, and never prompts", async () => {
    const browser = stubBrowser({ permission: "granted", endpoint: "https://push.example/a" });

    await expect(reconcileWebPush(USER)).resolves.toBe("idle");

    expect(postMock).not.toHaveBeenCalled();
    expect(browser.requestPermission).not.toHaveBeenCalled();
  });

  it("re-registers the browser's subscription so a lost server row heals", async () => {
    const browser = stubBrowser({ permission: "granted", endpoint: "https://push.example/a" });
    optedIn("https://push.example/a");

    await expect(reconcileWebPush(USER)).resolves.toBe("healed");

    expect(postMock).toHaveBeenCalledWith("http://api.test/notifications/web-push/subscribe", {
      endpoint: "https://push.example/a",
      keys: { p256dh: "p", auth: "a" },
      userAgent: navigator.userAgent,
    });
    expect(requestMock).not.toHaveBeenCalled();
    expect(browser.requestPermission).not.toHaveBeenCalled();
  });

  it("forgets the endpoints the service worker says were rotated away, then clears the note", async () => {
    const browser = stubBrowser({ permission: "granted", endpoint: "https://push.example/b" });
    optedIn("https://push.example/a");
    // The worker left a note naming an older endpoint too (two rotations while closed).
    browser.notes.set(PENDING_URL, JSON.stringify({ staleEndpoints: ["https://push.example/z"] }));

    await reconcileWebPush(USER);

    expect(postMock).toHaveBeenCalledWith(
      "http://api.test/notifications/web-push/subscribe",
      expect.objectContaining({ endpoint: "https://push.example/b" }),
    );
    // The remembered endpoint (a) and the noted one (z) are both forgotten; the live one (b) is not.
    expect(forgotten().sort()).toEqual(["https://push.example/a", "https://push.example/z"]);
    expect(localStorage.getItem(pushEndpointKey(USER))).toBe("https://push.example/b");
    expect(browser.notes.has(PENDING_URL)).toBe(false);
  });

  it("re-subscribes silently, with the server's key, when the browser lost the subscription", async () => {
    const browser = stubBrowser({ permission: "granted", endpoint: null });
    optedIn("https://push.example/a");

    await expect(reconcileWebPush(USER)).resolves.toBe("resubscribed");

    expect(browser.subscribe).toHaveBeenCalledWith(expect.objectContaining({ userVisibleOnly: true }));
    expect(postMock).toHaveBeenCalledWith(
      "http://api.test/notifications/web-push/subscribe",
      expect.objectContaining({ endpoint: "https://push.example/new" }),
    );
    expect(forgotten()).toEqual(["https://push.example/a"]);
    expect(browser.requestPermission).not.toHaveBeenCalled();
    // The service worker is told the key so it can do this alone next time.
    expect(JSON.parse(browser.notes.get(CONFIG_URL) as string)).toMatchObject({ vapidKey: "AQAB" });
  });

  it.each<NotificationPermission>(["denied", "default"])(
    "clears the flag and the server record when permission is %s while the flag says subscribed",
    async (permission) => {
      const browser = stubBrowser({ permission, endpoint: null });
      optedIn("https://push.example/a");

      await expect(reconcileWebPush(USER)).resolves.toBe("cleared");

      expect(localStorage.getItem(pushFlagKey(USER))).toBeNull();
      expect(localStorage.getItem(pushEndpointKey(USER))).toBeNull();
      expect(forgotten()).toEqual(["https://push.example/a"]);
      expect(postMock).not.toHaveBeenCalled();
      expect(browser.requestPermission).not.toHaveBeenCalled();
    },
  );

  it("never throws: a failing API reports 'failed' and keeps the flag for the next try", async () => {
    stubBrowser({ permission: "granted", endpoint: "https://push.example/a" });
    optedIn("https://push.example/a");
    postMock.mockRejectedValueOnce(new Error("offline"));

    await expect(reconcileWebPush(USER)).resolves.toBe("failed");

    expect(localStorage.getItem(pushFlagKey(USER))).toBe("true");
  });

  it("reports unsupported browsers without touching anything", async () => {
    stubBrowser({ permission: "granted", endpoint: null });
    // @ts-expect-error simulate a browser without PushManager
    delete window.PushManager;

    await expect(reconcileWebPush(USER)).resolves.toBe("unsupported");
    expect(postMock).not.toHaveBeenCalled();
  });
});

describe("startWebPushSync", () => {
  it("reconciles on start and again when the service worker reports a rotated subscription", async () => {
    const browser = stubBrowser({ permission: "granted", endpoint: "https://push.example/a" });
    optedIn("https://push.example/a");

    const stop = startWebPushSync(USER);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(postMock).toHaveBeenCalledTimes(1);

    browser.messageListeners.forEach((listener) =>
      listener({ data: { type: "PUSH_SUBSCRIPTION_CHANGED" } } as MessageEvent),
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(postMock).toHaveBeenCalledTimes(2);

    // Unrelated messages (notification clicks) are ignored, and stopping unhooks the listener.
    browser.messageListeners.forEach((listener) => listener({ data: { type: "OPEN_URL" } } as MessageEvent));
    stop();
    expect(browser.messageListeners).toHaveLength(0);
  });
});

describe("unsubscribeBrowserPush (forced sign-out)", () => {
  it("removes the flags, unsubscribes locally and tells the server with the captured token, without refreshing", async () => {
    const browser = stubBrowser({ permission: "granted", endpoint: "https://push.example/a" });
    optedIn("https://push.example/old");
    localStorage.setItem("talim:push-subscribed", "true");
    const subscription = browser.subscription!;

    await unsubscribeBrowserPush("captured-token", USER);

    expect(localStorage.getItem(pushFlagKey(USER))).toBeNull();
    expect(localStorage.getItem(pushEndpointKey(USER))).toBeNull();
    expect(localStorage.getItem("talim:push-subscribed")).toBeNull();
    expect(subscription.unsubscribe).toHaveBeenCalled();
    expect(forgotten().sort()).toEqual(["https://push.example/a", "https://push.example/old"]);
    const [path, config] = requestMock.mock.calls[0];
    expect(path).toBe("http://api.test/notifications/web-push/subscribe");
    expect(config).toMatchObject({ accessToken: "captured-token", retryOnUnauthorized: false });
  });

  it("still cleans up locally when there is no token left to tell the server with", async () => {
    const browser = stubBrowser({ permission: "granted", endpoint: "https://push.example/a" });
    optedIn("https://push.example/a");

    await unsubscribeBrowserPush(null, USER);

    expect(requestMock).not.toHaveBeenCalled();
    expect(browser.subscription?.unsubscribe).toHaveBeenCalled();
    expect(localStorage.getItem(pushFlagKey(USER))).toBeNull();
  });

  it("never throws, so a session ending cannot fail because of push cleanup", async () => {
    stubBrowser({ permission: "granted", endpoint: "https://push.example/a" });
    requestMock.mockRejectedValue(new Error("offline"));

    await expect(unsubscribeBrowserPush("t", USER)).resolves.toBeUndefined();
  });
});
