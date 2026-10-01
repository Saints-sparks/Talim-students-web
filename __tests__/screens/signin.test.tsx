import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/test-utils/render";
import { SignInForm } from "@/components/auth/SignInForm";
import ForgotPasswordPage from "@/app/forgot-password/page";
import { validateResetStep } from "@/hooks/useForgotPassword";
import { rulesFromPolicy } from "@/lib/passwordPolicy";
import { accessDeniedMessage, INVALID_CREDENTIALS_TEXT } from "@/lib/auth/signIn";
import { authService } from "@/services/auth.service";
import { accountService } from "@/services/account.service";

const login = jest.fn();
jest.mock("@/hooks/useAuth", () => ({ useAuth: () => ({ login, isLoading: false, logout: jest.fn() }) }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  usePathname: () => "/signin",
}));
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));
jest.mock("@/services/auth.service", () => ({ authService: { forgotPassword: jest.fn(), resetPassword: jest.fn() } }));
jest.mock("@/services/account.service", () => ({ accountService: { getPasswordPolicy: jest.fn() } }));

describe("sign-in form", () => {
  beforeEach(() => jest.clearAllMocks());

  it("has the shared look's fields, words and ids", () => {
    render(<SignInForm />);
    expect(screen.getByLabelText("Email or Student ID")).toHaveAttribute("id", "identifier");
    expect(screen.getByLabelText("Password")).toHaveAttribute("id", "password");
    expect(screen.getByRole("checkbox", { name: "Keep me signed in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute("href", "/forgot-password");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("asks for empty fields before sending and focuses the first", async () => {
    render(<SignInForm />);
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(login).not.toHaveBeenCalled();
    expect(screen.getByText("Enter your email or student ID.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email or Student ID")).toHaveFocus();
  });

  it("shows the red Access denied banner for another role's account", async () => {
    login.mockRejectedValue(new Error(accessDeniedMessage("teacher")));
    render(<SignInForm />);
    await userEvent.type(screen.getByLabelText("Email or Student ID"), "teacher@school.test");
    await userEvent.type(screen.getByLabelText("Password"), "Secret#1");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Access denied");
    expect(alert).toHaveTextContent('This portal is for students only. Your account is registered as "teacher".');
    expect(login).toHaveBeenCalledWith(expect.objectContaining({ identifier: "teacher@school.test", rememberMe: false }));
  });

  it("shows the amber banner for wrong credentials and marks both fields", async () => {
    login.mockRejectedValue(new Error(INVALID_CREDENTIALS_TEXT));
    render(<SignInForm />);
    await userEvent.type(screen.getByLabelText("Email or Student ID"), "ada@school.test");
    await userEvent.type(screen.getByLabelText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(INVALID_CREDENTIALS_TEXT);
    expect(screen.getByLabelText("Password")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("forgot password", () => {
  const rules = rulesFromPolicy({ minLength: 10, requireUppercase: true, requireLowercase: true, requireNumber: true, requireSymbol: false });

  beforeEach(() => {
    jest.clearAllMocks();
    (accountService.getPasswordPolicy as jest.Mock).mockResolvedValue({
      minLength: 10,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSymbol: false,
      historyCount: 1,
    });
  });

  it("checks each step against the API's policy", () => {
    const values = { email: "ada@school.test", otp: "123456", newPassword: "Short1", confirmPassword: "Short1" };
    expect(validateResetStep("email", { ...values, email: "nope" }, rules)).toEqual({ email: "Enter a valid email address, like you@school.com." });
    expect(validateResetStep("otp", { ...values, otp: "12a" }, rules)).toEqual({ otp: "Enter the 6-digit code from the email." });
    expect(validateResetStep("newPassword", values, rules).newPassword).toBe("Your new password needs: at least 10 characters.");
    expect(validateResetStep("newPassword", { ...values, newPassword: "LongEnough12", confirmPassword: "LongEnough13" }, rules)).toEqual({
      confirmPassword: "The two passwords do not match yet.",
    });
    expect(validateResetStep("newPassword", { ...values, newPassword: "LongEnough12", confirmPassword: "LongEnough12" }, rules)).toEqual({});
  });

  it("walks email → code → new password in the sign-in look and resets", async () => {
    (authService.forgotPassword as jest.Mock).mockResolvedValue({ message: "sent" });
    (authService.resetPassword as jest.Mock).mockResolvedValue({ message: "ok" });
    render(<ForgotPasswordPage />);
    expect(screen.getByText("Students")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Reset your password" })).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Email address"), "ada@school.test");
    await userEvent.click(screen.getByRole("button", { name: "Send code" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Enter the code" })).toBeInTheDocument();
    expect(authService.forgotPassword).toHaveBeenCalledWith("ada@school.test");

    await userEvent.type(screen.getByLabelText("6-digit code"), "123456");
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Choose a new password" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("At least 10 characters")).toBeInTheDocument());

    await userEvent.type(screen.getByLabelText("New password"), "LongEnough12");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "LongEnough12");
    await userEvent.click(screen.getByRole("button", { name: "Reset password" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Password reset" })).toBeInTheDocument();
    expect(authService.resetPassword).toHaveBeenCalledWith("ada@school.test", "123456", "LongEnough12");
  });
});
