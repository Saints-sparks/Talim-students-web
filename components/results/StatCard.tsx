import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * One summary tile: a value, what it measures, and a note.
 *
 * @param props - Component props.
 * @param props.icon - The glyph shown top right.
 * @param props.value - The headline figure, or a placeholder while it loads.
 * @param props.label - What the figure measures.
 * @param props.sub - A short qualifier under the label.
 * @returns The tile.
 */
export function StatCard({
  icon,
  value,
  label,
  sub,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <Card className="border border-[#F0F0F0] shadow-none rounded-2xl dark:border-[#30435F] dark:bg-[#1B2A44]">
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-bold text-[#030E18] dark:text-white leading-tight tabular-nums">
              {value}
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#6F6F6F] dark:text-slate-300 mt-1 truncate">
              {label}
            </div>
            {sub && <div className="text-xs text-[#AAAAAA] dark:text-slate-400 mt-0.5">{sub}</div>}
          </div>
          <div className="flex-shrink-0 p-2 sm:p-2.5 bg-[#003366]/10 dark:bg-blue-300/15 rounded-xl text-[#003366] dark:text-blue-200">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
