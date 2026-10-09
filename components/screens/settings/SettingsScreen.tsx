"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/tl/bits";
import { ScreenLoading } from "@/components/tl/states";
import { focusRing } from "@/components/tl/styles";
import { SETTINGS_TABS, parseSettingsTab, type SettingsTabKey } from "./settingsTabs";
import { parseTicketParam, supportHref } from "@/lib/support/tickets";
import { useRovingGroup } from "./roving";
import type { SettingsSheetKey } from "./sheetKeys";
import { AccountPanel } from "./AccountPanel";
import { MessagesPanel, NotificationsPanel } from "./PreferencePanels";
import { AboutPanel, HelpPanel, SecurityPanel } from "./ActionPanels";
import { AppearancePanel } from "./AppearancePanel";
import { PhotoSheet } from "./PhotoSheet";
import { PasswordSheet } from "./PasswordSheet";
import { SessionsSheet } from "./SessionsSheet";
import { ContactSheet } from "./ContactSheet";
import { LegalSheet } from "./LegalSheet";
import { DeleteAccountSheet } from "./DeleteAccountSheet";

const TAB_KEYS: readonly SettingsTabKey[] = SETTINGS_TABS.map((tab) => tab.key);
const PANEL_TITLE_ID = "settings-panel-title";

/** Props for {@link SettingsView}. */
export interface SettingsViewProps {
  /** The tab showing. */
  tab: SettingsTabKey;
  /** Called when the student picks another tab. */
  onTabChange: (tab: SettingsTabKey) => void;
  /** The support ticket whose thread is open on Help (`?ticket=`), or null. */
  ticketId?: string | null;
  /** Opens a ticket's thread on Help, or closes it with null. */
  onTicketChange?: (ticketId: string | null) => void;
}

/**
 * The Settings screen for one chosen tab: the tab list (a real ARIA tablist:
 * arrow keys, Home and End move and choose) beside the chosen tab's panel,
 * stacked below 760px, and the sheets the panels open.
 *
 * @param props - See {@link SettingsViewProps}.
 * @param props.tab - The tab showing.
 * @param props.onTabChange - Picks another tab.
 * @param props.ticketId - The support ticket whose thread is open.
 * @param props.onTicketChange - Opens or closes a ticket's thread.
 * @returns The screen.
 */
