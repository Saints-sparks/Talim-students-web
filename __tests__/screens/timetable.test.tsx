import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@/test-utils/render";
import TimetableScreen, { TimetableView } from "@/components/screens/timetable/TimetableScreen";
import { hoursWindows, indexLessons, shortClock, weekLabel } from "@/lib/timetable-week/grid";
import { FIXTURE_PERIODS, makeTimetable } from "@/lib/fixtures/learner.fixture";
import type { FixtureVariant } from "@/lib/fixtures/flag";
import type { StudentLesson } from "@/types/learner";

const mockReplace = jest.fn();
let mockSearch = new URLSearchParams();
let mockVariant: FixtureVariant = "normal";
const mockMarkStep = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace, prefetch: jest.fn() }),
  usePathname: () => "/timetable",
  useSearchParams: () => mockSearch,
}));

jest.mock("@/hooks/learner/queries", () => ({
  useWeekTimetable: (weekStart?: string) => {
    const { makeTimetable: build } = jest.requireActual("@/lib/fixtures/learner.fixture");
    return { data: build(mockVariant, weekStart), isLoading: false, isFetching: false, error: null, refetch: jest.fn() };
  },
}));

jest.mock("@/contexts/OnboardingContext", () => ({
  useStudentOnboarding: () => ({ markStepComplete: mockMarkStep }),
}));

beforeEach(() => {
  mockReplace.mockClear();
  mockMarkStep.mockClear();
  mockSearch = new URLSearchParams();
  mockVariant = "normal";
});

/**
 * The lesson links inside the grid.
 *
 * @returns The links.
 */
function gridLinks() {
  return within(screen.getByRole("table")).queryAllByRole("link");
}

describe("Timetable screen", () => {
  it("shows the heading from the API's subjects and periods, and the week", () => {
    render(<TimetableView timetable={makeTimetable("normal")} onWeekChange={jest.fn()} />);
    expect(screen.getByRole("heading", { level: 1, name: "Timetable" })).toBeInTheDocument();
    expect(screen.getByText("Your 12 subjects across the week, 8:00 to 16:00. Set by your school.")).toBeInTheDocument();
    expect(screen.getAllByText("Week 2 · Mon 14 Sep – Fri 18 Sep").length).toBeGreaterThan(0);
  });

  it("renders every lesson of a normal week as a link to its subject", () => {
    const week = makeTimetable("normal");
    render(<TimetableView timetable={week} onWeekChange={jest.fn()} />);
    const links = gridLinks();
    expect(links).toHaveLength(week.lessons.length);
    const expected = week.lessons.map((l) => `/subjects/${l.course.id}`).sort();
    expect(links.map((a) => a.getAttribute("href")).sort()).toEqual(expected);
    const first = links[0];
    expect(first).toHaveTextContent("Maths");
    expect(first).toHaveTextContent("Mr Seyi Tinubu");
    expect(first).toHaveAttribute("title", "Advance Maths · Mr Seyi Tinubu · Monday 08:00 – 09:00");
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("columnheader").map((th) => th.textContent)).toEqual(["Time", "Mon 14Today", "Tue 15", "Wed 16", "Thu 17", "Fri 18"]);
    expect(within(table).getAllByText("Break")).toHaveLength(5);
  });

  it("keeps the 1000px grid inside its scroller on a phone (contain: paint)", () => {
    render(<TimetableView timetable={makeTimetable("normal")} onWeekChange={jest.fn()} />);
    const grid = screen.getByRole("region", { name: /^Lessons, / });
    expect(grid.className).toContain("overflow-x-auto");
    expect(grid.className).toContain("[contain:paint]");
  });

  it("lists every subject in the legend", () => {
    render(<TimetableView timetable={makeTimetable("normal")} onWeekChange={jest.fn()} />);
    const legend = screen.getByRole("list", { name: "Subjects" });
    expect(within(legend).getAllByRole("listitem")).toHaveLength(12);
    expect(within(legend).getByText("Computer").closest("li")).toHaveAttribute("title", "Computer Studies · Miss Chidinma Okafor");
    expect(screen.getByText("Changes made by your school show up here automatically.")).toBeInTheDocument();
  });

  it("writes the holiday once down its column and puts no lessons on it", () => {
    const week = makeTimetable("holiday");
    render(<TimetableView timetable={week} onWeekChange={jest.fn()} />);
    expect(screen.getByText("Founders' Day — no school")).toBeInTheDocument();
    const links = gridLinks();
    expect(links).toHaveLength(28);
    expect(links.some((a) => a.getAttribute("title")?.includes("Wednesday"))).toBe(false);
  });

  it("says there are no lessons in an empty week", () => {
    render(<TimetableView timetable={makeTimetable("empty")} onWeekChange={jest.fn()} />);
    expect(screen.getByText("No lessons this week")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    // The current week has nowhere to go back to.
    expect(screen.queryByRole("button", { name: "Back to this week" })).not.toBeInTheDocument();
  });

  it("offers a way back from a week outside the term", async () => {
    const onWeekChange = jest.fn();
    render(<TimetableView timetable={makeTimetable("normal", "2027-01-04")} onWeekChange={onWeekChange} />);
    expect(screen.getByText("No lessons this week")).toBeInTheDocument();
    expect(screen.getAllByText("Mon 4 Jan – Fri 8 Jan").length).toBeGreaterThan(0);
    await userEvent.click(screen.getByRole("button", { name: "Back to this week" }));
    expect(onWeekChange).toHaveBeenCalledWith(null);
  });

  it("narrows the grid to one day", async () => {
    render(<TimetableView timetable={makeTimetable("normal")} onWeekChange={jest.fn()} />);
    await userEvent.selectOptions(screen.getByLabelText("Show one day only"), "Tuesday");
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("columnheader").map((th) => th.textContent)).toEqual(["Time", "Tue 15"]);
    expect(gridLinks()).toHaveLength(7);
    expect(gridLinks().every((a) => a.getAttribute("title")?.includes("Tuesday"))).toBe(true);
  });

  it("narrows the grid to the morning or the afternoon, labelled with real times", async () => {
    render(<TimetableView timetable={makeTimetable("normal")} onWeekChange={jest.fn()} />);
    const hours = screen.getByLabelText("Narrow the hours shown");
    expect(within(hours).getAllByRole("option").map((o) => o.textContent)).toEqual([
      "Full day (8:00 – 16:00)",
      "Morning (8:00 – 12:00)",
      "Afternoon (13:00 – 16:00)",
    ]);
    await userEvent.selectOptions(hours, "Morning (8:00 – 12:00)");
    expect(gridLinks()).toHaveLength(20);
    expect(within(screen.getByRole("table")).getAllByRole("rowheader")).toHaveLength(4);
    await userEvent.selectOptions(hours, "Afternoon (13:00 – 16:00)");
    expect(gridLinks()).toHaveLength(15);
    expect(within(screen.getByRole("table")).queryByText("Break")).not.toBeInTheDocument();
  });

  it("moves between weeks through the address and ticks the onboarding step", async () => {
    render(<TimetableScreen />);
    expect(mockMarkStep).toHaveBeenCalledWith("view-timetable");
    const thisWeek = screen.getByRole("button", { name: "This week" });
    expect(thisWeek).toHaveAttribute("aria-pressed", "true");
    expect(thisWeek).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next week" }));
    expect(mockReplace).toHaveBeenCalledWith("/timetable?week=2026-09-21", { scroll: false });
    await userEvent.click(screen.getByRole("button", { name: "Previous week" }));
    expect(mockReplace).toHaveBeenLastCalledWith("/timetable?week=2026-09-07", { scroll: false });
  });

  it("reads the week from the address", async () => {
    mockSearch = new URLSearchParams("week=2026-09-21");
    render(<TimetableScreen />);
    expect(screen.getAllByText("Week 3 · Mon 21 Sep – Fri 25 Sep").length).toBeGreaterThan(0);
    const thisWeek = screen.getByRole("button", { name: "This week" });
    expect(thisWeek).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(thisWeek);
    expect(mockReplace).toHaveBeenCalledWith("/timetable", { scroll: false });
  });

  it("does not tick the onboarding step for a week without lessons", () => {
    mockVariant = "empty";
    render(<TimetableScreen />);
    expect(mockMarkStep).not.toHaveBeenCalled();
  });
});

