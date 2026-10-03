"use client";

import React from "react";
import { initialsOf } from "@/lib/learner/format";
import { subjectToneClass } from "@/lib/learner/subjectTone";
import type { ChatRoomType } from "@/types/chat";

/** Props for {@link RoomAvatar}. */
export interface RoomAvatarProps {
  /** The room's (or person's) name, for the initials. */
  name: string;
  /** The room type: the class group is navy, a subject group its subject's colour. */
  type?: ChatRoomType;
  /** A subject group's course, for its colour. */
  courseId?: string;
  /** A picture to show instead of initials. */
  imageUrl?: string;
  /** Size and text classes; 38px by default (the design's thread avatar). */
  sizeClass?: string;
}

/**
 * The round avatar beside a thread: its picture when it has one, otherwise
 * its initials on navy (class group), on the subject's colour (subject
 * group) or on pale blue (anything else). Decorative: the name beside it
 * carries the meaning.
 *
 * @param props - See {@link RoomAvatarProps}.
 * @param props.name - The name.
 * @param props.type - The room type.
 * @param props.courseId - The subject group's course.
 * @param props.imageUrl - The picture.
 * @param props.sizeClass - Size classes.
 * @returns The avatar.
 */
export function RoomAvatar({ name, type, courseId, imageUrl, sizeClass = "h-[38px] w-[38px] text-sm" }: RoomAvatarProps) {
  const base = `flex shrink-0 items-center justify-center overflow-hidden rounded-full font-extrabold ${sizeClass}`;
  if (imageUrl) {
    return (
      <span aria-hidden className={`${base} bg-tl-track`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      </span>
    );
  }
  const tone =
    type === "class_group"
      ? "bg-tl-brand-fill text-tl-on-brand"
      : type === "course_group"
        ? `${subjectToneClass(courseId || name)} bg-subj-solid text-white`
        : "bg-tl-select text-tl-brand";
  return (
    <span aria-hidden className={`${base} ${tone}`}>
      {initialsOf(name)}
    </span>
  );
}