export function SettingsView({ tab, onTabChange, ticketId = null, onTicketChange = () => undefined }: SettingsViewProps) {
  const { user } = useAuthContext();
  const [sheet, setSheet] = useState<SettingsSheetKey | null>(null);
  const tabProps = useRovingGroup(TAB_KEYS, tab, onTabChange);
  const active = SETTINGS_TABS.find((item) => item.key === tab) ?? SETTINGS_TABS[0];

  /**
   * The open/close props of one sheet.
   *
   * @param key - Which sheet.
   * @returns `open` and `onOpenChange` for it.
   */
  const sheetProps = (key: SettingsSheetKey) => ({
    open: sheet === key,
    onOpenChange: (open: boolean) => setSheet(open ? key : null),
  });

  let panel: React.ReactNode;
  switch (active.key) {
    case "notifications":
      panel = <NotificationsPanel />;
      break;
    case "messages":
      panel = <MessagesPanel />;
      break;
    case "help":
      panel = <HelpPanel onOpenSheet={setSheet} ticketId={ticketId} onTicketChange={onTicketChange} />;
      break;
    case "security":
      panel = <SecurityPanel onOpenSheet={setSheet} />;
      break;
    case "appearance":
      panel = <AppearancePanel labelledBy={PANEL_TITLE_ID} />;
      break;
    case "about":
      panel = <AboutPanel onOpenSheet={setSheet} />;
      break;
    default:
      panel = <AccountPanel user={user} onChangePhoto={() => setSheet("photo")} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Settings" subtitle="Manage your profile, notifications, messages and account security." />

      <div className="grid grid-cols-1 items-start gap-3.5 min-[760px]:grid-cols-[minmax(210px,280px)_minmax(0,1fr)] min-[760px]:gap-4">
        <div
          role="tablist"
          aria-label="Settings"
          aria-orientation="vertical"
          data-guide="settings-tabs"
          className="flex flex-col self-start rounded-[20px] border border-tl-line bg-tl-surface p-2.5 shadow-[0_1px_2px_rgba(15,27,46,0.04)] dark:shadow-none"
        >
          {SETTINGS_TABS.map((item, index) => {
            const on = item.key === active.key;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                id={`settings-tab-${item.key}`}
                aria-selected={on}
                aria-controls="settings-panel"
                aria-labelledby={`settings-tab-${item.key}-label`}
                aria-describedby={`settings-tab-${item.key}-desc`}
                title={item.desc}
                onClick={() => onTabChange(item.key)}
                {...tabProps(item.key, index)}
                className={`min-h-[44px] w-full rounded-[14px] px-3.5 py-3 text-left text-tl-ink transition-colors ${focusRing} ${
                  on ? "bg-tl-select" : "hover:bg-tl-bg"
                }`}
              >
                <span id={`settings-tab-${item.key}-label`} className={`block text-[15px] font-bold ${on ? "text-tl-brand" : ""}`}>
                  {item.label}
                </span>
                <span id={`settings-tab-${item.key}-desc`} className={`mt-0.5 block text-[13px] ${on ? "text-tl-link" : "text-tl-faint"}`}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>

        <section
          role="tabpanel"
          id="settings-panel"
          aria-labelledby={PANEL_TITLE_ID}
          data-guide="settings-panel"
          className="min-w-0 self-start rounded-[20px] border border-tl-line bg-tl-surface p-[clamp(18px,2.4vw,26px)] text-tl-ink shadow-[0_1px_2px_rgba(15,27,46,0.04)] dark:shadow-none"
        >
          <h2 id={PANEL_TITLE_ID} className="text-[21px] font-extrabold tracking-[-0.3px] text-tl-ink">
            {active.title}
          </h2>
          <p className="mt-[5px] text-[15px] text-tl-muted">{active.body}</p>
          {panel}
        </section>
      </div>

      <PhotoSheet {...sheetProps("photo")} />
      <PasswordSheet {...sheetProps("password")} />
      <SessionsSheet {...sheetProps("sessions")} />
      <ContactSheet {...sheetProps("contact")} />
      <LegalSheet kind="privacy" {...sheetProps("privacy")} />
      <LegalSheet kind="terms" {...sheetProps("terms")} />
      <DeleteAccountSheet {...sheetProps("delete")} />
    </div>
  );
}

/**
 * Reads the chosen tab from `?tab=` (and an open support ticket from
 * `?ticket=`, a support notification's link) and writes them back when the
 * student picks another, without adding history entries.
 *
 * @returns The view for the tab in the URL.
 */
function SettingsFromUrl() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const fromUrl = parseSettingsTab(params.get("tab"));
  const ticketFromUrl = parseTicketParam(params.get("ticket"));
  const [tab, setTab] = useState<SettingsTabKey>(fromUrl);
  const [ticketId, setTicketId] = useState<string | null>(ticketFromUrl);

  // Back/forward or a link to `?tab=…` / `?ticket=…` while the screen is open.
  useEffect(() => setTab(fromUrl), [fromUrl]);
  useEffect(() => setTicketId(ticketFromUrl), [ticketFromUrl]);

  const changeTicket = useCallback(
    (next: string | null) => {
      setTicketId(next);
      router.replace(supportHref(next), { scroll: false });
    },
    [router]
  );

  const changeTab = useCallback(
    (next: SettingsTabKey) => {
      setTab(next);
      const query = new URLSearchParams(params.toString());
      query.set("tab", next);
      query.delete("ticket");
      router.replace(`${pathname}?${query.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  return <SettingsView tab={tab} onTabChange={changeTab} ticketId={tab === "help" ? ticketId : null} onTicketChange={changeTicket} />;
}

/**
 * The Settings screen (`/settings`): profile, notifications, messaging,
 * help, security, appearance and about, with the chosen tab kept in `?tab=`.
 *
 * @returns The screen (inside the Suspense boundary `useSearchParams` needs).
 */
export default function SettingsScreen() {
  return (
    <Suspense fallback={<ScreenLoading label="Loading settings" blocks={2} />}>
      <SettingsFromUrl />
    </Suspense>
  );
}
