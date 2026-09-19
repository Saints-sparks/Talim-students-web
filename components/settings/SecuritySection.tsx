import { ChevronRight } from "lucide-react";
import { Card, SectionHeader } from "@/components/settings/atoms";

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
