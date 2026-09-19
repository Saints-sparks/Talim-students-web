"use client";

import React, { useState } from "react";
import { Bell, Info, MessageSquare, Palette, Shield, User } from "lucide-react";
import Layout from "@/components/Layout";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import { AboutSection } from "@/components/settings/AboutSection";
import { AccountSection } from "@/components/settings/AccountSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { MessagesSection } from "@/components/settings/MessagesSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { SecuritySection } from "@/components/settings/SecuritySection";

type Section = "account" | "notifications" | "messages" | "security" | "appearance" | "about";

const NAV_ITEMS: Array<{ id: Section; label: string; icon: React.ElementType; description: string }> = [
  { id: "account", label: "Account", icon: User, description: "Profile and account info" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts and notification settings" },
  { id: "messages", label: "Messages", icon: MessageSquare, description: "Messaging preferences" },
  { id: "security", label: "Security", icon: Shield, description: "Password and account security" },
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme and display preferences" },
  { id: "about", label: "About", icon: Info, description: "App information" },
];

/**
 * The student's settings screen.
 *
 * Every switch shown here is backed by a real endpoint: notification
 * categories and delivery go to `/notifications/preferences`, messaging goes
 * to `/chat/preferences`, and the theme is stored per browser. Sections that
 * only wrote to `localStorage` and were never read again — Learning,
 * Downloads and Help — were removed rather than left looking functional.
 *
 * @returns The settings page.
 */
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("account");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const openPasswordModal = () => setShowPasswordModal(true);

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <AccountSection onChangePassword={openPasswordModal} />;
      case "notifications":
        return <NotificationsSection />;
      case "messages":
        return <MessagesSection />;
      case "security":
        return <SecuritySection onChangePassword={openPasswordModal} />;
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
              Manage your profile, notifications, messaging and account security.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <nav className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-[#30435F] dark:bg-[#1B2A44]">
                {NAV_ITEMS.map(({ id, label, icon: Icon, description }) => {
                  const active = activeSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => setActiveSection(id)}
                      className={`flex w-full items-start gap-3 px-4 py-4 text-left text-sm font-medium transition-colors ${
                        active
                          ? "border-r-2 border-[#003366] bg-[#EEF3F9] text-[#003366] dark:border-blue-300 dark:bg-[#25477A] dark:text-white"
                          : "text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-[#243853]"
                      }`}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        <span className="block">{label}</span>
                        <span
                          className={`mt-1 block text-xs font-normal ${
                            active ? "text-blue-700 dark:text-blue-100" : "text-gray-500 dark:text-slate-400"
                          }`}
                        >
                          {description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="w-full overflow-x-auto scrollbar-hide lg:hidden">
              <div className="flex gap-2 pb-1">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                  const active = activeSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-current={active ? "page" : undefined}
                      onClick={() => setActiveSection(id)}
                      className={`flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
                        active
                          ? "bg-[#003366] text-white dark:bg-blue-700"
                          : "border border-gray-200 bg-white text-gray-600 dark:border-[#30435F] dark:bg-[#1B2A44] dark:text-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <main className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-[#30435F] dark:bg-[#111C31] sm:p-6">
              {renderSection()}
            </main>
          </div>
        </div>
      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </Layout>
  );
}
