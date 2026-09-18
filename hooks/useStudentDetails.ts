// hooks/useStudentDetails.ts
'use client';

import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { authService } from '@/services/auth.service';

interface StudentDetails {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  admissionNumber?: string;
  phoneNumber: string;
  isActive: boolean;
  isEmailVerified: boolean;
  // Add other fields as needed
}

/**
 *
 */
export const useStudentDetails = () => {
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const cookies = parseCookies();
        const accessToken = cookies.access_token;

        if (!accessToken) {
        //   throw new Error('No access token found');
          localStorage.removeItem('studentDetails');
        setStudentDetails(null);
        setLoading(false);   
        return;

        }

        // Check cache first
        const cachedDetails = localStorage.getItem('studentDetails');
        if (cachedDetails) {
          const parsedDetails = JSON.parse(cachedDetails);
          if (parsedDetails.admissionNumber) {
            setStudentDetails(parsedDetails);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data if no cache
        const data = await authService.introspect(accessToken);
        setStudentDetails(data.user);
        localStorage.setItem('studentDetails', JSON.stringify(data.user));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch student details');
        // Clear cache if error occurs
        localStorage.removeItem('studentDetails');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  // Add refresh function if needed
  const refresh = async () => {
    try {
      setLoading(true);
      const cookies = parseCookies();
      const accessToken = cookies.access_token;
      
      if (!accessToken) {
        localStorage.removeItem('studentDetails');
        setStudentDetails(null);
        throw new Error('No access token found');
      }
  
      const data = await authService.introspect(accessToken);
      setStudentDetails(data.user);
      localStorage.setItem('studentDetails', JSON.stringify(data.user));
    } catch (err) {
      localStorage.removeItem('studentDetails');
      setError(err instanceof Error ? err.message : 'Failed to refresh student details');
    } finally {
      setLoading(false);
    }
  };

  return { studentDetails, loading, error, refresh };
};
