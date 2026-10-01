"use client";

import React from "react";
import Link from "next/link";
import { CalendarOff, Clock } from "lucide-react";
import { textLink } from "@/components/tl/styles";
import type { StudentToday } from "@/types/learner";

/**
 * The line of the day's notice, from B1 `schoolDay`.
 *
 * @param today - B1's answer.
 * @returns The title and sentence, or null on an ordinary school day.
 */
export function schoolDayMessage(today: Pick<StudentToday, "schoolDay">): { title: string; text: string } | null {
  const { schoolDay } = today;
  if (!schoolDay.isSchoolDay) {
    if (schoolDay.reason === "holiday") {
      return {
        title: schoolDay.holidayTitle ? `${schoolDay.holidayTitle} — no school today` : "Public holiday — no school today",
        text: "Enjoy the day off. Your next lessons are on the timetable.",
      };
    }
    if (schoolDay.reason === "no_term") {
      return { title: "School is between terms", text: "Lessons start again when the new term begins." };
    }
    return { title: "It's the weekend — no lessons today", text: "Your timetable for the coming week is ready." };
  }
  if (schoolDay.endsEarlyAt) {
    return { title: `School ends early today, at ${schoolDay.endsEarlyAt}`, text: "Lessons after that time are not held." };
  }
  return null;
}

/**
 * A notice above the cards on a weekend, a holiday, between terms, or a day
 * that ends early. Nothing on an ordinary school day.
 *
 * @param props - Component props.
 * @param props.today - B1's answer.
 * @returns The notice, or null.
 */
export function SchoolDayNotice({ today }: { today: StudentToday }) {
  const message = schoolDayMessage(today);
  if (!message) return null;
  const Icon = today.schoolDay.isSchoolDay ? Clock : CalendarOff;
  return (
    <div role="status" className="flex flex-wrap items-center gap-3.5 rounded-[18px] border border-tl-line bg-tl-select px-5 py-4 text-tl-brand">
      <Icon aria-hidden className="h-5 w-5 shrink-0" />
      <div className="min-w-[200px] flex-1">
        <p className="text-[15px] font-extrabold">{message.title}</p>
        <p className="mt-0.5 text-sm">{message.text}</p>
      </div>
      {!today.schoolDay.isSchoolDay ? (
        <Link href="/timetable" className={textLink}>
          See the timetable →
        </Link>
      ) : null}
    </div>
  );
}
