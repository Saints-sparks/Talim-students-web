import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import SignInPage from "@/app/signin/page";
import { AuthContext, AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { DangerZone, DeleteAccountSheet } from "@/components/screens/settings/DeleteAccountSheet";
import { LegalSheet } from "@/components/screens/settings/LegalSheet";
import { AboutPanel } from "@/components/screens/settings/ActionPanels";
import { SignInFooter } from "@/components/auth/signin-ui";
import { accountService } from "@/services/account.service";
import { authService } from "@/services/auth.service";
import { unsubscribeBrowserPush } from "@/lib/webPush";
import { toast } from "@/components/CustomToast";
import { ApiError } from "@/lib/apiError";
import { makeTestQueryClient } from "@/test-utils/render";
import {
  DELETION_CANCELLED_MESSAGE,
  deletionErrorMessage,
  deletionNoticeFromSearch,
  deletionScheduledRoute,
} from "@/lib/auth/accountDeletion";

const push = jest.fn();
// One router object, as in the app: a new one per render would re-run the provider's mount effect.
const router = { push, replace: jest.fn(), prefetch: jest.fn() };
jest.mock("next/navigation", () => ({ useRouter: () => router, usePathname: () => "/settings" }));
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));
jest.mock("@/components/auth/SignInForm", () => ({ SignInForm: () => <form aria-label="Sign in" /> }));
jest.mock("@/services/account.service", () => ({ accountService: { requestDeletion: jest.fn(), logout: jest.fn() } }));
jest.mock("@/services/auth.service", () => ({ authService: { login: jest.fn(), introspect: jest.fn(), refresh: jest.fn() } }));
jest.mock("@/lib/webPush", () => ({ unsubscribeBrowserPush: jest.fn() }));
jest.mock("@/lib/webPushSync", () => ({ startWebPushSync: () => () => undefined }));
jest.mock("@/components/CustomToast", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
jest.mock("@/components/tour/TourProvider", () => ({ useTour: () => ({ openTour: jest.fn() }) }));
jest.mock("@/hooks/account/useAccount", () => ({
  ...jest.requireActual("@/hooks/account/useAccount"),
  useSessions: () => ({ data: undefined }),
}));

const requestDeletion = accountService.requestDeletion as jest.Mock;
const SCHEDULED = { status: "scheduled", requestedAt: "2026-10-09T10:00:00.000Z", scheduledFor: "2026-11-08T10:00:00.000Z" };
const ROUTE = "/signin?deletionScheduledFor=2026-11-08T10%3A00%3A00.000Z";

/**
 * Renders the danger zone and its sheet under a stub auth context.
 *
 * @param logout - The context's `logout`.
 * @returns Nothing.
 */
function renderZone(logout: jest.Mock = jest.fn().mockResolvedValue(undefined)) {
  /**
   * The zone and the sheet it opens.
   *
   * @returns Both.
   */
  function Harness() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <DangerZone onDelete={() => setOpen(true)} />
        <DeleteAccountSheet open={open} onOpenChange={setOpen} />
      </>
    );
  }
  render(
    <QueryClientProvider client={makeTestQueryClient()}>
      <AuthContext.Provider
        value={{ user: null, isAuthenticated: true, isLoading: false, accessToken: "t", checkAuth: jest.fn(), logout, setAuthState: jest.fn() }}
      >
        <Harness />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

/**
 * Opens the sheet from the zone.
 *
 * @returns The dialog.
 */
async function openSheet(): Promise<HTMLElement> {
  fireEvent.click(screen.getByRole("button", { name: "Delete account" }));
  return screen.findByRole("dialog", { name: "Delete your account?" });
}

/**
 * Types a password and ticks the box.
 *
 * @param dialog - The open sheet.
 * @param password - What to type.
 */
function complete(dialog: HTMLElement, password = "Correct#Pass1") {
  fireEvent.change(within(dialog).getByLabelText("Password"), { target: { value: password } });
  fireEvent.click(within(dialog).getByRole("checkbox", { name: /I understand/ }));
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  window.history.replaceState({}, "", "/");
  (unsubscribeBrowserPush as jest.Mock).mockResolvedValue(undefined);
});

