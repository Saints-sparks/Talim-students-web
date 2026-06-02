"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";

type MenuItem = {
  label: string;
  iconPath: string;
  notification?: number;
  link?: string;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", iconPath: "/icons/dashboard.svg", link: "/dashboard" },
  { label: "Subjects", iconPath: "/icons/subjects.svg", link: "/subjects" },
  { label: "Resources", iconPath: "/icons/resources.svg", link: "/resources" },
  { label: "Timetable", iconPath: "/icons/timetable.svg", link: "/timetable" },
  { label: "Attendance", iconPath: "/icons/attendance.svg", link: "/attendance" },
  { label: "Results", iconPath: "/icons/results.svg", link: "/results" },
  { label: "Messages", iconPath: "/icons/messages.svg", link: "/messages" },
  { label: "Settings", iconPath: "/icons/settings.svg", link: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onClose,
  isCollapsed = false,
  onToggleCollapsed,
}) => {
  const pathname = usePathname();
  const { logout, user } = useAuthContext();
  const { chatRooms } = useRealtimeChat();
  const unreadMessages = chatRooms.reduce(
    (total, room) => total + (room.unreadCount || 0),
    0,
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={`h-full pb-4 font-manrope bg-[#FBFBFB] dark:bg-[#152238] flex flex-col justify-between border-r border-[#F1F1F1] dark:border-[#263754] overflow-y-auto scrollbar-hide transition-[width] duration-300 ${
        isCollapsed ? "w-[84px] px-3" : "w-[266px] px-4"
      }`}
    >
      <div>
        <div className="flex items-center py-2 justify-between">
          <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}>
            <div className="text-white p-3 rounded-lg">
              <Image
                src="/icons/talim.svg"
                alt="School"
                width={44.29}
                height={43.23}
              />
            </div>
            <span className={`ml-2 text-lg font-semibold text-[#030E18] dark:text-white ${isCollapsed ? "hidden" : ""}`}>
              Talim
            </span>
          </div>
          <button
            type="button"
            className={`hidden rounded-md border border-[#D7E1ED] p-1.5 text-[#003366] transition-colors hover:bg-[#EEF3F9] dark:border-[#344763] dark:text-slate-200 dark:hover:bg-[#1E3150] md:block ${
              isCollapsed ? "absolute left-[54px] top-4 bg-[#FBFBFB] dark:bg-[#152238]" : ""
            }`}
            onClick={onToggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <div
            className="border border-[#003366] dark:border-slate-600 rounded-md md:hidden"
            onClick={onClose}
          >
            <ChevronLeft className="text-[#003366] dark:text-slate-300" />
          </div>
        </div>
        <div className="mb-4 border-b border-2 border-solid border-[#F1F1F1] dark:border-slate-800 -mx-4" />
        <div
          className={`flex items-center border-2 border-solid border-[#F1F1F1] dark:border-[#30435F] bg-[#FBFBFB] dark:bg-[#1B2A44] rounded-md mb-4 ${
            isCollapsed ? "justify-center px-1 py-2" : "px-2 py-3"
          }`}
          title={user?.schoolName || "School"}
        >
          <Image
            src={user?.schoolLogo || "/unity.png"}
            alt={user?.schoolName || "School Logo"}
            width={40}
            height={40}
          />
          <span className={`ml-2 font-medium text-base text-gray-700 dark:text-slate-100 ${isCollapsed ? "hidden" : ""}`}>
            {user?.schoolName || "Unity Secondary S..."}
          </span>
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => {
              const isActive = pathname === item.link;
              return (
                <li key={item.label} className="mb-3">
                  <Link href={item.link || "#"}>
                    <div
                      className={`relative flex items-center rounded-md cursor-pointer transition-colors ${
                        isActive
                          ? "bg-[#003366] bg-opacity-25 text-[#003366] dark:bg-[#25477A] dark:text-white"
                          : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#1E3150]"
                      } ${isCollapsed ? "justify-center px-2 py-3" : "px-3 py-2"}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Image
                        src={item.iconPath}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={isActive ? "" : "dark:invert dark:opacity-70"}
                      />
                      <span className={`font-manrope text-base ml-3 font-medium ${isCollapsed ? "hidden" : ""}`}>
                        {item.label}
                      </span>
                      {item.label === "Messages" && unreadMessages > 0 && (
                        <span
                          className={`flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[11px] font-bold leading-none text-white shadow-sm ${
                            isCollapsed ? "absolute right-1 top-1" : "ml-auto"
                          }`}
                        >
                          {unreadMessages > 99 ? "99+" : unreadMessages}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div>
        <div className="mb-4 border-b border-2 border-solid border-[#F1F1F1] dark:border-slate-800 -mx-4" />
        <div
          className={`flex items-center rounded-md text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-[#1E3150] cursor-pointer ${
            isCollapsed ? "justify-center px-2 py-3" : "px-3 py-2"
          }`}
          onClick={handleLogout}
          title={isCollapsed ? "Logout Account" : undefined}
        >
          <Image
            src="/icons/logout.svg"
            alt="Logout"
            width={18}
            height={20}
            className="dark:invert dark:opacity-70"
          />
          <span className={`ml-3 font-medium ${isCollapsed ? "hidden" : ""}`}>Logout Account</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
