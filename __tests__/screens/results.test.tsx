import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@/test-utils/render";
import ResultsScreen, { ResultsView } from "@/components/screens/results/ResultsScreen";
import { summaryCards } from "@/components/screens/results/SummaryCards";
import { FIXTURE_COLUMNS, makeReportCard, makeSchoolTerms } from "@/lib/fixtures/learner.fixture";
import { formatPercent } from "@/lib/learner/format";
import { compareWithAverage, maxTotal, movementNote, schoolInitials } from "@/lib/results/report";
import { termOptions } from "@/lib/results/terms";
import type { FixtureVariant } from "@/lib/fixtures/flag";
import type { ReportCard } from "@/types/learner";

const mockReplace = jest.fn();
let mockSearch = new URLSearchParams();
let mockVariant: FixtureVariant = "normal";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace, prefetch: jest.fn() }),
  usePathname: () => "/results",
  useSearchParams: () => mockSearch,
}));

jest.mock("@/hooks/learner/queries", () => {
  const fixtures = jest.requireActual("@/lib/fixtures/learner.fixture");
  return {
    useReportCard: (termId?: string) => ({ data: fixtures.makeReportCard(mockVariant, termId), isLoading: false, isFetching: false, error: null, refetch: jest.fn() }),
    useSchoolTerms: () => ({ data: fixtures.makeSchoolTerms(), isLoading: false, isFetching: false, error: null, refetch: jest.fn() }),
  };
});

beforeEach(() => {
  mockReplace.mockClear();
  mockSearch = new URLSearchParams();
  mockVariant = "normal";
});

/**
 * Renders the view for one report card with the fixture term list.
 *
 * @param card - The report card.
 * @returns The render result.
 */
function renderView(card: ReportCard) {
  return render(<ResultsView card={card} termOptions={termOptions(makeSchoolTerms(), card.term, card.session)} termId={card.term.id} onTermChange={jest.fn()} />);
}

/**
 * The report card's score table.
 *
 * @returns The table.
 */
function reportTable() {
  return screen.getByRole("table", { name: /Scores for/ });
}

/**
 * The text of each cell (not the subject header) of a subject's row.
 *
 * @param title - The subject's title.
 * @returns The cells' text.
 */
function rowCells(title: string): string[] {
  const row = within(reportTable()).getByRole("rowheader", { name: title }).closest("tr") as HTMLElement;
  return within(row).getAllByRole("cell").map((cell) => cell.textContent ?? "");
}