describe("Settings → Security → Danger zone", () => {
  it("explains the 30 days, what is erased and kept, and links the full explanation", () => {
    renderZone();
    const zone = screen.getByRole("region", { name: "Danger zone" });
    expect(zone).toHaveTextContent("deleted in 30 days");
    expect(zone).toHaveTextContent("signing in before then cancels it");
    expect(zone).toHaveTextContent("name, email, phone number and photo are erased");
    expect(zone).toHaveTextContent("Your school keeps your grades, attendance and payments");
    expect(within(zone).getByRole("link", { name: /What happens when you delete your account/ })).toHaveAttribute(
      "href",
      "https://www.mytalim.com/delete-account"
    );
  });

  it("keeps Delete disabled until a password is typed and the box is ticked", async () => {
    renderZone();
    const dialog = await openSheet();
    const confirm = within(dialog).getByRole("button", { name: "Delete account" });
    expect(confirm).toBeDisabled();
    const password = within(dialog).getByLabelText("Password");
    fireEvent.change(password, { target: { value: "pw" } });
    expect(confirm).toBeDisabled();
    fireEvent.click(within(dialog).getByRole("checkbox", { name: /I understand/ }));
    expect(confirm).toBeEnabled();
    fireEvent.click(within(dialog).getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    expect(requestDeletion).not.toHaveBeenCalled();
  });

  it("on 200 signs out through logout and lands on sign-in with the date", async () => {
    requestDeletion.mockResolvedValueOnce(SCHEDULED);
    const logout = jest.fn().mockResolvedValue(undefined);
    renderZone(logout);
    const dialog = await openSheet();
    complete(dialog);
    fireEvent.change(within(dialog).getByLabelText(/Why are you leaving/), { target: { value: " Moving abroad " } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete account" }));

    await waitFor(() => expect(logout).toHaveBeenCalledWith({ redirectTo: ROUTE, sessionEnded: true }));
    expect(requestDeletion).toHaveBeenCalledWith({ password: "Correct#Pass1", reason: "Moving abroad" });
  });

  it("shows a wrong password (400, field error on password) on the field", async () => {
    requestDeletion.mockRejectedValueOnce(
      new ApiError("VALIDATION_FAILED", "Your password is incorrect.", 400, [{ field: "password", reason: "Password is incorrect" }])
    );
    const logout = jest.fn();
    renderZone(logout);
    const dialog = await openSheet();
    complete(dialog, "wrong");
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete account" }));

    const field = within(dialog).getByLabelText("Password");
    await waitFor(() => expect(field).toHaveAttribute("aria-invalid", "true"));
    expect(field).toHaveAccessibleDescription("Password is incorrect");
    expect(logout).not.toHaveBeenCalled();
  });

  it("shows other refusals in a banner", async () => {
    requestDeletion.mockRejectedValueOnce(new ApiError("CONFLICT", "A deletion is already scheduled.", 409, [], undefined, "DELETION_SCHEDULED"));
    renderZone();
    const dialog = await openSheet();
    complete(dialog);
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete account" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("A deletion is already scheduled.");
    expect(deletionErrorMessage(new ApiError("FORBIDDEN", "", 403, [], undefined, "ADMIN_ACCOUNT")).banner).toBe(
      "Talim platform admin accounts can't be deleted from here."
    );
  });
});

describe("legal links", () => {
  it("keeps the in-app policy and links the full one", () => {
    render(<LegalSheet kind="privacy" open onOpenChange={jest.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Privacy Policy" });
    expect(within(dialog).getByRole("heading", { name: "Who can see what" })).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /Read the full policy/ })).toHaveAttribute("href", "https://www.mytalim.com/privacy");
  });

  it("links the full terms from the terms sheet", () => {
    render(<LegalSheet kind="terms" open onOpenChange={jest.fn()} />);
    expect(screen.getByRole("link", { name: /Read the full policy/ })).toHaveAttribute("href", "https://www.mytalim.com/terms");
  });

  it("links Support from About and Privacy, Terms and Support from the sign-in footer", () => {
    render(
      <ul>
        <AboutPanel onOpenSheet={jest.fn()} />
      </ul>
    );
    expect(screen.getByRole("link", { name: /Support/ })).toHaveAttribute("href", "https://www.mytalim.com/support");

    render(<SignInFooter supportEmail="support@mytalim.com" year={2026} />);
    const nav = screen.getByRole("navigation", { name: "Talim policies and support" });
    expect(within(nav).getByRole("link", { name: /Privacy/ })).toHaveAttribute("href", "https://www.mytalim.com/privacy");
    expect(within(nav).getByRole("link", { name: /Terms/ })).toHaveAttribute("href", "https://www.mytalim.com/terms");
    expect(within(nav).getByRole("link", { name: /Support/ })).toHaveAttribute("href", "https://www.mytalim.com/support");
  });
});

describe("sign-in", () => {
  /**
   * Renders the sign-in page signed out.
   *
   * @returns Nothing.
   */
  const renderSignIn = () =>
    render(
      <AuthContext.Provider
        value={{ user: null, isAuthenticated: false, isLoading: false, accessToken: null, checkAuth: jest.fn(), logout: jest.fn(), setAuthState: jest.fn() }}
      >
        <SignInPage />
      </AuthContext.Provider>
    );

  it("says when the account will be deleted after a deletion request", async () => {
    window.history.replaceState({}, "", deletionScheduledRoute(SCHEDULED.scheduledFor));
    renderSignIn();
    expect(await screen.findByText("Your account will be deleted on 8 November 2026. Sign in before then to cancel.")).toBeInTheDocument();
    expect(deletionNoticeFromSearch("?deletionScheduledFor=nope")).toBeNull();
  });

  it("toasts the cancelled notice when login answers deletionCancelled: true", async () => {
    (authService.login as jest.Mock).mockResolvedValue({ access_token: "tok", refresh_token: "", user: {}, deletionCancelled: true });
    (authService.introspect as jest.Mock).mockResolvedValue({ user: { userId: "u1", role: "student", firstName: "Ada", lastName: "N" } });
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <AuthContext.Provider
          value={{ user: null, isAuthenticated: false, isLoading: false, accessToken: null, checkAuth: jest.fn(), logout: jest.fn(), setAuthState: jest.fn() }}
        >
          {children}
        </AuthContext.Provider>
      ),
    });
    await act(async () => {
      await result.current.login({ identifier: "ada@school.test", password: "pw", deviceToken: "web", platform: "web" });
    });
    expect(toast.success).toHaveBeenCalledWith(DELETION_CANCELLED_MESSAGE);
    expect(DELETION_CANCELLED_MESSAGE).toBe("Welcome back. Your account deletion has been cancelled.");
  });
});

