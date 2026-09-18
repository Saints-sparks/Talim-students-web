"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { type DashboardStyles, type StatusTone, toneStyles } from "@/components/dashboard/styles";
import type { ScheduleStatus } from "@/lib/dashboard/schedule";

/**
 * A dashed placeholder for a section that loaded successfully but has nothing
 * in it yet, with the next step the student can take.
 *
 * @param props - Component props.
 * @param props.icon - Glyph describing the section.
 * @param props.title - What is empty.
 * @param props.description - Why, or what happens next.
 * @param props.action - Optional link out of the empty state.
 * @param props.styles - Resolved dashboard styles.
 * @returns The empty-state element.
 */
export function SectionEmptyState({
  icon,
  title,
  description,
  action,
  styles,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  styles: DashboardStyles;
}) {
  return (
    <div
      className="flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center"
      style={styles.subtleCard}
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" style={toneStyles("primary", styles)}>
        {icon}
      </div>
      <p className="text-sm font-bold" style={{ color: styles.colors.text }}>
        {title}
      </p>
      <p className="mt-1 max-w-xs text-xs" style={{ color: styles.colors.textTertiary }}>
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/**
 * A pulsing block shaped like the content it stands in for.
 *
 * @param props - Component props.
 * @param props.className - Sizing classes.
 * @param props.styles - Resolved dashboard styles.
 * @returns The skeleton element.
 */
export function SkeletonBlock({ className, styles }: { className?: string; styles: DashboardStyles }) {
  return (
    <div
      className={`animate-pulse rounded-2xl ${className ?? ""}`}
      style={{ backgroundColor: styles.colors.surfaceAlt }}
      aria-hidden
    />
  );
}

/**
 * One of the three shortcuts beside the greeting.
 *
 * @param props - Component props.
 * @param props.href - Where it navigates.
 * @param props.label - Button text.
 * @param props.icon - Leading glyph.
 * @param props.primary - Renders it as the filled variant.
 * @param props.styles - Resolved dashboard styles.
 * @returns The action button.
 */
export function HeroAction({
  href,
  label,
  icon,
  primary,
  styles,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  primary?: boolean;
  styles: DashboardStyles;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="flex min-h-[86px] min-w-[112px] flex-col items-center justify-center gap-2 rounded-2xl border px-3 text-center text-xs font-bold transition-transform hover:-translate-y-0.5 sm:min-h-12 sm:min-w-[180px] sm:flex-row sm:px-5 sm:text-sm"
      style={{
        backgroundColor: primary ? styles.colors.primary : styles.colors.surface,
        borderColor: primary ? styles.colors.primary : styles.colors.border,
        color: primary ? styles.primaryText : styles.colors.primary,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/**
 * One KPI tile. Shows its own skeleton while its figure is loading, so a slow
 * section never blocks the rest of the dashboard.
 *
 * @param props - Component props.
 * @param props.icon - Glyph for the metric.
 * @param props.label - What the figure measures.
 * @param props.value - The figure itself.
 * @param props.subtext - One line of context under it.
 * @param props.href - Where the tile navigates.
 * @param props.tone - Accent for the icon chip.
 * @param props.loading - Renders the skeleton instead.
 * @param props.styles - Resolved dashboard styles.
 * @returns The KPI tile.
 */
export function KpiCard({
  icon,
  label,
  value,
  subtext,
  href,
  tone = "primary",
  loading,
  styles,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  subtext: string;
  href: string;
  tone?: StatusTone;
  loading?: boolean;
  styles: DashboardStyles;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="group rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5 sm:p-5"
      style={styles.card}
    >
      {loading ? (
        <div className="space-y-4">
          <SkeletonBlock className="h-11 w-11" styles={styles} />
          <SkeletonBlock className="h-8 w-20" styles={styles} />
          <SkeletonBlock className="h-4 w-28" styles={styles} />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={toneStyles(tone, styles)}>
              {icon}
            </span>
          </div>
          <p className="mt-4 text-3xl font-extrabold leading-tight" style={{ color: styles.colors.text }}>
            {value}
          </p>
          <p className="mt-1 text-sm font-bold" style={{ color: styles.colors.text }}>
            {label}
          </p>
          <p className="mt-1 min-h-4 text-xs" style={{ color: styles.colors.textTertiary }}>
            {subtext}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold" style={{ color: styles.colors.primary }}>
            View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </>
      )}
    </button>
  );
}

/**
 * The bordered card every dashboard section sits in.
 *
 * @param props - Component props.
 * @param props.title - Section heading.
 * @param props.action - Optional link in the header.
 * @param props.children - The section's content.
 * @param props.styles - Resolved dashboard styles.
 * @returns The section element.
 */
export function SectionCard({
  title,
  action,
  children,
  styles,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  styles: DashboardStyles;
}) {
  return (
    <section className="rounded-2xl border p-4 sm:p-5" style={styles.card}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold" style={{ color: styles.colors.text }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * A small "go to…" link, used in section headers and empty states.
 *
 * @param props - Component props.
 * @param props.href - Where it navigates.
 * @param props.label - Link text.
 * @param props.styles - Resolved dashboard styles.
 * @returns The link button.
 */
export function TextAction({ href, label, styles }: { href: string; label: string; styles: DashboardStyles }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="inline-flex items-center gap-1 text-xs font-bold"
      style={{ color: styles.colors.primary }}
    >
      {label} <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}

/**
 * The Completed / In Progress / Upcoming pill on today's schedule.
 *
 * @param props - Component props.
 * @param props.status - Where the class sits relative to now.
 * @param props.styles - Resolved dashboard styles.
 * @returns The badge element.
 */
export function StatusBadge({ status, styles }: { status: ScheduleStatus; styles: DashboardStyles }) {
  const tone: StatusTone = status === "Completed" ? "success" : status === "In Progress" ? "primary" : "warning";
  return (
    <span className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold" style={toneStyles(tone, styles)}>
      {status}
    </span>
  );
}

/**
 * A ring showing one percentage.
 *
 * @param props - Component props.
 * @param props.value - The percentage, clamped to 0–100.
 * @param props.label - What it measures.
 * @param props.tone - Accent for the ring.
 * @param props.styles - Resolved dashboard styles.
 * @returns The progress ring.
 */
export function CircularProgress({
  value,
  label,
  styles,
  tone = "success",
}: {
  value: number;
  label: string;
  styles: DashboardStyles;
  tone?: StatusTone;
}) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const color = toneStyles(tone, styles).color as string;

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg className="-rotate-90" height="128" width="128">
        <circle cx="64" cy="64" r={radius} stroke={styles.colors.borderLight} strokeWidth="12" fill="none" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-extrabold" style={{ color: styles.colors.text }}>
          {value}%
        </p>
        <p className="text-[11px] font-medium" style={{ color: styles.colors.textTertiary }}>
          {label}
        </p>
      </div>
    </div>
  );
}

/**
 * The whole-page skeleton, shown until the first KPI response arrives.
 *
 * @param props - Component props.
 * @param props.styles - Resolved dashboard styles.
 * @returns The skeleton page.
 */
export function DashboardSkeleton({ styles }: { styles: DashboardStyles }) {
  return (
    <Layout>
      <main className="min-h-full px-4 py-6 sm:px-6 lg:px-8" style={styles.page}>
        <div className="mx-auto max-w-[1280px] space-y-5">
          <SkeletonBlock className="h-24 w-full" styles={styles} />
          <SkeletonBlock className="h-24 w-full" styles={styles} />
          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-44 w-full" styles={styles} />
            ))}
          </section>
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-72 w-full" styles={styles} />
            ))}
          </section>
        </div>
      </main>
    </Layout>
  );
}
