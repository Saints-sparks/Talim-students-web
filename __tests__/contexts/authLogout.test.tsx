import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, render, waitFor } from "@testing-library/react";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { accountService } from "@/services/account.service";
import { unsubscribeBrowserPush } from "@/lib/webPush";
import { makeTestQueryClient } from "@/test-utils/render";

const push = jest.fn();
// One router object, as in the app: a new one per render would re-run the
// provider's mount effect.
const router = { push, replace: jest.fn() };
jest.mock("next/navigation", () => ({ useRouter: () => router }));
jest.mock("@/services/auth.service", () => ({ authService: { introspect: jest.fn(), refresh: jest.fn() } }));
jest.mock("@/services/account.service", () => ({ accountService: { logout: jest.fn() } }));
jest.mock("@/lib/webPush", () => ({ unsubscribeBrowserPush: jest.fn() }));
jest.mock("@/lib/webPushSync", () => ({ startWebPushSync: () => () => undefined }));

const introspect = authService.introspect as jest.Mock;
const refresh = authService.refresh as jest.Mock;
const serverLogout = accountService.logout as jest.Mock;
const unsubscribe = unsubscribeBrowserPush as jest.Mock;

let ctx: ReturnType<typeof useAuthContext>;

/**
 * Exposes the auth context to the test.
 *
 * @returns Nothing visible.
 */
function Probe() {
  ctx = useAuthContext();
  return null;
}

/**
 * Mounts the real provider with a fresh query cache.
 *
 * @returns The query client used.
 */
function mount() {
  const client = makeTestQueryClient();
  render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <Probe />
      </AuthProvider>
    </QueryClientProvider>
  );
  return client;
}

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    unsubscribe.mockResolvedValue(undefined);
  });

  it("logout ends the session on the server, clears this browser and goes to sign-in", async () => {
    localStorage.setItem("accessToken", "token-1");
    introspect.mockResolvedValue({ user: { userId: "u1", role: "student", firstName: "Ada", lastName: "N" } });
    serverLogout.mockResolvedValue(undefined);
    const client = mount();
    await waitFor(() => expect(ctx.isAuthenticated).toBe(true));
    client.setQueryData(["learner", "u1", "today"], { cached: true });

    await act(async () => {
      await ctx.logout();
    });

    expect(serverLogout).toHaveBeenCalledTimes(1);
    expect(serverLogout).toHaveBeenCalledWith("token-1");
    expect(unsubscribe).toHaveBeenCalled();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(ctx.isAuthenticated).toBe(false);
    expect(client.getQueryData(["learner", "u1", "today"])).toBeUndefined();
    expect(push).toHaveBeenCalledWith("/signin");
  });

  it("still signs out here when the server call fails", async () => {
    localStorage.setItem("accessToken", "token-1");
    introspect.mockResolvedValue({ user: { userId: "u1", role: "student" } });
    serverLogout.mockRejectedValue(new Error("offline"));
    mount();
    await waitFor(() => expect(ctx.isAuthenticated).toBe(true));
    await act(async () => {
      await ctx.logout();
    });
    expect(serverLogout).toHaveBeenCalledTimes(1);
    expect(ctx.isAuthenticated).toBe(false);
    expect(push).toHaveBeenCalledWith("/signin");
  });

  it("does not restore a stored session that is not a student's, and does not try to refresh it", async () => {
    localStorage.setItem("accessToken", "teacher-token");
    introspect.mockResolvedValue({ user: { userId: "t1", role: "teacher" } });
    mount();
    await waitFor(() => expect(ctx.isLoading).toBe(false));
    expect(ctx.isAuthenticated).toBe(false);
    expect(refresh).not.toHaveBeenCalled();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});
