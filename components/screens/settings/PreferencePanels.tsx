"use client";

import React from "react";
import { Toggle } from "@/components/tl/bits";
import { pill, pillTone } from "@/components/tl/styles";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useChatPreferences } from "@/hooks/useChatPreferences";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import type { NotificationPreferences } from "@/services/notification.service";
import type { ChatPreferences } from "@/services/settings.service";
import { PanelMessage, RowList, ToggleRow } from "./SettingRows";

/** A switch on Settings → Notifications and the preference field it saves. */
export interface NotificationRow {
  field: keyof NotificationPreferences;
  label: string;
  description: string;
}

/** The design's notification switches, each saved as its own preference field. */
export const NOTIFICATION_ROWS: readonly NotificationRow[] = [
  { field: "announcementsEnabled", label: "School announcements", description: "Important messages from your school." },
  { field: "attendanceEnabled", label: "Attendance alerts", description: "Reminders and attendance updates." },
  { field: "resultsEnabled", label: "Result updates", description: "When a new score is published." },
  { field: "timetableEnabled", label: "Class & timetable", description: "Schedule changes and reminders." },
  { field: "resourcesEnabled", label: "Files & assignments", description: "New materials and assignment deadlines." },
  { field: "messagesEnabled", label: "Messages", description: "Alerts for new chat messages." },
];

/** A switch on Settings → Messages and the chat preference it saves. */
export interface MessageRow {
  field: keyof ChatPreferences;
  label: string;
  description: string;
}

/** The design's messaging switches (B10 `ChatPreference`). */
export const MESSAGE_ROWS: readonly MessageRow[] = [
  { field: "showOnlineStatus", label: "Show online status", description: "Let others see when you're active." },
  { field: "readReceipts", label: "Read receipts", description: "Send read receipts when you view messages." },
  { field: "messagePreview", label: "Message preview", description: "Show the message text in notifications." },
];

/**
 * Pop-up notifications in this browser (web push): a switch when the browser
 * supports them, otherwise a short explanation of why they are off. The
 * permission prompt only ever comes from the switch's click.
 *
 * @returns The list item.
 */
function BrowserPushRow() {
  const { isSupported, permission, isSubscribed, isLoading, error, subscribe, unsubscribe } = usePushNotifications();
  const label = "Browser notifications";

  let description: string;
  let control: React.ReactNode;
  if (!isSupported) {
    description = "This browser can't show Talim notifications. Updates inside Talim keep working as usual.";
    control = <span className={`${pill} ${pillTone.muted}`}>Unavailable</span>;
  } else if (permission === "denied") {
    description =
      "Your browser is set not to show Talim alerts. To turn them back on, open this site's settings from the address bar, set Notifications to Allow, and reload the page.";
    control = <span className={`${pill} ${pillTone.muted}`}>Off in this browser</span>;
  } else {
    description = isSubscribed
      ? "Results, reminders and school announcements pop up in this browser, even when Talim is in the background."
      : "Get results, reminders and school announcements in this browser, even when the tab is closed.";
    control = (
      <Toggle
        checked={isSubscribed}
        label={label}
        describedBy="push-row-desc"
        disabled={isLoading}
        onChange={(next) => {
          // The hook keeps the error to show; nothing else to do with it here.
          void (next ? subscribe() : unsubscribe()).catch(() => undefined);
        }}
      />
    );
  }

  return (
    <li className="flex items-center gap-4 border-t border-tl-line-soft py-4">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold text-tl-ink">{label}</div>
        <div id="push-row-desc" className="mt-[3px] text-sm text-tl-muted">
          {description}
        </div>
        {error ? (
          <p role="alert" className="mt-1.5 text-sm font-semibold text-tl-danger">
            {error}
          </p>
        ) : null}
      </div>
      {control}
    </li>
  );
}

/**
 * Settings → Notifications: the six categories (saved one field at a time to
 * `PATCH /notifications/preferences`) and this browser's pop-up switch.
 *
 * @returns The panel body.
 */
export function NotificationsPanel() {
  const { preferences, isLoading, loadError, saveError, savingField, set } = useNotificationPreferences();
  return (
    <>
      <PanelMessage message={saveError} tone="alert" />
      <PanelMessage message={loadError} tone="note" />
      <div aria-busy={isLoading || undefined}>
        <RowList label="What to notify you about">
          {NOTIFICATION_ROWS.map((row) => (
            <ToggleRow
              key={row.field}
              id={`notify-${row.field}`}
              label={row.label}
              description={row.description}
              checked={Boolean(preferences[row.field])}
              onChange={(next) => set(row.field, next)}
              disabled={isLoading || savingField === row.field}
            />
          ))}
        </RowList>
      </div>
      <h3 className="mt-6 text-base font-extrabold tracking-[-0.2px] text-tl-ink">This browser</h3>
      <ul className="mt-2 flex flex-col">
        <BrowserPushRow />
      </ul>
    </>
  );
}

/**
 * Settings → Messages: online status, read receipts and message previews,
 * saved one field at a time to `PATCH /chat/preferences`.
 *
 * @returns The panel body.
 */
export function MessagesPanel() {
  const { preferences, isLoading, loadError, saveError, savingField, set } = useChatPreferences();
  return (
    <>
      <PanelMessage message={saveError} tone="alert" />
      <PanelMessage message={loadError} tone="note" />
      <div aria-busy={isLoading || undefined}>
        <RowList label="Messaging privacy">
          {MESSAGE_ROWS.map((row) => (
            <ToggleRow
              key={row.field}
              id={`chat-${row.field}`}
              label={row.label}
              description={row.description}
              checked={Boolean(preferences[row.field])}
              onChange={(next) => set(row.field, next)}
              disabled={isLoading || savingField === row.field}
            />
          ))}
        </RowList>
      </div>
    </>
  );
}
