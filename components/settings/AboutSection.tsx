import { Card, SectionHeader } from "@/components/settings/atoms";

/**
 * Build information.
 *
 * @returns The section element.
 */
export function AboutSection() {
  const rows = [
    { label: "App version", value: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0" },
    { label: "Platform", value: "Talim Students Web" },
  ];

  return (
    <>
      <SectionHeader title="About" subtitle="App information." />
      <Card>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {rows.map((row) => (
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
