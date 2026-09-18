"use client";

import type { CSSProperties } from "react";
import { useTheme } from "@/providers/theme-provider";

/** The accent a dashboard element borrows from the theme. */
export type StatusTone = "primary" | "success" | "warning" | "error" | "muted" | "purple";

/**
 * Appends an alpha channel to a `#rrggbb` colour.
 *
 * @param hex - The base colour.
 * @param alphaHex - Two hex digits of opacity.
 * @returns The colour with alpha, or the input when it is not a hex colour.
 */
export function withAlpha(hex: string, alphaHex: string): string {
  if (!hex.startsWith("#") || hex.length !== 7) return hex;
  return `${hex}${alphaHex}`;
}

/** The resolved theme values every dashboard section renders against. */
export type DashboardStyles = ReturnType<typeof useDashboardStyles>;

/**
 * The dashboard's surface, page and card styling, resolved for the active
 * theme. Every colour comes from the theme tokens, so both themes stay legible.
 *
 * @returns Style objects and the raw colour tokens.
 */
export function useDashboardStyles() {
  const { colors, isDark } = useTheme();

  return {
    colors,
    isDark,
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.borderLight,
      boxShadow: isDark ? "0 18px 42px rgba(0, 0, 0, 0.18)" : "0 18px 42px rgba(16, 24, 40, 0.04)",
    } as CSSProperties,
    page: { backgroundColor: colors.bg, color: colors.text } as CSSProperties,
    subtleCard: { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight } as CSSProperties,
    primaryText: isDark ? colors.text : colors.surface,
  };
}

/**
 * Foreground and background for a toned element (badge, icon chip).
 *
 * @param tone - Which accent to use.
 * @param styles - The resolved dashboard styles.
 * @returns A style object ready to spread onto an element.
 */
export function toneStyles(tone: StatusTone, styles: DashboardStyles): CSSProperties {
  const color =
    tone === "success"
      ? styles.colors.success
      : tone === "warning"
        ? styles.colors.warning
        : tone === "error"
          ? styles.colors.error
          : tone === "purple"
            ? styles.colors.purple
            : tone === "muted"
              ? styles.colors.textTertiary
              : styles.colors.primary;

  return { color, backgroundColor: withAlpha(color, styles.isDark ? "22" : "12") };
}
