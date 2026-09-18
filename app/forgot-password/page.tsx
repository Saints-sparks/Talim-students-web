"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/CustomToast";
import { authService } from "@/services/auth.service";
import { firstPasswordProblem } from "@/lib/passwordPolicy";
import { messageForError } from "@/lib/errorMessages";
import { logger } from "@/lib/logger";
import { EmailStep, NewPasswordStep, OtpStep } from "@/components/auth/ForgotPasswordSteps";
import PasswordResetSuccessModal from "@/components/auth/PasswordResetSuccessModal";

type Step = "email" | "otp" | "newPassword";

const STEP_TITLES: Record<Step, string> = {
  email: "Forgot Password?",
  otp: "Verify OTP",
  newPassword: "Set New Password",
};

const STEP_DESCRIPTIONS: Record<Step, string> = {
  email: "Enter your email address and we'll send you an OTP to reset your password.",
  otp: "Enter the 6-digit verification code sent to your email.",
  newPassword: "Create a new password for your account.",
};

/**
 * The forgot-password flow: email → OTP → new password. The OTP step only
 * checks the code's shape client-side; the API validates it for real when the
 * new password is submitted (`POST /auth/reset-password`).
 *
 * @returns The forgot-password page.
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const requestOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("Reset code sent to your email!");
      setCurrentStep("otp");
    } catch (error) {
      logger.error("auth", "Requesting a reset code failed", error);
      toast.error(messageForError(error, "Failed to send reset code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void requestOtp();
  };

  const handleOtpSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setCurrentStep("newPassword");
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const problem = firstPasswordProblem(newPassword);
    if (problem) {
      toast.error(problem);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setTimeout(() => router.push("/"), 500);
      }, 3000);
    } catch (error) {
      logger.error("auth", "Resetting the password failed", error);
      toast.error(messageForError(error, "Failed to reset password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (currentStep === "email") router.push("/");
    else if (currentStep === "otp") setCurrentStep("email");
    else setCurrentStep("otp");
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute left-8 top-8">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex items-center text-[#003366] transition-colors duration-200 hover:text-[#002B5B]"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        <div className="lg:absolute lg:top-16">
          <Image src="/icons/login/tree.svg" alt="Tree Logo" width={64} height={64} className="h-[80px] w-[76.32px]" priority />
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="font-manrope space-y-4 text-center">
            <h1 className="text-3xl font-medium text-[#030E18]">{STEP_TITLES[currentStep]}</h1>
            <p className="text-lg font-normal text-[#444444]">{STEP_DESCRIPTIONS[currentStep]}</p>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex space-x-2">
              {(["email", "otp", "newPassword"] as Step[]).map((step) => (
                <div
                  key={step}
                  className={`h-3 w-3 rounded-full ${currentStep === step ? "bg-[#003366]" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>

          <div className="font-manrope pt-[45px]">
            {currentStep === "email" && <EmailStep email={email} onEmailChange={setEmail} onSubmit={handleEmailSubmit} loading={loading} />}
            {currentStep === "otp" && (
              <OtpStep email={email} otp={otp} onOtpChange={setOtp} onSubmit={handleOtpSubmit} onResend={() => void requestOtp()} loading={loading} />
            )}
            {currentStep === "newPassword" && (
              <NewPasswordStep
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                onNewPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onSubmit={handlePasswordSubmit}
                loading={loading}
              />
            )}
          </div>

          <div className="text-center">
            <span className="text-sm text-[#444444]">Remember your password? </span>
            <Link href="/" className="text-sm font-medium text-[#003366] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden flex-1 lg:block">
        <Image src="/icons/login/school-illustration.svg" alt="High school illustration" fill className="lg:h-[500px] lg:w-[700px]" priority />
      </div>

      <PasswordResetSuccessModal visible={showSuccessModal} />
    </div>
  );
}
