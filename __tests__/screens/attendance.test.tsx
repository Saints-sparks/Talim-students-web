import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@/test-utils/render";
import AttendanceScreen, { AttendanceView, attendanceBar } from "@/components/screens/attendance/AttendanceScreen";
import { makeAttendance, makeSchoolTerms } from "@/lib/fixtures/learner.fixture";
import { termOptions } from "@/lib/results/terms";
import type { FixtureVariant } from "@/lib/fixtures/flag";

const mockReplace = jest.fn();
let mockSearch = new URLSearchParams();
let mockVariant: FixtureVariant = "normal";
let mockTermsFail = false;

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace, prefetch: jest.fn() }),
  usePathname: () => "/attendance",
  useSearchParams: () => mockSearch,
}));

jest.mock("@/hooks/learner/queries", () => {
  const fixtures = jest.requireActual("@/lib/fixtures/learner.fixture");
  return {
    useAttendance: (termId?: string) => ({ data: fixtures.makeAttendance(mockVariant, termId), isLoading: false, isFetching: false, error: null, refetch: jest.fn() }),
    useSchoolTerms: () =>
      mockTermsFail
        ? { data: undefined, isLoading: false, isFetching: false, error: "We couldn't load the list of terms.", refetch: jest.fn() }
        : { data: fixtures.makeSchoolTerms(), isLoading: false, isFetching: false, error: null, refetch: jest.fn() },
  };
});

beforeEach(() => {
  mockReplace.mockClear();
  mockSearch = new URLSearchParams();
  mockVariant = "normal";
  mockTermsFail = false;
});

/**
 * Renders the view for one fixture answer with the full term list.
 *
 * @param variant - The fixture variant.
 * @param termId - The term.
 * @returns The render result.
 */
function renderView(variant: FixtureVariant = "normal", termId?: string) {
  const attendance = makeAttendance(variant, termId);
  return render(<AttendanceView attendance={attendance} termOptions={termOptions(makeSchoolTerms(), attendance.term)} termId={attendance.term?.id} onTermChange={jest.fn()} />);
}

/**
 * The stat card with a label.
 *
 * @param label - "Days present".
 * @returns The card.
 */
function stat(label: string) {
  return within(screen.getByRole("list", { name: "This term in numbers" })).getByText(label).closest("li") as HTMLElement;
}

describe("Attendance screen", () => {
  it("shows the term's rate, badge, term, class and bar", () => {
    renderView();
    expect(screen.getByRole("heading", { level: 1, name: "Attendance" })).toBeInTheDocument();
    expect(screen.getByText("The days your school marked you present.")).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(screen.getByText("47 of 50 school days this term")).toBeInTheDocument();
    expect(screen.getByText("On track")).toBeInTheDocument();
    expect(screen.getByText(/Term: 7 Sep 2026 – 18 Dec 2026/)).toHaveTextContent("Class: Jss1 A");
    expect(screen.getByRole("img", { name: "Present 46 days, late 1 day, missed 3 days" })).toBeInTheDocument();
    expect(screen.getByText("Approved leave and excused days are left out of the rate.")).toBeInTheDocument();
  });

  it("shows the four numbers with their share of the term", () => {
    renderView();
    expect(stat("Days present")).toHaveTextContent("46Days present92% of term");
    expect(stat("Days missed")).toHaveTextContent("3Days missed6% of term");
    expect(stat("Late")).toHaveTextContent("1Late2% of term");
    expect(stat("Excused")).toHaveTextContent("0ExcusedNone recorded");
  });

  it("shows the empty state before anything is marked", () => {
    renderView("empty");
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByText("Your school hasn't marked attendance yet.")).toBeInTheDocument();
    expect(screen.getByText("Nothing to show")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "No days marked yet" })).toBeInTheDocument();
    expect(stat("Days present")).toHaveTextContent("0Days presentTerm has just started");
    expect(stat("Days missed")).toHaveTextContent("0Days missed");
  });

  it("loads the term in the address and flags a rate that needs watching", () => {
    mockSearch = new URLSearchParams("term=term-0");
    render(<AttendanceScreen />);
    expect(screen.getByText("90.2%")).toBeInTheDocument();
    expect(screen.getByText("Needs watching")).toBeInTheDocument();
    expect(screen.getByText("55 of 62 school days this term")).toBeInTheDocument();
    expect(screen.getByLabelText("Term")).toHaveDisplayValue("Third term · 2025/2026");
    expect(stat("Excused")).toHaveTextContent("1Excused2% of term");
  });

  it("puts the chosen term in the address, and clears it for the current term", async () => {
    const first = render(<AttendanceScreen />);
    const picker = screen.getByLabelText("Term");
    expect(picker).toHaveDisplayValue("First term · 2026/2027");
    await userEvent.selectOptions(picker, "Third term · 2025/2026");
    expect(mockReplace).toHaveBeenCalledWith("/attendance?term=term-0", { scroll: false });

    first.unmount();
    mockReplace.mockClear();
    mockSearch = new URLSearchParams("term=term-0");
    render(<AttendanceScreen />);
    await userEvent.selectOptions(screen.getByLabelText("Term"), "First term · 2026/2027");
    expect(mockReplace).toHaveBeenCalledWith("/attendance", { scroll: false });
  });

  it("offers only the term on screen when the term list fails", () => {
    mockTermsFail = true;
    render(<AttendanceScreen />);
    const picker = screen.getByLabelText("Term");
    expect(within(picker).getAllByRole("option").map((o) => o.textContent)).toEqual(["First term · 2026/2027"]);
    expect(screen.getByText("94%")).toBeInTheDocument();
  });
});

describe("attendance helpers", () => {
  it("splits the bar over present, late and absent days only", () => {
    expect(attendanceBar({ present: 46, late: 1, absent: 3 })).toEqual({ present: 92, late: 2, missed: 6, marked: 50 });
    expect(attendanceBar({ present: 0, late: 0, absent: 0 })).toEqual({ present: 0, late: 0, missed: 0, marked: 0 });
  });
});
