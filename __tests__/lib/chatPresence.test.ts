import { applyPresenceChanged } from "@/lib/chat";
import type { RealtimeChatRoom } from "@/types/chat";

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
