/**
 * Every auth call from the students portal names the portal in `X-Talim-App`,
 * so the API keeps the students' refresh token in its own
 * `refreshToken_students` cookie and refuses other roles at sign-in.
 */
import { classifyLoginError } from "@/lib/auth/signIn";

const API = "http://api.test";

/**
 * A minimal stand-in for a fetch Response (jsdom has no `Response`).
 *
 * @param body - The JSON body.
 * @param status - The HTTP status.
 * @returns The response.
 */
function jsonResponse(body: unknown, status = 200): Response {
  const text = body === undefined ? "" : JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "Content-Type": "application/json" }),
    text: () => Promise.resolve(text),
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

/**
 * The `X-Talim-App` value one recorded fetch call carried.
 *
 * @param init - The call's `RequestInit`.
 * @returns The header's value, or `null`.
 */
function talimApp(init: RequestInit | undefined): string | null {
  return new Headers(init?.headers).get("X-Talim-App");
}

describe("X-Talim-App on auth calls", () => {
  let fetchMock: jest.Mock;
  let authService: (typeof import("@/services/auth.service"))["authService"];
  let accountService: (typeof import("@/services/account.service"))["accountService"];
  let settingsService: (typeof import("@/services/settings.service"))["settingsService"];
  let api: (typeof import("@/lib/authFetch"))["api"];

  beforeEach(async () => {
    jest.resetModules();
    localStorage.clear();
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    ({ authService } = await import("@/services/auth.service"));
    ({ accountService } = await import("@/services/account.service"));
    ({ settingsService } = await import("@/services/settings.service"));
    ({ api } = await import("@/lib/authFetch"));
    const { sessionStore } = await import("@/lib/session");
    sessionStore.clear();
    sessionStore.set({ userId: "u1" }, "token-1");
  });

  it("sends `students` on sign-in, refresh, sign-out, change-password and the session routes", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ access_token: "a", refresh_token: "", user: {} }));

    await authService.login({ identifier: "ada", email: "ada", password: "pw", deviceToken: "web-token", platform: "web" });
    await authService.refresh();
    await accountService.logout("token-1");
    await settingsService.changePassword({ currentPassword: "a", newPassword: "b", confirmPassword: "b" });
    await accountService.getSessions();
    await accountService.revokeSession("s1");
    await accountService.revokeOtherSessions();

    const calls = fetchMock.mock.calls as [string, RequestInit][];
    expect(calls.map(([url]) => url)).toEqual([
      `${API}/auth/login`,
      `${API}/auth/refresh`,
      `${API}/auth/logout`,
      `${API}/auth/change-password`,
      `${API}/auth/sessions`,
      `${API}/auth/sessions/s1`,
      `${API}/auth/sessions/revoke-others`,
    ]);
    for (const [, init] of calls) expect(talimApp(init)).toBe("students");
  });

  it("sends it on the silent refresh after a 401, and on the replay", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ message: "expired" }, 401))
      .mockResolvedValueOnce(jsonResponse({ access_token: "token-2" }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));

    await api.get(`${API}/students/me`);

    const calls = fetchMock.mock.calls as [string, RequestInit][];
    expect(calls[1][0]).toBe(`${API}/auth/refresh`);
    expect(calls.map(([, init]) => talimApp(init))).toEqual(["students", "students", "students"]);
  });

  it("reads the API's 403 refusal of another role as access denied", async () => {
    const message =
      'Access denied. This portal is for students only. Your account is registered as "school admin". Please use the correct Talim app for your role.';
    fetchMock.mockResolvedValue(jsonResponse({ success: false, error: { code: "FORBIDDEN", message } }, 403));

    const error = await authService
      .login({ identifier: "admin", email: "admin", password: "pw", deviceToken: "web-token", platform: "web" })
      .catch((err: unknown) => err);

    expect(error).toMatchObject({ name: "ApiError", code: "FORBIDDEN", status: 403 });
    expect(classifyLoginError(error)).toEqual({ kind: "access_denied", message });
  });
});
