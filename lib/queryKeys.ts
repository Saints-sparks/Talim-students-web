/**
 * Query-key factory. Every cached resource is keyed `[resource, scopeId, …params]`
 * where the scope is the signed-in student (or their class), so signing out can
 * drop everything at once via `queryClient.removeQueries({ queryKey: [resource] })`
 * and a mutation can invalidate exactly the list it changed.
 *
 * Add a resource here when a screen moves onto TanStack Query; never build
 * ad-hoc key arrays inside components.
 */
export const queryKeys = {
  student: {
    all: ["student"] as const,
    /** The student profile behind a user account (`/students/by-user/:userId`). */
    byUser: (userId: string) => ["student", userId, "profile"] as const,
    /** Dashboard KPI tiles for the signed-in student. */
    kpis: (studentId: string, termId?: string) => ["student", studentId, "kpis", termId ?? "current"] as const,
  },
  attendance: {
    all: ["attendance"] as const,
    kpis: (studentId: string) => ["attendance", studentId, "kpis"] as const,
    dashboard: (studentId: string) => ["attendance", studentId, "dashboard"] as const,
    classStatus: (classId: string, date: string) => ["attendance", "class", classId, "status", date] as const,
  },
  grades: {
    all: ["grades"] as const,
    /** Courses in the student's class with published-result counts, per term. */
    courses: (termId: string) => ["grades", "me", "courses", termId] as const,
    /** Course grade records for the student, per term. */
    courseGrades: (termId: string) => ["grades", "me", "course-grades", termId] as const,
    /** Published assessments for one course, per term. */
    publishedAssessments: (courseId: string, termId: string) =>
      ["grades", "me", "courses", courseId, "published-assessments", termId] as const,
    /** Every cumulative term record for the student. */
    cumulative: () => ["grades", "me", "cumulative"] as const,
    /** One term's cumulative record. */
    cumulativeByTerm: (termId: string) => ["grades", "me", "cumulative", termId] as const,
    /** The student's records for one assessment. */
    assessment: (assessmentId: string) => ["grades", "me", "assessments", assessmentId] as const,
  },
  timetable: {
    all: ["timetable"] as const,
    byClass: (classId: string) => ["timetable", classId] as const,
  },
  curriculum: {
    all: ["curriculum"] as const,
    coursesByClass: (classId: string) => ["curriculum", "courses", "class", classId] as const,
    coursesBySchool: () => ["curriculum", "courses", "school"] as const,
    subjects: () => ["curriculum", "subjects"] as const,
    byCourse: (courseId: string) => ["curriculum", "course", courseId] as const,
    detail: (curriculumId: string) => ["curriculum", "detail", curriculumId] as const,
  },
  resources: {
    all: ["resources"] as const,
    byClass: (classId: string) => ["resources", "class", classId] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (userId: string, params?: Record<string, unknown>) => ["notifications", userId, "list", params ?? {}] as const,
    announcements: (userId: string, params?: Record<string, unknown>) =>
      ["notifications", userId, "announcements", params ?? {}] as const,
    /** Per-student notification preferences. */
    preferences: (userId: string) => ["notifications", userId, "preferences"] as const,
    /** Unread and total counts per category (`/notifications/counts`). */
    counts: (userId: string) => ["notifications", userId, "counts"] as const,
  },
  chat: {
    all: ["chat"] as const,
    /** The student's messaging switches (`/chat/preferences`). */
    preferences: (userId: string) => ["chat", userId, "preferences"] as const,
    /** Teachers this student may start a direct message with (`/chat/contacts`). */
    contacts: (userId: string) => ["chat", userId, "contacts"] as const,
    /** What was shared in a room, by kind (`/chat/rooms/:id/media?kind=`). */
    media: (roomId: string, kind: string) => ["chat", "media", roomId, kind] as const,
  },
  /** The learner-view aggregates (portals contract Part B), one per screen. */
  learner: {
    all: ["learner"] as const,
    today: (userId: string) => ["learner", userId, "today"] as const,
    timetable: (userId: string, weekStart?: string) => ["learner", userId, "timetable", weekStart ?? "current"] as const,
    subjects: (userId: string, termId?: string) => ["learner", userId, "subjects", termId ?? "current"] as const,
    subject: (userId: string, courseId: string, termId?: string) =>
      ["learner", userId, "subject", courseId, termId ?? "current"] as const,
    reportCard: (userId: string, termId?: string) => ["learner", userId, "report-card", termId ?? "current"] as const,
    reportTerms: (userId: string) => ["learner", userId, "report-terms"] as const,
    attendance: (userId: string, termId?: string) => ["learner", userId, "attendance", termId ?? "current"] as const,
    files: (userId: string, params?: Record<string, unknown>) => ["learner", userId, "files", params ?? {}] as const,
    school: (userId: string) => ["learner", userId, "school"] as const,
  },
  /** Account security (round-4 §34). */
  account: {
    all: ["account"] as const,
    passwordPolicy: () => ["account", "password-policy"] as const,
    sessions: (userId: string) => ["account", userId, "sessions"] as const,
  },
  academics: {
    all: ["academics"] as const,
    /** The school's academic sessions and terms. */
    sessions: (schoolId: string) => ["academics", schoolId, "sessions"] as const,
  },
} as const;

/**
 * The prefix of a params-carrying list key, for invalidating every page of a
 * list at once. Invalidating with the full key would only match one page.
 *
 * @param key - A key built by one of the factories above.
 * @returns The key without its trailing params object.
 */
export function listPrefix(key: readonly unknown[]): readonly unknown[] {
  const last = key[key.length - 1];
  return last && typeof last === "object" && !Array.isArray(last) ? key.slice(0, -1) : key;
}

/** Stale times (ms) by how often the data actually changes. */
export const staleTimes = {
  /** Timetable, curriculum, subjects, resources: changes a few times a term. */
  reference: 10 * 60_000,
  /** Results and attendance: a teacher may publish during the day. */
  list: 60_000,
  /** Counters and unread badges: always refetch on mount. */
  live: 0,
} as const;
