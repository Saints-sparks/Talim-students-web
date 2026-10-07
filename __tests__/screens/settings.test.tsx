import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@/test-utils/render";
import SettingsScreen from "@/components/screens/settings/SettingsScreen";
import { profileFields } from "@/components/screens/settings/AccountPanel";
import { sessionsValue } from "@/components/screens/settings/ActionPanels";
import { parseSettingsTab } from "@/components/screens/settings/settingsTabs";
import { rovingIndex } from "@/components/screens/settings/roving";
import { TourProvider } from "@/components/tour/TourProvider";
import { settingsService } from "@/services/settings.service";
import type { User } from "@/types/auth";

const mockReplace = jest.fn();
let mockSearch = "";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace, prefetch: jest.fn() }),
  usePathname: () => "/settings",
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

const mockSetPreference = jest.fn();
const mockNotificationState: { savingField: string | null; saveError: string | null } = { savingField: null, saveError: null };
jest.mock("@/hooks/useNotificationPreferences", () => ({
  useNotificationPreferences: () => ({
    preferences: {
      announcementsEnabled: true,
      attendanceEnabled: true,
      resultsEnabled: true,
      timetableEnabled: false,
      resourcesEnabled: true,
      messagesEnabled: true,
    },
    isLoading: false,
    loadError: null,
    saveError: mockNotificationState.saveError,
    savingField: mockNotificationState.savingField,
    set: mockSetPreference,
  }),
}));

jest.mock("@/services/tickets.service", () => {
  const { createTicketStore } = jest.requireActual("@/lib/fixtures/tickets.fixture");
  const store = createTicketStore();
  return { ticketsService: { listMine: jest.fn(async (query: object) => store.listMine(query)), get: jest.fn(async (id: string) => store.get(id)) } };
});

jest.mock("@/services/settings.service", () => ({
  settingsService: {
    changePassword: jest.fn(),
    getChatPreferences: jest.fn(),
    updateChatPreferences: jest.fn(),
  },
}));

const student: User = {
  userId: "user-1",
  id: "user-1",
  studentId: "student-1",
  firstName: "Musa",
  lastName: "Adele",
  email: "musa.adele@easysparks.edu.ng",
  role: "student",
  schoolName: "Easy Sparks Education Center",
  className: "Jss1 A",
  admissionNumber: "TAL/2026/JS1/0148",
  dateOfBirth: "2013-03-12T00:00:00.000Z",
};

