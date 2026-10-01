"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export type StudentOnboardingStepId =
  | "student-profile"
  | "view-notifications"
  | "download-resource"
  | "view-timetable";

export interface StudentOnboardingStep {
  id: StudentOnboardingStepId;
  label: string;
  description: string;
  required: boolean;
  phase: 1 | 2;
  href: string;
}

export const STUDENT_ONBOARDING_STEPS: StudentOnboardingStep[] = [
  {
    id: "student-profile",
    label: "Confirm Profile",
    description: "Upload your photo, confirm your date of birth and personal details.",
    required: true,
    phase: 1,
    href: "/onboarding",
  },
  {
    id: "view-notifications",
    label: "View Notifications",
    description: "Check your school announcements and updates.",
    required: true,
    phase: 2,
    href: "/updates",
  },
  {
    id: "download-resource",
    label: "Download a Resource",
    description: "Access and download a learning resource shared by your teacher.",
    required: true,
    phase: 2,
    href: "/files",
  },
  {
    id: "view-timetable",
    label: "View Your Timetable",
    description: "Check your class schedule for the week.",
    required: true,
    phase: 2,
    href: "/timetable",
  },
];

interface StudentOnboardingState {
  completedSteps: StudentOnboardingStepId[];
  phase1Completed: boolean;
  setupDismissed: boolean;
  confirmedDob: string | null;
}

interface StudentOnboardingContextType {
  completedSteps: StudentOnboardingStepId[];
  phase1Completed: boolean;
  setupDismissed: boolean;
  confirmedDob: string | null;
  isHydrated: boolean;
  isStepComplete: (id: StudentOnboardingStepId) => boolean;
  markStepComplete: (id: StudentOnboardingStepId) => void;
  completePhase1: (dob?: string) => void;
  dismissSetup: () => void;
  progressPercent: number;
  completedCount: number;
  totalCount: number;
  isFullyComplete: boolean;
}

const StudentOnboardingContext = createContext<
  StudentOnboardingContextType | undefined
>(undefined);

export const useStudentOnboarding = () => {
  const ctx = useContext(StudentOnboardingContext);
  if (!ctx) {
    throw new Error(
      "useStudentOnboarding must be used within StudentOnboardingProvider"
    );
  }
  return ctx;
};

const defaultState: StudentOnboardingState = {
  completedSteps: [],
  phase1Completed: false,
  setupDismissed: false,
  confirmedDob: null,
};

const storageKey = (userId: string) => `student_onboarding_${userId}`;

const loadState = (userId: string): StudentOnboardingState => {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    // ignore malformed state
  }
  return defaultState;
};

const saveState = (userId: string, state: StudentOnboardingState) => {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(state));
  } catch {
    // ignore storage failures
  }
};

export const StudentOnboardingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user } = useAuthContext();
  const userId = user?.userId || user?.id || null;

  const [state, setState] = useState<StudentOnboardingState>(defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (!userId) {
      setState(defaultState);
      setIsHydrated(true);
      return;
    }
    setIsHydrated(false);
    const local = loadState(userId);
    setState(local);
    setIsHydrated(true);
  }, [userId]);

  const updatePersistedState = useCallback(
    (updater: (current: StudentOnboardingState) => StudentOnboardingState) => {
      setState((current) => {
        const next = updater(current);
        if (userId) saveState(userId, next);
        return next;
      });
    },
    [userId]
  );

  const isStepComplete = useCallback(
    (id: StudentOnboardingStepId) => state.completedSteps.includes(id),
    [state.completedSteps]
  );

  const markStepComplete = useCallback(
    (id: StudentOnboardingStepId) => {
      updatePersistedState((current) => {
        if (current.completedSteps.includes(id)) return current;
        return {
          ...current,
          completedSteps: [...current.completedSteps, id],
        };
      });
    },
    [updatePersistedState]
  );

  const completePhase1 = useCallback(
    (dob?: string) => {
      updatePersistedState((current) => {
        const completedSteps = Array.from(
          new Set([...current.completedSteps, "student-profile" as const])
        );
        return {
          ...current,
          completedSteps,
          phase1Completed: true,
          confirmedDob: dob ?? current.confirmedDob,
        };
      });
    },
    [updatePersistedState]
  );

  const dismissSetup = useCallback(() => {
    updatePersistedState((current) => ({ ...current, setupDismissed: true }));
  }, [updatePersistedState]);

  const totalCount = STUDENT_ONBOARDING_STEPS.length;
  const completedCount = state.completedSteps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isFullyComplete = STUDENT_ONBOARDING_STEPS.filter((s) => s.required).every(
    (s) => state.completedSteps.includes(s.id)
  );

  return (
    <StudentOnboardingContext.Provider
      value={{
        completedSteps: state.completedSteps,
        phase1Completed: state.phase1Completed,
        setupDismissed: state.setupDismissed,
        confirmedDob: state.confirmedDob,
        isHydrated,
        isStepComplete,
        markStepComplete,
        completePhase1,
        dismissSetup,
        progressPercent,
        completedCount,
        totalCount,
        isFullyComplete,
      }}
    >
      {children}
    </StudentOnboardingContext.Provider>
  );
};
