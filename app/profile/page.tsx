"use client";
import Layout from "@/components/Layout";
import AcademicInformation from "@/components/profile/AcademicInformation";
import ParentDetails from "@/components/profile/ParentDetails";
import StudentDetails from "@/components/profile/StudentDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { messageForError } from "@/lib/errorMessages";
import type { AvatarUrlPayload } from "@/types/apiPayloads";
import { logger } from "@/lib/logger";
import { BookOpenText, ChevronLeft, UserRound, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const tabs = [
  { label: "Personal Information", icon: <UserRound /> },
  { label: "Parent/Guardian Information", icon: <UsersRound /> },
  { label: "Academic Information", icon: <BookOpenText /> },
];

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("Personal Information");
  const router = useRouter();
  const { user, isLoading, accessToken } = useAuthContext();
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);
    try {
      // Upload to Cloudinary
      const secureUrl = await uploadImageToCloudinary(file);
      // Send to backend
      const avatarUrl = secureUrl;
      const avatarBody: AvatarUrlPayload = { avatarUrl };
      const apiRes = await authFetch(`${API_BASE_URL}/auth/profile/avatar`, {
        method: "PUT",
        accessToken,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(avatarBody),
      });
      if (!apiRes.ok) throw new Error("Failed to update avatar");
      // Optionally: reload or update user context
    } catch (err) {
      logger.error("profile", "Avatar upload failed", err);
      setErrorMsg(messageForError(err, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  // Generate initials from first and last names
  const getInitials = () => {
    if (!user) return "US"; // Default if no user

    const firstNameInitial = user.firstName?.[0]?.toUpperCase() || "";
    const lastNameInitial = user.lastName?.[0]?.toUpperCase() || "";

    // Handle cases where only one name exists
    return `${firstNameInitial}${lastNameInitial}` || "US";
  };

  return (
    <Layout>
      <div className="flex h-full flex-col p-4 gap-6">
        <div>
          <Button
            className="bg-transparent shadow-none hover:bg-gray-200"
            onClick={() => router.back()}
          >
            <ChevronLeft className="text-[#6F6F6F]" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white py-8 px-6 sm:p-10 rounded-3xl justify-center sm:justify-start items-center sm:items-start">
          {isLoading ? (
            <>
              <div className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex flex-col gap-3">
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-10 bg-gray-100 rounded w-32 animate-pulse"></div>
              </div>
            </>
          ) : (
            <>
              <Avatar className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px]">
                <AvatarImage src={user?.userAvatar || "/placeholder.svg"} alt="User avatar" />
                <AvatarFallback className="bg-green-300">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-3">
                <p>My Profile</p>
                <Button
                  className="border border-[#003366] text-[#003366] bg-[#F3F3F3] shadow-none hover:bg-gray-200"
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {errorMsg && (
                  <div className="text-red-500 text-sm mt-2">{errorMsg}</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Tabs Section */}
        <div className="bg-white h-full p-4 flex flex-col gap-4 rounded-3xl">
          {isLoading ? (
            <>
              {/* Tab buttons skeleton */}
              <div className="flex gap-2 overflow-x-auto">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 rounded-lg animate-pulse w-48"
                  ></div>
                ))}
              </div>

              {/* Content skeleton */}
              <div className="w-full mx-auto bg-white shadow-sm rounded-lg border animate-pulse">
                <div className="h-12 bg-[#F9F9F9] rounded-t-lg"></div>
                <div className="p-4 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-t pt-3"
                    >
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-100 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab) => (
                  <Button
                    key={tab.label}
                    onClick={() => setSelectedTab(tab.label)}
                    className={`shrink-0 rounded-lg border border-[#F0F0F0] text-[#686868] hover:bg-gray-200 shadow-none items-center text-xs sm:text-sm px-2 sm:px-4 min-h-[44px] ${
                      selectedTab === tab.label
                        ? "bg-[#F0F0F0] border-[#ADBECE]"
                        : "bg-white"
                    }`}
                  >
                    <span className="shrink-0">{tab.icon}</span>
                    <span className="ml-1.5 whitespace-nowrap">{tab.label}</span>
                  </Button>
                ))}
              </div>
              {selectedTab === "Personal Information" && <StudentDetails />}
              {selectedTab === "Parent/Guardian Information" && (
                <ParentDetails />
              )}
              {selectedTab === "Academic Information" && (
                <AcademicInformation />
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
