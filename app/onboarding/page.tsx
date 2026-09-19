"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenText,
  Calendar,
  CheckCircle2,
  Lock,
  Loader2,
  Upload,
  UserRound,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentOnboarding } from "@/contexts/OnboardingContext";
import { useAcademicDetails } from "@/hooks/useAcademicDetails";
import { API_BASE_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { getErrorMessage } from "@/lib/apiError";

export default function StudentOnboardingPhase1() {
  const router = useRouter();
  const {
    user,
    accessToken,
    setAuthState,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuthContext();
  const { isHydrated, phase1Completed, isFullyComplete, completePhase1 } =
    useStudentOnboarding();
  const { academicData, loading: academicLoading } = useAcademicDetails();

  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [dob, setDob] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Redirect if already done
  useEffect(() => {
    if (authLoading || !isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/signin");
      return;
    }
    if (isFullyComplete) {
      router.replace("/dashboard");
    } else if (phase1Completed) {
      router.replace("/onboarding/setup");
    }
  }, [
    authLoading,
    isAuthenticated,
    isHydrated,
    phase1Completed,
    isFullyComplete,
    router,
  ]);

  // Pre-fill values from auth context
  useEffect(() => {
    if (user) {
      setAvatarPreview(user.userAvatar || null);
      if (user.dateOfBirth) {
        // normalise to YYYY-MM-DD for <input type="date">
        const d = new Date(user.dateOfBirth);
        if (!isNaN(d.getTime())) {
          setDob(d.toISOString().slice(0, 10));
        }
      }
    }
  }, [user]);

  const studentInfo = useMemo(() => {
    return {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      schoolName: user?.schoolName || "",
      className: academicData?.classDetails?.name || "",
      gradeLevel: academicData?.gradeLevel || "",
    };
  }, [user, academicData]);

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken) return;

    setUploading(true);
    setUploadError(null);

    try {
      const secureUrl = await uploadImageToCloudinary(file);

      const apiRes = await authFetch(`${API_BASE_URL}/auth/profile/avatar`, {
        method: "PUT",
        accessToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatarUrl: secureUrl }),
      });
      if (!apiRes.ok) throw new Error("Failed to update profile photo");

      setAvatarPreview(secureUrl);
      // Refresh the user in context so avatar persists everywhere
      if (user) {
        setAuthState({ ...user, userAvatar: secureUrl }, accessToken);
      }
    } catch (err) {
      setUploadError(getErrorMessage(err, "Upload failed. Please try again."));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleContinue = () => {
    completePhase1(dob || undefined);
    router.push("/onboarding/setup");
  };

  if (authLoading || !isHydrated || academicLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* ── Left panel — Blue brand ── */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#003366] p-12">
        <div className="text-center max-w-sm">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
            <UserRound className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Student Setup</h1>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Confirm your profile and personal details before exploring your
            portal. School-controlled information is read-only.
          </p>
        </div>
      </div>

      {/* ── Right panel — Form ── */}
      <main className="flex items-start justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Phase label */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#003366]">Phase 1 of 2</p>
            <h2 className="mt-1 text-2xl font-bold text-[#030E18]">
              Confirm your profile
            </h2>
            <p className="mt-2 text-sm text-[#6F6F6F]">
              Review your details before continuing to the setup checklist.
            </p>
          </div>

          {/* ── Avatar upload card ── */}
          <section className="rounded-2xl border border-[#F0F0F0] bg-white p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-[#EAF2FB] flex items-center justify-center">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt={studentInfo.firstName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <UserRound className="h-9 w-9 text-[#003366]" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#030E18]">
                  {studentInfo.firstName} {studentInfo.lastName}
                </h3>
                <p className="text-sm text-[#6F6F6F]">{studentInfo.email}</p>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#003366] hover:text-[#002244]">
                  <Upload className="h-4 w-4" />
                  {avatarPreview ? "Change photo" : "Upload photo"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                </label>
                {uploadError && (
                  <p className="mt-1 text-xs text-red-500">{uploadError}</p>
                )}
              </div>
            </div>
          </section>

          {/* ── Date of birth card ── */}
          <section className="mt-4 rounded-2xl border border-[#F0F0F0] bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-[#003366]" />
              <h3 className="text-sm font-semibold text-[#030E18]">
                Date of Birth
              </h3>
            </div>
            <p className="text-xs text-[#878787] mb-3">
              Confirm your date of birth. This helps personalise your learning
              experience.
            </p>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
              className="w-full sm:w-64 h-10 px-3 border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003366]/30 focus:border-[#003366] transition-all"
            />
          </section>

          {/* ── Info panels grid ── */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoPanel
              icon={<UserRound className="h-5 w-5" />}
              title="Personal details"
              items={[
                ["Full name", `${studentInfo.firstName} ${studentInfo.lastName}`.trim() || "Not set"],
                ["Email", studentInfo.email || "Not set"],
                ["Phone", studentInfo.phone || "Not set"],
              ]}
            />
            <InfoPanel
              icon={<BookOpenText className="h-5 w-5" />}
              title="Academic details"
              items={[
                ["Class", studentInfo.className || "Not assigned"],
                ["Grade level", studentInfo.gradeLevel || "Not set"],
                ["School", studentInfo.schoolName || "Not set"],
              ]}
            />
          </div>

          {/* ── Read-only notice ── */}
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3">
            <Lock className="h-4 w-4 shrink-0 text-blue-600" />
            <p className="text-xs text-blue-700">
              Academic and contact details are managed by your school admin.
              Contact them to make changes.
            </p>
          </div>

          {/* ── Continue button ── */}
          <button
            onClick={handleContinue}
            disabled={uploading}
            className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#003366] text-sm font-semibold text-white hover:bg-[#002244] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm &amp; Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

function InfoPanel({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: Array<[string, string]>;
}) {
  return (
    <section className="rounded-2xl border border-[#F0F0F0] bg-white p-5">
      <div className="flex items-center gap-2 text-[#003366] mb-4">
        {icon}
        <h3 className="text-sm font-semibold text-[#030E18]">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-[#878787]">{label}</p>
            <p className="text-sm font-medium text-[#030E18]">
              {value || "Not set"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
