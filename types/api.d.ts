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
        /** Liveness probe */
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
        /** Health probe used by the platform and rate-limit exemptions */
        get: operations["AppController_health"];
        put?: never;
        post?: never;
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
        /** Get terms by school ID */
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
        /** Get timetable by teacher */
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
    "/grade-records/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Bulk create assessment grade records */
        post: operations["GradeRecordsController_bulkCreateAssessmentGradeRecords"];
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
        /** Save assessment scores in batch for grading workspace */
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
        /** Batch upload scores endpoint (JSON payload) */
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
         * Publish assessment grades for a course
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
    "/grade-records/course-grade-records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get course grade records for the school
         * @description Returns paginated course grade records for the authenticated school. Filter by courseId and/or termId.
         */
        get: operations["GradeRecordsController_getCourseGradeRecords"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/course-grade-records/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get paginated course grade records for a course */
        get: operations["GradeRecordsController_getCourseGradeRecordsByCourse"];
        put?: never;
        post?: never;
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
    "/grade-records/student-cumulative-term-grade-records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a student cumulative term grade record */
        post: operations["GradeRecordsController_createStudentCumulativeTermGradeRecord"];
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
    "/grade-records/class-cumulative-term-grade-records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a class cumulative term grade record */
        post: operations["GradeRecordsController_createClassCumulativeTermGradeRecord"];
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
    "/grade-records/class-cumulative-term-grade-records/calculate/{classId}/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Auto-calculate and create class cumulative term grade record
         * @description Calculates class average and recomputes positions from student cumulative records.
         */
        post: operations["GradeRecordsController_calculateAndCreateClassCumulativeTermGradeRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student-cumulative-term-grade-records/class/{classId}/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all student cumulative term grade records for a class and term */
        get: operations["GradeRecordsController_getStudentCumulativeTermGradeRecordsByClassAndTerm"];
        put?: never;
        post?: never;
        delete?: never;
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
         * Publish class cumulative term grade record
         * @description Marks the class cumulative grade as published and notifies students and parents.
         */
        post: operations["GradeRecordsController_publishClassCumulativeTermGradeRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student/me/assessments/{assessmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the authenticated student's score for a specific assessment */
        get: operations["GradeRecordsController_getMyAssessmentGradeRecord"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student/me/course-grades/term/{termId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the authenticated student's course grade records for a term */
        get: operations["GradeRecordsController_getMyCourseGradeRecordsByTerm"];
        put?: never;
        post?: never;
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
        /** Get all courses in the authenticated student's class with published result counts */
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
        /** Get published assessments for one course for the authenticated student */
        get: operations["GradeRecordsController_getMyPublishedAssessmentsForCourse"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/grade-records/student/me/cumulative-grades": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get all of the authenticated student's cumulative term grade records
         * @description Only term results the teacher has published are returned: an unpublished
         *     cumulative record is computed from every recorded score, so none of it
         *     (average, grade, position) is shown until publication.
         */
        get: operations["GradeRecordsController_getMyCumulativeGradeRecords"];
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
        /** Get student's cumulative result summary for a term */
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
        /** Get student's per-subject results for a term */
        get: operations["ParentResultsController_getSubjectResults"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/results/{studentId}/grade-summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get student's grade distribution summary */
        get: operations["ParentResultsController_getGradeSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/results/{studentId}/term-progress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get student's term progress and course comparison */
        get: operations["ParentResultsController_getTermProgress"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parent/results/{studentId}/assessment-breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get student's individual assessment scores */
        get: operations["ParentResultsController_getAssessmentBreakdown"];
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
        /** Get live academic KPIs (avg grade + class position) from current term grades */
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
        /** Get courses with published assessment results (same data the student sees) */
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
        /** Get published assessments for one course (same data the student sees) */
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
        /** Authenticate user and get tokens */
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
         * @description Reads the httpOnly refresh token cookie, rotates it, and returns a new access token.
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
        /** Logout user and invalidate tokens */
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
         * @description Also completes the forced change for accounts created with a temporary password. Signs out other sessions and returns a fresh access token; the refresh cookie is replaced.
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
         * @description Upload an image file (jpg, jpeg, png, gif) or pass a direct Cloudinary URL.
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
        /** Talim admin portal login — only role=admin users are granted access */
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
        /** Login using a previously enrolled biometric credential */
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
    "/users/teachers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all teachers for the user's school */
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
    "/teachers/dashboard/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get aggregate dashboard for authenticated teacher
         * @description Returns teacher KPIs, timetable summaries, attendance summary, grading summary, resources summary, recent activity, and setup progress in one payload
         */
        get: operations["TeacherController_getMyTeacherDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teachers/{teacherId}/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get aggregate dashboard for a specific teacher
         * @description Returns teacher KPIs, timetable summaries, attendance summary, grading summary, resources summary, recent activity, and setup progress in one payload
         */
        get: operations["TeacherController_getTeacherDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
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
         * Get dashboard KPIs for a specific teacher
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
    "/teachers/dashboard/kpis/all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get dashboard KPIs for all teachers in the school
         * @description Returns comprehensive dashboard statistics for all teachers in the authenticated user's school
         */
        get: operations["TeacherController_getAllTeachersDashboardKpis"];
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
    "/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new student */
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
         * @description Retrieves comprehensive KPI metrics for a specific student including enrolled subjects, grade score, and attendance percentage.
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
        /** Get student dashboard KPIs by user ID */
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
    "/students/by-parent/{parentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get students by parent ID */
        get: operations["StudentController_getStudentsByParentId"];
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
        /** Mark student attendance */
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
        /** Get attendance record by ID */
        get: operations["AttendanceController_getAttendanceById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Correct a recorded attendance mark
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
         * @description Returns monthly summary cards, calendar records, selected-day details, and recent attendance rows for the parent attendance dashboard.
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
         * Get attendance status for a class
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
        /** Get leave request summary counts for a student */
        get: operations["LeaveRequestController_getLeaveRequestSummary"];
        put?: never;
        post?: never;
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
        /** Get children linked to the authenticated parent */
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
    "/parents/me/children/{childId}/timetable": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get timetable for a linked child */
        get: operations["ParentsController_getMyChildTimetable"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/parents/me/children/{childId}/timetable/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Download timetable for a linked child */
        get: operations["ParentsController_downloadMyChildTimetable"];
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
        /** Get detail for a specific linked child */
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
        /** Update editable profile fields for a linked child (name, DOB) */
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
        /** Update parent profile (fullName, avatar) */
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
        /** Change parent account password */
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
    "/parent/settings/children": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get linked children (read-only) */
        get: operations["ParentSettingsController_getLinkedChildren"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teacher/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get settings overview for authenticated teacher */
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
        /** Update teacher profile settings */
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
        /** Update teacher notification and workspace preferences */
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
        /** Deactivate FCM device token on logout */
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
        /** Mark all notifications as read for authenticated user */
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
        /** Update notification preferences for authenticated user */
        patch: operations["MyNotificationsController_updatePreferences"];
        trace?: never;
    };
    "/admin/notifications/send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send a targeted notification to a set of users (admin only)
         * @description Platform-admin broadcast to explicit users and/or whole schools.
         */
        post: operations["AdminNotificationController_sendAdminNotification"];
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
    "/notifications/send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send notifications to multiple users */
        post: operations["AnnoucementController_sendNotifications"];
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
         * @description Non-staff callers only ever see their own notifications.
         */
        get: operations["NotificationController_findAll"];
        put?: never;
        /** Create and send a notification */
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
        /** Notification KPI summary (own, or any recipient for staff) */
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
        /** Unread notifications for a user (self, or any user for staff) */
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
        /** Get a notification by ID */
        get: operations["NotificationController_findOne"];
        /** Update a notification */
        put: operations["NotificationController_update"];
        post?: never;
        /** Delete a notification */
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
         * @description For a student or parent: the teachers of their class (or of each child's class) — the class teacher and whoever teaches it — as user ids ready for POST /chat/rooms. Empty for staff, who pick people from their own directories.
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
        /** Get all chat rooms for the authenticated user */
        get: operations["ChatController_getUserChatRooms"];
        put?: never;
        /** Create a new chat room */
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
        /** Create a group chat for admins and parents */
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
         * @description Allowed for whoever may manage the group (creator, teachers in the group, school staff with manage:messages). Members are told with the room-updated socket event.
         */
        patch: operations["ChatController_updateRoom"];
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
        /** Search chat rooms */
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
        /** Get messages from a chat room with populated participants */
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
        /** Send a message to a chat room */
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
        /** Mark a message as read */
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
        /** Get unread message count for the authenticated user */
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
        /** Get participants of a chat room */
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
        /** Add participant to a chat room */
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
        /** Remove participant from a chat room */
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
        /** Get message preferences for the authenticated user */
        get: operations["ChatController_getMessagePreferences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update message preferences for the authenticated user */
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
    "/complaints": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get all complaints */
        get: operations["ComplaintController_findAll"];
        put?: never;
        /** Create a new complaint */
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
        /** Get complaints by school ID */
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
        /** Get complaints by user ID */
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
        /** Get a complaint by ID or ticket number */
        get: operations["ComplaintController_findOne"];
        /** Update a complaint */
        put: operations["ComplaintController_update"];
        post?: never;
        /** Delete a complaint */
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
        /** Update complaint status */
        patch: operations["ComplaintController_updateStatus"];
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
        /** Fee totals per category for the dashboard */
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
        /** Read the fee receipt settings */
        get: operations["FeesController_getReceiptSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update the fee receipt settings */
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
        /** List fee categories */
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
        /** Get a fee category */
        get: operations["FeesController_getCategoryById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update a fee category */
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
        /** Archive a fee category */
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
        /** Restore an archived fee category */
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
        /** List fee items */
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
        /** Get a fee item */
        get: operations["FeesController_getFeeItemById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update a fee item */
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
        /** Duplicate a fee item */
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
        /** Archive a fee item */
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
        /** Restore an archived fee item */
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
        /** List fee assignments */
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
        /** Get a fee assignment */
        get: operations["FeesController_getFeeAssignmentById"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update a fee assignment */
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
        /** Publish a fee assignment to parents */
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
        /** Unpublish a fee assignment */
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
        /** Archive a fee assignment */
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
        /** Restore an archived fee assignment */
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
        /** Record a fee payment made outside the platform */
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
        /** List fee payments */
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
        /** List one student’s fee payments */
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
        /** Get a fee payment */
        get: operations["FeesController_getPaymentById"];
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
        /** Unpaid fee assignments for one of the parent’s children */
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
        /** Totals paid and pending at checkout, and the receipt count, for the parent */
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
        /** Paged payment history for the parent */
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
        /** Paged receipts for the parent */
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
        /** One receipt belonging to the parent */
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
        /** Receipt payload for download (same data as the receipt endpoint) */
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
        /** Start a hosted checkout for selected fees */
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
        /** Confirm a payment after returning from checkout */
        get: operations["PaymentsController_verifyPayment"];
        put?: never;
        post?: never;
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
        /** Payment providers currently enabled for checkout */
        get: operations["PaymentsController_getEnabledProviders"];
        put?: never;
        post?: never;
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
        /** Paged transactions for the school */
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
        /** Transaction totals for the school */
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
        /** Payment providers currently enabled */
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
        /** Paged receipts for the school */
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
        /** One receipt belonging to the school */
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
        /** Record a payment received outside the platform */
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
        /** Refund a successful payment (full or partial) */
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
        /** Create or update a provider configuration */
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
        /** Enable a provider for checkout */
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
        /** Disable a provider for checkout */
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
        /** OPay webhook */
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
        /** Stripe webhook */
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
        /** Read the receipt settings */
        get: operations["SettingsController_getReceiptSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update the receipt settings */
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
        /** Read the finance settings */
        get: operations["SettingsController_getFinanceSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update the finance settings */
        patch: operations["SettingsController_updateFinanceSettings"];
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
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        UpdateCourseDto: Record<string, never>;
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
        CreateTimetableDto: {
            classId: Record<string, never>;
            courseId: Record<string, never>;
            /** @enum {string} */
            day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
            startTime: string;
            endTime: string;
        };
        Timetable: Record<string, never>;
        UpdateTimetableDto: {
            /** @enum {string} */
            day?: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
            startTime?: string;
            endTime?: string;
            room?: string;
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
            /** @description Maximum possible score */
            maxScore: number;
            /** @description Class ID (resolved automatically from course if not provided) */
            classId?: string;
        };
        ResponseMessageDto: {
            /** @description Response message */
            message: string;
        };
        BulkAssessmentGradeDto: {
            /** @description Course ID */
            courseId: string;
            /** @description Student ID */
            studentId: string;
            /** @description Assessment ID */
            assessmentId: string;
            /** @description Actual score obtained by student */
            actualScore: number;
            /** @description Maximum possible score */
            maxScore: number;
            /** @description Class ID */
            classId: string;
        };
        BulkCreateAssessmentGradeRecordDto: {
            /** @description Array of assessment grades to create */
            grades: components["schemas"]["BulkAssessmentGradeDto"][];
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
            /** @default 100 */
            maxScore: number;
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
            /** @description Maximum possible score */
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
        CreateStudentCumulativeTermGradeRecordDto: {
            /** @description Class ID */
            classId: string;
            /** @description Student ID */
            studentId: string;
            /** @description Term ID (defaults to current term) */
            termId?: string;
            /** @description Array of Course Grade Record IDs */
            courseGradeRecords: string[];
            /** @description Total score */
            totalScore: number;
            /** @description Percentage score */
            percentage: number;
            /**
             * @description Overall grade
             * @enum {string}
             */
            grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E" | "F";
            /** @description Additional remarks */
            remarks?: string;
            /** @description Position in class */
            position: number;
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
        CreateClassCumulativeTermGradeRecordDto: {
            /** @description Class ID */
            classId: string;
            /** @description Term ID (defaults to current term) */
            termId?: string;
            /** @description Array of Student Cumulative Term Grade Record IDs */
            studentCumulativeTermGradeRecords: string[];
            /** @description Class average percentage */
            classAverage: number;
            /** @description Total number of students */
            totalStudents: number;
        };
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
        };
        UpdateTeacherStatusDto: {
            /** @example false */
            isActive: boolean;
        };
        ObjectId: Record<string, never>;
        CreateTeacherDto: {
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
            userId: components["schemas"]["ObjectId"];
            schoolId?: components["schemas"]["ObjectId"];
            staffNumber?: string;
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
        TeacherDashboardScheduleItemDto: {
            /** @example 60d5ecb8b3b3a3001f3e9999 */
            id: string;
            /** @example Monday */
            day: string;
            /** @example 08:00 AM */
            startTime: string;
            /** @example 09:00 AM */
            endTime: string;
            /** @example 08:00 AM - 09:00 AM */
            time: string;
            /** @example 60d5ecb8b3b3a3001f3e1111 */
            courseId: string;
            /** @example Algebra */
            course: string;
            /** @example Mathematics */
            subject: string;
            /** @example 60d5ecb8b3b3a3001f3e2222 */
            classId: string;
            /** @example JSS 2A */
            class: string;
            /** @example Upcoming */
            status?: Record<string, never>;
        };
        TeacherDashboardDaySummaryDto: {
            /** @example Monday */
            day: string;
            /** @example Mon */
            shortDay: string;
            /** @example 4 */
            classes: number;
        };
        TeacherDashboardGradingSummaryDto: {
            /** @example 3 */
            activeAssessments: number;
            /** @example 18 */
            pendingGrades: number;
            /** @example 12 */
            publishedResults: number;
            /** @example 2 */
            needsReview: number;
            /** @example 45 */
            recordedGrades: number;
        };
        TeacherDashboardAttendanceSummaryDto: {
            /** @example 68 */
            completionPercentage: number;
            /** @example 2 */
            completed: number;
            /** @example 2 */
            pending: number;
            /** @example 0 */
            notStarted: number;
            /** @example 4 */
            totalTodayClasses: number;
        };
        TeacherDashboardResourcesSummaryDto: {
            /** @example 2 */
            coursesMissingResources: number;
            /** @example 1 */
            coursesMissingCurriculum: number;
            /** @example 6 */
            recentlyUpdatedResources: number;
            /** @example 23 */
            totalResources: number;
        };
        TeacherDashboardActivityDto: {
            /** @example resource */
            type: string;
            /** @example Resource "Algebra Worksheet" uploaded */
            label: string;
            /** @example 2026-06-11T09:30:00.000Z */
            timestamp: string;
            /** @example /resources */
            href?: string;
        };
        TeacherDashboardSetupProgressDto: {
            /** @example 80 */
            percent: number;
            /**
             * @example [
             *       {
             *         "label": "Profile Setup",
             *         "done": true
             *       },
             *       {
             *         "label": "Subjects",
             *         "done": true
             *       }
             *     ]
             */
            checks: string[];
        };
        TeacherDashboardDto: {
            /**
             * @description Teacher user ID
             * @example 60d5ecb8b3b3a3001f3e1234
             */
            teacherId: string;
            /**
             * @description Teacher profile document ID
             * @example 60d5ecb8b3b3a3001f3e5678
             */
            teacherProfileId: string;
            /**
             * @description School ID
             * @example 60d5ecb8b3b3a3001f3e0000
             */
            schoolId: string;
            kpis: components["schemas"]["TeacherDashboardKpiDto"];
            todaySchedule: components["schemas"]["TeacherDashboardScheduleItemDto"][];
            weeklyTimetableSummary: components["schemas"]["TeacherDashboardDaySummaryDto"][];
            /** @description Full weekly timetable grouped by day */
            timetable: {
                [key: string]: unknown;
            };
            gradingSummary: components["schemas"]["TeacherDashboardGradingSummaryDto"];
            attendanceSummary: components["schemas"]["TeacherDashboardAttendanceSummaryDto"];
            resourcesSummary: components["schemas"]["TeacherDashboardResourcesSummaryDto"];
            recentActivity: components["schemas"]["TeacherDashboardActivityDto"][];
            setupProgress: components["schemas"]["TeacherDashboardSetupProgressDto"];
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
        StudentParentContactDto: {
            /** @enum {string} */
            relationship: "MOTHER" | "FATHER" | "GUARDIAN" | "OTHER";
            fullName: string;
            phoneNumber: string;
            email: string;
        };
        StudentProfileDto: {
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
            child: string;
            /** Format: date-time */
            startDate: string;
            /** Format: date-time */
            endDate: string;
            /** @enum {string} */
            leaveType: "Health Issue" | "Family Event" | "Fees Issue" | "Travel" | "Emergency" | "Other";
            attachments?: string[];
            reason?: string;
            term: string;
        };
        LeaveRequestDto: {
            _id: string;
            schoolId?: string;
            /** @description The student's user id. */
            child: string;
            /** Format: date-time */
            startDate: string;
            /** Format: date-time */
            endDate: string;
            /** @enum {string} */
            leaveType: "Health Issue" | "Family Event" | "Fees Issue" | "Travel" | "Emergency" | "Other";
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
            /** @enum {string} */
            leaveType: "Health Issue" | "Family Event" | "Fees Issue" | "Travel" | "Emergency" | "Other";
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
            /** Format: date-time */
            startDate?: string;
            /** Format: date-time */
            endDate?: string;
            /** @enum {string} */
            leaveType?: "Health Issue" | "Family Event" | "Fees Issue" | "Travel" | "Emergency" | "Other";
            reason?: string;
            attachments?: string[];
        };
        UpdateChildProfileDto: {
            /** @description Student first name */
            firstName?: string;
            /** @description Student last name */
            lastName?: string;
            /** @description Date of birth (ISO string) */
            dateOfBirth?: string;
        };
        CreateParentDto: {
            /** @description Parent user ID */
            userId: components["schemas"]["ObjectId"];
            /** @description School ID */
            schoolId: components["schemas"]["ObjectId"];
            /** @description Array of child IDs */
            children?: string[];
        };
        Parent: Record<string, never>;
        UpdateParentDto: {
            /** @description Parent user ID */
            userId?: components["schemas"]["ObjectId"];
            /** @description School ID */
            schoolId?: components["schemas"]["ObjectId"];
            /** @description Array of child IDs */
            children?: string[];
        };
        UpdateParentProfileDto: {
            /** @description Full display name of the parent */
            fullName?: string;
            /** @description Avatar URL (Cloudinary or similar) */
            avatar?: string;
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
        UpdateTeacherProfileDto: {
            /** @description Avatar URL */
            avatarUrl?: string;
        };
        TeacherNotificationPreferencesDto: {
            announcements?: boolean;
            attendance?: boolean;
            grading?: boolean;
            resources?: boolean;
            messages?: boolean;
            inApp?: boolean;
            email?: boolean;
            quietHoursEnabled?: boolean;
            quietStart?: string;
            quietEnd?: string;
        };
        TeacherMessagePreferencesDto: {
            groupNotifications?: boolean;
            unreadBadge?: boolean;
            soundEnabled?: boolean;
            showOnlineStatus?: boolean;
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
        };
        UpdateTeacherPreferencesDto: {
            notifications?: components["schemas"]["TeacherNotificationPreferencesDto"];
            messages?: components["schemas"]["TeacherMessagePreferencesDto"];
            teaching?: components["schemas"]["TeacherTeachingPreferencesDto"];
            guides?: components["schemas"]["TeacherGuidePreferencesDto"];
            /** @enum {string} */
            theme?: "light" | "dark" | "system";
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
        AdminSendNotificationDto: {
            /** @example Scheduled maintenance */
            title: string;
            /** @example Talim will be unavailable from 1am to 2am. */
            message: string;
            /** @example system_notice */
            type?: string;
            recipientIds?: string[];
            targetSchools?: string[];
            recipientRoles?: ("student" | "teacher" | "admin" | "parent" | "school_admin" | "school_sub_admin")[];
            /** @enum {string} */
            priority?: "low" | "medium" | "high";
            data?: Record<string, never>;
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
            category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "other";
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
        Announcement: Record<string, never>;
        EditAnnouncementDto: {
            title?: string;
            content?: string;
            targetAudience?: string[];
            reviewers?: string[];
            attachment?: string;
            attachments?: string[];
            audience?: string[];
            /** @enum {string} */
            category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "other";
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
            category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "other";
            /** @description Extra context used by clients to link notifications to modules. */
            metadata?: Record<string, never>;
            recipientId?: string;
            /** Format: date-time */
            scheduledFor?: string;
            isScheduled?: boolean;
            deliveryChannels?: ("inApp" | "email" | "push" | "webPush")[];
        };
        Notification: Record<string, never>;
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
            category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "other";
            /** @description Extra context used by clients to link notifications to modules. */
            metadata?: Record<string, never>;
            /** Format: date-time */
            scheduledFor?: string;
            isScheduled?: boolean;
            deliveryChannels?: ("inApp" | "email" | "push" | "webPush")[];
        };
        ScheduleNotificationDto: {
            notification: components["schemas"]["CreateNotificationDto"];
            /** Format: date-time */
            scheduledDate: string;
        };
        CreateChatRoomDto: {
            /**
             * @description Type of chat room
             * @enum {string}
             */
            type: "class_group" | "course_group" | "one_to_one" | "admin_parent_group" | "parent_group" | "custom_group";
            /** @description Class ID for class group chat */
            classId?: string;
            /** @description Course ID for course group chat */
            courseId?: string;
            /** @description Term ID for group chats */
            termId?: string;
            /** @description Participant user IDs */
            participants: string[];
        };
        ChatRoomResponseDto: {
            _id: string;
            /** @enum {string} */
            type: "class_group" | "course_group" | "one_to_one" | "admin_parent_group" | "parent_group" | "custom_group";
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
        CreateGroupChatDto: {
            /**
             * @description Type of group chat room (class_group, course_group, parent_group, or admin_parent_group)
             * @example admin_parent_group
             * @enum {string}
             */
            type: "class_group" | "course_group" | "parent_group" | "admin_parent_group";
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
        ChatRoomViewDto: {
            /** @enum {string} */
            type: "class_group" | "course_group" | "one_to_one" | "admin_parent_group" | "parent_group" | "custom_group";
            _id: string;
            /** @description Same as `_id`. */
            roomId: string;
            /** @description Empty for one-to-one rooms: show the other participant instead. */
            name: string;
            description?: string;
            avatarUrl?: string;
            classId?: string;
            courseId?: string;
            termId?: string;
            createdBy?: string;
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
        UpdateChatPreferencesDto: {
            /** @description Receive notifications for new messages */
            messageNotifications?: boolean;
            /** @description Allow teachers to send direct messages */
            allowTeacherMessages?: boolean;
            /** @description Receive school-wide announcement messages */
            schoolAnnouncements?: boolean;
            /** @description Send and display read receipts */
            readReceipts?: boolean;
            /** @description Let other members see this user as online / last seen. When off, this user always shows offline to others (their own view of others is unaffected). */
            showOnlineStatus?: boolean;
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
             * @description Image URL or path related to the resource
             * @example https://cloudinary.com/image/resource-image.jpg
             */
            image: string;
            /**
             * @description Array of file URLs related to the resource
             * @example [
             *       "https://cloudinary.com/file/resource1.pdf",
             *       "https://cloudinary.com/file/resource2.doc"
             *     ]
             */
            files?: string[];
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
            _id?: string;
            schoolId: string;
            signatureUrl: string;
            signatureName: string;
            signatureTitle: string;
            showSchoolLogo: boolean;
            allowParentDownload: boolean;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
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
        StudentNameRefDto: {
            _id: string;
            firstName: string;
            lastName: string;
        };
        FeePaymentDto: {
            studentId: string | components["schemas"]["StudentNameRefDto"];
            feeAssignmentId: string | components["schemas"]["FeeAssignmentDto"];
            _id: string;
            schoolId: string;
            parentId?: string;
            classId?: string;
            amountExpected: number;
            amountPaid: number;
            balance: number;
            /** @enum {string} */
            paymentMethod: "cash" | "bank_transfer" | "card" | "cheque" | "mobile_money" | "other";
            /** @enum {string} */
            paymentStatus: "pending" | "successful" | "failed" | "refunded" | "partial";
            transactionReference: string;
            receiptNumber: string;
            /** Format: date-time */
            paidAt: string;
            metadata?: Record<string, never>;
            recordedBy: string;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        FeePaymentListResponseDto: {
            data: components["schemas"]["FeePaymentDto"][];
            total: number;
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
            amount: number;
            /** Format: date-time */
            dueDate: string;
            lateFeeAmount: number;
            isOverdue: boolean;
        };
        DueFeesResponseDto: {
            fees: components["schemas"]["DueFeeDto"][];
        };
        PaymentSummaryDto: {
            /** @example true */
            success: boolean;
            /** @description Sum of the parent's SUCCESSFUL payments. */
            totalPaid: number;
            /** @description Sum of the parent's payments still PENDING at the provider (checkouts started but not completed). It is not what the parent owes: for that, use the due-fees list. */
            pendingCheckoutTotal: number;
            /**
             * @deprecated
             * @description Deprecated: same value as `pendingCheckoutTotal`. It is misnamed - it is the sum of PENDING checkouts, not the amount owed. Read `pendingCheckoutTotal` instead; this alias will be removed once no client reads it.
             */
            totalOutstanding: number;
            /** @description Number of receipts issued to the parent. */
            totalReceipts: number;
        };
        PaymentTransactionDto: {
            _id: string;
            schoolId: string;
            parentId: string;
            studentId: string;
            classId?: string;
            feeAssignmentIds: string[];
            /** @enum {string} */
            providerName: "paystack" | "opay" | "stripe";
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
            currency: string;
            /** @enum {string} */
            status: "pending" | "successful" | "failed" | "cancelled" | "refunded" | "partial";
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
        PaymentHistoryResponseDto: {
            data: components["schemas"]["PaymentTransactionDto"][];
            /** @description Total matching transactions across all pages. */
            total: number;
        };
        ReceiptFeeItemDto: {
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
        ReceiptListResponseDto: {
            data: components["schemas"]["PaymentReceiptDto"][];
            /** @description Total matching receipts across all pages. */
            total: number;
        };
        ReceiptResponseDto: {
            success: boolean;
            receipt: components["schemas"]["PaymentReceiptDto"];
        };
        InitializePaymentDto: {
            studentId: string;
            feeAssignmentIds: string[];
            /** @enum {string} */
            providerName: "paystack" | "opay" | "stripe";
            /** @enum {string} */
            paymentChannel?: "card" | "bank_transfer" | "ussd" | "wallet" | "bank" | "mobile_money";
        };
        InitializePaymentResponseDto: {
            transactionId: string;
            internalReference: string;
            /** @description Hosted checkout to send the parent to. */
            checkoutUrl: string;
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
        ManualPaymentDto: {
            studentId: string;
            feeAssignmentIds: string[];
            amount: number;
            paymentMethod: string;
            reference?: string;
            notes?: string;
        };
        ManualPaymentResponseDto: {
            success: boolean;
            transaction: components["schemas"]["PaymentTransactionDto"];
            receipt?: components["schemas"]["PaymentReceiptDto"];
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
        UpdateSchoolProfileDto: {
            physicalAddress?: string;
            logo?: string;
            contactPhone?: string;
            website?: string;
            primaryContacts?: components["schemas"]["UpdatePrimaryContactDto"][];
        };
        UpdateFinanceSettingsDto: {
            requireEmailOtpForWithdrawals?: boolean;
            minimumWithdrawalAmount?: number;
            defaultBankAccountId?: string;
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
            permissions: ("manage:classes" | "manage:curriculum" | "manage:assessments" | "manage:timetable" | "manage:fees" | "manage:payments" | "manage:finance" | "manage:students" | "manage:teachers" | "manage:parents" | "manage:announcements" | "manage:leave_requests" | "manage:transit" | "manage:messages" | "manage:settings" | "manage:sub_admins")[];
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
            permissions: ("manage:classes" | "manage:curriculum" | "manage:assessments" | "manage:timetable" | "manage:fees" | "manage:payments" | "manage:finance" | "manage:students" | "manage:teachers" | "manage:parents" | "manage:announcements" | "manage:leave_requests" | "manage:transit" | "manage:messages" | "manage:settings" | "manage:sub_admins")[];
        };
        UpdatePermissionsDto: {
            /**
             * @description Full replacement set of permissions for this sub-admin
             * @example [
             *       "manage:fees",
             *       "manage:finance"
             *     ]
             */
            permissions: ("manage:classes" | "manage:curriculum" | "manage:assessments" | "manage:timetable" | "manage:fees" | "manage:payments" | "manage:finance" | "manage:students" | "manage:teachers" | "manage:parents" | "manage:announcements" | "manage:leave_requests" | "manage:transit" | "manage:messages" | "manage:settings" | "manage:sub_admins")[];
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
    SubjectCourseController_createCourse: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example Algebra 101 */
                    title?: string;
                    /** @example Introduction to algebra */
                    description?: string;
                    /** @example MTH-S11B */
                    courseCode?: string;
                    /** @example Mathematics */
                    subjectName?: string;
                    /** @example 507f1f77bcf86cd799439011 */
                    teacherId?: string;
                    /** @example 507f191e810c19729de860ea */
                    classId?: string;
                    /**
                     * @example Academic
                     * @enum {string}
                     */
                    teacherRole?: "Academic" | "NonAcademic";
                };
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
                    "application/json": {
                        /** @example Terms fetched successfully */
                        message?: string;
                        terms?: {
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
                        }[];
                    };
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
                /** @description Filter by teacher ID */
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
                /** @description Page number */
                page?: number;
                /** @description Items per page */
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
    GradeRecordsController_bulkCreateAssessmentGradeRecords: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BulkCreateAssessmentGradeRecordDto"];
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
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
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
                content: {
                    "application/json": components["schemas"]["ResponseMessageDto"];
                };
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
    GradeRecordsController_getCourseGradeRecords: {
        parameters: {
            query?: {
                /** @description Filter by course ID */
                courseId?: string;
                /** @description Filter by term ID */
                termId?: string;
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
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
    GradeRecordsController_getCourseGradeRecordsByCourse: {
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
    GradeRecordsController_createStudentCumulativeTermGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudentCumulativeTermGradeRecordDto"];
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
    GradeRecordsController_createClassCumulativeTermGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateClassCumulativeTermGradeRecordDto"];
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
    GradeRecordsController_calculateAndCreateClassCumulativeTermGradeRecord: {
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
    GradeRecordsController_getStudentCumulativeTermGradeRecordsByClassAndTerm: {
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
    GradeRecordsController_getMyAssessmentGradeRecord: {
        parameters: {
            query?: never;
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
    GradeRecordsController_getMyCourseGradeRecordsByTerm: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
                limit?: number;
            };
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
    GradeRecordsController_getMyCumulativeGradeRecords: {
        parameters: {
            query?: {
                /** @description Page number (1-based) */
                page?: number;
                /** @description Items per page */
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
    ParentResultsController_getGradeSummary: {
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
    ParentResultsController_getTermProgress: {
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
    ParentResultsController_getAssessmentBreakdown: {
        parameters: {
            query?: {
                /** @description Defaults to the school's current term (see ParentResultsQueryDto) */
                termId?: string;
                /** @description Academic Year ID to filter results */
                academicYearId?: string;
                /** @description Filter by subject/course */
                courseId?: string;
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
            header?: never;
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
            /** @description Login successful */
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
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
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
            /** @description Invalid or expired refresh token */
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
            };
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
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordDto"];
            };
        };
        responses: {
            /** @description Password changed; body carries the new access_token */
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
            /** @description Token introspection result with user data */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
                "multipart/form-data": {
                    /** Format: binary */
                    avatar?: string;
                    avatarUrl?: string;
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
            header?: never;
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
            header?: never;
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
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
                    "application/json": {
                        data?: {
                            [key: string]: unknown;
                        }[];
                        /** @description Total number of teachers */
                        count?: number;
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
                content?: never;
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
    TeacherController_getMyTeacherDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Teacher aggregate dashboard retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherDashboardDto"];
                };
            };
        };
    };
    TeacherController_getTeacherDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Teacher user ID or Teacher profile document ID. Both are supported. */
                teacherId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Teacher aggregate dashboard retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherDashboardDto"];
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
    TeacherController_getAllTeachersDashboardKpis: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All teachers dashboard KPIs retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherDashboardKpiDto"][];
                };
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
                    "application/json": components["schemas"]["StudentProfileDto"];
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
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
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
    StudentController_getStudentsByParentId: {
        parameters: {
            query: {
                page: number;
                limit: number;
            };
            header?: never;
            path: {
                /** @description Parent ID */
                parentId: string;
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
                content?: never;
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
    ParentsController_getMyChildTimetable: {
        parameters: {
            query: {
                weekStart: string;
                view: string;
            };
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
    ParentsController_downloadMyChildTimetable: {
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
                content?: never;
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
                content?: never;
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
                content?: never;
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
            header?: never;
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
    ParentSettingsController_getLinkedChildren: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of linked children */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
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
                content?: never;
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
                content?: never;
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
                    "application/json": Record<string, never>;
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
                content?: never;
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
    AdminNotificationController_sendAdminNotification: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminSendNotificationDto"];
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
                    "application/json": components["schemas"]["Announcement"];
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
    AnnoucementController_sendNotifications: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    userIds?: string[];
                    title?: string;
                    body?: string;
                };
            };
        };
        responses: {
            /** @description Notifications sent successfully */
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
                content?: never;
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
                category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "other";
                type?: string;
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
                category?: "announcement" | "attendance" | "academics" | "grading" | "resources" | "messages" | "account" | "other";
                type?: string;
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
                    "application/json": components["schemas"]["Notification"][];
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
                    "application/json": Record<string, never>;
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
                    "application/json": Record<string, never>;
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
            /** @description Chat room created successfully */
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
                /** @description Number of messages to fetch (default: 50) */
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
                content?: never;
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
                content?: never;
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
                /** @description Page number (1-based) */
                page?: number;
                /** @description Number of items per page */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description Teacher ID */
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
                /** @description Teacher ID to get assigned classes for */
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
                    "application/json": components["schemas"]["FeePaymentDto"];
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
                status?: "pending" | "successful" | "failed" | "refunded" | "partial";
                studentId?: string;
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
    PaymentsController_getDueFees: {
        parameters: {
            query: {
                studentId: string;
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
                studentId?: string;
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
                    "application/json": components["schemas"]["PaymentHistoryResponseDto"];
                };
            };
        };
    };
    PaymentsController_getReceipts: {
        parameters: {
            query?: {
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
                    "application/json": components["schemas"]["ReceiptListResponseDto"];
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
                    "application/json": components["schemas"]["ReceiptResponseDto"];
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
                    "application/json": components["schemas"]["ReceiptResponseDto"];
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
                    "application/json": Record<string, never>;
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
                content?: never;
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
                    "application/json": Record<string, never>;
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
                content?: never;
            };
        };
    };
    SettingsController_changePassword: {
        parameters: {
            query?: never;
            header?: never;
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
}