describe("AuthContext.logout after a deletion", () => {
  let ctx: ReturnType<typeof useAuthContext>;

  /**
   * Exposes the auth context to the test.
   *
   * @returns Nothing visible.
   */
  function Probe() {
    ctx = useAuthContext();
    return null;
  }

  it("makes no server calls, drops push locally, empties the cache and lands on the given route", async () => {
    (authService.refresh as jest.Mock).mockRejectedValue(new Error("no session"));
    localStorage.setItem("accessToken", "tok");
    localStorage.setItem("user", JSON.stringify({ userId: "u1", role: "student" }));
    (authService.introspect as jest.Mock).mockResolvedValue({ user: { userId: "u1", role: "student" } });
    const client = makeTestQueryClient();
    client.setQueryData(["learner", "today"], { lessons: 3 });
    render(
      <QueryClientProvider client={client}>
        <AuthProvider>
          <Probe />
        </AuthProvider>
      </QueryClientProvider>
    );
    await waitFor(() => expect(ctx.isAuthenticated).toBe(true));

    await act(async () => {
      await ctx.logout({ redirectTo: ROUTE, sessionEnded: true });
    });

    expect(accountService.logout).not.toHaveBeenCalled();
    expect(unsubscribeBrowserPush).toHaveBeenCalledWith(null, "u1");
    expect(push).toHaveBeenCalledWith(ROUTE);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(client.getQueryData(["learner", "today"])).toBeUndefined();
  });
});
