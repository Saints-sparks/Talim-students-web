/**
 * GENERATED FILE - DO NOT EDIT BY HAND.
 *
 * Types for the Talim HTTP API, generated from docs/openapi.json with
 * openapi-typescript. Regenerate after any controller/DTO change:
 *
 *   npm run openapi:export   # boots the API, rewrites openapi.json, then this file
 *   npm run openapi:types    # only this file, from the current openapi.json
 *
 * The backend test suite fails when this file is stale. Client repos copy it to
 * src/types/api.d.ts; see docs/api-contract.md ("Typed clients").
 */

export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Liveness probe
         * @description The liveness probe.
         */
        get: operations["AppController_getHello"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Health probe used by the platform and rate-limit exemptions
         * @description The health probe.
         */
        get: operations["AppController_health"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The API version, commit and build time
         * @description `version` is the API `package.json` version; `commit` comes from `GIT_COMMIT` (else Render's `RENDER_GIT_COMMIT`), `builtAt` from `BUILD_TIME`; each is null when unset.
         */
        get: operations["AppController_version"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/today": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The calling teacher's Today page in one call
         * @description Everything the teacher's Today page shows.
         */
        get: operations["TeachersTodayController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/me/school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The calling teacher's school contact card
         * @description Name, email and address from the school record; the phone of the school's first primary contact; office hours from PATCH /settings/academic (null until set).
         */
        get: operations["TeachersMeController_school"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/me/classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The calling teacher's classes (class pickers)
         * @description The calling teacher's classes, class-teacher classes first.
         */
        get: operations["TeachersMeController_myClasses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/me/classes/{classId}/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A class's students (class teacher, course teacher, staff)
         * @description A class's roster: attendance this term and each guardian.
         */
        get: operations["TeachersMeController_students"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/me/students/{studentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A student's record (a teacher of the student's class, or staff)
         * @description A student's record: details, guardian, attendance and scores.
         */
        get: operations["TeachersMeController_student"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/today": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The student's Today (B1)
         * @description B1 Today.
         */
        get: operations["StudentsMeController_today"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/timetable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The student's week (B2)
         * @description B2 Timetable.
         */
        get: operations["StudentsMeController_timetable"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/subjects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The student's subjects for a term (B3)
         * @description B3 Subjects.
         */
        get: operations["StudentsMeController_subjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/subjects/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One subject of the student (B4)
         * @description B4 Subject detail.
         */
        get: operations["StudentsMeController_subject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/report-card": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The student's report card for a term (B5)
         * @description B5 Report card.
         */
        get: operations["StudentsMeController_reportCard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/report-card/terms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The terms with results, and their status (B5)
         * @description B5 The terms that have results.
         */
        get: operations["StudentsMeController_reportTerms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/attendance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The student's attendance for a term (B6)
         * @description B6 Attendance.
         */
        get: operations["StudentsMeController_attendance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The student's files (B7)
         * @description B7 Files, a page at a time.
         */
        get: operations["StudentsMeController_files"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/files/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A zip of the student's files (B7)
         * @description Streams a zip. Files are downloaded from the school file storage only (RESOURCE_ARCHIVE_HOSTS); any other file is listed with its link in links.txt. At most 200 files.
         */
        get: operations["StudentsMeController_archive"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The student's school contact card (B12)
         * @description B12 School contact.
         */
        get: operations["StudentsMeController_school"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/me/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The student's UI preferences (the guided tour)
         * @description The student's UI preferences (the guided tour).
         */
        get: operations["StudentsMeController_preferences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update the student's UI preferences
         * @description `guides.tourCompleted: true` stamps guides.tourCompletedAt; false clears it.
         */
        patch: operations["StudentsMeController_updatePreferences"];
        trace?: never;
    };
    "/parents/me/children/{childId}/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A child's dashboard (B1, parent variant)
         * @description B1 The child's dashboard.
         */
        get: operations["ParentChildrenController_dashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/timetable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A child's week (B2)
         * @description The /students/me/timetable shape. Replaces the old parent timetable shape (weekRange, timetableSlots, listView), which only the parents web app read.
         */
        get: operations["ParentChildrenController_timetable"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/report-card": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A child's report card for a term (B5)
         * @description B5 The child's report card.
         */
        get: operations["ParentChildrenController_reportCard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/report-card/terms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A child's terms with results (B5)
         * @description B5 The terms that have results for the child.
         */
        get: operations["ParentChildrenController_reportTerms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/report-card/acknowledge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Acknowledge a published report card (B8)
         * @description Stored on the term remark (parentAckAt, parentAckBy). 409 RESULTS_NOT_PUBLISHED until the term results are published. A second call keeps the first time.
         */
        post: operations["ParentChildrenController_acknowledge"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/attendance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A child's attendance (B6)
         * @description B6 The child's attendance.
         */
        get: operations["ParentChildrenController_attendance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A child's school contact card (B12)
         * @description B12 The child's school contact card.
         */
        get: operations["ParentChildrenController_school"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/calendar-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List school calendar events in a date range
         * @description Events overlapping `[from, to]`, by start date.
         */
        get: operations["CalendarEventsController_list"];
        put?: never;
        /**
         * Add a calendar event
         * @description Adds a holiday, event or early close.
         */
        post: operations["CalendarEventsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/calendar-events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete a calendar event
         * @description Deletes an event.
         */
        delete: operations["CalendarEventsController_remove"];
        options?: never;
        head?: never;
        /**
         * Change a calendar event
         * @description Changes an event.
         */
        patch: operations["CalendarEventsController_update"];
        trace?: never;
    };
    "/timetable/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The calling teacher's timetable for one week
         * @description The teacher's lessons, periods and calendar for one week.
         */
        get: operations["TimetableMeController_me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/registers/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Register status of your classes for a day
         * @description Where each register stands on a day.
         */
        get: operations["RegistersController_status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/registers/{classId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A class's register for a day (class teacher, course teacher, staff)
         * @description A class's register on a day, student by student, with what the caller
         *     may do with it.
         */
        get: operations["RegistersController_view"];
        /**
         * Save (and optionally submit) a class's register for a day
         * @description Upserts the attendance rows. Students on approved leave are ignored in `marks` and written as Excused on submit. With `submit: true` every student not on leave must be marked (else the marks are still saved and the answer is 409). `notified` counts the parents told by this call. Parents of absent students are notified on submit only: on the first submit every absent student, later only those not notified before; late students are not notified.
         */
        put: operations["RegistersController_save"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/registers/{classId}/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit a class's morning register
         * @description Submits a class's register once every student is marked or on leave.
         */
        post: operations["RegistersController_submit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/scheme-of-work/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The calling teacher's subject cards (Subjects page)
         * @description The calling teacher's subject cards: one per course they teach.
         */
        get: operations["SchemeOfWorkController_mine"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/scheme-of-work/course/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A course's week-by-week scheme of work
         * @description A course's scheme for a term, every week present.
         */
        get: operations["SchemeOfWorkController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/scheme-of-work/course/{courseId}/weeks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Save several weeks of a scheme of work
         * @description Saves several weeks at once.
         */
        put: operations["SchemeOfWorkController_saveWeeks"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/scheme-of-work/course/{courseId}/weeks/{week}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Save one week of a scheme of work
         * @description Saves one week.
         */
        put: operations["SchemeOfWorkController_saveWeek"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/scheme-of-work/course/{courseId}/weeks/{week}/taught": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark a scheme-of-work week taught
         * @description Marks a week taught or not taught.
         */
        post: operations["SchemeOfWorkController_markTaught"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/course/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** A course's grading sheet (course teacher, staff) */
        get: operations["GradingController_sheet"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/course/{courseId}/assessments/{assessmentId}/scores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Save one assessment's scores for a course
         * @description Saves scores of one assessment; `null` deletes a score.
         */
        put: operations["GradingController_saveScores"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/course/{courseId}/assessments/{assessmentId}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish one assessment's scores for a course
         * @description Publishes one assessment's scores for a course.
         */
        post: operations["GradingController_publish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/course/{courseId}/assessments/{assessmentId}/unlock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unlock published scores for a correction
         * @description Unlocks published scores for a correction.
         */
        post: operations["GradingController_unlock"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/classes/{classId}/readiness": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** A class's grading readiness (class teacher, staff) */
        get: operations["GradingController_readiness"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/classes/{classId}/reminders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remind a course teacher (class teacher only)
         * @description Reminds a course teacher that scores are awaited (once a day).
         */
        post: operations["GradingController_remind"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/classes/{classId}/broadsheet": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A class's broadsheet (class teacher, staff)
         * @description The class's broadsheet of published scores.
         */
        get: operations["GradingController_broadsheet"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/classes/{classId}/remarks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A class's term remarks (class teacher, staff)
         * @description The class's term remarks.
         */
        get: operations["GradingController_remarks"];
        /**
         * Save class-teacher remarks (class teacher, staff)
         * @description Saves class-teacher remarks.
         */
        put: operations["GradingController_saveRemarks"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/classes/{classId}/term-results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A class's term results (class teacher, staff)
         * @description The class's term results submissions.
         */
        get: operations["GradingController_classSubmissions"];
        put?: never;
        /**
         * Submit term results (class teacher, staff)
         * @description Submits the class's term results to the office.
         */
        post: operations["GradingController_submit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/term-results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Term results queue (staff) */
        get: operations["GradingController_queue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/term-results/counts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Term results counts by status (staff)
         * @description How many submissions are in each status.
         */
        get: operations["GradingController_counts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/term-results/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One term results submission (staff, or its class teacher)
         * @description One submission.
         */
        get: operations["GradingController_detail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/term-results/{id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish term results (staff)
         * @description Publishes submitted results to students and parents.
         */
        post: operations["GradingController_publishResults"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/term-results/{id}/return": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Return term results to the class teacher (staff)
         * @description Returns submitted results to the class teacher.
         */
        post: operations["GradingController_returnResults"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grading/term-results/{id}/principal-remarks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Save the principal's remarks (staff)
         * @description Saves the principal's remarks for a submission's class.
         */
        put: operations["GradingController_savePrincipalRemarks"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all resources */
        get: operations["ResourceController_findAll"];
        put?: never;
        /** Upload a new resource */
        post: operations["ResourceController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources/class/{classId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get resources by class ID */
        get: operations["ResourceController_findByClassId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get resources by term ID */
        get: operations["ResourceController_findByTermId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources/course/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get resources by course ID */
        get: operations["ResourceController_findByCourseId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources/user/{uploadedBy}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get resources by uploaded user ID */
        get: operations["ResourceController_findByUploadedBy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a resource by ID */
        get: operations["ResourceController_findOne"];
        /** Update a resource */
        put: operations["ResourceController_update"];
        post?: never;
        /** Delete a resource */
        delete: operations["ResourceController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources/{id}/view": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Record a view of a resource (students, parents) */
        post: operations["ResourceController_recordView"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects-courses/courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new course */
        post: operations["SubjectCourseController_createCourse"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects-courses/courses/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a course by ID */
        get: operations["SubjectCourseController_getCourse"];
        /** Edit a course */
        put: operations["SubjectCourseController_editCourse"];
        post?: never;
        /** Delete a course */
        delete: operations["SubjectCourseController_deleteCourse"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects-courses/subjects/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a subject by ID */
        get: operations["SubjectCourseController_getSubject"];
        /** Edit a subject */
        put: operations["SubjectCourseController_editSubject"];
        post?: never;
        /** Delete a subject */
        delete: operations["SubjectCourseController_deleteSubject"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects-courses/courses/school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all courses by school */
        get: operations["SubjectCourseController_getCoursesBySchool"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects-courses/courses/subject/{subjectId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get courses by subject and school */
        get: operations["SubjectCourseController_getCoursesBySubject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects-courses/by-school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all subjects by school
         * @description Fetches all subjects associated with the user's school
         */
        get: operations["SubjectCourseController_getSubjectsBySchool"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects-courses/subjects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new subject */
        post: operations["SubjectCourseController_createSubject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subjects-courses/courses/class/{classId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get courses by class ID */
        get: operations["SubjectCourseController_getCoursesByClass"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/academic-year-term/academic-year": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new academic year */
        post: operations["AcademicYearTermController_createAcademicYear"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/academic-year-term/academic-year/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update an academic year */
        put: operations["AcademicYearTermController_updateAcademicYear"];
        post?: never;
        /** Delete an academic year */
        delete: operations["AcademicYearTermController_deleteAcademicYear"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/academic-year-term/term": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new term */
        post: operations["AcademicYearTermController_createTerm"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/academic-year-term/term/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a term */
        put: operations["AcademicYearTermController_updateTerm"];
        post?: never;
        /** Delete a term */
        delete: operations["AcademicYearTermController_deleteTerm"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/academic-year-term/academic-year/school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get academic years by school ID */
        get: operations["AcademicYearTermController_getAcademicYearBySchoolId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/academic-year-term/term/school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get terms by school ID
         * @description The school's terms (for a parent, the chosen child's school), each
         *     with `id` and its `session` for the learner term pickers (B).
         */
        get: operations["AcademicYearTermController_getTermBySchoolId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/academic-year-term/term/{id}/set-current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Set term as current term */
        put: operations["AcademicYearTermController_setCurrentTerm"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/academic-year-term/term/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get current term */
        get: operations["AcademicYearTermController_getCurrentTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/timetable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new timetable entry */
        post: operations["TimetableController_createTimetable"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/timetable/class/{classId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get timetable by class */
        get: operations["TimetableController_getTimetableByClass"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/timetable/teacher/{teacherId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get timetable by teacher (deprecated: use GET /timetable/me (the signed-in teacher))
         * @deprecated
         */
        get: operations["TimetableController_getTimetableByTeacher"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/timetable/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a timetable entry */
        put: operations["TimetableController_updateTimetable"];
        post?: never;
        /** Delete a timetable entry */
        delete: operations["TimetableController_deleteTimetable"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/curriculum/kpis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get curriculum KPIs for school admin
         * @description Returns comprehensive curriculum statistics including total subjects, courses, active teachers, classes, students, and distribution metrics for school administrators.
         */
        get: operations["CurriculumController_getCurriculumKpis"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/curriculum": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all curricula for the school */
        get: operations["CurriculumController_findAll"];
        put?: never;
        /** Create a new curriculum */
        post: operations["CurriculumController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/curriculum/by-course-term": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Get curriculum by course and term (POST) */
        post: operations["CurriculumController_getByCourseAndTerm"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/curriculum/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get curriculum by ID */
        get: operations["CurriculumController_findOne"];
        put?: never;
        post?: never;
        /** Delete curriculum */
        delete: operations["CurriculumController_remove"];
        options?: never;
        head?: never;
        /** Update curriculum */
        patch: operations["CurriculumController_update"];
        trace?: never;
    };
    "/assessments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new assessment */
        post: operations["AssessmentController_createAssessment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assessments/school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get assessments by school ID */
        get: operations["AssessmentController_getAssessmentsBySchool"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assessments/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get assessments by term ID */
        get: operations["AssessmentController_getAssessmentsByTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assessments/term/{termId}/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get active assessments by term ID */
        get: operations["AssessmentController_getActiveAssessmentsByTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assessments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get assessment by ID */
        get: operations["AssessmentController_getAssessmentById"];
        /** Update an assessment */
        put: operations["AssessmentController_updateAssessment"];
        post?: never;
        /** Delete an assessment */
        delete: operations["AssessmentController_deleteAssessment"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a single assessment grade record */
        post: operations["GradeRecordsController_createAssessmentGradeRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/kpis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get grading KPIs for the school */
        get: operations["GradeRecordsController_getGradingKpis"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/kpis/class/{classId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get grading KPIs for a specific class */
        get: operations["GradeRecordsController_getGradingKpisByClass"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/classes/{classId}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get class grading summary for grading workspace */
        get: operations["GradeRecordsController_getClassGradingSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/classes/{classId}/students-performance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get class students performance for grading workspace */
        get: operations["GradeRecordsController_getClassStudentsPerformance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/classes/{classId}/assessment-overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get class assessment overview for grading workspace */
        get: operations["GradeRecordsController_getClassAssessmentOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/classes/{classId}/generate-summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Generate class summary run for grading workspace */
        post: operations["GradeRecordsController_generateClassSummaryRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/classes/{classId}/generate-summary/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Retry failed students from a generation run */
        post: operations["GradeRecordsController_retryClassSummaryRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/classes/{classId}/generation-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get class generation history */
        get: operations["GradeRecordsController_getClassGenerationHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/students/{studentId}/assessment-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get student assessment history with audit details */
        get: operations["GradeRecordsController_getStudentAssessmentHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/assessments/{assessmentId}/course/{courseId}/publication-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get publication status for an assessment + course
         * @description Returns whether grades have been published for this assessment/course combination, along with KPIs.
         */
        get: operations["GradeRecordsController_getAssessmentPublicationStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/assessments/{assessmentId}/scores": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Save assessment scores in batch for grading workspace (deprecated: use PUT /grading/course/:courseId/assessments/:assessmentId/scores)
         * @deprecated
         */
        post: operations["GradeRecordsController_saveAssessmentScores"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/assessments/{assessmentId}/scores/batch-upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Batch upload scores endpoint (JSON payload) (deprecated: use PUT /grading/course/:courseId/assessments/:assessmentId/scores)
         * @deprecated
         */
        post: operations["GradeRecordsController_batchUploadAssessmentScores"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/grading/batch-upload/capability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get batch upload capability for grading workspace */
        get: operations["GradeRecordsController_getBatchUploadCapability"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an assessment grade record by ID */
        get: operations["GradeRecordsController_getAssessmentGradeRecord"];
        /** Update an assessment grade record */
        put: operations["GradeRecordsController_updateAssessmentGradeRecord"];
        post?: never;
        /** Delete an assessment grade record (soft delete) */
        delete: operations["GradeRecordsController_deleteAssessmentGradeRecord"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get paginated assessment grade records for a course */
        get: operations["GradeRecordsController_getAssessmentGradeRecordsByCourse"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/assessment/{assessmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get paginated assessment grade records for an assessment */
        get: operations["GradeRecordsController_getAssessmentGradeRecordsByAssessment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/class/{classId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get paginated assessment grade records for a class */
        get: operations["GradeRecordsController_getAssessmentGradeRecordsByClass"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/assessment/{assessmentId}/course/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get assessment grade records for a specific assessment and course */
        get: operations["GradeRecordsController_getAssessmentGradeRecordsByAssessmentAndCourse"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/assessment/{assessmentId}/course/{courseId}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish assessment grades for a course (deprecated: use POST /grading/course/:courseId/assessments/:assessmentId/publish)
         * @deprecated
         * @description Publishes grades only after all active students in the class have been graded, then notifies students and parents.
         */
        post: operations["GradeRecordsController_publishAssessmentGrades"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course-grade-record": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a course grade record */
        post: operations["GradeRecordsController_createCourseGradeRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course-grade-record/{courseGradeRecordId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a single course grade record by ID */
        get: operations["GradeRecordsController_getCourseGradeRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course-grade-records/student/{studentId}/course/{courseId}/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get course grade record for a student in a specific course and term */
        get: operations["GradeRecordsController_getCourseGradeRecordByStudentCourseAndTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course-grade-records/course/{courseId}/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get paginated course grade records for a course in a specific term */
        get: operations["GradeRecordsController_getCourseGradeRecordsByCourseAndTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course-grade-records/student/{studentId}/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get paginated course grade records for a student in a term */
        get: operations["GradeRecordsController_getCourseGradeRecordsByStudentAndTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course-grade-record/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a course grade record */
        put: operations["GradeRecordsController_updateCourseGradeRecord"];
        post?: never;
        /** Delete a course grade record (soft delete) */
        delete: operations["GradeRecordsController_deleteCourseGradeRecord"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course-grade-records/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Bulk update course grade records */
        put: operations["GradeRecordsController_bulkUpdateCourseGradeRecords"];
        /** Bulk create course grade records */
        post: operations["GradeRecordsController_bulkCreateCourseGradeRecords"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student-cumulative-term-grade-records/{studentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get paginated cumulative term grade records for a student */
        get: operations["GradeRecordsController_getStudentCumulativeTermGradeRecords"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student-cumulative-term-grade-records/{studentId}/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get student cumulative term grade record for a specific term */
        get: operations["GradeRecordsController_getStudentCumulativeTermGradeRecordByTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student-cumulative-term-grade-records/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a student cumulative term grade record */
        put: operations["GradeRecordsController_updateStudentCumulativeTermGradeRecord"];
        post?: never;
        /** Delete a student cumulative term grade record (soft delete) */
        delete: operations["GradeRecordsController_deleteStudentCumulativeTermGradeRecord"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student-cumulative-term-grade-records/calculate/{studentId}/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Auto-calculate and create student cumulative term grade record
         * @description Calculates totals and position from existing course grade records for the student.
         */
        post: operations["GradeRecordsController_calculateAndCreateStudentCumulativeTermGradeRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/class-cumulative-term-grade-records/{classId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get paginated class cumulative term grade records for a class */
        get: operations["GradeRecordsController_getClassCumulativeTermGradeRecords"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/class-cumulative-term-grade-records/{classId}/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get class cumulative term grade record for a specific term */
        get: operations["GradeRecordsController_getClassCumulativeTermGradeRecordByTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/class-cumulative-term-grade-records/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a class cumulative term grade record */
        put: operations["GradeRecordsController_updateClassCumulativeTermGradeRecord"];
        post?: never;
        /** Delete a class cumulative term grade record (soft delete) */
        delete: operations["GradeRecordsController_deleteClassCumulativeTermGradeRecord"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/class-cumulative-term-grade-records/{classId}/{termId}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish class cumulative term grade record (school office) (deprecated: use POST /grading/term-results/:id/publish)
         * @deprecated
         * @description Marks the class cumulative grade as published and notifies students and parents. School staff only (sub-admins need manage:assessments): teachers submit term results through POST /grading/classes/:classId/term-results instead.
         */
        post: operations["GradeRecordsController_publishClassCumulativeTermGradeRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student/me/courses/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all courses in the authenticated student's class with published result counts
         * @deprecated
         * @description Deprecated: use GET /students/me/subjects?termId= (B3). Same shape; coursePosition is the stored, published position (null until the term results are published).
         */
        get: operations["GradeRecordsController_getMyClassCoursesWithPublishedAssessments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student/me/courses/{courseId}/published-assessments/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get published assessments for one course for the authenticated student
         * @deprecated
         * @description Deprecated: use GET /students/me/subjects/:courseId?termId= (B4). Same shape; a course outside the student's class answers 404.
         */
        get: operations["GradeRecordsController_getMyPublishedAssessmentsForCourse"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student/me/cumulative-grades/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get the authenticated student's cumulative grade record for a specific term
         * @description `null` until the teacher has published the term result (the same answer
         *     as before it is calculated), so no unpublished grade is returned.
         */
        get: operations["GradeRecordsController_getMyCumulativeGradeRecordByTerm"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/results/{studentId}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get student's cumulative result summary for a term
         * @deprecated
         * @description Deprecated: use GET /parents/me/children/:childId/report-card?termId= (B5). Same shape. The term figures appear once the term results are published; remarks are the class teacher's term remark.
         */
        get: operations["ParentResultsController_getResultSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/results/{studentId}/subjects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get student's per-subject results for a term
         * @deprecated
         * @description Deprecated: use GET /parents/me/children/:childId/report-card?termId= (B5). Same shape.
         */
        get: operations["ParentResultsController_getSubjectResults"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/results/{studentId}/live-kpis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get live academic KPIs (avg grade + class position) from current term grades
         * @deprecated
         * @description Deprecated: use GET /parents/me/children/:childId/dashboard (B1). Same shape; classPosition is the stored, published term position.
         */
        get: operations["ParentResultsController_getLiveAcademicKpis"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/results/{studentId}/published-courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get courses with published assessment results (same data the student sees)
         * @deprecated
         * @description Deprecated: use GET /parents/me/children/:childId/report-card?termId= (B5). Same shape.
         */
        get: operations["ParentResultsController_getParentPublishedCourses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/results/{studentId}/published-courses/{courseId}/assessments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get published assessments for one course (same data the student sees)
         * @deprecated
         * @description Deprecated: use GET /parents/me/children/:childId/report-card?termId= (B5). Same shape; a course outside the child's class answers 404.
         */
        get: operations["ParentResultsController_getParentPublishedAssessmentsForCourse"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a user in a school (staff only)
         * @description Omit `password` (recommended): a temporary one is generated and the user is emailed a set-password link.
         */
        post: operations["AuthenticationController_register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Authenticate user and get tokens
         * @description Signs a user in. The refresh token goes in the httpOnly cookie of the app
         *     named in `X-Talim-App` (or the shared cookie without one); with the header,
         *     an account whose role does not belong in that app is refused with 403.
         */
        post: operations["AuthenticationController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/profile/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the authenticated user’s profile */
        get: operations["AuthenticationController_getProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/profile/update": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update the authenticated user’s profile */
        put: operations["AuthenticationController_updateProfile"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresh access token
         * @description Browsers: reads the httpOnly `refreshToken` cookie, rotates it, and returns `{ access_token }` (the new refresh token is set as the cookie; it is never in the body). Native apps: send no cookie and `{ refreshToken }` in the body; the response is `{ access_token, refresh_token }` with the rotated token. When the request carries the cookie the body is ignored. With `X-Talim-App`, the app’s own `refreshToken_<app>` cookie is read and rotated instead, and the session’s account must have a role that belongs in the app (401 otherwise); a shared `refreshToken` cookie from before is used once, only when its role fits, and moved into the app’s cookie.
         */
        post: operations["AuthenticationController_refreshToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Logout user and invalidate tokens
         * @description Revokes the refresh token from the cookie (browsers) or, when there is no cookie, from the optional `{ refreshToken }` body (native apps), then ends the user’s sessions and blacklists the access token. With `X-Talim-App`, only that app’s `refreshToken_<app>` cookie is read and cleared.
         */
        post: operations["AuthenticationController_logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/forgot-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Email a 6-digit password reset code
         * @description Always returns the same message, whether or not the email is registered.
         */
        post: operations["AuthenticationController_forgotPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/verify-reset-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Check a reset code before asking for a new password
         * @description Wrong guesses count towards the per-code attempt limit.
         */
        post: operations["AuthenticationController_verifyResetCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/reset-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Set a new password with an emailed reset code; signs out every session */
        post: operations["AuthenticationController_resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/change-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Change the signed-in user’s password (all roles)
         * @description Also completes the forced change for accounts created with a temporary password. Signs out other sessions and returns a fresh access token; the refresh cookie is replaced. Native apps send `platform` (`ios` or `android`) and also get the replacement `refresh_token` in the body.
         */
        post: operations["AuthenticationController_changePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/verify-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify access token */
        post: operations["AuthenticationController_verifyToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/introspect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Introspect a token and return its user data
         * @description Provide the token in the request body or as a Bearer Authorization header.
         */
        post: operations["AuthenticationController_introspectToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/check-email": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Check if email exists
         * @description Staff only (used before creating accounts). Not public, so it cannot be used to discover which emails have accounts.
         */
        post: operations["AuthenticationController_checkEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/profile/avatar": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update user avatar
         * @description Send JSON `{ "avatarUrl": "<hosted image URL>" }` (what every Talim client does: the image is uploaded to Cloudinary first), or upload an image file (jpg, jpeg, png, gif) as multipart under the `avatar` field. An empty `avatarUrl` removes the photo.
         */
        put: operations["AuthenticationController_updateAvatar"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/create-talim-admin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a system-wide Talim admin (seed use only)
         * @description Creates an ADMIN-role user with no schoolId. Requires the X-Admin-Secret header to match TALIM_ADMIN_SECRET.
         */
        post: operations["AuthenticationController_createTalimAdmin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/admin-login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Talim admin portal login — only role=admin users are granted access
         * @description Signs a Talim platform administrator in (any other role gets 403). The
         *     refresh token goes in the `platform-admin` app's cookie when the request
         *     sends `X-Talim-App: platform-admin`, else in the shared cookie.
         */
        post: operations["AuthenticationController_adminLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/onboarding/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Mark school admin onboarding as complete
         * @description Safe to call multiple times.
         */
        patch: operations["AuthenticationController_completeOnboarding"];
        trace?: never;
    };
    "/auth/activity-logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get activity logs for the authenticated user */
        get: operations["AuthenticationController_getActivityLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/biometric/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Enroll the current device for biometric login
         * @description Call right after a password login. Returns a one-time opaque token the client stores in biometric-gated secure storage.
         */
        post: operations["AuthenticationController_registerBiometric"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/biometric/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Login using a previously enrolled biometric credential
         * @description Signs in with an enrolled biometric credential (native apps). Follows
         *     `X-Talim-App` like `POST /auth/login` if a client sends it.
         */
        post: operations["AuthenticationController_biometricLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/biometric/{deviceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Revoke biometric login for a device */
        delete: operations["AuthenticationController_revokeBiometric"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The caller's sessions (signed-in devices)
         * @description One per active refresh token, the current one first. `current` is decided by the refresh token on the request (the cookie, or `x-refresh-token`); when neither identifies a session, every entry has `current: false`.
         */
        get: operations["AuthSessionsController_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/sessions/revoke-others": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sign out other devices
         * @description Revokes every session of the caller except the current one, together (one transaction). Their next refresh fails with 401; access tokens already issued expire on their own. When the current session cannot be identified, every session is revoked.
         */
        post: operations["AuthSessionsController_revokeOthers"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/sessions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Sign out one session
         * @description Revokes one of the caller's sessions (404 for anyone else's). Its next refresh fails with 401. Revoking the current session also clears the refresh cookie (with `X-Talim-App`, that app's own cookie).
         */
        delete: operations["AuthSessionsController_revoke"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/password-policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The password policy (public)
         * @description The rules every password change and reset enforces, with the contract field names. `historyCount` is 1: a new password must differ from the current one.
         */
        get: operations["AuthSessionsController_passwordPolicy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/teachers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all teachers for the user's school
         * @description The school's teacher accounts, a page at a time, each with its
         *     `teacherProfile` (School Admin's roster fields, batched for the page;
         *     null before the profile is created).
         */
        get: operations["UserController_getTeachers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/teachers/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update teacher active status */
        put: operations["UserController_updateTeacherStatus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/school-admins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all school admins for the user's school */
        get: operations["UserController_getSchoolAdmins"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all students for the user's school */
        get: operations["UserController_getStudents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/parents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all parents for the user's school */
        get: operations["UserController_getParents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search users by query within the user's school */
        get: operations["UserController_searchSchoolData"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/users/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Platform admin: find users across schools
         * @description Active users whose first name, last name or email contains every word of `q` (literal, any case), narrowed by `role` and `schoolId`; by name, at most `limit` (default 20, max 50). Without `q`, the first users of the role or school.
         */
        get: operations["AdminUsersController_search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get teacher profile by user ID */
        get: operations["TeacherController_getTeacherProfile"];
        put?: never;
        /** Create teacher profile */
        post: operations["TeacherController_createTeacherProfile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/{userId}/classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all classes assigned to a teacher */
        get: operations["TeacherController_getClassesByTeacher"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/{userId}/employment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update teacher employment details */
        put: operations["TeacherController_updateEmployment"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/{userId}/availability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update teacher availability */
        patch: operations["TeacherController_updateAvailability"];
        trace?: never;
    };
    "/teachers/{userId}/qualification-details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update teacher academic details */
        patch: operations["TeacherController_updateAcademicDetails"];
        trace?: never;
    };
    "/teachers/{userId}/personal-details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update a teacher's personal details (school admins) */
        patch: operations["TeacherController_updatePersonalDetails"];
        trace?: never;
    };
    "/teachers/{userId}/class-course-assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update teacher class and course assignments */
        patch: operations["TeacherController_updateClassAndCourseAssignments"];
        trace?: never;
    };
    "/teachers/{teacherId}/dashboard/kpis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get dashboard KPIs for a specific teacher (deprecated: use GET /teachers/today)
         * @deprecated
         * @description Returns comprehensive dashboard statistics for a teacher including assigned subjects, added resources, recorded attendance, and other key metrics
         */
        get: operations["TeacherController_getTeacherDashboardKpis"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/{id}/courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get courses assigned to a teacher
         * @description Retrieves all courses assigned to a teacher. The ID can be either the teacher ID or user ID.
         */
        get: operations["TeacherCoursesController_getTeacherCourses"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/{id}/link-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Issue a parent link code for a student
         * @description School admin, or a sub-admin with manage:students. Returns `{ code: "ABCD-2345", expiresAt }`; the code lasts 14 days and is used once. 404 for a student of another school.
         */
        post: operations["StudentController_issueLinkCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a new student
         * @description Answers the student record plus `parentLink: { existing, parentName? }`: `existing` is true when the parent email belonged to a parent account (of any school), which the child was linked to instead of creating a new one.
         */
        post: operations["StudentController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update student active status */
        put: operations["StudentController_updateActiveStatus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/{id}/class": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update student class */
        put: operations["StudentController_updateClass"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get student details by ID */
        get: operations["StudentController_getStudentById"];
        /** Update student details */
        put: operations["StudentController_updateStudent"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/{studentId}/dashboard/kpis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get student dashboard KPI metrics
         * @deprecated
         * @description Deprecated: use GET /students/me/today (B1). A thin wrapper over its glance: gradeScore is the term percent from published scores, classPosition the stored, published term position (0 until published), attendanceRate the term rate.
         */
        get: operations["StudentController_getStudentDashboardKpis"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/by-user/{userId}/dashboard/kpis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get student dashboard KPIs by user ID
         * @deprecated
         * @description Deprecated: use GET /students/me/today (B1). The same figures as GET /students/:studentId/dashboard/kpis.
         */
        get: operations["StudentController_getStudentDashboardKpisByUserId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/by-school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get students by school ID with pagination */
        get: operations["StudentController_getStudentsBySchool"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/by-class/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get students by class ID with pagination */
        get: operations["StudentController_getStudentsByClassId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/by-user/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get students by user ID */
        get: operations["StudentController_getStudentsByUserId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/students/by-parent/{parentId}/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all students by parent ID */
        get: operations["StudentController_getAllStudentsByParent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attendance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark student attendance (deprecated: use PUT /registers/:classId)
         * @deprecated
         */
        post: operations["AttendanceController_markAttendance"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attendance/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get attendance record by ID
         * @description One attendance record, when the caller may read its student (the
         *     AccessPolicy's `canViewStudent`); 404 otherwise.
         */
        get: operations["AttendanceController_getAttendanceById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Correct a recorded attendance mark (deprecated: use PUT /registers/:classId)
         * @deprecated
         * @description Changes the status and/or absence reason of an existing record. Only a teacher of the record’s class may do it, inside their own school; another school’s or an unknown record is 404. The student, class and date cannot be changed.
         */
        patch: operations["AttendanceController_updateAttendance"];
        trace?: never;
    };
    "/attendance/dashboard/{studentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a student's attendance dashboard */
        get: operations["AttendanceController_getStudentAttendanceDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attendance/student/{studentId}/monthly": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get monthly attendance dashboard data for a parent/student view
         * @deprecated
         * @description Deprecated: use GET /students/me/attendance or GET /parents/me/children/:childId/attendance?month=YYYY-MM (B6). Returns monthly summary cards, calendar records, selected-day details, and recent attendance rows; the shape is kept.
         */
        get: operations["AttendanceController_getParentStudentMonthlyAttendance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attendance/class/{classId}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get attendance status for a class (deprecated: use GET /registers/:classId)
         * @deprecated
         * @description Returns which students in a class have had their attendance marked for a specific date, including their status (present, absent, etc.)
         */
        get: operations["AttendanceController_getClassAttendanceStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/attendance/student/{studentId}/kpis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get attendance KPIs for a student
         * @description Returns comprehensive attendance statistics for a student including attendance rate, total days, present days, absent days, etc.
         */
        get: operations["AttendanceController_getStudentAttendanceKpis"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leave-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new leave request */
        post: operations["LeaveRequestController_createLeaveRequest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leave-requests/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get leave request by ID */
        get: operations["LeaveRequestController_getLeaveRequestById"];
        put?: never;
        post?: never;
        /** Delete a leave request */
        delete: operations["LeaveRequestController_deleteLeaveRequest"];
        options?: never;
        head?: never;
        /** Parent updates a pending leave request */
        patch: operations["LeaveRequestController_parentUpdateLeaveRequest"];
        trace?: never;
    };
    "/leave-requests/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update leave request status */
        put: operations["LeaveRequestController_updateLeaveRequestStatus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leave-requests/student/{childId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get leave requests by student */
        get: operations["LeaveRequestController_getLeaveRequestsByChild"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leave-requests/teacher/{teacherId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get leave requests for a teacher */
        get: operations["LeaveRequestController_getLeaveRequestsByTeacher"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leave-requests/school-admin/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all leave requests for school admin with student profiles
         * @description Fetch all leave requests for students in the admin's school with populated student profiles
         */
        get: operations["LeaveRequestController_getLeaveRequestsBySchoolAdmin"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leave-requests/student/{childId}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get leave request summary counts for a student
         * @description Leave request counts for a student the caller may see.
         */
        get: operations["LeaveRequestController_getLeaveRequestSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/leave": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A child's leave requests (B9)
         * @description Newest first. `days` counts the school's weekdays in the span less holidays. `countThisSession` counts the child's requests whose first day falls in the school's current academic year. 404 for a child that is not the parent's.
         */
        get: operations["ParentLeaveController_list"];
        put?: never;
        /**
         * File a leave request for a child (B9)
         * @description Filed under the school's term covering `startDate` (else its current term; 400 when the school has neither). 400 when `endDate` is before `startDate`. The class teacher is notified.
         */
        post: operations["ParentLeaveController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/leave/{leaveId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Withdraw a child's pending leave request (B9)
         * @description Only while pending: a decided request answers 400. Another child's request answers 404.
         */
        delete: operations["ParentLeaveController_remove"];
        options?: never;
        head?: never;
        /**
         * Edit a child's pending leave request (B9)
         * @description Only while pending: a decided request answers 400. Another child's request answers 404.
         */
        patch: operations["ParentLeaveController_update"];
        trace?: never;
    };
    "/parents/me/children/link": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Link a child with a code from the school
         * @description Adds the child to the parent, even from another school. Wrong or expired codes answer 404; a code already used answers 409. The body is the link plus `child`, the card GET /parents/me/children lists.
         */
        post: operations["ParentsController_linkChild"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get children linked to the authenticated parent
         * @description B13, in one batched call: id, name, admissionNumber, class, school { id, name, city }, attendanceRate, average, averageGrade (the letter), gradeLevel, position (stored, published), outstanding, isDefault, relationship and avatarUrl, beside the older fields. `grade` keeps its old meaning, the grade level.
         */
        get: operations["ParentsController_getMyChildren"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/default-child/{childId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Set default child for the authenticated parent */
        patch: operations["ParentsController_setMyDefaultChild"];
        trace?: never;
    };
    "/parents/me/children/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get aggregate overview for authenticated parent children */
        get: operations["ParentsController_getMyChildrenOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/updates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get recent updates across authenticated parent children */
        get: operations["ParentsController_getMyChildrenUpdates"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get detail for a specific linked child
         * @description One linked child's detail. `ChildTenantGuard` has already found and
         *     checked the child in the path; the service reuses that.
         */
        get: operations["ParentsController_getMyChild"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update editable profile fields for a linked child (name, DOB, relationship)
         * @description Updates a linked child's name and date of birth, and the parent's
         *     relationship to them (B13: stored on the link).
         */
        patch: operations["ParentsController_updateMyChildProfile"];
        trace?: never;
    };
    "/parents/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new parent */
        post: operations["ParentsController_createParent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List parents (own school for school staff; all for platform admins)
         * @description School staff receive their own school's parents; platform admins receive all.
         */
        get: operations["ParentsController_getAllParents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/school/{schoolId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get parents by school ID
         * @description Retrieves a paginated list of parents for a specific school
         */
        get: operations["ParentsController_getParentsBySchoolId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/user/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a parent by user ID
         * @description A parent may read their own record; staff may read any in their school.
         */
        get: operations["ParentsController_getParentByUserId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a parent by ID */
        get: operations["ParentsController_getParentById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/update/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a parent */
        put: operations["ParentsController_updateParent"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/delete/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete a parent */
        delete: operations["ParentsController_deleteParent"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/{id}/children": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get children for a parent by parent ID */
        get: operations["ParentsController_getChildrenByParentId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get full settings overview for authenticated parent */
        get: operations["ParentSettingsController_getSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/settings/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update parent profile (fullName, avatar, occupation, address)
         * @description Updates the parent's name, picture, occupation and address (B13).
         */
        patch: operations["ParentSettingsController_updateProfile"];
        trace?: never;
    };
    "/parent/settings/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Change parent account password
         * @description Changes the parent's password, ends their other sessions and replaces the
         *     refresh cookie (the `parents` app's own with `X-Talim-App`).
         */
        patch: operations["ParentSettingsController_changePassword"];
        trace?: never;
    };
    "/parent/settings/phone/send-otp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send OTP to parent email for phone number change */
        post: operations["ParentSettingsController_sendPhoneOtp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/settings/phone/verify-otp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify OTP and update phone number */
        post: operations["ParentSettingsController_verifyPhoneOtp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/settings/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update notification preferences
         * @description Writes the same store as PATCH /notifications/preferences, so a switch changes what the parent receives. Switches share delivery fields where the store has fewer: paymentReminders and feeDueDateReminders both control feesEnabled; academicUpdates controls timetableEnabled and resourcesEnabled. A shared field is on when any switch that maps to it is on.
         */
        patch: operations["ParentSettingsController_updateNotifications"];
        trace?: never;
    };
    "/parent/settings/theme": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update theme preference */
        patch: operations["ParentSettingsController_updateTheme"];
        trace?: never;
    };
    "/parent/settings/payment-method": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Set the preferred payment method
         * @description Saves how the parent prefers to pay (C7); `GET /parent/settings`
         *     returns it as `preferences.preferredProvider`.
         */
        patch: operations["ParentSettingsController_updatePreferredProvider"];
        trace?: never;
    };
    "/parent/settings/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update UI preferences (the guided tour)
         * @description `guides.tourCompleted: true` stamps guides.tourCompletedAt; false clears it.
         */
        patch: operations["ParentSettingsController_updatePreferences"];
        trace?: never;
    };
    "/teacher/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get settings overview for authenticated teacher
         * @description The settings page.
         */
        get: operations["TeacherSettingsController_getSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teacher/settings/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update the teacher's name, phone or picture
         * @description Names are 1..60 characters after trimming; the phone is stored as sent after trimming and must be 7..20 characters of "+", digits, spaces and dashes. Email is read-only (400 when sent). Answers the GET /teacher/settings shape.
         */
        patch: operations["TeacherSettingsController_updateProfile"];
        trace?: never;
    };
    "/teacher/settings/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update teacher message and workspace preferences
         * @description `messages.showOnlineStatus` and `messages.readReceipts` are the chat preferences chat enforces; `messages.soundEnabled` and the rest are the teacher's. Alert switches are in PATCH /notifications/preferences (a `notifications` section answers 400).
         */
        patch: operations["TeacherSettingsController_updatePreferences"];
        trace?: never;
    };
    "/upload/image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload an image file */
        post: operations["FileUploadController_uploadImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload a file (max 200MB) */
        post: operations["FileUploadController_uploadFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/upload/chat-attachment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload a compressed chat attachment
         * @description Accepts image, audio, video, and document files. Images are delivered with automatic format/quality optimization and audio files are prepared for lightweight playback.
         */
        post: operations["FileUploadController_uploadChatAttachment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/device-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register or update FCM device token after login */
        post: operations["MyNotificationsController_registerDeviceToken"];
        /**
         * Deactivate FCM device token on logout
         * @description Deactivates the caller's token for a device, on logout.
         */
        delete: operations["MyNotificationsController_deactivateDeviceToken"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/unread-count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get unread notification count for the authenticated user */
        get: operations["MyNotificationsController_getUnreadCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/counts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Inbox counts: all and unread, in total and per category
         * @description One feed (A10): the caller's notification rows; a school announcement is one row per recipient and counts under `announcement`. Every category is present (B11 adds `payments` and `leave`). `childId` (a parent's linked child, else 404) counts the rows about that child plus the rows that name no child, as `GET /notifications?childId=` lists them.
         */
        get: operations["MyNotificationsController_getCounts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/read-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Mark all notifications and announcements as read
         * @description Marks every row of the caller's feed read. Announcements are rows too (A10), so they are covered. `updated` counts the rows changed.
         */
        patch: operations["MyNotificationsController_markAllRead"];
        trace?: never;
    };
    "/notifications/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get notification preferences for authenticated user */
        get: operations["MyNotificationsController_getPreferences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update notification preferences for authenticated user
         * @description Changes the caller's notification preferences.
         */
        patch: operations["MyNotificationsController_updatePreferences"];
        trace?: never;
    };
    "/admin/broadcasts/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * How many people an audience reaches, by school and role
         * @description The union of (schoolIds × roles) and userIds; `all` is every active user. `roles` without `schoolIds` are those roles in every school; `schoolIds` without `roles` are every role there. Parents count in a school where they have a child. `bySchool` groups by the school on each account (null when none).
         */
        post: operations["AdminBroadcastsController_preview"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/broadcasts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Broadcasts, newest first, with their figures
         * @description Lists broadcasts.
         */
        get: operations["AdminBroadcastsController_list"];
        put?: never;
        /**
         * Send a broadcast now or at a set time
         * @description `status` is `sending` (sent now, in the background) or `scheduled` (`sendAt` in the future, at most a year). Each recipient's switches (`announcementsEnabled`, push, email) and quiet hours decide their push and email; the in-app notification always arrives. 400 when the audience is empty.
         */
        post: operations["AdminBroadcastsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/broadcasts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One broadcast with its figures
         * @description One broadcast.
         */
        get: operations["AdminBroadcastsController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/broadcasts/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel a scheduled broadcast
         * @description 409 `BROADCAST_NOT_SCHEDULED` once it has started.
         */
        post: operations["AdminBroadcastsController_cancel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/web-push/vapid-public-key": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Public VAPID key a browser needs to subscribe
         * @description Public: the browser needs this key before it has a session.
         */
        get: operations["WebPushController_getVapidPublicKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/web-push/subscribe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register a browser for web push */
        post: operations["WebPushController_subscribe"];
        /** Remove one browser push subscription */
        delete: operations["WebPushController_unsubscribe"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/web-push/subscribe/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove every push subscription of this user */
        delete: operations["WebPushController_unsubscribeAll"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/web-push/subscriptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List this user’s push subscriptions */
        get: operations["WebPushController_listSubscriptions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/web-push/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send this user a test push notification */
        post: operations["WebPushController_sendTest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/announcements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new announcement */
        post: operations["AnnoucementController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/reactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add or update a reaction to an announcement */
        post: operations["AnnoucementController_addReaction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/announcements/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an announcement by ID */
        get: operations["AnnoucementController_getAnnouncement"];
        /** Edit an announcement */
        put: operations["AnnoucementController_editAnnouncement"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/announcements/sender/{senderId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get announcements by sender with pagination */
        get: operations["AnnoucementController_getAnnouncementsBySender"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/announcements/sender/{senderId}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get announcement dashboard statistics by sender */
        get: operations["AnnoucementController_getAnnouncementStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/announcements/receiver/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get announcements by receiver with pagination */
        get: operations["AnnoucementController_getAnnouncementsByReceiver"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/announcements/school/{schoolId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get announcements by school with pagination */
        get: operations["AnnoucementController_getAnnouncementsBySchool"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/announcements/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Mark an announcement as read */
        put: operations["AnnoucementController_markAnnouncementAsRead"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send a test notification to a user */
        post: operations["NotificationSystemController_testNotification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Notification pipeline health
         * @description Public so external monitors can probe it without credentials.
         */
        get: operations["NotificationSystemController_getHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/queue/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Queue statistics */
        get: operations["NotificationSystemController_getQueueStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/cache/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Cache statistics */
        get: operations["NotificationSystemController_getCacheStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/providers/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Push/email provider health */
        get: operations["NotificationSystemController_getProvidersHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Delivery metrics for the last 24 hours */
        get: operations["NotificationSystemController_getMetrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/cache/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Round-trip a value through the cache */
        post: operations["NotificationSystemController_testCache"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/user/online": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Force a user’s online flag (diagnostics) */
        post: operations["NotificationSystemController_setUserOnline"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notification-system/health/check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Run the health check now */
        post: operations["NotificationSystemController_performHealthCheck"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List notifications (own, or any recipient for staff)
         * @description `unread=true` keeps only the notifications the recipient has not read; it combines with `category`, `source`, `type` and `childId`. `childId` (B11; a parent's linked child, else 404) keeps the rows whose `metadata.childId` or `metadata.studentId` names that child plus the rows that name no child (school-wide notices). Each item carries `attachmentFiles` and, from Round 4 producers, `metadata.target` and `metadata.actionLabel`.
         */
        get: operations["NotificationController_findAll"];
        put?: never;
        /**
         * Create and send a notification
         * @description Creates a notification and queues it for delivery. School staff always
         *     send as themselves, to their own school.
         */
        post: operations["NotificationController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/stats/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Notification KPI summary (own, or any recipient for staff)
         * @description KPI totals for the caller's notifications (staff: any recipient's, or
         *     broadcasts).
         */
        get: operations["NotificationController_getStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/unread/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Unread notifications for a user (self, or any user for staff)
         * @description A user's unread notifications: the caller's own, or (staff) any user's in
         *     their school.
         */
        get: operations["NotificationController_getUnreadNotifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a notification by ID
         * @description One notification the caller may see.
         */
        get: operations["NotificationController_findOne"];
        /**
         * Update a notification
         * @description Edits a notification of the caller's school. Sender, audience and read
         *     state cannot be changed.
         */
        put: operations["NotificationController_update"];
        post?: never;
        /**
         * Delete a notification
         * @description Deletes a notification of the caller's school.
         */
        delete: operations["NotificationController_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Mark a notification as read for the current user
         * @description The reader is always the authenticated user; a `userId` in the body is ignored.
         */
        put: operations["NotificationController_markAsRead"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/schedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Schedule a notification for later (platform admin)
         * @description Schedule a notification. Platform admin only; the body is validated as a
         *     nested `CreateNotificationDto`, so no other notification field (status,
         *     readBy, schoolId, device tokens, ...) can be injected.
         */
        post: operations["NotificationController_scheduleNotification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/contacts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * People the caller can start a direct message with
         * @description For a teacher: the parents of their students (a parent who turned off teacher messages is left out), the school's other teachers and one `office` entry (open it with POST /chat/office); sorted by group (parent, colleague, office), then name. For a parent with `childId` (or the X-Talim-Child header, B10): that child's class teacher and course teachers, then one `office` entry for the child's school, in the §26 shape plus the older `firstName`/`lastName`/`userAvatar`; a child not linked to the parent answers 404. For a parent naming no child: the teachers of every child's class as before (no office entry). Teacher user ids are ready for POST /chat/rooms. Empty for a student (students message in their class and subject groups only, B10) and for staff, who pick people from their own directories.
         */
        get: operations["ChatController_getContacts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all chat rooms for the authenticated user
         * @description The caller's rooms, after bringing staff office membership up to date.
         */
        get: operations["ChatController_getUserChatRooms"];
        put?: never;
        /**
         * Create a new chat room
         * @description A one_to_one room is refused (403) for a student caller and when the other member is a student: students message in their class and subject groups only (B10). The answer is the stored room (as before) plus the fields of the room view `GET /chat/rooms` shows, such as `subtitle` and `callPhone`.
         */
        post: operations["ChatController_createChatRoom"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a group chat room (class, course, parent, or admin-parent) with automatic and manual participant population
         * @description Creates a group chat room and automatically adds all students (for class/course), all parents (for admin-parent), or parents of a class (for parent group) as participants. Additional participants can be provided in the payload.
         */
        post: operations["ChatController_createGroupChat"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/admin-parent-groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a group chat for admins and parents
         * @description Creates a group chat for school admins and parents; same behaviour as
         *     POST /chat/groups.
         */
        post: operations["ChatController_createAdminParentGroupChat"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update a group chat name, description or picture
         * @description Allowed for the group's admins (its creator is the first), school staff with manage:messages and the platform admin; anyone else gets 403. Direct messages and the school office thread have no editable details (400). The name is 1..80 characters and the description at most 500. Members are told with the room-updated socket event.
         */
        patch: operations["ChatController_updateRoom"];
        trace?: never;
    };
    "/chat/office": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Open the caller's school office thread
         * @description Returns the caller's office room, creating it when needed: one per (school, teacher) and one per (school, parent). A parent's school is the child's: send X-Talim-Child (else the default child is used); a parent with no linked child at that school gets 403. Every school admin and every sub-admin with manage:messages reads and replies; staff see a parent's thread as "Office thread · {parent} (parent of {children's first names})". Membership is refreshed on every read and post. The owner cannot add or remove members or leave it.
         */
        post: operations["ChatController_openOffice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/course-groups/{courseId}/open": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Open a course's subject group
         * @description Returns the course's group, creating it on first use (idempotent: a second call, or two at once, return the same room). It holds the class's active students and the course teacher, who is a group admin; missing students are added on every open, nobody is removed. Allowed for the course teacher, the students of the course's class and school staff with manage:messages (a school admin always). Another school's course answers 404; anyone else of the school gets 403. New members are told with participants-changed.
         */
        post: operations["ChatController_openCourseGroup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}/media": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * A room's shared images, videos, documents and links
         * @description Participants only. Deleted messages are left out. `image`: image attachments; `video`: video attachments (B10; before, they were listed as documents); `document`: document and other file attachments; `link`: URLs found in message text. Newest first; `counts` totals every kind.
         */
        get: operations["ChatController_getRoomMedia"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark a chat read up to a message
         * @description Clears the caller's unread count for the room. When the caller shares read receipts, other members get messages-read.
         */
        post: operations["ChatController_markRoomRead"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search chat rooms
         * @description Searches the caller's rooms by name and type.
         */
        get: operations["ChatController_searchChatRooms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get messages from a chat room with populated participants
         * @description One page of a room's messages, with each sender populated.
         */
        get: operations["ChatController_getChatRoomMessages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}/messages/cursor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get messages from a chat room with cursor-based pagination
         * @description Efficient pagination for infinite scrolling using message IDs as cursors
         */
        get: operations["ChatController_getChatRoomMessagesWithCursor"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send a message to a chat room
         * @description A direct message with a student in it is read-only: sending by or to the student answers 403 (B10). The send-chat-message socket event follows the same rule.
         */
        post: operations["ChatController_sendMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/messages/{messageId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete a message
         * @description Allowed for the message's sender, or whoever may manage the room. Text and attachments are blanked; the message stays in place as "This message was deleted". Members are told with the message-deleted socket event.
         */
        delete: operations["ChatController_deleteMessage"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/messages/{messageId}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Mark a message as read
         * @description Marks one message read (the room up to that message) and tells the
         *     other members when read receipts are shared.
         */
        patch: operations["ChatController_markMessageAsRead"];
        trace?: never;
    };
    "/chat/messages/unread/count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get unread message count for the authenticated user
         * @description The caller's unread total across all rooms.
         */
        get: operations["ChatController_getUnreadMessageCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}/participants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get participants of a chat room
         * @description The user ids of a room's participants.
         */
        get: operations["ChatController_getChatRoomParticipants"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}/participants/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add multiple participants to a chat room
         * @description Add multiple users to an existing chat room in a single operation
         */
        post: operations["ChatController_addMultipleParticipants"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}/participants/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add participant to a chat room
         * @description Adds one user to a group room and announces them when they are new.
         */
        post: operations["ChatController_addParticipant"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/rooms/{roomId}/participants/{userId}/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Remove participant from a chat room
         * @description Removes a user from a group room (or the caller leaves it), detaches
         *     their sockets from the room and announces the change.
         */
        patch: operations["ChatController_removeParticipant"];
        trace?: never;
    };
    "/chat/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get message preferences for the authenticated user
         * @description The caller's chat preferences.
         */
        get: operations["ChatController_getMessagePreferences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update message preferences for the authenticated user
         * @description Changes the caller's chat preferences.
         */
        patch: operations["ChatController_updateMessagePreferences"];
        trace?: never;
    };
    "/classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all classes for the school */
        get: operations["ClassController_findAll"];
        put?: never;
        /** Create a new class */
        post: operations["ClassController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a class by ID with its courses */
        get: operations["ClassController_findOne"];
        /** Update a class */
        put: operations["ClassController_update"];
        post?: never;
        /** Delete a class */
        delete: operations["ClassController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/by-teacher/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get classes assigned to a teacher */
        get: operations["ClassController_findByTeacher"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/teacher/{teacherId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get classes assigned to a teacher */
        get: operations["ClassController_getClassesByTeacher"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/{id}/courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update assigned courses for a class */
        put: operations["ClassController_updateAssignedCourses"];
        /** Add a course to a class */
        post: operations["ClassController_addCourse"];
        /** Remove a course from a class */
        delete: operations["ClassController_removeCourse"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/classes/{id}/assign-teacher": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Assign a teacher to a class */
        put: operations["ClassController_assignTeacher"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schools/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new school and its admin accounts */
        post: operations["SchoolController_createSchool"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schools/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all schools with pagination */
        get: operations["SchoolController_getAllSchools"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schools/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search schools by name, email, or prefix */
        get: operations["SchoolController_searchSchools"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schools/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a school by ID */
        get: operations["SchoolController_getSchoolById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schools/update/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a school */
        put: operations["SchoolController_updateSchool"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schools/delete/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete a school (safe cascade)
         * @description Soft-deletes the school, hard-deletes school admin accounts (freeing their emails), and deactivates all teacher/parent/student accounts. All data is preserved.
         */
        delete: operations["SchoolController_deleteSchool"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/schools/restore/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Restore a soft-deleted school
         * @description Reverses a school soft-deletion. Does not re-create deleted admin accounts.
         */
        patch: operations["SchoolController_restoreSchool"];
        trace?: never;
    };
    "/schools/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update school active status */
        patch: operations["SchoolController_updateSchoolStatus"];
        trace?: never;
    };
    "/schools/{id}/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get school dashboard data with statistics */
        get: operations["SchoolController_getSchoolDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Raise a support ticket to the school or to Talim
         * @description Students and parents choose `school` or `talim`; teachers, school admins and sub-admins raise tickets to `talim` only (400 otherwise); the platform admin raises none (403). A parent may name `childId` (a linked child, else 404); the ticket takes the child's school. `context` (`path`, `appVersion`, `userAgent`) is shown to desk staff only. At most 5 attachments (400 beyond). The desk is told after the commit.
         */
        post: operations["TicketsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/mine": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * My tickets, most recently active first
         * @description `messageCount` counts the messages the requester sees (no internal notes); `unread` the public staff messages since the requester last opened the ticket or wrote on it. A parent's list spans every child (`X-Talim-Child` does not narrow it); each row carries its `childId`.
         */
        get: operations["TicketsController_mine"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/desk/school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The school desk: the school's tickets
         * @description School admin, or sub-admin with `manage:support`. Own school only, plus the tickets the school escalated to Talim (`access: observer`, read only). `assigneeId` takes a user id, `me` or `none`; `q` matches a reference exactly or words of the subject. `unread`: the requester's messages since a desk member last opened or acted on the ticket (0 on observed rows).
         */
        get: operations["TicketsController_schoolDesk"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/desk/school/counts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The school desk's counts by status, in all, unassigned and mine
         * @description The school desk's own tickets (not those it escalated). `unassigned` and `mine` count the active ones (open, in progress, waiting on the user).
         */
        get: operations["TicketsController_schoolCounts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/desk/talim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The Talim desk: tickets raised to Talim or escalated
         * @description Platform admin. `scope=all` also lists school-desk tickets (`access: observer`, read only until escalated); `schoolId` narrows to one school. `unread`: the requester's messages since a Talim admin last opened or acted on the ticket (0 on observed rows; an escalated ticket starts unread).
         */
        get: operations["TicketsController_talimDesk"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/desk/talim/counts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The Talim desk's counts by status, in all, unassigned and mine
         * @description `scope=all` counts school-desk tickets too. `unassigned` and `mine` count the active ones.
         */
        get: operations["TicketsController_talimCounts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/desk/{desk}/staff": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Who a desk can assign tickets to
         * @description `school`: the caller's school admins and sub-admins with `manage:support` (school desk staff only). `talim`: the platform admins (platform admin only). Others get 403.
         */
        get: operations["TicketsController_deskStaff"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One ticket with its messages
         * @description The requester never receives internal notes or `context`; desk staff and observers do. Opening it marks it read for the caller's side (the requester, or its desk; an observer's read marks nothing), so its `unread` is 0; `updatedAt` and `lastActivityAt` do not move.
         */
        get: operations["TicketsController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Desk staff: set a ticket's status, priority or assignee
         * @description Status changes follow the staff transitions (open, in_progress and waiting_on_user go anywhere; resolved goes to open, in_progress or closed; closed is final: 409 `TICKET_CLOSED`; else 409 `INVALID_TRANSITION`). `assigneeId: null` unassigns; an assignee must be staff of the ticket's desk (400 otherwise). Requesters get 403. Answers the ticket as `GET /tickets/:id` does.
         */
        patch: operations["TicketsController_update"];
        trace?: never;
    };
    "/tickets/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reply, or (desk staff) add an internal note
         * @description 409 when the ticket is closed (`TICKET_CLOSED`), holds 500 messages (`MESSAGE_CAP`), asks a status change the transitions do not allow (`INVALID_TRANSITION`), or the caller only observes it (`TICKET_NOT_ESCALATED`, `TICKET_ESCALATED`). A requester's reply to a resolved ticket reopens it within 7 days (to `in_progress` when assigned, else `open`; 409 `REOPEN_WINDOW_PASSED` after). At most 5 attachments (400 beyond). Writing marks the ticket read for the writer's side. The requester is told of every public staff reply and status change.
         */
        post: operations["TicketsController_addMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/{id}/escalate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * School desk: move a ticket to the Talim desk
         * @description Keeps the history; the note is an internal note and the school's assignee is cleared. The school desk keeps read-only access. 409 `TICKET_ALREADY_TALIM` for a Talim ticket.
         */
        post: operations["TicketsController_escalate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/{id}/reopen": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Requester: reopen a resolved ticket within 7 days
         * @description 409 `INVALID_TRANSITION` unless resolved; 409 `REOPEN_WINDOW_PASSED` after 7 days.
         */
        post: operations["TicketsController_reopen"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tickets/{id}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Requester: close my ticket
         * @description Closing a closed ticket changes nothing.
         */
        post: operations["TicketsController_close"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/complaints": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all complaints (deprecated: GET /tickets/desk/talim?scope=all)
         * @deprecated
         */
        get: operations["ComplaintController_findAll"];
        put?: never;
        /**
         * Create a new complaint (deprecated: POST /tickets)
         * @deprecated
         */
        post: operations["ComplaintController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/complaints/by-school": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get complaints by school ID (deprecated: GET /tickets/desk/school)
         * @deprecated
         */
        get: operations["ComplaintController_getComplaintsBySchool"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/complaints/by-user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get complaints by user ID (deprecated: GET /tickets/mine)
         * @deprecated
         */
        get: operations["ComplaintController_getComplaintsByUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/complaints/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a complaint by ID or ticket number (deprecated: GET /tickets/:id)
         * @deprecated
         */
        get: operations["ComplaintController_findOne"];
        /**
         * Update a complaint (deprecated)
         * @deprecated
         */
        put: operations["ComplaintController_update"];
        post?: never;
        /**
         * Delete a complaint (deprecated)
         * @deprecated
         */
        delete: operations["ComplaintController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/complaints/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update complaint status (deprecated: PATCH /tickets/:id)
         * @deprecated
         */
        patch: operations["ComplaintController_updateStatus"];
        trace?: never;
    };
    "/fees/dashboard/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Fee totals for the school dashboard */
        get: operations["FeesController_getDashboardSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/dashboard/categories-summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fee totals per category for the dashboard
         * @description Fee totals per category for the dashboard.
         */
        get: operations["FeesController_getCategoriesSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/receipt-settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read the receipt settings (deprecated: use GET /settings/receipt)
         * @deprecated
         */
        get: operations["FeesController_getReceiptSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update the receipt settings (deprecated: use PATCH /settings/receipt)
         * @deprecated
         * @description Deprecated alias of `PATCH /settings/receipt` (A5). Answers the bare
         *     settings.
         */
        patch: operations["FeesController_updateReceiptSettings"];
        trace?: never;
    };
    "/fees/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List fee categories
         * @description List fee categories.
         */
        get: operations["FeesController_getCategories"];
        put?: never;
        /** Create a fee category */
        post: operations["FeesController_createCategory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/categories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a fee category
         * @description Get a fee category.
         */
        get: operations["FeesController_getCategoryById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update a fee category
         * @description Update a fee category.
         */
        patch: operations["FeesController_updateCategory"];
        trace?: never;
    };
    "/fees/categories/{id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Archive a fee category
         * @description Archive a fee category.
         */
        patch: operations["FeesController_archiveCategory"];
        trace?: never;
    };
    "/fees/categories/{id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Restore an archived fee category
         * @description Restore an archived fee category.
         */
        patch: operations["FeesController_restoreCategory"];
        trace?: never;
    };
    "/fees/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List fee items
         * @description List fee items.
         */
        get: operations["FeesController_getFeeItems"];
        put?: never;
        /** Create a fee item */
        post: operations["FeesController_createFeeItem"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/items/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a fee item
         * @description Get a fee item.
         */
        get: operations["FeesController_getFeeItemById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update a fee item
         * @description Update a fee item.
         */
        patch: operations["FeesController_updateFeeItem"];
        trace?: never;
    };
    "/fees/items/{id}/duplicate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Duplicate a fee item
         * @description Duplicate a fee item.
         */
        post: operations["FeesController_duplicateFeeItem"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/items/{id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Archive a fee item
         * @description Archive a fee item.
         */
        patch: operations["FeesController_archiveFeeItem"];
        trace?: never;
    };
    "/fees/items/{id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Restore an archived fee item
         * @description Restore an archived fee item.
         */
        patch: operations["FeesController_restoreFeeItem"];
        trace?: never;
    };
    "/fees/assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List fee assignments
         * @description List fee assignments.
         */
        get: operations["FeesController_getFeeAssignments"];
        put?: never;
        /** Assign a fee item to one or more classes */
        post: operations["FeesController_assignFeeToClasses"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/assignments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a fee assignment
         * @description Get a fee assignment.
         */
        get: operations["FeesController_getFeeAssignmentById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update a fee assignment
         * @description Update a fee assignment.
         */
        patch: operations["FeesController_updateFeeAssignment"];
        trace?: never;
    };
    "/fees/assignments/{id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Publish a fee assignment to parents
         * @description Publish a fee assignment to parents.
         */
        patch: operations["FeesController_publishFeeAssignment"];
        trace?: never;
    };
    "/fees/assignments/{id}/unpublish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Unpublish a fee assignment
         * @description Unpublish a fee assignment.
         */
        patch: operations["FeesController_unpublishFeeAssignment"];
        trace?: never;
    };
    "/fees/assignments/{id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Archive a fee assignment
         * @description Archive a fee assignment.
         */
        patch: operations["FeesController_archiveFeeAssignment"];
        trace?: never;
    };
    "/fees/assignments/{id}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Restore an archived fee assignment
         * @description Restore an archived fee assignment.
         */
        patch: operations["FeesController_restoreFeeAssignment"];
        trace?: never;
    };
    "/fees/payments/manual": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Record a fee payment made outside the platform (writes the fee ledger and a receipt) */
        post: operations["FeesController_createManualPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The fee ledger: where each child stands on each fee
         * @description The school's fee ledger rows.
         */
        get: operations["FeesController_getPayments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/payments/student/{studentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One child’s fee ledger rows
         * @description One child's fee ledger rows.
         */
        get: operations["FeesController_getStudentPayments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/fees/payments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One fee ledger row
         * @description One fee ledger row.
         */
        get: operations["FeesController_getPaymentById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/school-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read the school profile */
        get: operations["SettingsController_getSchoolProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update the school profile */
        patch: operations["SettingsController_updateSchoolProfile"];
        trace?: never;
    };
    "/settings/receipt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read the receipt settings
         * @description School admins, and sub-admins with manage:settings or manage:fees. PATCH needs manage:settings.
         */
        get: operations["SettingsController_getReceiptSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update the receipt settings
         * @description Changes the receipt settings (`manage:settings`).
         */
        patch: operations["SettingsController_updateReceiptSettings"];
        trace?: never;
    };
    "/settings/finance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read the finance settings
         * @description School admins, and sub-admins with manage:settings or manage:fees. PATCH needs manage:settings.
         */
        get: operations["SettingsController_getFinanceSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update the finance settings
         * @description Changes the finance settings (`manage:settings`).
         */
        patch: operations["SettingsController_updateFinanceSettings"];
        trace?: never;
    };
    "/settings/academic": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read the academic settings (timezone, periods) */
        get: operations["SettingsController_getAcademicSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update the academic settings (timezone, periods)
         * @description Changes the academic settings. `periods`, when sent, replaces the list
         *     and must have unique keys and no overlapping times.
         */
        patch: operations["SettingsController_updateAcademicSettings"];
        trace?: never;
    };
    "/settings/security/change-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Change your own password */
        post: operations["SettingsController_changePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/settings/data/export/{type}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Export this school’s students, staff or fees */
        get: operations["SettingsController_exportData"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/fees": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Fees of every linked child (all schools) in one call, with family totals */
        get: operations["PaymentsController_getFamilyFees"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/due-fees": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fees one of the parent’s children still owes (ledger balances)
         * @description Fees one child still owes (superseded by `parent/fees`).
         */
        get: operations["PaymentsController_getDueFees"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Money owed on every linked child’s fees, paid, pending at checkout or transfer, and receipts
         * @description Family totals: owed, paid, pending checkouts and transfers, receipts.
         */
        get: operations["PaymentsController_getPaymentSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paged payment history of the linked children
         * @description Paged payment history across the family (C6).
         */
        get: operations["PaymentsController_getPaymentHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/receipts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paged receipts of the linked children, by term
         * @description Paged receipts across the family, with school header and lines (C5).
         */
        get: operations["PaymentsController_getReceipts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/receipts/{receiptId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One receipt of a linked child
         * @description One receipt the parent may see.
         */
        get: operations["PaymentsController_getReceiptById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/receipts/{receiptId}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Receipt payload for a client-side PDF; 403 when the school does not allow parent downloads
         * @description One receipt for the client to render as a PDF; 403 when the school does
         *     not allow parent downloads.
         */
        get: operations["PaymentsController_downloadReceipt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/initialize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Start a hosted checkout for selected fees (full or part payment, idempotent by key)
         * @description Starts a hosted checkout (C3).
         */
        post: operations["PaymentsController_initializePayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/verify/{reference}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Confirm a payment after returning from checkout
         * @description Confirms a payment after the checkout (payer or a linked parent only).
         */
        get: operations["PaymentsController_verifyPayment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/bank-details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * The child’s school account for bank transfers
         * @description The school account to transfer to (C4).
         */
        get: operations["PaymentsController_getBankDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/bank-transfer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Report a bank transfer; pending until the bursary confirms it
         * @description Reports a bank transfer; it stays pending until the bursary confirms it.
         */
        post: operations["PaymentsController_submitBankTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/parent/providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Payment providers currently enabled for checkout
         * @description Payment providers enabled for checkout.
         */
        get: operations["PaymentsController_getEnabledProviders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/bank-transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Bank transfers reported by parents (pending, confirmed, rejected) */
        get: operations["PaymentsController_getBankTransfers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/bank-transfers/{transactionId}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Confirm a bank transfer reached the school account
         * @description Confirms a bank transfer: ledger, receipt, then the parent is told.
         */
        post: operations["PaymentsController_confirmBankTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/bank-transfers/{transactionId}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reject a bank transfer that did not arrive
         * @description Rejects a bank transfer with a reason the parent sees.
         */
        post: operations["PaymentsController_rejectBankTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paged transactions for the school
         * @description Paged transactions for the school.
         */
        get: operations["PaymentsController_getAdminTransactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Transaction totals for the school
         * @description Transaction totals for the school.
         */
        get: operations["PaymentsController_getAdminSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Payment providers currently enabled
         * @description Payment providers currently enabled.
         */
        get: operations["PaymentsController_getAdminProviders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/receipts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Paged receipts for the school
         * @description Paged receipts for the school.
         */
        get: operations["PaymentsController_getAdminReceipts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/receipts/{receiptId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * One receipt belonging to the school
         * @description One receipt belonging to the school.
         */
        get: operations["PaymentsController_getAdminReceiptById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/manual-payment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Record a payment received outside the platform
         * @description Record a payment received outside the platform.
         */
        post: operations["PaymentsController_createManualPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/admin/transactions/{transactionId}/refund": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refund a successful payment (full or partial)
         * @description Refund a successful payment (full or partial).
         */
        post: operations["PaymentsController_refundPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/platform/providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** All provider configurations (secrets never returned) */
        get: operations["PaymentsController_getPlatformProviders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/platform/providers/{providerName}/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Create or update a provider configuration
         * @description Create or update a provider configuration.
         */
        patch: operations["PaymentsController_updatePlatformProviderConfig"];
        trace?: never;
    };
    "/payments/platform/providers/{providerName}/enable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Enable a provider for checkout
         * @description Enable a provider for checkout.
         */
        patch: operations["PaymentsController_enableProvider"];
        trace?: never;
    };
    "/payments/platform/providers/{providerName}/disable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Disable a provider for checkout
         * @description Disable a provider for checkout.
         */
        patch: operations["PaymentsController_disableProvider"];
        trace?: never;
    };
    "/payments/webhooks/paystack": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Paystack webhook */
        post: operations["PaymentsController_paystackWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/webhooks/opay": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * OPay webhook
         * @description OPay webhook (public; authenticated by the provider's signature).
         */
        post: operations["PaymentsController_opayWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/webhooks/stripe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Stripe webhook
         * @description Stripe webhook (public; authenticated by the provider's signature).
         */
        post: operations["PaymentsController_stripeWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/wallet/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Wallet balances and this month’s revenue */
        get: operations["FinanceController_getWalletSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/wallet/transactions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paged wallet ledger */
        get: operations["FinanceController_getWalletTransactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/banks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Bank list for a country (Paystack) */
        get: operations["FinanceController_getBanks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/bank-accounts/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Resolve an account name from number and bank code */
        get: operations["FinanceController_resolveAccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/bank-accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The school’s payout bank accounts */
        get: operations["FinanceController_getBankAccounts"];
        put?: never;
        /** Add a payout bank account */
        post: operations["FinanceController_addBankAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/bank-accounts/{id}/default": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Make a verified account the default */
        patch: operations["FinanceController_setDefaultBankAccount"];
        trace?: never;
    };
    "/finance/bank-accounts/{id}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark a bank account verified */
        post: operations["FinanceController_verifyBankAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/bank-accounts/{id}/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Remove a bank account (no pending withdrawals) */
        patch: operations["FinanceController_removeBankAccount"];
        trace?: never;
    };
    "/finance/withdrawals/initiate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Step 1: validate and email a one-time code */
        post: operations["FinanceController_initiateWithdrawal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/withdrawals/resend-otp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Step 2a: resend the code (60 s cooldown) */
        post: operations["FinanceController_resendOtp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/withdrawals/verify-otp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Step 2b: verify the code and get the confirmation summary */
        post: operations["FinanceController_verifyOtp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/withdrawals/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Step 3: create the withdrawal and hold the funds */
        post: operations["FinanceController_confirmWithdrawal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/withdrawals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Paged withdrawals for the school */
        get: operations["FinanceController_getWithdrawals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/withdrawals/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** One withdrawal belonging to the school */
        get: operations["FinanceController_getWithdrawalById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/withdrawals/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Cancel a pending withdrawal (requester only) */
        patch: operations["FinanceController_cancelWithdrawal"];
        trace?: never;
    };
    "/finance/admin/withdrawals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** All withdrawals across schools */
        get: operations["FinanceController_getAdminWithdrawals"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/admin/withdrawals/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Approve a pending withdrawal */
        patch: operations["FinanceController_approveWithdrawal"];
        trace?: never;
    };
    "/finance/admin/withdrawals/{id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Reject a withdrawal and release the hold */
        patch: operations["FinanceController_rejectWithdrawal"];
        trace?: never;
    };
    "/finance/admin/withdrawals/{id}/mark-processing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Mark an approved withdrawal as being paid out */
        patch: operations["FinanceController_markProcessing"];
        trace?: never;
    };
    "/finance/admin/withdrawals/{id}/mark-completed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Record the bank transfer and finalise the withdrawal */
        patch: operations["FinanceController_markCompleted"];
        trace?: never;
    };
    "/finance/admin/withdrawals/{id}/mark-failed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Mark a payout failed and release the hold */
        patch: operations["FinanceController_markFailed"];
        trace?: never;
    };
    "/finance/security/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Two-factor status for the caller */
        get: operations["FinanceController_getSecurityStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/security/2fa/setup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start two-factor enrolment (returns the otpauth secret) */
        post: operations["FinanceController_setup2fa"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/security/2fa/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Confirm a code and enable two-factor */
        post: operations["FinanceController_verify2fa"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/security/2fa/disable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Disable two-factor with a valid code */
        post: operations["FinanceController_disable2fa"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/finance/security/withdrawals/require-2fa": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Require two-factor for withdrawals */
        patch: operations["FinanceController_setRequire2fa"];
        trace?: never;
    };
    "/transit/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get transit overview dashboard for the school */
        get: operations["TransitController_getDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/enrollments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List enrollments for this school with optional filters */
        get: operations["TransitController_listEnrollments"];
        put?: never;
        /** Create an active student enrollment record */
        post: operations["TransitController_createEnrollment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/students/{studentId}/enrollments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get full academic enrollment history for a student */
        get: operations["TransitController_getStudentEnrollmentHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/promotions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List promotion runs for this school */
        get: operations["TransitController_listPromotionRuns"];
        put?: never;
        /** Create and validate a promotion run */
        post: operations["TransitController_createPromotionRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/promotions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a single promotion run */
        get: operations["TransitController_getPromotionRun"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/promotions/{id}/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Re-validate an existing promotion run */
        post: operations["TransitController_validatePromotionRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/promotions/{id}/commit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Commit a validated promotion run */
        post: operations["TransitController_commitPromotionRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/promotions/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel a draft or validated promotion run */
        post: operations["TransitController_cancelPromotionRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List incoming and outgoing transfer requests */
        get: operations["TransitController_listTransfers"];
        put?: never;
        /** Create a student transfer request */
        post: operations["TransitController_createTransferRequest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/transfers/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a single transfer request by ID */
        get: operations["TransitController_getTransfer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/students/{studentId}/snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get live academic snapshot for a student (for transfer preview) */
        get: operations["TransitController_getStudentSnapshot"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/transfers/{id}/source-approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a transfer from the source school */
        post: operations["TransitController_approveTransferFromSource"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/transfers/{id}/target-approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a transfer from the target school (requires source approval first) */
        post: operations["TransitController_approveTransferFromTarget"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/transfers/{id}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Accept and complete a target-approved transfer */
        post: operations["TransitController_acceptTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/transfers/{id}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reject a transfer (target school only) */
        post: operations["TransitController_rejectTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/transfers/{id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel a transfer (source school only) */
        post: operations["TransitController_cancelTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/academic-years/{academicYearId}/pre-close-summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Preview closure stats before confirming year closure */
        get: operations["TransitController_getPreCloseSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/academic-years/{academicYearId}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Close an academic year and create a closure snapshot */
        post: operations["TransitController_closeAcademicYear"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transit/academic-years/{academicYearId}/snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read the closure snapshot for a closed academic year */
        get: operations["TransitController_getClosureSnapshot"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sub-admins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all sub-admins for the school */
        get: operations["SubAdminController_listSubAdmins"];
        put?: never;
        /**
         * Create a new sub-admin user
         * @description Creates a brand-new user account with the school_sub_admin role. A temporary password is generated and returned — share it securely with the new sub-admin.
         */
        post: operations["SubAdminController_createSubAdmin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sub-admins/promote-teacher": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Promote an existing teacher to sub-admin
         * @description Changes the role of an existing teacher to school_sub_admin and assigns the specified permissions. The teacher can then log into the admin portal.
         */
        post: operations["SubAdminController_promoteTeacher"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sub-admins/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a specific sub-admin by userId */
        get: operations["SubAdminController_getSubAdmin"];
        put?: never;
        post?: never;
        /**
         * Hard-delete a sub-admin account
         * @description Permanently removes a sub-admin user. Cannot be undone. For a softer approach, use the demote endpoint instead.
         */
        delete: operations["SubAdminController_removeSubAdmin"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sub-admins/{userId}/permissions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Replace the permission set of a sub-admin
         * @description Sends a full replacement array. To remove all permissions pass an empty array [].
         */
        patch: operations["SubAdminController_updatePermissions"];
        trace?: never;
    };
    "/sub-admins/{userId}/toggle-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Toggle the active status of a sub-admin
         * @description Activates a suspended sub-admin or suspends an active one.
         */
        patch: operations["SubAdminController_toggleStatus"];
        trace?: never;
    };
    "/sub-admins/{userId}/demote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Demote a sub-admin
         * @description If the sub-admin was a promoted teacher, restores their teacher role. If they were created fresh, deactivates the account.
         */
        delete: operations["SubAdminController_demoteSubAdmin"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/support/tickets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send a support ticket to Talim (deprecated: POST /tickets)
         * @deprecated
         * @description Any signed-in user but the platform admin. Raises a Talim-desk ticket (the school never sees it; its subject is the description's first line), visible in `GET /tickets/mine`, and emails it to Talim support (SUPPORT_EMAIL, default support@mytalim.com). A failed email doesn't fail the request.
         */
        post: operations["SupportController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AppVersionDto: {
            /** @example 1.5.0 */
            version: string;
            commit: string | null;
            builtAt: string | null;
        };
        TodayTermDto: {
            id: string;
            name: string;
        };
        SchoolDayDto: {
            /** @enum {string|null} */
            reason: "weekend" | "holiday" | "no_term" | null;
            holidayTitle: string | null;
            /** @description `HH:mm` when school closes early today. */
            endsEarlyAt: string | null;
            isSchoolDay: boolean;
        };
        PeriodDto: {
            key: string;
            label: string;
            /** @description `HH:mm`. */
            startTime: string;
            /** @description `HH:mm`. */
            endTime: string;
            isBreak: boolean;
        };
        LessonCourseDto: {
            id: string;
            code: string;
            title: string;
        };
        LessonSubjectDto: {
            id: string;
            name: string;
        };
        LessonClassDto: {
            id: string;
            name: string;
        };
        LessonTopicDto: {
            /** @description ISO instant the week was marked taught. */
            taughtAt: string | null;
            week: number;
            topic: string;
            objectives: string;
        };
        LessonCancelledDto: {
            reason: string;
        };
        TodayLessonDto: {
            periodKey: string | null;
            course: components["schemas"]["LessonCourseDto"];
            subject: components["schemas"]["LessonSubjectDto"] | null;
            class: components["schemas"]["LessonClassDto"];
            /**
             * @description The class-group chat room of the lesson's class that the teacher is in;
             *     null when there is none.
             */
            classRoomId: string | null;
            room: string | null;
            topic: components["schemas"]["LessonTopicDto"] | null;
            cancelled: components["schemas"]["LessonCancelledDto"] | null;
            /** @enum {string} */
            state: "done" | "now" | "later";
            /** @description Minutes to the end of the lesson in progress; null otherwise. */
            minutesLeft: number | null;
            /** @description Timetable entry id. */
            id: string;
            /** @description `YYYY-MM-DD`. */
            date: string;
            day: string;
            /** @description `HH:mm`. */
            startTime: string;
            /** @description `HH:mm`. */
            endTime: string;
            isClassTeacher: boolean;
            studentCount: number;
        };
        RegisterStatusDto: {
            /** @description ISO instant; null until submitted. */
            submittedAt: string | null;
            classId: string;
            className: string;
            /** @description Whether the caller is this class's class teacher. */
            isClassTeacher: boolean;
            /** @description Active students in the class. */
            studentCount: number;
            /** @description Students with an attendance row for the day. */
            markedCount: number;
            /** @description Students on approved leave covering the day. */
            onLeaveCount: number;
            /**
             * @description True when there is no register document but every student has an
             *     attendance row, on a day before the school's `registerTrackingSince`
             *     (registers taken before submission existed); then `submittedAt` is the
             *     latest row's `createdAt`. From that day on only a submission counts.
             */
            inferred: boolean;
            /** @description ISO instant the register is due (`registerCloseTime` that day). */
            closesAt: string;
            /** @description ISO instant after which a teacher can no longer submit or change it. */
            editableUntil: string;
            /**
             * @description Whether the caller may submit now: the class teacher before
             *     `editableUntil`, staff at any time. Completeness is not considered;
             *     an incomplete submission answers 409.
             */
            canSubmit: boolean;
        };
        AttentionTargetDto: {
            /** @enum {string} */
            page: "attendance" | "grading" | "messages" | "resources" | "subjects" | "leave";
            classId?: string;
            courseId?: string;
            assessmentId?: string;
            roomId?: string;
            week?: number;
            /** @description `YYYY-MM-DD`. */
            date?: string;
        };
        AttentionActionDto: {
            target: components["schemas"]["AttentionTargetDto"];
            label: string;
        };
        AttentionItemDto: {
            /** @enum {string} */
            kind: "register" | "scores_start" | "scores_missing" | "scores_publish" | "reply" | "resource" | "leave_request";
            /** @enum {string} */
            tone: "warning" | "neutral" | "success" | "info" | "accent";
            action: components["schemas"]["AttentionActionDto"];
            /** @description Stable for the same underlying task, e.g. `register:<classId>`. */
            id: string;
            title: string;
            description: string;
        };
        TodayClassRegisterDto: {
            submittedAt: string | null;
        };
        TodayClassDto: {
            /** @enum {string} */
            role: "class_teacher" | "subject_teacher";
            /** @description `Number(classCapacity)`, or null when that is not a number. */
            capacity: number | null;
            /** @description Percent of this term's attendance rows that are Present or Late. */
            attendanceRateTerm: number | null;
            /** @description Null for a class the teacher only teaches a subject in. */
            register: components["schemas"]["TodayClassRegisterDto"] | null;
            id: string;
            name: string;
            studentCount: number;
        };
        TodayEventDto: {
            /** @enum {string} */
            type: "holiday" | "event" | "early_close";
            id: string;
            title: string;
            /** @description `YYYY-MM-DD`. */
            startDate: string;
            /** @description `YYYY-MM-DD`, inclusive. */
            endDate: string;
        };
        SetupStepDto: {
            /** @enum {string} */
            key: "profile" | "register" | "publish" | "resource" | "plan" | "tour";
            label: string;
            done: boolean;
        };
        SetupDto: {
            steps: components["schemas"]["SetupStepDto"][];
            /** @description 0..100. */
            percent: number;
        };
        TodayCountsDto: {
            unreadMessages: number;
            unreadNotifications: number;
            /** @description Class-teacher registers not yet submitted today (0 on a non-school day). */
            pendingRegisters: number;
        };
        TeacherTodayDto: {
            /** @enum {string} */
            greeting: "morning" | "afternoon" | "evening";
            term: components["schemas"]["TodayTermDto"] | null;
            weekNumber: number | null;
            schoolDay: components["schemas"]["SchoolDayDto"];
            periods: components["schemas"]["PeriodDto"][];
            /** @description Today's lessons, by start time. */
            lessons: components["schemas"]["TodayLessonDto"][];
            nowLessonId: string | null;
            nextLessonId: string | null;
            /** @description `HH:mm` of the first lesson that takes place. */
            firstLessonAt: string | null;
            /** @description `HH:mm` the last lesson that takes place ends. */
            lastLessonEndsAt: string | null;
            registers: components["schemas"]["RegisterStatusDto"][];
            attention: components["schemas"]["AttentionItemDto"][];
            classes: components["schemas"]["TodayClassDto"][];
            events: components["schemas"]["TodayEventDto"][];
            setup: components["schemas"]["SetupDto"];
            counts: components["schemas"]["TodayCountsDto"];
            /** @description Today in the school, `YYYY-MM-DD`. */
            date: string;
            /** @description Weekday name. */
            day: string;
            timezone: string;
            /** @description ISO instant. */
            now: string;
        };
        SchoolOfficeHoursDto: {
            /** @example 08:00 */
            start: string;
            /** @example 16:00 */
            end: string;
        };
        SchoolContactDto: {
            phone: string | null;
            email: string | null;
            address: string | null;
            officeHours: components["schemas"]["SchoolOfficeHoursDto"] | null;
            name: string;
        };
        ClassCourseDto: {
            id: string;
            code: string;
            title: string;
        };
        MyClassDto: {
            /** @enum {string} */
            role: "class_teacher" | "subject_teacher";
            /** @description `Number(classCapacity)`, or null when the stored value is not numeric. */
            capacity: number | null;
            /** @description The courses the caller teaches in this class; may be empty. */
            courses: components["schemas"]["ClassCourseDto"][];
            id: string;
            name: string;
            /** @description Active students in the class. */
            studentCount: number;
        };
        RosterClassDto: {
            /**
             * @description `staff` for a school admin or sub-admin.
             * @enum {string}
             */
            role: "class_teacher" | "subject_teacher" | "staff";
            capacity: number | null;
            id: string;
            name: string;
            studentCount: number;
        };
        RosterStatsDto: {
            /**
             * @description (present + late) / (present + late + absent) this term, in percent with
             *     one decimal; Excused and approved leave are left out. Null with no
             *     current term or no marks.
             */
            attendanceRateTerm: number | null;
            /** @description Students marked absent today; null until today's register is submitted. */
            absentToday: number | null;
            /** @description Whether today's register counts as submitted. */
            registerSubmitted: boolean;
        };
        RosterGuardianDto: {
            /** @description The parent's login; start a direct chat with it. Null when unknown. */
            userId: string | null;
            /** @description As stored: `MOTHER`, `FATHER`, `GUARDIAN` or `OTHER`. */
            relationship: string | null;
            phone: string | null;
            email: string | null;
            name: string;
        };
        RosterStudentDto: {
            admissionNumber: string | null;
            email: string | null;
            avatarUrl: string | null;
            /** @description As `stats.attendanceRateTerm`, for this student. */
            attendanceRateTerm: number | null;
            guardian: components["schemas"]["RosterGuardianDto"] | null;
            /** @description Student profile id. */
            id: string;
            name: string;
            firstName: string;
        };
        ClassRosterDto: {
            class: components["schemas"]["RosterClassDto"];
            stats: components["schemas"]["RosterStatsDto"];
            /** @description What the caller teaches in this class (none for staff). */
            courses: components["schemas"]["ClassCourseDto"][];
            /** @description Active students, by name. */
            students: components["schemas"]["RosterStudentDto"][];
        };
        StudentClassDto: {
            id: string;
            name: string;
        };
        StudentRecordStudentDto: {
            admissionNumber: string | null;
            class: components["schemas"]["StudentClassDto"];
            /** @description `YYYY-MM-DD`. */
            dateOfBirth: string | null;
            gender: string | null;
            email: string | null;
            avatarUrl: string | null;
            /** @description Student profile id. */
            id: string;
            name: string;
            firstName: string;
        };
        StudentRecordSchoolDto: {
            name: string;
        };
        StudentRecordGuardianDto: {
            /** @description The parent's login; start a direct chat with it. Null when unknown. */
            userId: string | null;
            /** @description As stored: `MOTHER`, `FATHER`, `GUARDIAN` or `OTHER`. */
            relationship: string | null;
            /** @description Not stored anywhere yet: always null. */
            occupation: string | null;
            email: string | null;
            phone: string | null;
            /** @description Not stored anywhere yet: always null. */
            address: string | null;
            name: string;
        };
        StudentAttendanceDto: {
            /** @description (present + late) / (present + late + absent), percent, one decimal. */
            rate: number | null;
            /**
             * @description School days of the current term up to today: the school's weekdays,
             *     less holidays. 0 with no current term.
             */
            schoolDays: number;
            present: number;
            late: number;
            absent: number;
            /** @description Days marked Excused (approved leave is written as Excused). */
            onLeave: number;
        };
        StudentAssessmentScoreDto: {
            maxScore: number | null;
            score: number | null;
            /** @description Mean of the class's recorded scores, one decimal. */
            classAverage: number | null;
            /**
             * @description `published` once the assessment's scores are published for the course;
             *     `draft` when the student's score is recorded but not published;
             *     `not_entered` when there is no score for the student.
             * @enum {string}
             */
            status: "published" | "draft" | "not_entered";
            id: string;
            name: string;
        };
        StudentPositionDto: {
            rank: number;
            /** @description Students of the class with a complete set of scores for the course. */
            of: number;
        };
        StudentCourseScoresDto: {
            course: components["schemas"]["ClassCourseDto"];
            /** @description The current term's assessments, by start date. */
            assessments: components["schemas"]["StudentAssessmentScoreDto"][];
            /** @description Sum of the recorded scores; null when none is recorded. */
            total: number | null;
            /** @description The grading module's grade for the percentage; only when complete. */
            grade: string | null;
            /** @description Only when complete. */
            position: components["schemas"]["StudentPositionDto"] | null;
            className: string;
            /** @description Every assessment of the term has a score for the student. */
            complete: boolean;
        };
        StudentRecordDto: {
            student: components["schemas"]["StudentRecordStudentDto"];
            school: components["schemas"]["StudentRecordSchoolDto"];
            guardian: components["schemas"]["StudentRecordGuardianDto"] | null;
            attendance: components["schemas"]["StudentAttendanceDto"];
            /** @description Teacher: the courses they teach the student; staff: every course of the student's class. */
            scores: components["schemas"]["StudentCourseScoresDto"][];
        };
        IdNameDto: {
            id: string;
            name: string;
        };
        LearnerTermDto: {
            /** @description The session (academic year), e.g. "2026/2027". */
            session: string | null;
            id: string;
            name: string;
            startDate: string;
            endDate: string;
            totalWeeks: number;
            isCurrent: boolean;
        };
        TodayStudentLessonDto: {
            periodKey: string | null;
            course: components["schemas"]["LessonCourseDto"];
            subject: components["schemas"]["LessonSubjectDto"] | null;
            class: components["schemas"]["LessonClassDto"];
            /** @description The class group chat room the viewer is in; null when none. */
            classRoomId: string | null;
            room: string | null;
            /** @description The course's teacher (user id and name). */
            teacher: components["schemas"]["IdNameDto"] | null;
            topic: components["schemas"]["LessonTopicDto"] | null;
            cancelled: components["schemas"]["LessonCancelledDto"] | null;
            /** @enum {string} */
            state: "done" | "now" | "later";
            minutesLeft: number | null;
            /** @description Timetable entry id. */
            id: string;
            /** @description `YYYY-MM-DD`. */
            date: string;
            day: string;
            /** @description `HH:mm`. */
            startTime: string;
            /** @description `HH:mm`. */
            endTime: string;
            /** @description Short label of the course, e.g. "Maths". */
            courseShort: string;
            /** @description The course's colour key (see `LearnerCourseDto.colourKey`). */
            colourKey: number;
            /** @description Outside the school's bell schedule (no matching period). */
            offSchedule: boolean;
        };
        PositionDto: {
            rank: number;
            of: number;
        };
        GlanceAttendanceDto: {
            /** @description (present + late) / (present + late + absent), percent; null before any mark. */
            rate: number | null;
            /** @description Days at school this term: present + late. */
            present: number;
            /** @description School days of the term so far. */
            schoolDays: number;
        };
        GlanceUnreadDto: {
            /** @description The room with the newest unread message. */
            topRoom: components["schemas"]["IdNameDto"] | null;
            count: number;
        };
        LearnerGlanceDto: {
            /** @description Term percent from published scores (A7). */
            average: number | null;
            grade: string | null;
            /** @description The stored, published term position (A8); null until published. */
            position: components["schemas"]["PositionDto"] | null;
            /** @description Rank change against the previous published term; positive is up. */
            movement: number | null;
            attendance: components["schemas"]["GlanceAttendanceDto"];
            unread: components["schemas"]["GlanceUnreadDto"];
        };
        SubjectTotalDto: {
            percent: number | null;
            classAverage: number | null;
            courseId: string;
            title: string;
            short: string;
            colourKey: number;
        };
        ComingUpDto: {
            /** @enum {string} */
            kind: "assessment" | "event";
            /** @description Assessments are school-wide, so this is null for them today. */
            courseTitle: string | null;
            /**
             * @description The event's type, for `kind: 'event'`.
             * @enum {string}
             */
            eventType?: "holiday" | "event" | "early_close";
            id: string;
            title: string;
            /** @description `YYYY-MM-DD`: the due day of an assessment, the first day of an event. */
            date: string;
            /** @description Days from today (0 for today or an event already under way). */
            daysAway: number;
        };
        NotificationTargetDto: {
            /** @enum {string} */
            page: "attendance" | "grading" | "messages" | "resources" | "subjects" | "leave" | "announcements" | "timetable" | "settings" | "payments" | "results" | "children" | "support";
            classId?: string;
            courseId?: string;
            assessmentId?: string;
            /** @description The term the page should open on (score and results publications). */
            termId?: string;
            roomId?: string;
            /** @description v1.5: the support ticket (`page: 'support'`). */
            ticketId?: string;
            week?: number;
            date?: string;
        };
        FeedItemDto: {
            /** @enum {string} */
            category: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "payments" | "leave" | "support" | "other";
            senderName: string | null;
            /** @description Where the item's button leads (§30 `metadata.target`). */
            target: components["schemas"]["NotificationTargetDto"] | null;
            actionLabel: string | null;
            /** @description The school it came from (parents span several, A11). */
            school?: components["schemas"]["IdNameDto"] | null;
            metadata?: {
                [key: string]: unknown;
            };
            id: string;
            title: string;
            message: string;
            /** @description ISO instant. */
            createdAt: string;
            isRead: boolean;
        };
        LearnerCountsDto: {
            unreadNotifications: number;
            unreadMessages: number;
        };
        LearnerTodayDto: {
            /** @enum {string} */
            greeting: "morning" | "afternoon" | "evening";
            class: components["schemas"]["IdNameDto"];
            term: components["schemas"]["LearnerTermDto"] | null;
            weekNumber: number | null;
            schoolDay: components["schemas"]["SchoolDayDto"];
            periods: components["schemas"]["PeriodDto"][];
            lessons: components["schemas"]["TodayStudentLessonDto"][];
            nowLessonId: string | null;
            nextLessonId: string | null;
            glance: components["schemas"]["LearnerGlanceDto"];
            subjectTotals: components["schemas"]["SubjectTotalDto"][];
            comingUp: components["schemas"]["ComingUpDto"][];
            /** @description The five newest unread notifications ("New since you last signed in"). */
            feed: components["schemas"]["FeedItemDto"][];
            counts: components["schemas"]["LearnerCountsDto"];
            /** @description Today in the school, `YYYY-MM-DD`. */
            date: string;
            day: string;
            /** @description ISO instant. */
            now: string;
            timezone: string;
            passMark: number;
        };
        WeekInfoDto: {
            /** @description Term week (1 contains the term's start day); null outside the term. */
            number: number | null;
            /** @description Monday, `YYYY-MM-DD`. */
            start: string;
            /** @description Sunday, `YYYY-MM-DD`. */
            end: string;
            /** @description Whether this is the week the timetable opens on by default. */
            isCurrent: boolean;
            prevStart: string;
            nextStart: string;
            /** @description Whether the week overlaps the current term. */
            inTerm: boolean;
        };
        HolidayDto: {
            title: string;
        };
        DayEventDto: {
            /** @enum {string} */
            type: "holiday" | "event" | "early_close";
            id: string;
            title: string;
        };
        WeekDayDto: {
            holiday: components["schemas"]["HolidayDto"] | null;
            /** @description `HH:mm` when school closes early that day. */
            endsEarlyAt: string | null;
            events: components["schemas"]["DayEventDto"][];
            /** @description `YYYY-MM-DD`. */
            date: string;
            /** @description Weekday name, e.g. `Monday`. */
            day: string;
            isToday: boolean;
        };
        StudentLessonDto: {
            periodKey: string | null;
            course: components["schemas"]["LessonCourseDto"];
            subject: components["schemas"]["LessonSubjectDto"] | null;
            class: components["schemas"]["LessonClassDto"];
            /** @description The class group chat room the viewer is in; null when none. */
            classRoomId: string | null;
            room: string | null;
            /** @description The course's teacher (user id and name). */
            teacher: components["schemas"]["IdNameDto"] | null;
            topic: components["schemas"]["LessonTopicDto"] | null;
            cancelled: components["schemas"]["LessonCancelledDto"] | null;
            /** @description Timetable entry id. */
            id: string;
            /** @description `YYYY-MM-DD`. */
            date: string;
            day: string;
            /** @description `HH:mm`. */
            startTime: string;
            /** @description `HH:mm`. */
            endTime: string;
            /** @description Short label of the course, e.g. "Maths". */
            courseShort: string;
            /** @description The course's colour key (see `LearnerCourseDto.colourKey`). */
            colourKey: number;
            /** @description Outside the school's bell schedule (no matching period). */
            offSchedule: boolean;
        };
        TimetableSubjectDto: {
            teacher: components["schemas"]["IdNameDto"] | null;
            courseId: string;
            title: string;
            short: string;
            colourKey: number;
        };
        LearnerTimetableDto: {
            term: components["schemas"]["LearnerTermDto"] | null;
            week: components["schemas"]["WeekInfoDto"];
            days: components["schemas"]["WeekDayDto"][];
            periods: components["schemas"]["PeriodDto"][];
            /** @enum {string} */
            periodsSource: "school" | "derived";
            lessons: components["schemas"]["StudentLessonDto"][];
            subjects: components["schemas"]["TimetableSubjectDto"][];
            timezone: string;
            now: string;
            today: string;
        };
        GradeBandDto: {
            remark: string | null;
            letter: string;
            min: number;
        };
        LearnerCourseDto: {
            id: string;
            code: string;
            title: string;
            /** @description Short label, e.g. "Maths". */
            short: string;
            /** @description Stable small integer per course of the class (0..n-1), for its colour. */
            colourKey: number;
        };
        SubjectTopicDto: {
            week: number;
            topic: string;
        };
        LearnerSubjectDto: {
            course: components["schemas"]["LearnerCourseDto"];
            subject: components["schemas"]["IdNameDto"] | null;
            teacher: components["schemas"]["IdNameDto"] | null;
            /** @description The subject group chat; null until it is first opened (B10). */
            roomId: string | null;
            /** @description Σ published scores. */
            total: number | null;
            percent: number | null;
            grade: string | null;
            /** @description The stored, published course position (A8); null until published. */
            position: components["schemas"]["PositionDto"] | null;
            classAverage: number | null;
            currentTopic: components["schemas"]["SubjectTopicDto"] | null;
            /** @description Every assessment of the term has a published score in this course. */
            complete: boolean;
            resourceCount: number;
        };
        LearnerSubjectsDto: {
            term: components["schemas"]["LearnerTermDto"];
            scale: components["schemas"]["GradeBandDto"][];
            subjects: components["schemas"]["LearnerSubjectDto"][];
            passMark: number;
        };
        SubjectAssessmentDto: {
            score: number | null;
            /** @description The class's mean published score on it, in the same units as `score`. */
            classAverage: number | null;
            id: string;
            name: string;
            maxScore: number;
        };
        SchemeWeekViewDto: {
            taughtAt: string | null;
            week: number;
            topic: string;
            objectives: string;
        };
        LearnerSchemeDto: {
            currentWeek: number | null;
            weeks: components["schemas"]["SchemeWeekViewDto"][];
        };
        LegacyCurriculumDto: {
            updatedAt: string | null;
            content: string;
            attachments: string[];
        };
        LearnerFileCourseDto: {
            id: string;
            code: string;
            title: string;
            /** @description Short label, e.g. "Maths". */
            short: string;
            /** @description Stable small integer per course of the class (0..n-1), for its colour. */
            colourKey: number;
        };
        LearnerFileDto: {
            course: components["schemas"]["LearnerFileCourseDto"];
            /** @description Who uploaded it. */
            teacher: components["schemas"]["IdNameDto"] | null;
            /** @enum {string} */
            kind: "pdf" | "slides" | "video" | "doc" | "image" | "other";
            sizeBytes: number | null;
            mimeType: string | null;
            week: number | null;
            termId: string | null;
            /** @description The file to open or download: its first file, else its image. */
            downloadUrl: string | null;
            id: string;
            name: string;
            /** @description ISO instant. */
            createdAt: string;
        };
        LearnerSubjectDetailDto: {
            course: components["schemas"]["LearnerCourseDto"];
            term: components["schemas"]["LearnerTermDto"];
            scale: components["schemas"]["GradeBandDto"][];
            teacher: components["schemas"]["IdNameDto"] | null;
            roomId: string | null;
            assessments: components["schemas"]["SubjectAssessmentDto"][];
            total: number | null;
            percent: number | null;
            grade: string | null;
            position: components["schemas"]["PositionDto"] | null;
            classAverage: number | null;
            scheme: components["schemas"]["LearnerSchemeDto"];
            legacyCurriculum: components["schemas"]["LegacyCurriculumDto"] | null;
            resources: components["schemas"]["LearnerFileDto"][];
            passMark: number;
        };
        ReportSchoolDto: {
            logoUrl: string | null;
            address: string | null;
            phone: string | null;
            email: string | null;
            name: string;
        };
        ReportStudentDto: {
            admissionNumber: string | null;
            class: components["schemas"]["IdNameDto"];
            name: string;
        };
        ReportColumnDto: {
            id: string;
            name: string;
            maxScore: number;
        };
        ReportRowDto: {
            course: components["schemas"]["LearnerCourseDto"];
            teacher: components["schemas"]["IdNameDto"] | null;
            /** @description One per assessment column, in `columns` order; null where the student has no published score. */
            scores: (number | null)[];
            total: number | null;
            percent: number | null;
            grade: string | null;
            position: components["schemas"]["PositionDto"] | null;
            classAverage: number | null;
        };
        ReportOverallDto: {
            percent: number | null;
            grade: string | null;
            position: components["schemas"]["PositionDto"] | null;
            previousPosition: components["schemas"]["PositionDto"] | null;
        };
        ReportHighlightDto: {
            position: components["schemas"]["PositionDto"] | null;
            courseId: string;
            title: string;
            short: string;
            colourKey: number;
            percent: number;
        };
        ReportAttendanceDto: {
            schoolDays: number;
            present: number;
            late: number;
            absent: number;
            /** @description Excused marks (approved leave). */
            excused: number;
        };
        ReportRemarksDto: {
            classTeacher: string | null;
            principal: string | null;
            classTeacherName: string | null;
        };
        ReportCardDto: {
            /** @enum {string} */
            status: "none" | "partial" | "published";
            /** @description When the term results were published (ISO). */
            issuedAt: string | null;
            school: components["schemas"]["ReportSchoolDto"];
            student: components["schemas"]["ReportStudentDto"];
            term: components["schemas"]["LearnerTermDto"];
            session: string | null;
            /** @description The next term's first day, `YYYY-MM-DD`. */
            nextTermStart: string | null;
            columns: components["schemas"]["ReportColumnDto"][];
            rows: components["schemas"]["ReportRowDto"][];
            overall: components["schemas"]["ReportOverallDto"];
            /** @description The subject with the highest percent; null with no scored subject. */
            strongest: components["schemas"]["ReportHighlightDto"] | null;
            /**
             * @description The subject with the lowest percent, never the same as `strongest`:
             *     null with fewer than two scored subjects, or when every scored subject
             *     has the same percent.
             */
            weakest: components["schemas"]["ReportHighlightDto"] | null;
            scale: components["schemas"]["GradeBandDto"][];
            attendance: components["schemas"]["ReportAttendanceDto"];
            remarks: components["schemas"]["ReportRemarksDto"] | null;
            /** @description When a parent acknowledged it (B8). */
            acknowledgedAt: string | null;
            passMark: number;
        };
        ReportTermDto: {
            session: string | null;
            /** @enum {string} */
            status: "none" | "partial" | "published";
            id: string;
            name: string;
            isCurrent: boolean;
            /** @description `YYYY-MM-DD`. */
            startDate: string;
            /** @description `YYYY-MM-DD`. */
            endDate: string;
        };
        AttendanceDayDto: {
            /** @enum {string} */
            status: "present" | "late" | "absent" | "on_leave" | "unmarked" | "holiday" | "weekend";
            /** @description `YYYY-MM-DD`. */
            date: string;
        };
        LearnerAttendanceDto: {
            term: components["schemas"]["LearnerTermDto"] | null;
            class: components["schemas"]["IdNameDto"];
            rate: number | null;
            /**
             * @description `on_track` at 92% or more (or before any mark).
             * @enum {string}
             */
            band: "on_track" | "watch";
            /** @description Each day of `month`, when it is given. */
            days?: components["schemas"]["AttendanceDayDto"][];
            schoolDays: number;
            present: number;
            late: number;
            absent: number;
            /** @description Excused marks (approved leave). */
            onLeave: number;
        };
        LearnerPageMetaDto: {
            total: number;
            page: number;
            limit: number;
            lastPage: number;
        };
        LearnerFilesPageDto: {
            data: components["schemas"]["LearnerFileDto"][];
            meta: components["schemas"]["LearnerPageMetaDto"];
        };
        LearnerGuidesDto: {
            /** @description ISO instant the tour was finished; null until then. */
            tourCompletedAt: string | null;
        };
        LearnerPreferencesDto: {
            guides: components["schemas"]["LearnerGuidesDto"];
        };
        LearnerGuidesInputDto: {
            /** @description True stamps `guides.tourCompletedAt` with now; false clears it. */
            tourCompleted?: boolean;
        };
        UpdateLearnerPreferencesDto: {
            guides?: components["schemas"]["LearnerGuidesInputDto"];
        };
        ParentAttentionTargetDto: {
            /** @enum {string} */
            page: "payments" | "attendance" | "leave" | "results";
            termId?: string;
            /** @description `YYYY-MM-DD`. */
            date?: string;
        };
        ParentAttentionDto: {
            /** @enum {string} */
            kind: "fees" | "attendance" | "leave" | "report";
            target: components["schemas"]["ParentAttentionTargetDto"];
            title: string;
            meta: string;
        };
        ChildFeesDto: {
            /** @description Earliest due day of a fee still owed, `YYYY-MM-DD`. */
            dueDate: string | null;
            outstanding: number;
        };
        ParentDashboardDto: {
            /** @enum {string} */
            greeting: "morning" | "afternoon" | "evening";
            class: components["schemas"]["IdNameDto"];
            term: components["schemas"]["LearnerTermDto"] | null;
            weekNumber: number | null;
            schoolDay: components["schemas"]["SchoolDayDto"];
            periods: components["schemas"]["PeriodDto"][];
            lessons: components["schemas"]["TodayStudentLessonDto"][];
            nowLessonId: string | null;
            nextLessonId: string | null;
            glance: components["schemas"]["LearnerGlanceDto"];
            subjectTotals: components["schemas"]["SubjectTotalDto"][];
            comingUp: components["schemas"]["ComingUpDto"][];
            /** @description The five newest unread notifications ("New since you last signed in"). */
            feed: components["schemas"]["FeedItemDto"][];
            counts: components["schemas"]["LearnerCountsDto"];
            attention: components["schemas"]["ParentAttentionDto"][];
            fees: components["schemas"]["ChildFeesDto"];
            /** @description Today in the school, `YYYY-MM-DD`. */
            date: string;
            day: string;
            /** @description ISO instant. */
            now: string;
            timezone: string;
            passMark: number;
        };
        AcknowledgeReportDto: {
            termId: string;
        };
        AcknowledgedDto: {
            /** @description ISO instant. */
            acknowledgedAt: string;
        };
        CalendarEventDto: {
            termId: string | null;
            /** @enum {string} */
            type: "holiday" | "event" | "early_close";
            /** @description `HH:mm`; only for `early_close`. */
            endsAt: string | null;
            id: string;
            title: string;
            /** @description `YYYY-MM-DD`. */
            startDate: string;
            /** @description `YYYY-MM-DD`, inclusive. */
            endDate: string;
        };
        CreateCalendarEventDto: {
            /** @enum {string} */
            type: "holiday" | "event" | "early_close";
            /**
             * @description First day, `YYYY-MM-DD`.
             * @example 2026-10-01
             */
            startDate: string;
            /**
             * @description Last day (inclusive), `YYYY-MM-DD`; defaults to `startDate`.
             * @example 2026-10-01
             */
            endDate?: string;
            /**
             * @description `HH:mm`; required for `early_close`, ignored otherwise.
             * @example 12:00
             */
            endsAt?: string;
            title: string;
            termId?: string;
        };
        UpdateCalendarEventDto: {
            /** @enum {string} */
            type?: "holiday" | "event" | "early_close";
            /** @example 2026-10-01 */
            startDate?: string;
            /** @example 2026-10-01 */
            endDate?: string;
            /** @example 12:00 */
            endsAt?: string | null;
            /** @description The term the event belongs to; `null` clears it. */
            termId?: string | null;
            title?: string;
        };
        TermSummaryDto: {
            id: string;
            name: string;
            startDate: string;
            endDate: string;
            /** @description Weeks from the week of `startDate` to the week of `endDate` (max 30). */
            totalWeeks: number;
        };
        LessonDto: {
            periodKey: string | null;
            course: components["schemas"]["LessonCourseDto"];
            subject: components["schemas"]["LessonSubjectDto"] | null;
            class: components["schemas"]["LessonClassDto"];
            /**
             * @description The class-group chat room of the lesson's class that the teacher is in;
             *     null when there is none.
             */
            classRoomId: string | null;
            room: string | null;
            topic: components["schemas"]["LessonTopicDto"] | null;
            cancelled: components["schemas"]["LessonCancelledDto"] | null;
            /** @description Timetable entry id. */
            id: string;
            /** @description `YYYY-MM-DD`. */
            date: string;
            day: string;
            /** @description `HH:mm`. */
            startTime: string;
            /** @description `HH:mm`. */
            endTime: string;
            isClassTeacher: boolean;
            studentCount: number;
        };
        TimetableMeDto: {
            term: components["schemas"]["TermSummaryDto"] | null;
            week: components["schemas"]["WeekInfoDto"];
            /** @description School days of the week only. */
            days: components["schemas"]["WeekDayDto"][];
            periods: components["schemas"]["PeriodDto"][];
            /** @enum {string} */
            periodsSource: "school" | "derived";
            /** @description Every timetabled lesson of the teacher that week, one per date. */
            lessons: components["schemas"]["LessonDto"][];
            timezone: string;
            /** @description ISO instant. */
            now: string;
            /** @description Today in the school, `YYYY-MM-DD`. */
            today: string;
        };
        RegisterClassDto: {
            id: string;
            name: string;
        };
        RegisterTermDto: {
            id: string;
            name: string;
            /** @description `YYYY-MM-DD`. */
            startDate: string;
            /** @description `YYYY-MM-DD`. */
            endDate: string;
        };
        RegisterSchoolDayDto: {
            /** @enum {string|null} */
            reason: "weekend" | "holiday" | "no_term" | null;
            holidayTitle: string | null;
            isSchoolDay: boolean;
        };
        RegisterSubmitterDto: {
            id: string;
            name: string;
        };
        RegisterCountsDto: {
            present: number;
            late: number;
            absent: number;
            onLeave: number;
            unmarked: number;
        };
        RegisterLeaveDto: {
            /**
             * @description Name of the student's parent: only parents can ask for leave, and the
             *     request does not record which one did. Null when unknown.
             */
            requestedBy: string | null;
            id: string;
            /** @description The leave request's type, e.g. `Health Issue`. */
            type: string;
        };
        RegisterStudentDto: {
            admissionNumber: string | null;
            avatarUrl: string | null;
            /**
             * @description `on_leave` for approved leave covering the day (and for a stored
             *     Excused row); null while unmarked.
             * @enum {string|null}
             */
            status: "present" | "late" | "absent" | "on_leave" | null;
            absenceReason: string | null;
            note: string | null;
            leave: components["schemas"]["RegisterLeaveDto"] | null;
            /** @description Student profile id. */
            id: string;
            name: string;
            firstName: string;
        };
        RegisterSheetDto: {
            class: components["schemas"]["RegisterClassDto"];
            term: components["schemas"]["RegisterTermDto"] | null;
            schoolDay: components["schemas"]["RegisterSchoolDayDto"];
            submittedAt: string | null;
            submittedBy: components["schemas"]["RegisterSubmitterDto"] | null;
            lastEditedAt: string | null;
            /** @enum {string} */
            access: "edit" | "view";
            /**
             * @description Why `access` is `view`: the most specific reason that applies, in this
             *     order: `not_school_day`, `future`, `past` (never for staff),
             *     `not_class_teacher`, `after_edit_window`. Null when editable.
             * @enum {string|null}
             */
            readOnlyReason: "past" | "future" | "not_class_teacher" | "after_edit_window" | "not_school_day" | null;
            counts: components["schemas"]["RegisterCountsDto"];
            /** @description By name. */
            students: components["schemas"]["RegisterStudentDto"][];
            /** @description `YYYY-MM-DD`. */
            date: string;
            /** @description Today in the school, `YYYY-MM-DD` (to clamp date pickers). */
            today: string;
            isToday: boolean;
            /** @description ISO instant the register is due. */
            closesAt: string;
            /** @description ISO instant after which a teacher can no longer change it. */
            editableUntil: string;
            /** @description As in `GET /registers/status`: a legacy register, before tracking began. */
            inferred: boolean;
        };
        RegisterMarkDto: {
            /** @enum {string} */
            status: "present" | "late" | "absent";
            /** @description Student profile id; must be in the class. */
            studentId: string;
            /**
             * @description Why the student is absent. Left out: an absent student keeps the stored
             *     reason, a present or late one has none.
             */
            absenceReason?: string;
            /** @description A note for the school office. Left out: the stored note is kept. */
            note?: string;
        };
        SaveRegisterDto: {
            /** @description Students on approved leave are ignored if they appear here. */
            marks: components["schemas"]["RegisterMarkDto"][];
            /**
             * @description Also submit the register: every student not on leave must then be
             *     marked (409 with `missing` otherwise).
             */
            submit: boolean;
        };
        RegisterSaveDto: {
            class: components["schemas"]["RegisterClassDto"];
            term: components["schemas"]["RegisterTermDto"] | null;
            schoolDay: components["schemas"]["RegisterSchoolDayDto"];
            submittedAt: string | null;
            submittedBy: components["schemas"]["RegisterSubmitterDto"] | null;
            lastEditedAt: string | null;
            /** @enum {string} */
            access: "edit" | "view";
            /**
             * @description Why `access` is `view`: the most specific reason that applies, in this
             *     order: `not_school_day`, `future`, `past` (never for staff),
             *     `not_class_teacher`, `after_edit_window`. Null when editable.
             * @enum {string|null}
             */
            readOnlyReason: "past" | "future" | "not_class_teacher" | "after_edit_window" | "not_school_day" | null;
            counts: components["schemas"]["RegisterCountsDto"];
            /** @description By name. */
            students: components["schemas"]["RegisterStudentDto"][];
            /** @description `YYYY-MM-DD`. */
            date: string;
            /** @description Today in the school, `YYYY-MM-DD` (to clamp date pickers). */
            today: string;
            isToday: boolean;
            /** @description ISO instant the register is due. */
            closesAt: string;
            /** @description ISO instant after which a teacher can no longer change it. */
            editableUntil: string;
            /** @description As in `GET /registers/status`: a legacy register, before tracking began. */
            inferred: boolean;
            /** @description Parents notified by this call; 0 unless it submitted the register. */
            notified: number;
        };
        RegisterIncompleteDto: {
            /** @description Students with no attendance row and no approved leave for the day. */
            missing: number;
        };
        SubmitRegisterDto: {
            /**
             * @description The school day, `YYYY-MM-DD`; defaults to today in the school.
             * @example 2026-09-28
             */
            date?: string;
        };
        SubjectCardCourseDto: {
            id: string;
            code: string;
            title: string;
        };
        SubjectCardClassDto: {
            id: string;
            name: string;
        };
        SubjectCardCurriculumDto: {
            /** @description ISO. */
            updatedAt: string | null;
            id: string;
        };
        SubjectCardDto: {
            course: components["schemas"]["SubjectCardCourseDto"];
            class: components["schemas"]["SubjectCardClassDto"];
            /** @description Null outside the term. */
            currentWeek: number | null;
            /** @description The old text curriculum for this course and term, if any. */
            legacyCurriculum: components["schemas"]["SubjectCardCurriculumDto"] | null;
            /** @description Active students in the class. */
            studentCount: number;
            /** @description Timetabled lessons a week (entries of every term, or of this term). */
            lessonsPerWeek: number;
            totalWeeks: number;
            /** @description Weeks of the term marked taught. */
            taughtCount: number;
            /** @description Resources of the course filed under the term. */
            resourceCount: number;
        };
        SchemeCourseDto: {
            id: string;
            code: string;
            title: string;
            className: string;
        };
        SchemeTermDto: {
            id: string;
            name: string;
        };
        SchemeWeekDto: {
            /** @description ISO instant the week was marked taught. */
            taughtAt: string | null;
            week: number;
            topic: string;
            objectives: string;
            /** @description Resources of the course filed under this term and week. */
            resourceCount: number;
        };
        SchemeOfWorkDto: {
            course: components["schemas"]["SchemeCourseDto"];
            term: components["schemas"]["SchemeTermDto"];
            /** @description Term week of today; null when today is outside the term. */
            currentWeek: number | null;
            /** @description Weeks 1..totalWeeks, in order. */
            weeks: components["schemas"]["SchemeWeekDto"][];
            totalWeeks: number;
        };
        SchemeWeekInputDto: {
            week: number;
            topic: string;
            objectives: string;
        };
        SaveSchemeWeeksDto: {
            weeks: components["schemas"]["SchemeWeekInputDto"][];
            /** @description Defaults to the current term. */
            termId?: string;
        };
        SaveSchemeWeekDto: {
            /** @description Defaults to the current term. */
            termId?: string;
            topic: string;
            objectives: string;
        };
        MarkSchemeWeekTaughtDto: {
            /** @description Defaults to the current term. */
            termId?: string;
            /** @description True stamps the week taught now; false clears it. */
            taught: boolean;
        };
        SchemeWeekTaughtDto: {
            /** @description ISO instant the week was marked taught; null when cleared. */
            taughtAt: string | null;
            week: number;
        };
        GradingCourseRefDto: {
            id: string;
            code: string;
            title: string;
        };
        GradingClassRefDto: {
            id: string;
            name: string;
        };
        GradingTermRefDto: {
            id: string;
            name: string;
        };
        GradingScaleBandDto: {
            remark: string | null;
            letter: string;
            /** @description Lowest percentage that earns the letter. */
            min: number;
        };
        GradingAssessmentStatsDto: {
            average: number | null;
            highest: number | null;
            lowest: number | null;
            /** @description Share of the students with a score at or above the pass mark. */
            passRate: number | null;
            /** @description Students with a score. */
            entered: number;
            /** @description Active students in the class. */
            total: number;
        };
        GradingSheetAssessmentDto: {
            /** @description The assessment's type (`test`, `exam`, ...) when the school set one. */
            type: string | null;
            /** @description `YYYY-MM-DD`: the assessment's end date. */
            dueDate: string | null;
            /** @enum {string} */
            status: "not_started" | "draft" | "published" | "unlocked";
            /** @description When a score was last saved (ISO). */
            savedAt: string | null;
            /** @description When the scores were last published (ISO). */
            publishedAt: string | null;
            /** @description When the scores were last unlocked for a correction (ISO). */
            unlockedAt: string | null;
            stats: components["schemas"]["GradingAssessmentStatsDto"];
            id: string;
            name: string;
            maxScore: number;
        };
        GradingPositionDto: {
            rank: number;
            /** @description How many were ranked. */
            of: number;
        };
        GradingSheetStudentDto: {
            admissionNumber: string | null;
            /**
             * @description Score per assessment id; null when none is entered.
             * @example {
             *       "66f1c0ffee0000000000abcd": 17.5
             *     }
             */
            scores: {
                [key: string]: number | null;
            };
            /** @description Sum of the entered scores; null when none is entered. */
            total: number | null;
            /** @description `total / totalMax`, in percent. */
            percent: number | null;
            /** @description Only when `complete`. */
            grade: string | null;
            /** @description Only when `complete`, among the students who are complete. */
            position: components["schemas"]["GradingPositionDto"] | null;
            /** @description Student profile id. */
            id: string;
            name: string;
            /** @description Every assessment has a score. */
            complete: boolean;
        };
        GradingSheetDto: {
            course: components["schemas"]["GradingCourseRefDto"];
            class: components["schemas"]["GradingClassRefDto"];
            term: components["schemas"]["GradingTermRefDto"];
            scale: components["schemas"]["GradingScaleBandDto"][];
            /** @description Every assessment of the term, by start date then name. */
            assessments: components["schemas"]["GradingSheetAssessmentDto"][];
            /** @description Active students of the class, by name. */
            students: components["schemas"]["GradingSheetStudentDto"][];
            passMark: number;
            /** @description Sum of the assessments' max scores. */
            totalMax: number;
        };
        GradingScoreInputDto: {
            /**
             * @description 0..the assessment's max score, up to 2 decimals; `null` deletes the score.
             * @example 17.5
             */
            score: number | null;
            /** @description Student profile id. */
            studentId: string;
        };
        SaveGradingScoresDto: {
            /** @description The term of the sheet answered; the assessment's term when left out. */
            termId?: string;
            scores: components["schemas"]["GradingScoreInputDto"][];
        };
        GradingPublishResultDto: {
            /** @description ISO. */
            publishedAt: string;
            /**
             * @description Student ids whose scores this call published: every student on a first
             *     publish; after an unlock, those whose score changed; none when the
             *     scores were already published.
             */
            changed: string[];
            /** @description In-app notifications created for those students and their parents. */
            notified: number;
        };
        UnlockGradingScoresDto: {
            /** @description Why the scores are being corrected. */
            reason?: string;
        };
        GradingUnlockResultDto: {
            /** @enum {string} */
            status: "unlocked";
            /** @description ISO. */
            unlockedAt: string;
        };
        ReadinessAssessmentDto: {
            id: string;
            name: string;
            maxScore: number;
        };
        GradingPersonDto: {
            /** @description Their login (User) id. */
            id: string;
            name: string;
        };
        ReadinessCellDto: {
            /** @enum {string} */
            status: "not_started" | "draft" | "published" | "unlocked";
            /** @description When the last reminder for it was sent (ISO). */
            reminderSentAt: string | null;
            assessmentId: string;
        };
        ReadinessSubjectDto: {
            course: components["schemas"]["GradingCourseRefDto"];
            /** @description The course teacher; `id` is their login. */
            teacher: components["schemas"]["GradingPersonDto"] | null;
            cells: components["schemas"]["ReadinessCellDto"][];
            /** @description Whether the caller teaches the course. */
            isMine: boolean;
        };
        ClassReadinessDto: {
            class: components["schemas"]["GradingClassRefDto"];
            term: components["schemas"]["GradingTermRefDto"];
            assessments: components["schemas"]["ReadinessAssessmentDto"][];
            subjects: components["schemas"]["ReadinessSubjectDto"][];
        };
        SendGradingReminderDto: {
            courseId: string;
            assessmentId: string;
        };
        GradingReminderSentDto: {
            /** @description ISO. */
            sentAt: string;
        };
        BroadsheetBasisDto: {
            /**
             * @description The assessment's max score; null for `total`, whose cells are
             *     percents.
             */
            maxPerSubject: number | null;
            /** @description `total` or the assessment id. */
            key: string;
            /** @description The assessment's name, or "Term total". */
            label: string;
        };
        BroadsheetSubjectDto: {
            courseId: string;
            code: string;
            title: string;
            /** @description Its scores for the basis are published (and not unlocked). */
            published: boolean;
        };
        BroadsheetStudentDto: {
            admissionNumber: string | null;
            /** @description Student profile id. */
            id: string;
            name: string;
        };
        BroadsheetRowDto: {
            student: components["schemas"]["BroadsheetStudentDto"];
            /** @description One per subject, in `subjects` order; null until published. */
            cells: (number | null)[];
            total: number | null;
            /** @description Percent over the published subjects. */
            average: number | null;
            position: components["schemas"]["GradingPositionDto"] | null;
            grade: string | null;
            publishedCount: number;
        };
        BroadsheetWaitingDto: {
            courseId: string;
            title: string;
        };
        BroadsheetDto: {
            class: components["schemas"]["GradingClassRefDto"];
            term: components["schemas"]["GradingTermRefDto"];
            basis: components["schemas"]["BroadsheetBasisDto"];
            /** @description The school's grading scale, highest band first. */
            scale: components["schemas"]["GradingScaleBandDto"][];
            subjects: components["schemas"]["BroadsheetSubjectDto"][];
            rows: components["schemas"]["BroadsheetRowDto"][];
            /** @description The subjects not yet published for the basis. */
            waitingOn: components["schemas"]["BroadsheetWaitingDto"][];
            /** @description The school's pass mark, in percent. */
            passMark: number;
            /** @description Every subject is published for the basis. */
            ready: boolean;
        };
        TermRemarkRowDto: {
            student: components["schemas"]["BroadsheetStudentDto"];
            /** @description From the term-total broadsheet. */
            position: components["schemas"]["GradingPositionDto"] | null;
            average: number | null;
            publishedCount: number;
            subjectCount: number;
            classTeacherRemark: string;
            principalRemark: string;
        };
        TermRemarksDto: {
            rows: components["schemas"]["TermRemarkRowDto"][];
        };
        ClassTeacherRemarkInputDto: {
            studentId: string;
            classTeacherRemark: string;
        };
        SaveClassTeacherRemarksDto: {
            termId?: string;
            remarks: components["schemas"]["ClassTeacherRemarkInputDto"][];
        };
        SubmitTermResultsDto: {
            termId?: string;
            /**
             * @description `total`, or an assessment id.
             * @example total
             */
            basis: string;
        };
        TermResultBasisDto: {
            /** @description `total` or the assessment id. */
            key: string;
            /** @description The assessment's name, or "Term total". */
            label: string;
        };
        TermResultSubmissionDto: {
            class: components["schemas"]["GradingClassRefDto"];
            term: components["schemas"]["GradingTermRefDto"];
            basis: components["schemas"]["TermResultBasisDto"];
            /** @enum {string} */
            status: "submitted" | "returned" | "published";
            submittedBy: components["schemas"]["GradingPersonDto"] | null;
            returnReason: string | null;
            /** @description ISO. */
            returnedAt: string | null;
            returnedBy: components["schemas"]["GradingPersonDto"] | null;
            /** @description ISO. */
            publishedAt: string | null;
            publishedBy: components["schemas"]["GradingPersonDto"] | null;
            id: string;
            /** @description ISO. */
            submittedAt: string;
            /** @description Active students in the class. */
            studentCount: number;
            /** @description Active students without a class-teacher remark. */
            missingRemarks: number;
        };
        TermResultCountsDto: {
            submitted: number;
            returned: number;
            published: number;
        };
        TermResultSubmissionDetailDto: {
            class: components["schemas"]["GradingClassRefDto"];
            term: components["schemas"]["GradingTermRefDto"];
            basis: components["schemas"]["TermResultBasisDto"];
            /** @enum {string} */
            status: "submitted" | "returned" | "published";
            submittedBy: components["schemas"]["GradingPersonDto"] | null;
            returnReason: string | null;
            /** @description ISO. */
            returnedAt: string | null;
            returnedBy: components["schemas"]["GradingPersonDto"] | null;
            /** @description ISO. */
            publishedAt: string | null;
            publishedBy: components["schemas"]["GradingPersonDto"] | null;
            id: string;
            /** @description ISO. */
            submittedAt: string;
            /** @description Active students in the class. */
            studentCount: number;
            /** @description Active students without a class-teacher remark. */
            missingRemarks: number;
            classId: string;
            termId: string;
        };
        ReturnTermResultsDto: {
            /** @description Why the results go back to the class teacher. */
            reason: string;
        };
        PrincipalRemarkInputDto: {
            studentId: string;
            principalRemark: string;
        };
        SavePrincipalRemarksDto: {
            remarks: components["schemas"]["PrincipalRemarkInputDto"][];
        };
        CreateResourceDto: {
            /**
             * @description Name of the resource
             * @example Mathematics Chapter 1 Notes
             */
            name: string;
            /**
             * @description Class ID the resource belongs to
             * @example 60f7b1b3b3f3b3f3b3f3b3f3
             */
            classId: string;
            /**
             * @description Course ID the resource belongs to
             * @example 60f7b1b3b3f3b3f3b3f3b3f4
             */
            courseId: string;
            /**
             * @description Ignored for teachers (the uploader is the caller). School staff may name a teacher of their school (User or Teacher profile id).
             * @example 60f7b1b3b3f3b3f3b3f3b3f5
             */
            uploadedBy?: string;
            /**
             * @description Term ID the resource belongs to
             * @example 60f7b1b3b3f3b3f3b3f3b3f6
             */
            termId: string;
            /**
             * @description Upload date (defaults to current date if not provided)
             * @example 2025-05-27T10:30:00Z
             */
            uploadDate?: string;
            /**
             * @description Image URL or path related to the resource (optional)
             * @example https://cloudinary.com/image/resource-image.jpg
             */
            image?: string;
            /**
             * @description Array of file URLs related to the resource
             * @example [
             *       "https://cloudinary.com/file/resource1.pdf",
             *       "https://cloudinary.com/file/resource2.doc"
             *     ]
             */
            files?: string[];
            /**
             * @description Term week (1..30) of the scheme of work this resource is for
             * @example 3
             */
            week?: number;
            /**
             * @description Who may see it besides teachers and staff: students and their parents (default), or students only
             * @default students_and_parents
             * @enum {string}
             */
            visibility: "students" | "students_and_parents";
            /**
             * @description What sort of file; derived from mimeType, else the file extension, when left out
             * @enum {string}
             */
            kind?: "pdf" | "slides" | "video" | "doc" | "image" | "other";
            /**
             * @description MIME type of the uploaded file
             * @example application/pdf
             */
            mimeType?: string;
            /** @description Size of the file in bytes */
            sizeBytes?: number;
        };
        ResourceViewResultDto: {
            /** @description Whether this was the caller's first view (and so counted). */
            counted: boolean;
            /** @description Unique students and parents who have opened the resource. */
            viewCount: number;
        };
        UpdateResourceDto: {
            name?: string;
            classId?: string;
            courseId?: string;
            termId?: string;
            /**
             * @deprecated
             * @description Ignored: the uploader of a resource never changes.
             */
            uploadedBy?: string;
            uploadDate?: string;
            image?: string;
            files?: string[];
            /**
             * @description Term week (1..30) of the scheme of work this resource is for
             * @example 3
             */
            week?: number;
            /**
             * @description Who may see it besides teachers and staff: students and their parents (default), or students only
             * @default students_and_parents
             * @enum {string}
             */
            visibility: "students" | "students_and_parents";
            /**
             * @description What sort of file; derived from mimeType, else the file extension, when left out
             * @enum {string}
             */
            kind?: "pdf" | "slides" | "video" | "doc" | "image" | "other";
            /**
             * @description MIME type of the uploaded file
             * @example application/pdf
             */
            mimeType?: string;
            /** @description Size of the file in bytes */
            sizeBytes?: number;
        };
        CreateCourseDto: {
            /** @example Algebra 101 */
            title: string;
            /** @example Introduction to algebra */
            description: string;
            /** @example MTH-S11B */
            courseCode: string;
            /**
             * @description Id of a subject in the caller's school
             * @example 507f1f77bcf86cd799439017
             */
            subjectId: string;
            /**
             * @description A Teacher profile id, or the teacher's User id, in the caller's school
             * @example 507f1f77bcf86cd799439011
             */
            teacherId: string;
            /**
             * @description Id of a class in the caller's school
             * @example 507f191e810c19729de860ea
             */
            classId: string;
            /** @deprecated */
            schoolId?: string;
        };
        UpdateCourseDto: {
            /** @example Algebra 101 */
            title?: string;
            /** @example Introduction to algebra */
            description?: string;
            /** @example MTH-S11B */
            courseCode?: string;
            /**
             * @description A Teacher profile id, or the teacher's User id, in the caller's school
             * @example 507f1f77bcf86cd799439011
             */
            teacherId?: string;
            /**
             * @description Id of a class in the caller's school
             * @example 507f191e810c19729de860ea
             */
            classId?: string;
        };
        UpdateSubjectDto: {
            /** @example Mathematics */
            name?: string;
            /** @example MTH */
            code?: string;
            /** @deprecated */
            schoolId?: string;
        };
        Course: Record<string, never>;
        Subject: Record<string, never>;
        CreateSubjectDto: {
            /** @example Mathematics */
            name: string;
            /** @example MTH */
            code: string;
            /** @deprecated */
            schoolId?: Record<string, never>;
        };
        CreateAcademicYearDto: {
            /**
             * @description Academic year in format YYYY-YYYY
             * @example 2025-2026
             */
            year: string;
            /**
             * @description Start date of the academic year
             * @example 2025-09-01
             */
            startDate: string;
            /**
             * @description End date of the academic year
             * @example 2026-06-30
             */
            endDate: string;
            /**
             * @description Whether this is the current academic year
             * @example true
             */
            isCurrent?: boolean;
        };
        UpdateAcademicYearDto: {
            /**
             * @description Academic year in format YYYY-YYYY
             * @example 2025-2026
             */
            year?: string;
            /**
             * @description Start date of the academic year
             * @example 2025-09-01
             */
            startDate?: string;
            /**
             * @description End date of the academic year
             * @example 2026-06-30
             */
            endDate?: string;
            /**
             * @description Whether this is the current academic year
             * @example true
             */
            isCurrent?: boolean;
        };
        CreateTermDto: {
            /**
             * @description Name of the term (e.g., First Term, Second Term)
             * @example First Term
             */
            name: string;
            /**
             * @description Start date of the term in ISO format
             * @example 2025-09-01
             */
            startDate: string;
            /**
             * @description End date of the term in ISO format
             * @example 2025-12-20
             */
            endDate: string;
            /**
             * @description ID of the academic year this term belongs to
             * @example 6791378c4ef5965469896850
             */
            academicYearId: string;
            /**
             * @description Whether this is the current term
             * @example true
             */
            isCurrent?: boolean;
        };
        UpdateTermDto: {
            /**
             * @description Updated name of the term
             * @example First Term
             */
            name?: string;
            /**
             * @description Updated start date of the term in ISO format
             * @example 2025-09-01
             */
            startDate?: string;
            /**
             * @description Updated end date of the term in ISO format
             * @example 2025-12-20
             */
            endDate?: string;
            /**
             * @description Academic year this term belongs to (must be in your school)
             * @example 6791378c4ef5965469896850
             */
            academicYearId?: string;
            /**
             * @description Whether this is the current term
             * @example true
             */
            isCurrent?: boolean;
        };
        SchoolTermDto: {
            /**
             * @description The session (academic year), e.g. "2025/2026"; null when the year is missing.
             * @example 2025/2026
             */
            session: string | null;
            /** @description Same as `id`. */
            _id: string;
            id: string;
            name: string;
            /** @description ISO instant. */
            startDate: string;
            /** @description ISO instant. */
            endDate: string;
            academicYearId: string;
            schoolId: string;
            isCurrent: boolean;
        };
        SchoolTermsResponseDto: {
            terms: components["schemas"]["SchoolTermDto"][];
            message: string;
        };
        CreateTimetableDto: {
            /**
             * @description Id of the class this period belongs to
             * @example 64d3c23f2a45b5c5678fghij
             */
            classId: string;
            /**
             * @description Id of the course taught in this period
             * @example 64d3c23f2a45b5c5678abcde
             */
            courseId: string;
            /** @enum {string} */
            day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
            startTime?: string;
            /** @description Required unless `periodKey` is given. `"08:40"` or legacy `"08:40 AM"`. */
            endTime?: string;
            /** @description Where the lesson is taught, e.g. "Lab 2". */
            room?: string;
            /** @description Key of a school period (see `GET /settings/academic`), e.g. `p1`. */
            periodKey?: string;
            /** @description Term the entry applies to; leave out for every term. */
            termId?: string;
        };
        Timetable: Record<string, never>;
        ClassTimetableEntryDto: {
            _id?: string;
            courseId?: string;
            subjectId?: string;
            /** @description Course title. */
            course?: string;
            room: string | null;
            /** @description Key of the school period the entry sits in, when set. */
            periodKey: string | null;
            /** @description `"<startTime> - <endTime>"`, as stored. */
            time: string;
            /** @description As stored (legacy rows may read `"08:00 AM"`). */
            startTime: string;
            /** @description Legacy misspelling kept for old clients; same as `startTime`. */
            startTIme: string;
            endTime: string;
            /** @description Subject name, or `N/A`. */
            subject: string;
            /** @description Class name, or `N/A`. */
            class: string;
            /** @description The course teacher's name, or `Unassigned teacher`. */
            teacherName: string;
        };
        UpdateTimetableDto: {
            /** @enum {string} */
            day?: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
            startTime?: string;
            endTime?: string;
            room?: string;
            /**
             * @description Key of a school period. When given without `startTime`/`endTime`, the
             *     times are filled in from the period.
             */
            periodKey?: string;
            /** @description Term the entry applies to. */
            termId?: string;
            courseId?: string;
        };
        CurriculumKpiDto: {
            /**
             * @description Total number of subjects in the school
             * @example 12
             */
            totalSubjects: number;
            /**
             * @description Total number of courses in the school
             * @example 45
             */
            totalCourses: number;
            /**
             * @description Total number of active teachers in the school
             * @example 25
             */
            activeTeachers: number;
            /**
             * @description Total number of classes in the school
             * @example 8
             */
            totalClasses: number;
            /**
             * @description Total number of students in the school
             * @example 320
             */
            totalStudents: number;
            /**
             * @description Total number of curriculum items/topics created
             * @example 156
             */
            totalCurriculumItems: number;
            /**
             * @description Average courses per class
             * @example 5.6
             */
            averageCoursesPerClass: number;
            /**
             * @description Subject distribution by class
             * @example [
             *       {
             *         "className": "Grade 1A",
             *         "subjectCount": 6
             *       },
             *       {
             *         "className": "Grade 2B",
             *         "subjectCount": 7
             *       }
             *     ]
             */
            subjectDistribution: string[];
            /**
             * @description Most popular subjects (by number of courses)
             * @example [
             *       {
             *         "subjectName": "Mathematics",
             *         "courseCount": 8
             *       },
             *       {
             *         "subjectName": "English",
             *         "courseCount": 6
             *       }
             *     ]
             */
            popularSubjects: string[];
            /**
             * @description Teacher distribution by subjects taught
             * @example [
             *       {
             *         "teacherName": "John Smith",
             *         "subjectsCount": 3
             *       },
             *       {
             *         "teacherName": "Jane Doe",
             *         "subjectsCount": 2
             *       }
             *     ]
             */
            teacherDistribution: string[];
        };
        CreateCurriculumDto: {
            /**
             * @description The course ID for this curriculum
             * @example 64aef4d2c7d2b7a91d12eabc
             */
            course: string;
            /**
             * @description The term ID for this curriculum
             * @example 64aef4d2c7d2b7a91d12efgh
             */
            term: string;
            /**
             * @description The content of the curriculum
             * @example Introduction to Mathematics - Basic algebra and arithmetic operations
             */
            content: string;
            /**
             * @description Array of attachment URLs
             * @example [
             *       "https://example.com/curriculum-guide.pdf",
             *       "https://example.com/exercises.docx"
             *     ]
             */
            attachments?: string[];
            /**
             * @description The teacher ID responsible for this curriculum
             * @example 64aef4d2c7d2b7a91d12ijkl
             */
            teacherId: string;
        };
        GetCurriculumByCourseAndTermDto: {
            /** @description Course ID */
            courseId: string;
            /** @description Term ID */
            termId: string;
        };
        UpdateCurriculumDto: {
            /**
             * @description The course ID for this curriculum
             * @example 64aef4d2c7d2b7a91d12eabc
             */
            course?: string;
            /**
             * @description The term ID for this curriculum
             * @example 64aef4d2c7d2b7a91d12efgh
             */
            term?: string;
            /**
             * @description The content of the curriculum
             * @example Updated curriculum content
             */
            content?: string;
            /**
             * @description Array of attachment URLs
             * @example [
             *       "https://example.com/updated-guide.pdf"
             *     ]
             */
            attachments?: string[];
            /**
             * @description The teacher ID responsible for this curriculum
             * @example 64aef4d2c7d2b7a91d12ijkl
             */
            teacherId?: string;
        };
        CreateAssessmentDto: {
            /**
             * @description Name of the assessment
             * @example First Term Examination 2025
             */
            name: string;
            /**
             * @description Description of the assessment
             * @example Comprehensive examination covering all subjects for the first term
             */
            description?: string;
            /**
             * @description Term ID for this assessment
             * @example 6791378c4ef5965469896850
             */
            termId: string;
            /**
             * @description Assessment start date
             * @example 2025-03-01T00:00:00Z
             */
            startDate: string;
            /**
             * @description Assessment end date
             * @example 2025-03-15T23:59:59Z
             */
            endDate: string;
            /**
             * @description Assessment status
             * @example pending
             * @enum {string}
             */
            status?: "pending" | "active" | "completed" | "cancelled";
            /**
             * @description The most a student can score: a whole number, 1..1000. Every score recorded for the assessment is out of it.
             * @example 20
             */
            maxScore: number;
        };
        UpdateAssessmentDto: {
            /**
             * @description Name of the assessment
             * @example First Term Examination 2025 - Updated
             */
            name?: string;
            /** @description Description of the assessment */
            description?: string;
            /** @description Assessment start date */
            startDate?: string;
            /** @description Assessment end date */
            endDate?: string;
            /**
             * @description Assessment status
             * @enum {string}
             */
            status?: "pending" | "active" | "completed" | "cancelled";
            /**
             * @description The most a student can score: a whole number, 1..1000. 409 once any course has published scores for the assessment, or when a recorded score is above the new value.
             * @example 20
             */
            maxScore?: number;
        };
        CreateAssessmentGradeRecordDto: {
            /** @description Course ID */
            courseId: string;
            /** @description Student ID */
            studentId: string;
            /** @description Assessment ID */
            assessmentId: string;
            /** @description Actual score obtained by student */
            actualScore: number;
            /**
             * @deprecated
             * @description Deprecated: the assessment's max score is used. When sent it must equal it, otherwise 400.
             */
            maxScore?: number;
            /** @description Class ID (resolved automatically from course if not provided) */
            classId?: string;
        };
        ResponseMessageDto: {
            /** @description Response message */
            message: string;
        };
        GradingKpiDto: {
            /** @description Total number of assessments */
            totalAssessments: number;
            /** @description Total number of students graded */
            studentsGraded: number;
            /** @description Average score percentage (0–100) */
            averageScore: number;
            /** @description Number of assessments with no grades yet */
            pendingReviews: number;
        };
        GenerateClassSummaryDto: {
            termId: string;
            academicYearId?: string;
        };
        RetryClassSummaryDto: {
            runId: string;
            studentIds: string[];
        };
        AssessmentScoreDto: {
            studentId: string;
            score: number;
            /**
             * @deprecated
             * @description Deprecated: the assessment's max score is used. When sent it must equal it, otherwise 400.
             */
            maxScore?: number;
        };
        SaveAssessmentScoresDto: {
            courseId: string;
            /** @description Ignored; the course's class is used */
            classId?: string;
            scores: components["schemas"]["AssessmentScoreDto"][];
        };
        AssessmentGradeRecord: Record<string, never>;
        UpdateAssessmentGradeRecordDto: {
            /** @description Actual score obtained by student */
            actualScore?: number;
            /**
             * @deprecated
             * @description Deprecated: the assessment's max score is used. When sent it must equal it, otherwise 400.
             */
            maxScore?: number;
            /** @description Active status */
            isActive?: boolean;
        };
        CreateCourseGradeRecordDto: {
            /** @description Course ID */
            courseId: string;
            /** @description Student ID */
            studentId: string;
            /** @description Term ID (defaults to current term) */
            termId?: string;
            /** @description Array of Assessment Grade Record IDs */
            assessmentGradeRecords: string[];
            /**
             * @description Grade level (auto-calculated if not provided)
             * @enum {string}
             */
            gradeLevel?: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E" | "F";
            /** @description Cumulative score */
            cumulativeScore: number;
            /** @description Maximum possible score */
            maxScore: number;
            /** @description Percentage score */
            percentage: number;
        };
        CourseGradeRecord: Record<string, never>;
        UpdateCourseGradeRecordDto: {
            /** @description Array of Assessment Grade Record IDs */
            assessmentGradeRecords?: string[];
            /**
             * @description Grade level
             * @enum {string}
             */
            gradeLevel?: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E" | "F";
            /** @description Cumulative score */
            cumulativeScore?: number;
            /** @description Maximum possible score */
            maxScore?: number;
            /** @description Percentage score */
            percentage?: number;
            /** @description Active status */
            isActive?: boolean;
        };
        BulkCourseGradeDto: {
            /** @description Course ID */
            courseId: string;
            /** @description Student ID */
            studentId: string;
            /** @description Term ID (defaults to current term) */
            termId?: string;
            /** @description Array of Assessment Grade Record IDs */
            assessmentGradeRecords: string[];
            /**
             * @description Grade level (auto-calculated if not provided)
             * @enum {string}
             */
            gradeLevel?: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E" | "F";
            /** @description Cumulative score */
            cumulativeScore: number;
            /** @description Maximum possible score */
            maxScore: number;
            /** @description Percentage score */
            percentage: number;
            /** @description Class ID */
            classId: string;
        };
        BulkCreateCourseGradeRecordDto: {
            /** @description Array of course grades to create */
            grades: components["schemas"]["BulkCourseGradeDto"][];
        };
        BulkUpdateCourseGradeDto: {
            /** @description Course grade record ID */
            id: string;
            /** @description Array of Assessment Grade Record IDs */
            assessmentGradeRecords?: string[];
            /**
             * @description Grade level
             * @enum {string}
             */
            gradeLevel?: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E" | "F";
            /** @description Cumulative score */
            cumulativeScore?: number;
            /** @description Maximum possible score */
            maxScore?: number;
            /** @description Percentage score */
            percentage?: number;
        };
        BulkUpdateCourseGradeRecordDto: {
            /** @description Array of course grades to update */
            grades: components["schemas"]["BulkUpdateCourseGradeDto"][];
        };
        StudentCumulativeTermGradeRecord: Record<string, never>;
        UpdateStudentCumulativeTermGradeRecordDto: {
            /** @description Array of Course Grade Record IDs */
            courseGradeRecords?: string[];
            /** @description Total score */
            totalScore?: number;
            /** @description Percentage score */
            percentage?: number;
            /**
             * @description Overall grade
             * @enum {string}
             */
            grade?: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E" | "F";
            /** @description Additional remarks */
            remarks?: string;
            /** @description Position in class */
            position?: number;
            /** @description Active status */
            isActive?: boolean;
        };
        ClassCumulativeTermGradeRecord: Record<string, never>;
        UpdateClassCumulativeTermGradeRecordDto: {
            /** @description Array of Student Cumulative Term Grade Record IDs */
            studentCumulativeTermGradeRecords?: string[];
            /** @description Class average percentage */
            classAverage?: number;
            /** @description Total number of students */
            totalStudents?: number;
            /** @description Active status */
            isActive?: boolean;
        };
        RegisterUserDto: {
            /** @example teacher@school.edu */
            email: string;
            /** @description Optional. Omit to have a temporary password generated and a set-password email sent. */
            password?: string;
            /** @enum {string} */
            role: "student" | "teacher" | "admin" | "parent" | "school_admin" | "school_sub_admin";
            /** @description School the account belongs to. Must be the caller’s school unless the caller is a platform admin. */
            schoolId: string;
            firstName: string;
            lastName: string;
            /** @example +2348012345678 */
            phoneNumber?: string;
            /** Format: date */
            dateOfBirth?: string;
            /** @enum {string} */
            gender?: "male" | "female" | "other";
        };
        AccessTokenResponseDto: {
            /** @description Send as `Authorization: Bearer <access_token>`. */
            access_token: string;
            /**
             * @description Native apps only: the refresh token to keep in secure storage and post to
             *     `/auth/refresh`. Each refresh rotates it, so store the new one every time.
             *     Never present for browser clients.
             */
            refresh_token?: string;
        };
        User: Record<string, never>;
        UpdateProfileDto: {
            /** @example Amaka */
            firstName?: string;
            /** @example Okafor */
            lastName?: string;
            /** @example +2348012345678 */
            phoneNumber?: string;
            /** @example 1990-04-12 */
            dateOfBirth?: string;
            /** @enum {string} */
            gender?: "male" | "female" | "other";
            /**
             * @description Hosted avatar URL; an empty string removes it
             * @example https://res.cloudinary.com/talim/image/upload/avatar.png
             */
            userAvatar?: string;
        };
        RefreshTokenDto: {
            /** @description Native apps only: the `refresh_token` from the last login or refresh response. Ignored when the request carries the refresh cookie. */
            refreshToken?: string;
        };
        ForgotPasswordDto: {
            /** @example admin@school.edu */
            email: string;
        };
        VerifyResetCodeDto: {
            /** @example admin@school.edu */
            email: string;
            /**
             * @description The 6-digit code from the reset email
             * @example 482913
             */
            token: string;
        };
        ResetPasswordDto: {
            /** @example admin@school.edu */
            email: string;
            /**
             * @description The 6-digit code from the reset email
             * @example 482913
             */
            token: string;
            /**
             * @description At least 8 characters with upper- and lower-case letters, a number and a symbol
             * @example N3w-Passw0rd!
             */
            newPassword: string;
        };
        ChangePasswordDto: {
            /** @description The current (or temporary) password */
            currentPassword: string;
            /** @description At least 8 characters with upper- and lower-case letters, a number and a symbol */
            newPassword: string;
            /** @description Must match newPassword */
            confirmPassword: string;
            /**
             * @description Native apps send `ios` or `android` to receive the replacement `refresh_token` in the response body (every session is revoked by a password change). Browsers omit it and keep the refresh cookie.
             * @example ios
             */
            platform?: string;
        };
        IntrospectUserDto: {
            /** @enum {string} */
            role: "admin" | "school_admin" | "school_sub_admin" | "teacher" | "student" | "parent";
            userId: string;
            email: string;
            firstName: string;
            lastName: string;
            schoolId: string | null;
            schoolName: string | null;
            schoolLogo: string | null;
            phoneNumber: string | null;
            userAvatar: string | null;
            isActive: boolean;
            isEmailVerified: boolean;
            /** @description Students: their Student record id; null for other roles. */
            studentId?: string | null;
            /** @description Students: their admission number. */
            admissionNumber?: string | null;
            /** @description Students: their class. */
            classId?: string | null;
            /** @description Students: their class's name. */
            className?: string | null;
            /** @description Students only: the date of birth on their account (`YYYY-MM-DD`), null when not recorded. */
            dateOfBirth?: string | null;
            /** @description The school's current term, null when it has none. */
            termId: string | null;
            onboardingCompleted: boolean;
            permissions: string[];
            isSubAdmin: boolean;
            mustChangePassword: boolean;
        };
        IntrospectResponseDto: {
            active: boolean;
            /** @description Expiry (seconds since the epoch), when active. */
            exp?: number;
            /** @description Issued at (seconds since the epoch), when active. */
            iat?: number;
            /** @description The account, when active. */
            user?: components["schemas"]["IntrospectUserDto"];
        };
        UpdateAvatarDto: {
            /** @description Hosted image URL, or an empty string to remove the avatar */
            avatarUrl?: string;
        };
        SessionDto: {
            /** @example iPhone */
            device: string | null;
            /** @example Chrome 128 */
            browser: string | null;
            /** @example iOS */
            os: string | null;
            ip: string | null;
            id: string;
            /** Format: date-time */
            lastUsedAt: string;
            /** Format: date-time */
            createdAt: string;
            /** @description The session of this request's refresh token. */
            current: boolean;
        };
        RevokeOthersDto: {
            revoked: number;
        };
        RevokeSessionDto: {
            id: string;
            revoked: boolean;
            /** @description True when it was this request's own session (its cookie is cleared). */
            current: boolean;
        };
        PasswordPolicyDto: {
            minLength: number;
            requireUppercase: boolean;
            requireLowercase: boolean;
            requireNumber: boolean;
            requireSymbol: boolean;
            /** @description Recent passwords a new one may not repeat (1: the current one). */
            historyCount: number;
            maxLength: number;
            /** @description The characters that count as a symbol. */
            symbols: string;
        };
        TeacherClassDto: {
            _id: string;
            name: string;
            classDescription?: string;
            classCapacity?: string;
            studentCount: number;
        };
        TeacherCourseSlotDto: {
            day: string;
            startTime: string;
            endTime: string;
            /** @description `"<start> - <end>"`. */
            time: string;
            classId: string;
        };
        TeacherCourseDto: {
            /** @description The course's class: populated (`{ _id, name, ... }`) on the profile, an id on the roster. */
            classId?: string | {
                [key: string]: unknown;
            };
            /** @description Profile only: the course's periods. */
            timetable?: components["schemas"]["TeacherCourseSlotDto"][];
            _id: string;
            courseCode?: string;
            title?: string;
            description?: string;
        };
        TeacherClassRefDto: {
            id: string;
            name: string;
        };
        TeacherRosterProfileDto: {
            staffNumber: string | null;
            classTeacherClasses: components["schemas"]["TeacherClassDto"][];
            assignedCourses: components["schemas"]["TeacherCourseDto"][];
            classTeacherOf: components["schemas"]["TeacherClassRefDto"][];
            hasTeacherProfile: boolean;
            isFormTeacher: boolean;
        };
        TeacherRosterRowDto: {
            userAvatar?: string | null;
            /** @description Null until the teacher's profile is created. */
            teacherProfile: components["schemas"]["TeacherRosterProfileDto"] | null;
            _id: string;
            userId: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            phoneNumber?: string;
            isActive?: boolean;
            isEmailVerified?: boolean;
            lastLogin?: string;
            schoolId: string;
            createdAt?: string;
            updatedAt?: string;
        };
        TeacherRosterMetaDto: {
            total: number;
            page: number;
            lastPage: number;
            limit: number;
        };
        TeacherRosterResponseDto: {
            data: components["schemas"]["TeacherRosterRowDto"][];
            meta: components["schemas"]["TeacherRosterMetaDto"];
            /** @description Total number of teachers. */
            count: number;
        };
        UpdateTeacherStatusDto: {
            /** @example false */
            isActive: boolean;
        };
        AdminUserSchoolDto: {
            id: string;
            name: string;
        };
        AdminUserSearchItemDto: {
            email: string | null;
            /** @enum {string} */
            role: "student" | "teacher" | "admin" | "parent" | "school_admin" | "school_sub_admin";
            school: components["schemas"]["AdminUserSchoolDto"] | null;
            id: string;
            name: string;
        };
        CreateTeacherDto: {
            /**
             * @description Staff number. Left out, the school's next staff number is generated.
             * @example TCH-0007
             */
            staffNumber?: string;
            /**
             * @description Highest academic qualification
             * @example Graduate
             * @enum {string}
             */
            highestAcademicQualification: "Undergraduate" | "Graduate" | "Postgraduate" | "Doctorate";
            /**
             * @description Years of teaching experience
             * @example 5
             */
            yearsOfExperience: number;
            /**
             * @description Subject specialization
             * @example Mathematics
             */
            specialization: string;
            /**
             * @description Employment type
             * @example Fulltime
             * @enum {string}
             */
            employmentType: "Fulltime" | "Parttime";
            /**
             * @description Employment role
             * @example Academic
             * @enum {string}
             */
            employmentRole: "Academic" | "NonAcademic";
            /**
             * @description Days of the week the teacher is available
             * @example [
             *       "Monday",
             *       "Tuesday",
             *       "Wednesday"
             *     ]
             */
            availabilityDays: string[];
            /**
             * @description Available time slots
             * @example 09:00 AM - 03:00 PM
             */
            availableTime: string;
            /**
             * @description Whether the teacher is a form teacher
             * @example false
             */
            isFormTeacher?: boolean;
            /**
             * @description Array of assigned class IDs
             * @example [
             *       "60d5ecb8b3b3a3001f3e5678"
             *     ]
             */
            assignedClasses?: string[];
            /**
             * @description Array of assigned course IDs
             * @example [
             *       "60d5ecb8b3b3a3001f3e3456"
             *     ]
             */
            assignedCourses?: string[];
        };
        TeacherProfileDto: {
            /** @enum {string} */
            highestAcademicQualification?: "Undergraduate" | "Graduate" | "Postgraduate" | "Doctorate";
            /** @enum {string} */
            employmentType?: "Fulltime" | "Parttime";
            /** @enum {string} */
            employmentRole?: "Academic" | "NonAcademic";
            availabilityDays?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday")[];
            _id: string;
            /** @description The teacher's user account. */
            userId: string;
            schoolId: string;
            staffNumber: string;
            assignedClasses: string[];
            assignedCourses: string[];
            isFormTeacher: boolean;
            isActive: boolean;
            yearsOfExperience?: number;
            specialization?: string;
            availableTime?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        TeacherProfileResponseDto: {
            availableTime?: {
                [key: string]: unknown;
            };
            assignedCourses: components["schemas"]["TeacherCourseDto"][];
            /** @description The classes the teacher leads or is assigned on the profile (mixed). */
            classTeacherClasses: components["schemas"]["TeacherClassDto"][];
            /** @description Only the classes whose `classTeacherId` is this teacher. */
            classTeacherOf: components["schemas"]["TeacherClassRefDto"][];
            /** @description The Teacher profile id. */
            _id: string;
            /** @description The teacher's user id. */
            userId: string;
            employmentType?: string;
            employmentRole?: string;
            availabilityDays?: string[];
            highestAcademicQualification?: string;
            yearsOfExperience?: number;
            specialization?: string;
            staffNumber?: string;
            isFormTeacher?: boolean;
        };
        Class: Record<string, never>;
        UpdateTeacherEmploymentDto: {
            /**
             * @description Employment type
             * @example Fulltime
             * @enum {string}
             */
            employmentType?: "Fulltime" | "Parttime";
            /**
             * @description Employment role
             * @example Academic
             * @enum {string}
             */
            employmentRole?: "Academic" | "NonAcademic";
        };
        UpdateTeacherAvailabilityDto: {
            /**
             * @description Days of the week the teacher is available
             * @example [
             *       "Monday",
             *       "Tuesday",
             *       "Wednesday"
             *     ]
             */
            availabilityDays?: string[];
            /**
             * @description Available time slots
             * @example 09:00 AM - 03:00 PM
             */
            availableTime?: string;
        };
        UpdateTeacherAcademicDetailsDto: {
            /**
             * @description Highest academic qualification
             * @example Graduate
             * @enum {string}
             */
            highestAcademicQualification?: "Undergraduate" | "Graduate" | "Postgraduate" | "Doctorate";
            /**
             * @description Years of teaching experience
             * @example 5
             */
            yearsOfExperience?: number;
            /**
             * @description Subject specialization
             * @example Mathematics
             */
            specialization?: string;
        };
        UpdateTeacherPersonalDetailsDto: {
            /** @example Amaka */
            firstName?: string;
            /** @example Okafor */
            lastName?: string;
            /**
             * @description Sign-in email; must not belong to another account
             * @example amaka.okafor@school.edu
             */
            email?: string;
            /** @example +2348012345678 */
            phoneNumber?: string;
            /** @enum {string} */
            gender?: "male" | "female" | "other";
            /** @example 1990-04-12 */
            dateOfBirth?: string;
        };
        UpdateClassAndCourseAssignmentDto: {
            /**
             * @description Array of assigned class IDs
             * @example [
             *       "60d5ecb8b3b3a3001f3e5678",
             *       "60d5ecb8b3b3a3001f3e9012"
             *     ]
             */
            assignedClasses?: string[];
            /**
             * @description Array of assigned course IDs
             * @example [
             *       "60d5ecb8b3b3a3001f3e3456"
             *     ]
             */
            assignedCourses?: string[];
            /**
             * @description Whether the teacher is a form teacher
             * @example true
             */
            isFormTeacher?: boolean;
        };
        TeacherDashboardKpiDto: {
            /**
             * @description Teacher ID
             * @example 60d5ecb8b3b3a3001f3e1234
             */
            teacherId: string;
            /**
             * @description Teacher first name
             * @example John
             */
            firstName: string;
            /**
             * @description Teacher last name
             * @example Doe
             */
            lastName: string;
            /**
             * @description Teacher email
             * @example john.doe@school.edu
             */
            email: string;
            /**
             * @description Teacher avatar URL
             * @example https://example.com/avatar.jpg
             */
            userAvatar?: string;
            /**
             * @description Number of subjects/courses assigned to the teacher
             * @example 15
             */
            assignedSubjects: number;
            /**
             * @description Number of resources uploaded by the teacher
             * @example 23
             */
            addedResources: number;
            /**
             * @description Number of attendance records made by the teacher
             * @example 95
             */
            recordedAttendance: number;
            /**
             * @description Number of classes assigned to the teacher
             * @example 3
             */
            assignedClasses: number;
            /**
             * @description Number of students across all assigned classes
             * @example 75
             */
            totalStudents: number;
            /**
             * @description Teacher specialization
             * @example Mathematics
             */
            specialization: string;
            /**
             * @description Years of teaching experience
             * @example 5
             */
            yearsOfExperience: number;
        };
        LinkCodeResponseDto: {
            /**
             * @description The code to give the parent, e.g. `ABCD-2345`.
             * @example ABCD-2345
             */
            code: string;
            /**
             * Format: date-time
             * @description When it stops working (14 days after issue).
             */
            expiresAt: string;
        };
        ParentContactDto: {
            fullName: string;
            phoneNumber: string;
            email: string;
            /** @enum {string} */
            relationship: "MOTHER" | "FATHER" | "GUARDIAN" | "OTHER";
        };
        CreateStudentDto: {
            userId: string;
            classId: string;
            gradeLevel: string;
            parentContact: components["schemas"]["ParentContactDto"];
            password?: string;
            admissionNumber?: string;
            isActive?: boolean;
        };
        StudentParentLinkDto: {
            /** @description The existing parent's name, when `existing`. */
            parentName?: string;
            /** @description True: the child was linked to that account (of any school, A11). */
            existing: boolean;
        };
        StudentParentContactDto: {
            /** @enum {string} */
            relationship: "MOTHER" | "FATHER" | "GUARDIAN" | "OTHER";
            fullName: string;
            phoneNumber: string;
            email: string;
        };
        CreatedStudentDto: {
            parentLink: components["schemas"]["StudentParentLinkDto"] | null;
            _id: string;
            /** @description The student's user account. */
            userId: string;
            classId: string;
            schoolId: string;
            admissionNumber: string;
            gradeLevel: string;
            /** @description The parent's user id. */
            parentId: string;
            enrolledCourses: string[];
            parentContact: components["schemas"]["StudentParentContactDto"];
            isActive: boolean;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdateUserInfoDto: {
            firstName?: string;
            lastName?: string;
            phoneNumber?: string;
            email?: string;
            dateOfBirth?: string;
            gender?: string;
            userAvatar?: string;
        };
        UpdateStudentDto: {
            userInfo?: components["schemas"]["UpdateUserInfoDto"];
            classId?: string;
            gradeLevel?: string;
            parentContact?: components["schemas"]["ParentContactDto"];
            isActive?: boolean;
        };
        StudentDashboardKpiDto: {
            /**
             * @description Student ID
             * @example 68685f2f7b46f6053daf4b15
             */
            studentId: string;
            /**
             * @description Student first name
             * @example Saint
             */
            firstName: string;
            /**
             * @description Student last name
             * @example agbukor
             */
            lastName: string;
            /**
             * @description Student email
             * @example secmuu@tempmailto.org
             */
            email: string;
            /**
             * @description Student avatar URL
             * @example https://example.com/avatar.jpg
             */
            userAvatar?: string;
            classInfo: {
                id?: string;
                name?: string;
            };
            /**
             * @description Number of subjects enrolled in
             * @example 15
             */
            subjectsEnrolled: number;
            /**
             * @description Overall grade score percentage
             * @example 85
             */
            gradeScore: number;
            /**
             * @description Attendance rate percentage
             * @example 93.5
             */
            attendanceRate: number;
            currentTerm: {
                id?: string;
                name?: string;
            };
            /**
             * @description Grade level/class level
             * @example Grade 10
             */
            gradeLevel: string;
            /**
             * @description Number of completed assessments
             * @example 12
             */
            completedAssessments: number;
            /**
             * @description Current class position/rank
             * @example 5
             */
            classPosition: number;
            /**
             * @description Total students in class
             * @example 30
             */
            totalStudentsInClass: number;
        };
        Student: Record<string, never>;
        CreateAttendanceDto: {
            /** @enum {string} */
            status: "Present" | "Absent" | "Late" | "Excused";
            studentId: string;
            classId: string;
            /** Format: date-time */
            date: string;
            termId: string;
            absenceReason?: string;
        };
        AttendanceRecordDto: {
            /** @enum {string} */
            status: "Present" | "Absent" | "Late" | "Excused";
            _id: string;
            studentId: string;
            classId: string;
            /** @description The teacher who took attendance. */
            recordedBy: string;
            /**
             * Format: date-time
             * @description The API's day: the UTC calendar day (see docs/api-contract.md).
             */
            date: string;
            absenceReason?: string;
            termId?: string;
            academicYearId?: string;
            schoolId?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdateAttendanceDto: {
            /**
             * @description The corrected status.
             * @enum {string}
             */
            status?: "Present" | "Absent" | "Late" | "Excused";
            /** @description Required when the status becomes Absent. */
            absenceReason?: string;
        };
        StudentAttendanceDashboardDto: {
            studentId: string;
            totalDays: number;
            presentDays: number;
            absentDays: number;
            /** @description Already formatted, e.g. `"90.00%"`. */
            attendancePercentage: string;
            records: components["schemas"]["AttendanceRecordDto"][];
        };
        MonthlyAttendanceStudentDto: {
            id: string;
            firstName: string;
            lastName: string;
            avatar?: string;
            grade: string;
            className: string;
        };
        MonthlyAttendancePeriodDto: {
            month: number;
            year: number;
            /** @description e.g. `September 2026` */
            label: string;
            startDate: string;
            endDate: string;
        };
        MonthlyStatusShareDto: {
            count: number;
            /** @description Whole percent of `totalRecorded`. */
            percentage: number;
        };
        MonthlyAttendanceSummaryDto: {
            present: components["schemas"]["MonthlyStatusShareDto"];
            absent: components["schemas"]["MonthlyStatusShareDto"];
            late: components["schemas"]["MonthlyStatusShareDto"];
            /** @description Excused days ("No Class"). */
            noClass: components["schemas"]["MonthlyStatusShareDto"];
            /** @description Percent of recorded days that were present, one decimal. */
            attendanceRate: number;
            totalRecorded: number;
            totalSchoolDays: number;
        };
        MonthlyAttendanceRecorderDto: {
            id: string;
            name: string;
        };
        MonthlyAttendanceDayDto: {
            /** @description Attendance record id; absent when nothing was recorded. */
            id?: string;
            /** @description `YYYY-MM-DD` */
            date: string;
            /** @description Weekday name, e.g. `Monday`. */
            day: string;
            /** @description `present`, `absent`, `late`, `noClass`, `unknown` or `noRecord`. */
            status: string;
            statusLabel: string;
            /** @description Local time the mark was created, or `null`. */
            time: string | null;
            notes: string;
            recordedBy?: components["schemas"]["MonthlyAttendanceRecorderDto"];
        };
        MonthlyAttendanceResponseDto: {
            student: components["schemas"]["MonthlyAttendanceStudentDto"];
            period: components["schemas"]["MonthlyAttendancePeriodDto"];
            summary: components["schemas"]["MonthlyAttendanceSummaryDto"];
            calendarDays: components["schemas"]["MonthlyAttendanceDayDto"][];
            selectedDay: components["schemas"]["MonthlyAttendanceDayDto"];
            recentRecords: components["schemas"]["MonthlyAttendanceDayDto"][];
            generatedAt: string;
        };
        StudentAttendanceStatusDto: {
            /** @description Student ID */
            studentId: string;
            /** @description Student first name */
            firstName: string;
            /** @description Student last name */
            lastName: string;
            /** @description Student email */
            email: string;
            /** @description Student avatar URL */
            userAvatar?: string;
            /** @description Whether attendance has been marked for this student */
            attendanceMarked: boolean;
            /**
             * @description Attendance status
             * @enum {string}
             */
            attendanceStatus?: "Present" | "Absent" | "Late" | "Excused";
            /** @description Absence reason if status is Absent */
            absenceReason?: string;
            recordedBy: {
                id?: string;
                name?: string;
            };
            /**
             * Format: date-time
             * @description Time when attendance was recorded
             */
            recordedAt?: string;
        };
        ClassAttendanceStatusDto: {
            /** @description Class ID */
            classId: string;
            /** @description Class name */
            className: string;
            /**
             * Format: date-time
             * @description Date for attendance check
             */
            date: string;
            /** @description Total number of students in class */
            totalStudents: number;
            /** @description Number of students with attendance marked */
            attendanceMarked: number;
            /** @description Number of students with no attendance marked */
            attendanceNotMarked: number;
            /** @description Number of present students */
            presentCount: number;
            /** @description Number of absent students */
            absentCount: number;
            /** @description Number of late students */
            lateCount: number;
            /** @description Number of excused students */
            excusedCount: number;
            /** @description List of students with their attendance status */
            students: components["schemas"]["StudentAttendanceStatusDto"][];
        };
        StudentAttendanceKpiDto: {
            /** @description Student ID */
            studentId: string;
            /** @description Student first name */
            firstName: string;
            /** @description Student last name */
            lastName: string;
            /** @description Student email */
            email: string;
            /** @description Student avatar URL */
            userAvatar?: string;
            classInfo: {
                id?: string;
                name?: string;
            };
            /** @description Attendance rate as percentage */
            attendanceRate: number;
            /** @description Total school days (days with attendance records) */
            totalDays: number;
            /** @description Number of days student was present */
            presentDays: number;
            /** @description Number of days student was absent */
            absentDays: number;
            /** @description Number of days student was late */
            lateDays: number;
            /** @description Number of days student was excused */
            excusedDays: number;
            dateRange: {
                /** Format: date-time */
                startDate?: string;
                /** Format: date-time */
                endDate?: string;
            };
            termInfo: {
                id?: string;
                name?: string;
            };
        };
        CreateLeaveRequestDto: {
            /** @enum {string} */
            leaveType: "illness" | "medical" | "family_travel" | "religious" | "other" | "Health Issue" | "Family Event" | "Fees Issue" | "Travel" | "Emergency" | "Other";
            child: string;
            /** Format: date-time */
            startDate: string;
            /** Format: date-time */
            endDate: string;
            attachments?: string[];
            reason?: string;
            term: string;
        };
        LeaveRequestDto: {
            /**
             * @description As stored: a B9 type (`illness`, `medical`, `family_travel`,
             *     `religious`, `other`) or, on older rows and rows the mobile app files,
             *     a legacy type.
             * @enum {string}
             */
            leaveType: "illness" | "medical" | "family_travel" | "religious" | "other" | "Health Issue" | "Family Event" | "Fees Issue" | "Travel" | "Emergency" | "Other";
            _id: string;
            schoolId?: string;
            /** @description The student's user id. */
            child: string;
            /** Format: date-time */
            startDate: string;
            /** Format: date-time */
            endDate: string;
            attachments: string[];
            reason?: string;
            /** @description The user id of the class teacher who reviews it. */
            classTeacher: string;
            term: string;
            viewed: boolean;
            /** @enum {string} */
            status: "Pending" | "Approved" | "Rejected";
            /** Format: date-time */
            reviewedAt?: string;
            reviewedBy?: string;
            declineReason?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdateLeaveRequestDto: {
            /** @enum {string} */
            status?: "Pending" | "Approved" | "Rejected";
            viewed?: boolean;
            attachments?: string[];
            reason?: string;
            declineReason?: string;
        };
        LeaveStudentUserDto: {
            _id: string;
            userId: string;
            email: string;
            role: string;
            firstName: string;
            lastName: string;
            phoneNumber?: string;
            /** Format: date-time */
            dateOfBirth?: string;
            gender?: string;
            isActive: boolean;
            /** Format: date-time */
            lastLogin?: string;
            schoolId: string;
            userAvatar?: string;
        };
        LeaveRequestWithStudentDto: {
            /**
             * @description As stored: a B9 type (`illness`, `medical`, `family_travel`,
             *     `religious`, `other`) or, on older rows and rows the mobile app files,
             *     a legacy type.
             * @enum {string}
             */
            leaveType: "illness" | "medical" | "family_travel" | "religious" | "other" | "Health Issue" | "Family Event" | "Fees Issue" | "Travel" | "Emergency" | "Other";
            /** @description The student profile document, or `null`. */
            studentProfile: {
                [key: string]: unknown;
            } | null;
            studentUser: components["schemas"]["LeaveStudentUserDto"] | null;
            _id: string;
            schoolId?: string;
            /** @description The student's user id. */
            child: string;
            /** Format: date-time */
            startDate: string;
            /** Format: date-time */
            endDate: string;
            attachments: string[];
            reason?: string;
            /** @description The user id of the class teacher who reviews it. */
            classTeacher: string;
            term: string;
            viewed: boolean;
            /** @enum {string} */
            status: "Pending" | "Approved" | "Rejected";
            /** Format: date-time */
            reviewedAt?: string;
            reviewedBy?: string;
            declineReason?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        LeaveRequestSummaryDto: {
            pending: number;
            approved: number;
            rejected: number;
            total: number;
        };
        ParentUpdateLeaveRequestDto: {
            /** @enum {string} */
            leaveType?: "illness" | "medical" | "family_travel" | "religious" | "other" | "Health Issue" | "Family Event" | "Fees Issue" | "Travel" | "Emergency" | "Other";
            /** Format: date-time */
            startDate?: string;
            /** Format: date-time */
            endDate?: string;
            reason?: string;
            attachments?: string[];
        };
        LeaveDeciderDto: {
            name: string;
        };
        LeaveRowDto: {
            /** @enum {string} */
            type: "illness" | "medical" | "family_travel" | "religious" | "other";
            note: string | null;
            /** @enum {string} */
            status: "pending" | "approved" | "declined";
            /** @description Who approved or declined it; null while pending. */
            decidedBy: components["schemas"]["LeaveDeciderDto"] | null;
            /** @description When it was decided (ISO instant); null while pending. */
            decidedAt: string | null;
            /** @description The reason given when declined; null otherwise. */
            declineReason: string | null;
            id: string;
            /** @description First day, `YYYY-MM-DD`. */
            startDate: string;
            /** @description Last day (inclusive), `YYYY-MM-DD`; equal to `startDate` for one day. */
            endDate: string;
            /** @description School days covered: the school's weekdays in the span, less holidays. */
            days: number;
            /** @description ISO instant. */
            createdAt: string;
        };
        ChildLeaveDto: {
            /** @description Newest first. */
            requests: components["schemas"]["LeaveRowDto"][];
            /** @description The child's requests in the school's current session (academic year). */
            countThisSession: number;
        };
        ParentLeaveCreateDto: {
            /** @enum {string} */
            type: "illness" | "medical" | "family_travel" | "religious" | "other";
            /**
             * @description First day, YYYY-MM-DD.
             * @example 2026-10-05
             */
            startDate: string;
            /**
             * @description Last day (inclusive), YYYY-MM-DD; not before startDate.
             * @example 2026-10-07
             */
            endDate: string;
            note?: string | null;
        };
        ParentLeaveUpdateDto: {
            /** @enum {string} */
            type?: "illness" | "medical" | "family_travel" | "religious" | "other";
            /** @example 2026-10-05 */
            startDate?: string;
            /** @example 2026-10-07 */
            endDate?: string;
            note?: string | null;
        };
        LeaveCancelledDto: {
            id: string;
            deleted: boolean;
        };
        LinkChildDto: {
            /** @description The code the school gave, e.g. ABCD-2345 */
            code: string;
            /**
             * @description How the parent is related to the child
             * @enum {string}
             */
            relationship: "MOTHER" | "FATHER" | "GUARDIAN" | "OTHER";
        };
        ChildCardUserDto: {
            _id: string;
            firstName?: string;
            lastName?: string;
            userAvatar?: string;
        };
        ChildCardRefDto: {
            id: string;
            name: string;
        };
        ChildCardSchoolDto: {
            city: string | null;
            id: string;
            name: string;
        };
        ChildCardPositionDto: {
            rank: number;
            of: number;
        };
        ParentChildCardDto: {
            /** @description Older: the populated login. */
            userId: components["schemas"]["ChildCardUserDto"];
            /** @description Older: the populated class. */
            classIdLegacy?: {
                [key: string]: unknown;
            };
            admissionNumber: string | null;
            class: components["schemas"]["ChildCardRefDto"] | null;
            school: components["schemas"]["ChildCardSchoolDto"];
            /** @description The current term's attendance rate (1 dp); null when nothing is marked. */
            attendanceRate: number | null;
            /** @description The current term's average (published scores, 1 dp); null without any. */
            average: number | null;
            /** @description The average's letter. */
            averageGrade: string | null;
            gradeLevel: string | null;
            position: components["schemas"]["ChildCardPositionDto"] | null;
            /** @enum {string|null} */
            relationship: "MOTHER" | "FATHER" | "GUARDIAN" | "OTHER" | null;
            avatarUrl: string | null;
            /** @description Older: same as `id`. */
            childId: string;
            /** @description Older: the child's user id. */
            childUserId?: string;
            firstName?: string;
            lastName?: string;
            /** @description Older: same as `avatarUrl`. */
            avatar?: string;
            classId?: string;
            className?: string;
            /** @description Older: the grade level (not the average's letter; that is `averageGrade`). */
            grade?: string;
            schoolId?: string;
            schoolName: string;
            isActive: boolean;
            isDefault: boolean;
            /**
             * @description Older: the current term's attendance (1 dp), **0** when nothing is
             *     marked, because mobile shows it as a number. `attendanceRate` is null
             *     in that case; new clients read `attendanceRate`.
             */
            attendancePercentage: number;
            /** @description Older: the letter of the current term's average, `N/A` without published scores. */
            currentGradeSummary: string;
            subjectsCount: number;
            teachersCount: number;
            /** @description The Student id. */
            id: string;
            name: string;
            /** @description Fees still owed, naira (the family fees, C2). */
            outstanding: number;
        };
        LinkedChildResponseDto: {
            /** @enum {string} */
            relationship: "MOTHER" | "FATHER" | "GUARDIAN" | "OTHER";
            /** @description The card `GET /parents/me/children` lists; null only if it could not be built. */
            child: components["schemas"]["ParentChildCardDto"] | null;
            /** @description The Student id. */
            childId: string;
            schoolId: string;
            /** Format: date-time */
            linkedAt: string;
        };
        UpdateChildProfileDto: {
            /**
             * @description How the parent is related to the child (B13: stored on the link).
             * @enum {string}
             */
            relationship?: "MOTHER" | "FATHER" | "GUARDIAN" | "OTHER";
            /** @description Student first name */
            firstName?: string;
            /** @description Student last name */
            lastName?: string;
            /** @description Date of birth (ISO string) */
            dateOfBirth?: string;
        };
        ObjectId: Record<string, never>;
        CreateParentDto: {
            /** @description Parent user ID */
            userId: components["schemas"]["ObjectId"];
            /** @description School ID */
            schoolId: components["schemas"]["ObjectId"];
            /** @description Children's user ids; each becomes a link (A11) with the child's school */
            children?: string[];
        };
        Parent: Record<string, never>;
        UpdateParentDto: {
            /** @description Parent user ID */
            userId?: components["schemas"]["ObjectId"];
            /** @description School ID */
            schoolId?: components["schemas"]["ObjectId"];
            /** @description Children's user ids; each becomes a link (A11) with the child's school */
            children?: string[];
        };
        ParentSettingsProfileDto: {
            avatar?: string | null;
            occupation: string | null;
            address: string | null;
            id: string;
            fullName: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber?: string;
            role: string;
            isEmailVerified: boolean;
            isPhoneVerified: boolean;
        };
        ParentSettingsChildDto: {
            avatar: string | null;
            /** @enum {string} */
            status: "Active" | "Inactive";
            /** @description Older: the populated login. */
            userId: {
                [key: string]: unknown;
            };
            /** @description Older: the populated class. */
            classId: {
                [key: string]: unknown;
            };
            /** @description The Student id. */
            id: string;
            fullName: string;
            className: string;
            grade: string;
            schoolName: string;
        };
        ParentNotificationSwitchesDto: {
            attendanceAlerts: boolean;
            academicUpdates: boolean;
            schoolAnnouncements: boolean;
            messages: boolean;
            paymentReminders: boolean;
            feeDueDateReminders: boolean;
            resultsPublishedAlerts: boolean;
            leaveRequestUpdates: boolean;
        };
        ParentGuidesDto: {
            /**
             * Format: date-time
             * @description When the tour was finished; null until then.
             */
            tourCompletedAt: string | null;
        };
        ParentSettingsPreferencesDto: {
            notifications: components["schemas"]["ParentNotificationSwitchesDto"];
            /** @enum {string} */
            theme: "light" | "dark" | "system";
            /**
             * @description The payment method the parents app offers first (C7); null for none.
             * @enum {string|null}
             */
            preferredProvider: "paystack" | "opay" | "stripe" | "bank_transfer" | null;
            guides: components["schemas"]["ParentGuidesDto"];
            language: string;
        };
        ParentSettingsSecurityDto: {
            lastPasswordChangedAt: string | null;
            twoFactorEnabled: boolean;
            emailOtpEnabled: boolean;
        };
        ParentSettingsResponseDto: {
            profile: components["schemas"]["ParentSettingsProfileDto"];
            children: components["schemas"]["ParentSettingsChildDto"][];
            preferences: components["schemas"]["ParentSettingsPreferencesDto"];
            security: components["schemas"]["ParentSettingsSecurityDto"];
        };
        UpdateParentProfileDto: {
            /** @description Full display name of the parent */
            fullName?: string;
            /** @description Avatar URL (Cloudinary or similar) */
            avatar?: string;
            /** @description What the parent does (B13); empty clears it */
            occupation?: string;
            /** @description The parent's address (B13); empty clears it */
            address?: string;
        };
        SendPhoneOtpDto: {
            /** @description New Nigerian phone number (+234 or 0 prefix) */
            newPhoneNumber: string;
        };
        VerifyPhoneOtpDto: {
            /** @description New phone number matching the one the OTP was sent for */
            newPhoneNumber: string;
            /** @description 6-digit OTP code sent via email */
            otp: string;
        };
        UpdateNotificationPreferencesDto: {
            attendanceAlerts?: boolean;
            academicUpdates?: boolean;
            schoolAnnouncements?: boolean;
            messages?: boolean;
            paymentReminders?: boolean;
            feeDueDateReminders?: boolean;
            resultsPublishedAlerts?: boolean;
            leaveRequestUpdates?: boolean;
        };
        UpdateThemePreferenceDto: {
            /**
             * @description Theme preference
             * @enum {string}
             */
            theme: "light" | "dark" | "system";
        };
        UpdatePreferredProviderDto: {
            /**
             * @description How the parent prefers to pay; null clears the choice.
             * @enum {string|null}
             */
            preferredProvider: "paystack" | "opay" | "stripe" | "bank_transfer" | null;
        };
        PreferredProviderUpdatedDto: {
            /** @enum {string|null} */
            preferredProvider: "paystack" | "opay" | "stripe" | "bank_transfer" | null;
            success: boolean;
            message: string;
        };
        ParentGuidesInputDto: {
            /** @description True stamps `guides.tourCompletedAt` with now; false clears it. */
            tourCompleted?: boolean;
        };
        UpdateParentPreferencesDto: {
            guides?: components["schemas"]["ParentGuidesInputDto"];
        };
        ParentPreferencesUpdatedDto: {
            guides: components["schemas"]["ParentGuidesDto"];
            success: boolean;
            message: string;
        };
        TeacherSettingsProfileDto: {
            phoneNumber: string | null;
            avatar: string | null;
            id: string;
            userId: string;
            fullName: string;
            firstName: string;
            lastName: string;
            /** @description Read-only for teachers. */
            email: string;
            role: string;
            isActive: boolean;
            isEmailVerified: boolean;
            /** Format: date-time */
            joinedAt: string;
            schoolId: string;
            schoolName: string;
            schoolIdentifier: string;
        };
        TeacherMessagePreferencesViewDto: {
            /** @enum {string} */
            defaultFilter: "all" | "private" | "groups";
            showOnlineStatus: boolean;
            readReceipts: boolean;
            soundEnabled: boolean;
            groupNotifications: boolean;
            unreadBadge: boolean;
        };
        TeacherTeachingPreferencesViewDto: {
            landingPage: string;
            gradingView: string;
            attendanceMode: string;
            timetableDisplay: string;
            resourceDisplay: string;
        };
        TeacherGuidePreferencesViewDto: {
            /** Format: date-time */
            tourCompletedAt: string | null;
            showAppTips: boolean;
        };
        TeacherPreferencesViewDto: {
            messages: components["schemas"]["TeacherMessagePreferencesViewDto"];
            teaching: components["schemas"]["TeacherTeachingPreferencesViewDto"];
            guides: components["schemas"]["TeacherGuidePreferencesViewDto"];
            /** @enum {string} */
            theme: "light" | "dark" | "system";
        };
        TeacherSettingsDto: {
            profile: components["schemas"]["TeacherSettingsProfileDto"];
            /** @description teacherId, employeeId, staffNumber, employmentType, employmentRole, isFormTeacher */
            employment: {
                [key: string]: unknown;
            };
            /** @description classesAssigned, subjectsTeaching, studentsTeaching, accountStatus */
            summary: {
                [key: string]: unknown;
            };
            preferences: components["schemas"]["TeacherPreferencesViewDto"];
        };
        UpdateTeacherProfileDto: {
            /** @example Tolu */
            firstName?: string;
            /** @example Adebayo */
            lastName?: string;
            /**
             * @description Stored as sent after trimming: 7 to 20 characters of "+", digits, spaces and dashes.
             * @example +234 803 123 4567
             */
            phoneNumber?: string;
            /** @description Avatar URL */
            avatarUrl?: string;
        };
        TeacherMessagePreferencesDto: {
            /** @description Whether others may see this teacher online (ChatPreference). */
            showOnlineStatus?: boolean;
            /** @description Whether others see when this teacher read their messages (ChatPreference). */
            readReceipts?: boolean;
            /** @description Play a sound for new messages in the app. */
            soundEnabled?: boolean;
            groupNotifications?: boolean;
            unreadBadge?: boolean;
            /** @enum {string} */
            defaultFilter?: "all" | "private" | "groups";
        };
        TeacherTeachingPreferencesDto: {
            /** @enum {string} */
            landingPage?: "dashboard" | "timetable" | "attendance" | "messages";
            /** @enum {string} */
            gradingView?: "course" | "class";
            /** @enum {string} */
            attendanceMode?: "mark" | "view";
            /** @enum {string} */
            timetableDisplay?: "week" | "today";
            /** @enum {string} */
            resourceDisplay?: "grid" | "list";
        };
        TeacherGuidePreferencesDto: {
            showAppTips?: boolean;
            /**
             * @description True stamps `guides.tourCompletedAt` with the current time (the Today
             *     setup step "tour" is then done); false clears it. Not stored itself.
             */
            tourCompleted?: boolean;
        };
        UpdateTeacherPreferencesDto: {
            messages?: components["schemas"]["TeacherMessagePreferencesDto"];
            teaching?: components["schemas"]["TeacherTeachingPreferencesDto"];
            guides?: components["schemas"]["TeacherGuidePreferencesDto"];
            /** @enum {string} */
            theme?: "light" | "dark" | "system";
        };
        TeacherPreferencesResponseDto: {
            preferences: components["schemas"]["TeacherPreferencesViewDto"];
            success: boolean;
            message?: string;
        };
        FileUploadDto: Record<string, never>;
        RegisterDeviceTokenDto: {
            /** @description Firebase Cloud Messaging token */
            fcmToken: string;
            /** @description Stable unique device identifier */
            deviceId: string;
            /** @enum {string} */
            platform: "ios" | "android" | "web";
            appVersion?: string;
            /** @enum {string} */
            permissionStatus?: "granted" | "denied" | "not_determined";
            /** @description IANA timezone string auto-detected by the device (e.g. "Africa/Lagos") */
            timezone?: string;
        };
        DeactivateDeviceTokenDto: {
            deviceId: string;
        };
        InboxCountDto: {
            all: number;
            unread: number;
        };
        InboxCountsByCategoryDto: {
            announcement: components["schemas"]["InboxCountDto"];
            attendance: components["schemas"]["InboxCountDto"];
            academics: components["schemas"]["InboxCountDto"];
            grading: components["schemas"]["InboxCountDto"];
            resources: components["schemas"]["InboxCountDto"];
            messages: components["schemas"]["InboxCountDto"];
            account: components["schemas"]["InboxCountDto"];
            /** @description B11: every payment event. */
            payments: components["schemas"]["InboxCountDto"];
            /** @description B11: leave requests and their decisions. */
            leave: components["schemas"]["InboxCountDto"];
            /** @description v1.5: support tickets (replies, status changes, new tickets for a desk). */
            support: components["schemas"]["InboxCountDto"];
            other: components["schemas"]["InboxCountDto"];
        };
        InboxCountsDto: {
            byCategory: components["schemas"]["InboxCountsByCategoryDto"];
            all: number;
            unread: number;
        };
        ReadAllResponseDto: {
            /** @description Notifications and announcements newly marked read. */
            updated: number;
            message: string;
        };
        NotificationPreference: Record<string, never>;
        UpdateNotificationPreferenceDto: {
            pushEnabled?: boolean;
            /** @description Browser push notifications. Separate from pushEnabled, which controls phones. */
            webPushEnabled?: boolean;
            emailEnabled?: boolean;
            messagesEnabled?: boolean;
            announcementsEnabled?: boolean;
            attendanceEnabled?: boolean;
            feesEnabled?: boolean;
            resultsEnabled?: boolean;
            timetableEnabled?: boolean;
            resourcesEnabled?: boolean;
            /** @description Grading alerts: assessment deadline reminders (7 days and 1 day before the end) and "scores awaited" reminders. Default true. */
            gradingEnabled?: boolean;
            /** @description Teachers: the register reminder 30 minutes before the register closes when the class's register is not in. Default true. */
            registerReminderEnabled?: boolean;
            /** @description Teachers: the 16:00 digest "N students opened '{name}' today". Default true. */
            resourceOpenedEnabled?: boolean;
            /** @description Leave-request status updates. */
            leaveRequestsEnabled?: boolean;
            securityEnabled?: boolean;
            systemEnabled?: boolean;
            quietHoursEnabled?: boolean;
            /** @description Quiet hours start in HH:mm format */
            quietHoursStart?: string;
            /** @description Quiet hours end in HH:mm format */
            quietHoursEnd?: string;
            /** @description IANA timezone string (e.g. "Africa/Lagos", "America/New_York") */
            timezone?: string;
        };
        BroadcastAudienceDto: {
            all?: boolean;
            schoolIds?: string[];
            roles?: ("teacher" | "student" | "parent" | "school_admin" | "school_sub_admin")[];
            userIds?: string[];
        };
        PreviewBroadcastDto: {
            audience: components["schemas"]["BroadcastAudienceDto"];
        };
        BroadcastPreviewSchoolDto: {
            /** @description Null for recipients without a school on their account. */
            schoolId: string | null;
            name: string | null;
            count: number;
        };
        BroadcastRoleCountsDto: {
            teacher: number;
            student: number;
            parent: number;
            school_admin: number;
            school_sub_admin: number;
        };
        BroadcastPreviewDto: {
            /** @description By the school on each user's account, largest first. */
            bySchool: components["schemas"]["BroadcastPreviewSchoolDto"][];
            /** @description Distinct active users the audience reaches now. */
            recipients: number;
            byRole: components["schemas"]["BroadcastRoleCountsDto"];
        };
        BroadcastTargetInputDto: {
            /** @enum {string} */
            page: "attendance" | "grading" | "messages" | "resources" | "subjects" | "leave" | "announcements" | "timetable" | "settings" | "payments" | "results" | "children" | "support";
            classId?: string;
            courseId?: string;
            assessmentId?: string;
            termId?: string;
            roomId?: string;
            ticketId?: string;
            week?: number;
            /** @example 2026-10-06 */
            date?: string;
        };
        BroadcastChannelsDto: {
            /**
             * @description Phone and browser push.
             * @default true
             */
            push: boolean;
            /** @default false */
            email: boolean;
        };
        CreateBroadcastDto: {
            title: string;
            body: string;
            /** @description Uploaded files (https URLs), shown with the notification. */
            attachments?: string[];
            target?: components["schemas"]["BroadcastTargetInputDto"];
            audience: components["schemas"]["BroadcastAudienceDto"];
            channels: components["schemas"]["BroadcastChannelsDto"];
            /**
             * @description When to send (ISO 8601). Omitted or not in the future: now. At most a
             *     year ahead.
             * @example 2026-10-07T08:00:00.000Z
             */
            sendAt?: string;
        };
        BroadcastCreatedDto: {
            /** @enum {string} */
            status: "scheduled" | "sending";
            id: string;
            recipientsEstimate: number;
        };
        BroadcastRefDto: {
            id: string;
            name: string;
        };
        BroadcastUserDto: {
            id: string;
            name: string;
            role: string;
        };
        BroadcastAudienceViewDto: {
            /** @description `schoolIds` with their names. */
            schools: components["schemas"]["BroadcastRefDto"][];
            roles: ("teacher" | "student" | "parent" | "school_admin" | "school_sub_admin")[];
            /** @description `GET /admin/broadcasts/:id` only: `userIds` with names. */
            users?: components["schemas"]["BroadcastUserDto"][];
            all: boolean;
            schoolIds: string[];
            userIds: string[];
        };
        BroadcastChannelsViewDto: {
            /** @description Always true. */
            inApp: boolean;
            push: boolean;
            email: boolean;
        };
        BroadcastStatsDto: {
            /** @description Rows written (0 until it sends). */
            recipients: number;
            /** @description Rows whose delivery job ran. */
            delivered: number;
            read: number;
            /** @description Rows pushed to a phone or a browser. */
            pushSent: number;
            /** @description Rows whose email was queued or sent. */
            emailSent: number;
            /** @description Rows with a failed status or channel. */
            failed: number;
        };
        BroadcastDto: {
            target: components["schemas"]["NotificationTargetDto"] | null;
            /** @enum {string} */
            status: "scheduled" | "sending" | "sent" | "cancelled" | "failed";
            /** Format: date-time */
            sentAt: string | null;
            /** Format: date-time */
            cancelledAt: string | null;
            id: string;
            title: string;
            body: string;
            attachments: string[];
            audience: components["schemas"]["BroadcastAudienceViewDto"];
            channels: components["schemas"]["BroadcastChannelsViewDto"];
            /** Format: date-time */
            sendAt: string;
            /** @description The audience's size when it was created. */
            recipientsEstimate: number;
            createdBy: components["schemas"]["BroadcastRefDto"];
            /** Format: date-time */
            createdAt: string;
            stats: components["schemas"]["BroadcastStatsDto"];
        };
        PageMetaDto: {
            total: number;
            page: number;
            lastPage: number;
            limit: number;
        };
        BroadcastListResponseDto: {
            data: components["schemas"]["BroadcastDto"][];
            meta: components["schemas"]["PageMetaDto"];
        };
        WebPushKeysDto: {
            p256dh: string;
            auth: string;
        };
        CreateWebPushSubscriptionDto: {
            /** @description Must be an https URL on a known browser push service (see `isAllowedPushEndpoint`). */
            endpoint: string;
            keys: components["schemas"]["WebPushKeysDto"];
            userAgent?: string;
        };
        DeleteWebPushSubscriptionDto: {
            endpoint: string;
        };
        CreateAnnouncementDto: {
            title: string;
            message?: string;
            content?: string;
            senderId?: string;
            attachment?: string;
            audience?: string[];
            attachments?: string[];
            /** @enum {string} */
            category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "payments" | "leave" | "support" | "other";
            targetAudience?: string[];
            /** @enum {string} */
            status?: "PENDING" | "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
            scheduledFor?: string;
            isPinned?: boolean;
        };
        AddReactionDto: {
            announcementId: string;
            reaction: string;
            userId: string;
        };
        EditAnnouncementDto: {
            title?: string;
            content?: string;
            targetAudience?: string[];
            reviewers?: string[];
            attachment?: string;
            attachments?: string[];
            audience?: string[];
            /** @enum {string} */
            category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "payments" | "leave" | "support" | "other";
            /** @enum {string} */
            status?: "PENDING" | "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
            scheduledFor?: string;
            isPinned?: boolean;
        };
        MarkAnnouncementReadDto: {
            userId?: string;
        };
        CacheTestDto: {
            /** @example diagnostics:ping */
            key: string;
            /** @description Any JSON value */
            value: Record<string, never>;
            /** @description Seconds */
            ttl?: number;
        };
        SetUserOnlineDto: {
            userId: string;
            isOnline: boolean;
        };
        NotificationSenderDto: {
            role: string | null;
            id: string;
            name: string;
        };
        NotificationSenderAccountDto: {
            userAvatar?: string | null;
            _id: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            role?: string;
        };
        CreateNotificationDto: {
            /** @example Important Announcement */
            title: string;
            /** @example School will be closed tomorrow due to weather. */
            message: string;
            attachments?: string[];
            recipientRoles?: ("student" | "teacher" | "admin" | "parent" | "school_admin" | "school_sub_admin")[];
            targetSchools?: string[];
            /**
             * @description Ignored for everyone but the platform admin: the sender is always the
             *     authenticated caller. The platform admin may omit it (defaults to them).
             */
            senderId?: string;
            /** @enum {string} */
            priority?: "low" | "medium" | "high";
            /**
             * @description Machine-readable event type for integrations.
             * @example system_alert
             */
            type?: string;
            /** @enum {string} */
            source?: "school" | "talim" | "system";
            /** @enum {string} */
            category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "payments" | "leave" | "support" | "other";
            /** @description Extra context used by clients to link notifications to modules. */
            metadata?: Record<string, never>;
            recipientId?: string;
            /** Format: date-time */
            scheduledFor?: string;
            isScheduled?: boolean;
            deliveryChannels?: ("inApp" | "email" | "push" | "webPush")[];
        };
        NotificationAttachmentFileDto: {
            /** @enum {string} */
            kind: "pdf" | "image" | "doc" | "slides" | "video" | "other";
            /** @description Unknown from a URL alone; always null for now. */
            size: number | null;
            url: string;
            /** @description The last path segment, URL-decoded. */
            name: string;
        };
        NotificationSchoolDto: {
            id: string;
            name: string;
        };
        NotificationItemDto: {
            /** @enum {string} */
            source: "school" | "talim" | "system";
            /** @enum {string} */
            category: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "payments" | "leave" | "support" | "other";
            /** @enum {string} */
            priority?: "low" | "medium" | "high";
            metadata?: {
                target?: components["schemas"]["NotificationTargetDto"];
                actionLabel?: string;
                childId?: string;
                studentId?: string;
            } & {
                [key: string]: unknown;
            };
            attachmentFiles: components["schemas"]["NotificationAttachmentFileDto"][];
            /** @description Parents' own list only: the school the row came from. */
            school?: components["schemas"]["NotificationSchoolDto"] | null;
            /** @description `{ id, name, role }` for teachers, students and parents; the populated account for staff. */
            senderId: (components["schemas"]["NotificationSenderDto"] | components["schemas"]["NotificationSenderAccountDto"]) | null;
            /** @description Staff only: the push and email delivery state. */
            delivery?: {
                [key: string]: unknown;
            };
            /**
             * @description Staff only.
             * @enum {string}
             */
            status?: "pending" | "sent" | "failed";
            /** @description Staff only: who has read it. */
            readBy?: {
                [key: string]: unknown;
            }[];
            /** @description Staff only. */
            targetSchools?: {
                [key: string]: unknown;
            }[];
            _id: string;
            /** @description Same as `_id`. */
            id: string;
            title: string;
            message: string;
            type?: string;
            sourceLabel: string;
            attachments?: string[];
            /** @description The reader (absent on broadcasts). */
            recipientId?: string;
            schoolId?: string;
            /** @description Whether the caller (or, for staff, the listed recipient) has read it. */
            isRead: boolean;
            senderName: string;
            scheduledFor?: string;
            createdAt: string;
            updatedAt?: string;
            /** @description Staff only. */
            deliveryChannels?: string[];
            /** @description Staff only. */
            recipientRoles?: string[];
        };
        NotificationPageMetaDto: {
            total: number;
            page: number;
            lastPage: number;
            limit: number;
        };
        NotificationListResponseDto: {
            data: components["schemas"]["NotificationItemDto"][];
            meta: components["schemas"]["NotificationPageMetaDto"];
        };
        UpdateNotificationDto: {
            /** @example Important Announcement */
            title?: string;
            /** @example School will be closed tomorrow due to weather. */
            message?: string;
            attachments?: string[];
            recipientRoles?: ("student" | "teacher" | "admin" | "parent" | "school_admin" | "school_sub_admin")[];
            /** @enum {string} */
            priority?: "low" | "medium" | "high";
            /**
             * @description Machine-readable event type for integrations.
             * @example system_alert
             */
            type?: string;
            /** @enum {string} */
            source?: "school" | "talim" | "system";
            /** @enum {string} */
            category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "payments" | "leave" | "support" | "other";
            /** @description Extra context used by clients to link notifications to modules. */
            metadata?: Record<string, never>;
            /** Format: date-time */
            scheduledFor?: string;
            isScheduled?: boolean;
            deliveryChannels?: ("inApp" | "email" | "push" | "webPush")[];
        };
        Notification: Record<string, never>;
        ScheduleNotificationDto: {
            notification: components["schemas"]["CreateNotificationDto"];
            /** Format: date-time */
            scheduledDate: string;
        };
        TeacherContactDto: {
            /** @enum {string} */
            role: "parent" | "teacher" | "school_admin" | "sub_admin";
            avatarUrl: string | null;
            /** @enum {string} */
            group: "parent" | "colleague" | "office";
            /** @description Parents only; null for everyone else. */
            phone: string | null;
            /** @description A user id, or `office` for the school office (open it with `POST /chat/office`). */
            userId: string;
            name: string;
            /** @description "Parent of Ada Obi · Grade 5A", "Mathematics · colleague". */
            subtitle: string;
        };
        ChatStudentParentContactDto: {
            userAvatar: string | null;
            userId: string;
            firstName: string;
            lastName: string;
            role: string;
            /** @description "Class teacher", or the subjects they teach the caller's class. */
            subtitle: string;
        };
        ParentChildContactDto: {
            /** @enum {string} */
            role: "teacher" | "school_admin";
            avatarUrl: string | null;
            /** @enum {string} */
            group: "class_teacher" | "teacher" | "office";
            /**
             * @description The office entry: the school's office number (its first primary
             *     contact's, as `GET /parents/me/children/:childId/school` shows it), null
             *     when the school has none. Teachers: always null, their numbers are not
             *     shared with parents.
             */
            phone: string | null;
            /** @description Older field: the same as `avatarUrl`. */
            userAvatar: string | null;
            /** @description A teacher's user id, or `office` for the school office (open it with `POST /chat/office`). */
            userId: string;
            name: string;
            /** @description "Class teacher · Mathematics", "English · teacher", "School office · Easy Sparks". */
            subtitle: string;
            /** @description Older field: the first name ("School office" for the office). */
            firstName: string;
            /** @description Older field. */
            lastName: string;
        };
        CreateChatRoomDto: {
            /**
             * @description Type of chat room
             * @enum {string}
             */
            type: "class_group" | "course_group" | "one_to_one" | "admin_parent_group" | "parent_group" | "custom_group" | "office";
            /** @description Class ID for class group chat */
            classId?: string;
            /** @description Course ID for course group chat */
            courseId?: string;
            /** @description Term ID for group chats */
            termId?: string;
            /** @description Participant user IDs */
            participants: string[];
        };
        ChatRoomAdminDto: {
            id: string;
            name: string;
        };
        RoomSchoolDto: {
            id: string;
            name: string;
        };
        ChatAttachmentViewDto: {
            /** @enum {string} */
            type: "image" | "audio" | "video" | "document" | "file";
            url: string;
            /** @description Browser-playable URL for audio the browser cannot play as uploaded. */
            playbackUrl?: string;
            name?: string;
            mimeType?: string;
            size?: number;
            duration?: number;
            width?: number;
            height?: number;
        };
        ChatLastMessageDto: {
            /** @enum {string} */
            type: "text" | "voice" | "image" | "file";
            _id?: string;
            senderId: string;
            senderName: string;
            /** @description Short text for list rows, e.g. "Photo" for an image. */
            preview: string;
            /** Format: date-time */
            createdAt: string;
            /** @description Same as `preview`; kept for older clients. */
            content: string;
            attachments: components["schemas"]["ChatAttachmentViewDto"][];
            duration?: number;
        };
        ChatRoomCreatedDto: {
            /** @enum {string} */
            type: "class_group" | "course_group" | "one_to_one" | "admin_parent_group" | "parent_group" | "custom_group" | "office";
            /** @description The group description; null when there is none, and always for direct and office rooms. */
            description: string | null;
            /** @description Group admins (the creator first): they and school staff edit the name and description. */
            admins: components["schemas"]["ChatRoomAdminDto"][];
            /**
             * @description Office rooms only (B10).
             * @enum {string}
             */
            ownerRole?: "teacher" | "parent";
            /**
             * @description How the viewer's Messages screen groups the room.
             * @enum {string}
             */
            category: "parent" | "colleague" | "class_group" | "office" | "group";
            /**
             * @description The number the Voice button dials (`tel:`): set only for a teacher in a
             *     direct message with a parent of one of their students.
             */
            callPhone: string | null;
            _id: string;
            schoolId?: string;
            name?: string;
            classId?: string;
            courseId?: string;
            termId?: string;
            participants: string[];
            lastMessageId?: string;
            createdBy?: string;
            isActive?: boolean;
            /** @description Create endpoints only: true when an existing room was returned instead of a new one. */
            reused?: boolean;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            /** @description Same as `_id`. */
            roomId: string;
            avatarUrl?: string;
            /** @description The room's school; on a parent's list, which spans schools (A11). */
            school?: components["schemas"]["RoomSchoolDto"] | null;
            /** @description Office rooms only (B10): whose thread it is, a teacher or a parent. */
            officeOwnerId?: string;
            /** @description Teacher office rooms only: the teacher, the same as `officeOwnerId`. */
            officeTeacherId?: string;
            lastMessage: components["schemas"]["ChatLastMessageDto"] | null;
            /** @description Messages the caller has not read. */
            unreadCount: number;
            /** Format: date-time */
            lastReadAt?: string;
            /**
             * @description For the viewer, e.g. "Parent of Ada Obi · Grade 5A", "Class group · 12
             *     students", "Mathematics · colleague", "School office · Easy Sparks"; an
             *     admin sees an office room as "Office thread · {teacher name}", or
             *     "Office thread · {parent name} (parent of {child first names})".
             */
            subtitle: string;
        };
        CreateGroupChatDto: {
            /**
             * @description Type of group chat room (class_group, course_group, parent_group, admin_parent_group or custom_group)
             * @example admin_parent_group
             * @enum {string}
             */
            type: "class_group" | "course_group" | "parent_group" | "admin_parent_group" | "custom_group";
            /** @description Class ID for class group chat (required if type is class_group) */
            classId?: string;
            /** @description Course ID for course group chat (required if type is course_group) */
            courseId?: string;
            /** @description Term ID for group chats */
            termId?: string;
            /** @description Custom name for the group chat */
            name?: string;
            /**
             * @description Array of user IDs to be added as participants (including teacher creating the group)
             * @example [
             *       "user_id"
             *     ]
             */
            participants?: string[];
        };
        ChatRoomResponseDto: {
            _id: string;
            /** @enum {string} */
            type: "class_group" | "course_group" | "one_to_one" | "admin_parent_group" | "parent_group" | "custom_group" | "office";
            schoolId?: string;
            name?: string;
            classId?: string;
            courseId?: string;
            termId?: string;
            participants: string[];
            lastMessageId?: string;
            createdBy?: string;
            isActive?: boolean;
            /** @description Create endpoints only: true when an existing room was returned instead of a new one. */
            reused?: boolean;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdateChatRoomDto: {
            /** @example JSS1 A Parents */
            name?: string;
            /** @description Group description; null or an empty string clears it. */
            description?: string | null;
            /** @description Group picture URL from POST /upload/chat-attachment; null clears it. */
            avatarUrl?: string | null;
        };
        ChatParticipantDto: {
            _id: string;
            /** @description Same as `_id`. */
            userId: string;
            firstName: string;
            lastName: string;
            role: string;
            userAvatar: string | null;
            isActive: boolean;
            isOnline: boolean;
        };
        ChatRoomViewDto: {
            /** @enum {string} */
            type: "class_group" | "course_group" | "one_to_one" | "admin_parent_group" | "parent_group" | "custom_group" | "office";
            /** @description The group description; null when there is none, and always for direct and office rooms. */
            description: string | null;
            /** @description Group admins (the creator first): they and school staff edit the name and description. */
            admins: components["schemas"]["ChatRoomAdminDto"][];
            /**
             * @description Office rooms only (B10).
             * @enum {string}
             */
            ownerRole?: "teacher" | "parent";
            /**
             * @description How the viewer's Messages screen groups the room.
             * @enum {string}
             */
            category: "parent" | "colleague" | "class_group" | "office" | "group";
            /**
             * @description The number the Voice button dials (`tel:`): set only for a teacher in a
             *     direct message with a parent of one of their students.
             */
            callPhone: string | null;
            _id: string;
            /** @description Same as `_id`. */
            roomId: string;
            /** @description Empty for one-to-one rooms: show the other participant instead. */
            name: string;
            avatarUrl?: string;
            classId?: string;
            courseId?: string;
            termId?: string;
            createdBy?: string;
            /** @description The room's school; on a parent's list, which spans schools (A11). */
            school?: components["schemas"]["RoomSchoolDto"] | null;
            /** @description Office rooms only (B10): whose thread it is, a teacher or a parent. */
            officeOwnerId?: string;
            /** @description Teacher office rooms only: the teacher, the same as `officeOwnerId`. */
            officeTeacherId?: string;
            participants: components["schemas"]["ChatParticipantDto"][];
            lastMessage: components["schemas"]["ChatLastMessageDto"] | null;
            /** @description Messages the caller has not read. */
            unreadCount: number;
            /** Format: date-time */
            lastReadAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            /**
             * @description For the viewer, e.g. "Parent of Ada Obi · Grade 5A", "Class group · 12
             *     students", "Mathematics · colleague", "School office · Easy Sparks"; an
             *     admin sees an office room as "Office thread · {teacher name}", or
             *     "Office thread · {parent name} (parent of {child first names})".
             */
            subtitle: string;
        };
        ChatMediaItemDto: {
            /** @enum {string} */
            kind: "image" | "video" | "document" | "link";
            name: string | null;
            mimeType: string | null;
            size: number | null;
            sender: {
                id?: string;
                name?: string;
            };
            messageId: string;
            url: string;
            /** Format: date-time */
            sentAt: string;
        };
        ChatMediaCountsDto: {
            image: number;
            /** @description Video attachments (B10); they are no longer counted as documents. */
            video: number;
            document: number;
            link: number;
        };
        ChatMediaPageDto: {
            items: components["schemas"]["ChatMediaItemDto"][];
            nextCursor: string | null;
            counts: components["schemas"]["ChatMediaCountsDto"];
        };
        MarkRoomReadDto: {
            /** @description Newest message read; defaults to the newest in the room. */
            upToMessageId?: string;
        };
        ChatMessageResponseDto: {
            id: string;
            senderId: string;
            content: string;
            roomId: string;
            senderName: string;
            isRead: boolean;
            readBy: string[];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ChatAttachmentDto: {
            /** @description Public attachment URL */
            url: string;
            /** @description Original file name */
            name?: string;
            /** @description MIME type */
            mimeType?: string;
            /** @description File size in bytes */
            size?: number;
            /** @description Attachment family */
            type?: Record<string, never>;
            /** @description Media duration in seconds */
            duration?: number;
            /** @description Image width */
            width?: number;
            /** @description Image height */
            height?: number;
        };
        CreateMessageDto: {
            /** @description Message text content */
            text?: string;
            /** @description Attachments from POST /upload/chat-attachment. Plain URL strings are still accepted. */
            attachments?: components["schemas"]["ChatAttachmentDto"][];
            /**
             * @description Message type
             * @enum {string}
             */
            type?: "text" | "voice" | "image" | "file";
            /** @description Duration in seconds for voice/audio messages */
            duration?: number;
            /** @description Chat room ID */
            chatRoomId: string;
            /**
             * @description Id the client generates for this message (e.g. a UUID). Retrying with the same id returns the stored message instead of sending it twice.
             * @example 3f8f6c2e-2b1a-4d5e-9c3b-7a1e2d4f5a6b
             */
            clientMessageId?: string;
            /** @description Id of the message being replied to. Must be in the same room; the server stores a snapshot (sender, preview, type) so the quote still renders if the original is later deleted. */
            replyToId?: string;
        };
        AddParticipantsDto: {
            /**
             * @example [
             *       "64f1a2b3c4d5e6f7a8b9c0d1"
             *     ]
             */
            participantIds: string[];
        };
        ChatPreferencesResponseDto: {
            /** @description The user. */
            userId: string;
            /** @description Teachers may start direct messages. */
            allowTeacherMessages: boolean;
            /** @description Others see when this user has read. */
            readReceipts: boolean;
            /** @description Others see this user as online / last seen. */
            showOnlineStatus: boolean;
            /** @description Chat pushes show the message text; off, they read "New message" (B10). */
            messagePreview: boolean;
            /** @description Notifications for new messages: the notification preference messagesEnabled. */
            messageNotifications: boolean;
            /** @description School announcements: the notification preference announcementsEnabled. */
            schoolAnnouncements: boolean;
        };
        UpdateChatPreferencesDto: {
            /** @description Receive notifications for new messages. Stored as the notification preference messagesEnabled. */
            messageNotifications?: boolean;
            /** @description Allow teachers to send direct messages */
            allowTeacherMessages?: boolean;
            /** @description Receive school announcements. Stored as the notification preference announcementsEnabled. */
            schoolAnnouncements?: boolean;
            /** @description Send and display read receipts */
            readReceipts?: boolean;
            /** @description Let other members see this user as online / last seen. When off, this user always shows offline to others (their own view of others is unaffected). */
            showOnlineStatus?: boolean;
            /** @description Show the message text in this user's chat pushes; off, a push reads "New message" and says only who wrote. */
            messagePreview?: boolean;
        };
        CreateClassDto: {
            /**
             * @description Name of the class
             * @example Grade 1A
             */
            name: string;
            /**
             * @description Grade level for the class
             * @example Grade 1
             */
            gradeLevel: string;
            /**
             * @description Description of the class
             * @example This is a beginner level class.
             */
            classDescription: string;
            /**
             * @description Capacity of the class
             * @example 30
             */
            classCapacity: string;
        };
        UpdateAssignedCoursesDto: {
            /**
             * @description Array of course IDs to assign to the class
             * @example [
             *       "507f1f77bcf86cd799439011"
             *     ]
             */
            courseIds: string[];
        };
        AddCourseDto: {
            /**
             * @description Course ID to add to the class
             * @example 507f1f77bcf86cd799439011
             */
            courseId: string;
        };
        RemoveCourseDto: {
            /**
             * @description Course ID to remove from the class
             * @example 507f1f77bcf86cd799439011
             */
            courseId: string;
        };
        AssignTeacherDto: {
            /**
             * @description ID of the teacher to assign to the class
             * @example 507f1f77bcf86cd799439013
             */
            teacherId: string;
        };
        LocationDto: {
            /** @example United States */
            country: string;
            /** @example California */
            state: string;
        };
        PrimaryContactDto: {
            /** @example John Doe */
            name: string;
            /** @example +1234567890 */
            phone: string;
            /** @example john.doe@school.edu */
            email: string;
            /** @example Principal */
            role: string;
        };
        CreateSchoolDto: {
            /** @example St. Mary's International School */
            name: string;
            /** @example info@stmarys.edu */
            email: string;
            /** @example 123 Education Street, Academic District */
            physicalAddress: string;
            /**
             * @example {
             *       "country": "United States",
             *       "state": "California"
             *     }
             */
            location: components["schemas"]["LocationDto"];
            /** @example SMIS */
            schoolPrefix: string;
            /** @example stmarys-international-school */
            slug?: string;
            /**
             * @example [
             *       {
             *         "name": "John Doe",
             *         "phone": "+1234567890",
             *         "email": "john.doe@school.edu",
             *         "role": "Principal"
             *       }
             *     ]
             */
            primaryContacts: components["schemas"]["PrimaryContactDto"][];
            /** @example true */
            active: boolean;
            /** @example https://example.com/school-logo.png */
            logo: string;
        };
        Location: {
            /** @example United States */
            country: string;
            /** @example California */
            state: string;
        };
        PrimaryContact: {
            /** @example John Doe */
            name: string;
            /** @example +1234567890 */
            phone: string;
            /** @example john.doe@school.edu */
            email: string;
            /** @example Principal */
            role: string;
        };
        School: {
            /** @example St. Mary's International School */
            name: string;
            /** @example info@stmarys.edu */
            email: string;
            /** @example 123 Education Street, Academic District */
            physicalAddress: string;
            /**
             * @example {
             *       "country": "United States",
             *       "state": "California"
             *     }
             */
            location: components["schemas"]["Location"];
            /** @example SMIS */
            schoolPrefix: string;
            /** @example stmarys-international-school */
            slug: string;
            /**
             * @example [
             *       {
             *         "name": "John Doe",
             *         "phone": "+1234567890",
             *         "email": "john.doe@stmarys.edu",
             *         "role": "Principal"
             *       }
             *     ]
             */
            primaryContacts: components["schemas"]["PrimaryContact"][];
            /** @example true */
            active: boolean;
            /** @example https://example.com/school-logo.png */
            logo: string;
            /** @example false */
            isDeleted: boolean;
            /**
             * Format: date-time
             * @example null
             */
            deletedAt: string;
            /** @example null */
            deletedBy: string;
        };
        UpdateLocationDto: {
            /** @example United States */
            country?: string;
            /** @example California */
            state?: string;
        };
        UpdatePrimaryContactDto: {
            /** @example John Doe */
            name?: string;
            /** @example +1234567890 */
            phone?: string;
            /** @example john.doe@school.edu */
            email?: string;
            /** @example Principal */
            role?: string;
        };
        UpdateSchoolDto: {
            /** @example St. Mary's International School */
            name?: string;
            /** @example info@stmarys.edu */
            email?: string;
            /** @example 123 Education Street, Academic District */
            physicalAddress?: string;
            /**
             * @example {
             *       "country": "United States",
             *       "state": "California"
             *     }
             */
            location?: components["schemas"]["UpdateLocationDto"];
            /** @example SMIS */
            schoolPrefix?: string;
            /**
             * @example [
             *       {
             *         "name": "John Doe",
             *         "phone": "+1234567890",
             *         "email": "john.doe@school.edu",
             *         "role": "Principal"
             *       }
             *     ]
             */
            primaryContacts?: components["schemas"]["UpdatePrimaryContactDto"][];
            /** @example true */
            active?: boolean;
            /** @example https://example.com/school-logo.png */
            logo?: string;
        };
        UpdateSchoolStatusDto: {
            /**
             * @description School active status
             * @example true
             */
            active: boolean;
        };
        SchoolDashboardDto: {
            /**
             * @description Total number of classes in the school
             * @example 25
             */
            totalClasses: number;
            /**
             * @description Total number of students in the school
             * @example 520
             */
            totalStudents: number;
            /**
             * @description Total number of teachers in the school
             * @example 35
             */
            totalTeachers: number;
            /**
             * @description Total number of subjects offered by the school
             * @example 12
             */
            totalSubjects: number;
            /**
             * @description Total number of parents in the school
             * @example 450
             */
            totalParents: number;
            /** @description List of recent classes with basic information */
            recentClasses: {
                _id?: string;
                name?: string;
                classDescription?: string;
                classCapacity?: number;
                studentCount?: number;
                /** Format: date-time */
                createdAt?: string;
            }[];
            /** @description Student distribution by grade/class */
            studentDistribution: {
                className?: string;
                studentCount?: number;
            }[];
            /** @description School information */
            schoolInfo: {
                _id?: string;
                name?: string;
                email?: string;
                schoolPrefix?: string;
                physicalAddress?: string;
                location?: {
                    country?: string;
                    state?: string;
                };
                primaryContacts?: {
                    name?: string;
                    phone?: string;
                    email?: string;
                    role?: string;
                }[];
                active?: boolean;
                /**
                 * @description School logo URL
                 * @example https://example.com/school-logo.png
                 */
                logo?: string;
                /** Format: date-time */
                createdAt?: string;
                /** Format: date-time */
                updatedAt?: string;
            };
        };
        TicketAttachmentInputDto: {
            /** @example https://res.cloudinary.com/demo/raw/upload/a.pdf */
            url: string;
            /** @example report.pdf */
            name: string;
            /** @example application/pdf */
            mimeType: string;
            /** @description Bytes, up to 25 MB. */
            size: number;
        };
        TicketContextInputDto: {
            /**
             * @description The app page, e.g. `/grading/term-2`.
             * @example /grading
             */
            path?: string;
            /**
             * @description The app's version, e.g. `1.5.0`.
             * @example 1.5.0
             */
            appVersion?: string;
            /** @description The browser's or device's user agent. */
            userAgent?: string;
        };
        CreateTicketDto: {
            /**
             * @description `school` or `talim`. Students and parents may use either; school staff
             *     (teachers, school admins, sub-admins) raise tickets to `talim` only.
             * @enum {string}
             */
            desk: "school" | "talim";
            /** @enum {string} */
            area: "grading" | "attendance" | "timetable" | "messages" | "signing_in" | "payments" | "fees" | "results" | "transport" | "behaviour" | "other";
            subject: string;
            body: string;
            attachments?: components["schemas"]["TicketAttachmentInputDto"][];
            /**
             * @description Parents only: the child (Student record id) the ticket is about. Its
             *     school becomes the ticket's school; a child not linked to the parent
             *     answers 404.
             */
            childId?: string;
            /** @description Where the requester was; desk staff see it, the requester never does. */
            context?: components["schemas"]["TicketContextInputDto"];
        };
        TicketRefDto: {
            id: string;
            name: string;
        };
        TicketAttachmentDto: {
            url: string;
            name: string;
            mimeType: string;
            /** @description Bytes; 0 when unknown (attachments migrated from a bare URL). */
            size: number;
        };
        TicketPersonDto: {
            id: string;
            name: string;
            role: string;
        };
        TicketMessageDto: {
            attachments: components["schemas"]["TicketAttachmentDto"][];
            id: string;
            author: components["schemas"]["TicketPersonDto"];
            body: string;
            /** @description Always false for a requester (internal notes are removed). */
            internal: boolean;
            /** Format: date-time */
            createdAt: string;
        };
        TicketContextDto: {
            path?: string | null;
            appVersion?: string | null;
            userAgent?: string | null;
        };
        TicketRequesterDto: {
            email?: string | null;
            id: string;
            name: string;
            role: string;
        };
        TicketDto: {
            /** @enum {string} */
            desk: "school" | "talim";
            /** @enum {string} */
            area: "grading" | "attendance" | "timetable" | "messages" | "signing_in" | "payments" | "fees" | "results" | "transport" | "behaviour" | "other";
            /** @enum {string} */
            status: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";
            /** @enum {string} */
            priority: "low" | "normal" | "high" | "urgent";
            school: components["schemas"]["TicketRefDto"] | null;
            /**
             * @description A parent's ticket about one child: its Student id (`child.id`), else
             *     null. `GET /tickets/mine` lists a parent's tickets for every child,
             *     whatever `X-Talim-Child` says.
             */
            childId: string | null;
            child: components["schemas"]["TicketRefDto"] | null;
            assignee: components["schemas"]["TicketRefDto"] | null;
            /** @enum {string|null} */
            escalatedFrom: "school" | null;
            /**
             * @description How the caller may use it: `requester`, `desk` (act on it) or
             *     `observer` (read only: Talim on a school ticket before escalation, the
             *     school desk on a ticket it escalated).
             * @enum {string}
             */
            access: "requester" | "desk" | "observer";
            /** Format: date-time */
            firstResponseAt: string | null;
            /** Format: date-time */
            resolvedAt: string | null;
            /** Format: date-time */
            closedAt: string | null;
            messages: components["schemas"]["TicketMessageDto"][];
            /**
             * Format: date-time
             * @description While resolved: the last moment it can be reopened (7 days).
             */
            reopenableUntil: string | null;
            /** Format: date-time */
            escalatedAt: string | null;
            /** @description Desk staff only (null for the requester). */
            context: components["schemas"]["TicketContextDto"] | null;
            id: string;
            /** @description `TS-XXXXX` (Talim desk) or `TCKT-XXXXXXXX` (school desk). */
            reference: string;
            subject: string;
            requester: components["schemas"]["TicketRequesterDto"];
            /** @description Messages the caller can see (internal notes count only for staff). */
            messageCount: number;
            /**
             * @description Messages the caller's side has not read: for the requester, public
             *     staff messages since they last opened the ticket (`GET /tickets/:id`)
             *     or wrote on it; for its desk, the requester's messages since a desk
             *     member last opened or acted on it. Always 0 for observers.
             */
            unread: number;
            /** Format: date-time */
            lastActivityAt: string;
            /** Format: date-time */
            createdAt: string;
        };
        TicketSummaryDto: {
            /** @enum {string} */
            desk: "school" | "talim";
            /** @enum {string} */
            area: "grading" | "attendance" | "timetable" | "messages" | "signing_in" | "payments" | "fees" | "results" | "transport" | "behaviour" | "other";
            /** @enum {string} */
            status: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";
            /** @enum {string} */
            priority: "low" | "normal" | "high" | "urgent";
            school: components["schemas"]["TicketRefDto"] | null;
            /**
             * @description A parent's ticket about one child: its Student id (`child.id`), else
             *     null. `GET /tickets/mine` lists a parent's tickets for every child,
             *     whatever `X-Talim-Child` says.
             */
            childId: string | null;
            child: components["schemas"]["TicketRefDto"] | null;
            assignee: components["schemas"]["TicketRefDto"] | null;
            /** @enum {string|null} */
            escalatedFrom: "school" | null;
            /**
             * @description How the caller may use it: `requester`, `desk` (act on it) or
             *     `observer` (read only: Talim on a school ticket before escalation, the
             *     school desk on a ticket it escalated).
             * @enum {string}
             */
            access: "requester" | "desk" | "observer";
            /** Format: date-time */
            firstResponseAt: string | null;
            /** Format: date-time */
            resolvedAt: string | null;
            /** Format: date-time */
            closedAt: string | null;
            id: string;
            /** @description `TS-XXXXX` (Talim desk) or `TCKT-XXXXXXXX` (school desk). */
            reference: string;
            subject: string;
            requester: components["schemas"]["TicketRequesterDto"];
            /** @description Messages the caller can see (internal notes count only for staff). */
            messageCount: number;
            /**
             * @description Messages the caller's side has not read: for the requester, public
             *     staff messages since they last opened the ticket (`GET /tickets/:id`)
             *     or wrote on it; for its desk, the requester's messages since a desk
             *     member last opened or acted on it. Always 0 for observers.
             */
            unread: number;
            /** Format: date-time */
            lastActivityAt: string;
            /** Format: date-time */
            createdAt: string;
        };
        TicketListResponseDto: {
            data: components["schemas"]["TicketSummaryDto"][];
            meta: components["schemas"]["PageMetaDto"];
        };
        TicketCountsDto: {
            open: number;
            in_progress: number;
            waiting_on_user: number;
            resolved: number;
            closed: number;
            /** @description Every ticket counted, whatever its status. */
            total: number;
            /** @description Not resolved or closed, and nobody assigned. */
            unassigned: number;
            /** @description Not resolved or closed, and assigned to the caller. */
            mine: number;
        };
        TicketStaffDto: {
            email: string | null;
            id: string;
            name: string;
            /** @description `admin` (Talim), `school_admin` or `school_sub_admin`. */
            role: string;
        };
        AddTicketMessageDto: {
            body: string;
            attachments?: components["schemas"]["TicketAttachmentInputDto"][];
            /** @description Desk staff only: a note the requester never sees. */
            internal?: boolean;
            /**
             * @description Desk staff only: the status to set with this reply (one write, one
             *     notification). Without it, a public staff reply moves an `open` ticket
             *     to `in_progress`.
             * @enum {string}
             */
            status?: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";
        };
        UpdateTicketDto: {
            /** @enum {string} */
            status?: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";
            /** @enum {string} */
            priority?: "low" | "normal" | "high" | "urgent";
            /** @description A staff user of the ticket's desk; `null` unassigns. */
            assigneeId?: string | null;
        };
        EscalateTicketDto: {
            /** @description Why it goes to Talim; kept as an internal note on the ticket. */
            note: string;
        };
        CreateComplaintDto: {
            /**
             * @deprecated
             * @description Ignored: the server issues the ticket number. Still accepted so older
             *     clients that send one keep working.
             */
            ticket?: string;
            /**
             * @description Subject of the complaint
             * @example Service Delay
             */
            subject: string;
            /**
             * @description Detailed complaint description
             * @example My request has not been processed for over two weeks.
             */
            description: string;
            /**
             * @deprecated
             * @description Ignored: every new complaint starts as Pending. Accepted for older clients.
             */
            status?: string;
            /**
             * @description URL or path to the attachment file
             * @example https://example.com/attachment.pdf
             */
            attachment?: string;
        };
        ComplaintAuthorDto: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            schoolId?: string;
        };
        ComplaintDto: {
            userId: string | components["schemas"]["ComplaintAuthorDto"];
            _id: string;
            /** @description Unique ticket number; accepted by `GET /complaints/:id`. */
            ticket: string;
            subject: string;
            description: string;
            schoolId?: string;
            /** @description URL of the attachment, if any. */
            attachment?: string;
            /** @enum {string} */
            status: "Pending" | "In Progress" | "Resolved";
            assignedAdmin?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdateComplaintStatusDto: {
            /**
             * @description Status of the complaint
             * @example In Progress
             * @enum {string}
             */
            status: "Pending" | "In Progress" | "Resolved";
        };
        UpdateComplaintDto: {
            /** @example Service Delay */
            subject?: string;
            /** @example My request has not been processed for over two weeks. */
            description?: string;
            /** @example https://example.com/attachment.pdf */
            attachment?: string;
        };
        FeeDashboardSummaryDto: {
            totalFeeItems: number;
            activeFeeItems: number;
            totalExpectedAmount: number;
            paidAmount: number;
            outstandingAmount: number;
            feeCategories: number;
            activeAssignments: number;
        };
        FeeCategorySummaryDto: {
            feeCount: number;
            _id: string;
            name: string;
            description: string;
            schoolId: string;
            /** @enum {string} */
            status: "active" | "archived";
            createdBy?: string;
            updatedBy?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ReceiptSettingsDto: {
            /** @description Who last changed them (user id); absent until first saved. */
            updatedBy?: string | null;
            /** @description ISO instant; absent until first saved. */
            updatedAt?: string;
            /** @description The school (string id). */
            schoolId: string;
            signatureUrl: string;
            signatureName: string;
            signatureTitle: string;
            showSchoolLogo: boolean;
            /** @description Parents may download their receipts (C5 enforces it). */
            allowParentDownload: boolean;
            showQrVerification: boolean;
            showAuthorizedSignature: boolean;
            /** @description Up to 250 characters. */
            footerNote: string;
        };
        UpdateReceiptSettingsDto: {
            showSchoolLogo?: boolean;
            allowParentDownload?: boolean;
            showQrVerification?: boolean;
            showAuthorizedSignature?: boolean;
            footerNote?: string;
            signatureName?: string;
            signatureTitle?: string;
            signatureUrl?: string;
        };
        CreateFeeCategoryDto: {
            name: string;
            description?: string;
        };
        FeeCategoryDto: {
            _id: string;
            name: string;
            description: string;
            schoolId: string;
            /** @enum {string} */
            status: "active" | "archived";
            createdBy?: string;
            updatedBy?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdateFeeCategoryDto: {
            name?: string;
            description?: string;
            /** @enum {string} */
            status?: "active" | "archived";
        };
        CreateFeeItemDto: {
            name: string;
            categoryId: string;
            description?: string;
            academicYearId?: string;
            termId?: string;
            /** @enum {string} */
            feeType: "one_time" | "recurring" | "termly" | "annual";
            defaultAmount: number;
            defaultDueDate?: string;
            lateFeeAmount?: number;
            allowPartialPayment?: boolean;
            isVisibleToParents?: boolean;
            includeInCollection?: boolean;
            /** @enum {string} */
            status?: "draft" | "active" | "inactive" | "archived";
        };
        NamedRefDto: {
            _id: string;
            name: string;
        };
        FeeItemDto: {
            categoryId: string | components["schemas"]["NamedRefDto"];
            _id: string;
            name: string;
            description: string;
            schoolId: string;
            academicYearId?: string;
            termId?: string;
            /** @enum {string} */
            feeType: "one_time" | "recurring" | "termly" | "annual";
            defaultAmount: number;
            /** Format: date-time */
            defaultDueDate?: string;
            lateFeeAmount: number;
            allowPartialPayment: boolean;
            isVisibleToParents: boolean;
            includeInCollection: boolean;
            /** @enum {string} */
            status: "draft" | "active" | "inactive" | "archived";
            createdBy?: string;
            updatedBy?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        FeeItemListResponseDto: {
            data: components["schemas"]["FeeItemDto"][];
            /** @description Total matching items across all pages. */
            total: number;
        };
        UpdateFeeItemDto: {
            name?: string;
            categoryId?: string;
            description?: string;
            academicYearId?: string;
            termId?: string;
            /** @enum {string} */
            feeType?: "one_time" | "recurring" | "termly" | "annual";
            defaultAmount?: number;
            defaultDueDate?: string;
            lateFeeAmount?: number;
            allowPartialPayment?: boolean;
            isVisibleToParents?: boolean;
            includeInCollection?: boolean;
            /** @enum {string} */
            status?: "draft" | "active" | "inactive" | "archived";
        };
        ClassAssignmentOverrideDto: {
            classId: string;
            amount: number;
            dueDate: string;
            lateFeeAmount?: number;
            isVisibleToParents?: boolean;
        };
        AssignFeeToClassesDto: {
            feeItemId: string;
            academicYearId?: string;
            termId?: string;
            classes: components["schemas"]["ClassAssignmentOverrideDto"][];
        };
        FeeItemRefDto: {
            _id: string;
            name: string;
            /** @enum {string} */
            feeType: "one_time" | "recurring" | "termly" | "annual";
            defaultAmount?: number;
        };
        ClassRefDto: {
            _id: string;
            name: string;
            gradeLevel?: string;
        };
        FeeAssignmentDto: {
            feeItemId: string | components["schemas"]["FeeItemRefDto"];
            classId: string | components["schemas"]["ClassRefDto"];
            academicYearId?: string | components["schemas"]["NamedRefDto"];
            termId?: string | components["schemas"]["NamedRefDto"];
            _id: string;
            schoolId: string;
            amount: number;
            /** Format: date-time */
            dueDate: string;
            lateFeeAmount: number;
            isVisibleToParents: boolean;
            /** @enum {string} */
            status: "draft" | "active" | "inactive" | "archived";
            assignedBy?: string;
            updatedBy?: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        AssignFeeResponseDto: {
            /** @description Assignments created. */
            assigned: number;
            /** @description Classes that already had this fee for the year/term. */
            skipped: number;
            skippedClassIds: string[];
            assignments: components["schemas"]["FeeAssignmentDto"][];
        };
        FeeAssignmentListResponseDto: {
            data: components["schemas"]["FeeAssignmentDto"][];
            /** @description Total matching assignments across all pages. */
            total: number;
        };
        UpdateFeeAssignmentDto: {
            amount?: number;
            dueDate?: string;
            lateFeeAmount?: number;
            isVisibleToParents?: boolean;
            /** @enum {string} */
            status?: "draft" | "active" | "inactive" | "archived";
        };
        CreateManualPaymentDto: {
            feeAssignmentId: string;
            studentId: string;
            parentId?: string;
            amountPaid: number;
            /** @enum {string} */
            paymentMethod: "cash" | "bank_transfer" | "card" | "cheque" | "mobile_money" | "other";
            transactionReference?: string;
            paidAt?: string;
            notes?: string;
        };
        PaymentAllocationDto: {
            feeAssignmentId: string;
            /** @description Integer kobo. */
            amountKobo: number;
        };
        PaymentReviewFlagDto: {
            /** @enum {string} */
            reason: "amount_mismatch" | "currency_mismatch" | "overpaid";
            /** @description `verify`, `webhook` or `settlement`. */
            source: string;
            /** @description Kobo the transaction expected. */
            expectedMinor?: number;
            /** @description Kobo the provider reported. */
            receivedMinor?: number;
            expectedCurrency?: string;
            receivedCurrency?: string;
            /** Format: date-time */
            flaggedAt: string;
        };
        BankTransferInfoDto: {
            transferReference: string;
            /** Format: date-time */
            paidOn: string;
            proofUrl: string;
            reviewedBy?: string;
            /** Format: date-time */
            reviewedAt?: string;
            rejectionReason?: string;
        };
        PaymentTransactionDto: {
            /** @enum {string} */
            method: "online" | "manual" | "bank_transfer";
            _id: string;
            schoolId: string;
            parentId: string;
            /** @description The child's Student profile id. */
            studentId: string;
            classId?: string;
            termId?: string;
            feeAssignmentIds: string[];
            /** @description Which fees the payment pays, in kobo. */
            allocations: components["schemas"]["PaymentAllocationDto"][];
            /**
             * @description Online checkouts only.
             * @enum {string}
             */
            providerName?: "paystack" | "opay" | "stripe";
            providerReference: string;
            /** @description The reference clients pass to `GET /payments/parent/verify/:reference`. */
            internalReference: string;
            /** @description Sum of the fee amounts. */
            amount: number;
            platformFee: number;
            providerFee: number;
            /** @description What the school's wallet is credited with. */
            schoolAmount: number;
            /** @description What the parent is charged. */
            totalAmount: number;
            /** @description `totalAmount` in integer kobo: what the provider must report back. */
            totalKobo?: number;
            currency: string;
            /** @enum {string} */
            status: "pending" | "successful" | "failed" | "cancelled" | "refunded" | "partial";
            /** @description Set when the provider reported another amount or currency (nothing settled), or money exceeded what was owed. */
            reviewFlag?: components["schemas"]["PaymentReviewFlagDto"];
            /** @description Bank transfers only. */
            bankTransfer?: components["schemas"]["BankTransferInfoDto"];
            /** @enum {string} */
            paymentChannel?: "card" | "bank_transfer" | "ussd" | "wallet" | "bank" | "mobile_money";
            checkoutUrl: string;
            /** Format: date-time */
            paidAt?: string;
            /** Format: date-time */
            failedAt?: string;
            failureReason: string;
            receiptId?: string;
            walletLedgerEntryId?: string;
            metadata?: Record<string, never>;
            webhookEvents: Record<string, never>[];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ReceiptFeeItemDto: {
            feeAssignmentId?: string;
            feeName: string;
            category: string;
            description: string;
            amount: number;
        };
        PaymentReceiptDto: {
            _id: string;
            schoolId: string;
            parentId: string;
            studentId: string;
            classId?: string;
            transactionId: string;
            /** @description The term of the fees paid. */
            termId?: string;
            receiptNumber: string;
            feeItems: components["schemas"]["ReceiptFeeItemDto"][];
            subtotal: number;
            lateFee: number;
            discount: number;
            totalPaid: number;
            currency: string;
            paymentMethod: string;
            paymentProvider: string;
            transactionReference: string;
            /** Format: date-time */
            paymentDate: string;
            receiptPdfUrl: string;
            verificationCode: string;
            verificationQrUrl: string;
            /** @enum {string} */
            status: "issued" | "voided";
            /** Format: date-time */
            issuedAt: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        AllocationDto: {
            feeAssignmentId: string;
            /** @description Naira. */
            amount: number;
        };
        ManualPaymentResponseDto: {
            success: boolean;
            transaction: components["schemas"]["PaymentTransactionDto"];
            receipt?: components["schemas"]["PaymentReceiptDto"];
            /** @description How the amount was spread over the fees, by due date (naira). */
            allocations: components["schemas"]["AllocationDto"][];
        };
        FeePaymentDto: {
            /** @description The ledger row; null for a fee nobody has paid towards yet (`recorded: false`). */
            _id: string | null;
            feeAssignmentId: string | components["schemas"]["FeeAssignmentDto"];
            /** @enum {string} */
            status: "unpaid" | "part_paid" | "paid";
            /** @description The late fee was added (it stays once added). */
            lateFeeApplied?: boolean;
            /**
             * @description `GET /fees/payments/student/:studentId`: the late fee inside
             *     `amountDue` (0 until it applies).
             */
            lateFee?: number;
            /**
             * @description `GET /fees/payments/student/:studentId`: false for a fee of the child's
             *     class nobody has paid towards yet (no ledger row; the figures are
             *     computed as the family fees compute them).
             */
            recorded?: boolean;
            schoolId: string;
            /** @description The child's Student id. */
            studentId: string;
            classId?: string;
            termId?: string;
            /** @description What is due: the fee, plus its late fee once that applies. */
            amountDue: number;
            amountPaid: number;
            balance: number;
            /** Format: date-time */
            lastPaymentAt?: string;
            /** @description Deprecated alias of `amountDue`. */
            amountExpected: number;
            /**
             * @description Deprecated: `successful`, `partial` or `pending`.
             * @enum {string}
             */
            paymentStatus: "pending" | "successful" | "failed" | "refunded" | "partial";
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        FeePaymentListResponseDto: {
            data: components["schemas"]["FeePaymentDto"][];
            total: number;
        };
        UpdateSchoolProfileDto: {
            physicalAddress?: string;
            logo?: string;
            contactPhone?: string;
            website?: string;
            primaryContacts?: components["schemas"]["UpdatePrimaryContactDto"][];
        };
        ReceiptSettingsResponseDto: {
            settings: components["schemas"]["ReceiptSettingsDto"];
            success: boolean;
        };
        FinanceSettingsDto: {
            defaultBankAccountId: string | null;
            /** @description Absent until the school first saves its finance settings. */
            _id?: string;
            schoolId: string;
            /** @description Withdrawals need an emailed one-time code. */
            requireEmailOtpForWithdrawals: boolean;
            minimumWithdrawalAmount: number;
            /** @description The least a parent may pay towards a fee that allows part payment; 0 for no minimum. */
            minimumPartPayment: number;
            updatedBy?: string;
            createdAt?: string;
            updatedAt?: string;
        };
        FinanceSettingsResponseDto: {
            settings: components["schemas"]["FinanceSettingsDto"];
            success: boolean;
        };
        UpdateFinanceSettingsDto: {
            requireEmailOtpForWithdrawals?: boolean;
            minimumWithdrawalAmount?: number;
            defaultBankAccountId?: string;
            /** @description Smallest part payment parents may make, in naira (0: no minimum). */
            minimumPartPayment?: number;
        };
        AcademicPeriodResponseDto: {
            key: string;
            label: string;
            /** @description `HH:mm`. */
            startTime: string;
            /** @description `HH:mm`. */
            endTime: string;
            isBreak: boolean;
        };
        GradeScaleBandResponseDto: {
            remark: string | null;
            letter: string;
            /** @description Lowest percentage (0..100) that earns the letter. */
            min: number;
        };
        OfficeHoursDto: {
            /** @example 08:00 */
            start: string;
            /** @example 16:00 */
            end: string;
        };
        AcademicSettingsDto: {
            schoolDays: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
            /** @description Ordered by start time; empty when the school has not set any. */
            periods: components["schemas"]["AcademicPeriodResponseDto"][];
            /**
             * @description `YYYY-MM-DD`. From this day on a register counts as submitted only when
             *     it was submitted; before it, a full set of attendance rows counts
             *     (`inferred`). Set by the server, never by PATCH.
             * @example 2026-09-28
             */
            registerTrackingSince: string;
            /**
             * @description The grading scale, highest band first. The default until the school
             *     sets one: A 70 Excellent, B 60 Very good, C 50 Good, D 45 Fair,
             *     E 40 Pass, F 0 Fail.
             */
            gradeScale: components["schemas"]["GradeScaleBandResponseDto"][];
            /** @description When the school office answers; null when not set. Always sent. */
            officeHours: components["schemas"]["OfficeHoursDto"] | null;
            schoolId: string;
            timezone: string;
            /** @description `HH:mm`. */
            registerCloseTime: string;
            /** @description `HH:mm`. */
            registerEditUntil: string;
            /** @description Percentage at or above which a score passes; 50 by default. */
            passMark: number;
        };
        AcademicSettingsResponseDto: {
            settings: components["schemas"]["AcademicSettingsDto"];
            success: boolean;
        };
        AcademicPeriodDto: {
            /**
             * @description `HH:mm`, 24-hour.
             * @example 08:00
             */
            startTime: string;
            /**
             * @description `HH:mm`, 24-hour.
             * @example 08:40
             */
            endTime: string;
            /** @description Stable key timetable entries point at, e.g. `p1` or `brk`. */
            key: string;
            /** @description Shown to people, e.g. "Period 1" or "Break". */
            label: string;
            isBreak?: boolean;
        };
        GradeScaleBandDto: {
            /**
             * @description The letter, 1..4 characters, e.g. `A` or `B2`; unique ignoring case.
             * @example A
             */
            letter: string;
            /**
             * @description Lowest percentage (0..100) that earns the letter.
             * @example 70
             */
            min: number;
            /**
             * @description Shown beside the letter, up to 60 characters, e.g. "Excellent".
             * @example Excellent
             */
            remark?: string;
        };
        UpdateAcademicSettingsDto: {
            /**
             * @example [
             *       "Monday",
             *       "Tuesday",
             *       "Wednesday",
             *       "Thursday",
             *       "Friday"
             *     ]
             */
            schoolDays?: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[];
            periods?: components["schemas"]["AcademicPeriodDto"][];
            /** @description The grading scale, highest band first. Replaces the whole scale. */
            gradeScale?: components["schemas"]["GradeScaleBandDto"][];
            /**
             * @description Percentage (0..100) at or above which a score passes.
             * @example 50
             */
            passMark?: number;
            /**
             * @description When the school office answers, shown to teachers (§36); `null`
             *     clears it. The end must be after the start.
             */
            officeHours?: components["schemas"]["OfficeHoursDto"] | null;
            /** @description IANA timezone, e.g. `Africa/Lagos`. */
            timezone?: string;
            /** @description `HH:mm`; the morning register is due by this time. */
            registerCloseTime?: string;
            /** @description `HH:mm`; after this a teacher can no longer change the day's register. */
            registerEditUntil?: string;
        };
        SessionTermRefDto: {
            /** @description The session (academic year), e.g. "2026/2027"; null when unknown. */
            session: string | null;
            id: string;
            name: string;
        };
        SchoolRefDto: {
            id: string;
            name: string;
        };
        FamilyChildRefDto: {
            id: string;
            name: string;
            school: components["schemas"]["SchoolRefDto"] | null;
        };
        FeePartDto: {
            label: string;
            amount: number;
        };
        FamilyFeeItemDto: {
            /** @enum {string} */
            status: "paid" | "part_paid" | "overdue" | "due";
            /** @description The fee assignment id. */
            id: string;
            label: string;
            category: string;
            /** Format: date-time */
            dueDate: string | null;
            /** @description Due: the fee, plus its late fee once that applies. */
            amount: number;
            paid: number;
            balance: number;
            allowPartial: boolean;
            parts: components["schemas"]["FeePartDto"][];
            /** @description A checkout or bank transfer already holds this fee. */
            pendingPayment: boolean;
            termId: string | null;
            /** @description The late fee inside `amount` (naira); 0 until it applies. */
            lateFee: number;
        };
        FamilyChildFeesDto: {
            /** @description The term the bill is for: the one asked for, else the school's current one. */
            term: components["schemas"]["SessionTermRefDto"] | null;
            child: components["schemas"]["FamilyChildRefDto"];
            outstanding: number;
            paid: number;
            billTotal: number;
            /** @description Balance of fees past their due date. */
            overdue: number;
            items: components["schemas"]["FamilyFeeItemDto"][];
            /** @description The school's minimum part payment (naira); 0 when it has none. */
            minimumPartPayment: number;
        };
        FamilyTotalsDto: {
            outstanding: number;
            /** @description Paid on fees of each school's current session. */
            paidThisSession: number;
            /** @description Issued receipts (in the term, when one is given). */
            receipts: number;
            overdue: number;
        };
        FamilyFeesResponseDto: {
            children: components["schemas"]["FamilyChildFeesDto"][];
            totals: components["schemas"]["FamilyTotalsDto"];
        };
        DueFeeDto: {
            /** @enum {string} */
            status: "overdue" | "due";
            /** @description The fee assignment id: pass it in `feeAssignmentIds` when initialising a payment. */
            _id: string;
            feeName: string;
            category: string;
            feeType: string;
            description: string;
            /** @description What is left of the fee itself. */
            amount: number;
            /** Format: date-time */
            dueDate: string;
            /** @description What is left of the late fee; it counts only when `isOverdue`. */
            lateFeeAmount: number;
            isOverdue: boolean;
            /** @description Paid so far. */
            paid: number;
            /** @description Still owed (fee plus any late fee that applies). */
            balance: number;
            allowPartial: boolean;
            /** @description A checkout or bank transfer already holds this fee. */
            pendingPayment: boolean;
        };
        DueFeesResponseDto: {
            fees: components["schemas"]["DueFeeDto"][];
        };
        PaymentSummaryDto: {
            /** @example true */
            success: boolean;
            /** @description Sum of the SUCCESSFUL payments for the linked children. */
            totalPaid: number;
            /** @description The money still owed on every linked child’s active fees (balances from the fee ledger, late fees included once they apply). */
            totalOutstanding: number;
            /** @description Checkouts started but not finished (PENDING online payments). Not money owed. */
            pendingCheckout: number;
            /** @description Bank transfers reported and awaiting the bursary. */
            pendingBankTransfer: number;
            /**
             * @deprecated
             * @description Deprecated alias of `pendingCheckout`, kept for older clients.
             */
            pendingCheckoutTotal: number;
            /** @description Number of receipts issued for the linked children. */
            totalReceipts: number;
        };
        PersonRefDto: {
            id: string;
            name: string;
        };
        PaidItemDto: {
            feeAssignmentId: string;
            label: string;
            amount: number | null;
        };
        ParentHistoryRowDto: {
            /** @enum {string} */
            methodKind: "online" | "manual" | "bank_transfer";
            id: string;
            /**
             * Format: date-time
             * @description When it was paid (or created, while pending).
             */
            date: string;
            child: components["schemas"]["PersonRefDto"];
            items: components["schemas"]["PaidItemDto"][];
            amount: number;
            /** @description `paystack`, `opay`, `stripe`, `bank_transfer`, or the manual method (`cash`...). */
            method: string;
            reference: string;
            /** @enum {string} */
            status: "pending" | "successful" | "failed" | "cancelled" | "refunded" | "partial";
            receiptId: string | null;
            _id: string;
            studentId: string;
            internalReference: string;
            totalAmount: number;
            currency: string;
            /** @enum {string} */
            providerName?: "paystack" | "opay" | "stripe";
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            paidAt?: string;
            /** @description Bank transfers only: the reported transfer and the bursary's decision. */
            bankTransfer?: components["schemas"]["BankTransferInfoDto"];
        };
        ParentHistoryResponseDto: {
            data: components["schemas"]["ParentHistoryRowDto"][];
            total: number;
            page: number;
            limit: number;
        };
        ReceiptSchoolDto: {
            id: string;
            name: string;
            logo: string;
            address: string;
        };
        ReceiptLineDto: {
            feeAssignmentId: string | null;
            label: string;
            category: string;
            amount: number;
        };
        ParentReceiptDto: {
            term: components["schemas"]["SessionTermRefDto"] | null;
            id: string;
            school: components["schemas"]["ReceiptSchoolDto"] | null;
            child: components["schemas"]["PersonRefDto"];
            items: components["schemas"]["ReceiptLineDto"][];
            /** @description False when the school does not let parents download receipts (the download route answers 403). */
            downloadAllowed: boolean;
            _id: string;
            schoolId: string;
            parentId: string;
            studentId: string;
            classId?: string;
            transactionId: string;
            /** @description The term of the fees paid. */
            termId?: string;
            receiptNumber: string;
            feeItems: components["schemas"]["ReceiptFeeItemDto"][];
            subtotal: number;
            lateFee: number;
            discount: number;
            totalPaid: number;
            currency: string;
            paymentMethod: string;
            paymentProvider: string;
            transactionReference: string;
            /** Format: date-time */
            paymentDate: string;
            receiptPdfUrl: string;
            verificationCode: string;
            verificationQrUrl: string;
            /** @enum {string} */
            status: "issued" | "voided";
            /** Format: date-time */
            issuedAt: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ParentReceiptListResponseDto: {
            data: components["schemas"]["ParentReceiptDto"][];
            total: number;
            page: number;
            limit: number;
            /** @description The terms the children (or the one child) have receipts in, newest first: the term picker. */
            terms: components["schemas"]["SessionTermRefDto"][];
        };
        ParentReceiptResponseDto: {
            success: boolean;
            receipt: components["schemas"]["ParentReceiptDto"];
        };
        InitializePaymentDto: {
            /** @description The child's Student profile id; optional when `X-Talim-Child` names the child. */
            childId?: string;
            /** @description Deprecated alias of `childId`. */
            studentId?: string;
            feeAssignmentIds: string[];
            /**
             * @description What to pay now, in naira (at most two decimals). Omit to pay every
             *     selected balance in full. Less than the total needs every selected fee
             *     to allow part payment and at least the school's minimum.
             */
            amount?: number;
            /** @enum {string} */
            provider?: "paystack" | "opay" | "stripe";
            /**
             * @description Deprecated alias of `provider`.
             * @enum {string}
             */
            providerName?: "paystack" | "opay" | "stripe";
            /**
             * @description A client-made key for this checkout attempt (8-100 of `A-Z a-z 0-9 _ -`).
             *     Sending the same key again returns the same checkout instead of starting
             *     another. Strongly recommended; required by the redesigned app.
             */
            idempotencyKey?: string;
            /** @enum {string} */
            paymentChannel?: "card" | "bank_transfer" | "ussd" | "wallet" | "bank" | "mobile_money";
        };
        InitializePaymentResponseDto: {
            /** @description The transaction reference; the provider redirects back with it. */
            reference: string;
            /** @description Hosted checkout to send the parent to (empty if the provider call is still running for a replayed key). */
            checkoutUrl: string;
            /** @description Which fees this payment pays, by due date. */
            allocations: components["schemas"]["AllocationDto"][];
            /** @enum {string} */
            status: "pending" | "successful" | "failed" | "cancelled" | "refunded" | "partial";
            /** @description True when an earlier request with the same idempotency key created this checkout. */
            replayed: boolean;
            transactionId: string;
            internalReference: string;
            /** @description What the parent is charged. */
            amount: number;
            subtotal: number;
            lateFee: number;
            platformFee: number;
            schoolAmount: number;
            currency: string;
            /** @enum {string} */
            provider: "paystack" | "opay" | "stripe";
        };
        VerifyPaymentResponseDto: {
            success: boolean;
            /** @enum {string} */
            status: "pending" | "successful" | "failed" | "cancelled" | "refunded" | "partial";
            transaction: components["schemas"]["PaymentTransactionDto"];
            /** @description Present once the payment has settled. */
            receipt?: components["schemas"]["PaymentReceiptDto"];
            /** @description Present when the provider reported another amount or currency: nothing was settled. */
            reviewFlag?: components["schemas"]["PaymentReviewFlagDto"];
        };
        BankDetailsResponseDto: {
            bankName: string;
            accountName: string;
            accountNumber: string;
            school: components["schemas"]["SchoolRefDto"] | null;
        };
        BankTransferDto: {
            /** @description The child; optional when `X-Talim-Child` names the child. */
            childId?: string;
            feeAssignmentIds: string[];
            /** @description What the parent transferred, in naira. */
            amount: number;
            /** @description The bank's reference or narration for the transfer. */
            transferReference: string;
            /** @description The day the transfer was made (ISO date). */
            paidOn: string;
            /** @description A link to the uploaded proof (receipt screenshot), if any. */
            proofUrl?: string;
        };
        SubmittedBankTransferDto: {
            /** @enum {string} */
            status: "pending";
            id: string;
            /** @description The transaction reference. */
            reference: string;
            amount: number;
            transferReference: string;
            /** Format: date-time */
            paidOn: string;
            allocations: components["schemas"]["AllocationDto"][];
        };
        BankTransferSubmittedResponseDto: {
            success: boolean;
            transfer: components["schemas"]["SubmittedBankTransferDto"];
        };
        EnabledProviderDto: {
            /** @enum {string} */
            providerName: "paystack" | "opay" | "stripe";
            isEnabled: boolean;
            /** @enum {string} */
            environment: "test" | "live";
            supportedChannels: ("card" | "bank_transfer" | "ussd" | "wallet" | "bank" | "mobile_money")[];
            currency: string;
        };
        EnabledProvidersResponseDto: {
            providers: components["schemas"]["EnabledProviderDto"][];
        };
        TransferChildRefDto: {
            /** @description The child's class; null when the class is gone. */
            class: components["schemas"]["ClassRefDto"] | null;
            id: string;
            name: string;
            admissionNumber?: string;
        };
        AdminBankTransferDto: {
            /** @enum {string} */
            status: "pending" | "confirmed" | "rejected";
            id: string;
            reference: string;
            amount: number;
            /** Format: date-time */
            submittedAt: string;
            child: components["schemas"]["TransferChildRefDto"];
            parent: components["schemas"]["PersonRefDto"];
            items: components["schemas"]["PaidItemDto"][];
            transferReference: string;
            /** Format: date-time */
            paidOn: string | null;
            proofUrl: string;
            /** Format: date-time */
            reviewedAt: string | null;
            rejectionReason: string;
            receiptId: string | null;
        };
        AdminBankTransferListResponseDto: {
            data: components["schemas"]["AdminBankTransferDto"][];
            total: number;
            page: number;
            limit: number;
        };
        BankTransferDecisionResponseDto: {
            success: boolean;
            transaction: components["schemas"]["PaymentTransactionDto"];
            /** @description Confirm only. */
            receipt?: components["schemas"]["PaymentReceiptDto"];
        };
        RejectBankTransferDto: {
            /** @description Shown to the parent. */
            reason: string;
        };
        PaginationInfoDto: {
            page: number;
            limit: number;
            total: number;
            /** @description Number of pages at this `limit`. */
            pages: number;
        };
        AdminTransactionListResponseDto: {
            success: boolean;
            data: components["schemas"]["PaymentTransactionDto"][];
            pagination: components["schemas"]["PaginationInfoDto"];
        };
        AdminPaymentSummaryDto: {
            totalTransactions: number;
            /** @description Sum of `totalAmount` over successful transactions. */
            totalPaid: number;
            totalPending: number;
            totalFailed: number;
        };
        AdminReceiptListResponseDto: {
            success: boolean;
            data: components["schemas"]["PaymentReceiptDto"][];
            pagination: components["schemas"]["PaginationInfoDto"];
        };
        ReceiptResponseDto: {
            success: boolean;
            receipt: components["schemas"]["PaymentReceiptDto"];
        };
        ManualPaymentDto: {
            studentId: string;
            feeAssignmentIds: string[];
            amount: number;
            paymentMethod: string;
            /** @description The school's own reference (teller number...). Stored as the external reference; the transaction reference is always generated. */
            reference?: string;
            /** @description When the money was received (defaults to now). */
            paidAt?: string;
            notes?: string;
        };
        RefundPaymentDto: {
            /**
             * @description Amount to refund in NGN. Defaults to the full payment.
             * @example 15000
             */
            amount?: number;
            /**
             * @description Why the payment is being refunded; shown to the parent.
             * @example Duplicate payment
             */
            reason: string;
        };
        RefundPaymentResponseDto: {
            success: boolean;
            transaction: components["schemas"]["PaymentTransactionDto"];
            refundedAmount: number;
            /** @description Amount taken back from the school wallet. */
            walletDebit: number;
        };
        PlatformProviderDto: {
            /** @enum {string} */
            providerName: "paystack" | "opay" | "stripe";
            isEnabled: boolean;
            isDefault: boolean;
            publicKey: string;
            /** @enum {string} */
            environment: "test" | "live";
            supportedChannels: ("card" | "bank_transfer" | "ussd" | "wallet" | "bank" | "mobile_money")[];
            platformFeePercent: number;
            currency: string;
            merchantId: string;
            updatedBy?: string;
            /** Format: date-time */
            updatedAt: string;
        };
        PlatformProvidersResponseDto: {
            success: boolean;
            providers: components["schemas"]["PlatformProviderDto"][];
        };
        PlatformProviderConfigDto: {
            isDefault?: boolean;
            publicKey?: string;
            secretKey?: string;
            webhookSecret?: string;
            merchantId?: string;
            /** @enum {string} */
            environment?: "test" | "live";
            supportedChannels?: ("card" | "bank_transfer" | "ussd" | "wallet" | "bank" | "mobile_money")[];
            platformFeePercent?: number;
        };
        UpdatePlatformProviderResponseDto: {
            success: boolean;
            /** @enum {string} */
            providerName: "paystack" | "opay" | "stripe";
            isEnabled: boolean;
        };
        SuccessMessageResponseDto: {
            success: boolean;
            /** @description Human-readable confirmation, safe to show. */
            message: string;
        };
        WalletSummaryDto: {
            ledgerBalance: number;
            /** @description What can be withdrawn now. */
            availableBalance: number;
            /** @description Funds held by withdrawals in flight. */
            pendingBalance: number;
            withdrawnBalance: number;
            currency: string;
            /** @enum {string} */
            status: "active" | "suspended" | "closed";
            /** Format: date-time */
            lastTransactionAt?: string;
            thisMonthRevenue: number;
        };
        WalletSummaryResponseDto: {
            success: boolean;
            summary: components["schemas"]["WalletSummaryDto"];
        };
        WalletLedgerEntryDto: {
            _id: string;
            schoolId: string;
            walletId: string;
            /** @enum {string} */
            type: "credit_payment" | "debit_withdrawal" | "withdrawal_reversal" | "platform_fee" | "refund" | "manual_adjustment";
            /** @enum {string} */
            direction: "credit" | "debit";
            amount: number;
            balanceBefore: number;
            balanceAfter: number;
            currency: string;
            reference: string;
            relatedPaymentTransactionId?: string;
            relatedWithdrawalId?: string;
            description: string;
            /** @enum {string} */
            status: "pending" | "posted" | "reversed" | "failed";
            createdBy?: string;
            metadata?: Record<string, never>;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        WalletTransactionListResponseDto: {
            success: boolean;
            data: components["schemas"]["WalletLedgerEntryDto"][];
            pagination: components["schemas"]["PaginationInfoDto"];
        };
        BankDto: {
            name: string;
            code: string;
            slug?: string;
            longcode?: string;
            country?: string;
            currency?: string;
            type?: string;
            active?: boolean;
        };
        BankListResponseDto: {
            success: boolean;
            banks: components["schemas"]["BankDto"][];
        };
        ResolveAccountResponseDto: {
            success: boolean;
            accountName: string;
        };
        SchoolBankAccountDto: {
            _id: string;
            schoolId: string;
            bankName: string;
            bankCode: string;
            accountNumber: string;
            accountName: string;
            isVerified: boolean;
            isDefault: boolean;
            /** Format: date-time */
            verifiedAt?: string;
            verificationProvider: string;
            addedBy: string;
            /** @enum {string} */
            status: "active" | "inactive" | "removed";
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        BankAccountListResponseDto: {
            success: boolean;
            accounts: components["schemas"]["SchoolBankAccountDto"][];
        };
        AddBankAccountDto: {
            bankName: string;
            bankCode: string;
            accountNumber: string;
            accountName: string;
            country?: string;
        };
        BankAccountResponseDto: {
            success: boolean;
            account: components["schemas"]["SchoolBankAccountDto"];
        };
        InitiateWithdrawalDto: {
            bankAccountId: string;
            amount: number;
            note?: string;
        };
        InitiateWithdrawalResponseDto: {
            success: boolean;
            /** @description Pass to the next steps. */
            withdrawalDraftId: string;
            /** @description The address the code was sent to, partly hidden. */
            maskedEmail: string;
            /** @description Seconds until the code expires. */
            expiresIn: number;
            message: string;
        };
        ResendWithdrawalOtpDto: {
            withdrawalDraftId: string;
        };
        ResendWithdrawalOtpResponseDto: {
            success: boolean;
            maskedEmail: string;
            /** @description Seconds until the new code expires. */
            expiresIn: number;
            message: string;
        };
        VerifyWithdrawalOtpDto: {
            withdrawalDraftId: string;
            otp: string;
        };
        WithdrawalSummaryBankAccountDto: {
            _id: string;
            bankName: string;
            accountNumber: string;
            accountName: string;
        };
        WithdrawalConfirmationSummaryDto: {
            withdrawalDraftId: string;
            amount: number;
            platformCharge: number;
            amountToReceive: number;
            availableBalance: number;
            balanceAfterWithdrawal: number;
            /** @description `null` when the account was removed meanwhile. */
            bankAccount: components["schemas"]["WithdrawalSummaryBankAccountDto"] | null;
            note: string;
            currency: string;
        };
        VerifyWithdrawalOtpResponseDto: {
            success: boolean;
            verified: boolean;
            summary: components["schemas"]["WithdrawalConfirmationSummaryDto"];
        };
        ConfirmWithdrawalDto: {
            withdrawalDraftId: string;
            confirmationAccepted: boolean;
            /** @description Required when the admin has turned on "require 2FA for withdrawals". */
            twoFactorCode?: string;
        };
        WithdrawalBankDetailsDto: {
            bankName: string;
            accountNumber: string;
            accountName: string;
        };
        ConfirmedWithdrawalDto: {
            _id: string;
            reference: string;
            amount: number;
            amountToReceive: number;
            platformCharge: number;
            /** @enum {string} */
            status: "pending" | "approved" | "processing" | "completed" | "rejected" | "failed" | "cancelled";
            bankAccount: components["schemas"]["WithdrawalBankDetailsDto"];
            /** Format: date-time */
            requestedAt: string;
            /** @description Free text, e.g. "1–24 hours". */
            estimatedReviewTime: string;
        };
        ConfirmWithdrawalResponseDto: {
            success: boolean;
            withdrawal: components["schemas"]["ConfirmedWithdrawalDto"];
        };
        WithdrawalRequesterDto: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        WithdrawalDto: {
            /** @description A user id; populated with the requester on `GET /finance/admin/withdrawals`. */
            requestedBy: string | components["schemas"]["WithdrawalRequesterDto"];
            _id: string;
            schoolId: string;
            walletId: string;
            bankAccountId: components["schemas"]["SchoolBankAccountDto"];
            amount: number;
            currency: string;
            processingFee: number;
            amountToReceive: number;
            reference: string;
            /** @enum {string} */
            status: "pending" | "approved" | "processing" | "completed" | "rejected" | "failed" | "cancelled";
            note: string;
            reviewedBy?: string;
            /** Format: date-time */
            reviewedAt?: string;
            rejectionReason: string;
            /** Format: date-time */
            processedAt?: string;
            providerTransferReference: string;
            metadata?: Record<string, never>;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        WithdrawalListResponseDto: {
            success: boolean;
            data: components["schemas"]["WithdrawalDto"][];
            pagination: components["schemas"]["PaginationInfoDto"];
        };
        WithdrawalResponseDto: {
            success: boolean;
            withdrawal: components["schemas"]["WithdrawalDto"];
        };
        WithdrawalActionDto: {
            rejectionReason?: string;
            providerTransferReference?: string;
            note?: string;
        };
        SecurityStatusResponseDto: {
            /** Format: date-time */
            twoFactorEnabledAt?: string | null;
            /** Format: date-time */
            lastSecurityUpdate?: string | null;
            success: boolean;
            twoFactorEnabled: boolean;
            requireTwoFactorForWithdrawals: boolean;
        };
        TwoFactorSetupResponseDto: {
            /** @description `otpauth://` URL for authenticator apps. */
            otpauthUrl: string;
            /** @description Data URL of the QR code for `otpauthUrl`. */
            qrCode: string;
        };
        TwoFactorVerifyDto: {
            token: string;
        };
        SuccessResponseDto: {
            success: boolean;
        };
        TwoFactorDisableDto: {
            token: string;
        };
        UpdateWithdrawal2faDto: {
            require: boolean;
            /** @description Current authenticator code; required when turning the requirement off. */
            token?: string;
        };
        CreateEnrollmentDto: {
            /** @description Student ID */
            studentId: string;
            /** @description Class ID */
            classId: string;
            /** @description Academic year ID */
            academicYearId: string;
            /** @description Term ID */
            termId?: string;
            /** @description Enrollment source */
            source?: string;
        };
        PromotionDecisionDto: {
            /** @description Student ID */
            studentId: string;
            /** @description Current/source class ID */
            fromClassId: string;
            /** @description Target class ID */
            toClassId: string;
            /** @description Target grade level label */
            targetGradeLevel?: string;
            /** @description Whether this is a repeat decision */
            repeatClass?: boolean;
        };
        CreatePromotionRunDto: {
            /** @description Source academic year ID */
            fromAcademicYearId: string;
            /** @description Target academic year ID */
            toAcademicYearId: string;
            /** @description Target/current term ID */
            targetTermId?: string;
            decisions: components["schemas"]["PromotionDecisionDto"][];
        };
        CreateStudentTransferRequestDto: {
            /** @description Student ID */
            studentId: string;
            /** @description Target school ID (required when initiatedBy is source) */
            targetSchoolId?: string;
            /** @description Target class ID */
            targetClassId?: string;
            /** @description Target academic year ID */
            targetAcademicYearId?: string;
            /** @description Target term ID */
            targetTermId?: string;
            /** @description Reason for transfer */
            reason?: string;
            /** @description Internal notes */
            notes?: string;
            /** @description Document URLs attached to the transfer */
            documents?: string[];
            /**
             * @description Who initiated the transfer: source or target school
             * @enum {string}
             */
            initiatedBy?: "source" | "target";
        };
        RejectTransferDto: {
            /** @description Reason for rejection */
            reason?: string;
        };
        CancelTransferDto: {
            /** @description Reason for cancellation */
            reason?: string;
        };
        CreateSubAdminDto: {
            /**
             * @description First name of the sub-admin
             * @example Ibrahim
             */
            firstName: string;
            /**
             * @description Last name of the sub-admin
             * @example Al-Rashid
             */
            lastName: string;
            /**
             * @description Email address (must be unique)
             * @example ibrahim@school.com
             */
            email: string;
            /**
             * @description Phone number
             * @example +2348012345678
             */
            phoneNumber?: string;
            /**
             * @description Permissions granted to this sub-admin
             * @example [
             *       "manage:fees",
             *       "manage:payments"
             *     ]
             */
            permissions: ("manage:classes" | "manage:curriculum" | "manage:assessments" | "manage:timetable" | "manage:fees" | "manage:payments" | "manage:finance" | "manage:students" | "manage:teachers" | "manage:parents" | "manage:announcements" | "manage:leave_requests" | "manage:transit" | "manage:messages" | "manage:settings" | "manage:support" | "manage:sub_admins")[];
        };
        PromoteTeacherDto: {
            /**
             * @description userId of the teacher to promote to sub-admin
             * @example 6651a2c3f4e5d6b7c8a9b0c1
             */
            userId: string;
            /**
             * @description Permissions to grant upon promotion
             * @example [
             *       "manage:classes",
             *       "manage:timetable"
             *     ]
             */
            permissions: ("manage:classes" | "manage:curriculum" | "manage:assessments" | "manage:timetable" | "manage:fees" | "manage:payments" | "manage:finance" | "manage:students" | "manage:teachers" | "manage:parents" | "manage:announcements" | "manage:leave_requests" | "manage:transit" | "manage:messages" | "manage:settings" | "manage:support" | "manage:sub_admins")[];
        };
        UpdatePermissionsDto: {
            /**
             * @description Full replacement set of permissions for this sub-admin
             * @example [
             *       "manage:fees",
             *       "manage:finance"
             *     ]
             */
            permissions: ("manage:classes" | "manage:curriculum" | "manage:assessments" | "manage:timetable" | "manage:fees" | "manage:payments" | "manage:finance" | "manage:students" | "manage:teachers" | "manage:parents" | "manage:announcements" | "manage:leave_requests" | "manage:transit" | "manage:messages" | "manage:settings" | "manage:support" | "manage:sub_admins")[];
        };
        SupportTicketContextDto: {
            /** @example /grading */
            path?: string;
            /** @example 2.4.0 */
            appVersion?: string;
            userAgent?: string;
        };
        CreateSupportTicketDto: {
            /** @enum {string} */
            area: "grading" | "attendance" | "timetable" | "messages" | "signing_in" | "payments" | "fees" | "results" | "transport" | "behaviour" | "other";
            description: string;
            /** @description An uploaded screenshot or file (https). */
            attachmentUrl?: string;
            context?: components["schemas"]["SupportTicketContextDto"];
        };
        SupportTicketCreatedDto: {
            /** @example TS-7K2QD */
            reference: string;
            /** Format: date-time */
            createdAt: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AppController_getHello: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
        };
    };
    AppController_health: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AppController_version: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppVersionDto"];
                };
            };
        };
    };
    TeachersTodayController_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherTodayDto"];
                };
            };
        };
    };
    TeachersMeController_school: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolContactDto"];
                };
            };
        };
    };
    TeachersMeController_myClasses: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyClassDto"][];
                };
            };
        };
    };
    TeachersMeController_students: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassRosterDto"];
                };
            };
        };
    };
    TeachersMeController_student: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student profile id */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentRecordDto"];
                };
            };
        };
    };
    StudentsMeController_today: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerTodayDto"];
                };
            };
        };
    };
    StudentsMeController_timetable: {
        parameters: {
            query?: {
                /** @description Any day of the wanted week, `YYYY-MM-DD`; snapped to its Monday. */
                weekStart?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerTimetableDto"];
                };
            };
        };
    };
    StudentsMeController_subjects: {
        parameters: {
            query?: {
                /** @description A term of the school; defaults to the current term */
                termId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerSubjectsDto"];
                };
            };
        };
    };
    StudentsMeController_subject: {
        parameters: {
            query?: {
                /** @description A term of the school; defaults to the current term */
                termId?: string;
            };
            header?: never;
            path: {
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerSubjectDetailDto"];
                };
            };
        };
    };
    StudentsMeController_reportCard: {
        parameters: {
            query?: {
                /** @description A term of the school; defaults to the current term */
                termId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportCardDto"];
                };
            };
        };
    };
    StudentsMeController_reportTerms: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportTermDto"][];
                };
            };
        };
    };
    StudentsMeController_attendance: {
        parameters: {
            query?: {
                /** @description A term of the school; defaults to the current term */
                termId?: string;
                /** @description `YYYY-MM`: also return each day of that month. */
                month?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerAttendanceDto"];
                };
            };
        };
    };
    StudentsMeController_files: {
        parameters: {
            query?: {
                /** @description Only this course */
                courseId?: string;
                /** @description Only files whose name contains this text */
                q?: string;
                /** @description Page number (1-based). */
                page?: number;
                /** @description Items per page; values above 100 are capped. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerFilesPageDto"];
                };
            };
        };
    };
    StudentsMeController_archive: {
        parameters: {
            query?: {
                /** @description Only this course; every course when absent */
                courseId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The zip */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/zip": string;
                };
            };
        };
    };
    StudentsMeController_school: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolContactDto"];
                };
            };
        };
    };
    StudentsMeController_preferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerPreferencesDto"];
                };
            };
        };
    };
    StudentsMeController_updatePreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateLearnerPreferencesDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerPreferencesDto"];
                };
            };
        };
    };
    ParentChildrenController_dashboard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentDashboardDto"];
                };
            };
        };
    };
    ParentChildrenController_timetable: {
        parameters: {
            query?: {
                /** @description Any day of the wanted week, `YYYY-MM-DD`; snapped to its Monday. */
                weekStart?: string;
            };
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerTimetableDto"];
                };
            };
        };
    };
    ParentChildrenController_reportCard: {
        parameters: {
            query?: {
                /** @description A term of the school; defaults to the current term */
                termId?: string;
            };
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportCardDto"];
                };
            };
        };
    };
    ParentChildrenController_reportTerms: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportTermDto"][];
                };
            };
        };
    };
    ParentChildrenController_acknowledge: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AcknowledgeReportDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcknowledgedDto"];
                };
            };
        };
    };
    ParentChildrenController_attendance: {
        parameters: {
            query?: {
                /** @description A term of the school; defaults to the current term */
                termId?: string;
                /** @description `YYYY-MM`: also return each day of that month. */
                month?: string;
            };
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LearnerAttendanceDto"];
                };
            };
        };
    };
    ParentChildrenController_school: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolContactDto"];
                };
            };
        };
    };
    CalendarEventsController_list: {
        parameters: {
            query?: {
                /** @description First day, `YYYY-MM-DD`. */
                from?: string;
                /** @description Last day (inclusive), `YYYY-MM-DD`. */
                to?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEventDto"][];
                };
            };
        };
    };
    CalendarEventsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCalendarEventDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEventDto"];
                };
            };
        };
    };
    CalendarEventsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Calendar event id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CalendarEventsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Calendar event id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCalendarEventDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEventDto"];
                };
            };
        };
    };
    TimetableMeController_me: {
        parameters: {
            query?: {
                /** @description Any day of the wanted week, `YYYY-MM-DD`; snapped to its Monday. */
                weekStart?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TimetableMeDto"];
                };
            };
        };
    };
    RegistersController_status: {
        parameters: {
            query?: {
                /** @description The school day, `YYYY-MM-DD`; defaults to today in the school. */
                date?: string;
                /** @description Staff only: limit the result to one class. */
                classId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterStatusDto"][];
                };
            };
        };
    };
    RegistersController_view: {
        parameters: {
            query?: {
                /** @description The school day, `YYYY-MM-DD`; defaults to today in the school. */
                date?: string;
            };
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterSheetDto"];
                };
            };
        };
    };
    RegistersController_save: {
        parameters: {
            query?: {
                /** @description The school day, `YYYY-MM-DD`; defaults to today in the school. */
                date?: string;
            };
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveRegisterDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterSaveDto"];
                };
            };
            /** @description The caller may only view this register (see `readOnlyReason` on GET). */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Submitting with students neither marked nor on approved leave; `missing` is their number (top level of the error body). The marks sent are saved as a draft; the register is not submitted. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterIncompleteDto"];
                };
            };
        };
    };
    RegistersController_submit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitRegisterDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterStatusDto"];
                };
            };
            /** @description Some students are neither marked nor on approved leave; `missing` is their number (top level of the error body). */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterIncompleteDto"];
                };
            };
        };
    };
    SchemeOfWorkController_mine: {
        parameters: {
            query?: {
                /** @description Defaults to the current term. */
                termId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubjectCardDto"][];
                };
            };
        };
    };
    SchemeOfWorkController_get: {
        parameters: {
            query?: {
                /** @description Defaults to the current term. */
                termId?: string;
            };
            header?: never;
            path: {
                /** @description Course id */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchemeOfWorkDto"];
                };
            };
        };
    };
    SchemeOfWorkController_saveWeeks: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course id */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveSchemeWeeksDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchemeOfWorkDto"];
                };
            };
        };
    };
    SchemeOfWorkController_saveWeek: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course id */
                courseId: string;
                /** @description Term week, 1..30 */
                week: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveSchemeWeekDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchemeOfWorkDto"];
                };
            };
        };
    };
    SchemeOfWorkController_markTaught: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course id */
                courseId: string;
                /** @description Term week, 1..30 */
                week: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkSchemeWeekTaughtDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchemeWeekTaughtDto"];
                };
            };
        };
    };
    GradingController_sheet: {
        parameters: {
            query?: {
                /** @description Defaults to the current term */
                termId?: string;
            };
            header?: never;
            path: {
                /** @description Course id */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradingSheetDto"];
                };
            };
        };
    };
    GradingController_saveScores: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course id */
                courseId: string;
                /** @description Assessment id */
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveGradingScoresDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradingSheetDto"];
                };
            };
            /** @description Published and locked: `{ code: 'LOCKED' }` at the top level */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradingController_publish: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course id */
                courseId: string;
                /** @description Assessment id */
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradingPublishResultDto"];
                };
            };
            /** @description Scores missing: `{ missing: studentIds }` at the top level */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradingController_unlock: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course id */
                courseId: string;
                /** @description Assessment id */
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnlockGradingScoresDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradingUnlockResultDto"];
                };
            };
            /** @description Not published: `{ code: 'NOT_PUBLISHED' }` */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradingController_readiness: {
        parameters: {
            query?: {
                /** @description Defaults to the current term */
                termId?: string;
            };
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassReadinessDto"];
                };
            };
        };
    };
    GradingController_remind: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendGradingReminderDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradingReminderSentDto"];
                };
            };
            /** @description Already reminded today (`{ code: 'ALREADY_REMINDED', sentAt }`), published, or no teacher */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradingController_broadsheet: {
        parameters: {
            query?: {
                /** @description Defaults to the current term */
                termId?: string;
                /** @description `total` (default) or an assessment id */
                basis?: string;
            };
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BroadsheetDto"];
                };
            };
        };
    };
    GradingController_remarks: {
        parameters: {
            query?: {
                /** @description Defaults to the current term */
                termId?: string;
            };
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermRemarksDto"];
                };
            };
        };
    };
    GradingController_saveRemarks: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveClassTeacherRemarksDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermRemarksDto"];
                };
            };
            /** @description The class's results are submitted or published: `{ code: 'RESULTS_SUBMITTED' | 'RESULTS_PUBLISHED' }` */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradingController_classSubmissions: {
        parameters: {
            query?: {
                /** @description Defaults to the current term */
                termId?: string;
            };
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermResultSubmissionDto"][];
                };
            };
        };
    };
    GradingController_submit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class id */
                classId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitTermResultsDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermResultSubmissionDto"];
                };
            };
            /** @description Not ready (`{ waitingOn }`), or already submitted or published (`{ code }`) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradingController_queue: {
        parameters: {
            query?: {
                /** @description Defaults to the current term */
                termId?: string;
                status?: "submitted" | "returned" | "published";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermResultSubmissionDto"][];
                };
            };
        };
    };
    GradingController_counts: {
        parameters: {
            query?: {
                /** @description Defaults to the current term */
                termId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermResultCountsDto"];
                };
            };
        };
    };
    GradingController_detail: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Submission id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermResultSubmissionDetailDto"];
                };
            };
        };
    };
    GradingController_publishResults: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Submission id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermResultSubmissionDto"];
                };
            };
            /** @description Not submitted (`{ code, status }`), or a subject unlocked since (`{ waitingOn }`) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradingController_returnResults: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Submission id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReturnTermResultsDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermResultSubmissionDto"];
                };
            };
            /** @description Not submitted: `{ code, status }` */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradingController_savePrincipalRemarks: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Submission id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SavePrincipalRemarksDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TermRemarksDto"];
                };
            };
            /** @description Results published: `{ code: 'RESULTS_PUBLISHED' }` */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of all resources */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateResourceDto"];
            };
        };
        responses: {
            /** @description Resource uploaded successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_findByClassId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of resources for the specified class */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_findByTermId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the term */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of resources for the specified term */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_findByCourseId: {
        parameters: {
            query?: {
                /** @description Only resources filed under this scheme-of-work week */
                week?: number;
            };
            header?: never;
            path: {
                /** @description ID of the course */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of resources for the specified course */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_findByUploadedBy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the user who uploaded */
                uploadedBy: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of resources uploaded by the specified user */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the resource */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Resource found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the resource */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateResourceDto"];
            };
        };
        responses: {
            /** @description Resource updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the resource */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Resource deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ResourceController_recordView: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the resource */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourceViewResultDto"];
                };
            };
        };
    };
    SubjectCourseController_createCourse: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCourseDto"];
            };
        };
        responses: {
            /** @description Course created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Course created successfully */
                        message?: string;
                    };
                };
            };
        };
    };
    SubjectCourseController_getCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Course retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 507f1f77bcf86cd799439011 */
                        _id?: string;
                        /** @example Algebra 101 */
                        title?: string;
                        /** @example Introduction to algebra */
                        description?: string;
                        /** @example MTH-S11B */
                        courseCode?: string;
                        /** @example 507f1f77bcf86cd799439011 */
                        subjectId?: string;
                    };
                };
            };
        };
    };
    SubjectCourseController_editCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCourseDto"];
            };
        };
        responses: {
            /** @description Course updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Course updated successfully */
                        message?: string;
                    };
                };
            };
        };
    };
    SubjectCourseController_deleteCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Course deleted successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Course deleted successfully */
                        message?: string;
                    };
                };
            };
        };
    };
    SubjectCourseController_getSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Subject retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 507f1f77bcf86cd799439011 */
                        _id?: string;
                        /** @example Mathematics */
                        name?: string;
                        /** @example MTH */
                        code?: string;
                        /** @example 507f191e810c19729de860ea */
                        schoolId?: string;
                    };
                };
            };
        };
    };
    SubjectCourseController_editSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSubjectDto"];
            };
        };
        responses: {
            /** @description Subject updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Subject updated successfully */
                        message?: string;
                    };
                };
            };
        };
    };
    SubjectCourseController_deleteSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Subject deleted successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Subject deleted successfully */
                        message?: string;
                    };
                };
            };
        };
    };
    SubjectCourseController_getCoursesBySchool: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Courses retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Course"][];
                };
            };
        };
    };
    SubjectCourseController_getCoursesBySubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                subjectId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Courses retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Course"][];
                };
            };
        };
    };
    SubjectCourseController_getSubjectsBySchool: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Subjects retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Subject"][];
                };
            };
            /** @description Unauthorized - JWT token required */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description School not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubjectCourseController_createSubject: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSubjectDto"];
            };
        };
        responses: {
            /** @description Subject created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid input data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubjectCourseController_getCoursesByClass: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Courses retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Course"][];
                };
            };
        };
    };
    AcademicYearTermController_createAcademicYear: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Academic year creation data */
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAcademicYearDto"];
            };
        };
        responses: {
            /** @description Academic Year created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Academic Year created successfully */
                        message?: string;
                        academicYear?: {
                            /** @example 2025-2026 */
                            year?: string;
                            /** @example 2025-09-01T00:00:00Z */
                            startDate?: string;
                            /** @example 2026-06-30T00:00:00Z */
                            endDate?: string;
                            /** @example 6791378c4ef5965469896850 */
                            schoolId?: string;
                            /** @example true */
                            isCurrent?: boolean;
                        };
                    };
                };
            };
        };
    };
    AcademicYearTermController_updateAcademicYear: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the academic year to update */
                id: string;
            };
            cookie?: never;
        };
        /** @description Academic year update data */
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAcademicYearDto"];
            };
        };
        responses: {
            /** @description Academic Year updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Academic Year updated successfully */
                        message?: string;
                        academicYear?: {
                            /** @example 2025-2026 */
                            year?: string;
                            /** @example 2025-09-01T00:00:00Z */
                            startDate?: string;
                            /** @example 2026-06-30T00:00:00Z */
                            endDate?: string;
                            /** @example 6791378c4ef5965469896850 */
                            schoolId?: string;
                            /** @example true */
                            isCurrent?: boolean;
                        };
                    };
                };
            };
        };
    };
    AcademicYearTermController_deleteAcademicYear: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the academic year to delete */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Academic Year deleted successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Academic Year deleted successfully */
                        message?: string;
                    };
                };
            };
        };
    };
    AcademicYearTermController_createTerm: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Term creation data */
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateTermDto"];
            };
        };
        responses: {
            /** @description Term created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Term created successfully */
                        message?: string;
                        term?: {
                            /** @example First Term */
                            name?: string;
                            /** @example 2025-09-01T00:00:00Z */
                            startDate?: string;
                            /** @example 2025-12-20T00:00:00Z */
                            endDate?: string;
                            /** @example 6791378c4ef5965469896850 */
                            academicYearId?: string;
                            /** @example 6791378c4ef5965469896850 */
                            schoolId?: string;
                            /** @example true */
                            isCurrent?: boolean;
                        };
                    };
                };
            };
        };
    };
    AcademicYearTermController_updateTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the term to update */
                id: string;
            };
            cookie?: never;
        };
        /** @description Term update data */
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTermDto"];
            };
        };
        responses: {
            /** @description Term updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Term updated successfully */
                        message?: string;
                        term?: {
                            /** @example First Term */
                            name?: string;
                            /** @example 2025-09-01T00:00:00Z */
                            startDate?: string;
                            /** @example 2025-12-20T00:00:00Z */
                            endDate?: string;
                            /** @example 6791378c4ef5965469896850 */
                            academicYearId?: string;
                            /** @example 6791378c4ef5965469896850 */
                            schoolId?: string;
                            /** @example true */
                            isCurrent?: boolean;
                        };
                    };
                };
            };
        };
    };
    AcademicYearTermController_deleteTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the term to delete */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Term deleted successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Term deleted successfully */
                        message?: string;
                    };
                };
            };
        };
    };
    AcademicYearTermController_getAcademicYearBySchoolId: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully fetched academic years. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Academic years fetched successfully */
                        message?: string;
                        academicYears?: {
                            /** @example 2025-2026 */
                            name?: string;
                            /** @example 2025-09-01T00:00:00Z */
                            startDate?: string;
                            /** @example 2026-06-30T00:00:00Z */
                            endDate?: string;
                            /** @example 6791378c4ef5965469896850 */
                            schoolId?: string;
                            /** @example true */
                            isCurrent?: boolean;
                        }[];
                    };
                };
            };
        };
    };
    AcademicYearTermController_getTermBySchoolId: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully fetched terms. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolTermsResponseDto"];
                };
            };
        };
    };
    AcademicYearTermController_setCurrentTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Term ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Term set as current successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    AcademicYearTermController_getCurrentTerm: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Current term retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    TimetableController_createTimetable: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Data to create a new timetable entry */
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateTimetableDto"];
            };
        };
        responses: {
            /** @description Timetable entry created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Timetable"];
                };
            };
        };
    };
    TimetableController_getTimetableByClass: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Timetable retrieved successfully: entries grouped by weekday (e.g. `{ Monday: [...] }`). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: components["schemas"]["ClassTimetableEntryDto"][];
                    };
                };
            };
        };
    };
    TimetableController_getTimetableByTeacher: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the teacher */
                teacherId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Timetable retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Timetable"][];
                };
            };
        };
    };
    TimetableController_updateTimetable: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the timetable entry to update */
                id: string;
            };
            cookie?: never;
        };
        /** @description Data to update the timetable entry */
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTimetableDto"];
            };
        };
        responses: {
            /** @description Timetable entry updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Timetable"];
                };
            };
        };
    };
    TimetableController_deleteTimetable: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the timetable entry to delete */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Timetable entry deleted successfully. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CurriculumController_getCurriculumKpis: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Curriculum KPIs retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurriculumKpiDto"];
                };
            };
            /** @description Unauthorized - JWT token required */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CurriculumController_findAll: {
        parameters: {
            query?: {
                /** @description Filter by course ID */
                course?: string;
                /** @description Filter by term ID */
                term?: string;
                /** @description Filter by the teacher's User id (the same id `POST /curriculum` takes as `teacherId`, not the Teacher profile id). 404 when that user is not a teacher of the caller's school. */
                teacherId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Curricula retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown[];
                };
            };
        };
    };
    CurriculumController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCurriculumDto"];
            };
        };
        responses: {
            /** @description Curriculum created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    CurriculumController_getByCourseAndTerm: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GetCurriculumByCourseAndTermDto"];
            };
        };
        responses: {
            /** @description Curriculum retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    CurriculumController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Curriculum ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Curriculum retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    CurriculumController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Curriculum ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Curriculum deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    CurriculumController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Curriculum ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCurriculumDto"];
            };
        };
        responses: {
            /** @description Curriculum updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    AssessmentController_createAssessment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Assessment creation data */
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAssessmentDto"];
            };
        };
        responses: {
            /** @description Assessment created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Assessment created successfully */
                        message?: string;
                        assessment?: {
                            /** @example 6791378c4ef5965469896850 */
                            _id?: string;
                            /** @example First Term Examination 2025 */
                            name?: string;
                            /** @example 6791378c4ef5965469896850 */
                            termId?: string;
                            /** @example 6791378c4ef5965469896850 */
                            schoolId?: string;
                            /** @example 2025-03-01T00:00:00Z */
                            startDate?: string;
                            /** @example 2025-03-15T23:59:59Z */
                            endDate?: string;
                            /** @example pending */
                            status?: string;
                        };
                    };
                };
            };
        };
    };
    AssessmentController_getAssessmentsBySchool: {
        parameters: {
            query?: {
                /** @description Page number (1-based). */
                page?: number;
                /** @description Items per page; values above 500 are capped. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully fetched assessments. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AssessmentController_getAssessmentsByTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully fetched assessments for term. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AssessmentController_getActiveAssessmentsByTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully fetched active assessments for term. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 6791378c4ef5965469896850 */
                        _id?: string;
                        /** @example First Term Examination 2025 */
                        name?: string;
                        /** @example Comprehensive examination for first term */
                        description?: string;
                        termId?: {
                            /** @example 6791378c4ef5965469896850 */
                            _id?: string;
                            /** @example First Term 2025 */
                            name?: string;
                            /** @example 2025-01-01T00:00:00Z */
                            startDate?: string;
                            /** @example 2025-04-30T23:59:59Z */
                            endDate?: string;
                        };
                        /** @example 6791378c4ef5965469896850 */
                        schoolId?: string;
                        /** @example 2025-03-01T00:00:00Z */
                        startDate?: string;
                        /** @example 2025-03-15T23:59:59Z */
                        endDate?: string;
                        /** @example active */
                        status?: string;
                        /** @example true */
                        isActive?: boolean;
                        createdBy?: {
                            /** @example 6791378c4ef5965469896850 */
                            _id?: string;
                            /** @example John */
                            firstName?: string;
                            /** @example Doe */
                            lastName?: string;
                        };
                        /** @example 2025-01-15T10:30:00Z */
                        createdAt?: string;
                        /** @example 2025-01-15T10:30:00Z */
                        updatedAt?: string;
                    }[];
                };
            };
        };
    };
    AssessmentController_getAssessmentById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully fetched assessment. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AssessmentController_updateAssessment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment ID */
                id: string;
            };
            cookie?: never;
        };
        /** @description Assessment update data */
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAssessmentDto"];
            };
        };
        responses: {
            /** @description Assessment updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AssessmentController_deleteAssessment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Assessment deleted successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_createAssessmentGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAssessmentGradeRecordDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_getGradingKpis: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradingKpiDto"];
                };
            };
        };
    };
    GradeRecordsController_getGradingKpisByClass: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradingKpiDto"];
                };
            };
        };
    };
    GradeRecordsController_getClassGradingSummary: {
        parameters: {
            query: {
                /** @description Term ID */
                termId: string;
                /** @description Academic Year ID */
                academicYearId?: string;
            };
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getClassStudentsPerformance: {
        parameters: {
            query: {
                /** @description Term ID */
                termId: string;
            };
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getClassAssessmentOverview: {
        parameters: {
            query: {
                /** @description Term ID */
                termId: string;
            };
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_generateClassSummaryRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateClassSummaryDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_retryClassSummaryRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RetryClassSummaryDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getClassGenerationHistory: {
        parameters: {
            query?: {
                /** @description Term ID */
                termId?: string;
            };
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getStudentAssessmentHistory: {
        parameters: {
            query: {
                /** @description Course ID */
                courseId: string;
                /** @description Term ID */
                termId: string;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getAssessmentPublicationStatus: {
        parameters: {
            query?: {
                /** @description Term ID (defaults to current term) */
                termId?: string;
            };
            header?: never;
            path: {
                /** @description Assessment ID */
                assessmentId: string;
                /** @description Course ID */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_saveAssessmentScores: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment ID */
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveAssessmentScoresDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_batchUploadAssessmentScores: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment ID */
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SaveAssessmentScoresDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getBatchUploadCapability: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getAssessmentGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssessmentGradeRecord"];
                };
            };
        };
    };
    GradeRecordsController_updateAssessmentGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAssessmentGradeRecordDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_deleteAssessmentGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_getAssessmentGradeRecordsByCourse: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Course ID */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getAssessmentGradeRecordsByAssessment: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Assessment ID */
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getAssessmentGradeRecordsByClass: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getAssessmentGradeRecordsByAssessmentAndCourse: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Assessment ID */
                assessmentId: string;
                /** @description Course ID */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_publishAssessmentGrades: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Assessment ID */
                assessmentId: string;
                /** @description Course ID */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Term ID; defaults to current term */
                    termId?: string;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_createCourseGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCourseGradeRecordDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_getCourseGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course Grade Record ID */
                courseGradeRecordId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CourseGradeRecord"];
                };
            };
        };
    };
    GradeRecordsController_getCourseGradeRecordByStudentCourseAndTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
                /** @description Course ID */
                courseId: string;
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CourseGradeRecord"];
                };
            };
        };
    };
    GradeRecordsController_getCourseGradeRecordsByCourseAndTerm: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Course ID */
                courseId: string;
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getCourseGradeRecordsByStudentAndTerm: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_updateCourseGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCourseGradeRecordDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_deleteCourseGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_bulkUpdateCourseGradeRecords: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BulkUpdateCourseGradeRecordDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_bulkCreateCourseGradeRecords: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BulkCreateCourseGradeRecordDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_getStudentCumulativeTermGradeRecords: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getStudentCumulativeTermGradeRecordByTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentCumulativeTermGradeRecord"];
                };
            };
        };
    };
    GradeRecordsController_updateStudentCumulativeTermGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student cumulative term grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateStudentCumulativeTermGradeRecordDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_deleteStudentCumulativeTermGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student cumulative term grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_calculateAndCreateStudentCumulativeTermGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_getClassCumulativeTermGradeRecords: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getClassCumulativeTermGradeRecordByTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassCumulativeTermGradeRecord"];
                };
            };
        };
    };
    GradeRecordsController_updateClassCumulativeTermGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class cumulative term grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateClassCumulativeTermGradeRecordDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_deleteClassCumulativeTermGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class cumulative term grade record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_publishClassCumulativeTermGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
            };
        };
    };
    GradeRecordsController_getMyClassCoursesWithPublishedAssessments: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getMyPublishedAssessmentsForCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Course ID */
                courseId: string;
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GradeRecordsController_getMyCumulativeGradeRecordByTerm: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Term ID */
                termId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentCumulativeTermGradeRecord"];
                };
            };
        };
    };
    ParentResultsController_getResultSummary: {
        parameters: {
            query?: {
                /** @description Defaults to the school's current term (see ParentResultsQueryDto) */
                termId?: string;
                /** @description Academic Year ID to filter results */
                academicYearId?: string;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentResultsController_getSubjectResults: {
        parameters: {
            query?: {
                /** @description Defaults to the school's current term (see ParentResultsQueryDto) */
                termId?: string;
                /** @description Academic Year ID to filter results */
                academicYearId?: string;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentResultsController_getLiveAcademicKpis: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentResultsController_getParentPublishedCourses: {
        parameters: {
            query: {
                termId: string;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentResultsController_getParentPublishedAssessmentsForCourse: {
        parameters: {
            query: {
                termId: string;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
                /** @description Course ID */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterUserDto"];
            };
        };
        responses: {
            /** @description User successfully registered */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Caller may not create this role or in this school */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Email already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_login: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    email?: string;
                    identifier?: string;
                    schoolSlug?: string;
                    password?: string;
                    rememberMe?: boolean;
                    deviceToken?: string;
                    platform?: string;
                };
            };
        };
        responses: {
            /** @description Login successful. The refresh token is set as the httpOnly `refreshToken` cookie (`refreshToken_<app>` when `X-Talim-App` is sent); a native app (`platform` of `ios` or `android`) also gets it as `refresh_token` in the body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccessTokenResponseDto"];
                };
            };
            /** @description Invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description FORBIDDEN — `X-Talim-App` names an app this account’s role does not belong in (the message names the role) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_getProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
        };
    };
    AuthenticationController_updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProfileDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    AuthenticationController_refreshToken: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RefreshTokenDto"];
            };
        };
        responses: {
            /** @description Token refreshed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccessTokenResponseDto"];
                };
            };
            /** @description UNAUTHENTICATED or TOKEN_EXPIRED: no, invalid, expired, revoked or already rotated refresh token */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_logout: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["RefreshTokenDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_forgotPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ForgotPasswordDto"];
            };
        };
        responses: {
            /** @description Reset code sent if the email is registered */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_verifyResetCode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerifyResetCodeDto"];
            };
        };
        responses: {
            /** @description The code is valid */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description VALIDATION_FAILED — invalid or expired code (field: token) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetPasswordDto"];
            };
        };
        responses: {
            /** @description Password reset successful */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description VALIDATION_FAILED — weak password (field: newPassword) or bad code (field: token) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_changePassword: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordDto"];
            };
        };
        responses: {
            /** @description Password changed; body carries the new access_token (and refresh_token for native apps) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description VALIDATION_FAILED — wrong current password, weak or reused new password, or mismatched confirmation */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_verifyToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    token: string;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_introspectToken: {
        parameters: {
            query?: never;
            header: {
                authorization: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    token?: string;
                };
            };
        };
        responses: {
            /** @description Token introspection result with user data; `{ active: false }` for an invalid, expired or orphaned token. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntrospectResponseDto"];
                };
            };
        };
    };
    AuthenticationController_checkEmail: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    email: string;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_updateAvatar: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAvatarDto"];
                "multipart/form-data": components["schemas"]["UpdateAvatarDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid file, file upload failed, or invalid URL */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_createTalimAdmin: {
        parameters: {
            query?: never;
            header: {
                "x-admin-secret": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    email: string;
                    password: string;
                    firstName: string;
                    lastName: string;
                    phoneNumber?: string;
                };
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid or missing admin secret */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_adminLogin: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    email: string;
                    password: string;
                    deviceToken?: string;
                    platform?: string;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Account is not a Talim administrator */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_completeOnboarding: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_getActivityLogs: {
        parameters: {
            query: {
                page: string;
                limit: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_registerBiometric: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    deviceId: string;
                    platform?: string;
                };
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_biometricLogin: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    userId: string;
                    deviceId: string;
                    token: string;
                    deviceToken?: string;
                    platform?: string;
                };
            };
        };
        responses: {
            /** @description Login successful. Same shape as `POST /auth/login`: a native app (`platform` of `ios` or `android`) also gets `refresh_token` in the body. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccessTokenResponseDto"];
                };
            };
            /** @description Invalid or revoked biometric credential */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthenticationController_revokeBiometric: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                deviceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthSessionsController_list: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
                /** @description Native apps: the refresh token, so the current session is marked. Browsers send the refresh cookie instead. */
                "x-refresh-token"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionDto"][];
                };
            };
        };
    };
    AuthSessionsController_revokeOthers: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
                "x-refresh-token"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RevokeOthersDto"];
                };
            };
        };
    };
    AuthSessionsController_revoke: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
                "x-refresh-token"?: string;
            };
            path: {
                /** @description Session id from GET /auth/sessions */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RevokeSessionDto"];
                };
            };
        };
    };
    AuthSessionsController_passwordPolicy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PasswordPolicyDto"];
                };
            };
        };
    };
    UserController_getTeachers: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of teachers retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherRosterResponseDto"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserController_updateTeacherStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeacherStatusDto"];
            };
        };
        responses: {
            /** @description Teacher status updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Teacher not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserController_getSchoolAdmins: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of school admins retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserController_getStudents: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of students retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserController_getParents: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of parents retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserController_searchSchoolData: {
        parameters: {
            query: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                /** @description Search query string */
                query: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Search results retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AdminUsersController_search: {
        parameters: {
            query?: {
                /** @description Name or email words (each must match; literal). */
                q?: string;
                role?: "student" | "teacher" | "admin" | "parent" | "school_admin" | "school_sub_admin";
                schoolId?: string;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserSearchItemDto"][];
                };
            };
        };
    };
    TeacherController_getTeacherProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID of the teacher */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Teacher profile retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherProfileResponseDto"];
                };
            };
            /** @description Teacher profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    TeacherController_createTeacherProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID of the teacher */
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateTeacherDto"];
            };
        };
        responses: {
            /** @description Teacher profile created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherProfileDto"];
                };
            };
        };
    };
    TeacherController_getClassesByTeacher: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID of the teacher */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Classes assigned to the teacher */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"][];
                };
            };
            /** @description Teacher not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    TeacherController_updateEmployment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID of the teacher */
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeacherEmploymentDto"];
            };
        };
        responses: {
            /** @description Employment details updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Parttime */
                        employmentType?: string;
                        /** @example NonAcademic */
                        employmentRole?: string;
                    };
                };
            };
        };
    };
    TeacherController_updateAvailability: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID of the teacher */
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeacherAvailabilityDto"];
            };
        };
        responses: {
            /** @description Availability updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @example [
                         *       "Thursday",
                         *       "Friday"
                         *     ]
                         */
                        availabilityDays?: string[];
                        /** @example 10:00 AM - 02:00 PM */
                        availableTime?: string;
                    };
                };
            };
        };
    };
    TeacherController_updateAcademicDetails: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID of the teacher */
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeacherAcademicDetailsDto"];
            };
        };
        responses: {
            /** @description Academic details updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Postgraduate */
                        highestAcademicQualification?: string;
                        /** @example 7 */
                        yearsOfExperience?: number;
                        /** @example Computer Science */
                        specialization?: string;
                    };
                };
            };
        };
    };
    TeacherController_updatePersonalDetails: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Teacher's user id */
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeacherPersonalDetailsDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
        };
    };
    TeacherController_updateClassAndCourseAssignments: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID of the teacher */
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateClassAndCourseAssignmentDto"];
            };
        };
        responses: {
            /** @description Assignments updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @example [
                         *       "60d5ecb8b3b3a3001f3e5678",
                         *       "60d5ecb8b3b3a3001f3e9012"
                         *     ]
                         */
                        assignedClasses?: string[];
                        /**
                         * @example [
                         *       "60d5ecb8b3b3a3001f3e3456"
                         *     ]
                         */
                        assignedCourses?: string[];
                        /** @example false */
                        isFormTeacher?: boolean;
                    };
                };
            };
        };
    };
    TeacherController_getTeacherDashboardKpis: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Teacher user ID */
                teacherId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Teacher dashboard KPIs retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherDashboardKpiDto"];
                };
            };
            /** @description Teacher not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    TeacherCoursesController_getTeacherCourses: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Teacher ID or User ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Teacher courses retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 60d5ecb8b3b3a3001f3e9012 */
                        _id?: string;
                        /** @example MATH101 */
                        courseCode?: string;
                        /** @example Introduction to Mathematics */
                        title?: string;
                        /** @example Basic mathematics concepts */
                        description?: string;
                        classId?: {
                            /** @example 60d5ecb8b3b3a3001f3e5678 */
                            _id?: string;
                            /** @example Grade 10A */
                            name?: string;
                            /** @example Grade 10 Section A */
                            classDescription?: string;
                        };
                        subjectId?: {
                            /** @example 60d5ecb8b3b3a3001f3e3456 */
                            _id?: string;
                            /** @example Mathematics */
                            name?: string;
                            /** @example Mathematics subject */
                            description?: string;
                        };
                    }[];
                };
            };
            /** @description Invalid ID format */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Teacher not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    StudentController_issueLinkCode: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LinkCodeResponseDto"];
                };
            };
        };
    };
    StudentController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudentDto"];
            };
        };
        responses: {
            /** @description Student created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreatedStudentDto"];
                };
            };
            /** @description Bad Request - Invalid input data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error during student creation */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    StudentController_updateActiveStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID or User ID - the endpoint will find the student by either */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example false */
                    isActive?: boolean;
                };
            };
        };
        responses: {
            /** @description Student status updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 507f1f77bcf86cd799439011 */
                        _id?: string;
                        /** @example 507f1f77bcf86cd799439011 */
                        userId?: string;
                        /** @example true */
                        active?: boolean;
                    };
                };
            };
        };
    };
    StudentController_updateClass: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example 507f1f77bcf86cd799439055 */
                    newClassId?: string;
                };
            };
        };
        responses: {
            /** @description Student class updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    StudentController_getStudentById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Student details retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
        };
    };
    StudentController_updateStudent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateStudentDto"];
            };
        };
        responses: {
            /** @description Student updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
        };
    };
    StudentController_getStudentDashboardKpis: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Unique identifier of the student */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Student dashboard KPI metrics retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentDashboardKpiDto"];
                };
            };
            /** @description Student not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    StudentController_getStudentDashboardKpisByUserId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Unique identifier of the user */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Student dashboard KPIs retrieved successfully by user ID. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentDashboardKpiDto"];
                };
            };
        };
    };
    StudentController_getStudentsBySchool: {
        parameters: {
            query?: {
                /** @description Page number (1-based). */
                page?: number;
                /** @description Items per page; values above 500 are capped. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of students for the school */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
        };
    };
    StudentController_getStudentsByClassId: {
        parameters: {
            query?: {
                /** @description Page number (1-based). */
                page?: number;
                /** @description Items per page; values above 500 are capped. */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Class ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of students for the class */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
        };
    };
    StudentController_getStudentsByUserId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Students retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
        };
    };
    StudentController_getAllStudentsByParent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                parentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Student"][];
                };
            };
        };
    };
    AttendanceController_markAttendance: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAttendanceDto"];
            };
        };
        responses: {
            /** @description Attendance recorded successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendanceRecordDto"];
                };
            };
        };
    };
    AttendanceController_getAttendanceById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Attendance Record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Attendance record retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendanceRecordDto"];
                };
            };
        };
    };
    AttendanceController_updateAttendance: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Attendance Record ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAttendanceDto"];
            };
        };
        responses: {
            /** @description The corrected attendance record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendanceRecordDto"];
                };
            };
            /** @description Not a teacher of the class. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Record not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AttendanceController_getStudentAttendanceDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Student attendance dashboard retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentAttendanceDashboardDto"];
                };
            };
        };
    };
    AttendanceController_getParentStudentMonthlyAttendance: {
        parameters: {
            query: {
                /** @description Month number from 1 to 12 */
                month: number;
                /** @description Four-digit year */
                year: number;
                /** @description Selected day in YYYY-MM-DD format. Defaults to today. */
                selectedDate?: string;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Monthly attendance dashboard retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MonthlyAttendanceResponseDto"];
                };
            };
        };
    };
    AttendanceController_getClassAttendanceStatus: {
        parameters: {
            query?: {
                /** @description Date to check attendance for (YYYY-MM-DD format). Defaults to today. */
                date?: string;
            };
            header?: never;
            path: {
                /** @description Class ID */
                classId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Class attendance status retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassAttendanceStatusDto"];
                };
            };
        };
    };
    AttendanceController_getStudentAttendanceKpis: {
        parameters: {
            query?: {
                /** @description Term ID to filter attendance by specific term */
                termId?: string;
                /** @description Start date for custom date range (YYYY-MM-DD format) */
                startDate?: string;
                /** @description End date for custom date range (YYYY-MM-DD format) */
                endDate?: string;
            };
            header?: never;
            path: {
                /** @description Student ID */
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Student attendance KPIs retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentAttendanceKpiDto"];
                };
            };
        };
    };
    LeaveRequestController_createLeaveRequest: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateLeaveRequestDto"];
            };
        };
        responses: {
            /** @description Leave request created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRequestDto"];
                };
            };
        };
    };
    LeaveRequestController_getLeaveRequestById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Leave Request ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Leave request retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRequestDto"];
                };
            };
        };
    };
    LeaveRequestController_deleteLeaveRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Leave Request ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Leave request deleted successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": boolean;
                };
            };
        };
    };
    LeaveRequestController_parentUpdateLeaveRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Leave Request ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParentUpdateLeaveRequestDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRequestDto"];
                };
            };
        };
    };
    LeaveRequestController_updateLeaveRequestStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Leave Request ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateLeaveRequestDto"];
            };
        };
        responses: {
            /** @description Leave request status updated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRequestDto"];
                };
            };
        };
    };
    LeaveRequestController_getLeaveRequestsByChild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student ID */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Leave requests retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRequestDto"][];
                };
            };
        };
    };
    LeaveRequestController_getLeaveRequestsByTeacher: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Teacher ID */
                teacherId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Leave requests retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRequestDto"][];
                };
            };
        };
    };
    LeaveRequestController_getLeaveRequestsBySchoolAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Leave requests with student profiles retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRequestWithStudentDto"][];
                };
            };
        };
    };
    LeaveRequestController_getLeaveRequestSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Student user ID */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRequestSummaryDto"];
                };
            };
        };
    };
    ParentLeaveController_list: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChildLeaveDto"];
                };
            };
        };
    };
    ParentLeaveController_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParentLeaveCreateDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRowDto"];
                };
            };
        };
    };
    ParentLeaveController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
                /** @description The leave request */
                leaveId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveCancelledDto"];
                };
            };
        };
    };
    ParentLeaveController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The child's Student id */
                childId: string;
                /** @description The leave request */
                leaveId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParentLeaveUpdateDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaveRowDto"];
                };
            };
        };
    };
    ParentsController_linkChild: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LinkChildDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LinkedChildResponseDto"];
                };
            };
        };
    };
    ParentsController_getMyChildren: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentChildCardDto"][];
                };
            };
        };
    };
    ParentsController_setMyDefaultChild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentsController_getMyChildrenOverview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentsController_getMyChildrenUpdates: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentsController_getMyChild: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                childId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    ParentsController_updateMyChildProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                childId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateChildProfileDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    ParentsController_createParent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateParentDto"];
            };
        };
        responses: {
            /** @description Parent has been successfully created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Parent"];
                };
            };
        };
    };
    ParentsController_getAllParents: {
        parameters: {
            query?: {
                /** @description Page number (starts from 1) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                /** @description Search parents by name, email, or phone */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of parents */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Parent"][];
                };
            };
        };
    };
    ParentsController_getParentsBySchoolId: {
        parameters: {
            query?: {
                /** @description Page number (starts from 1) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                /** @description Search parents by name, email, or phone */
                search?: string;
            };
            header?: never;
            path: {
                /** @description The MongoDB ID of the school */
                schoolId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description School not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentsController_getParentByUserId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Parent"];
                };
            };
            /** @description Parent profile not found for the given user ID */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentsController_getParentById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Parent ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Parent"];
                };
            };
        };
    };
    ParentsController_updateParent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Parent ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateParentDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Parent"];
                };
            };
        };
    };
    ParentsController_deleteParent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Parent ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Parent"];
                };
            };
        };
    };
    ParentsController_getChildrenByParentId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>[];
                };
            };
        };
    };
    ParentSettingsController_getSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Settings overview returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentSettingsResponseDto"];
                };
            };
            /** @description Parent profile not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentSettingsController_updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateParentProfileDto"];
            };
        };
        responses: {
            /** @description Profile updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentSettingsController_changePassword: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordDto"];
            };
        };
        responses: {
            /** @description Password changed */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation error or password mismatch */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Current password incorrect */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentSettingsController_sendPhoneOtp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendPhoneOtpDto"];
            };
        };
        responses: {
            /** @description OTP sent */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Phone number already in use */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentSettingsController_verifyPhoneOtp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerifyPhoneOtpDto"];
            };
        };
        responses: {
            /** @description Phone number updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid or expired OTP */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentSettingsController_updateNotifications: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateNotificationPreferencesDto"];
            };
        };
        responses: {
            /** @description Preferences updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentSettingsController_updateTheme: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateThemePreferenceDto"];
            };
        };
        responses: {
            /** @description Theme updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ParentSettingsController_updatePreferredProvider: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePreferredProviderDto"];
            };
        };
        responses: {
            /** @description Preferred payment method updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PreferredProviderUpdatedDto"];
                };
            };
        };
    };
    ParentSettingsController_updatePreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateParentPreferencesDto"];
            };
        };
        responses: {
            /** @description Preferences updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentPreferencesUpdatedDto"];
                };
            };
        };
    };
    TeacherSettingsController_getSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherSettingsDto"];
                };
            };
        };
    };
    TeacherSettingsController_updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeacherProfileDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherSettingsDto"];
                };
            };
        };
    };
    TeacherSettingsController_updatePreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTeacherPreferencesDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherPreferencesResponseDto"];
                };
            };
        };
    };
    FileUploadController_uploadImage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Image file to upload */
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["FileUploadDto"];
            };
        };
        responses: {
            /** @description Image uploaded successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description URL of the uploaded image */
                        url?: string;
                    };
                };
            };
        };
    };
    FileUploadController_uploadFile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description File to upload */
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["FileUploadDto"];
            };
        };
        responses: {
            /** @description File uploaded successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description URL of the uploaded file */
                        url?: string;
                    };
                };
            };
        };
    };
    FileUploadController_uploadChatAttachment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Chat attachment to upload */
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["FileUploadDto"];
            };
        };
        responses: {
            /** @description Chat attachment uploaded successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MyNotificationsController_registerDeviceToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterDeviceTokenDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MyNotificationsController_deactivateDeviceToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeactivateDeviceTokenDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MyNotificationsController_getUnreadCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MyNotificationsController_getCounts: {
        parameters: {
            query?: {
                /** @description B11: count only the notifications about this child (its Student id), with the same split as `GET /notifications?childId=`: rows naming the child plus rows naming no child. */
                childId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InboxCountsDto"];
                };
            };
        };
    };
    MyNotificationsController_markAllRead: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReadAllResponseDto"];
                };
            };
        };
    };
    MyNotificationsController_getPreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreference"];
                };
            };
        };
    };
    MyNotificationsController_updatePreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateNotificationPreferenceDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreference"];
                };
            };
        };
    };
    AdminBroadcastsController_preview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewBroadcastDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BroadcastPreviewDto"];
                };
            };
        };
    };
    AdminBroadcastsController_list: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                status?: "scheduled" | "sending" | "sent" | "cancelled" | "failed";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BroadcastListResponseDto"];
                };
            };
        };
    };
    AdminBroadcastsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateBroadcastDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BroadcastCreatedDto"];
                };
            };
        };
    };
    AdminBroadcastsController_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Broadcast id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BroadcastDto"];
                };
            };
        };
    };
    AdminBroadcastsController_cancel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Broadcast id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BroadcastDto"];
                };
            };
        };
    };
    WebPushController_getVapidPublicKey: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WebPushController_subscribe: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateWebPushSubscriptionDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WebPushController_unsubscribe: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeleteWebPushSubscriptionDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WebPushController_unsubscribeAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WebPushController_listSubscriptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    WebPushController_sendTest: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    AnnoucementController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAnnouncementDto"];
            };
        };
        responses: {
            /** @description Announcement successfully created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid input data */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sender not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnnoucementController_addReaction: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddReactionDto"];
            };
        };
        responses: {
            /** @description Reaction successfully added/updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
            /** @description Invalid input */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Announcement not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description User has already reacted */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnnoucementController_getAnnouncement: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Announcement ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Announcement retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Announcement not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnnoucementController_editAnnouncement: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Announcement ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditAnnouncementDto"];
            };
        };
        responses: {
            /** @description Announcement updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Announcement not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnnoucementController_getAnnouncementsBySender: {
        parameters: {
            query?: {
                /** @description Number of items per page (default: 10) */
                limit?: number;
                /** @description Page number (default: 1) */
                page?: number;
            };
            header?: never;
            path: {
                /** @description ID of the sender user */
                senderId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved announcements */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnnoucementController_getAnnouncementStats: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the sender user */
                senderId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnnoucementController_getAnnouncementsByReceiver: {
        parameters: {
            query?: {
                /** @description Page number (default: 1) */
                page?: number;
                /** @description Number of items per page (default: 10) */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description ID of the receiver user */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved announcements */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnnoucementController_getAnnouncementsBySchool: {
        parameters: {
            query?: {
                /** @description Number of items per page (default: 10) */
                limit?: number;
                /** @description Page number (default: 1) */
                page?: number;
            };
            header?: never;
            path: {
                /** @description ID of the school */
                schoolId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully retrieved school announcements */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AnnoucementController_markAnnouncementAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Announcement ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["MarkAnnouncementReadDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    NotificationSystemController_testNotification: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationSystemController_getHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    NotificationSystemController_getQueueStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationSystemController_getCacheStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    NotificationSystemController_getProvidersHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>[];
                };
            };
        };
    };
    NotificationSystemController_getMetrics: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    NotificationSystemController_testCache: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CacheTestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationSystemController_setUserOnline: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetUserOnlineDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationSystemController_performHealthCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationController_findAll: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
                /** @description Filter notifications for a specific recipient */
                recipientId?: string;
                source?: "school" | "talim" | "system";
                category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "payments" | "leave" | "support" | "other";
                type?: string;
                /** @description true: only notifications the caller has not read (with the other filters). */
                unread?: boolean;
                /** @description B11: only the notifications about this child (its Student id): rows whose `metadata.childId` or `metadata.studentId` names the child, plus rows that name no child (school-wide notices). The child must be the caller's (a parent's linked child), else 404. */
                childId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationListResponseDto"];
                };
            };
        };
    };
    NotificationController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateNotificationDto"];
            };
        };
        responses: {
            /** @description Notification created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationController_getStats: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
                /** @description Filter notifications for a specific recipient */
                recipientId?: string;
                source?: "school" | "talim" | "system";
                category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "payments" | "leave" | "support" | "other";
                type?: string;
                /** @description true: only notifications the caller has not read (with the other filters). */
                unread?: boolean;
                /** @description B11: only the notifications about this child (its Student id): rows whose `metadata.childId` or `metadata.studentId` names the child, plus rows that name no child (school-wide notices). The child must be the caller's (a parent's linked child), else 404. */
                childId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationController_getUnreadNotifications: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description User ID */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationItemDto"][];
                };
            };
        };
    };
    NotificationController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Notification ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationItemDto"];
                };
            };
            /** @description Notification not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    NotificationController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Notification ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateNotificationDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Notification"];
                };
            };
        };
    };
    NotificationController_delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Notification ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Notification"];
                };
            };
        };
    };
    NotificationController_markAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Notification ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationItemDto"];
                };
            };
        };
    };
    NotificationController_scheduleNotification: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ScheduleNotificationDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Notification"];
                };
            };
        };
    };
    ChatController_getContacts: {
        parameters: {
            query?: {
                /** @description Parents: a linked child's Student id. Defaults to the X-Talim-Child child when that header is sent. */
                childId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": (components["schemas"]["TeacherContactDto"] | components["schemas"]["ParentChildContactDto"] | components["schemas"]["ChatStudentParentContactDto"])[];
                };
            };
        };
    };
    ChatController_getUserChatRooms: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns all chat rooms for the user */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomViewDto"][];
                };
            };
        };
    };
    ChatController_createChatRoom: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateChatRoomDto"];
            };
        };
        responses: {
            /** @description Chat room created (or reused) */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomCreatedDto"];
                };
            };
        };
    };
    ChatController_createGroupChat: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateGroupChatDto"];
            };
        };
        responses: {
            /** @description Group chat room created successfully with all relevant participants added */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomResponseDto"];
                };
            };
        };
    };
    ChatController_createAdminParentGroupChat: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateGroupChatDto"];
            };
        };
        responses: {
            /** @description Admin-parent group chat created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomResponseDto"];
                };
            };
        };
    };
    ChatController_updateRoom: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateChatRoomDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomViewDto"];
                };
            };
        };
    };
    ChatController_openOffice: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The office room, as the room list shows it */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomViewDto"];
                };
            };
        };
    };
    ChatController_openCourseGroup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the course */
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The subject group, as the room list shows it */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomViewDto"];
                };
            };
        };
    };
    ChatController_getRoomMedia: {
        parameters: {
            query?: {
                kind?: "image" | "video" | "document" | "link";
                /** @description `nextCursor` of the previous page. */
                cursor?: string;
                limit?: number;
            };
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatMediaPageDto"];
                };
            };
        };
    };
    ChatController_markRoomRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkRoomReadDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatController_searchChatRooms: {
        parameters: {
            query?: {
                /** @description Search term for room name or participant name */
                searchTerm?: string;
                /** @description Filter by chat room type */
                type?: "class_group" | "course_group" | "one_to_one";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns filtered chat rooms */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomResponseDto"][];
                };
            };
        };
    };
    ChatController_getChatRoomMessages: {
        parameters: {
            query?: {
                /** @description Page number */
                page?: number;
                /** @description Messages per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns paginated chat messages with participant details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatMessageResponseDto"][];
                };
            };
        };
    };
    ChatController_getChatRoomMessagesWithCursor: {
        parameters: {
            query?: {
                /** @description Items per page; values above 100 are capped. */
                limit?: number;
                /** @description Message ID to use as cursor */
                cursor?: string;
                /** @description Direction of pagination (before for older messages, after for newer messages) */
                direction?: "before" | "after";
            };
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatController_sendMessage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateMessageDto"];
            };
        };
        responses: {
            /** @description Message sent successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatMessageResponseDto"];
                };
            };
        };
    };
    ChatController_deleteMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the message */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    ChatController_markMessageAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the message */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Message marked as read */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatController_getUnreadMessageCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns the count of unread messages */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": number;
                };
            };
        };
    };
    ChatController_getChatRoomParticipants: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns participant user IDs */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
                };
            };
        };
    };
    ChatController_addMultipleParticipants: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddParticipantsDto"];
            };
        };
        responses: {
            /** @description Participants added successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomResponseDto"];
                };
            };
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
            /** @description Bad request - invalid participant IDs or empty list */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Chat room not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatController_addParticipant: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
                /** @description ID of the user to add */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Participant added successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomResponseDto"];
                };
            };
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    ChatController_removeParticipant: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the chat room */
                roomId: string;
                /** @description ID of the user to remove */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Participant removed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatRoomResponseDto"];
                };
            };
        };
    };
    ChatController_getMessagePreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns message preferences */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatPreferencesResponseDto"];
                };
            };
        };
    };
    ChatController_updateMessagePreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateChatPreferencesDto"];
            };
        };
        responses: {
            /** @description Updated message preferences */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatPreferencesResponseDto"];
                };
            };
        };
    };
    ClassController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of all classes in the school */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 507f1f77bcf86cd799439011 */
                        _id?: string;
                        /** @example Grade 1A */
                        name?: string;
                        /** @example 507f1f77bcf86cd799439014 */
                        schoolId?: string;
                        /** @example 507f1f77bcf86cd799439013 */
                        classTeacherId?: string;
                        /**
                         * @example [
                         *       "507f1f77bcf86cd799439015",
                         *       "507f1f77bcf86cd799439016"
                         *     ]
                         */
                        courses?: string[];
                        /**
                         * @description Number of students enrolled in the class
                         * @example 25
                         */
                        studentCount?: number;
                    }[];
                };
            };
        };
    };
    ClassController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateClassDto"];
            };
        };
        responses: {
            /** @description Class created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 507f1f77bcf86cd799439011 */
                        _id?: string;
                        /** @example Grade 1A */
                        name?: string;
                        /** @example This is a beginner level class. */
                        classDescription?: string;
                        /** @example 30 */
                        classCapacity?: string;
                        /** Format: date-time */
                        createdAt?: string;
                        /** Format: date-time */
                        updatedAt?: string;
                    };
                };
            };
        };
    };
    ClassController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Class found with courses */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 507f1f77bcf86cd799439011 */
                        _id?: string;
                        /** @example Grade 1A */
                        name?: string;
                        /** @example 507f1f77bcf86cd799439014 */
                        schoolId?: string;
                        /** @example 507f1f77bcf86cd799439013 */
                        classTeacherId?: string;
                        courses?: {
                            /** @example 507f1f77bcf86cd799439015 */
                            _id?: string;
                            /** @example Mathematics Basics */
                            title?: string;
                            /** @example Introduction to basic math concepts */
                            description?: string;
                            /** @example MATH101 */
                            courseCode?: string;
                            /** @example 507f1f77bcf86cd799439013 */
                            teacherId?: string;
                            /** @example 507f1f77bcf86cd799439017 */
                            subjectId?: string;
                            /** @example 507f1f77bcf86cd799439011 */
                            classId?: string;
                        }[];
                        /** @example 25 */
                        studentCount?: number;
                    };
                };
            };
        };
    };
    ClassController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateClassDto"];
            };
        };
        responses: {
            /** @description Class updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"];
                };
            };
        };
    };
    ClassController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Class deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"];
                };
            };
        };
    };
    ClassController_findByTeacher: {
        parameters: {
            query?: {
                /** @description Page number (1-based). */
                page?: number;
                /** @description Items per page; values above 500 are capped. */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description The teacher's User id. 404 when that user is not a teacher of the caller's school. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Classes retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        data?: components["schemas"]["Class"][];
                        meta?: {
                            total?: number;
                            page?: number;
                            lastPage?: number;
                            limit?: number;
                        };
                    };
                };
            };
        };
    };
    ClassController_getClassesByTeacher: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The teacher's User id. 404 when that user is not a teacher of the caller's school. */
                teacherId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Classes assigned to the teacher */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"][];
                };
            };
        };
    };
    ClassController_updateAssignedCourses: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAssignedCoursesDto"];
            };
        };
        responses: {
            /** @description Courses updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"];
                };
            };
        };
    };
    ClassController_addCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddCourseDto"];
            };
        };
        responses: {
            /** @description Course added successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"];
                };
            };
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"];
                };
            };
        };
    };
    ClassController_removeCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveCourseDto"];
            };
        };
        responses: {
            /** @description Course removed successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"];
                };
            };
        };
    };
    ClassController_assignTeacher: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the class */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignTeacherDto"];
            };
        };
        responses: {
            /** @description Teacher assigned successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Class"];
                };
            };
        };
    };
    SchoolController_createSchool: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSchoolDto"];
            };
        };
        responses: {
            /** @description School has been successfully created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description School with this name, email, or prefix already exists. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SchoolController_getAllSchools: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SchoolController_searchSchools: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                /** @description Search query to match against school name, email, or prefix */
                query?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SchoolController_getSchoolById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the school */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["School"];
                };
            };
            /** @description School not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SchoolController_updateSchool: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the school to update */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSchoolDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["School"];
                };
            };
            /** @description School not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SchoolController_deleteSchool: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the school to delete */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
            /** @description School not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SchoolController_restoreSchool: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the school to restore */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["School"];
                };
            };
        };
    };
    SchoolController_updateSchoolStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the school */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSchoolStatusDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["School"];
                };
            };
        };
    };
    SchoolController_getSchoolDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the school */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolDashboardDto"];
                };
            };
        };
    };
    TicketsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateTicketDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketDto"];
                };
            };
        };
    };
    TicketsController_mine: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                /** @description One of open, in_progress, waiting_on_user, resolved, closed, or several separated by commas. */
                status?: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketListResponseDto"];
                };
            };
        };
    };
    TicketsController_schoolDesk: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                /** @description One of open, in_progress, waiting_on_user, resolved, closed, or several separated by commas. */
                status?: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";
                area?: "grading" | "attendance" | "timetable" | "messages" | "signing_in" | "payments" | "fees" | "results" | "transport" | "behaviour" | "other";
                priority?: "low" | "normal" | "high" | "urgent";
                /** @description A staff user id, `me`, or `unassigned` (alias `none`). */
                assigneeId?: string;
                /** @description A reference (exact) or words of the subject. */
                q?: string;
                /** @description Talim desk only: `all` also lists school-desk tickets, read-only. */
                scope?: "all";
                /** @description Talim desk only: one school's tickets. */
                schoolId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketListResponseDto"];
                };
            };
        };
    };
    TicketsController_schoolCounts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketCountsDto"];
                };
            };
        };
    };
    TicketsController_talimDesk: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                /** @description One of open, in_progress, waiting_on_user, resolved, closed, or several separated by commas. */
                status?: "open" | "in_progress" | "waiting_on_user" | "resolved" | "closed";
                area?: "grading" | "attendance" | "timetable" | "messages" | "signing_in" | "payments" | "fees" | "results" | "transport" | "behaviour" | "other";
                priority?: "low" | "normal" | "high" | "urgent";
                /** @description A staff user id, `me`, or `unassigned` (alias `none`). */
                assigneeId?: string;
                /** @description A reference (exact) or words of the subject. */
                q?: string;
                /** @description Talim desk only: `all` also lists school-desk tickets, read-only. */
                scope?: "all";
                /** @description Talim desk only: one school's tickets. */
                schoolId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketListResponseDto"];
                };
            };
        };
    };
    TicketsController_talimCounts: {
        parameters: {
            query?: {
                /** @description Talim desk only: `all` counts school-desk tickets too. */
                scope?: "all";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketCountsDto"];
                };
            };
        };
    };
    TicketsController_deskStaff: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                desk: "school" | "talim";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketStaffDto"][];
                };
            };
        };
    };
    TicketsController_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Ticket id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketDto"];
                };
            };
        };
    };
    TicketsController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Ticket id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTicketDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketDto"];
                };
            };
        };
    };
    TicketsController_addMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Ticket id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddTicketMessageDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketDto"];
                };
            };
        };
    };
    TicketsController_escalate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Ticket id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EscalateTicketDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketDto"];
                };
            };
        };
    };
    TicketsController_reopen: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Ticket id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketDto"];
                };
            };
        };
    };
    TicketsController_close: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Ticket id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TicketDto"];
                };
            };
        };
    };
    ComplaintController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of all complaints */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintDto"][];
                };
            };
        };
    };
    ComplaintController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateComplaintDto"];
            };
        };
        responses: {
            /** @description Complaint created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintDto"];
                };
            };
        };
    };
    ComplaintController_getComplaintsBySchool: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of complaints for the school */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintDto"][];
                };
            };
        };
    };
    ComplaintController_getComplaintsByUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of complaints for the user */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintDto"][];
                };
            };
        };
    };
    ComplaintController_findOne: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID or ticket number of the complaint */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Complaint found */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintDto"];
                };
            };
        };
    };
    ComplaintController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the complaint */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateComplaintDto"];
            };
        };
        responses: {
            /** @description Complaint updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintDto"];
                };
            };
        };
    };
    ComplaintController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the complaint */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Complaint deleted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintDto"];
                };
            };
        };
    };
    ComplaintController_updateStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the complaint */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateComplaintStatusDto"];
            };
        };
        responses: {
            /** @description Complaint status updated successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ComplaintDto"];
                };
            };
        };
    };
    FeesController_getDashboardSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeDashboardSummaryDto"];
                };
            };
        };
    };
    FeesController_getCategoriesSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeCategorySummaryDto"][];
                };
            };
        };
    };
    FeesController_getReceiptSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReceiptSettingsDto"];
                };
            };
        };
    };
    FeesController_updateReceiptSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateReceiptSettingsDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReceiptSettingsDto"];
                };
            };
        };
    };
    FeesController_getCategories: {
        parameters: {
            query: {
                includeArchived: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeCategoryDto"][];
                };
            };
        };
    };
    FeesController_createCategory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateFeeCategoryDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeCategoryDto"];
                };
            };
        };
    };
    FeesController_getCategoryById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeCategoryDto"];
                };
            };
        };
    };
    FeesController_updateCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateFeeCategoryDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeCategoryDto"];
                };
            };
        };
    };
    FeesController_archiveCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeCategoryDto"];
                };
            };
        };
    };
    FeesController_restoreCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeCategoryDto"];
                };
            };
        };
    };
    FeesController_getFeeItems: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                status?: "draft" | "active" | "inactive" | "archived";
                categoryId?: string;
                academicYearId?: string;
                /** @description Case-insensitive name search (matched literally) */
                search?: string;
                includeArchived?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeItemListResponseDto"];
                };
            };
        };
    };
    FeesController_createFeeItem: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateFeeItemDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeItemDto"];
                };
            };
        };
    };
    FeesController_getFeeItemById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeItemDto"];
                };
            };
        };
    };
    FeesController_updateFeeItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateFeeItemDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeItemDto"];
                };
            };
        };
    };
    FeesController_duplicateFeeItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeItemDto"];
                };
            };
        };
    };
    FeesController_archiveFeeItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeItemDto"];
                };
            };
        };
    };
    FeesController_restoreFeeItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeItemDto"];
                };
            };
        };
    };
    FeesController_getFeeAssignments: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                status?: "draft" | "active" | "inactive" | "archived";
                classId?: string;
                feeItemId?: string;
                academicYearId?: string;
                includeArchived?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeAssignmentListResponseDto"];
                };
            };
        };
    };
    FeesController_assignFeeToClasses: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignFeeToClassesDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssignFeeResponseDto"];
                };
            };
        };
    };
    FeesController_getFeeAssignmentById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeAssignmentDto"];
                };
            };
        };
    };
    FeesController_updateFeeAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateFeeAssignmentDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeAssignmentDto"];
                };
            };
        };
    };
    FeesController_publishFeeAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeAssignmentDto"];
                };
            };
        };
    };
    FeesController_unpublishFeeAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeAssignmentDto"];
                };
            };
        };
    };
    FeesController_archiveFeeAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeAssignmentDto"];
                };
            };
        };
    };
    FeesController_restoreFeeAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeeAssignmentDto"];
                };
            };
        };
    };
    FeesController_createManualPayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateManualPaymentDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ManualPaymentResponseDto"];
                };
            };
        };
    };
    FeesController_getPayments: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
                status?: "unpaid" | "part_paid" | "paid" | "pending" | "successful" | "failed" | "refunded" | "partial";
                /** @description The child's Student id. */
                studentId?: string;
                /**
                 * @deprecated
                 * @description Deprecated: ledger rows are per child, not per parent; ignored.
                 */
                parentId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeePaymentListResponseDto"];
                };
            };
        };
    };
    FeesController_getStudentPayments: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeePaymentDto"][];
                };
            };
        };
    };
    FeesController_getPaymentById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeePaymentDto"];
                };
            };
        };
    };
    SettingsController_getSchoolProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SettingsController_updateSchoolProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSchoolProfileDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SettingsController_getReceiptSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReceiptSettingsResponseDto"];
                };
            };
        };
    };
    SettingsController_updateReceiptSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateReceiptSettingsDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReceiptSettingsResponseDto"];
                };
            };
        };
    };
    SettingsController_getFinanceSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FinanceSettingsResponseDto"];
                };
            };
        };
    };
    SettingsController_updateFinanceSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateFinanceSettingsDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FinanceSettingsResponseDto"];
                };
            };
        };
    };
    SettingsController_getAcademicSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademicSettingsResponseDto"];
                };
            };
        };
    };
    SettingsController_updateAcademicSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAcademicSettingsDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademicSettingsResponseDto"];
                };
            };
        };
    };
    SettingsController_changePassword: {
        parameters: {
            query?: never;
            header?: {
                /** @description Web apps: which app is calling (`teachers`, `school-admin`, `students`, `parents`, `platform-admin`). With it the refresh token lives in that app’s own httpOnly cookie, `refreshToken_<app>`, and only an account whose role belongs in the app is signed in or refreshed. Without it (native apps, older clients) the shared `refreshToken` cookie is used as before. */
                "X-Talim-App"?: "teachers" | "school-admin" | "students" | "parents" | "platform-admin";
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SettingsController_exportData: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                type: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    PaymentsController_getFamilyFees: {
        parameters: {
            query?: {
                /** @description Only this term's fees (a term belongs to one school). */
                termId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FamilyFeesResponseDto"];
                };
            };
        };
    };
    PaymentsController_getDueFees: {
        parameters: {
            query?: {
                /** @description The child; optional when `X-Talim-Child` names the child. */
                studentId?: string;
                academicYearId?: string;
                termId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DueFeesResponseDto"];
                };
            };
        };
    };
    PaymentsController_getPaymentSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaymentSummaryDto"];
                };
            };
        };
    };
    PaymentsController_getPaymentHistory: {
        parameters: {
            query?: {
                /** @description One child; omit for every linked child. */
                childId?: string;
                /** @description Deprecated alias of `childId`. */
                studentId?: string;
                termId?: string;
                status?: string;
                startDate?: string;
                endDate?: string;
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentHistoryResponseDto"];
                };
            };
        };
    };
    PaymentsController_getReceipts: {
        parameters: {
            query?: {
                /** @description One child; omit for every linked child. */
                childId?: string;
                /** @description Deprecated alias of `childId`. */
                studentId?: string;
                academicYearId?: string;
                termId?: string;
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentReceiptListResponseDto"];
                };
            };
        };
    };
    PaymentsController_getReceiptById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                receiptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentReceiptResponseDto"];
                };
            };
        };
    };
    PaymentsController_downloadReceipt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                receiptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentReceiptResponseDto"];
                };
            };
        };
    };
    PaymentsController_initializePayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InitializePaymentDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InitializePaymentResponseDto"];
                };
            };
        };
    };
    PaymentsController_verifyPayment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                reference: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerifyPaymentResponseDto"];
                };
            };
        };
    };
    PaymentsController_getBankDetails: {
        parameters: {
            query?: {
                /** @description The child; optional when `X-Talim-Child` names the child. */
                childId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BankDetailsResponseDto"];
                };
            };
        };
    };
    PaymentsController_submitBankTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BankTransferDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BankTransferSubmittedResponseDto"];
                };
            };
        };
    };
    PaymentsController_getEnabledProviders: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnabledProvidersResponseDto"];
                };
            };
        };
    };
    PaymentsController_getBankTransfers: {
        parameters: {
            query?: {
                status?: "pending" | "confirmed" | "rejected";
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminBankTransferListResponseDto"];
                };
            };
        };
    };
    PaymentsController_confirmBankTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                transactionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BankTransferDecisionResponseDto"];
                };
            };
        };
    };
    PaymentsController_rejectBankTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                transactionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RejectBankTransferDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BankTransferDecisionResponseDto"];
                };
            };
        };
    };
    PaymentsController_getAdminTransactions: {
        parameters: {
            query?: {
                status?: string;
                providerName?: string;
                startDate?: string;
                endDate?: string;
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTransactionListResponseDto"];
                };
            };
        };
    };
    PaymentsController_getAdminSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPaymentSummaryDto"];
                };
            };
        };
    };
    PaymentsController_getAdminProviders: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnabledProvidersResponseDto"];
                };
            };
        };
    };
    PaymentsController_getAdminReceipts: {
        parameters: {
            query?: {
                /** @description One child; omit for every linked child. */
                childId?: string;
                /** @description Deprecated alias of `childId`. */
                studentId?: string;
                academicYearId?: string;
                termId?: string;
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminReceiptListResponseDto"];
                };
            };
        };
    };
    PaymentsController_getAdminReceiptById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                receiptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReceiptResponseDto"];
                };
            };
        };
    };
    PaymentsController_createManualPayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ManualPaymentDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ManualPaymentResponseDto"];
                };
            };
        };
    };
    PaymentsController_refundPayment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                transactionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefundPaymentDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RefundPaymentResponseDto"];
                };
            };
        };
    };
    PaymentsController_getPlatformProviders: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlatformProvidersResponseDto"];
                };
            };
        };
    };
    PaymentsController_updatePlatformProviderConfig: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                providerName: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PlatformProviderConfigDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UpdatePlatformProviderResponseDto"];
                };
            };
        };
    };
    PaymentsController_enableProvider: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                providerName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    PaymentsController_disableProvider: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                providerName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    PaymentsController_paystackWebhook: {
        parameters: {
            query?: never;
            header: {
                "x-paystack-signature": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    PaymentsController_opayWebhook: {
        parameters: {
            query?: never;
            header: {
                sign: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    PaymentsController_stripeWebhook: {
        parameters: {
            query?: never;
            header: {
                "stripe-signature": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    FinanceController_getWalletSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WalletSummaryResponseDto"];
                };
            };
        };
    };
    FinanceController_getWalletTransactions: {
        parameters: {
            query?: {
                type?: string;
                status?: string;
                startDate?: string;
                endDate?: string;
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WalletTransactionListResponseDto"];
                };
            };
        };
    };
    FinanceController_getBanks: {
        parameters: {
            query: {
                country: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BankListResponseDto"];
                };
            };
        };
    };
    FinanceController_resolveAccount: {
        parameters: {
            query: {
                accountNumber: string;
                bankCode: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResolveAccountResponseDto"];
                };
            };
        };
    };
    FinanceController_getBankAccounts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BankAccountListResponseDto"];
                };
            };
        };
    };
    FinanceController_addBankAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddBankAccountDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BankAccountResponseDto"];
                };
            };
        };
    };
    FinanceController_setDefaultBankAccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    FinanceController_verifyBankAccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BankAccountResponseDto"];
                };
            };
        };
    };
    FinanceController_removeBankAccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    FinanceController_initiateWithdrawal: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InitiateWithdrawalDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InitiateWithdrawalResponseDto"];
                };
            };
        };
    };
    FinanceController_resendOtp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResendWithdrawalOtpDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResendWithdrawalOtpResponseDto"];
                };
            };
        };
    };
    FinanceController_verifyOtp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerifyWithdrawalOtpDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerifyWithdrawalOtpResponseDto"];
                };
            };
        };
    };
    FinanceController_confirmWithdrawal: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfirmWithdrawalDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConfirmWithdrawalResponseDto"];
                };
            };
        };
    };
    FinanceController_getWithdrawals: {
        parameters: {
            query?: {
                status?: string;
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WithdrawalListResponseDto"];
                };
            };
        };
    };
    FinanceController_getWithdrawalById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WithdrawalResponseDto"];
                };
            };
        };
    };
    FinanceController_cancelWithdrawal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    FinanceController_getAdminWithdrawals: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WithdrawalListResponseDto"];
                };
            };
        };
    };
    FinanceController_approveWithdrawal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WithdrawalActionDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    FinanceController_rejectWithdrawal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WithdrawalActionDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    FinanceController_markProcessing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    FinanceController_markCompleted: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WithdrawalActionDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    FinanceController_markFailed: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WithdrawalActionDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessMessageResponseDto"];
                };
            };
        };
    };
    FinanceController_getSecurityStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SecurityStatusResponseDto"];
                };
            };
        };
    };
    FinanceController_setup2fa: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TwoFactorSetupResponseDto"];
                };
            };
        };
    };
    FinanceController_verify2fa: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TwoFactorVerifyDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessResponseDto"];
                };
            };
        };
    };
    FinanceController_disable2fa: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TwoFactorDisableDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessResponseDto"];
                };
            };
        };
    };
    FinanceController_setRequire2fa: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateWithdrawal2faDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuccessResponseDto"];
                };
            };
        };
    };
    TransitController_getDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    TransitController_listEnrollments: {
        parameters: {
            query?: {
                /** @description Filter by class ID */
                classId?: string;
                /** @description Filter by academic year ID */
                academicYearId?: string;
                /** @description Filter by enrollment status */
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>[];
                };
            };
        };
    };
    TransitController_createEnrollment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateEnrollmentDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_getStudentEnrollmentHistory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>[];
                };
            };
        };
    };
    TransitController_listPromotionRuns: {
        parameters: {
            query?: {
                /** @description Filter by promotion run status */
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>[];
                };
            };
        };
    };
    TransitController_createPromotionRun: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePromotionRunDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_getPromotionRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_validatePromotionRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_commitPromotionRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_cancelPromotionRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_listTransfers: {
        parameters: {
            query?: {
                status?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>[];
                };
            };
        };
    };
    TransitController_createTransferRequest: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudentTransferRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_getTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_getStudentSnapshot: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                studentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    TransitController_approveTransferFromSource: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_approveTransferFromTarget: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_acceptTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_rejectTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RejectTransferDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_cancelTransfer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CancelTransferDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_getPreCloseSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academicYearId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    TransitController_closeAcademicYear: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academicYearId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    TransitController_getClosureSnapshot: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                academicYearId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": Record<string, never>;
                };
            };
        };
    };
    SubAdminController_listSubAdmins: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated list of sub-admins */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubAdminController_createSubAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSubAdminDto"];
            };
        };
        responses: {
            /** @description Sub-admin created successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Email already in use */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubAdminController_promoteTeacher: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PromoteTeacherDto"];
            };
        };
        responses: {
            /** @description Teacher promoted successfully */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description User is not a teacher */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Teacher not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubAdminController_getSubAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description userId of the sub-admin */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Sub-admin details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sub-admin not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubAdminController_removeSubAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description userId of the sub-admin to delete */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Sub-admin removed */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sub-admin not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubAdminController_updatePermissions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description userId of the sub-admin */
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePermissionsDto"];
            };
        };
        responses: {
            /** @description Permissions updated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sub-admin not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubAdminController_toggleStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description userId of the sub-admin */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Status toggled */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sub-admin not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SubAdminController_demoteSubAdmin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description userId of the sub-admin to demote */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Sub-admin demoted */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Sub-admin not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SupportController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSupportTicketDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SupportTicketCreatedDto"];
                };
            };
        };
    };
}
