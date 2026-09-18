"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkPassword } from "@/lib/passwordPolicy";

/**
 * Step 1: collect the email to send the reset code to.
 *
 * @param props - Component props.
 * @param props.email - Current value.
 * @param props.onEmailChange - Called as the student types.
 * @param props.onSubmit - Called on submit.
 * @param props.loading - Whether the request is in flight.
 * @returns The form element.
 */
export function EmailStep({
  email,
  onEmailChange,
  onSubmit,
  loading,
}: {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-lg font-medium text-[#030E18]">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          className="h-[50px] w-full px-3"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-[50px] w-full rounded-lg bg-[#003366] text-lg font-medium text-white hover:bg-[#002B5B]/90"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  );
}

/**
 * Step 2: enter the emailed one-time code.
 *
 * @param props - Component props.
 * @param props.email - Where the code was sent, shown for reassurance.
 * @param props.otp - Current value.
 * @param props.onOtpChange - Called as the student types.
 * @param props.onSubmit - Called on submit.
 * @param props.onResend - Called when the student asks for a new code.
 * @param props.loading - Whether a request is in flight.
 * @returns The form element.
 */
export function OtpStep({
  email,
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  loading,
}: {
  email: string;
  otp: string;
  onOtpChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onResend: () => void;
  loading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-lg font-medium text-[#030E18]">
          Enter OTP
        </Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(event) => onOtpChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
          className="h-[50px] w-full px-3 text-center text-2xl tracking-widest"
          maxLength={6}
          required
        />
        <p className="text-center text-sm text-gray-600">We&apos;ve sent a 6-digit verification code to {email}</p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-[50px] w-full rounded-lg bg-[#003366] text-lg font-medium text-white hover:bg-[#002B5B]/90"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>

      <div className="text-center">
        <button type="button" onClick={onResend} className="text-sm text-[#003366] hover:underline">
          Resend OTP
        </button>
      </div>
    </form>
  );
}

/**
 * Step 3: choose the new password, checked against the same rules the API
 * enforces (`lib/passwordPolicy.ts`).
 *
 * @param props - Component props.
 * @param props.newPassword - Current value.
 * @param props.confirmPassword - Current value.
 * @param props.onNewPasswordChange - Called as the student types.
 * @param props.onConfirmPasswordChange - Called as the student types.
 * @param props.onSubmit - Called on submit.
 * @param props.loading - Whether the request is in flight.
 * @returns The form element.
 */
export function NewPasswordStep({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  loading,
}: {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const rules = checkPassword(newPassword);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-lg font-medium text-[#030E18]">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(event) => onNewPasswordChange(event.target.value)}
            className="h-[50px] w-full px-3 pr-12"
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {newPassword ? (
          <ul className="space-y-1 pt-1">
            {rules.map((rule) => (
              <li key={rule.label} className={`text-xs ${rule.passed ? "text-green-600" : "text-gray-500"}`}>
                {rule.passed ? "✓" : "•"} {rule.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-lg font-medium text-[#030E18]">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            className="h-[50px] w-full px-3 pr-12"
            required
          />
          <button
            type="button"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-[50px] w-full rounded-lg bg-[#003366] text-lg font-medium text-white hover:bg-[#002B5B]/90"
      >
        {loading ? "Resetting Password..." : "Reset Password"}
      </Button>
    </form>
  );
}
