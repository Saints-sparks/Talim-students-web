"use client";

import React, { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X } from "lucide-react";
import { useForgotPassword, type ForgotPasswordStep } from "@/hooks/useForgotPassword";
import { usePasswordPolicy } from "@/hooks/account/useAccount";
import { rulesFromPolicy } from "@/lib/passwordPolicy";
import { SUPPORT_EMAIL } from "@/lib/appInfo";
import {
  SignInErrorBanner,
  SignInField,
  SignInFooter,
  SignInHeading,
  SignInLogoHeader,
  SignInPasswordField,
  SignInPrimaryButton,
  SignInShell,
  signInLinkClass,
} from "@/components/auth/signin-ui";

const STEP_COPY: Record<ForgotPasswordStep, { title: string; subtitle: string; back: string; button: string; busy: string }> = {
  email: {
    title: "Reset your password",
    subtitle: "Enter the email address on your account and we will send you a 6-digit code.",
    back: "Back to sign in",
    button: "Send code",
    busy: "Sending code…",
  },
  otp: {
    title: "Enter the code",
    subtitle: "Type the 6-digit code from the email we just sent you.",
    back: "Change email",
    button: "Continue",
    busy: "Checking…",
  },
  newPassword: {
    title: "Choose a new password",
    subtitle: "Your new password must meet every rule below.",
    back: "Back to the code",
    button: "Reset password",
    busy: "Saving…",
  },
};

const STEPS: ForgotPasswordStep[] = ["email", "otp", "newPassword"];

