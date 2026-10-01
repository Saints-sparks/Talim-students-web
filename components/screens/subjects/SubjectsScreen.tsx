"use client";

import React from "react";
import Link from "next/link";
import { useSubjects } from "@/hooks/learner/queries";
import { PageHeader, SubjectDot } from "@/components/tl/bits";
import { EmptyNote, ScreenError, ScreenLoading } from "@/components/tl/states";
import { card, focusRing } from "@/components/tl/styles";
import { formatPercent, positionText } from "@/lib/learner/format";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import { filesCount } from "@/lib/files/fileMeta";
import type { StudentSubjects, SubjectSummary } from "@/types/learner";

/**
 * The small grey note beside a subject's score: "total · 3rd of 28", "total"
 * before ranks are out, or "no scores yet".
 *
 * @param subject - The subject card's data.
 * @returns The note.
 */
export function scoreNote(subject: Pick<SubjectSummary, "percent" | "position">): string {
  if (subject.percent === null) return "no scores yet";
  return subject.position ? `total · ${positionText(subject.position)}` : "total";
}

/**
 * The subject page's address.
 *
 * @param courseId - The course.
 * @returns `/subjects/:courseId`.
 */
export function subjectHref(courseId: string): string {
  return `/subjects/${encodeURIComponent(courseId)}`;
}

/**
 * One subject card: a single link to the subject's page with its teacher,
 * code, score and position, a bar of the score, this week's topic and how
 * many files are shared. Lifts on hover like the design.
 *
 * @param props - Component props.
 * @param props.subject - B3's card data.
 * @returns The card.
 */
export function SubjectCard({ subject }: { subject: SubjectSummary }) {
  const { course, teacher, percent } = subject;
  const partial = percent !== null && !subject.complete;
  const fill = percent === null ? 0 : Math.min(100, Math.max(0, percent));
  return (
    <Link
      href={subjectHref(course.id)}
      title={[course.title, teacher?.name].filter(Boolean).join(" · ")}
      className={`${subjectToneClass(course.id)} flex h-full flex-col rounded-[20px] border border-tl-line bg-tl-surface p-5 text-tl-ink shadow-[0_1px_2px_rgba(15,27,46,0.04)] transition-transform duration-150 hover:-translate-y-[3px] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:shadow-none ${focusRing}`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <SubjectDot toneKey={course.id} />
            <span className="text-lg font-extrabold tracking-[-0.3px]">{course.title}</span>
          </span>
          {teacher ? <span className="mt-1 block text-sm text-tl-muted">{teacher.name}</span> : null}
        </span>
        {course.code ? (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-subj-tint px-2.5 py-1.5 text-xs font-extrabold text-subj-ink">{course.code}</span>
        ) : null}
      </span>
      <span className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-[-0.5px]">{formatPercent(percent)}</span>
        <span className="text-sm text-tl-muted">{scoreNote(subject)}</span>
      </span>
      {/* The bar repeats the number read out above, so it is hidden from screen readers. */}
      <span aria-hidden className="mt-3 block h-[7px] overflow-hidden rounded bg-tl-track">
        <span className="block h-[7px] rounded bg-subj-solid" style={{ width: `${fill}%` }} />
      </span>
      {partial ? <span className="mt-2 block text-[13px] text-tl-muted">Not every score is out yet</span> : null}
      {subject.currentTopic ? (
        <span className="mt-3 block text-sm text-tl-body">This week: {subject.currentTopic.topic}</span>
      ) : null}
      {subject.resourceCount > 0 ? <span className="mt-1 block text-[13px] text-tl-muted">{filesCount(subject.resourceCount)}</span> : null}
      <span className="mt-auto block pt-3.5 text-sm font-bold text-tl-link">Open subject →</span>
    </Link>
  );
}

/**
 * The Subjects screen's content for one B3 answer: the heading and a grid of
 * subject cards, or a note when the class has no subjects yet.
 *
 * @param props - Component props.
 * @param props.data - B3's answer.
 * @returns The screen.
 */
export function SubjectsView({ data }: { data: StudentSubjects }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <PageHeader title="Subjects" subtitle="What you're covering this term, and your scores in each." guide="subjects-header" />
      {data.subjects.length ? (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-3.5" data-guide="subjects-grid">
          {data.subjects.map((subject) => (
            <li key={subject.course.id}>
              <SubjectCard subject={subject} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={card} data-guide="subjects-grid">
          <EmptyNote title="No subjects yet">Your school hasn&apos;t added subjects to your class for this term.</EmptyNote>
        </div>
      )}
    </div>
  );
}

/**
 * The Subjects screen (`/subjects`): one `GET /students/me/subjects` call
 * (B3) for every card.
 *
 * @returns The screen with its loading and error states.
 */
export default function SubjectsScreen() {
  const { data, isLoading, error, refetch } = useSubjects();
  if (isLoading) return <ScreenLoading label="Loading your subjects" blocks={3} />;
  if (error || !data) return <ScreenError message={error ?? "We couldn't load your subjects. Please try again."} onRetry={refetch} />;
  return <SubjectsView data={data} />;
}
