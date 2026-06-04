"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTheme } from "@/providers/theme-provider";
import { authFetch } from "@/lib/authFetch";
import { API_BASE_URL } from "@/lib/constants";
import Layout from "@/components/Layout";
import {
  User,
  Bell,
  MessageSquare,
  BookOpen,
  Download,
  HelpCircle,
  Shield,
  Palette,
  Info,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  Check,
  X,
  Camera,
  KeyRound,
  UserCircle,
  AlertCircle,
} from "lucide-react";
import { PushNotificationToggle } from "@/components/notifications/PushNotificationToggle";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section =
  | "account"
  | "notifications"
  | "messages"
  | "learning"
  | "downloads"
  | "help"
  | "security"
  | "appearance"
  | "about";

interface StudentPrefs {
  notifications: {
    classReminders: boolean;
    assignmentDeadlines: boolean;
    resultUpdates: boolean;
    schoolAnnouncements: boolean;
    pushEnabled: boolean;
  };
  messages: {
    showOnlineStatus: boolean;
    readReceipts: boolean;
    messagePreview: boolean;
  };
  learning: {
    autoPlayVideos: boolean;
    showSubjectProgress: boolean;
    preferredLanguage: string;
    studyReminders: boolean;
  };
  downloads: {
    wifiOnly: boolean;
    autoDownloadResources: boolean;
  };
}

const DEFAULT_PREFS: StudentPrefs = {
  notifications: {
    classReminders: true,
    assignmentDeadlines: true,
    resultUpdates: true,
    schoolAnnouncements: true,
    pushEnabled: true,
  },
  messages: {
    showOnlineStatus: true,
    readReceipts: true,
    messagePreview: true,
  },
  learning: {
    autoPlayVideos: false,
    showSubjectProgress: true,
    preferredLanguage: "English",
    studyReminders: true,
  },
  downloads: {
    wifiOnly: true,
    autoDownloadResources: false,
  },
};

// ─── Preference Hook ──────────────────────────────────────────────────────────

function useStudentPrefs(userId: string | undefined) {
  const [prefs, setPrefs] = useState<StudentPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    if (!userId) return;
    try {
      const raw = localStorage.getItem(`student_settings_${userId}`);
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
    } catch {}
  }, [userId]);

  const update = useCallback(
    <K extends keyof StudentPrefs>(
      section: K,
      key: keyof StudentPrefs[K],
      value: boolean | string
    ) => {
      setPrefs((prev) => {
        const next = {
          ...prev,
          [section]: { ...prev[section], [key]: value },
        };
        if (userId) {
          try {
            localStorage.setItem(
              `student_settings_${userId}`,
              JSON.stringify(next)
            );
          } catch {}
        }
        return next;
      });
    },
    [userId]
  );

  return { prefs, update };
}