describe("Results screen", () => {
  it("shows the heading with the term and session", () => {
    renderView(makeReportCard("normal"));
    expect(screen.getByRole("heading", { level: 1, name: "Results" })).toBeInTheDocument();
    expect(screen.getByText("First term, 2026/2027 session.")).toBeInTheDocument();
    expect(screen.getByLabelText("Term")).toHaveDisplayValue("First term · 2026/2027");
  });

  it("takes the score columns and their maximum scores from the API", () => {
    const card = makeReportCard("normal");
    renderView(card);
    const headers = within(reportTable()).getAllByRole("columnheader").map((th) => th.textContent);
    expect(headers).toEqual(["Subject", ...FIXTURE_COLUMNS.map((c) => `${c.name}/${c.maxScore}`), `Total/${maxTotal(card.columns)}`, "Grade", "Position"]);
    expect(headers).toContain("Total/100");
  });

  it("draws whatever columns the school uses, totalled from their maximum scores", () => {
    const base = makeReportCard("normal");
    const card: ReportCard = {
      ...base,
      columns: [
        { id: "t1", name: "Test", maxScore: 30 },
        { id: "ex", name: "Exam", maxScore: 50 },
      ],
      rows: base.rows.map((row) => ({ ...row, scores: [row.scores[0], row.scores[2]] })),
    };
    renderView(card);
    expect(within(reportTable()).getAllByRole("columnheader").map((th) => th.textContent)).toEqual(["Subject", "Test/30", "Exam/50", "Total/80", "Grade", "Position"]);
    expect(rowCells("Computer Studies").slice(0, 2)).toEqual(["16", "50"]);
  });

  it("shows each subject's scores, total, grade and position", () => {
    const card = makeReportCard("normal");
    renderView(card);
    expect(within(reportTable()).getAllByRole("rowheader")).toHaveLength(card.rows.length + 1);
    expect(rowCells("Computer Studies")).toEqual(["16", "18", "50", "84", "A", "1st of 28"]);
    expect(rowCells("Yoruba Language")).toEqual(["11", "12", "33", "56", "C", "18th of 28"]);
  });

  it("shows the overall percent, grade and position from the API", () => {
    const card = makeReportCard("normal");
    renderView(card);
    const overall = within(reportTable()).getByRole("rowheader", { name: "Overall" }).closest("tr") as HTMLElement;
    const cells = within(overall).getAllByRole("cell").map((cell) => cell.textContent);
    expect(cells.slice(-3)).toEqual([formatPercent(card.overall.percent), card.overall.grade, "5th of 28"]);
    expect(formatPercent(card.overall.percent)).toBe("69.7%");
  });

  it("fills the student details, grading scale, attendance and comments", () => {
    renderView(makeReportCard("normal"));
    const sheet = screen.getByRole("article");
    expect(within(sheet).getByRole("heading", { name: "Easy Sparks Education Center" })).toBeInTheDocument();
    expect(within(sheet).getByText("14 Ikorodu Road, Lagos · +234 907 578 3540 · office@easysparks.edu.ng")).toBeInTheDocument();
    expect(within(sheet).getByText("ESE")).toBeInTheDocument();
    expect(within(sheet).getByText("TAL/2026/JS1/0148")).toBeInTheDocument();
    expect(within(sheet).getByText("14 September 2026")).toBeInTheDocument();
    expect(within(sheet).getByText((_, el) => el?.tagName === "LI" && el.textContent === "A · 75 – 100% — Excellent")).toBeInTheDocument();
    expect(within(sheet).getByText("Pass mark: 45%")).toBeInTheDocument();
    expect(within(sheet).getByText((_, el) => el?.tagName === "LI" && el.textContent === "Days absent: 3")).toBeInTheDocument();
    expect(within(sheet).getByText("Mr Saint Agbukor · Class teacher")).toBeInTheDocument();
    expect(within(sheet).getByText("A good start to the session. Keep it up.")).toBeInTheDocument();
    expect(within(sheet).getByText("Next term begins 11 January 2027")).toBeInTheDocument();
  });

  it("summarises the term in four cards", () => {
    renderView(makeReportCard("normal"));
    const summary = within(screen.getByRole("list", { name: "Term summary" })).getAllByRole("listitem");
    expect(summary.map((li) => li.textContent)).toEqual([
      "Term average69.7%BAcross all 12 subjects",
      "Class position5thof 28Up 2 places from last term",
      "Strongest subjectComputer84%1st in class",
      "Needs attentionYoruba56%Below your term average",
    ]);
  });

  it("compares the chosen subject with the class average", async () => {
    renderView(makeReportCard("normal"));
    const list = screen.getByRole("list", { name: "Choose a subject" });
    const computer = within(list).getByRole("button", { name: /Computer/ });
    await userEvent.click(computer);
    expect(computer).toHaveAttribute("aria-pressed", "true");
    const detail = screen.getByRole("region", { name: "Computer Studies" });
    expect(within(detail).getByText("CMP101 · Miss Chidinma Okafor · First term")).toBeInTheDocument();
    expect(within(detail).getByText("84 / 100")).toBeInTheDocument();
    expect(within(detail).getByText("84% · 1st of 28")).toBeInTheDocument();
    expect(within(detail).getByText("Class average is 72% — you are 12% above it.")).toBeInTheDocument();

    await userEvent.click(within(list).getByRole("button", { name: /Yoruba/ }));
    expect(computer).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Class average is 62% — you are 6% below it.")).toBeInTheDocument();
  });

  it("marks a partly published term and shows dashes for scores not out", () => {
    const card = makeReportCard("partial");
    renderView(card);
    expect(screen.getByRole("status")).toHaveTextContent("Some results aren't published yet. Your report card is final once your school publishes the term.");
    expect(rowCells("Computer Studies").slice(0, 4)).toEqual(["16", "18", "—", "34"]);
    const examColumn = card.rows.map((row) => rowCells(row.course.title)[2]);
    expect(new Set(examColumn)).toEqual(new Set(["—"]));
    expect(screen.getByText("Your class teacher's comment appears once the term's results are published.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Print report card" })).toBeEnabled();
  });

  it("says results are not out and cannot be printed yet", () => {
    renderView(makeReportCard("empty"));
    expect(screen.getByText("Your first term results aren't out yet.")).toBeInTheDocument();
    expect(screen.getByText("They appear here once your school publishes them.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Choose a subject" })).not.toBeInTheDocument();
    const print = screen.getByRole("button", { name: "Print report card" });
    expect(print).toBeDisabled();
    expect(print).toHaveAccessibleDescription("There is no report card to print yet.");
    const summary = within(screen.getByRole("list", { name: "Term summary" })).getAllByRole("listitem");
    expect(summary.map((li) => li.textContent)).toEqual(["Term average—No scores published yet", "Class position—Not ranked yet", "Strongest subject—", "Needs attention—"]);
  });

  it("prints the report card", async () => {
    const print = jest.spyOn(window, "print").mockImplementation(() => undefined);
    renderView(makeReportCard("normal"));
    await userEvent.click(screen.getByRole("button", { name: "Print report card" }));
    expect(print).toHaveBeenCalled();
    print.mockRestore();
  });

  it("loads the previous term through the picker", async () => {
    const first = render(<ResultsScreen />);
    await userEvent.selectOptions(screen.getByLabelText("Term"), "Third term · 2025/2026");
    expect(mockReplace).toHaveBeenCalledWith("/results?term=term-0", { scroll: false });
    first.unmount();

    mockSearch = new URLSearchParams("term=term-0");
    render(<ResultsScreen />);
    expect(screen.getByText("Third term, 2025/2026 session.")).toBeInTheDocument();
    expect(screen.getByLabelText("Term")).toHaveDisplayValue("Third term · 2025/2026");
    expect(screen.getByText("First ranked term")).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Term"), "First term · 2026/2027");
    expect(mockReplace).toHaveBeenLastCalledWith("/results", { scroll: false });
  });
});

