"use client";

import React from "react";
import { useTour } from "@/components/tour/TourProvider";
import { useSessions } from "@/hooks/account/useAccount";
import { APP_PLATFORM, APP_VERSION } from "@/lib/appInfo";
import { LinkRow, RowList, ValueRow } from "./SettingRows";
import type { SettingsSheetKey } from "./sheetKeys";

/** Props shared by the panels whose rows open sheets. */
export interface SheetOpenerProps {
  /** Opens one of the Settings sheets. */
  onOpenSheet: (sheet: SettingsSheetKey) => void;
}

/**
 * Settings → Help: replay the portal tour, contact the school office or
 * Talim, or report a problem. (The design's "Help centre" row is left out:
 * there is no help centre to link to yet.)
 *
 * @param props - See {@link SheetOpenerProps}.
 * @param props.onOpenSheet - Opens a sheet.
 * @returns The panel body.
 */
export function HelpPanel({ onOpenSheet }: SheetOpenerProps) {
  const { openTour } = useTour();
  return (
    <RowList>
      <LinkRow label="Getting started guide" description="Learn how to navigate Talim" onClick={openTour} />
      <LinkRow label="Contact support" description="Your school office and the Talim team" onClick={() => onOpenSheet("contact")} />
      <LinkRow label="Report a problem" description="Let us know if something isn't working" onClick={() => onOpenSheet("report")} />
    </RowList>
  );
}

/**
 * The value on the Active sessions row: how many devices, when the list is
 * already cached from an earlier visit, else "Manage".
 *
 * @param count - How many sessions, or undefined when not loaded.
 * @returns The short value.
 */
export function sessionsValue(count: number | undefined): string {
  if (count === undefined) return "Manage";
  return `${count} device${count === 1 ? "" : "s"}`;
}

/**
 * Settings → Security: change the password, and see or end the sessions the
 * account is signed in with. The sessions list is not fetched here; the row
 * shows the count only when an earlier visit cached it.
 *
 * @param props - See {@link SheetOpenerProps}.
 * @param props.onOpenSheet - Opens a sheet.
 * @returns The panel body.
 */
export function SecurityPanel({ onOpenSheet }: SheetOpenerProps) {
  const { data } = useSessions(false);
  return (
    <RowList>
      <LinkRow label="Change password" description="Update your account password." onClick={() => onOpenSheet("password")} />
      <LinkRow
        label="Active sessions"
        description="See where you're signed in and sign out of other devices."
        value={sessionsValue(data?.length)}
        onClick={() => onOpenSheet("sessions")}
      />
    </RowList>
  );
}

/**
 * Settings → About: the app's version and platform, and the privacy policy
 * and terms of service.
 *
 * @param props - See {@link SheetOpenerProps}.
 * @param props.onOpenSheet - Opens a sheet.
 * @returns The panel body.
 */
export function AboutPanel({ onOpenSheet }: SheetOpenerProps) {
  return (
    <RowList>
      <ValueRow label="App version" value={APP_VERSION} />
      <ValueRow label="Platform" value={APP_PLATFORM} />
      <LinkRow label="Privacy Policy" description="What Talim holds about you and who sees it" onClick={() => onOpenSheet("privacy")} />
      <LinkRow label="Terms of Service" description="The rules for using your Talim account" onClick={() => onOpenSheet("terms")} />
    </RowList>
  );
}
