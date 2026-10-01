import React from "react";
import { act, renderHook } from "@testing-library/react";
import { AuthContext } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
import { accountService } from "@/services/account.service";
import { ApiError } from "@/lib/apiError";
import { INVALID_CREDENTIALS_TEXT, accessDeniedMessage, classifyLoginError, isStudentRole, validateSignIn } from "@/lib/auth/signIn";

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push, replace: jest.fn() }) }));
jest.mock("@/services/auth.service", () => ({ authService: { login: jest.fn(), introspect: jest.fn() } }));
jest.mock("@/services/account.service", () => ({ accountService: { logout: jest.fn() } }));

const login = authService.login as jest.Mock;
const introspect = authService.introspect as jest.Mock;
const serverLogout = accountService.logout as jest.Mock;
const setAuthState = jest.fn();

/**
 * Wraps the hook in a stub auth context.
 *
 * @param props - Standard children.
 * @param props.children - The hook's host.
 * @returns The provider.
 */
function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{ user: null, isAuthenticated: false, isLoading: false, accessToken: null, checkAuth: jest.fn(), logout: jest.fn(), setAuthState }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const credentials = { identifier: "ada@school.test", password: "Secret#1", deviceToken: "web-token", platform: "web" };

describe("role gate at sign-in", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    serverLogout.mockResolvedValue(undefined);
    login.mockResolvedValue({ access_token: "new-token", refresh_token: "", user: {} });
  });

  it("signs a student in, stores the session and routes on", async () => {
    introspect.mockResolvedValue({ user: { userId: "u1", role: "student", firstName: "Ada", lastName: "N" } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login(credentials);
    });
    expect(setAuthState).toHaveBeenCalledWith(expect.objectContaining({ role: "student" }), "new-token");
    expect(localStorage.getItem("accessToken")).toBe("new-token");
    expect(push).toHaveBeenCalledWith("/onboarding");
    expect(serverLogout).not.toHaveBeenCalled();
  });

  it.each(["teacher", "parent", "school_admin", "SCHOOL_SUB_ADMIN"])("refuses a %s, revokes the new session and stores nothing", async (role) => {
    introspect.mockResolvedValue({ user: { userId: "u2", role } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    let thrown: unknown;
    await act(async () => {
      thrown = await result.current.login(credentials).catch((error) => error);
    });
    expect((thrown as Error).message).toBe(accessDeniedMessage(role));
    expect((thrown as Error).message).toMatch(/^Access denied\. This portal is for students only\. Your account is registered as ".+"\. Please use the correct Talim app for your role\.$/);
    expect(serverLogout).toHaveBeenCalledWith("new-token");
    expect(setAuthState).not.toHaveBeenCalled();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(push).not.toHaveBeenCalled();
    expect(classifyLoginError(thrown)).toEqual({ kind: "access_denied", message: accessDeniedMessage(role) });
  });

  it("turns a 401 into the students' wrong-credentials sentence", async () => {
    login.mockRejectedValue(new ApiError("UNAUTHENTICATED", "Invalid credentials", 401));
    const { result } = renderHook(() => useAuth(), { wrapper });
    let thrown: unknown;
    await act(async () => {
      thrown = await result.current.login(credentials).catch((error) => error);
    });
    expect((thrown as Error).message).toBe(INVALID_CREDENTIALS_TEXT);
    expect(classifyLoginError(thrown)).toEqual({ kind: "invalid_credentials" });
    expect(introspect).not.toHaveBeenCalled();
  });
});

describe("sign-in rules", () => {
  it("only admits the student role", () => {
    expect(isStudentRole("student")).toBe(true);
    expect(isStudentRole(" Student ")).toBe(true);
    expect(isStudentRole("teacher")).toBe(false);
    expect(isStudentRole(undefined)).toBe(false);
  });

  it("names the role in words", () => {
    expect(accessDeniedMessage("school_sub_admin")).toContain('registered as "school sub admin"');
    expect(accessDeniedMessage(null)).toContain('registered as "another role"');
  });

  it("asks for both fields before sending", () => {
    expect(validateSignIn({ identifier: " ", password: "" })).toEqual({
      identifier: "Enter your email or student ID.",
      password: "Enter your password.",
    });
    expect(validateSignIn({ identifier: "ada", password: " x " })).toEqual({});
  });

  it("classifies anything else as unknown with its message", () => {
    expect(classifyLoginError(new Error("Server is down"))).toEqual({ kind: "unknown", message: "Server is down" });
    expect(classifyLoginError("nope")).toEqual({ kind: "unknown", message: "An unexpected error occurred. Please try again." });
  });
});