/**
 * The password reset for a student who cannot sign in, in the shared Talim
 * sign-in look: email, emailed code, then a new password checked against
 * the API's password policy (`GET /auth/password-policy`). Errors sit under
 * their field or in the banner; the first invalid field is focused. After a
 * reset the page sends the student back to sign in.
 *
 * @returns The forgot-password page.
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  // Public and cached; loaded up front so the rules are ready on the last step.
  const policy = usePasswordPolicy(true);
  const rules = useMemo(() => rulesFromPolicy(policy.data), [policy.data]);
  const flow = useForgotPassword(rules);
  const copy = STEP_COPY[flow.step];
  const emailRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  // Each step starts with its field focused.
  useEffect(() => {
    const target = flow.step === "email" ? emailRef : flow.step === "otp" ? otpRef : passwordRef;
    target.current?.focus();
  }, [flow.step]);

  // Back to sign in a few seconds after a successful reset.
  useEffect(() => {
    if (!flow.succeeded) return undefined;
    const timer = setTimeout(() => router.push("/signin"), 4000);
    return () => clearTimeout(timer);
  }, [flow.succeeded, router]);

  /**
   * Submits the step and focuses the first field that needs attention.
   *
   * @param event - The form submit.
   * @returns Resolves once the step is handled.
   */
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = await flow.submit();
    if (found.email) emailRef.current?.focus();
    else if (found.otp) otpRef.current?.focus();
    else if (found.newPassword) passwordRef.current?.focus();
    else if (found.confirmPassword) confirmRef.current?.focus();
  };

  /** Goes one step back, or to sign in from the first step. */
  const onBack = () => {
    if (!flow.goBack()) router.push("/signin");
  };

  const checks = useMemo(() => rules.map((rule) => ({ ...rule, passed: rule.test(flow.values.newPassword) })), [rules, flow.values.newPassword]);
  const stepIndex = STEPS.indexOf(flow.step);

  return (
    <SignInShell
      illustration={<Image src="/icons/login/school-illustration.svg" alt="" fill className="object-contain" priority />}
      panelTitle="Talim Student Portal"
      panelText="Access your subjects, timetable, results, and resources — all in one place."
    >
      <SignInLogoHeader appName="Students" logo={<Image src="/icons/login/tree.svg" alt="" width={40} height={40} className="h-10 w-10" priority />} />

      {flow.succeeded ? (
        <div role="status">
          <SignInHeading title="Password reset" subtitle="You can now sign in with your new password. Taking you to sign in…" />
          <Link href="/signin" className={`${signInLinkClass} mt-4`}>
            Sign in now
          </Link>
        </div>
      ) : (
        <>
          <button type="button" onClick={onBack} className={`${signInLinkClass} -mt-2 mb-4 gap-2`}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {copy.back}
          </button>
          <SignInHeading title={copy.title} subtitle={copy.subtitle} />
          <p className="mt-3 text-xs font-semibold text-gray-600 dark:text-slate-400">
            Step {stepIndex + 1} of {STEPS.length}
          </p>

          {flow.bannerError ? (
            <SignInErrorBanner id="reset-alert" tone="neutral" className="mt-6">
              {flow.bannerError}
            </SignInErrorBanner>
          ) : null}
          {flow.notice && flow.step === "otp" ? (
            <p role="status" className="mt-6 text-sm text-gray-600 dark:text-slate-300">
              {flow.notice}
            </p>
          ) : null}

          <form onSubmit={onSubmit} noValidate aria-label={copy.title} className="mt-8 space-y-5">
            {flow.step === "email" ? (
              <SignInField
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                inputMode="email"
                label="Email address"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="you@school.com"
                value={flow.values.email}
                error={flow.errors.email}
                onChange={(e) => flow.set("email", e.target.value)}
                disabled={flow.loading}
                required
                aria-required
              />
            ) : null}

            {flow.step === "otp" ? (
              <>
                <SignInField
                  ref={otpRef}
                  id="otp"
                  name="otp"
                  label="6-digit code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="123456"
                  value={flow.values.otp}
                  error={flow.errors.otp}
                  onChange={(e) => flow.set("otp", e.target.value.replace(/\D/g, ""))}
                  disabled={flow.loading}
                  required
                  aria-required
                />
                <button type="button" onClick={() => void flow.resend()} disabled={flow.loading} className={signInLinkClass}>
                  Didn&apos;t get it? Send a new code
                </button>
              </>
            ) : null}

            {flow.step === "newPassword" ? (
              <>
                <SignInPasswordField
                  ref={passwordRef}
                  id="new-password"
                  name="newPassword"
                  label="New password"
                  autoComplete="new-password"
                  value={flow.values.newPassword}
                  error={flow.errors.newPassword}
                  describedBy={["password-rules"]}
                  visible={showPasswords}
                  onToggleVisible={() => setShowPasswords((v) => !v)}
                  toggleLabels={["Show passwords", "Hide passwords"]}
                  onChange={(e) => flow.set("newPassword", e.target.value)}
                  disabled={flow.loading}
                  required
                  aria-required
                  after={
                    <ul id="password-rules" aria-live="polite" className="mt-2 space-y-1">
                      {checks.map((rule) => (
                        <li
                          key={rule.label}
                          className={`flex items-center gap-2 text-xs ${rule.passed ? "text-green-700 dark:text-green-400" : "text-gray-600 dark:text-slate-400"}`}
                        >
                          {rule.passed ? <Check className="h-3.5 w-3.5" aria-hidden /> : <X className="h-3.5 w-3.5" aria-hidden />}
                          <span>
                            {rule.label}
                            <span className="sr-only">{rule.passed ? " (done)" : " (still needed)"}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  }
                />
                <SignInPasswordField
                  ref={confirmRef}
                  id="confirm-password"
                  name="confirmPassword"
                  label="Confirm new password"
                  autoComplete="new-password"
                  value={flow.values.confirmPassword}
                  error={flow.errors.confirmPassword}
                  visible={showPasswords}
                  hideToggle
                  onChange={(e) => flow.set("confirmPassword", e.target.value)}
                  disabled={flow.loading}
                  required
                  aria-required
                />
              </>
            ) : null}

            <SignInPrimaryButton loading={flow.loading} loadingText={copy.busy}>
              {copy.button}
            </SignInPrimaryButton>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
            Remembered it?{" "}
            <Link href="/signin" className="font-medium text-[#003366] hover:underline dark:text-blue-300">
              Sign in
            </Link>
          </p>
        </>
      )}

      <SignInFooter supportEmail={SUPPORT_EMAIL} />
    </SignInShell>
  );
}

