/**
 * Sign-out must remove this browser's push subscription on the server even
 * though the session has already been cleared, so the token captured before
 * sign-out is passed explicitly rather than read from the store.
 */
import { LEGACY_STORAGE_KEY, pushFlagKey, unsubscribeBrowserPush } from "@/lib/webPush";
import { api } from "@/lib/authFetch";

jest.mock("@/lib/authFetch", () => ({
  api: { delete: jest.fn().mockResolvedValue({}), patch: jest.fn().mockResolvedValue({}) },
}));

const unsubscribe = jest.fn().mockResolvedValue(true);

function stubPushSupport(endpoint: string | null): void {
  Object.defineProperty(window, "PushManager", { value: class {}, configurable: true });
  Object.defineProperty(window, "Notification", { value: class {}, configurable: true });
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: {
      getRegistration: jest.fn().mockResolvedValue({
        pushManager: {
          getSubscription: jest.fn().mockResolvedValue(endpoint ? { endpoint, unsubscribe } : null),
        },
      }),
    },
  });
}

describe("unsubscribeBrowserPush", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("clears the per-user and legacy flags even when there is no subscription", async () => {
    stubPushSupport(null);
    localStorage.setItem(pushFlagKey("u1"), "true");
    localStorage.setItem(LEGACY_STORAGE_KEY, "true");

    await unsubscribeBrowserPush("token", "u1");

    expect(localStorage.getItem(pushFlagKey("u1"))).toBeNull();
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull();
    expect(api.delete).not.toHaveBeenCalled();
  });

  it("deletes the server subscription with the captured token, without refreshing", async () => {
    stubPushSupport("https://push.example/abc");

    await unsubscribeBrowserPush("captured-token", "u1");

    expect(api.delete).toHaveBeenCalledTimes(1);
    const [url, config] = (api.delete as jest.Mock).mock.calls[0];
    expect(url).toContain("/notifications/web-push/subscribe");
    expect(config.accessToken).toBe("captured-token");
    expect(config.retryOnUnauthorized).toBe(false);
    expect(JSON.parse(config.body)).toEqual({ endpoint: "https://push.example/abc" });
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("still unsubscribes locally when there is no token to tell the server with", async () => {
    stubPushSupport("https://push.example/abc");

    await unsubscribeBrowserPush(null, "u1");

    expect(api.delete).not.toHaveBeenCalled();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("never throws, so sign-out cannot fail because of push cleanup", async () => {
    stubPushSupport("https://push.example/abc");
    (api.delete as jest.Mock).mockRejectedValueOnce(new Error("offline"));

    await expect(unsubscribeBrowserPush("t", "u1")).resolves.toBeUndefined();
  });
});
