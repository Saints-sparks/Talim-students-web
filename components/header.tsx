import Link from "next/link";
import { Search, Bell, Menu, CalendarRange } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { useAuthContext } from "@/contexts/AuthContext";
import { WebSocketStatus } from "./WebSocketStatus";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthContext();

  // Generate initials from first and last names
  const getInitials = () => {
    if (!user) return "US"; // Default if no user

    const firstNameInitial = user.firstName?.[0]?.toUpperCase() || "";
    const lastNameInitial = user.lastName?.[0]?.toUpperCase() || "";

    // Handle cases where only one name exists
    return `${firstNameInitial}${lastNameInitial}` || "US";
  };
  return (
    <header className="font-manrope px-5 border-b sm:border-b-2 border-b-[#F0F0F0] pb-4">
      {/* Top row: Menu, Date, Notifications, Avatar */}
      <div className="flex flex-col  sm:flex-row items-center w-full justify-between gap-4 py-3">
        {/* Menu Button (Only on Mobile) */}
        <div className="flex items-center w-full sm:w-auto justify-between">
          <div
            className="md:hidden rounded-md shadow-none"
            onClick={onMenuClick}
          >
            <Menu className="text-[#003366]" size={24} />
          </div>
          {/* Right Side: Date, Notifications, Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2 items-center text-sm text-[#6F6F6F] p-2 rounded-lg border border-[#F0F0F0] bg-white cursor-pointer hover:bg-gray-100">
              <p className="text-[14px] sm:text-[16px]">
                {format(new Date(), "dd MMM, yyyy")}
              </p>
              <CalendarRange size={24} />
            </div>
            {/* WebSocket Status - Always visible but compact on mobile */}
            <div className="flex items-center">
              <WebSocketStatus />
            </div>
            <Link href="/notifications">
              <Button className="bg-white shadow-none border border-[#F0F0F0] hover:bg-gray-200 h-full rounded-lg p-3">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>
            <Link href="/profile">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User avatar" />
                <AvatarFallback className="bg-green-300">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
        {/* Search Bar: Below on Mobile, Left-Aligned on Larger Screens */}
        <div className="relative w-full sm:w-[40%] max-w-md sm:order-first"></div>
      </div>
    </header>
  );
}
