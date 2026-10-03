"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import {
  STUDENT_ONBOARDING_STEPS,
  StudentOnboardingStepId,
  useStudentOnboarding,
} from "@/contexts/OnboardingContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTour } from "@/components/tour/TourProvider";

const STEP_ICONS: Record<StudentOnboardingStepId, React.ReactNode> = {
  "student-profile": <CheckCircle2 className="h-5 w-5" />,
  "view-notifications": <Bell className="h-5 w-5" />,
  "download-resource": <BookOpen className="h-5 w-5" />,
  "view-timetable": <Calendar className="h-5 w-5" />,
};

/**
 * Onboarding phase 2: the setup steps with their progress, and the portal
 * tour.
 *
 * @returns The setup page.
 */
export default function StudentOnboardingSetup() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuthContext();
  const {
    isHydrated,
    phase1Completed,
    isStepComplete,
    markStepComplete,
    progressPercent,
    completedCount,
    totalCount,
    isFullyComplete,
  } = useStudentOnboarding();

  const [navigating, setNavigating] = useState<StudentOnboardingStepId | null>(null);
  const { openTour, tourDone } = useTour();

  // Guard: wait for auth + onboarding state to fully load before checking phase1
  useEffect(() => {
    if (authLoading || !isHydrated) return;
    if (!phase1Completed) {
      router.replace("/onboarding");
    }
  }, [authLoading, isHydrated, phase1Completed, router]);

  if (authLoading || !isHydrated || !phase1Completed) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
      </div>
    );
  }

  const phase2Steps = STUDENT_ONBOARDING_STEPS.filter((s) => s.phase === 2);

  const handleOpen = (step: (typeof STUDENT_ONBOARDING_STEPS)[number]) => {
    setNavigating(step.id);
    markStepComplete(step.id);
    router.push(step.href);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-10 border-b border-[#F0F0F0] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#003366]">
              Student Setup
            </p>
            <h1 className="text-xl font-bold text-[#030E18]">
              Complete your onboarding
            </h1>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-sm font-semibold text-[#030E18] hover:bg-[#F7F7F7] transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Today
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 p-6 lg:grid-cols-[260px_1fr]">
        {/* ── Sidebar: progress + step list ── */}
        <aside className="rounded-2xl border border-[#F0F0F0] bg-white p-4 h-fit">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#030E18]">
              {completedCount} / {totalCount}
            </p>
            <p className="text-sm font-bold text-[#003366]">
              {progressPercent}%
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
            <div
              className="h-full rounded-full bg-[#003366] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-5 space-y-1">
            {STUDENT_ONBOARDING_STEPS.map((step) => {
              const complete = isStepComplete(step.id);
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                    complete
                      ? "bg-green-50 text-green-700"
                      : "text-[#4B5563]"
                  }`}
                >
                  {complete ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Main content ── */}
        <section className="space-y-4">
          {/* All done banner */}
          {isFullyComplete && (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <h2 className="text-sm font-semibold text-[#030E18]">
                    All setup steps are complete!
                  </h2>
                  <p className="mt-1 text-sm text-[#6F6F6F]">
                    You're all set. Head to Today to start learning.
                  </p>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#003366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002244] transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Go to Today
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* The portal tour (the design's "Getting started" sheet) */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#F0F0F0] bg-white p-5">
            <div>
              <h2 className="text-sm font-semibold text-[#030E18]">Take the portal tour</h2>
              <p className="mt-1 text-sm text-[#6F6F6F]">
                {tourDone ? "You've taken the tour. Take it again any time." : "Eight short steps through Today, your timetable, subjects, files, results and messages."}
              </p>
            </div>
            <button
              type="button"
              onClick={openTour}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#003366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002244] transition-colors"
            >
              {tourDone ? "Replay the tour" : "Start the tour"}
            </button>
          </div>

          {/* Phase 2 step cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {phase2Steps.map((step) => {
              const complete = isStepComplete(step.id);
              const isNav = navigating === step.id;
              return (
                <article
                  key={step.id}
                  className="rounded-2xl border border-[#F0F0F0] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${
                          complete
                            ? "bg-green-50 text-green-600"
                            : "bg-[#EAF2FB] text-[#003366]"
                        }`}
                      >
                        {STEP_ICONS[step.id]}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#030E18]">
                          {step.label}
                        </h3>
                        <p className="mt-1 text-sm text-[#6F6F6F]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {complete && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    )}
                  </div>

                  <button
                    disabled={complete}
                    onClick={() => handleOpen(step)}
                    className={`mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      complete
                        ? "bg-green-50 text-green-700 cursor-default"
                        : "bg-[#003366] text-white hover:bg-[#002244]"
                    }`}
                  >
                    {isNav && !complete ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Opening…
                      </>
                    ) : complete ? (
                      "Completed"
                    ) : (
                      "Open"
                    )}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
