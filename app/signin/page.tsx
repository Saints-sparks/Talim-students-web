"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, ShieldAlert, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ModernLoader from "@/components/ModernLoader";
import { getErrorMessage } from "@/lib/apiError";

type LoginError =
  | { kind: "access_denied"; message: string }
  | { kind: "invalid_credentials" }
  | { kind: "unknown"; message: string };

interface FormData {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

const SignInPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect away if already signed in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);
  const [loginError, setLoginError] = useState<LoginError | null>(null);
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);

    try {
      await login({
        identifier: formData.identifier.trim(),
        email: formData.identifier.trim(),
        password: formData.password,
        deviceToken: "web-token",
        platform: "web",
      });
    } catch (err) {
      const msg: string = getErrorMessage(err, "");
      if (
        msg.toLowerCase().includes("access denied") ||
        msg.toLowerCase().includes("registered as")
      ) {
        setLoginError({ kind: "access_denied", message: msg });
      } else if (
        msg.toLowerCase().includes("incorrect") ||
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("credentials")
      ) {
        setLoginError({ kind: "invalid_credentials" });
      } else {
        setLoginError({
          kind: "unknown",
          message: msg || "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <ModernLoader visible={isLoading} />

      {/* ── Left panel — Form ── */}
      <div className="flex flex-col justify-center items-center px-8 py-12 sm:px-16 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/icons/login/tree.svg"
              alt="Talim Logo"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <span className="text-xl font-bold text-[#030E18]">Talim</span>
            <span className="ml-0.5 rounded-full bg-[#EAF2FB] px-2.5 py-0.5 text-xs font-semibold text-[#003366]">
              Students
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#030E18]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#6F6F6F]">
            Sign in to continue your learning journey.
          </p>

          {/* Access denied banner */}
          {loginError?.kind === "access_denied" && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Access denied
                  </p>
                  <p className="mt-1 text-xs text-red-600 leading-relaxed">
                    {loginError.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Invalid credentials banner */}
          {loginError?.kind === "invalid_credentials" && (
            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-700">
                  Incorrect email, student ID, or password. Please check
                  your credentials and try again.
                </p>
              </div>
            </div>
          )}

          {/* Unknown error banner */}
          {loginError?.kind === "unknown" && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                <p className="text-sm text-gray-600">{loginError.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {/* Identifier */}
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-[#030E18]"
              >
                Email or Student ID
              </label>
              <input
                id="identifier"
                type="text"
                placeholder="you@school.com or ESEC-260100001"
                value={formData.identifier}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
                className="w-full h-10 px-3 border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all disabled:opacity-50"
              />
              <p className="text-xs text-[#6F6F6F]">
                Student ID format: school slug-student ID, e.g. ESEC-260100001.
              </p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#030E18]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  disabled={isLoading}
                  className="w-full h-10 px-3 pr-10 border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rememberMe: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
                />
                Keep me signed in
              </label>
              <a
                href="/forgot-password"
                className="text-xs text-[#003366] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#003366] hover:bg-[#002244] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-gray-400">
            © Talim {new Date().getFullYear()} ·{" "}
            <a
              href="mailto:help@talim.com"
              className="hover:underline text-[#003366]"
            >
              help@talim.com
            </a>
          </p>
        </div>
      </div>

      {/* ── Right panel — Blue brand panel ── */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#003366] p-12">
        <div className="relative w-full max-w-md aspect-square opacity-90">
          <Image
            src="/icons/login/school-illustration.svg"
            alt="Student portal illustration"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="mt-8 text-center">
          <p className="text-xl font-bold text-white">Talim Student Portal</p>
          <p className="mt-2 text-sm text-white/70 max-w-xs leading-relaxed">
            Access your subjects, timetable, results, and resources — all in one
            place.
          </p>
        </div>
        <div className="mt-10 flex gap-2">
          <div className="h-2 w-8 rounded-full bg-white/60" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
          <div className="h-2 w-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
