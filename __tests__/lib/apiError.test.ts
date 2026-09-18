import { ApiError, getErrorMessage } from "@/lib/apiError";

function response(status: number, headers: Record<string, string> = {}): Response {
  return { status, headers: new Headers(headers) } as Response;
}

describe("ApiError.fromResponse", () => {
  it("takes the code, message and details from the canonical envelope", () => {
    const error = ApiError.fromResponse(response(400), {
      success: false,
      statusCode: 400,
      message: "Some fields need attention.",
      error: {
        code: "VALIDATION_FAILED",
        message: "Some fields need attention.",
        details: [{ field: "email", reason: "must be an email" }],
      },
    });

    expect(error.code).toBe("VALIDATION_FAILED");
    expect(error.status).toBe(400);
    expect(error.fieldErrors()).toEqual({ email: "must be an email" });
  });

  it("falls back to the status when the server sends no code", () => {
    expect(ApiError.fromResponse(response(403), null).code).toBe("FORBIDDEN");
    expect(ApiError.fromResponse(response(404), null).code).toBe("NOT_FOUND");
    expect(ApiError.fromResponse(response(503), null).code).toBe("SERVICE_UNAVAILABLE");
    expect(ApiError.fromResponse(response(500), null).message).toMatch(/our side/i);
  });

  it("reads the legacy ValidationPipe array shape", () => {
    const error = ApiError.fromResponse(response(400), { message: ["password too short", "email required"] });
    expect(error.code).toBe("VALIDATION_FAILED");
    expect(error.details).toHaveLength(2);
    expect(error.fieldErrors()).toEqual({});
  });

  it("distinguishes an expired token from a plain 401", () => {
    expect(ApiError.fromResponse(response(401), { message: "jwt expired" }).code).toBe("TOKEN_EXPIRED");
    expect(ApiError.fromResponse(response(401), { message: "Invalid credentials" }).code).toBe("UNAUTHENTICATED");
  });

  it("keeps the request id for support", () => {
    expect(ApiError.fromResponse(response(500, { "x-request-id": "req-7" }), null).requestId).toBe("req-7");
  });

  it("ignores an unknown code rather than trusting it", () => {
    const error = ApiError.fromResponse(response(400), { error: { code: "MADE_UP", message: "nope" } });
    expect(error.code).toBe("BAD_REQUEST");
  });
});

describe("ApiError flags", () => {
  it("marks auth failures", () => {
    expect(new ApiError("TOKEN_EXPIRED", "x", 401).isAuthError).toBe(true);
    expect(new ApiError("NOT_FOUND", "x", 404).isAuthError).toBe(false);
  });

  it("marks retryable failures", () => {
    expect(ApiError.offline().isTransient).toBe(true);
    expect(ApiError.timeout().isTransient).toBe(true);
    expect(new ApiError("INTERNAL_ERROR", "x", 500).isTransient).toBe(true);
    expect(new ApiError("VALIDATION_FAILED", "x", 400).isTransient).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("prefers the API message", () => {
    expect(getErrorMessage(new ApiError("CONFLICT", "Already submitted.", 409))).toBe("Already submitted.");
  });

  it("hides raw fetch failures behind the fallback", () => {
    expect(getErrorMessage(new TypeError("Failed to fetch"), "fallback")).toBe("fallback");
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });
});
