const REFRESH_URL = "http://api.test/auth/refresh";

/**
 * A minimal stand-in for a fetch Response — jsdom provides no `Response`
 * constructor, and the client only reads `ok`, `status`, `headers` and `text`.
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

describe("api client", () => {
  let api: (typeof import("@/lib/authFetch"))["api"];
  let unwrapEnvelope: (typeof import("@/lib/authFetch"))["unwrapEnvelope"];
  let fetchMock: jest.Mock;

  // `jest.resetModules` gives each test a fresh single-flight refresh promise,
  // so the session store has to come from the same fresh module graph.
  beforeEach(async () => {
    jest.resetModules();
    localStorage.clear();
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const mod = await import("@/lib/authFetch");
    const { sessionStore } = await import("@/lib/session");
    api = mod.api;
    unwrapEnvelope = mod.unwrapEnvelope;
    sessionStore.clear();
    sessionStore.set({ userId: "u1" }, "token-1");
  });

  it("unwraps the canonical success envelope and passes bare bodies through", () => {
    expect(unwrapEnvelope({ success: true, data: { id: 1 } })).toEqual({ id: 1 });
    expect(unwrapEnvelope({ success: true, data: [1, 2] })).toEqual([1, 2]);
    expect(unwrapEnvelope([1, 2])).toEqual([1, 2]);
    expect(unwrapEnvelope({ data: [1], total: 1 })).toEqual({ data: [1], total: 1 });
    expect(unwrapEnvelope(null)).toBeNull();
  });

  it("sends the session's bearer token", async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ _id: "c1" }]));
    await api.get("http://api.test/courses");

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Headers).get("Authorization")).toBe("Bearer token-1");
  });

  it("omits the token and never refreshes when skipAuth is set", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ access_token: "x" }, 401));
    await expect(api.post("http://api.test/auth/login", {}, { skipAuth: true })).rejects.toMatchObject({
      name: "ApiError",
      code: "UNAUTHENTICATED",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Headers).get("Authorization")).toBeNull();
  });

  it("refreshes once on 401 and replays the request with the new token", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ message: "expired" }, 401))
      .mockResolvedValueOnce(jsonResponse({ access_token: "token-2" }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));

    await expect(api.get("http://api.test/me")).resolves.toEqual({ ok: true });

    expect(fetchMock.mock.calls[1][0]).toBe(REFRESH_URL);
    const replay = fetchMock.mock.calls[2][1];
    expect((replay.headers as Headers).get("Authorization")).toBe("Bearer token-2");
  });

  it("runs a single refresh for concurrent 401s", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === REFRESH_URL) return Promise.resolve(jsonResponse({ access_token: "token-2" }));
      const call = fetchMock.mock.calls.filter(([u]) => u !== REFRESH_URL).length;
      return Promise.resolve(call <= 2 ? jsonResponse({ message: "expired" }, 401) : jsonResponse({ ok: true }));
    });

    await Promise.all([api.get("http://api.test/a"), api.get("http://api.test/b")]);

    expect(fetchMock.mock.calls.filter(([u]) => u === REFRESH_URL)).toHaveLength(1);
  });

  it("signs the student out when the refresh itself fails", async () => {
    const onFailure = jest.fn();
    window.addEventListener("auth-refresh-failed", onFailure);
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ message: "expired" }, 401))
      .mockResolvedValueOnce(jsonResponse({ message: "no cookie" }, 401));

    await expect(api.get("http://api.test/me")).rejects.toMatchObject({ code: "TOKEN_EXPIRED" });
    expect(onFailure).toHaveBeenCalled();
    window.removeEventListener("auth-refresh-failed", onFailure);
  });

  it("raises a typed error carrying the server's code", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ success: false, error: { code: "FORBIDDEN", message: "Not yours." } }, 403)
    );

    await expect(api.get("http://api.test/other-student")).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Not yours.",
      status: 403,
    });
  });

  it("reports an unreachable server rather than leaking a TypeError", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(api.get("http://api.test/x")).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
  });

  it("returns null for an empty body", async () => {
    fetchMock.mockResolvedValue(jsonResponse(undefined, 204));
    await expect(api.delete("http://api.test/x")).resolves.toBeNull();
  });
});
