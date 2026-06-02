"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { StudentOnboardingProvider } from "@/contexts/OnboardingContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastViewport } from "@/components/CustomToast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStudentOnboardingSync } from "@/hooks/useStudentOnboardingSync";

const SYNC_THROTTLE_MS = 60_000;

function OnboardingSyncEffect() {
  const { user } = useAuthContext();
  const { syncProgress } = useStudentOnboardingSync();
  const pathname = usePathname();
  const lastSyncAt = useRef(0);
  const lastSyncPath = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const now = Date.now();
    const pathChanged = lastSyncPath.current !== pathname;
    if (!pathChanged && now - lastSyncAt.current < SYNC_THROTTLE_MS) return;

    lastSyncPath.current = pathname;
    lastSyncAt.current = now;
    syncProgress().catch(() => {});
  }, [pathname, user?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

const inter = Inter({ subsets: ["latin"] });

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.title = "Talim Students";
  }, [pathname]);

  const publicRoutes = ["/", "/signin", "/register", "/forgot-password"];
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('talim_student_theme');var d=t==='dark'||(t==='system'||!t)&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <StudentOnboardingProvider>
              <OnboardingSyncEffect />
              <AuthGuard>
                <WebSocketProvider>
                  {children}
                  <ToastViewport />
                </WebSocketProvider>
              </AuthGuard>
            </StudentOnboardingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
