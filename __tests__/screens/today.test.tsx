import React from "react";
import { render, screen, within } from "@/test-utils/render";
import { TodayView } from "@/components/screens/today/TodayScreen";
import { glanceTiles } from "@/components/screens/today/GlanceCard";
import { splitLessons } from "@/components/screens/today/LessonCards";
import { schoolDayMessage } from "@/components/screens/today/SchoolDayNotice";
import { makeToday } from "@/lib/fixtures/learner.fixture";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Today screen", () => {
  it("greets with the API's part of the day and date, not the device clock", () => {
    render(<TodayView today={makeToday("normal")} firstName="Musa" />);
    expect(screen.getByRole("heading", { level: 1, name: "Good morning, Musa" })).toBeInTheDocument();
    expect(screen.getByText("Monday, 14 September 2026 · Jss1 A")).toBeInTheDocument();
  });

  it("shows the glance tiles, the pass mark from the API and one bar per subject", () => {
    const today = makeToday("normal");
    render(<TodayView today={today} firstName="Musa" />);
    expect(screen.getByRole("link", { name: /Class position\s*5th\s*of 28 in Jss1 A/ })).toHaveAttribute("href", "/results");
    expect(screen.getByRole("link", { name: /Attendance\s*94%/ })).toHaveAttribute("href", "/attendance");
    expect(screen.getByText(/pass mark 45%/)).toBeInTheDocument();
    const chart = screen.getByRole("figure");
    expect(within(chart).getAllByRole("listitem")).toHaveLength(today.subjectTotals.length);
  });

  it("puts the next lesson in Up next and the later ones in Rest of today", () => {
    const today = makeToday("normal");
    render(<TodayView today={today} firstName="Musa" />);
    const upNext = screen.getByRole("region", { name: "Up next" });
    expect(within(upNext).getByText("Introduction to Chemistry")).toBeInTheDocument();
    expect(within(upNext).getByText(/Now:/)).toHaveTextContent("Advance Maths · 20 min left");
    const rest = screen.getByRole("region", { name: "Rest of today" });
    expect(within(rest).getAllByRole("link")).toHaveLength(splitLessons(today).rest.length);
  });

  it("says it is the weekend and has no lessons", () => {
    render(<TodayView today={makeToday("weekend")} firstName="Musa" />);
    expect(screen.getByRole("status")).toHaveTextContent("It's the weekend — no lessons today");
    expect(within(screen.getByRole("region", { name: "Up next" })).getByText("No lessons today")).toBeInTheDocument();
    expect(screen.getByText("Nothing else on your timetable today.")).toBeInTheDocument();
  });

  it("names the holiday", () => {
    const today = makeToday("holiday");
    expect(schoolDayMessage(today)?.title).toBe("Founders' Day — no school today");
    render(<TodayView today={today} firstName="Musa" />);
    expect(screen.getByRole("status")).toHaveTextContent("Founders' Day — no school today");
  });

  it("shows the empty wording before anything is published or marked", () => {
    const today = makeToday("empty");
    const tiles = glanceTiles(today);
    expect(tiles.map((t) => t.note)).toEqual(["No scores yet", "Not ranked yet", "Not marked yet", "Nothing waiting"]);
    render(<TodayView today={today} firstName="Musa" />);
    expect(screen.getByText("Nothing due yet. New assessments will show up here.")).toBeInTheDocument();
    expect(screen.getByText("Nothing new yet")).toBeInTheDocument();
  });

  it("links each new item to where it belongs", () => {
    render(<TodayView today={makeToday("normal")} firstName="Musa" />);
    const feed = screen.getByRole("region", { name: "New since you last signed in" });
    const links = within(feed).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/updates", "/files?course=course-cmp-18", "/results", "/messages?room=room-class"]);
  });
});