describe("results helpers", () => {
  it("compares a percent with the class average to one decimal", () => {
    expect(compareWithAverage(84, 72)).toBe("Class average is 72% — you are 12% above it.");
    expect(compareWithAverage(56, 62)).toBe("Class average is 62% — you are 6% below it.");
    expect(compareWithAverage(71.25, 70)).toBe("Class average is 70% — you are 1.3% above it.");
    expect(compareWithAverage(70, 70)).toBe("You are level with the class average (70%).");
    expect(compareWithAverage(70.02, 70)).toBe("You are level with the class average (70%).");
    expect(compareWithAverage(null, 70)).toBeNull();
    expect(compareWithAverage(70, null)).toBeNull();
  });

  it("describes how the class position moved", () => {
    expect(movementNote({ rank: 5, of: 28 }, { rank: 7, of: 28 })).toBe("Up 2 places from last term");
    expect(movementNote({ rank: 6, of: 28 }, { rank: 5, of: 28 })).toBe("Down 1 place from last term");
    expect(movementNote({ rank: 5, of: 28 }, { rank: 5, of: 30 })).toBe("Same place as last term");
    expect(movementNote({ rank: 5, of: 28 }, null)).toBe("First ranked term");
    expect(movementNote(null, null)).toBe("Not ranked yet");
  });

  it("totals the column maximums and builds the school's initials", () => {
    expect(maxTotal(FIXTURE_COLUMNS)).toBe(100);
    expect(maxTotal([{ maxScore: 40 }, { maxScore: 60 }, { maxScore: 50 }])).toBe(150);
    expect(schoolInitials("Easy Sparks Education Center")).toBe("ESE");
    expect(schoolInitials("")).toBe("?");
  });

  it("only flags the weakest subject when it is below the term average", () => {
    const card = makeReportCard("normal");
    const levelled: ReportCard = { ...card, weakest: card.weakest && { ...card.weakest, percent: 80 } };
    expect(summaryCards(levelled, new Map())[3].note).toBe("");
  });
});
