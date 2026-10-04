import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@/test-utils/render";
import UpdatesScreen from "@/components/screens/updates/UpdatesScreen";
import { actionFor, attachmentName } from "@/components/screens/updates/updates";
import { makeNotificationCounts, makeRawNotifications } from "@/lib/fixtures/learner.fixture";
import { normalizeNotification } from "@/lib/notifications/normalize";
import { accountService } from "@/services/account.service";
import { notificationService } from "@/services/notification.service";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/updates",
  useSearchParams: () => new URLSearchParams(),
}));

const mockMarkStepComplete = jest.fn();
jest.mock("@/contexts/OnboardingContext", () => ({
  useStudentOnboarding: () => ({ markStepComplete: mockMarkStepComplete }),
}));

jest.mock("@/services/notification.service", () => ({
  notificationService: {
    getNotifications: jest.fn(),
    markNotificationAsRead: jest.fn(),
  },
}));

jest.mock("@/services/account.service", () => ({
  accountService: {
    getNotificationCounts: jest.fn(),
    markAllNotificationsRead: jest.fn(),
  },
}));

const svc = jest.mocked(notificationService);
const account = jest.mocked(accountService);

/**
 * Feeds the two inbox endpoints.
 *
 * @param variant - "normal" (the design's four updates) or "empty".
 */
function serve(variant: "normal" | "empty" = "normal") {
  // A small in-memory server: reads change what the next fetch returns, as
  // the API's would, so the refetch after a read does not undo it.
  const notifications = makeRawNotifications(variant);
  svc.getNotifications.mockImplementation(async () => ({ data: notifications.map((n) => ({ ...n })) }));
  svc.markNotificationAsRead.mockImplementation(async (_token, id) => {
    const found = notifications.find((n) => n._id === id);
    if (found) found.isRead = true;
    return null;
  });
  account.markAllNotificationsRead.mockImplementation(async () => {
    notifications.forEach((n) => (n.isRead = true));
    return { updated: 2, message: "Marked as read" };
  });
  account.getNotificationCounts.mockResolvedValue(makeNotificationCounts(variant));
}

/**
 * The list's rows, top to bottom.
 *
 * @returns The row buttons.
 */
function rows() {
  return within(screen.getByRole("region", { name: /updates$/ })).getAllByRole("button");
}

/**
 * Sets whether the window is wide (980px and up).
 *
 * @param wide - The answer `matchMedia` gives.
 */
function setWide(wide: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: wide && query.includes("min-width: 980px"),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  jest.clearAllMocks();
  setWide(false);
  serve();
});

