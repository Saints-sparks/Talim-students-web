"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Users, 
  RefreshCw, 
  Download, 
  AlertCircle, 
  ChevronLeft,
  Clock,
  BookOpen,
  MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimetable } from "@/hooks/useTimetable";
import { toast } from "react-hot-toast";

// Define a TypeScript interface for a single timetable entry.
interface TimetableEntry {
  time: string;
  startTime?: string;
  endTime: string;
  course: string;
  subject: string;
  class: string;
}

// Define interface for timetable data grouped by days
interface TimetableData {
  [day: string]: TimetableEntry[];
}

// Error state interface
interface ErrorState {
  hasError: boolean;
  message: string;
  type: 'network' | 'server' | 'empty' | 'unknown';
}

// Days of the week
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Time slots (configurable) - using 12-hour format to match backend
const TIME_SLOTS = [
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM', 
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM'
];

const Timetable: React.FC = () => {
  // Use the existing hook but adapt the data
  const { subjects, isLoading: hookLoading } = useTimetable();
  
  // State management
  const [timetableData, setTimetableData] = useState<TimetableData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: '',
    type: 'unknown'
  });
  const [retryCount, setRetryCount] = useState(0);
  
  // Filter states
  const [selectedDays, setSelectedDays] = useState<string[]>(DAYS);
  const [timeRange, setTimeRange] = useState({ start: 0, end: TIME_SLOTS.length - 1 });
  const [isMobileView, setIsMobileView] = useState(false);

  // Convert subjects from the hook to timetable data format
  useEffect(() => {
    setIsLoading(hookLoading);
    
    if (!hookLoading) {
      if (subjects.length === 0) {
        setError({
          hasError: true,
          message: 'No classes scheduled for this week',
          type: 'empty'
        });
        setTimetableData({});
      } else {
        // Convert subjects to timetable data format
        const convertedData: TimetableData = {};
        
        subjects.forEach(subject => {
          if (!convertedData[subject.day]) {
            convertedData[subject.day] = [];
          }
          
          convertedData[subject.day].push({
            time: subject.timeString,
            startTime: subject.timeString.split(' - ')[0],
            endTime: subject.timeString.split(' - ')[1],
            course: subject.name,
            subject: subject.name,
            class: 'Student Class' // Default as students don't have multiple classes
          });
        });
        
        setTimetableData(convertedData);
        setError({ hasError: false, message: '', type: 'unknown' });
        
        const totalClasses = subjects.length;
        if (totalClasses > 0) {
          toast.success(`Timetable loaded successfully! Found ${totalClasses} classes.`);
        }
      }
    }
  }, [subjects, hookLoading]);

  // Get timetable entry for specific day and time - improved matching
  const getTimetableEntry = (day: string, timeSlot: string) => {
    const dayEntries = timetableData[day] || [];
    
    // First, try exact matches
    let entry = dayEntries.find(entry => {
      const startTime = entry.startTime || '';
      const exactMatch = entry.time === timeSlot || `${startTime} - ${entry.endTime}` === timeSlot;
      return exactMatch;
    });
    
    if (entry) return entry;
    
    // If no exact match, try time-based matching
    const slotStart = timeSlot.split(' - ')[0]; // e.g., "08:00 AM"
    const slotStartHour = parseInt(slotStart.split(':')[0]); // e.g., 8
    const slotStartMinute = parseInt(slotStart.split(':')[1].split(' ')[0]); // e.g., 0
    
    entry = dayEntries.find(entry => {
      const startTime = entry.startTime || '';
      if (!startTime) return false;
      
      const entryStartHour = parseInt(startTime.split(':')[0]);
      const entryStartMinute = parseInt(startTime.split(':')[1].split(' ')[0]);
      
      // Check if the entry starts within this time slot (within same hour)
      const match = entryStartHour === slotStartHour && 
             Math.abs(entryStartMinute - slotStartMinute) <= 30; // Allow 30-minute tolerance
      
      return match;
    });
    
    return entry;
  };

  // Calculate total scheduled classes
  const getTotalScheduledClasses = () => {
    return Object.values(timetableData).reduce(
      (total: number, dayEntries) => total + (Array.isArray(dayEntries) ? dayEntries.length : 0), 
      0
    );
  };

  // Filter time slots based on range
  const filteredTimeSlots = TIME_SLOTS.slice(timeRange.start, timeRange.end + 1);

  // Export timetable to CSV
  const exportTimetable = () => {
    try {
      const totalClasses = getTotalScheduledClasses();
      if (totalClasses === 0) {
        toast.error('No timetable data to export');
        return;
      }

      // Create CSV content
      let csvContent = 'Day,Time Slot,Course,Subject,Class\n';
      
      selectedDays.forEach(day => {
        filteredTimeSlots.forEach(timeSlot => {
          const entry = getTimetableEntry(day, timeSlot);
          if (entry) {
            csvContent += `${day},"${timeSlot}","${entry.course}","${entry.subject}","${entry.class}"\n`;
          } else {
            csvContent += `${day},"${timeSlot}","Free Period","",""\n`;
          }
        });
      });

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `timetable_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Timetable exported successfully!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export timetable');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header with filters and controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 md:p-6 bg-gradient-to-r from-white to-blue-50 rounded-xl border border-[#F0F0F0] shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Weekly Timetable</h2>
            <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
              <Users className="w-4 h-4" />
              Your class schedule for the week
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Day filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Days:</label>
            <select
              value={selectedDays.length === DAYS.length ? 'all' : 'custom'}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  setSelectedDays(DAYS);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
            >
              <option value="all">All Days</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Time range filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Time:</label>
            <select
              value={`${timeRange.start}-${timeRange.end}`}
              onChange={(e) => {
                const [start, end] = e.target.value.split('-').map(Number);
                setTimeRange({ start, end });
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] transition-all"
            >
              <option value="0-8">Full Day (8:00 - 17:00)</option>
              <option value="0-4">Morning (8:00 - 13:00)</option>
              <option value="4-8">Afternoon (13:00 - 17:00)</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {/* Mobile view toggle - only show on small screens */}
            <Button
              onClick={() => setIsMobileView(!isMobileView)}
              variant="outline"
              size="sm"
              className="flex md:hidden items-center gap-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${isMobileView ? 'rotate-180' : ''}`} />
              <span>{isMobileView ? 'Table View' : 'Card View'}</span>
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="flex items-center gap-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
            
            <Button
              onClick={exportTimetable}
              variant="outline"
              size="sm"
              disabled={isLoading || error.hasError}
              className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      {isLoading ? (
        // Loading State
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-gradient-to-br from-white to-blue-50 rounded-xl border border-[#F0F0F0] shadow-sm">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-[#003366] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Your Timetable</h3>
            <p className="text-gray-600 max-w-md">
              Please wait while we fetch your class schedule for this week...
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#003366] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      ) : error.hasError ? (
        // Error States
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-red-700 mb-3">
              {error.type === 'network' ? '🌐 Connection Error' : 
               error.type === 'server' ? '⚠️ Server Error' : 
               error.type === 'empty' ? '📚 No Schedule Found' : '❌ Something went wrong'}
            </h3>
            
            <p className="text-red-600 max-w-md leading-relaxed">
              {error.message}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            
            {error.type === 'network' && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                Reload Page
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Timetable Grid
        <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Mobile Card View */}
          {isMobileView ? (
            <div className="p-4 space-y-4">
              {selectedDays.map(day => {
                const allDayEntries = timetableData[day] || [];
                const dayEntries = filteredTimeSlots.map(timeSlot => ({
                  timeSlot,
                  entry: getTimetableEntry(day, timeSlot)
                })).filter(item => item.entry); // Only show slots with classes
                
                return (
                  <div key={day} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#003366] rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-[#003366]">{day}</h3>
                      <div className="flex-1 h-px bg-[#003366]/20"></div>
                      <span className="text-sm text-gray-600">{allDayEntries.length} classes</span>
                    </div>
                    
                    {allDayEntries.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No classes scheduled</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Show all entries for this day */}
                        {allDayEntries.map((entry, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-[#003366]" />
                                <div>
                                  <h4 className="font-semibold text-gray-900">{entry.course}</h4>
                                  <p className="text-sm text-gray-600">{entry.subject}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-[#003366]">{entry.time}</div>
                                <div className="text-xs text-gray-500">
                                  {entry.startTime} - {entry.endTime}
                                </div>
                              </div>
                            </div>
                            
                            {entry.class && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{entry.class}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <th className="px-4 py-4 text-left font-semibold text-gray-700 min-w-[140px] border-r border-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      Time Slot
                    </div>
                  </th>
                  {selectedDays.map(day => (
                    <th key={day} className="px-4 py-4 text-center font-semibold text-gray-700 border-r border-gray-200">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{day}</span>
                        <div className="w-8 h-1 bg-[#003366] rounded-full"></div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTimeSlots.map((timeSlot, index) => (
                  <tr key={timeSlot} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50/30 transition-colors`}>
                    <td className="px-4 py-6 font-semibold text-gray-700 border-r-2 border-gray-200 bg-gray-50/50">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="text-sm font-bold text-[#003366]">{timeSlot}</div>
                        <div className="w-16 h-px bg-gray-300"></div>
                        <div className="text-xs text-gray-500">Slot {index + 1}</div>
                      </div>
                    </td>
                    {selectedDays.map(day => {
                      const entry = getTimetableEntry(day, timeSlot);
                      return (
                        <td key={`${day}-${timeSlot}`} className="px-2 md:px-4 py-4 md:py-6 border-r border-gray-200">
                          {entry ? (
                            <div className="bg-gradient-to-br from-[#003366] to-[#004080] text-white rounded-xl p-3 md:p-4 hover:from-[#002244] hover:to-[#003366] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-blue-200" />
                                  <div className="font-semibold text-xs md:text-sm">{entry.course}</div>
                                </div>
                                <Clock className="w-3 h-3 text-blue-200" />
                              </div>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                                <div className="text-xs text-blue-100 font-medium">{entry.subject}</div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Users className="w-3 h-3 text-blue-200" />
                                <div className="text-xs text-blue-200">{entry.class}</div>
                              </div>
                              
                              {/* Time indicator */}
                              <div className="mt-2 pt-2 border-t border-blue-400/30">
                                <div className="text-xs text-blue-200 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="hidden md:inline">{entry.time}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-20 md:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                                <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                              </div>
                              <span className="text-gray-400 text-xs font-medium">Free</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          
          {/* Summary footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg text-[#003366]">{getTotalScheduledClasses()}</div>
                  <div className="text-sm text-gray-600">classes scheduled this week</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-[#003366] to-[#004080] rounded shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Scheduled Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded border border-gray-400"></div>
                  <span className="text-sm font-medium text-gray-700">Free Period</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;