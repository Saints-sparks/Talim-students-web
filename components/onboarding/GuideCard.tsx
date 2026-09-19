import Image from "next/image";
import { ArrowLeft, ArrowRight, Lightbulb, Sparkles, X } from "lucide-react";
import type { GuideStep } from "@/components/onboarding/guideSteps";
import { computeCardPosition, type CardPosition, type TargetRect } from "@/lib/appGuide";

/**
 * The little diamond joining the card to the element it explains.
 *
 * @param props - Component props.
 * @param props.side - Which edge of the card it sits on.
 * @returns The arrow, or nothing when the card is centred.
 */
function TooltipArrow({ side }: { side: CardPosition["arrow"] }) {
  const base =
    "absolute h-5 w-5 rotate-45 border border-[#DDE8F6] bg-white dark:border-white/10 dark:bg-[#0B1220]";
  if (side === "left") return <span className={`${base} -left-2 top-16`} />;
  if (side === "right") return <span className={`${base} -right-2 top-16`} />;
  if (side === "bottom") return <span className={`${base} -bottom-2 left-1/2 -translate-x-1/2`} />;
  if (side === "top") return <span className={`${base} -top-2 left-1/2 -translate-x-1/2`} />;
  return null;
}

/**
 * One step of the tour: what this part of the page is, with back / next / close.
 *
 * @param props - Component props.
 * @param props.step - The step being shown.
 * @param props.current - Zero-based index of the step.
 * @param props.total - How many steps the tour has.
 * @param props.rect - The target's box, used to place the card; `null` centres it.
 * @param props.onBack - Goes to the previous step.
 * @param props.onNext - Goes to the next step.
 * @param props.onDone - Finishes the tour.
 * @param props.onClose - Dismisses the tour.
 * @returns The card.
 */
export function GuideCard({
  step,
  current,
  total,
  rect,
  onBack,
  onNext,
  onDone,
  onClose,
}: {
  step: GuideStep;
  current: number;
  total: number;
  rect: TargetRect | null;
  onBack: () => void;
  onNext: () => void;
  onDone: () => void;
  onClose: () => void;
}) {
  const position = computeCardPosition(
    rect,
    typeof window === "undefined" ? { width: 0, height: 0 } : { width: window.innerWidth, height: window.innerHeight }
  );
  const Icon = step.icon || Lightbulb;
  const progress = Math.round(((current + 1) / total) * 100);
  const isLast = current === total - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="talim-guide-title"
      className="talim-guide-card fixed z-[1001] w-[calc(100vw-2rem)] max-w-[400px]"
      style={{ top: position.top, left: position.left, transform: position.transform }}
    >
      <TooltipArrow side={position.arrow} />
      <div className="relative overflow-hidden rounded-[20px] border border-[#DDE8F6] bg-white/95 p-5 shadow-[0_24px_80px_rgba(3,14,24,0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/95">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-[#EAF2FB] via-white to-[#FFF4D8] opacity-90 dark:from-[#12395F] dark:via-[#0B1220] dark:to-[#46350F]" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003366] shadow-lg shadow-blue-950/20">
              <Image src="/icons/login/tree.svg" alt="Talim" width={28} height={28} className="h-7 w-7" />
              <span className="absolute -right-1 -top-1 rounded-full bg-[#F4B740] p-1">
                <Sparkles className="h-3 w-3 text-[#003366]" />
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B88916] dark:text-[#F4B740]">
                {step.eyebrow || "Talim guide"}
              </p>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                Step {current + 1} of {total}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide"
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4B740] dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative mt-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F4B740]/40 bg-[#FFF8E8] px-3 py-1 text-xs font-semibold text-[#7A5600] dark:border-[#F4B740]/30 dark:bg-[#F4B740]/10 dark:text-[#FFE3A0]">
            <Icon className="h-3.5 w-3.5" />
            Quick coach note
          </div>

          <h3 id="talim-guide-title" className="text-xl font-bold tracking-normal text-[#030E18] dark:text-white">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{step.description}</p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EAF2FB] dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#003366] via-[#1E5B91] to-[#F4B740] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              disabled={current === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#F4B740] dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              onClick={isLast ? onDone : onNext}
              className="inline-flex items-center gap-2 rounded-xl bg-[#003366] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-[#00264D] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#F4B740] dark:bg-[#F4B740] dark:text-[#0B1220] dark:hover:bg-[#FFD06B]"
            >
              {isLast ? "Got it" : "Next"}
              {isLast ? <Sparkles className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
