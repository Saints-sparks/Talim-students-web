"use client";

import React from "react";
import { PushNotificationToggle } from "@/components/notifications/PushNotificationToggle";
import { NOTIFICATION_CATEGORIES } from "@/components/settings/config";
import { Card, Divider, InlineWarning, SectionHeader, ToggleRow, ToggleSkeleton } from "@/components/settings/atoms";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

const HEADER = <SectionHeader title="Notifications" subtitle="Choose what you want to be notified about." />;

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 px-4 py-3 dark:border-[#30435F]">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{children}</p>
    </div>
  );
}

/**
 * The notification switches, saved one field at a time to
 * `PATCH /notifications/preferences`.
 *
 * @returns The section element.
 */
export function NotificationsSection() {
  const { preferences, isLoading, loadError, saveError, savingField, set } = useNotificationPreferences();

  if (isLoading) {
    return (
      <>
        {HEADER}
        <ToggleSkeleton />
      </>
    );
  }

  return (
    <>
      {HEADER}
      <InlineWarning message={loadError ?? saveError} />

      <Card>
        <CardTitle>Notification categories</CardTitle>
        {NOTIFICATION_CATEGORIES.map((item, index) => (
          <React.Fragment key={item.field}>
            {index > 0 && <Divider />}
            <ToggleRow
              label={item.label}
              description={item.description}
              checked={Boolean(preferences[item.field])}
              onChange={(value) => set(item.field, value)}
              disabled={savingField === item.field}
            />
          </React.Fragment>
        ))}
      </Card>

      <Card className="mt-4">
        <CardTitle>Delivery</CardTitle>
        <ToggleRow
          label="Mobile push notifications"
          description="Receive alerts in the Talim mobile app."
          checked={Boolean(preferences.pushEnabled)}
          onChange={(value) => set("pushEnabled", value)}
          disabled={savingField === "pushEnabled"}
        />
        <Divider />
        <ToggleRow
          label="Email notifications"
          description="Receive updates via email."
          checked={Boolean(preferences.emailEnabled)}
          onChange={(value) => set("emailEnabled", value)}
          disabled={savingField === "emailEnabled"}
        />
        <Divider />
        <div className="px-4 py-1">
          <PushNotificationToggle />
        </div>
      </Card>

      <Card className="mt-4">
        <CardTitle>Quiet hours</CardTitle>
        <ToggleRow
          label="Enable quiet hours"
          description="Suppress non-urgent notifications during set times."
          checked={Boolean(preferences.quietHoursEnabled)}
          onChange={(value) => set("quietHoursEnabled", value)}
          disabled={savingField === "quietHoursEnabled"}
        />
        {preferences.quietHoursEnabled && (
          <div className="grid grid-cols-2 gap-4 px-4 py-3">
            {(["quietHoursStart", "quietHoursEnd"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={field} className="mb-1 block text-xs text-gray-500 dark:text-slate-400">
                  {field === "quietHoursStart" ? "Start time" : "End time"}
                </label>
                <input
                  id={field}
                  type="time"
                  value={preferences[field] ?? ""}
                  onChange={(event) => set(field, event.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
