import { ApiError } from "@/lib/apiError";
import { messageForError } from "@/lib/errorMessages";

describe("messageForError", () => {
  it("keys the sentence on the code, not the message text", () => {
    expect(messageForError(new ApiError("INTERNAL_ERROR", "ECONNRESET at pool.js:22", 500))).toBe(
      "Something went wrong on our side. Please try again."
    );
    expect(messageForError(new ApiError("UNKNOWN", "weird", 0))).toBe("Something went wrong. Please try again.");
  });

  it("shows the server's own wording when it is written for the student", () => {
    expect(messageForError(new ApiError("CONFLICT", "You have already submitted this.", 409))).toBe(
      "You have already submitted this."
    );
  });

  it("covers the client-raised connectivity codes", () => {
    expect(messageForError(ApiError.offline())).toMatch(/offline/i);
    expect(messageForError(ApiError.timeout())).toMatch(/too long/i);
  });

  it("falls back for values that are not ApiErrors", () => {
    expect(messageForError("boom", "Could not save.")).toBe("Could not save.");
  });
});
