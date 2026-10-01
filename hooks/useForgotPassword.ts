"use client";

import { useCallback, useState } from "react";
import { authService } from "@/services/auth.service";
import { messageForError } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";
import type { PasswordRule } from "@/lib/passwordPolicy";

/** The three steps of the reset. */
export type ForgotPasswordStep = "email" | "otp" | "newPassword";

/** A message per field that is not ready to send. */
export type ResetFieldErrors = Partial<Record<"email" | "otp" | "newPassword" | "confirmPassword", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checks the current step's fields before anything is sent.
 *
 * @param step - The step being submitted.
 * @param values - The flow's values.
 * @param values.email - The account's email.
 * @param values.otp - The emailed code.
 * @param values.newPassword - The new password.
 * @param values.confirmPassword - Its confirmation.
 * @param rules - The password rules in force (from the API's policy).
 * @returns A message per field that needs attention; empty when the step can be sent.
 */
export function validateResetStep(
  step: ForgotPasswordStep,
  values: { email: string; otp: string; newPassword: string; confirmPassword: string },
  rules: readonly PasswordRule[]
): ResetFieldErrors {
  if (step === "email") {
    if (!values.email.trim()) return { email: "Enter your email address." };
    if (!EMAIL_RE.test(values.email.trim())) return { email: "Enter a valid email address, like you@school.com." };
    return {};
  }
  if (step === "otp") {
    return /^\d{6}$/.test(values.otp.trim()) ? {} : { otp: "Enter the 6-digit code from the email." };
  }
  const errors: ResetFieldErrors = {};
  const broken = rules.find((rule) => !rule.test(values.newPassword));
  if (!values.newPassword) errors.newPassword = "Enter a new password.";
  else if (broken) errors.newPassword = `Your new password needs: ${broken.label.toLowerCase()}.`;
  if (values.confirmPassword !== values.newPassword) errors.confirmPassword = "The two passwords do not match yet.";
  return errors;
}

/**
 * The forgot-password flow: email → emailed code → new password. The code is
 * only checked for its shape here; the API checks it for real when the new
 * password is sent (`POST /auth/reset-password`). Every call is public.
 *
 * @param rules - The password rules in force.
 * @returns The step, the values and their setters, field and banner errors,
 *   and the submit, resend and back actions.
 */
export function useForgotPassword(rules: readonly PasswordRule[]) {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [values, setValues] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<ResetFieldErrors>({});
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  /**
   * Stores a typed value and clears that field's error.
   *
   * @param field - The field.
   * @param value - Its value.
   */
  const set = useCallback((field: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  /**
   * Sends (or resends) the reset code.
   *
   * @returns True when the code went out.
   */
  const sendCode = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setBannerError(null);
    try {
      await authService.forgotPassword(values.email.trim());
      setNotice(`We sent a 6-digit code to ${values.email.trim()}.`);
      return true;
    } catch (error) {
      logger.error("auth", "Requesting a reset code failed", error);
      setBannerError(messageForError(error, "We couldn't send the code. Please try again."));
      return false;
    } finally {
      setLoading(false);
    }
  }, [values.email]);

  /**
   * Submits the current step: checks it, then sends the code, moves on, or
   * resets the password.
   *
   * @returns The field errors found (empty when the step went ahead).
   */
  const submit = useCallback(async (): Promise<ResetFieldErrors> => {
    const found = validateResetStep(step, values, rules);
    setErrors(found);
    if (Object.values(found).some(Boolean)) return found;
    if (step === "email") {
      if (await sendCode()) setStep("otp");
      return {};
    }
    if (step === "otp") {
      setNotice(null);
      setStep("newPassword");
      return {};
    }
    setLoading(true);
    setBannerError(null);
    try {
      await authService.resetPassword(values.email.trim(), values.otp.trim(), values.newPassword);
      setSucceeded(true);
    } catch (error) {
      logger.error("auth", "Resetting the password failed", error);
      setBannerError(messageForError(error, "We couldn't reset your password. Check the code and try again."));
    } finally {
      setLoading(false);
    }
    return {};
  }, [rules, sendCode, step, values]);

  /**
   * One step back (the first step's back goes to sign-in, handled by the page).
   *
   * @returns True when there was a step to go back to.
   */
  const goBack = useCallback((): boolean => {
    setBannerError(null);
    setErrors({});
    if (step === "otp") {
      setStep("email");
      return true;
    }
    if (step === "newPassword") {
      setStep("otp");
      return true;
    }
    return false;
  }, [step]);

  return { step, values, set, errors, bannerError, notice, loading, succeeded, submit, resend: sendCode, goBack };
}