describe("Updates screen", () => {
  it("lists every update, newest first, and completes the onboarding step", async () => {
    render(<UpdatesScreen />);
    expect(await screen.findByText("New file in Computer Studies")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Updates" })).toBeInTheDocument();
    expect(screen.getByText("Announcements from your school and alerts from Talim.")).toBeInTheDocument();
    expect(rows().map((row) => row.textContent)).toEqual([
      expect.stringMatching(/^New file in Computer Studies \(unread\)/),
      expect.stringMatching(/^New assessment: 1st CA \(unread\)/),
      expect.stringMatching(/^Results published for Civic Education1st CA/),
      expect.stringMatching(/^Assembly moves to 8:15Tomorrow/),
    ]);
    expect(screen.getByRole("button", { name: "All 4" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Unread 2" })).toHaveAttribute("aria-pressed", "false");
    expect(mockMarkStepComplete).toHaveBeenCalledWith("view-notifications");
  });

  it("narrows the list with the filter chips", async () => {
    const user = userEvent.setup();
    render(<UpdatesScreen />);
    await screen.findByText("New file in Computer Studies");

    await user.click(screen.getByRole("button", { name: "Assessments 1" }));
    expect(screen.getByRole("button", { name: "Assessments 1" })).toHaveAttribute("aria-pressed", "true");
    expect(rows()).toHaveLength(1);
    expect(rows()[0]).toHaveTextContent("New assessment: 1st CA");

    await user.click(screen.getByRole("button", { name: "Unread 2" }));
    expect(rows()).toHaveLength(2);
    expect(rows().map((r) => r.textContent)).toEqual([
      expect.stringContaining("New file in Computer Studies"),
      expect.stringContaining("New assessment: 1st CA"),
    ]);

    await user.click(screen.getByRole("button", { name: "School 1" }));
    expect(rows()).toHaveLength(1);
    expect(rows()[0]).toHaveTextContent("Assembly moves to 8:15");
  });

  it("says when a filter has nothing", async () => {
    const user = userEvent.setup();
    svc.getNotifications.mockResolvedValue({ data: makeRawNotifications().filter((n) => n.category !== "announcement") });
    render(<UpdatesScreen />);
    await screen.findByText("New file in Computer Studies");
    await user.click(screen.getByRole("button", { name: "School 0" }));
    expect(screen.getByText("Nothing in School yet.")).toBeInTheDocument();
  });

  it("opens an update, marks it read and links to where it points", async () => {
    const user = userEvent.setup();
    render(<UpdatesScreen />);
    await user.click(await screen.findByRole("button", { name: /New file in Computer Studies/ }));

    const detail = screen.getByRole("region", { name: "New file in Computer Studies" });
    expect(within(detail).getByText("Files")).toBeInTheDocument();
    expect(within(detail).getByText("Miss Chidinma Okafor shared the spreadsheet practice file with Jss1 A.")).toBeInTheDocument();
    expect(within(detail).getByText("From Miss Chidinma Okafor")).toBeInTheDocument();
    expect(within(detail).getByText("Monday, 14 September 2026")).toBeInTheDocument();
    expect(within(detail).getByRole("link", { name: "Open Files" })).toHaveAttribute("href", "/files?course=course-cmp-18");
    expect(within(detail).getByRole("heading", { level: 2 })).toHaveFocus();

    await waitFor(() => expect(svc.markNotificationAsRead).toHaveBeenCalledWith(undefined, "nf-file"));
    expect(svc.markNotificationAsRead).toHaveBeenCalledTimes(1);
    expect(rows()[0]).toHaveAttribute("aria-current", "true");
    await waitFor(() => expect(screen.getByRole("button", { name: "Unread 1" })).toBeInTheDocument());
  });

  it("does not mark an update read again when it is opened twice or already read", async () => {
    const user = userEvent.setup();
    render(<UpdatesScreen />);
    await user.click(await screen.findByRole("button", { name: /Results published for Civic Education/ }));
    expect(screen.getByRole("link", { name: "Open Results" })).toHaveAttribute("href", "/results");
    await user.click(screen.getByRole("button", { name: /Assembly moves to 8:15/ }));
    expect(screen.getByRole("link", { name: "Open Messages" })).toHaveAttribute("href", "/messages?room=room-class");
    expect(svc.markNotificationAsRead).not.toHaveBeenCalled();
  });

  it("marks everything read with one read-all call and no per-item calls", async () => {
    const user = userEvent.setup();
    render(<UpdatesScreen />);
    await screen.findByText("New file in Computer Studies");
    const markAll = screen.getByRole("button", { name: "Mark all as read" });
    expect(markAll).toBeEnabled();

    await user.click(markAll);
    await waitFor(() => expect(account.markAllNotificationsRead).toHaveBeenCalledTimes(1));
    expect(svc.markNotificationAsRead).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole("button", { name: "Unread 0" })).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Mark all as read" })).toBeDisabled();
  });

  it("shows the newest update by default on a wide screen, without marking it read", async () => {
    setWide(true);
    render(<UpdatesScreen />);
    const detail = await screen.findByRole("region", { name: "New file in Computer Studies" });
    expect(within(detail).getByRole("link", { name: "Open Files" })).toBeInTheDocument();
    expect(svc.markNotificationAsRead).not.toHaveBeenCalled();
  });

  it("says when everything is caught up", async () => {
    serve("empty");
    render(<UpdatesScreen />);
    expect(await screen.findByText("You're all caught up.")).toBeInTheDocument();
    expect(screen.getByText("Announcements and alerts will appear here.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Mark all as read" })).not.toBeInTheDocument();
  });

  it("offers a retry when the inbox cannot load", async () => {
    svc.getNotifications.mockRejectedValue(new Error("offline"));
    render(<UpdatesScreen />);
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});

describe("Updates helpers", () => {
  it("has no button when the update points nowhere, and falls back to a page label", () => {
    const base = makeRawNotifications()[1];
    expect(actionFor(normalizeNotification({ ...base, metadata: {} }, "user-1"))).toBeNull();
    expect(actionFor(normalizeNotification({ ...base, metadata: { target: { page: "timetable" } } }, "user-1"))).toEqual({
      href: "/timetable",
      label: "Open Timetable",
    });
  });

  it("names an attachment by its file name", () => {
    expect(attachmentName("https://res.cloudinary.com/talim/raw/upload/term%20plan.pdf", 0)).toBe("term plan.pdf");
    expect(attachmentName("not a url", 1)).toBe("Attachment 2");
  });
});
