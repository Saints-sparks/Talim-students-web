"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { findGuideConfig, type GuideStep } from "@/components/onboarding/guideSteps";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  getCompletedKey,
  getGuideUserId,
  getSeenKey,
  getTargetRect,
  getVisibleSteps,
  readGuideFlag,
  writeGuideFlag,
  type TargetRect,
} from "@/lib/appGuide";
import { logger } from "@/lib/logger";

/** How long to keep waiting for the page to render the guided elements. */
const OPEN_TIMEOUT_MS = 6000;
const OPEN_POLL_MS = 250;

/**
 * The state behind the page tour: which guide belongs to this route, whether it
 * has been seen, which steps can be shown, and where the current step's target
 * sits on screen.
 *
 * A tour opens by itself once per student per guide, as soon as its targets have
 * rendered. Progress is remembered in `localStorage`, which may be unavailable;
 * the tour then simply shows again next visit.
 *
 * @returns The guide, its steps and the actions that drive it.
 */
export function useAppGuide() {
  const pathname = usePathname();
  const { user, isLoading } = useAuthContext();
  const config = useMemo(() => findGuideConfig(pathname), [pathname]);
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [steps, setSteps] = useState<GuideStep[]>([]);

  const hasUser = Boolean(user);
  const userId = getGuideUserId(user);
  const currentStep: GuideStep | undefined = steps[stepIndex];

  const close = useCallback(
    (markDone = false) => {
      if (!config) return;
      writeGuideFlag(getSeenKey(config.id, userId));
      if (markDone) writeGuideFlag(getCompletedKey(config.id, userId));
      setIsOpen(false);
    },
    [config, userId]
  );

  // Open the tour by itself the first time, once its targets exist.
  useEffect(() => {
    setStepIndex(0);
    setRect(null);
    setIsOpen(false);
    setSteps([]);

    if (!config || isLoading || !hasUser) return;
    if (readGuideFlag(getCompletedKey(config.id, userId)) || readGuideFlag(getSeenKey(config.id, userId))) return;

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

        if (Date.now() - startedAt < OPEN_TIMEOUT_MS) {
          timeout = window.setTimeout(openWhenReady, OPEN_POLL_MS);
        }
      });
    };

    openWhenReady();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [config, isLoading, hasUser, userId]);

  // Bring the target into view when the step changes.
  useEffect(() => {
    if (!isOpen || !currentStep) return;
    document
      .querySelector<HTMLElement>(`[data-guide="${currentStep.target}"]`)
      ?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
  }, [isOpen, currentStep]);

  // Keep the spotlight on the target through scrolling and resizing.
  useEffect(() => {
    if (!isOpen || !currentStep) return;

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextRect = getTargetRect(currentStep.target);
        if (!nextRect) logger.warn("onboarding", `Guide target not found: ${currentStep.target}`);
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

  const next = useCallback(() => setStepIndex((value) => Math.min(value + 1, steps.length - 1)), [steps.length]);
  const back = useCallback(() => setStepIndex((value) => Math.max(value - 1, 0)), []);

  // Keyboard: Esc dismisses, arrows move.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") back();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close, next, back]);

  /** Restarts the tour from the top, using whichever steps are on the page now. */
  const open = useCallback(() => {
    if (!config) return;
    const nextSteps = getVisibleSteps(config);
    setSteps(nextSteps);
    setStepIndex(0);
    setIsOpen(nextSteps.length > 0);
  }, [config]);

  return {
    /** False on routes without a guide or before sign-in, where nothing should render. */
    isAvailable: Boolean(config) && hasUser,
    isOpen,
    steps,
    stepIndex,
    currentStep,
    rect,
    open,
    next,
    back,
    /** Finishes the tour and never auto-opens it again. */
    finish: () => close(true),
    /** Closes the tour; it will not auto-open again, but the launcher still restarts it. */
    dismiss: () => close(false),
  };
}
