// hooks/useTimetable.ts
"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "@/components/CustomToast";
import { AcademicResponse, Timetable } from "@/types/auth";
import { timetableService } from "@/services/timetable.service";
import { API_ENDPOINTS } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";

export interface TimetableSubject {
  name: string;
  day: string;
  start: number; // Decimal hours (e.g., 9.6833 for 09:41 AM)
  end: number; // Decimal hours (e.g., 10.6333 for 10:38 AM)
  timeString: string; // e.g., "09:41 AM - 10:38 AM"
  className?: string;
  teacherName?: string;
  course?: string;
  subject?: string;
  startTime?: string;
  endTime?: string;
}

export const useTimetable = (options?: { silent?: boolean }) => {
  const { user, accessToken, isAuthenticated } = useAuthContext();
  const [subjects, setSubjects] = useState<TimetableSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parseTimeToDecimal = (time: string): number => {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours + minutes / 60;
  };

  const formatTime = (time: string): string => {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return time;
    return `${match[1].padStart(2, "0")}:${match[2]} ${match[3]}`;
  };

  const fetchTimetable = async () => {
    if (!isAuthenticated || !user?.userId || !accessToken) {
      if (!options?.silent) toast.error("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch classId from student details
      const studentUrl = API_ENDPOINTS.STUDENTS_BY_USER.replace(
        ":userId",
        user.userId
      );
      const studentResponse = await authFetch(studentUrl, {
        accessToken,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!studentResponse.ok) {
        throw new Error("Failed to fetch student data");
      }

      const studentData: AcademicResponse = await studentResponse.json();
      const classId = studentData.data[0]?.classId;

      if (!classId) {
        throw new Error("Class ID not found");
      }

      // Fetch timetable
      const timetableData: Timetable =
        await timetableService.getTimetableByClass(classId, accessToken);

      // Transform to desired format
      const timetableSubjects: TimetableSubject[] = [];
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

      days.forEach((day) => {
        const entries = timetableData[day as keyof Timetable] || [];
        entries.forEach((entry) => {
          const start = parseTimeToDecimal(entry.startTIme);
          const end = parseTimeToDecimal(entry.endTime);
          const timeString = `${formatTime(entry.startTIme)} - ${formatTime(
            entry.endTime
          )}`;
          timetableSubjects.push({
            name: entry.subject,
            day,
            start,
            end,
            timeString,
            className: entry.class,
            teacherName: (entry as any).teacherName,
            course: entry.course,
            subject: entry.subject,
            startTime: entry.startTIme,
            endTime: entry.endTime,
          });
        });
      });

      setSubjects(timetableSubjects);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load timetable";
      if (!options?.silent) toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [user, accessToken, isAuthenticated]);

  return { subjects, isLoading };
};
