"use client";

import React, { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import ModernLoader from "@/components/ModernLoader";
import {
  INVALID_CREDENTIALS_TEXT,
  classifyLoginError,
  validateSignIn,
  type LoginError,
  type SignInFieldErrors,
} from "@/lib/auth/signIn";
import {
  SignInCheckbox,
  SignInErrorBanner,
  SignInField,
  SignInOptionsRow,
  SignInPasswordField,
  SignInPrimaryButton,
  signInLinkClass,
} from "./signin-ui";

/** The id of the banner a refused sign-in shows, which the fields name. */
const ALERT_ID = "signin-alert";

/**
 * The banner for a refused sign-in: red with the shield for an account that
 * is not a student's, amber for wrong credentials, grey for anything else.
 *
 * @param props - The failure.
 * @param props.error - Why the sign-in was refused.
 * @returns The banner.
 */
function LoginErrorAlert({ error }: { error: LoginError }) {
  if (error.kind === "access_denied") {
    return (
      <SignInErrorBanner id={ALERT_ID} tone="danger" title="Access denied" icon="shield" className="mt-6">
        {error.message.replace(/^Access denied\.\s*/i, "")}
      </SignInErrorBanner>
    );
  }
  if (error.kind === "invalid_credentials") {
    return (
      <SignInErrorBanner id={ALERT_ID} tone="warning" className="mt-6">
        {INVALID_CREDENTIALS_TEXT}
      </SignInErrorBanner>
    );
  }
  return (
    <SignInErrorBanner id={ALERT_ID} tone="neutral" className="mt-6">
      {error.message}
    </SignInErrorBanner>
  );
}

/**
 * The students' sign-in form in the Talim sign-in look
 * (`components/auth/signin-ui`, copied from Teachers): email or student ID,
 * password with show/hide, "Keep me signed in" and "Forgot password?". Empty
 * fields are caught before anything is sent and the first one is focused.
 * The sign-in is `useAuth().login`, which admits students only; a refusal is
 * a banner above the form; the full-screen Talim loader shows while it runs.
 *
 * @returns The loader, the banner (after a refusal) and the form.
 */
export function SignInForm() {
  const { login, isLoading } = useAuth();
  const [values, setValues] = useState({ identifier: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState<SignInFieldErrors>({});
  const [loginError, setLoginError] = useState<LoginError | null>(null);
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  /**
   * Stores a typed value and clears that field's error.
   *
   * @param field - The field typed in.
   * @param value - Its new value.
   */
  const change = (field: "identifier" | "password", value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /**
   * Checks the fields, then signs in; a refusal is classified for the banner.
   *
   * @param event - The form submit.
   * @returns Resolves once the attempt is over.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError(null);
    const found = validateSignIn(values);
    setErrors(found);
    if (found.identifier) {
      identifierRef.current?.focus();
      return;
    }
    if (found.password) {
      passwordRef.current?.focus();
      return;
    }
    try {
      await login({
        identifier: values.identifier.trim(),
        email: values.identifier.trim(),
        password: values.password,
        rememberMe: values.rememberMe,
        deviceToken: "web-token",
        platform: "web",
      });
    } catch (err) {
      setLoginError(classifyLoginError(err));
    }
  };

  const credentialsWrong = loginError?.kind === "invalid_credentials";
  const alertIds = credentialsWrong ? [ALERT_ID] : [];

  return (
    <>
      <ModernLoader visible={isLoading} />
      {loginError ? <LoginErrorAlert error={loginError} /> : null}

      <form onSubmit={handleSubmit} noValidate aria-label="Sign in" className="mt-8 space-y-5">
        <SignInField
          ref={identifierRef}
          id="identifier"
          name="identifier"
          label="Email or Student ID"
          hint="Student ID format: school slug-student ID, e.g. ESEC-260100001."
          error={errors.identifier}
          invalid={credentialsWrong}
          describedBy={alertIds}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@school.com or ESEC-260100001"
          value={values.identifier}
          onChange={(e) => change("identifier", e.target.value)}
          disabled={isLoading}
          required
          aria-required
        />

        <SignInPasswordField
          ref={passwordRef}
          id="password"
          name="password"
          label="Password"
          error={errors.password}
          invalid={credentialsWrong}
          describedBy={alertIds}
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={(e) => change("password", e.target.value)}
          disabled={isLoading}
          required
          aria-required
        />

        <SignInOptionsRow>
          <SignInCheckbox
            label="Keep me signed in"
            name="rememberMe"
            checked={values.rememberMe}
            onChange={(e) => setValues((prev) => ({ ...prev, rememberMe: e.target.checked }))}
          />
          <Link href="/forgot-password" className={signInLinkClass}>
            Forgot password?
          </Link>
        </SignInOptionsRow>

        <SignInPrimaryButton loading={isLoading} loadingText="Signing in…">
          Sign in
        </SignInPrimaryButton>
      </form>
    </>
  );
}
