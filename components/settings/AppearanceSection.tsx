"use client";

import { Check } from "lucide-react";
import { SectionHeader } from "@/components/settings/atoms";
import { THEME_OPTIONS } from "@/components/settings/config";
import { useTheme } from "@/providers/theme-provider";

/**
 * The light / dark / system picker.
 *
 * @returns The section element.
 */
export function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <SectionHeader title="Appearance" subtitle="Choose how Talim looks for you." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {THEME_OPTIONS.map(({ value, label, icon: Icon, desc }) => {
          const active = theme === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setTheme(value)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                active
                  ? "border-[#003366] bg-[#EEF3F9] dark:border-blue-500 dark:bg-blue-900/20"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
              }`}
            >
              <div
                className={`rounded-full p-2.5 ${
                  active
                    ? "bg-[#003366] text-white dark:bg-blue-600"
                    : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-sm font-semibold ${
                  active ? "text-[#003366] dark:text-blue-400" : "text-gray-700 dark:text-slate-300"
                }`}
              >
                {label}
              </span>
              <span className="text-center text-xs text-gray-500 dark:text-slate-400">{desc}</span>
              {active && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#003366] dark:bg-blue-600">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
