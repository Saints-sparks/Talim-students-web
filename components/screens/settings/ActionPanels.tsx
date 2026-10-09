"use client";

import React from "react";
import { useTour } from "@/components/tour/TourProvider";
import { useSessions } from "@/hooks/account/useAccount";
import { APP_PLATFORM, APP_VERSION, SUPPORT_URL } from "@/lib/appInfo";
import { DangerZone } from "./DeleteAccountSheet";
import { LinkRow, RowList, ValueRow } from "./SettingRows";
import type { SettingsSheetKey } from "./sheetKeys";
import { SupportSection } from "./support/SupportSection";

/** Props shared by the panels whose rows open sheets. */
export interface SheetOpenerProps {
  /** Opens one of the Settings sheets. */
  onOpenSheet: (sheet: SettingsSheetKey) => void;
}

/** Props for {@link HelpPanel}. */
export interface HelpPanelProps extends SheetOpenerProps {
  /** The ticket whose thread is open (`?ticket=`, a support notification's link), or null. */
  ticketId: string | null;
  /** Opens a ticket's thread, or closes it with null. */
  onTicketChange: (ticketId: string | null) => void;
}

/**
 * Settings → Help: replay the portal tour, contact the school office or
 * Talim, and My tickets (v1.5 tickets to the school or Talim support, which
 * replaced "Report a problem"). The design's "Help centre" row is left out:
 * there is no help centre to link to yet.
 *
 * @param props - See {@link HelpPanelProps}.
 * @param props.onOpenSheet - Opens a sheet.
 * @param props.ticketId - The ticket whose thread is open.
 * @param props.onTicketChange - Opens or closes a thread.
 * @returns The panel body.
 */
export function HelpPanel({ onOpenSheet, ticketId, onTicketChange }: HelpPanelProps) {
  const { openTour } = useTour();
  return (
    <>
      <RowList>
        <LinkRow label="Getting started guide" description="Learn how to navigate Talim" onClick={openTour} />
        <LinkRow label="Contact support" description="Your school office and the Talim team" onClick={() => onOpenSheet("contact")} />
      </RowList>
      <SupportSection openTicketId={ticketId} onOpenTicket={onTicketChange} />
    </>
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
 * Settings → Security: change the password, see or end the sessions the
 * account is signed in with, and the Danger zone with Delete account (v1.5).
 * The sessions list is not fetched here; the row shows the count only when
 * an earlier visit cached it.
 *
 * @param props - See {@link SheetOpenerProps}.
 * @param props.onOpenSheet - Opens a sheet.
 * @returns The panel body.
 */
export function SecurityPanel({ onOpenSheet }: SheetOpenerProps) {
  const { data } = useSessions(false);
  return (
    <>
      <RowList>
        <LinkRow label="Change password" description="Update your account password." onClick={() => onOpenSheet("password")} />
        <LinkRow
          label="Active sessions"
          description="See where you're signed in and sign out of other devices."
          value={sessionsValue(data?.length)}
          onClick={() => onOpenSheet("sessions")}
        />
      </RowList>
      <DangerZone onDelete={() => onOpenSheet("delete")} />
    </>
  );
}

/**
 * Settings → About: the app and its version ("Version 1.5.0", read from
 * `package.json`), the privacy policy and terms of service (in-app sheets
 * that link to the full pages), and Talim's support page.
 *
 * @param props - See {@link SheetOpenerProps}.
 * @param props.onOpenSheet - Opens a sheet.
 * @returns The panel body.
 */
export function AboutPanel({ onOpenSheet }: SheetOpenerProps) {
  return (
    <RowList>
      <ValueRow label={APP_PLATFORM} value={`Version ${APP_VERSION}`} />
      <LinkRow label="Privacy Policy" description="What Talim holds about you and who sees it" onClick={() => onOpenSheet("privacy")} />
      <LinkRow label="Terms of Service" description="The rules for using your Talim account" onClick={() => onOpenSheet("terms")} />
      <LinkRow label="Support" description="Guides and how to reach Talim" href={SUPPORT_URL} />
    </RowList>
  );
}