// ─── Shared UI Atoms ──────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-[#1B2A44] border border-gray-100 dark:border-[#30435F] rounded-xl ${className}`}
    >
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          checked
            ? "bg-[#003366] dark:bg-blue-600"
            : "bg-gray-200 dark:bg-slate-600"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-100 dark:bg-slate-700 mx-4" />;
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPwd !== confirmPwd) {
      setError("New passwords do not match.");
      return;
    }
    if (newPwd.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch(
        `${API_BASE_URL}/settings/security/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Failed to change password.");
        return;
      }
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">
            Change Password
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {success ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
              Password changed successfully
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  className={inputCls}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  className={inputCls}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={inputCls}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-200 dark:border-slate-600 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-[#003366] dark:bg-blue-700 py-2 text-sm font-semibold text-white hover:bg-[#002244] dark:hover:bg-blue-800 disabled:opacity-60"
              >
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Section Content Components ───────────────────────────────────────────────

function AccountSection({
  user,
  onChangePassword,
}: {
  user: ReturnType<typeof useAuthContext>["user"];
  onChangePassword: () => void;
}) {
  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() ||
    "ST";
  const profileRows = [
    { label: "Full Name", value: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "-" },
    { label: "Role", value: "Student" },
    { label: "Email Address", value: user?.email || "-" },
    { label: "School", value: user?.schoolName || "-" },
    { label: "Phone Number", value: user?.phoneNumber || "-" },
    { label: "Joined", value: "-" },
  ];

  return (
    <>
      <SectionHeader
        title="Account"
        subtitle="View and manage your personal account information."
      />
      <Card>
        <div className="border-b border-gray-100 px-5 py-4 dark:border-[#30435F]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Profile</h3>
        </div>
        <div className="grid gap-6 p-5 lg:grid-cols-[96px_minmax(0,1fr)]">
          <div className="flex justify-center lg:justify-start">
            {user?.userAvatar ? (
              <img
                src={user.userAvatar}
                alt="Profile avatar"
                className="h-20 w-20 rounded-full object-cover ring-4 ring-[#D7E1ED] dark:ring-[#30435F]"
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
                <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                  {row.label}
                </p>
                <p className="mt-1 break-words text-sm font-semibold text-gray-900 dark:text-white">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-[#B9D7FF] bg-[#EEF6FF] px-4 py-3 text-sm text-[#003366] dark:border-[#315D93] dark:bg-[#1B3558] dark:text-blue-100 lg:col-span-2">
            <span className="inline-flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Academic, class assignments, and guardian information are managed by your school administrator.
            </span>
          </div>
        </div>
      </Card>
      <Card className="mt-5">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-[#30435F]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Account Actions</h3>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-3">
          {[
            { label: "View Profile", desc: "Open your full student profile", icon: UserCircle, tone: "blue", onClick: undefined },
            { label: "Change Photo", desc: "Update the photo shown across Talim", icon: Camera, tone: "green", onClick: undefined },
            { label: "Change Password", desc: "Keep your account secure", icon: KeyRound, tone: "purple", onClick: onChangePassword },
          ].map(({ label, desc, icon: Icon, tone, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="rounded-xl border border-gray-100 bg-white p-4 text-left transition-colors hover:border-[#8BB8EA] hover:bg-[#F5F9FF] dark:border-[#30435F] dark:bg-[#111C31] dark:hover:border-blue-400 dark:hover:bg-[#172944]"
            >
              <span
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ${
                  tone === "green"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : tone === "purple"
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

function NotificationsSection({
  prefs,
  update,
}: {
  prefs: StudentPrefs;
  update: ReturnType<typeof useStudentPrefs>["update"];
}) {
  return (
    <>
      <SectionHeader
        title="Notifications"
        subtitle="Choose what you want to be notified about."
      />
      <Card>
        <ToggleRow
          label="Class reminders"
          description="Get reminders before your classes start."
          checked={prefs.notifications.classReminders}
          onChange={(v) => update("notifications", "classReminders", v)}
        />
        <Divider />
        <ToggleRow
          label="Assignment deadlines"
          description="Alerts when assignments are due soon."
          checked={prefs.notifications.assignmentDeadlines}
          onChange={(v) => update("notifications", "assignmentDeadlines", v)}
        />
        <Divider />
        <ToggleRow
          label="Result updates"
          description="Notify when new results are published."
          checked={prefs.notifications.resultUpdates}
          onChange={(v) => update("notifications", "resultUpdates", v)}
        />
        <Divider />
        <ToggleRow
          label="School announcements"
          description="Important messages from your school."
          checked={prefs.notifications.schoolAnnouncements}
          onChange={(v) => update("notifications", "schoolAnnouncements", v)}
        />
        <Divider />
        <div className="px-4">
          <PushNotificationToggle />
        </div>
      </Card>
    </>
  );
}

function MessagesSection({
  prefs,
  update,
}: {
  prefs: StudentPrefs;
  update: ReturnType<typeof useStudentPrefs>["update"];
}) {
  return (
    <>
      <SectionHeader title="Messages" subtitle="Control your messaging privacy and behaviour." />
      <Card>
        <ToggleRow
          label="Show online status"
          description="Let others see when you're active."
          checked={prefs.messages.showOnlineStatus}
          onChange={(v) => update("messages", "showOnlineStatus", v)}
        />
        <Divider />
        <ToggleRow
          label="Read receipts"
          description="Send read receipts when you view messages."
          checked={prefs.messages.readReceipts}
          onChange={(v) => update("messages", "readReceipts", v)}
        />
        <Divider />
        <ToggleRow
          label="Message preview"
          description="Show message preview in notifications."
          checked={prefs.messages.messagePreview}
          onChange={(v) => update("messages", "messagePreview", v)}
        />
      </Card>
    </>
  );
}

function LearningSection({
  prefs,
  update,
}: {
  prefs: StudentPrefs;
  update: ReturnType<typeof useStudentPrefs>["update"];
}) {
  return (
    <>
      <SectionHeader
        title="Learning Preferences"
        subtitle="Customise how you experience learning content."
      />
      <Card>
        <ToggleRow
          label="Auto-play videos"
          description="Automatically play video lessons."
          checked={prefs.learning.autoPlayVideos}
          onChange={(v) => update("learning", "autoPlayVideos", v)}
        />
        <Divider />
        <ToggleRow
          label="Show subject progress"
          description="Display completion progress on subjects."
          checked={prefs.learning.showSubjectProgress}
          onChange={(v) => update("learning", "showSubjectProgress", v)}
        />
        <Divider />
        <ToggleRow
          label="Study reminders"
          description="Daily reminders to keep your study streak."
          checked={prefs.learning.studyReminders}
          onChange={(v) => update("learning", "studyReminders", v)}
        />
      </Card>
      <Card className="mt-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
              Preferred language
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Language for learning content display.
            </p>
          </div>
          <select
            value={prefs.learning.preferredLanguage}
            onChange={(e) => update("learning", "preferredLanguage", e.target.value)}
            className="text-sm rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#003366] dark:focus:ring-blue-500"
          >
            <option>English</option>
            <option>French</option>
            <option>Hausa</option>
            <option>Yoruba</option>
            <option>Igbo</option>
          </select>
        </div>
      </Card>
    </>
  );
}

function DownloadsSection({
  prefs,
  update,
}: {
  prefs: StudentPrefs;
  update: ReturnType<typeof useStudentPrefs>["update"];
}) {
  return (
    <>
      <SectionHeader title="Downloads" subtitle="Manage how resources are downloaded." />
      <Card>
        <ToggleRow
          label="Wi-Fi only downloads"
          description="Only download resources when on Wi-Fi."
          checked={prefs.downloads.wifiOnly}
          onChange={(v) => update("downloads", "wifiOnly", v)}
        />
        <Divider />
        <ToggleRow
          label="Auto-download resources"
          description="Automatically download new resources."
          checked={prefs.downloads.autoDownloadResources}
          onChange={(v) => update("downloads", "autoDownloadResources", v)}
        />
      </Card>
      <Card className="mt-4">
        <button className="w-full flex items-center justify-between px-4 py-3 text-left">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
              Clear cached downloads
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Remove locally stored files to free up space.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-slate-500 shrink-0" />
        </button>
      </Card>
    </>
  );
}

function HelpSection() {
  const items = [
    {
      label: "Getting started guide",
      subtitle: "Learn how to navigate Talim",
    },
    { label: "Help centre", subtitle: "Browse FAQs and support articles" },
    { label: "Contact support", subtitle: "Reach out to the Talim team" },
    { label: "Report a problem", subtitle: "Let us know if something isn't working" },
  ];
  return (
    <>
      <SectionHeader title="Onboarding & Help" subtitle="Find guides and support resources." />
      <Card>
        {items.map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && <Divider />}
            <button className="w-full flex items-center justify-between px-4 py-3 text-left">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-slate-500 shrink-0" />
            </button>
          </React.Fragment>
        ))}
      </Card>
    </>
  );
}

function SecuritySection({ onChangePassword }: { onChangePassword: () => void }) {
  return (
    <>
      <SectionHeader title="Security" subtitle="Manage your account security settings." />
      <Card>
        <button
          onClick={onChangePassword}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
              Change password
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Update your account password.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-slate-500 shrink-0" />
        </button>
      </Card>
      <Card className="mt-4">
        <div className="px-4 py-3">
          <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
            Active sessions
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            You are currently signed in on this device.
          </p>
        </div>
      </Card>
    </>
  );
}

type ThemeOption = { value: "light" | "dark" | "system"; label: string; icon: React.ElementType; desc: string };

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun, desc: "Always use light mode" },
  { value: "dark", label: "Dark", icon: Moon, desc: "Always use dark mode" },
  { value: "system", label: "System", icon: Monitor, desc: "Follow device setting" },
];

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <SectionHeader title="Appearance" subtitle="Choose how Talim looks for you." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {THEME_OPTIONS.map(({ value, label, icon: Icon, desc }) => {
          const active = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                active
                  ? "border-[#003366] dark:border-blue-500 bg-[#EEF3F9] dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
            >
              <div
                className={`rounded-full p-2.5 ${
                  active
                    ? "bg-[#003366] dark:bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"
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
              <span className="text-xs text-gray-500 dark:text-slate-400 text-center">
                {desc}
              </span>
              {active && (
                <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#003366] dark:bg-blue-600">
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

function AboutSection() {
  return (
    <>
      <SectionHeader title="About" subtitle="App information and legal." />
      <Card>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {[
            { label: "App version", value: "1.0.0" },
            { label: "Platform", value: "Talim Students Web" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-gray-500 dark:text-slate-400">
                {row.label}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-4">
        {["Privacy Policy", "Terms of Service"].map((item, i) => (
          <React.Fragment key={item}>
            {i > 0 && <Divider />}
            <button className="w-full flex items-center justify-between px-4 py-3 text-left">
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                {item}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-slate-500 shrink-0" />
            </button>
          </React.Fragment>
        ))}
      </Card>
    </>
  );
}

// ─── Nav Config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: {
  id: Section;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  { id: "account", label: "Account", icon: User, description: "Profile and account info" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts and notification settings" },
  { id: "messages", label: "Messages", icon: MessageSquare, description: "Messaging preferences" },
  { id: "learning", label: "Learning", icon: BookOpen, description: "Study and display options" },
  { id: "downloads", label: "Downloads", icon: Download, description: "Offline resource settings" },
  { id: "help", label: "Help", icon: HelpCircle, description: "Support and guides" },
  { id: "security", label: "Security", icon: Shield, description: "Password and account security" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme and display preferences" },
  { id: "about", label: "About", icon: Info, description: "App information and support" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user } = useAuthContext();
  const { prefs, update } = useStudentPrefs(user?.userId);
  const [activeSection, setActiveSection] = useState<Section>("account");
  const [showPwdModal, setShowPwdModal] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSection user={user} onChangePassword={() => setShowPwdModal(true)} />;
      case "notifications":
        return <NotificationsSection prefs={prefs} update={update} />;
      case "messages":
        return <MessagesSection prefs={prefs} update={update} />;
      case "learning":
        return <LearningSection prefs={prefs} update={update} />;
      case "downloads":
        return <DownloadsSection prefs={prefs} update={update} />;
      case "help":
        return <HelpSection />;
      case "security":
        return (
          <SecuritySection onChangePassword={() => setShowPwdModal(true)} />
        );
      case "appearance":
        return <AppearanceSection />;
      case "about":
        return <AboutSection />;
    }
  };

  return (
    <Layout>
      <div className="min-h-full bg-gray-50 px-3 py-5 dark:bg-[#0B1224] sm:px-5 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
            Manage your profile, notifications, learning preferences, and account security.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar Nav — desktop */}
          <aside className="hidden lg:block">
            <nav className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44]">
              {NAV_ITEMS.map(({ id, label, icon: Icon, description }) => {
                const active = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-start gap-3 px-4 py-4 text-left text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#EEF3F9] dark:bg-[#25477A] text-[#003366] dark:text-white border-r-2 border-[#003366] dark:border-blue-300"
                        : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-[#243853]"
                    }`}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="block">{label}</span>
                      <span className={`mt-1 block text-xs font-normal ${active ? "text-blue-700 dark:text-blue-100" : "text-gray-500 dark:text-slate-400"}`}>
                        {description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Tab Bar */}
          <div className="lg:hidden w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-1">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const active = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 min-h-[44px] text-xs font-medium transition-colors shrink-0 ${
                      active
                        ? "bg-[#003366] dark:bg-blue-700 text-white"
                        : "bg-white dark:bg-[#1B2A44] border border-gray-200 dark:border-[#30435F] text-gray-600 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <main className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-[#30435F] dark:bg-[#111C31] sm:p-6">{renderSection()}</main>
        </div>
      </div>
      </div>

      {showPwdModal && (
        <ChangePasswordModal onClose={() => setShowPwdModal(false)} />
      )}
    </Layout>
  );
}
