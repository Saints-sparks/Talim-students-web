import React from "react";
import { act, fireEvent, mockStudent, render, screen, waitFor, within } from "@/test-utils/render";
import FilesScreen, { resultLine, subjectOptions } from "@/components/screens/files/FilesScreen";
import { SEARCH_DEBOUNCE_MS } from "@/components/screens/files/useFileFilters";
import { extensionOf, fileMetaLine, fileTypeLabel } from "@/lib/files/fileMeta";
import { makeFiles, makeSubjects } from "@/lib/fixtures/learner.fixture";
import type { FixtureVariant } from "@/lib/fixtures/flag";
import { learnerService } from "@/services/learner.service";

const mockRouter = { push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() };
const mockMarkStepComplete = jest.fn();
let mockSearch = "";

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/files",
  useSearchParams: () => new URLSearchParams(mockSearch),
  useParams: () => ({}),
}));

jest.mock("@/contexts/ChatContext", () => ({
  useChatContext: () => ({ refreshChatRooms: jest.fn() }),
}));

jest.mock("@/contexts/OnboardingContext", () => ({
  useStudentOnboarding: () => ({ markStepComplete: mockMarkStepComplete }),
}));

jest.mock("@/services/learner.service", () => ({
  learnerService: {
    getFiles: jest.fn(),
    getSubjects: jest.fn(),
    downloadFilesArchive: jest.fn(),
    recordFileView: jest.fn(),
  },
}));

const service = learnerService as jest.Mocked<typeof learnerService>;
let variant: FixtureVariant = "normal";
let pageSize: number | undefined;

/**
 * Renders the Files screen for a student in Jss1 A.
 *
 * @returns The render result.
 */
function renderFiles() {
  return render(<FilesScreen />, { user: { ...mockStudent, className: "Jss1 A" } });
}

/**
 * The file rows on screen.
 *
 * @returns The list items of the Files list.
 */
function rows() {
  return within(screen.getByRole("list", { name: "Files" })).getAllByRole("listitem");
}

