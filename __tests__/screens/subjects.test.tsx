import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@/test-utils/render";
import { SubjectsView, scoreNote } from "@/components/screens/subjects/SubjectsScreen";
import SubjectDetailScreen, { SubjectDetailView } from "@/components/screens/subjects/SubjectDetailScreen";
import { partialNote, scoreSummary } from "@/components/screens/subjects/ScoresCard";
import { makeSubjectDetail, makeSubjects } from "@/lib/fixtures/learner.fixture";
import { learnerService } from "@/services/learner.service";
import { ApiError } from "@/lib/apiError";
import type { StudentSubjectDetail } from "@/types/learner";

const mockPush = jest.fn();
const mockRefreshChatRooms = jest.fn();
const mockMarkStepComplete = jest.fn();
let mockParams: Record<string, string> = {};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/subjects",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => mockParams,
}));

jest.mock("@/contexts/ChatContext", () => ({
  useChatContext: () => ({ refreshChatRooms: mockRefreshChatRooms }),
}));

jest.mock("@/contexts/OnboardingContext", () => ({
  useStudentOnboarding: () => ({ markStepComplete: mockMarkStepComplete }),
}));

jest.mock("@/services/learner.service", () => ({
  learnerService: {
    getSubject: jest.fn(),
    openCourseGroup: jest.fn(),
    recordFileView: jest.fn(),
  },
}));

const service = learnerService as jest.Mocked<typeof learnerService>;

/**
 * A B4 fixture that must exist.
 *
 * @param courseId - The course.
 * @param variant - The fixture variant.
 * @returns The detail.
 */
function detailOf(courseId: string, variant: "normal" | "partial" | "empty" = "normal"): StudentSubjectDetail {
  const detail = makeSubjectDetail(courseId, variant);
  if (!detail) throw new Error(`No fixture for ${courseId}`);
  return detail;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = {};
  service.recordFileView.mockResolvedValue({ counted: true, viewCount: 1 });
});

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

