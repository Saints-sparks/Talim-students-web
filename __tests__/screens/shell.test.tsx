import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@/test-utils/render";
import AppShell from "@/components/shell/AppShell";
import { accountService } from "@/services/account.service";
import { AuthContext } from "@/contexts/AuthContext";
import { mockStudent } from "@/test-utils/render";

let pathname = "/subjects/course-mth-18";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => pathname,
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("@/contexts/ChatContext", () => ({ useChatContext: () => ({ totalUnread: 5 }) }));
jest.mock("@/services/account.service", () => ({ accountService: { getNotificationCounts: jest.fn() } }));
jest.mock("@/components/onboarding/AppGuide", () => ({ __esModule: true, default: () => null }));

const counts = accountService.getNotificationCounts as jest.Mock;

/**
 * Makes `(max-width: 979px)` match, as on a phone.
 *
 * @param narrow - Whether the drawer breakpoint matches.
 */
function setNarrow(narrow: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: narrow && query.includes("max-width: 979px"),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

const student = { ...mockStudent, schoolName: "Easy Sparks Education Center", firstName: "Musa", lastName: "Adele" };

describe("portal shell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pathname = "/subjects/course-mth-18";
    counts.mockResolvedValue({ all: 4, unread: 2, byCategory: {} });
    setNarrow(false);
  });

  it("groups the sidebar as the design does and marks the current page", async () => {
    render(
      <AppShell>
        <p>Page</p>
      </AppShell>,
      { user: student }
    );
    const nav = screen.getAllByRole("navigation", { name: "Main" })[0];
    expect(within(nav).getByRole("heading", { name: "Learning" })).toBeInTheDocument();
    expect(within(nav).getByRole("heading", { name: "Progress" })).toBeInTheDocument();
    expect(within(nav).getByRole("heading", { name: "Community" })).toBeInTheDocument();
    expect(within(nav).getAllByRole("link").map((a) => a.textContent?.replace(/\d+, \d+ unread$/, "").trim())).toEqual([
      "Today",
      "Timetable",
      "Subjects",
      "Files",
      "Results",
      "Attendance",
      expect.stringMatching(/^Messages/),
      expect.stringMatching(/^Updates/),
    ]);
    // A subject's page lights up Subjects.
    expect(within(nav).getByRole("link", { name: "Subjects" })).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByRole("link", { name: /Account & settings/ })[0]).toHaveAttribute("href", "/settings");
  });

  it("shows the unread badges and the school in the top bar", async () => {
    render(
      <AppShell>
        <p>Page</p>
      </AppShell>,
      { user: student }
    );
    expect(screen.getByRole("link", { name: /Messages.*5 unread/ })).toHaveAttribute("href", "/messages");
    await waitFor(() => expect(screen.getByRole("link", { name: "Updates, 2 unread" })).toHaveAttribute("href", "/updates"));
    expect(screen.getByText("Easy Sparks Education Center")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Account and settings" })).toHaveTextContent("MA");
    expect(screen.getByRole("main")).toHaveTextContent("Page");
    // No call or video buttons anywhere in the shell.
    expect(screen.queryByRole("button", { name: /call/i })).not.toBeInTheDocument();
  });

  it("logs out through the auth context", async () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    render(
      <AuthContext.Provider
        value={{ user: student, isAuthenticated: true, isLoading: false, accessToken: "t", checkAuth: jest.fn(), logout, setAuthState: jest.fn() }}
      >
        <AppShell>
          <p>Page</p>
        </AppShell>
      </AuthContext.Provider>
    );
    await userEvent.click(screen.getByRole("button", { name: "Log out" }));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it("opens the menu as a dialog below 980px and closes it on Escape", async () => {
    setNarrow(true);
    render(
      <AppShell>
        <p>Page</p>
      </AppShell>,
      { user: student }
    );
    const menuButton = screen.getByRole("button", { name: "Open the menu" });
    await userEvent.click(menuButton);
    const dialog = await screen.findByRole("dialog", { name: "Menu" });
    expect(within(dialog).getByRole("link", { name: "Timetable" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument());
    expect(menuButton).toHaveFocus();
  });
});