beforeEach(() => {
  jest.clearAllMocks();
  variant = "normal";
  pageSize = undefined;
  mockSearch = "";
  service.getFiles.mockImplementation(async (params = {}) => makeFiles(variant, { ...params, limit: pageSize ?? params.limit }));
  service.getSubjects.mockImplementation(async () => makeSubjects("normal"));
  service.recordFileView.mockResolvedValue({ counted: true, viewCount: 1 });
  service.downloadFilesArchive.mockResolvedValue({ blob: new Blob(["zip"]), fileName: "talim-files.zip" });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("Files screen", () => {
  it("lists every shared file with its subject, teacher, type, date and size, and the count", async () => {
    renderFiles();
    expect(screen.getByRole("heading", { level: 1, name: "Files" })).toBeInTheDocument();
    expect(screen.getByText("Everything your teachers shared with Jss1 A.")).toBeInTheDocument();
    await screen.findByRole("list", { name: "Files" });
    const all = rows();
    expect(all).toHaveLength(6);
    expect(all[0]).toHaveTextContent("Spreadsheet practice file");
    expect(within(all[0]).getByText("Miss Chidinma Okafor · XLSX · 11 Sep 2026 · 86 KB")).toBeInTheDocument();
    expect(within(all[0]).getByTitle("Computer Studies")).toHaveTextContent("CMP101");
    expect(screen.getByRole("status")).toHaveTextContent("6 files shared this term.");
    expect(screen.queryByRole("navigation", { name: "Pages of files" })).not.toBeInTheDocument();
  });

  it("waits for typing to pause before searching, then keeps the search in the address", async () => {
    jest.useFakeTimers();
    renderFiles();
    await screen.findByRole("list", { name: "Files" });
    fireEvent.change(screen.getByLabelText("Search files"), { target: { value: "indices" } });

    act(() => {
      jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 50);
    });
    expect(service.getFiles).not.toHaveBeenCalledWith(expect.objectContaining({ q: "indices" }));

    act(() => {
      jest.advanceTimersByTime(50);
    });
    await waitFor(() => expect(rows()).toHaveLength(1));
    expect(service.getFiles).toHaveBeenCalledWith(expect.objectContaining({ q: "indices", page: 1 }));
    expect(rows()[0]).toHaveTextContent("Indices worksheet");
    expect(screen.getByRole("status")).toHaveTextContent("1 file matches “indices”.");
    expect(mockRouter.replace).toHaveBeenCalledWith("/files?q=indices", { scroll: false });
  });

  it("filters by subject, names the subject on Download all, and keeps it in the address", async () => {
    renderFiles();
    await screen.findByRole("list", { name: "Files" });
    const select = screen.getByLabelText("Subject");
    await within(select).findByRole("option", { name: "Biology" });
    fireEvent.change(select, { target: { value: "course-bio-3" } });

    await waitFor(() => expect(rows()).toHaveLength(1));
    expect(rows()[0]).toHaveTextContent("Cell structure diagram");
    expect(service.getFiles).toHaveBeenCalledWith(expect.objectContaining({ courseId: "course-bio-3" }));
    expect(screen.getByRole("button", { name: "Download all Biology files" })).toBeInTheDocument();
    expect(mockRouter.replace).toHaveBeenCalledWith("/files?course=course-bio-3", { scroll: false });
  });

  it("opens on the subject a notification linked to", async () => {
    mockSearch = "course=course-mth-18";
    renderFiles();
    await waitFor(() => expect(rows()).toHaveLength(1));
    expect(service.getFiles).toHaveBeenCalledWith(expect.objectContaining({ courseId: "course-mth-18" }));
    expect(rows()[0]).toHaveTextContent("Indices worksheet");
    await waitFor(() => expect(screen.getByLabelText("Subject")).toHaveValue("course-mth-18"));
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });

  it("says nothing is shared yet when the class has no files", async () => {
    variant = "empty";
    renderFiles();
    expect(await screen.findByText("Nothing shared with your class yet.")).toBeInTheDocument();
    expect(screen.getByText("Files your teachers share appear here.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download all" })).toBeDisabled();
  });

  it("says when nothing matches, and Clear search brings the list back", async () => {
    renderFiles();
    await screen.findByRole("list", { name: "Files" });
    const search = screen.getByLabelText("Search files");
    fireEvent.change(search, { target: { value: "zzz" } });
    expect(await screen.findByText("No files match “zzz”.", { selector: "p:not([role])" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    await waitFor(() => expect(rows()).toHaveLength(6));
    expect(search).toHaveValue("");
    expect(search).toHaveFocus();
  });

  it("opens a file and records the view", async () => {
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    renderFiles();
    await screen.findByRole("list", { name: "Files" });
    fireEvent.click(screen.getByRole("button", { name: "Download Spreadsheet practice file" }));
    expect(open).toHaveBeenCalledWith("https://res.cloudinary.com/talim/raw/upload/practice.xlsx", "_blank", "noopener,noreferrer");
    expect(service.recordFileView).toHaveBeenCalledWith("res-cmp-1");
    expect(mockMarkStepComplete).toHaveBeenCalledWith("download-resource");
    open.mockRestore();
  });

  it("downloads every file as one zip, showing that it is preparing", async () => {
    const createObjectURL = jest.fn(() => "blob:files");
    const revokeObjectURL = jest.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    let finish: (value: { blob: Blob; fileName: string }) => void = () => undefined;
    service.downloadFilesArchive.mockImplementation(() => new Promise((resolve) => (finish = resolve)));

    renderFiles();
    await screen.findByRole("list", { name: "Files" });
    fireEvent.click(screen.getByRole("button", { name: "Download all" }));
    expect(await screen.findByRole("button", { name: "Preparing zip…" })).toHaveAttribute("aria-busy", "true");
    expect(service.downloadFilesArchive).toHaveBeenCalledWith(undefined);

    await act(async () => finish({ blob: new Blob(["zip"]), fileName: "talim-files.zip" }));
    expect(await screen.findByRole("button", { name: "Download all" })).toBeInTheDocument();
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it("pages through a long list", async () => {
    pageSize = 4;
    renderFiles();
    await screen.findByRole("list", { name: "Files" });
    const pager = screen.getByRole("navigation", { name: "Pages of files" });
    expect(pager).toHaveTextContent("Page 1 of 2");
    expect(within(pager).getByRole("button", { name: "Previous" })).toBeDisabled();
    fireEvent.click(within(pager).getByRole("button", { name: "Next" }));
    await waitFor(() => expect(screen.getByRole("navigation", { name: "Pages of files" })).toHaveTextContent("Page 2 of 2"));
    expect(service.getFiles).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }));
    expect(rows()).toHaveLength(2);
  });
});

describe("file helpers", () => {
  it("names the type from the address, then the MIME type, then the kind", () => {
    expect(extensionOf("https://x.test/a/letter.docx?sig=1")).toBe("DOCX");
    expect(fileTypeLabel({ url: null, mimeType: "application/pdf", kind: "pdf" })).toBe("PDF");
    expect(fileTypeLabel({ url: "https://x.test/download", mimeType: null, kind: "slides" })).toBe("Slides");
    const [file] = makeFiles("normal", { q: "indices" }).data;
    expect(fileMetaLine(file)).toBe("PDF · 12 May 2026 · 471 KB");
    expect(resultLine(0, "")).toBe("0 files shared this term.");
  });

  it("keeps a subject from the address in the filter before B3 lists it", () => {
    expect(subjectOptions(undefined, "course-x", undefined)).toEqual([{ id: "course-x", title: "Selected subject" }]);
    expect(subjectOptions(makeSubjects().subjects, "", undefined)).toHaveLength(12);
  });
});
