"use client";

import Image from "next/image";
import { AlertCircle, KeyRound, UserCircle } from "lucide-react";
import { Card, SectionHeader } from "@/components/settings/atoms";
import { useAccountProfile } from "@/hooks/useAccountProfile";

/**
 * The student's own account details, which only their school can change.
 *
 * @param props - Component props.
 * @param props.onChangePassword - Opens the change-password dialog.
 * @returns The section element.
 */
export function AccountSection({ onChangePassword }: { onChangePassword: () => void }) {
  const { user, rows, initials, openProfile } = useAccountProfile();

  const actions = [
    {
      label: "View Profile",
      desc: "Open your full student profile and photo",
      icon: UserCircle,
      tone: "blue",
      onClick: openProfile,
    },
    {
      label: "Change Password",
      desc: "Keep your account secure",
      icon: KeyRound,
      tone: "purple",
      onClick: onChangePassword,
    },
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
            {rows.map((row) => (
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
          {actions.map(({ label, desc, icon: Icon, tone, onClick }) => (
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
