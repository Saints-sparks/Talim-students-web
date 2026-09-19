import {
  computeCardPosition,
  getCompletedKey,
  getGuideUserId,
  getSeenKey,
  readGuideFlag,
  writeGuideFlag,
} from "@/lib/appGuide";
import type { User } from "@/types/auth";

const rect = (left: number, top: number, width = 200, height = 60) => ({ left, top, width, height });

describe("computeCardPosition", () => {
  const desktop = { width: 1280, height: 800 };
  const phone = { width: 390, height: 800 };

  it("centres the card when there is no target", () => {
    expect(computeCardPosition(null, desktop)).toEqual({
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      arrow: "hidden",
    });
  });

  it("puts the card to the right of a target on the left of a wide screen", () => {
    const position = computeCardPosition(rect(100, 300), desktop);
    expect(position.arrow).toBe("left");
    expect(position.left).toBe("324px");
    expect(position.transform).toBe("none");
  });

  it("puts it to the left when the target hugs the right edge", () => {
    const position = computeCardPosition(rect(1000, 300, 200), desktop);
    expect(position.arrow).toBe("right");
    expect(position.left).toBe("576px");
  });

  it("keeps the side card inside the top and bottom of the window", () => {
    expect(computeCardPosition(rect(100, 0), desktop).top).toBe("16px");
    expect(computeCardPosition(rect(100, 790), desktop).top).toBe("454px");
  });

  it("goes below the target on a phone, and above it when there is no room below", () => {
    const below = computeCardPosition(rect(20, 100, 300), phone);
    expect(below.arrow).toBe("top");
    expect(below.top).toBe("180px");

    const above = computeCardPosition(rect(20, 600, 300), phone);
    expect(above.arrow).toBe("bottom");
    expect(above.top).toBe("250px");
  });

  it("never lets the card leave the window horizontally", () => {
    const position = computeCardPosition(rect(0, 100, 60), phone);
    expect(parseFloat(position.left)).toBeGreaterThanOrEqual(16);
    const right = computeCardPosition(rect(380, 100, 60), phone);
    expect(parseFloat(right.left)).toBeLessThanOrEqual(390 - Math.min(400, 390 - 32) - 16);
  });
});

describe("guide identity and storage keys", () => {
  it("prefers userId, then _id, id and studentId, else guest", () => {
    expect(getGuideUserId({ userId: "u1", id: "x" } as User)).toBe("u1");
    expect(getGuideUserId({ id: "x" } as User)).toBe("x");
    expect(getGuideUserId({} as User)).toBe("guest");
    expect(getGuideUserId(null)).toBe("guest");
  });

  it("namespaces the flags by student and guide", () => {
    expect(getCompletedKey("timetable", "u1")).toBe("talim_student_guide:u1:timetable:completed");
    expect(getSeenKey("timetable", "u1")).toBe("talim_student_guide:u1:timetable:seen");
  });
});

describe("guide flags", () => {
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("round-trips a done flag", () => {
    expect(readGuideFlag("k")).toBe(false);
    writeGuideFlag("k");
    expect(readGuideFlag("k")).toBe(true);
  });

  it("survives storage that throws", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readGuideFlag("k")).toBe(false);
    expect(() => writeGuideFlag("k")).not.toThrow();
  });
});
