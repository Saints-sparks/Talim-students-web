"use client";

import type { ReactNode } from "react";
import AppShell from "@/components/shell/AppShell";

/**
 * Every signed-in screen of the portal shares one shell (sidebar, drawer, top
 * bar), mounted once so moving between screens keeps it in place.
 *
 * @param props - Standard children.
 * @param props.children - The screen.
 * @returns The screen inside the shell.
 */
export default function PortalLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
