"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignInErrorBanner, SignInFooter, SignInHeading, SignInLogoHeader, SignInShell } from "@/components/auth/signin-ui";
import { deletionNoticeFromSearch } from "@/lib/auth/accountDeletion";
import { SUPPORT_EMAIL } from "@/lib/appInfo";

/**
 * The students' sign-in page (`/signin`) in the shared Talim sign-in look:
 * the form column with the "Students" pill and, from `lg`, the navy panel. A
 * visitor who is already signed in goes straight to Today. After a deletion
 * request (`/signin?deletionScheduledFor=<ISO>`) it says when the account
 * will be deleted.
 *
 * @returns The sign-in page.
 */
export default function SignInPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const router = useRouter();
  const [deletionNotice, setDeletionNotice] = useState<string | null>(null);

  // Read after mount from `window.location` (no `useSearchParams`, so the page needs no Suspense boundary).
  useEffect(() => {
    setDeletionNotice(deletionNoticeFromSearch(window.location.search));
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, authLoading, router]);

  return (
    <SignInShell
      illustration={<Image src="/icons/login/school-illustration.svg" alt="" fill className="object-contain" priority />}
      panelTitle="Talim Student Portal"
      panelText="Access your subjects, timetable, results, and resources — all in one place."
    >
      <SignInLogoHeader appName="Students" logo={<Image src="/icons/login/tree.svg" alt="" width={40} height={40} className="h-10 w-10" priority />} />
      <SignInHeading title="Welcome back" subtitle="Sign in to continue your learning journey." />
      {deletionNotice ? (
        <SignInErrorBanner tone="neutral" title="Account deletion scheduled" className="mt-6">
          {deletionNotice}
        </SignInErrorBanner>
      ) : null}
      <SignInForm />
      <SignInFooter supportEmail={SUPPORT_EMAIL} />
    </SignInShell>
  );
}
