"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSubjectDetail } from "@/hooks/learner/queries";
import { useOpenCourseGroup } from "@/hooks/learner/actions";
import { PageHeader, SubjectDot } from "@/components/tl/bits";
import { ScreenError, ScreenLoading } from "@/components/tl/states";
import { card, ghostButton, textLink } from "@/components/tl/styles";
import type { StudentSubjectDetail } from "@/types/learner";
import { ScoresCard } from "./ScoresCard";
import { SchemeCard } from "./SchemeCard";
import { SubjectFilesCard } from "./SubjectFilesCard";

/**
 * "← Subjects", back to the list.
 *
 * @returns The link.
 */
function BackToSubjects() {
  return (
    <Link href="/subjects" className={`${textLink} self-start`} title="Back to all subjects">
      ← Subjects
    </Link>
  );
}

/** Props for {@link MessageSubjectButton}. */
export interface MessageSubjectButtonProps {
  /** The course whose group to open. */
  courseId: string;
  /** The subject group's room, or null when nobody has opened it yet. */
  roomId: string | null;
}

/**
 * "Message this subject": goes to the subject's group chat, starting the
 * group first when it has none yet (B10). Says "Opening…" while it does.
 *
 * @param props - See {@link MessageSubjectButtonProps}.
 * @param props.courseId - The course.
 * @param props.roomId - Its group's room, or null.
 * @returns The button.
 */
export function MessageSubjectButton({ courseId, roomId }: MessageSubjectButtonProps) {
  const { open, isOpening } = useOpenCourseGroup();
  return (
    <button
      type="button"
      className={ghostButton}
      data-guide="subject-message"
      title={roomId ? "Open this subject's group chat" : "Starts this subject's group chat"}
      aria-busy={isOpening || undefined}
      aria-disabled={isOpening || undefined}
      onClick={() => {
        // Not `disabled`: that would drop keyboard focus while the group opens.
        if (!isOpening) void open(courseId, roomId);
      }}
    >
      {isOpening ? "Opening…" : "Message this subject"}
    </button>
  );
}

/**
 * The Subject detail screen's content for one B4 answer: the heading with
 * the message button, the scores, what the class is covering and the files.
 *
 * @param props - Component props.
 * @param props.detail - B4's answer.
 * @returns The screen.
 */
export function SubjectDetailView({ detail }: { detail: StudentSubjectDetail }) {
  const { course } = detail;
  const subtitle = [course.code, detail.teacher?.name, detail.term?.name].filter(Boolean).join(" · ");
  return (
    <div className="flex flex-col gap-[18px]">
      <BackToSubjects />
      <PageHeader
        guide="subject-header"
        title={
          <span className="inline-flex items-center gap-2.5">
            <SubjectDot toneKey={course.id} sizeClass="h-3 w-3" />
            {course.title}
          </span>
        }
        subtitle={subtitle || undefined}
        actions={<MessageSubjectButton courseId={course.id} roomId={detail.roomId} />}
      />
      <ScoresCard detail={detail} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-4">
        <SchemeCard detail={detail} />
        <SubjectFilesCard detail={detail} />
      </div>
    </div>
  );
}

/**
 * The screen for a course the student does not take (the API's 404).
 *
 * @returns The not-found card with a way back.
 */
export function SubjectNotFound() {
  return (
    <div className="flex flex-col gap-[18px]">
      <BackToSubjects />
      <PageHeader title="Subject not found" />
      <div role="alert" className={card}>
        <p className="text-base font-bold text-tl-ink">We couldn&apos;t find that subject.</p>
        <p className="mt-1 text-[15px] text-tl-muted">It may not be one of your subjects this term.</p>
        <Link href="/subjects" className={`${textLink} mt-2`}>
          See all your subjects →
        </Link>
      </div>
    </div>
  );
}

/**
 * The route's course id, read once from the segment.
 *
 * @param value - `useParams().courseId`.
 * @returns The id, or an empty string.
 */
function courseIdFrom(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * The Subject detail screen (`/subjects/:courseId`): one
 * `GET /students/me/subjects/:courseId` call (B4).
 *
 * @returns The screen with its loading, error and not-found states.
 */
export default function SubjectDetailScreen() {
  const params = useParams<{ courseId: string }>();
  const courseId = courseIdFrom(params?.courseId);
  const { data, isLoading, error, errorCode, refetch } = useSubjectDetail(courseId || undefined);

  if (!courseId || errorCode === "NOT_FOUND" || errorCode === "FORBIDDEN") return <SubjectNotFound />;
  if (isLoading) return <ScreenLoading label="Loading the subject" blocks={3} />;
  if (error || !data) return <ScreenError message={error ?? "We couldn't load this subject. Please try again."} onRetry={refetch} />;
  return <SubjectDetailView detail={data} />;
}
