import { extractSchoolId, sessionStore } from "@/lib/session";

describe("extractSchoolId", () => {
  const id = "0123456789abcdef01234567";

  it("accepts a bare id and a populated object", () => {
    expect(extractSchoolId(id)).toBe(id);
    expect(extractSchoolId({ _id: id, name: "Talim" })).toBe(id);
    expect(extractSchoolId({ id })).toBe(id);
  });

  it("rejects anything that is not an ObjectId", () => {
    expect(extractSchoolId("school-1")).toBeNull();
    expect(extractSchoolId(null)).toBeNull();
    expect(extractSchoolId({ name: "Talim" })).toBeNull();
  });
});

describe("sessionStore", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStore.clear();
  });

  it("holds the user and token, and notifies subscribers", () => {
    const seen: string[] = [];
    const unsubscribe = sessionStore.subscribe(() => seen.push("changed"));

    sessionStore.set({ userId: "u1", studentId: "s1" }, "token-1");
    expect(sessionStore.getUserId()).toBe("u1");
    expect(sessionStore.getToken()).toBe("token-1");

    sessionStore.setToken("token-2");
    expect(sessionStore.getToken()).toBe("token-2");

    sessionStore.patchUser({ firstName: "Ada" });
    expect(sessionStore.getUser()?.firstName).toBe("Ada");

    unsubscribe();
    sessionStore.clear();
    expect(seen).toHaveLength(3);
    expect(sessionStore.getUser()).toBeNull();
  });

  it("reads the school id off whichever shape the API returned", () => {
    sessionStore.set({ userId: "u1", schoolId: { _id: "0123456789abcdef01234567" } });
    expect(sessionStore.getSchoolId()).toBe("0123456789abcdef01234567");
  });
});
