"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { SubjectDot } from "@/components/tl/bits";
import { card, eyebrow, focusRing, ghostButton, primaryButton } from "@/components/tl/styles";
import { formatTimeRange } from "@/lib/learner/format";
import type { StudentToday, TodayLesson } from "@/types/learner";

/**
 * Splits today's lessons into the one on now, the next one, and the rest
 * still to come (in time order), in one pass.
 *
 * @param today - B1's answer.
 * @returns `now`, `next` and `rest`.
 */
export function splitLessons(today: Pick<StudentToday, "lessons" | "nowLessonId" | "nextLessonId">): {
  now: TodayLesson | null;
  next: TodayLesson | null;
  rest: TodayLesson[];
} {
  let now: TodayLesson | null = null;
  let next: TodayLesson | null = null;
  const rest: TodayLesson[] = [];
  for (const lesson of today.lessons) {
    if (lesson.id === today.nowLessonId) now = lesson;
    else if (lesson.id === today.nextLessonId) next = lesson;
    else if (lesson.state === "later" && !lesson.cancelled) rest.push(lesson);
  }
  return { now, next, rest };
}

/**
 * The subject page of a lesson.
 *
 * @param lesson - The lesson.
 * @returns `/subjects/:courseId`.
 */
function subjectHref(lesson: TodayLesson): string {
  return `/subjects/${encodeURIComponent(lesson.course.id)}`;
}

/**
 * "Up next": the next lesson with its time and teacher, the lesson on now (if
 * any) in a line above, and buttons to the week and to the subject. On a day
 * without lessons it says so.
 *
 * @param props - Component props.
 * @param props.today - B1's answer.
 * @returns The card.
 */
export function UpNextCard({ today }: { today: StudentToday }) {
  const { now, next } = useMemo(() => splitLessons(today), [today]);
  const lesson = next ?? null;
  const noLessons = today.lessons.length === 0;

  return (
    <section aria-labelledby="upnext-title" className={card} title="The lesson starting next">
      <h2 id="upnext-title" className={eyebrow}>
        Up next
      </h2>
      {now ? (
        <p className="mt-3 text-sm text-tl-muted">
          Now: <span className="font-bold text-tl-ink">{now.course.title}</span>
          {now.minutesLeft !== null ? ` · ${now.minutesLeft} min left` : ""}
        </p>
      ) : null}
      {lesson ? (
        <>
          <div className="mt-3 flex items-center gap-2.5">
            <SubjectDot toneKey={lesson.course.id} />
            <p className="text-[21px] font-extrabold tracking-[-0.3px]">{lesson.course.title}</p>
          </div>
          <p className="mt-1.5 text-[15px] text-tl-muted">
            {formatTimeRange(lesson.startTime, lesson.endTime)}
            {lesson.teacher ? ` · ${lesson.teacher.name}` : ""}
            {lesson.room ? ` · ${lesson.room}` : ""}
          </p>
          {lesson.topic ? <p className="mt-1 text-sm text-tl-muted">This week: {lesson.topic.topic}</p> : null}
        </>
      ) : (
        <p className="mt-3 text-[17px] font-bold">
          {noLessons ? (today.schoolDay.isSchoolDay ? "No lessons on your timetable today" : "No lessons today") : "That's all for today"}
        </p>
      )}
      <div className="mt-[18px] flex flex-wrap gap-2.5">
        <Link href="/timetable" className={primaryButton} title="See the whole week">
          Full week
        </Link>
        {lesson ? (
          <Link href={subjectHref(lesson)} className={ghostButton} title="Curriculum, files and your scores">
            Open the subject
          </Link>
        ) : null}
      </div>
    </section>
  );
}

/**
 * "Rest of today": every later lesson after the next one, each a link to its
 * subject.
 *
 * @param props - Component props.
 * @param props.today - B1's answer.
 * @returns The card.
 */
export function RestOfToday({ today }: { today: StudentToday }) {
  const { rest } = useMemo(() => splitLessons(today), [today]);
  const dayName = today.day || "today";
  return (
    <section aria-labelledby="rest-title" className={card} title={`The rest of ${dayName}'s lessons`}>
      <h2 id="rest-title" className={eyebrow}>
        Rest of today
      </h2>
      {rest.length ? (
        <ul className="mt-3.5 flex flex-col gap-2">
          {rest.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={subjectHref(lesson)}
                title={lesson.teacher?.name ?? lesson.course.title}
                className={`flex min-h-[44px] items-center gap-3 rounded-[14px] border border-tl-line-soft px-3.5 py-3 hover:border-tl-control ${focusRing}`}
              >
                <span className="w-[92px] shrink-0 text-[13px] font-semibold text-tl-muted">{formatTimeRange(lesson.startTime, lesson.endTime)}</span>
                <SubjectDot toneKey={lesson.course.id} />
                <span className="min-w-0 flex-1 truncate text-[15px] font-bold">{lesson.course.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3.5 text-[15px] text-tl-muted">Nothing else on your timetable today.</p>
      )}
    </section>
  );
}
