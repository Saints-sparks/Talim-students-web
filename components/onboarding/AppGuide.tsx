"use client";

import { HelpCircle } from "lucide-react";
import { GuideCard } from "@/components/onboarding/GuideCard";
import { GuideOverlay } from "@/components/onboarding/GuideOverlay";
import { useAppGuide } from "@/hooks/useAppGuide";

/**
 * The floating "Guide" button and, when open, the step-by-step tour of the
 * current page. All the state lives in `useAppGuide`.
 *
 * @returns The launcher and the tour, or nothing on pages without a guide.
 */
export default function AppGuide() {
  const guide = useAppGuide();

  if (!guide.isAvailable) return null;

  return (
    <>
      <button
        type="button"
        onClick={guide.open}
        className="fixed bottom-5 right-5 z-[900] inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-3 text-sm font-bold text-[#003366] shadow-xl shadow-blue-950/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4B740] dark:border-white/10 dark:bg-[#0B1220]/90 dark:text-[#F4B740]"
      >
        <HelpCircle className="h-4 w-4" />
        Guide
      </button>

      {guide.isOpen && guide.currentStep && (
        <>
          <GuideOverlay rect={guide.rect} />
          <GuideCard
            step={guide.currentStep}
            current={guide.stepIndex}
            total={guide.steps.length}
            rect={guide.rect}
            onBack={guide.back}
            onNext={guide.next}
            onDone={guide.finish}
            onClose={guide.dismiss}
          />
        </>
      )}
    </>
  );
}
