"use client";

import React from "react";
import { Sheet } from "@/components/tl/Sheet";
import { primaryButton, textLink } from "@/components/tl/styles";
import { PRIVACY_POLICY_URL, SUPPORT_EMAIL, TERMS_OF_SERVICE_URL } from "@/lib/appInfo";
import type { SettingsSheetProps } from "./sheetKeys";

/** One heading and paragraph of a legal text. */
export interface LegalSection {
  heading: string;
  body: string;
}

/**
 * The privacy policy as students read it (adapted from the teacher design's
 * text: what Talim holds, who sees what, groups-only messages, retention,
 * security and rights).
 */
export const PRIVACY_SECTIONS: readonly LegalSection[] = [
  {
    heading: "What this covers",
    body: "How Talim handles your information when you use the student portal. Your school chose Talim and is responsible for your school record; Talim looks after it on the school's behalf.",
  },
  {
    heading: "What we hold about you",
    body: "Your name, registration number, class, date of birth, email and phone as your school recorded them, your photo if you add one, your scores, attendance and report cards, sign-in times and device type, and the messages you post in your groups.",
  },
  {
    heading: "Who can see what",
    body: "You see your own results, attendance and the files shared with your class. Your parents or guardians see your published results and your attendance. Your teachers see the classes and subjects they teach. School administrators can see your school record. Other students never see your scores or attendance.",
  },
  {
    heading: "Messages",
    body: "Students message in groups only: your class group and a group for each subject. Everyone in a group, including your teachers, can read what is posted there. Messages are kept so conversations carry on across devices, and your school may review them if a safeguarding concern is raised.",
  },
  {
    heading: "Retention",
    body: "Academic records are kept for six years after you leave the school, as schools require. Sign-in logs are kept for twelve months. When you leave, your account is closed and your contact details are removed within thirty days; your academic record stays with the school.",
  },
  {
    heading: "Security",
    body: "Data is encrypted in transit and at rest, and staff access at Talim is logged. Keep your password to yourself, sign out on shared computers, and check Settings → Security to see where you are signed in.",
  },
  {
    heading: "Your rights",
    body: `You, or your parent or guardian, can ask for a copy of your personal data, ask for corrections, or object to a use of it by writing to ${SUPPORT_EMAIL}. You may also contact the Nigeria Data Protection Commission. Last updated 19 September 2026.`,
  },
];

/** The terms of service as students read them. */
export const TERMS_SECTIONS: readonly LegalSection[] = [
  {
    heading: "Agreement",
    body: "By signing in you accept these terms. Your school licenses Talim and decides which classes and subjects you can see.",
  },
  {
    heading: "Your account",
    body: "The account is personal. Do not share your password or let anyone else sign in as you, and sign out on shared computers. Tell your school office straight away if you think someone else has used it.",
  },
  {
    heading: "Conduct in groups",
    body: "Be respectful in your class and subject groups and follow your school's rules on behaviour. Do not post anything hurtful, private or unrelated to school, and do not share other students' information. Your teachers can see the groups, and your school can act on what is posted.",
  },
  {
    heading: "Files are for learning",
    body: "Files your teachers share are for your own learning. Do not post them publicly or sell them, and only share files in your groups that you have the right to share.",
  },
  {
    heading: "Results and attendance",
    body: "Your results, attendance and report cards come from your school. If something looks wrong, ask your teacher or the school office; Talim cannot change them.",
  },
  {
    heading: "Availability",
    body: "We aim to keep the portal available at all times and announce planned maintenance in advance.",
  },
  {
    heading: "Ending access",
    body: "Your access ends when you leave the school or your school removes you. Your academic record stays with the school under the privacy policy.",
  },
  {
    heading: "Contact",
    body: `Questions about these terms go to ${SUPPORT_EMAIL}. Last updated 19 September 2026.`,
  },
];

/** Props for {@link LegalSheet}. */
export interface LegalSheetProps extends SettingsSheetProps {
  /** Which text to show. */
  kind: "privacy" | "terms";
}

/**
 * The privacy policy or the terms of service, as headed sections in a sheet,
 * with "Read the full policy" linking the full page on www.mytalim.com.
 *
 * @param props - See {@link LegalSheetProps}.
 * @param props.open - Whether it shows.
 * @param props.onOpenChange - Open/close callback.
 * @param props.kind - Which text.
 * @returns The sheet.
 */
export function LegalSheet({ open, onOpenChange, kind }: LegalSheetProps) {
  const sections = kind === "privacy" ? PRIVACY_SECTIONS : TERMS_SECTIONS;
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      eyebrowText="Talim"
      title={kind === "privacy" ? "Privacy Policy" : "Terms of Service"}
      subtitle="For students · effective 19 September 2026"
      footer={
        <>
          <a href={kind === "privacy" ? PRIVACY_POLICY_URL : TERMS_OF_SERVICE_URL} target="_blank" rel="noopener noreferrer" className={textLink}>
            Read the full policy
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button type="button" className={`${primaryButton} ml-auto`} onClick={() => onOpenChange(false)}>
            Close
          </button>
        </>
      }
    >
      {sections.map((section) => (
        <section key={section.heading}>
          <h3 className="mb-1.5 text-[15px] font-extrabold tracking-[-0.2px] text-tl-ink">{section.heading}</h3>
          <p className="text-sm leading-[1.7] text-tl-body">{section.body}</p>
        </section>
      ))}
    </Sheet>
  );
}
