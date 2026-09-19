import type { GuideConfig } from "@/components/onboarding/guideSteps";
import type { User } from "@/types/auth";

/** A guided element's box, in viewport coordinates. */
export interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** The size of the window the coach card has to fit in. */
export interface Viewport {
  width: number;
  height: number;
}

/** Where the coach card sits, and which side its arrow points from. */
export interface CardPosition {
  top: string;
  left: string;
  transform: string;
  arrow: "left" | "right" | "top" | "bottom" | "hidden";
}

const STORAGE_PREFIX = "talim_student_guide";
/** Elements inside one of these are still loading and cannot be pointed at yet. */
const GUIDE_READY_SELECTOR = "[data-guide-ready='false'], [aria-busy='true']";

const CARD_HEIGHT = 330;
const VIEWPORT_PADDING = 16;

/**
 * Finds a guided element that is on the page, finished loading and visible.
 *
 * @param target - The `data-guide` value to look for.
 * @returns The element, or `null` when it is missing, still loading or zero-sized.
 */
function findReadyElement(target: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const element = document.querySelector<HTMLElement>(`[data-guide="${target}"]`);
  if (!element || element.closest(GUIDE_READY_SELECTOR)) return null;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 ? element : null;
}

/**
 * Measures a guided element.
 *
 * @param target - The `data-guide` value to measure.
 * @returns Its box, or `null` when it cannot be pointed at right now.
 */
export function getTargetRect(target: string): TargetRect | null {
  const element = findReadyElement(target);
  if (!element) return null;
  const { top, left, width, height } = element.getBoundingClientRect();
  return { top, left, width, height };
}

/**
 * The steps of a guide whose target is on the page right now, so a tour never
 * points at something that is still loading or not rendered.
 *
 * @param config - The guide for the current route.
 * @returns The steps that can be shown, in order.
 */
export function getVisibleSteps(config: GuideConfig) {
  if (typeof window === "undefined") return config.steps;
  return config.steps.filter((step) => findReadyElement(step.target) !== null);
}

/**
 * The id progress is remembered under.
 *
 * @param user - The signed-in user, or `null`.
 * @returns Their id, or "guest" when there is none.
 */
export function getGuideUserId(user: User | null): string {
  const candidate = user?.userId || user?._id || user?.id || user?.studentId;
  return typeof candidate === "string" && candidate ? candidate : "guest";
}

/**
 * The storage key that records a finished tour.
 *
 * @param guideId - The guide's id.
 * @param userId - The student's id.
 * @returns The key.
 */
export function getCompletedKey(guideId: string, userId: string): string {
  return `${STORAGE_PREFIX}:${userId}:${guideId}:completed`;
}

/**
 * The storage key that records a tour shown at least once, even if dismissed.
 *
 * @param guideId - The guide's id.
 * @param userId - The student's id.
 * @returns The key.
 */
export function getSeenKey(guideId: string, userId: string): string {
  return `${STORAGE_PREFIX}:${userId}:${guideId}:seen`;
}

/**
 * Reads a "done" flag. Storage can be blocked (private windows, site data
 * cleared), and the guide must still work without it.
 *
 * @param key - The storage key.
 * @returns True only when the flag was stored as "done".
 */
export function readGuideFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "done";
  } catch {
    return false;
  }
}

/**
 * Stores a "done" flag, ignoring a blocked or full store.
 *
 * @param key - The storage key.
 */
export function writeGuideFlag(key: string): void {
  try {
    localStorage.setItem(key, "done");
  } catch {
    // The tour simply shows again next visit.
  }
}

/**
 * Places the coach card next to the element it explains: beside it on wide
 * screens when there is room, otherwise below it (or above when it would run
 * off the bottom). With no target it centres on screen.
 *
 * @param rect - The guided element's box, or `null`.
 * @param viewport - The window size.
 * @returns The CSS position and the arrow side.
 */
export function computeCardPosition(rect: TargetRect | null, viewport: Viewport): CardPosition {
  if (!rect) {
    return { top: "50%", left: "50%", transform: "translate(-50%, -50%)", arrow: "hidden" };
  }

  const cardWidth = Math.min(400, viewport.width - 32);
  const spaceRight = viewport.width - (rect.left + rect.width);
  const spaceLeft = rect.left;
  const canUseSide = viewport.width >= 768 && (spaceRight > cardWidth + 32 || spaceLeft > cardWidth + 32);

  if (canUseSide) {
    const placeRight = spaceRight >= cardWidth + 32;
    const top = Math.min(
      Math.max(rect.top + rect.height / 2 - CARD_HEIGHT / 2, VIEWPORT_PADDING),
      Math.max(VIEWPORT_PADDING, viewport.height - CARD_HEIGHT - VIEWPORT_PADDING)
    );
    const left = placeRight
      ? Math.min(rect.left + rect.width + 24, viewport.width - cardWidth - VIEWPORT_PADDING)
      : Math.max(rect.left - cardWidth - 24, VIEWPORT_PADDING);

    return { top: `${top}px`, left: `${left}px`, transform: "none", arrow: placeRight ? "left" : "right" };
  }

  const below = rect.top + rect.height + 20;
  const fitsBelow = below + CARD_HEIGHT < viewport.height;
  const left = Math.min(
    Math.max(rect.left + rect.width / 2 - cardWidth / 2, VIEWPORT_PADDING),
    viewport.width - cardWidth - VIEWPORT_PADDING
  );

  return {
    top: fitsBelow ? `${below}px` : `${Math.max(VIEWPORT_PADDING, rect.top - CARD_HEIGHT - 20)}px`,
    left: `${left}px`,
    transform: "none",
    arrow: fitsBelow ? "top" : "bottom",
  };
}
