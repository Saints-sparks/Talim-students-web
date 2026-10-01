/**
 * Pure sign-in rules for the students portal: who may sign in, how a refusal
 * is worded (the same style as the Teachers portal), and what the form needs
 * before it is sent. No React.
 */
import { ApiError } from "@/lib/apiError";

/** The one role this portal serves (`UserRole.STUDENT` in talimBE-V2). */
export const STUDENT_ROLE = "student";

/** Shown for a wrong email, student ID or password (docs/signin-ui.md, Students column). */
export const INVALID_CREDENTIALS_TEXT = "Incorrect email, student ID, or password. Please check your credentials and try again.";

/**
 * Whether an account may use the students portal.
 *
 * @param role - The role the API introspected.
 * @returns True only for a student.
 */
export function isStudentRole(role: unknown): boolean {
  return typeof role === "string" && role.trim().toLowerCase() === STUDENT_ROLE;
}

/**
 * The refusal for any other role, worded as the Teachers portal words its
 * own: "Access denied. This portal is for students only. Your account is
 * registered as "teacher". Please use the correct Talim app for your role."
 *
 * @param role - The account's role, when known.
 * @returns The sentence.
 */
export function accessDeniedMessage(role: unknown): string {
  const friendly = typeof role === "string" && role.trim() ? role.trim().replace(/_/g, " ") : "another role";
  return (
    "Access denied. This portal is for students only. " +
    `Your account is registered as "${friendly}". ` +
    "Please use the correct Talim app for your role."
  );
}

/** The sign-in form's values. */
export interface SignInValues {
  identifier: string;
  password: string;
}

/** A message per field that is not ready to send. */
export type SignInFieldErrors = Partial<Record<keyof SignInValues, string>>;

/**
 * Checks the fields before anything is sent. The identifier is trimmed; the
 * password is not (spaces can be part of it).
 *
 * @param values - The form's values.
 * @returns A message per empty field; empty when the form can be sent.
 */
export function validateSignIn(values: SignInValues): SignInFieldErrors {
  const errors: SignInFieldErrors = {};
  if (!values.identifier.trim()) errors.identifier = "Enter your email or student ID.";
  if (!values.password) errors.password = "Enter your password.";
  return errors;
}

/** Why a sign-in was refused, as the banner explains it. */
export type LoginError =
  | { kind: "access_denied"; message: string }
  | { kind: "invalid_credentials" }
  | { kind: "unknown"; message: string };

/**
 * Sorts a refused sign-in for the banner: another role (red, "Access
 * denied"), wrong credentials (amber), or anything else (grey, with the
 * server's or the client's message).
 *
 * @param error - What `login` threw.
 * @returns The kind and its message.
 */
export function classifyLoginError(error: unknown): LoginError {
  if (error instanceof ApiError && (error.status === 401 || error.code === "UNAUTHENTICATED")) {
    return { kind: "invalid_credentials" };
  }
  const message = error instanceof Error ? error.message : "";
  const lower = message.toLowerCase();
  if (lower.includes("access denied") || lower.includes("registered as")) return { kind: "access_denied", message };
  if (lower.includes("incorrect") || lower.includes("invalid credentials")) return { kind: "invalid_credentials" };
  return { kind: "unknown", message: message || "An unexpected error occurred. Please try again." };
}
