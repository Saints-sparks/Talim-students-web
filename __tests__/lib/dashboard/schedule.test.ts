import {
  formatTimeLabel,
  getGreeting,
  getScheduleStatus,
  parseTimeToMinutes,
  splitTimeRange,
  toPercentile,
  toTodaySchedule,
  toWeeklySummary,
} from "@/lib/dashboard/schedule";
import type { TimetableSubject } from "@/hooks/useTimetable";

function period(overrides: Partial<TimetableSubject> = {}): TimetableSubject {
  return {
    name: "Mathematics",
    day: "Tuesday",
    start: 9,
    end: 10,
    timeString: "09:00 AM - 10:00 AM",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    ...overrides,
  };
}

describe("time helpers", () => {
  it("reads 12-hour and 24-hour clock times", () => {
    expect(parseTimeToMinutes("09:41 AM")).toBe(9 * 60 + 41);
    expect(parseTimeToMinutes("01:05 PM")).toBe(13 * 60 + 5);
    expect(parseTimeToMinutes("12:00 AM")).toBe(0);
    expect(parseTimeToMinutes("12:30 PM")).toBe(12 * 60 + 30);
    expect(parseTimeToMinutes("14:05")).toBe(14 * 60 + 5);
  });

  it("returns 0 rather than NaN for junk", () => {
    expect(parseTimeToMinutes(undefined)).toBe(0);
    expect(parseTimeToMinutes("soon")).toBe(0);
  });

  it("pads the hour for display", () => {
    expect(formatTimeLabel("9:41 AM")).toBe("09:41 AM");
    expect(formatTimeLabel(undefined)).toBe("--:--");
  });

  it("splits a range into both ends", () => {
    expect(splitTimeRange("9:00 AM - 10:30 AM")).toEqual({ start: "09:00 AM", end: "10:30 AM" });
    expect(splitTimeRange(undefined)).toEqual({ start: "--:--", end: "--:--" });
  });

  it("greets by time of day", () => {
    expect(getGreeting(new Date("2026-01-01T08:00:00"))).toBe("Good morning");
    expect(getGreeting(new Date("2026-01-01T13:00:00"))).toBe("Good afternoon");
    expect(getGreeting(new Date("2026-01-01T19:00:00"))).toBe("Good evening");
  });
});

describe("getScheduleStatus", () => {
  it("places a class relative to the current time", () => {
    expect(getScheduleStatus(period(), new Date("2026-01-01T08:00:00"))).toBe("Upcoming");
    expect(getScheduleStatus(period(), new Date("2026-01-01T09:30:00"))).toBe("In Progress");
    expect(getScheduleStatus(period(), new Date("2026-01-01T11:00:00"))).toBe("Completed");
  });

  it("falls back to the decimal hours when clock strings are missing", () => {
    const item = period({ startTime: undefined, endTime: undefined, start: 14, end: 15 });
    expect(getScheduleStatus(item, new Date("2026-01-01T14:30:00"))).toBe("In Progress");
  });
});

describe("toTodaySchedule", () => {
  // A Tuesday, mid-morning.
  const now = new Date("2026-01-06T09:30:00");

  it("keeps only today's classes, ordered by start time", () => {
    const schedule = toTodaySchedule(
      [
        period({ name: "History", start: 11, timeString: "11:00 AM - 12:00 PM", startTime: "11:00 AM", endTime: "12:00 PM" }),
        period({ name: "Maths" }),
        period({ name: "Biology", day: "Friday" }),
      ],
      now
    );

    expect(schedule.map((item) => item.name)).toEqual(["Maths", "History"]);
    expect(schedule[0].status).toBe("In Progress");
    expect(schedule[0].startLabel).toBe("09:00 AM");
  });

  it("returns nothing when no class falls on today", () => {
    expect(toTodaySchedule([period({ day: "Friday" })], now)).toEqual([]);
  });
});

describe("toWeeklySummary", () => {
  it("counts classes per weekday, Monday first", () => {
    const summary = toWeeklySummary([period(), period(), period({ day: "Friday" })]);
    expect(summary.map((d) => d.shortDay)).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri"]);
    expect(summary.find((d) => d.day === "Tuesday")?.count).toBe(2);
    expect(summary.find((d) => d.day === "Monday")?.count).toBe(0);
  });
});

describe("toPercentile", () => {
  it("puts first in a class of 40 at the top", () => {
    expect(toPercentile(1, 40)).toBe(100);
    expect(toPercentile(40, 40)).toBe(3);
    expect(toPercentile(20, 40)).toBe(53);
  });

  it("returns null while the position is unpublished", () => {
    expect(toPercentile(null, 40)).toBeNull();
    expect(toPercentile(5, 0)).toBeNull();
  });
});
