import { ApiError } from "@/lib/apiError";
import type { TimetableSubject } from "@/hooks/useTimetable";
import {
  TIME_RANGES,
  TIME_SLOTS,
  buildTimetableCsv,
  countClasses,
  entriesForSlot,
  filterEntriesBySlots,
  groupSubjectsByDay,
  timetableErrorKind,
} from "@/lib/timetable";

function subject(day: string, name: string, from: string, to: string, start: number): TimetableSubject {
  return { name, day, start, end: start + 1, timeString: `${from} - ${to}` };
}

const monday = [
  subject("Monday", "Physics", "10:00 AM", "11:00 AM", 10),
  subject("Monday", "Maths", "08:00 AM", "09:00 AM", 8),
];

describe("groupSubjectsByDay", () => {
  it("groups by weekday and orders each day by start time", () => {
    const byDay = groupSubjectsByDay([...monday, subject("Friday", "Art", "01:00 PM", "02:00 PM", 13)]);
    expect(byDay.Monday.map((entry) => entry.course)).toEqual(["Maths", "Physics"]);
    expect(byDay.Friday).toHaveLength(1);
    expect(byDay.Tuesday).toBeUndefined();
  });

  it("splits the written range into start and end", () => {
    const [entry] = groupSubjectsByDay([monday[1]]).Monday;
    expect(entry).toMatchObject({ time: "08:00 AM - 09:00 AM", startTime: "08:00 AM", endTime: "09:00 AM" });
  });

  it("returns an empty week for no subjects", () => {
    expect(groupSubjectsByDay([])).toEqual({});
    expect(countClasses({})).toBe(0);
  });
});

describe("entriesForSlot", () => {
  const entries = groupSubjectsByDay([
    ...monday,
    subject("Monday", "Late start", "09:41 AM", "10:38 AM", 9.68),
    subject("Monday", "Clash", "08:00 AM", "09:00 AM", 8),
  ]).Monday;

  it("matches a period written exactly as the slot", () => {
    expect(entriesForSlot(entries, TIME_SLOTS[0]).map((e) => e.course)).toEqual(["Maths", "Clash"]);
  });

  it("puts an off-grid start inside the row it starts in, instead of dropping it", () => {
    expect(entriesForSlot(entries, TIME_SLOTS[1]).map((e) => e.course)).toEqual(["Late start"]);
  });

  it("returns nothing for a free row", () => {
    expect(entriesForSlot(entries, TIME_SLOTS[5])).toEqual([]);
  });

  it("does not match a period that starts in the next row", () => {
    expect(entriesForSlot(entries, TIME_SLOTS[2]).map((e) => e.course)).toEqual(["Physics"]);
  });
});

describe("filterEntriesBySlots", () => {
  it("keeps only periods that appear in the visible rows", () => {
    const { Monday } = groupSubjectsByDay([monday[0], monday[1], subject("Monday", "PM", "02:00 PM", "03:00 PM", 14)]);
    const morning = TIME_RANGES.find((range) => range.id === "morning")!;
    const slots = TIME_SLOTS.slice(morning.start, morning.end + 1);
    expect(filterEntriesBySlots(Monday, slots).map((e) => e.course)).toEqual(["Maths", "Physics"]);
  });
});

describe("buildTimetableCsv", () => {
  it("writes a header, a row per period and a Free Period row per empty slot", () => {
    const byDay = groupSubjectsByDay([monday[1]]);
    const csv = buildTimetableCsv(byDay, ["Monday"], TIME_SLOTS.slice(0, 2));
    expect(csv.split("\n")).toEqual([
      "Day,Time Slot,Course,Subject,Class",
      'Monday,"08:00 AM - 09:00 AM","Maths","Maths","Student Class"',
      'Monday,"09:00 AM - 10:00 AM","Free Period","",""',
      "",
    ]);
  });

  it("doubles quotes so a course name cannot break the row", () => {
    const byDay = groupSubjectsByDay([subject("Monday", 'Maths "Extra"', "08:00 AM", "09:00 AM", 8)]);
    expect(buildTimetableCsv(byDay, ["Monday"], [TIME_SLOTS[0]])).toContain('"Maths ""Extra"""');
  });
});

describe("TIME_RANGES", () => {
  it("starts with the full day and stays inside the slot list", () => {
    expect(TIME_RANGES[0]).toMatchObject({ start: 0, end: TIME_SLOTS.length - 1 });
    for (const range of TIME_RANGES) expect(range.end).toBeLessThan(TIME_SLOTS.length);
  });
});

describe("timetableErrorKind", () => {
  it("keys on the error code", () => {
    expect(timetableErrorKind(ApiError.offline())).toBe("network");
    expect(timetableErrorKind(ApiError.unreachable())).toBe("network");
    expect(timetableErrorKind(ApiError.timeout())).toBe("network");
    expect(timetableErrorKind(new ApiError("INTERNAL_ERROR", "boom", 500))).toBe("server");
    expect(timetableErrorKind(new ApiError("FORBIDDEN", "no", 403))).toBe("unknown");
    expect(timetableErrorKind(new Error("network"))).toBe("unknown");
  });
});
