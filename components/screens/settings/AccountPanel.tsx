"use client";

import React from "react";
import { rowButton } from "@/components/tl/styles";
import { formatLongDayMonthYear, initialsOf } from "@/lib/learner/format";
import type { User } from "@/types/auth";

const NONE = "—";

/** One labelled value on the profile card. */
export interface ProfileField {
  label: string;
  value: string;
}

/**
 * The student's full name from the session.
 *
 * @param user - The signed-in student, or null.
 * @returns "Musa Adele", or an empty string.
 */
export function fullNameOf(user: User | null | undefined): string {
  return `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
}

/**
 * The profile card's fields, in the design's order. Anything the school has
 * not recorded reads as a dash; the date of birth reads "12 March 2013".
 *
 * @param user - The signed-in student, or null before the session loads.
 * @returns The six fields.
 */
export function profileFields(user: User | null | undefined): ProfileField[] {
  const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : NONE);
  return [
    { label: "Full name", value: fullNameOf(user) || NONE },
    { label: "Registration no.", value: text(user?.admissionNumber) },
    { label: "Class", value: text(user?.className) },
    { label: "Date of birth", value: formatLongDayMonthYear(user?.dateOfBirth) || NONE },
    { label: "Email", value: text(user?.email) },
    { label: "Phone", value: text(user?.phoneNumber) },
  ];
}

/**
 * "Student · Jss1 A · Easy Sparks Education Center", leaving out what is missing.
 *
 * @param user - The signed-in student.
 * @returns The line under the name.
 */
export function profileSubline(user: User | null | undefined): string {
  return ["Student", user?.className, user?.schoolName].filter((part) => typeof part === "string" && part.trim()).join(" · ");
}

/**
 * The student's photo, or their initials when there is none.
 *
 * @param props - The avatar.
 * @param props.user - The signed-in student.
 * @param props.sizeClass - Width, height and text size classes.
 * @returns The round avatar (decorative: the name sits beside it).
 */
export function ProfileAvatar({ user, sizeClass = "h-[70px] w-[70px] text-[22px]" }: { user: User | null | undefined; sizeClass?: string }) {
  const photo = typeof user?.userAvatar === "string" && user.userAvatar ? user.userAvatar : null;
  return (
    <div aria-hidden className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-tl-select font-extrabold text-tl-brand ${sizeClass}`}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="h-full w-full object-cover" />
      ) : (
        initialsOf(fullNameOf(user) || "Student")
      )}
    </div>
  );
}

/** Props for {@link AccountPanel}. */
export interface AccountPanelProps {
  /** The signed-in student. */
  user: User | null | undefined;
  /** Opens the photo sheet. */
  onChangePhoto: () => void;
}

/**
 * Settings → Account: the profile card (photo, name, class and school, the
 * six fields from the session) and the note that the school office owns
 * these details.
 *
 * @param props - See {@link AccountPanelProps}.
 * @param props.user - The student.
 * @param props.onChangePhoto - Opens the photo sheet.
 * @returns The panel body.
 */
export function AccountPanel({ user, onChangePhoto }: AccountPanelProps) {
  const name = fullNameOf(user);
  return (
    <>
      <div className="mt-5 rounded-[18px] border border-tl-line-soft p-5">
        <div className="flex flex-wrap items-center gap-[18px]">
          <ProfileAvatar user={user} />
          <div className="min-w-[180px] flex-1">
            <div className="text-[19px] font-extrabold text-tl-ink">{name || "Your account"}</div>
            <div className="mt-[3px] text-sm text-tl-muted">{profileSubline(user)}</div>
          </div>
          <button type="button" className={`${rowButton} px-[18px]`} title="Upload a new profile photo" onClick={onChangePhoto}>
            Change photo
          </button>
        </div>
        <dl className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-x-6 gap-y-4 border-t border-tl-line-soft pt-5">
          {profileFields(user).map((field) => (
            <div key={field.label}>
              <dt className="text-xs font-bold uppercase tracking-[0.05em] text-tl-faint">{field.label}</dt>
              <dd className="mt-1 break-words text-[15px] font-bold text-tl-ink">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-3.5 rounded-[14px] bg-tl-select px-4 py-3.5 text-sm leading-normal text-tl-brand">
        Your name, class, date of birth and guardian details are set by your school office. Ask them to correct anything that looks wrong.
      </p>
    </>
  );
}
