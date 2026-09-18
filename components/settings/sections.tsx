"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, ChevronRight, KeyRound, Monitor, Moon, Sun, UserCircle } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTheme } from "@/providers/theme-provider";
import { useChatPreferences } from "@/hooks/useChatPreferences";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { PushNotificationToggle } from "@/components/notifications/PushNotificationToggle";
import { Card, Divider, InlineWarning, SectionHeader, ToggleRow, ToggleSkeleton } from "@/components/settings/atoms";

/**
 * The student's own account details, which only their school can change.
 *
 * @param props - Component props.
 * @param props.onChangePassword - Opens the change-password dialog.
 * @returns The section element.
 */
export function AccountSection({ onChangePassword }: { onChangePassword: () => void }) {
  const { user } = useAuthContext();
  const router = useRouter();

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "ST";
  const profileRows = [
    { label: "Full Name", value: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "—" },
    { label: "Role", value: "Student" },
    { label: "Email Address", value: user?.email || "—" },
    { label: "School", value: user?.schoolName || "—" },
    { label: "Phone Number", value: (user?.phoneNumber as string) || "—" },
    { label: "Admission Number", value: (user?.admissionNumber as string) || "—" },
  ];

  return (
    <>
      <SectionHeader title="Account" subtitle="View and manage your personal account information." />
      <Card>
        <div className="border-b border-gray-100 px-5 py-4 dark:border-[#30435F]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Profile</h3>
        </div>
        <div className="grid gap-6 p-5 lg:grid-cols-[96px_minmax(0,1fr)]">
          <div className="flex justify-center lg:justify-start">
            {user?.userAvatar ? (
              <Image
                src={user.userAvatar}
                alt="Profile avatar"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-[#D7E1ED] dark:ring-[#30435F]"
                unoptimized
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#003366] text-xl font-bold text-white ring-4 ring-[#D7E1ED] dark:ring-[#30435F]">
                {initials}
              </div>
            )}
          </div>
          <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {profileRows.map((row) => (
              <div key={row.label}>
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400">{row.label}</p>
                <p className="mt-1 break-words text-sm font-semibold text-gray-900 dark:text-white">{row.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-[#B9D7FF] bg-[#EEF6FF] px-4 py-3 text-sm text-[#003366] dark:border-[#315D93] dark:bg-[#1B3558] dark:text-blue-100 lg:col-span-2">
            <span className="inline-flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Academic, class and guardian information are managed by your school administrator.
            </span>
          </div>
        </div>
      </Card>

      <Card className="mt-5">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-[#30435F]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Account Actions</h3>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {[
            {
              label: "View Profile",
              desc: "Open your full student profile and photo",
              icon: UserCircle,
              tone: "blue",
              onClick: () => router.push("/profile"),
            },
            {
              label: "Change Password",
              desc: "Keep your account secure",
              icon: KeyRound,
              tone: "purple",
              onClick: onChangePassword,
            },
          ].map(({ label, desc, icon: Icon, tone, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="rounded-xl border border-gray-100 bg-white p-4 text-left transition-colors hover:border-[#8BB8EA] hover:bg-[#F5F9FF] dark:border-[#30435F] dark:bg-[#111C31] dark:hover:border-blue-400 dark:hover:bg-[#172944]"
            >
              <span
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ${
                  tone === "purple"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-slate-400">{desc}</p>
            </button>
          ))}
        </div>
      </Card>
    </>
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
        <SectionHeader title="Notifications" subtitle="Choose what you want to be notified about." />
        <ToggleSkeleton />
      </>
    );
  }

  const categories = [
    {
      field: "announcementsEnabled",
      label: "School announcements",
      description: "Important messages from your school.",
    },
    { field: "attendanceEnabled", label: "Attendance alerts", description: "Reminders and attendance updates." },
    { field: "resultsEnabled", label: "Result updates", description: "Notify when new results are published." },
    { field: "timetableEnabled", label: "Class & timetable", description: "Class schedule changes and reminders." },
    { field: "resourcesEnabled", label: "Resources", description: "New learning materials shared with your class." },
    { field: "messagesEnabled", label: "Messages", description: "Alerts for new chat messages." },
  ] as const;

  return (
    <>
      <SectionHeader title="Notifications" subtitle="Choose what you want to be notified about." />
      <InlineWarning message={loadError ?? saveError} />

      <Card>
        <div className="border-b border-gray-100 px-4 py-3 dark:border-[#30435F]">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Notification categories</p>
        </div>
        {categories.map((item, index) => (
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
        <div className="border-b border-gray-100 px-4 py-3 dark:border-[#30435F]">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Delivery</p>
        </div>
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
        <div className="border-b border-gray-100 px-4 py-3 dark:border-[#30435F]">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Quiet hours</p>
        </div>
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
                <label
                  htmlFor={field}
                  className="mb-1 block text-xs text-gray-500 dark:text-slate-400"
                >
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
        <SectionHeader title="Messages" subtitle="Control your messaging privacy and behaviour." />
        <ToggleSkeleton rows={3} />
      </>
    );
  }

  const rows = [
    {
      field: "messageNotifications",
      label: "Message notifications",
      description: "Get alerted when someone messages you.",
    },
    {
      field: "allowTeacherMessages",
      label: "Allow teacher messages",
      description: "Let your teachers start a direct chat with you.",
    },
    { field: "readReceipts", label: "Read receipts", description: "Send read receipts when you view messages." },
  ] as const;

  return (
    <>
      <SectionHeader title="Messages" subtitle="Control your messaging privacy and behaviour." />
      <InlineWarning message={loadError ?? saveError} />
      <Card>
        {rows.map((row, index) => (
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

/**
 * Password management.
 *
 * @param props - Component props.
 * @param props.onChangePassword - Opens the change-password dialog.
 * @returns The section element.
 */
export function SecuritySection({ onChangePassword }: { onChangePassword: () => void }) {
  return (
    <>
      <SectionHeader title="Security" subtitle="Manage your account security settings." />
      <Card>
        <button
          type="button"
          onClick={onChangePassword}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">Change password</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
              Updating your password signs you out on every other device.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 dark:text-slate-500" />
        </button>
      </Card>
    </>
  );
}

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: React.ElementType;
  desc: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun, desc: "Always use light mode" },
  { value: "dark", label: "Dark", icon: Moon, desc: "Always use dark mode" },
  { value: "system", label: "System", icon: Monitor, desc: "Follow device setting" },
];

/**
 * The light / dark / system picker.
 *
 * @returns The section element.
 */
export function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <SectionHeader title="Appearance" subtitle="Choose how Talim looks for you." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {THEME_OPTIONS.map(({ value, label, icon: Icon, desc }) => {
          const active = theme === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => setTheme(value)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                active
                  ? "border-[#003366] bg-[#EEF3F9] dark:border-blue-500 dark:bg-blue-900/20"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
              }`}
            >
              <div
                className={`rounded-full p-2.5 ${
                  active
                    ? "bg-[#003366] text-white dark:bg-blue-600"
                    : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-sm font-semibold ${
                  active ? "text-[#003366] dark:text-blue-400" : "text-gray-700 dark:text-slate-300"
                }`}
              >
                {label}
              </span>
              <span className="text-center text-xs text-gray-500 dark:text-slate-400">{desc}</span>
              {active && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#003366] dark:bg-blue-600">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

/**
 * Build information.
 *
 * @returns The section element.
 */
export function AboutSection() {
  return (
    <>
      <SectionHeader title="About" subtitle="App information." />
      <Card>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {[
            { label: "App version", value: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0" },
            { label: "Platform", value: "Talim Students Web" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-500 dark:text-slate-400">{row.label}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{row.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
