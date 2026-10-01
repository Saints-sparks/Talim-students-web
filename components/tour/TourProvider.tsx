"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Sheet, SheetRow } from "@/components/tl/Sheet";
import { ghostButton, primaryButton, rowButton } from "@/components/tl/styles";
import { toast } from "@/components/CustomToast";
import { useAuthContext } from "@/contexts/AuthContext";

/** One step of the portal tour (the design's tour sheet, written for students). */
export interface TourStep {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}

export const TOUR_STEPS: readonly TourStep[] = [
  {
    title: "Today is your starting point",
    body: "Today shows the lesson coming up next and the rest of the day, how your term is going subject by subject, what your teachers have set for the coming weeks, and anything new since you last signed in.",
    href: "/dashboard",
    linkLabel: "Open Today",
  },
  {
    title: "Your week, lesson by lesson",
    body: "Timetable shows the whole week as your school set it. Use the arrows to see last week or next week, and narrow it to one day, the morning or the afternoon.",
    href: "/timetable",
    linkLabel: "Open Timetable",
  },
  {
    title: "Every subject in one place",
    body: "Open a subject for your score in each assessment, what you are covering this week and the files your teacher shared. ‘Message this subject’ opens the subject's group chat.",
    href: "/subjects",
    linkLabel: "Open Subjects",
  },
  {
    title: "Files from your teachers",
    body: "Search everything shared with your class, show one subject at a time, and download files one by one or all at once.",
    href: "/files",
    linkLabel: "Open Files",
  },
  {
    title: "Results and your report card",
    body: "Results shows each subject's scores, your grade and position, and the class average. Once your school publishes the term, print your report card or save it as a PDF.",
    href: "/results",
    linkLabel: "Open Results",
  },
  {
    title: "Attendance",
    body: "See how many days your school marked you present, late or absent this term, and pick an earlier term to compare.",
    href: "/attendance",
    linkLabel: "Open Attendance",
  },
  {
    title: "Messages and updates",
    body: "Messages holds your class group and a group for each subject. Updates has school announcements and alerts; the bell at the top shows how many you haven't read.",
    href: "/messages",
    linkLabel: "Open Messages",
  },
  {
    title: "Settings",
    body: "Choose what reaches you, change your photo or password, see where you're signed in, and replay this tour under Help. Each page also has a Guide button in the corner that walks you through it.",
    href: "/settings",
    linkLabel: "Open Settings",
  },
];

interface TourContextValue {
  /** Opens the tour at its first step. */
  openTour: () => void;
  /** Whether this student has finished the tour on this browser. */
  tourDone: boolean;
}

const TourContext = createContext<TourContextValue>({ openTour: () => undefined, tourDone: false });

/**
 * The tour's controls for the current subtree.
 *
 * @returns `openTour` and `tourDone`.
 */
export function useTour(): TourContextValue {
  return useContext(TourContext);
}

/**
 * The localStorage key that records a finished tour for one student.
 *
 * @param userId - The student's user id.
 * @returns The key.
 */
export function tourStorageKey(userId: string): string {
  return `talim.tour.done.${userId}`;
}

/**
 * Reads whether a student finished the tour on this browser.
 *
 * @param userId - The student's user id, or null.
 * @returns True once finished.
 */
function readTourDone(userId: string | null): boolean {
  if (!userId) return false;
  try {
    return Boolean(localStorage.getItem(tourStorageKey(userId)));
  } catch {
    return false;
  }
}

/**
 * Holds the portal tour (the design's "Getting started" sheet): one step per
 * area of the portal, each with a "Go" to that page, Back and Next, and
 * Finish on the last step. Settings → Help replays it. Finishing is
 * remembered per student on this browser (the students' API has no field for
 * it yet).
 *
 * @param props - Standard children.
 * @param props.children - The app.
 * @returns The provider and the sheet.
 */
export function TourProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const userId = (user?.userId || user?.id || null) as string | null;
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [doneVersion, setDoneVersion] = useState(0);

  const tourDone = useMemo(() => readTourDone(userId), [userId, doneVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const openTour = useCallback(() => {
    setStep(0);
    setOpen(true);
  }, []);

  const finish = useCallback(() => {
    setOpen(false);
    if (userId) {
      try {
        localStorage.setItem(tourStorageKey(userId), new Date().toISOString());
      } catch {
        /* storage blocked: the tour simply is not remembered */
      }
    }
    setDoneVersion((v) => v + 1);
    toast.success("Tour complete. You can replay it from Settings under Help.");
  }, [userId]);

  const value = useMemo(() => ({ openTour, tourDone }), [openTour, tourDone]);
  const current = TOUR_STEPS[Math.min(step, TOUR_STEPS.length - 1)];
  const last = step >= TOUR_STEPS.length - 1;

  return (
    <TourContext.Provider value={value}>
      {children}
      <Sheet
        open={open}
        onOpenChange={setOpen}
        eyebrowText="Getting started"
        title={current.title}
        footer={
          <>
            {step > 0 ? (
              <button type="button" className={ghostButton} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                Back
              </button>
            ) : null}
            <button type="button" className={`${primaryButton} ml-auto`} onClick={last ? finish : () => setStep((s) => s + 1)}>
              {last ? "Finish" : "Next"}
            </button>
          </>
        }
      >
        <p className="text-[13px] font-bold text-tl-faint" aria-live="polite">
          Step {step + 1} of {TOUR_STEPS.length}
        </p>
        <p className="text-sm leading-[1.7] text-tl-body">{current.body}</p>
        <SheetRow
          label={current.linkLabel}
          description="Take me there now"
          action={
            <Link href={current.href} className={rowButton} onClick={() => setOpen(false)}>
              Go
            </Link>
          }
        />
      </Sheet>
    </TourContext.Provider>
  );
}
