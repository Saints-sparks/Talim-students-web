import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@/test-utils/render";
import SettingsScreen from "@/components/screens/settings/SettingsScreen";
import { PasswordSheet, passwordNote } from "@/components/screens/settings/PasswordSheet";
import { SessionsSheet, sessionDetail, sessionTitle } from "@/components/screens/settings/SessionsSheet";
import { ReportSheet } from "@/components/screens/settings/ReportSheet";
import { ContactSheet, officeHoursLine, telHref } from "@/components/screens/settings/ContactSheet";
import { PhotoSheet, photoProblem } from "@/components/screens/settings/PhotoSheet";
import { accountService } from "@/services/account.service";
import { settingsService } from "@/services/settings.service";
import { learnerService } from "@/services/learner.service";
import { ApiError } from "@/lib/apiError";
import { APP_VERSION } from "@/lib/appInfo";
import { makeSchoolContact, makeSessions } from "@/lib/fixtures/learner.fixture";

let mockSearch = "";
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/settings",
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

jest.mock("@/services/account.service", () => ({
  accountService: {
    getPasswordPolicy: jest.fn(),
    getSessions: jest.fn(),
    revokeSession: jest.fn(),
    revokeOtherSessions: jest.fn(),
    createSupportTicket: jest.fn(),
    updateAvatar: jest.fn(),
  },
}));

jest.mock("@/services/settings.service", () => ({
  settingsService: { changePassword: jest.fn(), getChatPreferences: jest.fn(), updateChatPreferences: jest.fn() },
}));

jest.mock("@/services/learner.service", () => ({
  ...jest.requireActual("@/services/learner.service"),
  learnerService: { getSchoolContact: jest.fn() },
}));

jest.mock("@/components/CustomToast", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const mocked = <T extends (...args: never[]) => unknown>(fn: T) => fn as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockSearch = "";
});