describe("Subject detail screen", () => {
  it("shows the heading, one tile per assessment with its maximum from the API, and the total out of their sum", () => {
    render(<SubjectDetailView detail={detailOf("course-mth-18")} />);
    expect(screen.getByRole("heading", { level: 1, name: "Advance Maths" })).toBeInTheDocument();
    expect(screen.getByText("MTH222 · Mr Seyi Tinubu · First term")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Subjects" })).toHaveAttribute("href", "/subjects");

    const scores = screen.getByRole("region", { name: "Your scores in this subject" });
    const tiles = within(scores).getAllByRole("listitem");
    expect(tiles).toHaveLength(4);
    expect(tiles[0]).toHaveTextContent("1st CA15out of 20");
    expect(tiles[2]).toHaveTextContent("Exam40out of 60");
    expect(tiles[3]).toHaveTextContent("Total65 / 100");
    expect(within(tiles[3]).getByText("B")).toBeInTheDocument();
    expect(within(tiles[3]).getByText("65% · 3rd of 28")).toBeInTheDocument();
    expect(within(scores).queryByText("Not published yet")).not.toBeInTheDocument();
  });

  it("does not assume 20/20/60: the total is out of whatever the assessments add up to", () => {
    const detail = detailOf("course-mth-18");
    detail.assessments = [
      { id: "a1", name: "Test", maxScore: 30, score: 21, classAverage: null },
      { id: "a2", name: "Project", maxScore: 20, score: 18, classAverage: null },
    ];
    detail.total = 39;
    render(<SubjectDetailView detail={detail} />);
    expect(screen.getByText("out of 30")).toBeInTheDocument();
    expect(screen.getByText("39 / 50")).toBeInTheDocument();
  });

  it("marks unpublished scores and explains a partly published total", () => {
    render(<SubjectDetailView detail={detailOf("course-mth-18", "partial")} />);
    const scores = screen.getByRole("region", { name: "Your scores in this subject" });
    const exam = within(scores).getAllByRole("listitem")[2];
    expect(exam).toHaveTextContent("Exam—out of 60Not published yet");
    expect(within(scores).getByText("25 / 100")).toBeInTheDocument();
    expect(within(scores).getByText("2 of 3 scores are published. Your total counts only what's out so far.")).toBeInTheDocument();
    expect(partialNote(scoreSummary(detailOf("course-mth-18", "empty").assessments))).toBe("None of your scores are published yet.");
  });

  it("shows this week's topic, the weeks with what was taught, and the earlier notes", () => {
    render(<SubjectDetailView detail={detailOf("course-mth-18")} />);
    const scheme = screen.getByRole("region", { name: "What you're covering" });
    expect(within(scheme).getByRole("heading", { name: "Week 2: Indices and standard form" })).toBeInTheDocument();
    expect(within(scheme).getAllByRole("listitem")).toHaveLength(6);
    expect(within(scheme).getAllByText("Taught")).toHaveLength(1);
    expect(within(scheme).getByRole("heading", { name: "Earlier notes" })).toBeInTheDocument();
    expect(within(scheme).getByText("Updated 12 May 2026")).toBeInTheDocument();
    // The fixture's curriculum has no attachments, so there is no download button.
    expect(within(scheme).queryByRole("link", { name: /Download curriculum/ })).not.toBeInTheDocument();
  });

  it("links each curriculum attachment and says when there is no plan yet", () => {
    const withFile = detailOf("course-mth-18");
    withFile.legacyCurriculum = { content: "Notes", updatedAt: "2026-05-12T10:00:00.000Z", attachments: ["https://files.test/scheme.pdf"] };
    const { unmount } = render(<SubjectDetailView detail={withFile} />);
    expect(screen.getByRole("link", { name: "Download curriculum" })).toHaveAttribute("href", "https://files.test/scheme.pdf");
    unmount();

    const bare = detailOf("course-mth-18", "empty");
    bare.scheme = { currentWeek: null, weeks: [] };
    bare.legacyCurriculum = null;
    render(<SubjectDetailView detail={bare} />);
    expect(screen.getByText("Your teacher hasn't added this term's plan yet.")).toBeInTheDocument();
    expect(screen.getByText("Nothing shared yet")).toBeInTheDocument();
  });

  it("lists the teacher's files, downloads one and records the view", () => {
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    render(<SubjectDetailView detail={detailOf("course-mth-18")} />);
    const files = screen.getByRole("region", { name: "Files from Mr Seyi Tinubu" });
    expect(within(files).getByText("Indices worksheet")).toBeInTheDocument();
    expect(within(files).getByText("PDF · 12 May 2026 · 471 KB")).toBeInTheDocument();
    expect(within(files).getByRole("link", { name: "All files →" })).toHaveAttribute("href", "/files?course=course-mth-18");

    fireEvent.click(within(files).getByRole("button", { name: "Download Indices worksheet" }));
    expect(open).toHaveBeenCalledWith("https://res.cloudinary.com/talim/raw/upload/indices.pdf", "_blank", "noopener,noreferrer");
    expect(service.recordFileView).toHaveBeenCalledWith("res-mth-1");
    expect(mockMarkStepComplete).toHaveBeenCalledWith("download-resource");
    open.mockRestore();
  });

  it("goes straight to a subject's group when it has one", async () => {
    render(<SubjectDetailView detail={detailOf("course-mth-18")} />);
    const button = screen.getByRole("button", { name: "Message this subject" });
    expect(button).toHaveAttribute("title", "Open this subject's group chat");
    fireEvent.click(button);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/messages?room=room-mth"));
    expect(service.openCourseGroup).not.toHaveBeenCalled();
  });

  it("starts the group first for a subject that has none yet", async () => {
    let resolveOpen: (room: { _id: string }) => void = () => undefined;
    service.openCourseGroup.mockImplementation(
      () => new Promise((resolve) => (resolveOpen = resolve as typeof resolveOpen)) as ReturnType<typeof service.openCourseGroup>
    );
    render(<SubjectDetailView detail={detailOf("course-yor-4")} />);
    const button = screen.getByRole("button", { name: "Message this subject" });
    expect(button).toHaveAttribute("title", "Starts this subject's group chat");

    fireEvent.click(button);
    expect(await screen.findByRole("button", { name: "Opening…" })).toHaveAttribute("aria-busy", "true");
    expect(service.openCourseGroup).toHaveBeenCalledWith("course-yor-4");

    resolveOpen({ _id: "room-yor-new" });
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/messages?room=room-yor-new"));
    expect(mockRefreshChatRooms).toHaveBeenCalled();
  });

  it("says the subject cannot be found on a 404, with a way back", async () => {
    mockParams = { courseId: "course-nope" };
    service.getSubject.mockRejectedValue(new ApiError("NOT_FOUND", "Course not found", 404));
    render(<SubjectDetailScreen />);
    expect(await screen.findByText("We couldn't find that subject.")).toBeInTheDocument();
    expect(service.getSubject).toHaveBeenCalledWith("course-nope", undefined);
    expect(screen.getByRole("link", { name: "See all your subjects →" })).toHaveAttribute("href", "/subjects");
  });

  it("loads the subject named in the address", async () => {
    mockParams = { courseId: "course-mth-18" };
    service.getSubject.mockResolvedValue(detailOf("course-mth-18"));
    render(<SubjectDetailScreen />);
    expect(await screen.findByRole("heading", { level: 1, name: "Advance Maths" })).toBeInTheDocument();
  });
});