beforeEach(() => {
  mockReplace.mockClear();
  mockSetPreference.mockClear();
  mockSearch = "";
  mockNotificationState.savingField = null;
  mockNotificationState.saveError = null;
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("Settings screen", () => {
  it("has one tab per section, without Learning or Downloads, and Account first", () => {
    render(<SettingsScreen />, { user: student });
    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Manage your profile, notifications, messages and account security.")).toBeInTheDocument();
    const tabs = within(screen.getByRole("tablist", { name: "Settings" })).getAllByRole("tab");
    expect(tabs).toHaveLength(7);
    for (const [index, name] of ["Account", "Notifications", "Messages", "Help", "Security", "Appearance", "About"].entries()) {
      expect(tabs[index]).toHaveAccessibleName(name);
    }
    expect(tabs[0]).toHaveAccessibleDescription("Profile and account info");
    expect(screen.queryByRole("tab", { name: /Learning|Downloads/ })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Account" })).toBeInTheDocument();
  });

  it("switches panels on click and keeps the tab in ?tab=", () => {
    render(<SettingsScreen />, { user: student });
    fireEvent.click(screen.getByRole("tab", { name: "Notifications" }));
    expect(screen.getByRole("tab", { name: "Notifications" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tabpanel", { name: "Notifications" })).toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith("/settings?tab=notifications", { scroll: false });
  });

  it("moves between tabs with the arrow keys, Home and End", () => {
    render(<SettingsScreen />, { user: student });
    const account = screen.getByRole("tab", { name: "Account" });
    expect(account).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "About" })).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(account, { key: "ArrowDown" });
    expect(screen.getByRole("tab", { name: "Notifications" })).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "Notifications" })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("tab", { name: "Notifications" }), { key: "End" });
    expect(screen.getByRole("tab", { name: "About" })).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "About" })).toBeInTheDocument();
    expect(rovingIndex("ArrowUp", 0, 7)).toBe(6);
    expect(rovingIndex("Tab", 0, 7)).toBeNull();
  });

  it("opens the tab named in the URL and falls back to Account", () => {
    mockSearch = "tab=security";
    render(<SettingsScreen />, { user: student });
    expect(screen.getByRole("tabpanel", { name: "Security" })).toBeInTheDocument();
    expect(parseSettingsTab("learning")).toBe("account");
    expect(parseSettingsTab(null)).toBe("account");
  });

  it("shows the profile from the session, with dashes for what is missing", () => {
    render(<SettingsScreen />, { user: student });
    const panel = screen.getByRole("tabpanel", { name: "Account" });
    expect(within(panel).getAllByText("Musa Adele")).toHaveLength(2);
    expect(within(panel).getByText("Student · Jss1 A · Easy Sparks Education Center")).toBeInTheDocument();
    expect(within(panel).getByRole("button", { name: "Change photo" })).toBeInTheDocument();
    expect(within(panel).getByText("12 March 2013")).toBeInTheDocument();
    expect(within(panel).getByText("TAL/2026/JS1/0148")).toBeInTheDocument();
    expect(within(panel).getByText(/set by your school office/)).toBeInTheDocument();
    expect(profileFields(student).find((field) => field.label === "Phone")?.value).toBe("—");
    expect(profileFields(null).map((field) => field.value)).toEqual(["—", "—", "—", "—", "—", "—"]);
  });

  it("saves each notification switch to its own preference field", () => {
    mockSearch = "tab=notifications";
    render(<SettingsScreen />, { user: student });
    const results = screen.getByRole("switch", { name: "Result updates" });
    expect(results).toHaveAttribute("aria-checked", "true");
    expect(results).toHaveAccessibleDescription("When a new score is published.");
    fireEvent.click(results);
    expect(mockSetPreference).toHaveBeenCalledWith("resultsEnabled", false);
    fireEvent.click(screen.getByRole("switch", { name: "Class & timetable" }));
    expect(mockSetPreference).toHaveBeenCalledWith("timetableEnabled", true);
    fireEvent.click(screen.getByRole("switch", { name: "Files & assignments" }));
    expect(mockSetPreference).toHaveBeenCalledWith("resourcesEnabled", false);
    expect(screen.getByRole("heading", { name: "This browser" })).toBeInTheDocument();
    expect(screen.getByText("Browser notifications")).toBeInTheDocument();
  });

  it("disables the switch that is saving and announces a failed save", () => {
    mockSearch = "tab=notifications";
    mockNotificationState.savingField = "messagesEnabled";
    mockNotificationState.saveError = "Couldn't save that. Please try again.";
    render(<SettingsScreen />, { user: student });
    expect(screen.getByRole("switch", { name: "Messages" })).toBeDisabled();
    expect(screen.getByRole("switch", { name: "School announcements" })).toBeEnabled();
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't save that. Please try again.");
  });

  it("saves the messaging switches to the chat preferences", async () => {
    (settingsService.getChatPreferences as jest.Mock).mockResolvedValue({ showOnlineStatus: false, readReceipts: true, messagePreview: true });
    (settingsService.updateChatPreferences as jest.Mock).mockImplementation(async (patch) => patch);
    mockSearch = "tab=messages";
    render(<SettingsScreen />, { user: student });
    await waitFor(() => expect(screen.getByRole("switch", { name: "Show online status" })).toHaveAttribute("aria-checked", "false"));
    expect(screen.getByRole("switch", { name: "Message preview" })).toHaveAccessibleDescription("Show the message text in notifications.");
    fireEvent.click(screen.getByRole("switch", { name: "Message preview" }));
    await waitFor(() => expect(settingsService.updateChatPreferences).toHaveBeenCalledWith({ messagePreview: false }));
  });

  it("sets the theme from the Appearance cards", () => {
    mockSearch = "tab=appearance";
    render(<SettingsScreen />, { user: student });
    const group = screen.getByRole("radiogroup", { name: "Appearance" });
    const dark = within(group).getByRole("radio", { name: "Dark" });
    expect(within(group).getByRole("radio", { name: "System" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(dark);
    expect(dark).toHaveAttribute("aria-checked", "true");
    expect(localStorage.getItem("talim_student_theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
    fireEvent.keyDown(dark, { key: "ArrowLeft" });
    expect(within(group).getByRole("radio", { name: "Light" })).toHaveAttribute("aria-checked", "true");
    expect(within(group).getByRole("radio", { name: "Light" })).toHaveFocus();
    expect(localStorage.getItem("talim_student_theme")).toBe("light");
  });

  it("replays the tour from Help, and has no help-centre row", async () => {
    mockSearch = "tab=help";
    render(
      <TourProvider>
        <SettingsScreen />
      </TourProvider>,
      { user: student }
    );
    expect(screen.queryByRole("button", { name: /Help centre/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Getting started guide/ }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Getting started")).toBeInTheDocument();
    expect(within(dialog).getByText("Step 1 of 8")).toBeInTheDocument();
  });

  it("shows the app version and platform, and the session count only once known", () => {
    mockSearch = "tab=about";
    render(<SettingsScreen />, { user: student });
    expect(screen.getByText("App version")).toBeInTheDocument();
    expect(screen.getByText("Talim Students Web")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Privacy Policy/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Terms of Service/ })).toBeInTheDocument();
    expect(sessionsValue(undefined)).toBe("Manage");
    expect(sessionsValue(1)).toBe("1 device");
    expect(sessionsValue(3)).toBe("3 devices");
  });
});
