// pages/dashboard.tsx
"use client";

import { MetricCard } from "@/components/metric-card";
import Layout from "@/components/Layout";
import Image from "next/image";
import Timetable from "@/components/Timetable";
import { useStudentKPIs } from "@/hooks/useStudentKPIs";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  MetricCardSkeleton,
  TimetableSkeleton,
} from "@/components/CardSkelenton";
import { ErrorDisplay, CompactErrorDisplay } from "@/components/ErrorDisplay";
import { EmptyState } from "@/components/EmptyState";
import StudentSetupProgressWidget from "@/components/StudentSetupProgressWidget";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { kpiData, isLoading, error, refetch } = useStudentKPIs();

  // Determine error variant based on error message
  const getErrorVariant = (errorMessage: string) => {
    const lowerError = errorMessage.toLowerCase();
    if (
      lowerError.includes("network") ||
      lowerError.includes("fetch") ||
      lowerError.includes("connection")
    ) {
      return "network";
    }
    if (
      lowerError.includes("unauthorized") ||
      lowerError.includes("token") ||
      lowerError.includes("authentication")
    ) {
      return "auth";
    }
    if (lowerError.includes("500") || lowerError.includes("server")) {
      return "server";
    }
    return "default";
  };

  // Metrics with real KPI data
  const metrics = {
    subjects: {
      value: kpiData?.subjectsEnrolled || 0,
      message: "See more",
      link: "/subjects",
    },
    gradeScore: {
      value: kpiData?.gradeScore || 0,
      message: "See more",
      link: "/results",
    },
    attendancePercentage: {
      value: kpiData?.attendancePercentage || 0,
      message: "See more",
      link: "/attendance",
    },
  };

  return (
    <Layout>
      <div className="relative w-full sm:h-screen bg-[#F8F8F8] dark:bg-[#0B1224] px-3 sm:px-4 overflow-hidden">
        <div className="h-full mx-auto flex flex-col space-y-4 sm:space-y-5 2xl:space-y-8 py-4 sm:py-0">
          {/* Onboarding progress widget */}
          <StudentSetupProgressWidget />

          {/* Overview */}
          <div className="flex-grow">
            <h2 className="text-xl font-semibold my-4 text-[#030E18] dark:text-white">Overview</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                <>
                  <MetricCardSkeleton />
                  <MetricCardSkeleton />
                  <MetricCardSkeleton />
                </>
              ) : error ? (
                <div className="col-span-full">
                  <ErrorDisplay
                    error={error}
                    onRetry={refetch}
                    title="Dashboard Data Unavailable"
                    variant={getErrorVariant(error)}
                  />
                </div>
              ) : !kpiData ? (
                <div className="col-span-full">
                  <EmptyState
                    title="Welcome to Your Dashboard"
                    message="Your academic data will appear here once it's available."
                    actionLabel="Refresh Data"
                    onAction={refetch}
                  />
                </div>
              ) : (
                <>
                  <MetricCard
                    icon={
                      <Image
                        src="/icons/dashboard/subject.svg"
                        width={52}
                        height={52}
                        alt="Subjects Icon"
                        className="h-[52px] w-[52px]"
                      />
                    }
                    value={metrics.subjects.value}
                    label="Subjects Enrolled"
                    message={metrics.subjects.message}
                    link={metrics.subjects.link}
                  />
                  <MetricCard
                    icon={
                      <img
                        src="/icons/dashboard/award.svg"
                        alt="Award Icon"
                        className="h-[52px] w-[52px]"
                      />
                    }
                    value={`${metrics.gradeScore.value}%`}
                    label="Grade Score"
                    message={metrics.gradeScore.message}
                    link={metrics.gradeScore.link}
                  />
                  <MetricCard
                    icon={
                      <img
                        src="/icons/dashboard/calendar.svg"
                        alt="Calendar Icon"
                        className="h-[52px] w-[52px]"
                      />
                    }
                    value={`${metrics.attendancePercentage.value}%`}
                    label="Attendance Percentage"
                    message={metrics.attendancePercentage.message}
                    link={metrics.attendancePercentage.link}
                  />
                </>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div>{isLoading ? <TimetableSkeleton /> : <Timetable />}</div>
        </div>
      </div>
    </Layout>
  );
}
