"use client";

import React from "react";
import { useTheme, type Theme } from "@/providers/theme-provider";
import { focusRing } from "@/components/tl/styles";
import { useRovingGroup } from "./roving";

/** One theme card. */
export interface ThemeChoice {
  value: Theme;
  label: string;
  desc: string;
}

/** The design's three theme cards. */
export const THEME_CHOICES: readonly ThemeChoice[] = [
  { value: "light", label: "Light", desc: "Always use light mode" },
  { value: "dark", label: "Dark", desc: "Always use dark mode" },
  { value: "system", label: "System", desc: "Follow device setting" },
];

const THEME_VALUES: readonly Theme[] = THEME_CHOICES.map((choice) => choice.value);

/**
 * Settings → Appearance: Light, Dark and System as a radio group of cards.
 * Choosing one applies it at once and remembers it on this browser.
 *
 * @param props - The panel.
 * @param props.labelledBy - The id of the panel heading that names the group.
 * @returns The panel body.
 */
export function AppearancePanel({ labelledBy }: { labelledBy: string }) {
  const { theme, setTheme } = useTheme();
  const itemProps = useRovingGroup(THEME_VALUES, theme, setTheme);

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3">
      {THEME_CHOICES.map((choice, index) => {
        const on = theme === choice.value;
        return (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-labelledby={`theme-${choice.value}-label`}
            aria-describedby={`theme-${choice.value}-desc`}
            title={choice.desc}
            onClick={() => setTheme(choice.value)}
            {...itemProps(choice.value, index)}
            className={`min-h-[44px] rounded-2xl border-2 p-[18px] text-left transition-colors ${focusRing} ${
              on ? "border-tl-brand-fill bg-tl-subtle" : "border-tl-line-soft bg-tl-surface hover:bg-tl-bg"
            }`}
          >
            <span id={`theme-${choice.value}-label`} className="block text-base font-extrabold text-tl-ink">
              {choice.label}
            </span>
            <span id={`theme-${choice.value}-desc`} className="mt-1 block text-[13px] text-tl-muted">
              {choice.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
