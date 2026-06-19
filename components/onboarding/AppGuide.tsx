"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Sparkles,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { findGuideConfig, GuideConfig, GuideStep } from "./guideSteps";

type TargetRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const STORAGE_PREFIX = "talim_student_guide";
const GUIDE_READY_SELECTOR = "[data-guide-ready='false'], [aria-busy='true']";

function isGuideElementReady(element: HTMLElement) {
  return !element.closest(GUIDE_READY_SELECTOR);
}

function getTargetRect(target: string): TargetRect | null {
  if (typeof window === "undefined") return null;
  const element = document.querySelector<HTMLElement>(`[data-guide="${target}"]`);
  if (!element) return null;
  if (!isGuideElementReady(element)) return null;

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function getVisibleSteps(config: GuideConfig) {
  if (typeof window === "undefined") return config.steps;
  const visibleSteps = config.steps.filter((step) => {
    const element = document.querySelector<HTMLElement>(`[data-guide="${step.target}"]`);
    if (!element) return false;
    if (!isGuideElementReady(element)) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  return visibleSteps;
}

function getUserId(user: any) {
  return user?.userId || user?._id || user?.id || user?.studentId || "guest";
}

function getStorageKey(guideId: string, userId: string) {
  return `${STORAGE_PREFIX}:${userId}:${guideId}:completed`;
}

function getSeenKey(guideId: string, userId: string) {
  return `${STORAGE_PREFIX}:${userId}:${guideId}:seen`;
}

function getCardPosition(rect: TargetRect | null) {
  if (typeof window === "undefined" || !rect) {
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      arrow: "hidden",
    };
  }

  const cardWidth = Math.min(400, window.innerWidth - 32);
  const cardHeight = 330;
  const viewportPadding = 16;
  const spaceRight = window.innerWidth - (rect.left + rect.width);
  const spaceLeft = rect.left;
  const canUseSide =
    window.innerWidth >= 768 &&
    (spaceRight > cardWidth + 32 || spaceLeft > cardWidth + 32);

  if (canUseSide) {
    const placeRight = spaceRight >= cardWidth + 32;
    const top = Math.min(
      Math.max(rect.top + rect.height / 2 - cardHeight / 2, viewportPadding),
      Math.max(viewportPadding, window.innerHeight - cardHeight - viewportPadding)
    );

    return {
      top: `${top}px`,
      left: placeRight
        ? `${Math.min(
            rect.left + rect.width + 24,
            window.innerWidth - cardWidth - viewportPadding
          )}px`
        : `${Math.max(rect.left - cardWidth - 24, viewportPadding)}px`,
      transform: "none",
      arrow: placeRight ? "left" : "right",
    };
  }

  const below = rect.top + rect.height + 20;
  const fitsBelow = below + cardHeight < window.innerHeight;

  return {
    top: fitsBelow
      ? `${below}px`
      : `${Math.max(viewportPadding, rect.top - cardHeight - 20)}px`,
    left: `${Math.min(
      Math.max(rect.left + rect.width / 2 - cardWidth / 2, viewportPadding),
      window.innerWidth - cardWidth - viewportPadding
    )}px`,
    transform: "none",
    arrow: fitsBelow ? "top" : "bottom",
  };
}

function TooltipArrow({ side }: { side: string }) {
  const base =
    "absolute h-5 w-5 rotate-45 border border-[#DDE8F6] bg-white dark:border-white/10 dark:bg-[#0B1220]";
  if (side === "left") return <span className={`${base} -left-2 top-16`} />;
  if (side === "right") return <span className={`${base} -right-2 top-16`} />;
  if (side === "bottom") {
    return <span className={`${base} -bottom-2 left-1/2 -translate-x-1/2`} />;
  }
  if (side === "top") {
    return <span className={`${base} -top-2 left-1/2 -translate-x-1/2`} />;
  }
  return null;
}

function GuideCard({
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
  const position = getCardPosition(rect);
  const Icon = step.icon || Lightbulb;
  const progress = Math.round(((current + 1) / total) * 100);
  const isLast = current === total - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="talim-guide-title"
      className="talim-guide-card fixed z-[1001] w-[calc(100vw-2rem)] max-w-[400px]"
      style={{
        top: position.top,
        left: position.left,
        transform: position.transform,
      }}
    >
      <TooltipArrow side={position.arrow} />
      <div className="relative overflow-hidden rounded-[20px] border border-[#DDE8F6] bg-white/95 p-5 shadow-[0_24px_80px_rgba(3,14,24,0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0B1220]/95">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-[#EAF2FB] via-white to-[#FFF4D8] opacity-90 dark:from-[#12395F] dark:via-[#0B1220] dark:to-[#46350F]" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003366] shadow-lg shadow-blue-950/20">
              <Image
                src="/icons/login/tree.svg"
                alt="Talim"
                width={28}
                height={28}
                className="h-7 w-7"
              />
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

          <h3
            id="talim-guide-title"
            className="text-xl font-bold tracking-normal text-[#030E18] dark:text-white"
          >
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {step.description}
          </p>

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
              {isLast ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppGuide() {
  const pathname = usePathname();
  const { user, isLoading } = useAuthContext();
  const config = useMemo(() => findGuideConfig(pathname), [pathname]);
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [steps, setSteps] = useState<GuideStep[]>([]);

  const userId = getUserId(user);
  const currentStep = steps[stepIndex];

  const close = useCallback(
    (markDone = false) => {
      if (!config) return;
      localStorage.setItem(getSeenKey(config.id, userId), "done");
      if (markDone) {
        localStorage.setItem(getStorageKey(config.id, userId), "done");
      }
      setIsOpen(false);
    },
    [config, userId]
  );

  useEffect(() => {
    setStepIndex(0);
    setRect(null);

    if (!config || isLoading || !user) {
      setIsOpen(false);
      setSteps([]);
      return;
    }

    const completed = localStorage.getItem(getStorageKey(config.id, userId)) === "done";
    const seen = localStorage.getItem(getSeenKey(config.id, userId)) === "done";
    if (completed || seen) {
      setIsOpen(false);
      setSteps([]);
      return;
    }

    let cancelled = false;
    let timeout: number | null = null;
    let frame = 0;
    const startedAt = Date.now();

    const openWhenReady = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (cancelled) return;

        const nextSteps = getVisibleSteps(config);
        if (nextSteps.length > 0) {
          setSteps(nextSteps);
          setIsOpen(true);
          return;
        }

        if (Date.now() - startedAt < 6000) {
          timeout = window.setTimeout(openWhenReady, 250);
        }
      });
    };

    openWhenReady();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [config?.id, isLoading, userId, user, config]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const element = document.querySelector<HTMLElement>(
      `[data-guide="${currentStep.target}"]`
    );
    element?.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "smooth",
    });
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextRect = getTargetRect(currentStep.target);
        if (!nextRect && process.env.NODE_ENV === "development") {
          console.warn(`Guide target not found: ${currentStep.target}`);
        }
        setRect(nextRect);
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
      if (event.key === "ArrowRight") {
        setStepIndex((value) => Math.min(value + 1, steps.length - 1));
      }
      if (event.key === "ArrowLeft") {
        setStepIndex((value) => Math.max(value - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, steps.length]);

  if (!config || !user) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const nextSteps = getVisibleSteps(config);
          setSteps(nextSteps);
          setStepIndex(0);
          setIsOpen(nextSteps.length > 0);
        }}
        className="fixed bottom-5 right-5 z-[900] inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-4 py-3 text-sm font-bold text-[#003366] shadow-xl shadow-blue-950/10 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#F4B740] dark:border-white/10 dark:bg-[#0B1220]/90 dark:text-[#F4B740]"
      >
        <HelpCircle className="h-4 w-4" />
        Guide
      </button>

      {isOpen && currentStep && (
        <>
          <div className="fixed inset-0 z-[999] bg-[#030E18]/35 backdrop-blur-[1px]" />

          {rect && (
            <div
              className="pointer-events-none fixed z-[1000] rounded-[22px] border-2 border-[#F4B740] shadow-[0_0_0_9999px_rgba(3,14,24,0.28),0_0_34px_rgba(244,183,64,0.66)] transition-all duration-200"
              style={{
                top: Math.max(rect.top - 8, 8),
                left: Math.max(rect.left - 8, 8),
                width: rect.width + 16,
                height: rect.height + 16,
              }}
            />
          )}

          <GuideCard
            step={currentStep}
            current={stepIndex}
            total={steps.length}
            rect={rect}
            onBack={() => setStepIndex((value) => Math.max(value - 1, 0))}
            onNext={() =>
              setStepIndex((value) => Math.min(value + 1, steps.length - 1))
            }
            onDone={() => close(true)}
            onClose={() => close(false)}
          />
        </>
      )}
    </>
  );
}
