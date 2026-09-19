"use client";

import React from "react";
import { MESSAGE_SWITCHES } from "@/components/settings/config";
import { Card, Divider, InlineWarning, SectionHeader, ToggleRow, ToggleSkeleton } from "@/components/settings/atoms";
import { useChatPreferences } from "@/hooks/useChatPreferences";

const HEADER = <SectionHeader title="Messages" subtitle="Control your messaging privacy and behaviour." />;

/**
 * The messaging switches, saved to `PATCH /chat/preferences`.
 *
 * @returns The section element.
 */
export function MessagesSection() {
  const { preferences, isLoading, loadError, saveError, savingField, set } = useChatPreferences();

  if (isLoading) {
    return (
      <>
        {HEADER}
        <ToggleSkeleton rows={3} />
      </>
    );
  }

  return (
    <>
      {HEADER}
      <InlineWarning message={loadError ?? saveError} />
      <Card>
        {MESSAGE_SWITCHES.map((row, index) => (
          <React.Fragment key={row.field}>
            {index > 0 && <Divider />}
            <ToggleRow
              label={row.label}
              description={row.description}
              checked={Boolean(preferences[row.field])}
              onChange={(value) => set(row.field, value)}
              disabled={savingField === row.field}
            />
          </React.Fragment>
        ))}
      </Card>
    </>
  );
}