describe("Change password sheet", () => {
  const policy = { minLength: 10, requireUppercase: true, requireLowercase: true, requireNumber: true, requireSymbol: false, historyCount: 1 };

  it("lists the API's rules and sends all three fields once they pass", async () => {
    mocked(accountService.getPasswordPolicy).mockResolvedValue(policy);
    mocked(settingsService.changePassword).mockResolvedValue({ access_token: "fresh-token", message: "Password changed" });
    render(<PasswordSheet open onOpenChange={jest.fn()} />);

    const dialog = screen.getByRole("dialog", { name: "Change password" });
    expect(await within(dialog).findByText("At least 10 characters")).toBeInTheDocument();
    expect(within(dialog).queryByText("A symbol")).not.toBeInTheDocument();

    const current = within(dialog).getByLabelText("Current password");
    const next = within(dialog).getByLabelText("New password");
    const confirm = within(dialog).getByLabelText("Confirm new password");
    expect(current).toHaveAttribute("autocomplete", "current-password");
    expect(next).toHaveAttribute("type", "password");
    expect(confirm).toHaveAttribute("autocomplete", "new-password");

    fireEvent.click(within(dialog).getByRole("button", { name: "Show new password" }));
    expect(next).toHaveAttribute("type", "text");

    const update = within(dialog).getByRole("button", { name: "Update password" });
    fireEvent.change(current, { target: { value: "OldPass12" } });
    fireEvent.change(next, { target: { value: "Short1" } });
    expect(update).toBeDisabled();
    fireEvent.change(next, { target: { value: "Newpassword1" } });
    fireEvent.change(confirm, { target: { value: "Newpassword" } });
    expect(within(dialog).getByText("The two new passwords do not match yet.")).toBeInTheDocument();
    expect(update).toBeDisabled();
    fireEvent.change(confirm, { target: { value: "Newpassword1" } });
    expect(update).toBeEnabled();

    fireEvent.click(update);
    await waitFor(() =>
      expect(settingsService.changePassword).toHaveBeenCalledWith({
        currentPassword: "OldPass12",
        newPassword: "Newpassword1",
        confirmPassword: "Newpassword1",
      })
    );
    expect(await within(dialog).findByText("Password updated")).toBeInTheDocument();
    expect(within(dialog).getByText("Use your new password next time you sign in. Other devices have been signed out.")).toBeInTheDocument();
  });

  it("falls back to the built-in rules and shows the server's refusal", async () => {
    mocked(accountService.getPasswordPolicy).mockRejectedValue(new ApiError("SERVICE_UNAVAILABLE", "", 503));
    mocked(settingsService.changePassword).mockRejectedValue(new ApiError("VALIDATION_FAILED", "Your current password is not right.", 400));
    render(<PasswordSheet open onOpenChange={jest.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Change password" });
    expect(await within(dialog).findByText(/the usual ones are shown/)).toBeInTheDocument();
    expect(within(dialog).getByText("At least 8 characters")).toBeInTheDocument();
    expect(within(dialog).getByText("A symbol")).toBeInTheDocument();

    fireEvent.change(within(dialog).getByLabelText("Current password"), { target: { value: "wrong" } });
    fireEvent.change(within(dialog).getByLabelText("New password"), { target: { value: "Newpass1!" } });
    fireEvent.change(within(dialog).getByLabelText("Confirm new password"), { target: { value: "Newpass1!" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Update password" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("Your current password is not right.");
  });

  it("explains what is missing in one line", () => {
    expect(passwordNote("", "", false)).toBe("You will stay signed in on this device.");
    expect(passwordNote("abc", "", false)).toMatch(/everything on the list/);
    expect(passwordNote("Abcdefgh1!", "Abc", true)).toBe("The two new passwords do not match yet.");
    expect(passwordNote("Abcdefgh1!", "Abcdefgh1!", true)).toBe("Looks good.");
  });
});

describe("Active sessions sheet", () => {
  it("lists the sessions, marks this device and signs another one out", async () => {
    mocked(accountService.getSessions).mockResolvedValue(makeSessions());
    mocked(accountService.revokeSession).mockResolvedValue({ id: "sess-phone", revoked: true, current: false });
    render(<SessionsSheet open onOpenChange={jest.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Active sessions" });

    const list = await within(dialog).findByRole("list", { name: "Signed-in devices" });
    const rows = within(list).getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText("Chrome on macOS")).toBeInTheDocument();
    expect(within(rows[0]).getByText("This device")).toBeInTheDocument();
    expect(within(rows[0]).queryByRole("button")).not.toBeInTheDocument();
    expect(within(rows[1]).getByText("Talim app on iOS")).toBeInTheDocument();
    expect(within(rows[1]).getByText(/iPhone · Last active .* · 102\.89\.3\.44/)).toBeInTheDocument();

    fireEvent.click(within(rows[1]).getByRole("button", { name: "Sign out of Talim app on iOS" }));
    await waitFor(() => expect(accountService.revokeSession).toHaveBeenCalledWith("sess-phone"));
    expect(await within(dialog).findByText("Signed out of Talim app on iOS.")).toBeInTheDocument();
  });

  it("signs out of every other device after an inline confirmation", async () => {
    mocked(accountService.getSessions).mockResolvedValue(makeSessions());
    mocked(accountService.revokeOtherSessions).mockResolvedValue({ revoked: 1 });
    render(<SessionsSheet open onOpenChange={jest.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Active sessions" });
    await within(dialog).findByText("Chrome on macOS");

    fireEvent.click(within(dialog).getByRole("button", { name: "Sign out of all other devices" }));
    expect(within(dialog).getByText("Sign out of 1 other device? You'll stay signed in here.")).toBeInTheDocument();
    expect(accountService.revokeOtherSessions).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole("button", { name: "Yes, sign them out" }));
    await waitFor(() => expect(accountService.revokeOtherSessions).toHaveBeenCalledTimes(1));
    expect(await within(dialog).findByText("Signed out of 1 other device.")).toBeInTheDocument();
  });

  it("says when this is the only device", async () => {
    mocked(accountService.getSessions).mockResolvedValue(makeSessions().filter((session) => session.current));
    render(<SessionsSheet open onOpenChange={jest.fn()} />);
    expect(await screen.findByText("You're only signed in on this device.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign out of all other devices" })).not.toBeInTheDocument();
  });

  it("words each session from what the API sent", () => {
    const [current] = makeSessions();
    expect(sessionTitle(current)).toBe("Chrome on macOS");
    expect(sessionTitle({ ...current, browser: null, os: null })).toBe("Mac");
    expect(sessionDetail(current, new Date("2026-09-14T12:00:00Z"))).toBe("Mac · Last active today · 102.89.1.10");
    expect(sessionDetail({ ...current, device: null, ip: null }, new Date("2026-10-01T12:00:00Z"))).toBe("Last active 14 Sep");
  });
});

describe("Report a problem sheet", () => {
  it("sends the area, the description and the page context, then shows the reference", async () => {
    mocked(accountService.createSupportTicket).mockResolvedValue({ reference: "TS-7KQ2P", createdAt: "2026-10-01T09:00:00.000Z" });
    render(<ReportSheet open onOpenChange={jest.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Tell Talim what is not working" });

    const areas = within(dialog).getByRole("radiogroup", { name: "Where did it happen?" });
    expect(within(areas).getByRole("radio", { name: "Results" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(within(areas).getByRole("radio", { name: "Attendance" }));
    expect(within(areas).getByRole("radio", { name: "Attendance" })).toHaveAttribute("aria-checked", "true");
    expect(within(dialog).getByText("We reply to ada@talim.test. Your school can't see this report.")).toBeInTheDocument();

    const send = within(dialog).getByRole("button", { name: "Send to Talim support" });
    const box = within(dialog).getByLabelText("What went wrong");
    expect(box).toHaveAttribute("placeholder", "e.g. My Biology results show a blank total.");
    fireEvent.change(box, { target: { value: "Too short" } });
    expect(send).toBeDisabled();
    fireEvent.change(box, { target: { value: "  My attendance for Monday shows absent.  " } });
    expect(within(dialog).getByText("42 / 2000")).toBeInTheDocument();
    expect(send).toBeEnabled();

    fireEvent.click(send);
    await waitFor(() =>
      expect(accountService.createSupportTicket).toHaveBeenCalledWith({
        area: "attendance",
        description: "My attendance for Monday shows absent.",
        context: expect.objectContaining({ appVersion: APP_VERSION, path: expect.any(String), userAgent: expect.any(String) }),
      })
    );
    expect(await within(dialog).findByText("Report sent")).toBeInTheDocument();
    expect(within(dialog).getByText("Talim support will reply to ada@talim.test within one working day.")).toBeInTheDocument();
    expect(within(dialog).getByText("TS-7KQ2P")).toBeInTheDocument();
  });
});

describe("Contact support sheet", () => {
  it("shows the school office's call, email and map links and Talim support", async () => {
    mocked(learnerService.getSchoolContact).mockResolvedValue(makeSchoolContact());
    render(<ContactSheet open onOpenChange={jest.fn()} />);
    const dialog = await screen.findByRole("dialog", { name: "Easy Sparks Education Center" });
    expect(dialog).toHaveAccessibleDescription("The school office, Monday to Friday, 8:00 – 16:00.");
    expect(within(dialog).getByRole("link", { name: "Call the school office" })).toHaveAttribute("href", "tel:+2349075783540");
    expect(within(dialog).getByRole("link", { name: "Email the school office" })).toHaveAttribute("href", "mailto:office@easysparks.edu.ng");
    const map = within(dialog).getByRole("link", { name: /Map of the school's address/ });
    expect(map).toHaveAttribute("href", "https://maps.google.com/?q=14%20Ikorodu%20Road%2C%20Lagos");
    expect(map).toHaveAttribute("target", "_blank");
    expect(within(dialog).getByRole("link", { name: "Email Talim support" })).toHaveAttribute("href", "mailto:support@mytalim.com");
    expect(within(dialog).getByText(/For a fault in the portal itself, use Report a problem\./)).toBeInTheDocument();
  });

  it("leaves out what the school has not recorded", async () => {
    mocked(learnerService.getSchoolContact).mockResolvedValue({ ...makeSchoolContact(), phone: null, address: null, officeHours: null });
    render(<ContactSheet open onOpenChange={jest.fn()} />);
    const dialog = await screen.findByRole("dialog", { name: "Easy Sparks Education Center" });
    expect(within(dialog).queryByRole("link", { name: "Call the school office" })).not.toBeInTheDocument();
    expect(within(dialog).queryByRole("link", { name: /Map/ })).not.toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: "Email the school office" })).toBeInTheDocument();
    expect(officeHoursLine(null)).toBe("The school office.");
    expect(telHref("+234 (0) 802-415")).toBe("tel:+2340802415");
  });
});

describe("Change photo sheet", () => {
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  beforeAll(() => {
    URL.createObjectURL = jest.fn(() => "blob:preview");
    URL.revokeObjectURL = jest.fn();
  });
  afterAll(() => {
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  });

  it("previews the picked photo and shows why the upload failed", async () => {
    const onOpenChange = jest.fn();
    render(<PhotoSheet open onOpenChange={onOpenChange} />);
    const dialog = screen.getByRole("dialog", { name: "Change photo" });
    const save = within(dialog).getByRole("button", { name: "Save photo" });
    expect(save).toBeDisabled();

    const input = within(dialog).getByLabelText("Choose a photo");
    expect(input).toHaveAttribute("accept", "image/*");
    fireEvent.change(input, { target: { files: [new File(["x"], "me.png", { type: "image/png" })] } });
    expect(within(dialog).getByRole("img", { name: "Your new photo" })).toHaveAttribute("src", "blob:preview");
    expect(save).toBeEnabled();

    // No Cloudinary settings in tests, so the upload reports that.
    fireEvent.click(save);
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("Photo uploads aren't set up for this app yet.");
    expect(accountService.updateAvatar).not.toHaveBeenCalled();

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
  });

  it("refuses files that are not pictures", () => {
    expect(photoProblem(new File(["x"], "notes.pdf", { type: "application/pdf" }))).toMatch(/Choose a picture/);
    expect(photoProblem(new File(["x"], "me.jpg", { type: "image/jpeg" }))).toBeNull();
  });
});

describe("Sheets opened from the screen", () => {
  it("opens the password sheet from Security", async () => {
    mocked(accountService.getPasswordPolicy).mockResolvedValue({ minLength: 8, requireUppercase: false, requireLowercase: false, requireNumber: true, requireSymbol: false, historyCount: 0 });
    mockSearch = "tab=security";
    render(<SettingsScreen />);
    expect(screen.getByRole("button", { name: /Active sessions/ })).toHaveTextContent("Manage");
    fireEvent.click(screen.getByRole("button", { name: /Change password/ }));
    expect(await screen.findByRole("dialog", { name: "Change password" })).toBeInTheDocument();
  });

  it("opens the privacy policy from About", () => {
    mockSearch = "tab=about";
    render(<SettingsScreen />);
    fireEvent.click(screen.getByRole("button", { name: /Privacy Policy/ }));
    const dialog = screen.getByRole("dialog", { name: "Privacy Policy" });
    expect(within(dialog).getByRole("heading", { name: "Who can see what" })).toBeInTheDocument();
    expect(within(dialog).getByText(/Your parents or guardians see your published results and your attendance\./)).toBeInTheDocument();
  });
});
