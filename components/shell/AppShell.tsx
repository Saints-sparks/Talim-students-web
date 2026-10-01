"use client";

import React, { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Bell, LogOut, Menu, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import { useChatContext } from "@/contexts/ChatContext";
import { useNotificationCounts } from "@/hooks/useNotificationCounts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { queryKeys } from "@/lib/queryKeys";
import { formatShortDate, initialsOf } from "@/lib/learner/format";
import { CountBadge } from "@/components/tl/bits";
import { focusRing, navItem, pagePad } from "@/components/tl/styles";
import AppGuide from "@/components/onboarding/AppGuide";
import type { StudentToday } from "@/types/learner";
import { NAV_GROUPS, isActiveItem, type NavBadge } from "./nav";

/** Below this width the sidebar becomes a drawer (the design's 980px). */
const DRAWER_QUERY = "(max-width: 979px)";

/**
 * Today's date for the top bar: the school's, from the Today screen's cached
 * answer when there is one (no request of its own), else this device's.
 *
 * @returns "Mon, 14 Sep 2026".
 */
function useTopBarDate(): string {
  const { user } = useAuthContext();
  const scope = String(user?.userId || user?.id || "anonymous");
  const { data } = useQuery<StudentToday>({ queryKey: queryKeys.learner.today(scope), enabled: false });
  const [local, setLocal] = useState("");
  useEffect(() => {
    const now = new Date();
    setLocal(formatShortDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`));
  }, []);
  return data?.date ? formatShortDate(data.date) : local;
}

/** Props for {@link SidebarNav}. */
interface SidebarNavProps {
  pathname: string;
  badges: Record<NavBadge, number>;
  onNavigate?: () => void;
  onSignOut: () => void;
  signingOut: boolean;
}

/**
 * The sidebar's contents: the brand, the four groups, and "Account &
 * settings" and "Log out" pinned at the bottom. Shared by the fixed sidebar
 * and the drawer.
 *
 * @param props - See {@link SidebarNavProps}.
 * @param props.pathname - The current path, for the active item.
 * @param props.badges - Unread counts per badge.
 * @param props.onNavigate - Called after a link is followed (closes the drawer).
 * @param props.onSignOut - Signs out.
 * @param props.signingOut - True while signing out.
 * @returns The navigation.
 */
function SidebarNav({ pathname, badges, onNavigate, onSignOut, signingOut }: SidebarNavProps) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center gap-2.5 px-3 pb-2 pt-1">
        <span aria-hidden className="h-8 w-8 rounded-[10px] bg-tl-brand-fill" />
        <span className="text-[19px] font-extrabold tracking-[-0.2px] text-tl-ink">Talim</span>
      </div>

      <nav aria-label="Main" className="mt-[22px] flex flex-col gap-5">
        {NAV_GROUPS.map((group, index) => (
          <div key={group.title ?? `group-${index}`}>
            {group.title ? (
              <h2 className="px-3 pb-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-tl-faint">{group.title}</h2>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActiveItem(item, pathname);
                const count = item.badge ? badges[item.badge] : 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={item.tip}
                      aria-current={active ? "page" : undefined}
                      data-guide={`nav-${item.id}`}
                      onClick={onNavigate}
                      className={navItem(active)}
                    >
                      <span aria-hidden className={`h-[7px] w-[7px] shrink-0 rounded-full ${active ? "bg-tl-link" : "bg-tl-control"}`} />
                      <span className="flex-1">{item.label}</span>
                      {count > 0 ? (
                        <>
                          <CountBadge count={count} />
                          <span className="sr-only">, {count} unread</span>
                        </>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-0.5 border-t border-tl-line-soft bg-tl-surface pb-0.5 pt-3.5">
        <Link
          href="/settings"
          title="Your profile, alerts and security"
          aria-current={pathname === "/settings" ? "page" : undefined}
          onClick={onNavigate}
          className={navItem(pathname === "/settings")}
        >
          <Settings aria-hidden className="h-4 w-4 shrink-0" />
          <span>Account &amp; settings</span>
        </Link>
        <button
          type="button"
          title="Sign out of Talim"
          onClick={onSignOut}
          disabled={signingOut}
          className={`flex min-h-[44px] w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-left text-[15px] font-semibold text-tl-muted transition-colors hover:bg-tl-bg hover:text-tl-danger disabled:opacity-60 ${focusRing}`}
        >
          <LogOut aria-hidden className="h-4 w-4 shrink-0" />
          <span>{signingOut ? "Signing out…" : "Log out"}</span>
        </button>
      </div>
    </div>
  );
}

/**
 * The signed-in layout of the students portal (the design's shell): a
 * sidebar from 980px up and a drawer below it, a top bar with the school's
 * name, today's date, the Updates bell and the avatar, and the page. The
 * sidebar and top bar are hidden when printing. The drawer is a modal dialog:
 * focus moves into it, Escape closes it, and focus returns to the menu button.
 *
 * @param props - Standard children.
 * @param props.children - The page.
 * @returns The shell.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const { user, logout } = useAuthContext();
  const { totalUnread } = useChatContext();
  const { unread: unreadUpdates } = useNotificationCounts();
  const narrow = useMediaQuery(DRAWER_QUERY);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const date = useTopBarDate();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Growing past the breakpoint closes the drawer, as in the design.
  useEffect(() => {
    if (!narrow) setDrawerOpen(false);
  }, [narrow]);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    setDrawerOpen(false);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
  }, [logout]);

  const badges: Record<NavBadge, number> = { messages: totalUnread || 0, updates: unreadUpdates };
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const avatar = typeof user?.userAvatar === "string" && user.userAvatar ? user.userAvatar : null;
  const schoolName = (user?.schoolName as string | undefined) || "Your school";
  const schoolLogo = typeof user?.schoolLogo === "string" && user.schoolLogo ? user.schoolLogo : null;

  const nav = (
    <SidebarNav pathname={pathname} badges={badges} onSignOut={signOut} signingOut={signingOut} onNavigate={() => setDrawerOpen(false)} />
  );

  return (
    <div className="flex min-h-[100dvh] bg-tl-bg font-manrope text-tl-ink">
      <a
        href="#main"
        className={`sr-only z-[90] rounded-xl bg-tl-surface px-4 py-3 font-bold text-tl-brand focus:not-sr-only focus:fixed focus:left-3 focus:top-3 ${focusRing}`}
      >
        Skip to content
      </a>

      <aside
        data-print-hide="1"
        className="sticky top-0 hidden h-[100dvh] w-[244px] shrink-0 flex-col overflow-y-auto border-r border-tl-line bg-tl-surface px-3.5 py-5 min-[980px]:flex"
      >
        {nav}
      </aside>

      <Dialog.Root open={narrow && drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgba(15,27,46,0.42)] print:hidden" />
          <Dialog.Content
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              // Back to the menu button (it is not a Radix trigger).
              event.preventDefault();
              menuButtonRef.current?.focus();
            }}
            className="fixed left-0 top-0 z-50 flex h-[100dvh] w-[268px] flex-col overflow-y-auto bg-tl-surface px-3.5 py-5 font-manrope shadow-[0_0_40px_rgba(15,27,46,0.2)] focus:outline-none print:hidden"
          >
            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            {nav}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          data-print-hide="1"
          className="flex flex-wrap items-center gap-3.5 border-b border-tl-line bg-tl-surface px-[clamp(14px,3vw,26px)] py-3.5"
        >
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open the menu"
            aria-expanded={drawerOpen}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-tl-line text-tl-brand min-[980px]:hidden ${focusRing}`}
          >
            <Menu aria-hidden className="h-5 w-5" />
          </button>
          <div className="flex min-w-[120px] flex-1 items-center gap-2.5">
            {schoolLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={schoolLogo} alt="" className="h-7 w-7 shrink-0 rounded-[9px] object-cover" />
            ) : (
              <span aria-hidden className="h-7 w-7 shrink-0 rounded-[9px] bg-tl-success-bg" />
            )}
            <span className="truncate text-[15px] font-bold">{schoolName}</span>
          </div>
          {date ? <span className="whitespace-nowrap text-sm text-tl-muted">{date}</span> : null}
          <Link
            href="/updates"
            title="Announcements and alerts"
            aria-label={unreadUpdates ? `Updates, ${unreadUpdates} unread` : "Updates"}
            data-guide="topbar-bell"
            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-tl-line text-tl-brand hover:bg-tl-bg ${focusRing}`}
          >
            <Bell aria-hidden className="h-[19px] w-[19px]" />
            <CountBadge count={unreadUpdates} className="absolute -right-0.5 -top-0.5 min-w-[16px] px-[5px] text-center text-[11px]" />
          </Link>
          <Link
            href="/settings"
            title={`${name || "Your account"} — account & settings`}
            aria-label="Account and settings"
            className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-tl-select text-[13px] font-extrabold text-tl-brand ${focusRing}`}
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden>{initialsOf(name)}</span>
            )}
          </Link>
        </header>

        <main id="main" tabIndex={-1} className={`${pagePad} focus:outline-none`}>
          {children}
        </main>
      </div>

      <div data-print-hide="1">
        <AppGuide />
      </div>
    </div>
  );
}