describe("the week as the live API sends it", () => {
  it("labels the week up to its last school day, though the API's week ends on Sunday", () => {
    const base = makeTimetable("normal");
    render(<TimetableView timetable={{ ...base, week: { ...base.week, end: "2026-09-20" } }} onWeekChange={jest.fn()} />);
    expect(screen.getAllByText("Week 2 · Mon 14 Sep – Fri 18 Sep").length).toBeGreaterThan(0);
  });
});

describe("timetable helpers", () => {
  it("indexes lessons by day and period, placing a lesson without a period by its start time", () => {
    const week = makeTimetable("normal");
    const loose: StudentLesson = { ...week.lessons[0], id: "loose", periodKey: null, date: "2026-09-15", startTime: "09:00" };
    const index = indexLessons([...week.lessons, loose], week.periods);
    expect(index.get("2026-09-15|p2")?.map((l) => l.id)).toEqual(["lesson-2026-09-15-p2", "loose"]);
    expect(index.get("2026-09-14|brk")).toBeUndefined();
  });

  it("splits the day at the first break and labels the windows", () => {
    expect(hoursWindows(FIXTURE_PERIODS).map((w) => [w.id, w.periods.length])).toEqual([
      ["full", 8],
      ["morning", 4],
      ["afternoon", 3],
    ]);
    expect(hoursWindows(FIXTURE_PERIODS.filter((p) => !p.isBreak)).map((w) => w.id)).toEqual(["full"]);
    expect(shortClock("08:00")).toBe("8:00");
    expect(shortClock("13:30")).toBe("13:30");
  });

  it("labels a week with its number only inside the term", () => {
    expect(weekLabel({ number: 2, start: "2026-09-14", end: "2026-09-18" })).toBe("Week 2 · Mon 14 Sep – Fri 18 Sep");
    expect(weekLabel({ number: null, start: "2026-12-28", end: "2027-01-01" })).toBe("Mon 28 Dec – Fri 1 Jan");
  });
});
