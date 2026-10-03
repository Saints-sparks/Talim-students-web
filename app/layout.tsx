"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { StudentOnboardingProvider, useStudentOnboarding } from "@/contexts/OnboardingContext";
import { TourProvider } from "@/components/tour/TourProvider";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ChatProvider } from "@/contexts/ChatContext";
import RealtimeAlerts from "@/components/RealtimeAlerts";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import OfflineBanner from "@/components/OfflineBanner";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastViewport } from "@/components/CustomToast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentOnboardingSync } from "@/hooks/useStudentOnboardingSync";

/**
 * Ticks the onboarding steps the student has already done: once per signed-in
 * student (never per route change), through the query cache.
 *
 * @returns Nothing visible.
 */
function OnboardingSyncEffect() {
  const { user } = useAuthContext();
  const { isHydrated } = useStudentOnboarding();
  const { syncProgress } = useStudentOnboardingSync();
  const userId = user?.userId || user?.id;

  useEffect(() => {
    if (!userId || !isHydrated) return;
    syncProgress().catch(() => {});
  }, [userId, isHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

const inter = Inter({ subsets: ["latin"] });

/**
 * Sends signed-out visitors of a private page to sign-in, and signed-in
 * students away from sign-in, once the session has loaded.
 *
 * @param props - Standard children.
 * @param props.children - The page.
 * @returns A loader while the session loads, then the page.
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.title = "Talim Students";
  }, [pathname]);

  // T4.6: `/register` was whitelisted here and in middleware.ts, but the app
  // has no such route — students are created by their school.
  const publicRoutes = ["/", "/signin", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/signin");
      } else if (isAuthenticated && (pathname === "/signin" || pathname === "/")) {
        // Send to onboarding — it will redirect to dashboard if already complete
        router.push("/onboarding");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isPublicRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0B1224]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] dark:border-blue-300 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-slate-200">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * The root layout: theme, query cache, session, onboarding, socket, chat and
 * tour providers around every page.
 *
 * @param props - Standard children.
 * @param props.children - The page.
 * @returns The document.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('talim_student_theme');var d=t==='dark'||(t==='system'||!t)&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <StudentOnboardingProvider>
                <OnboardingSyncEffect />
                <OfflineBanner />
                <AuthGuard>
                  <WebSocketProvider>
                    <ChatProvider>
                      <TourProvider>
                        <RealtimeAlerts />
                        {children}
                        <ToastViewport />
                      </TourProvider>
                    </ChatProvider>
                  </WebSocketProvider>
                </AuthGuard>
              </StudentOnboardingProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
