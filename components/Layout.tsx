"use client";
import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Header } from "./header";
import AppGuide from "./onboarding/AppGuide";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      setIsSidebarCollapsed(localStorage.getItem("student_sidebar_collapsed") === "true");
    } catch {}
  }, []);

  const toggleSidebarCollapsed = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("student_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex flex-row h-screen bg-[#F8F8F8] font-manrope dark:bg-[#0B1224]">
      {/* Sidebar: Hidden on mobile, toggled via state */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          isSidebarOpen ? "block" : "hidden"
        } md:hidden`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div
        className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapsed={toggleSidebarCollapsed}
        />
      </div>
      <div className="flex h-full flex-1 flex-col overflow-hidden border border-[#F0F0F0] bg-[#F8F8F8] dark:border-slate-800 dark:bg-[#0B1224]">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
      <AppGuide />
    </div>
  );
}

export default Layout;
