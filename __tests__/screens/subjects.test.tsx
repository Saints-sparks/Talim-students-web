import React from "react";
import { render, screen, within } from "@/test-utils/render";
import { SubjectsView, scoreNote } from "@/components/screens/subjects/SubjectsScreen";
import { makeSubjects } from "@/lib/fixtures/learner.fixture";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/subjects",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

describe("Subjects screen", () => {
  it("links each subject card to its own page", () => {
    const data = makeSubjects("normal");
    render(<SubjectsView data={data} />);
    expect(screen.getByRole("heading", { level: 1, name: "Subjects" })).toBeInTheDocument();
    const links = within(screen.getByRole("list")).getAllByRole("link");
    expect(links).toHaveLength(data.subjects.length);
    expect(links.map((a) => a.getAttribute("href"))).toEqual(data.subjects.map((s) => `/subjects/${s.course.id}`));
  });

  it("shows each subject's percent, position, code, teacher and topic", () => {
    render(<SubjectsView data={makeSubjects("normal")} />);
    const maths = screen.getByRole("link", { name: /^Advance Maths/ });
    expect(maths).toHaveTextContent("Mr Seyi Tinubu");
    expect(maths).toHaveTextContent("MTH222");
    expect(within(maths).getByText("65%")).toBeInTheDocument();
    expect(within(maths).getByText("total · 3rd of 28")).toBeInTheDocument();
    expect(within(maths).getByText("This week: Indices and standard form")).toBeInTheDocument();
    expect(within(maths).getByText("1 file")).toBeInTheDocument();
    expect(within(maths).getByText("Open subject →")).toBeInTheDocument();
    expect(screen.queryByText("Not every score is out yet")).not.toBeInTheDocument();
  });

  it("shows dashes and 'no scores yet' before anything is published", () => {
    const data = makeSubjects("empty");
    render(<SubjectsView data={data} />);
    expect(screen.getAllByText("—")).toHaveLength(data.subjects.length);
    expect(screen.getAllByText("no scores yet")).toHaveLength(data.subjects.length);
    expect(scoreNote({ percent: null, position: null })).toBe("no scores yet");
  });

  it("flags subjects whose scores are only partly published", () => {
    const data = makeSubjects("partial");
    render(<SubjectsView data={data} />);
    expect(screen.getAllByText("Not every score is out yet")).toHaveLength(data.subjects.length);
    const maths = screen.getByRole("link", { name: /^Advance Maths/ });
    expect(within(maths).getByText("62.5%")).toBeInTheDocument();
  });

  it("says so when the class has no subjects", () => {
    render(<SubjectsView data={{ ...makeSubjects("normal"), subjects: [] }} />);
    expect(screen.getByText("No subjects yet")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
