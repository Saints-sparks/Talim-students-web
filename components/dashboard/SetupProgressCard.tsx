"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { STUDENT_ONBOARDING_STEPS, useStudentOnboarding } from "@/contexts/OnboardingContext";
import type { DashboardStyles } from "@/components/dashboard/styles";

/**
 * The setup checklist at the top of the dashboard.
 *
 * @param props - Component props.
 * @param props.styles - Resolved dashboard styles.
 * @returns The setup card, or nothing once setup is complete.
 */
export default function SetupProgressCard({ styles }: { styles: DashboardStyles }) {
  const router = useRouter();
  const onboarding = useStudentOnboarding();

  const setupSteps = STUDENT_ONBOARDING_STEPS.map((step) => ({
    label: step.label,
    done: onboarding.isStepComplete(step.id),
  }));
  const progressPercent = onboarding.isHydrated ? onboarding.progressPercent : 0;

  // Nothing to nudge once every step is done.
  if (onboarding.isHydrated && progressPercent >= 100) return null;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="rounded-2xl border p-4 sm:p-5" style={styles.card}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
            <svg className="-rotate-90" height="80" width="80">
              <circle cx="40" cy="40" r={radius} stroke={styles.colors.borderLight} strokeWidth="8" fill="none" />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={styles.colors.primary}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progressPercent / 100) * circumference}
              />
            </svg>
            <span className="absolute text-xs font-bold" style={{ color: styles.colors.success }}>
              {progressPercent}%
            </span>
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: styles.colors.text }}>
              Complete Your Setup
            </h2>
            <p className="mt-1 max-w-sm text-sm" style={{ color: styles.colors.textSecondary }}>
              You&apos;re almost there! Complete the remaining steps to unlock all features.
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4 lg:max-w-2xl">
          {setupSteps.map((item, index) => (
            <div key={item.label} className="relative flex flex-col items-center gap-2 text-center">
              {index > 0 ? (
                <span
                  className="absolute left-[-50%] top-4 hidden h-px w-full md:block"
                  style={{ backgroundColor: item.done ? styles.colors.success : styles.colors.borderLight }}
                />
              ) : null}
              <span
                className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: item.done ? styles.colors.success : styles.colors.border,
                  backgroundColor: item.done ? styles.colors.success : styles.colors.surface,
                  color: item.done ? styles.primaryText : styles.colors.textSecondary,
                }}
              >
                {item.done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </span>
              <span className="text-xs font-bold" style={{ color: styles.colors.textSecondary }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.push("/onboarding/setup")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold"
          style={{
            borderColor: styles.colors.border,
            color: styles.colors.primary,
            backgroundColor: styles.colors.surfaceAlt,
          }}
        >
          Continue Setup <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
