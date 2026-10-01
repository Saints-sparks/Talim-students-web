/**
 * The Settings tabs, in the design's order, without the Learning and Downloads
 * tabs (dropped on web: the students' API has nothing behind them).
 */

/** One tab of Settings. */
export type SettingsTabKey = "account" | "notifications" | "messages" | "help" | "security" | "appearance" | "about";

/** What a tab shows in the list and at the top of its panel. */
export interface SettingsTab {
  key: SettingsTabKey;
  /** The tab's name in the list. */
  label: string;
  /** The small line under the name. */
  desc: string;
  /** The panel's heading. */
  title: string;
  /** The line under the panel's heading. */
  body: string;
}

export const SETTINGS_TABS: readonly SettingsTab[] = [
  { key: "account", label: "Account", desc: "Profile and account info", title: "Account", body: "View your personal account information." },
  {
    key: "notifications",
    label: "Notifications",
    desc: "Alerts and notification settings",
    title: "Notifications",
    body: "Choose what you want to be notified about.",
  },
  { key: "messages", label: "Messages", desc: "Messaging preferences", title: "Messages", body: "Control your messaging privacy and behaviour." },
  { key: "help", label: "Help", desc: "Support and guides", title: "Help & support", body: "Find guides and support resources." },
  { key: "security", label: "Security", desc: "Password and account security", title: "Security", body: "Manage your account security settings." },
  { key: "appearance", label: "Appearance", desc: "Theme and display preferences", title: "Appearance", body: "Choose how Talim looks for you." },
  { key: "about", label: "About", desc: "App information and legal", title: "About", body: "App information and legal." },
];

const KEYS = new Set<string>(SETTINGS_TABS.map((tab) => tab.key));

/**
 * The tab a `?tab=` value names; anything unknown (or missing) opens Account.
 *
 * @param value - The query value.
 * @returns A valid tab key.
 */
export function parseSettingsTab(value: string | null | undefined): SettingsTabKey {
  return value && KEYS.has(value) ? (value as SettingsTabKey) : "account";
}

