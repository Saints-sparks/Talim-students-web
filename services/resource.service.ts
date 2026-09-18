// services/resource.service.ts
import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/lib/authFetch";

/** A teaching resource uploaded for a class, with its populated relations. */
export interface Resource {
  _id: string;
  name: string;
  classId: {
    _id: string;
    name: string;
    schoolId: {
      _id: string;
      name: string;
      email: string;
      physicalAddress: string;
      location: {
        country: string;
        state: string;
        _id: string;
      };
      schoolPrefix: string;
      primaryContacts: Array<{
        name: string;
        phone: string;
        email: string;
        role: string;
        _id: string;
      }>;
      active: boolean;
      logo: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    classDescription: string;
    assignedCourses: string[];
    classTeacherId: {
      _id: string;
      userId: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        id: string;
      };
      assignedClasses: string[];
      assignedCourses: string[];
      isFormTeacher: boolean;
      isActive: boolean;
      highestAcademicQualification: string;
      yearsOfExperience: number;
      specialization: string;
      employmentType: string;
      employmentRole: string;
      availabilityDays: string[];
      availableTime: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
  courseId: {
    _id: string;
    description: string;
    id: string;
  } | null;
  uploadedBy: string | null;
  termId: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  uploadDate: string;
  image: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const ResourceServices = {
  /**
   * Every resource uploaded to one class.
   *
   * @param classId - The class the signed-in student belongs to.
   * @param accessToken - Bearer token; omit to use the stored session.
   * @returns The class's resources.
   * @throws {ApiError} On any non-2xx or connectivity failure.
   */
  getResourceDetails: (classId: string, accessToken?: string): Promise<Resource[]> =>
    api.get<Resource[]>(API_ENDPOINTS.RESOURCES_BY_CLASS.replace(":classId", classId), { accessToken }),
};
