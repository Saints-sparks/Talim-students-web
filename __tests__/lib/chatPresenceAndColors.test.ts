import { applyPresenceChanged } from "@/lib/chat";
import { MATERIAL_COLORS } from "@/lib/colorUtils";
import { processParticipants } from "@/components/messages/ChatHeader";
import type { RealtimeChatRoom } from "@/types/chat";

/** WCAG relative luminance of a #RRGGBB colour. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

describe("sender colours", () => {
  it("every colour is readable against white (AA, 4.5:1)", () => {
    for (const color of MATERIAL_COLORS) {
      expect({ color, ok: 1.05 / (luminance(color) + 0.05) >= 4.5 }).toEqual({ color, ok: true });
    }
  });
});

describe("applyPresenceChanged", () => {
  const room = (type: string, participants: Array<Record<string, unknown>>) =>
    ({ roomId: `r-${type}`, type, participants, isOnline: false }) as unknown as RealtimeChatRoom;

  const rooms = [
    room("one_to_one", [
      { userId: "me", role: "student" },
      { userId: "t1", role: "teacher", isOnline: false },
    ]),
    room("class_group", [
      { userId: "me", role: "student" },
      { userId: "t1", role: "teacher", isOnline: false },
      { userId: "s2", role: "student", isOnline: false },
    ]),
  ];

  it("updates the person everywhere and recomputes each room's online flag", () => {
    const next = applyPresenceChanged(rooms, "t1", true, ["me"]);
    expect(next[0].isOnline).toBe(true); // direct chat: the other person
    expect(next[1].isOnline).toBe(true); // group: a teacher is online
    expect(next[0].participants[1].isOnline).toBe(true);

    const off = applyPresenceChanged(next, "t1", false, ["me"]);
    expect(off[0].isOnline).toBe(false);
    expect(off[1].isOnline).toBe(false);
  });

  it("a classmate coming online does not light up the group (only teachers do)", () => {
    const next = applyPresenceChanged(rooms, "s2", true, ["me"]);
    expect(next[1].participants[2].isOnline).toBe(true);
    expect(next[1].isOnline).toBe(false);
  });

  it("returns the same list when nothing changes", () => {
    expect(applyPresenceChanged(rooms, "t1", false, ["me"])).toBe(rooms);
    expect(applyPresenceChanged(rooms, "nobody", true, ["me"])).toBe(rooms);
  });
});

describe("chat header participants", () => {
  it("drops the signed-in user under either of their ids", () => {
    const people = processParticipants(
      [
        { _id: "profile-1", userId: "user-1", firstName: "Me" },
        { userId: "t1", firstName: "Ada", lastName: "Obi" },
        { _id: "profile-2", firstName: "Bola" },
      ],
      ["user-1", "profile-1"]
    );
    expect(people.map((p) => p.firstName)).toEqual(["Ada", "Bola"]);
  });
});
