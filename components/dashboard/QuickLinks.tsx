"use client";

import { useRouter } from "next/navigation";
import { BarChart3, Bell, Calendar, CheckCircle2, FolderOpen, GraduationCap, MessageSquare } from "lucide-react";
import { type DashboardStyles, withAlpha } from "@/components/dashboard/styles";

const LINKS = [
  { label: "Subjects", sub: "View subjects", icon: GraduationCap, href: "/subjects" },
  { label: "Resources", sub: "Browse resources", icon: FolderOpen, href: "/resources" },
  { label: "Timetable", sub: "View schedule", icon: Calendar, href: "/timetable" },
  { label: "Attendance", sub: "My attendance", icon: CheckCircle2, href: "/attendance" },
  { label: "Results", sub: "View results", icon: BarChart3, href: "/results" },
  { label: "Messages", sub: "Open inbox", icon: MessageSquare, href: "/messages" },
  { label: "Notifications", sub: "View all", icon: Bell, href: "/notifications" },
] as const;

/**
 * The shortcut row at the foot of the dashboard.
 *
 * @param props - Component props.
 * @param props.styles - Resolved dashboard styles.
 * @returns The quick-links section.
 */
export default function QuickLinks({ styles }: { styles: DashboardStyles }) {
  const router = useRouter();

  return (
    <section className="rounded-2xl border p-5" style={styles.card}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold" style={{ color: styles.colors.text }}>
          Quick Links
        </h2>
        <span className="hidden text-xs sm:inline" style={{ color: styles.colors.textTertiary }}>
          Learning shortcuts
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className="group flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-transform hover:-translate-y-0.5"
              style={{ borderColor: styles.colors.borderLight, backgroundColor: styles.colors.surface }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: withAlpha(styles.colors.primary, "12"), color: styles.colors.primary }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold" style={{ color: styles.colors.text }}>
                {item.label}
              </span>
              <span className="hidden text-xs sm:block" style={{ color: styles.colors.textTertiary }}>
                {item.sub}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
