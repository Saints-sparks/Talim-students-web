"use client";
import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthDays = (year: number, month: number) => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end }).filter(
    (day) => ![0, 6].includes(day.getDay()) // Exclude weekends
  );

  // Get first weekday (Mon = 1, Fri = 5)
  const firstWeekday = days[0].getDay();
  const offset = firstWeekday === 0 ? 5 : firstWeekday - 1; // Ensure Monday starts in correct column

  return { days, offset }; // Return both days & offset
};

const attendanceData: { [key: string]: string } = {
  "2025-03-02": "Present",
  "2025-03-03": "Present",
  "2025-03-04": "Present",
  "2025-03-05": "Present",
  "2025-03-06": "Present",
  "2025-03-07": "Present",
  "2025-03-08": "Absent",
  "2025-03-09": "Absent",
  "2025-03-10": "Absent",
  "2025-03-11": "Absent",
  "2025-03-12": "Absent",
  "2025-03-13": "Absent",
  "2025-03-14": "Absent",
  "2025-03-15": "Absent",
};

const CustomCalendar = () => {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // const days = getMonthDays(selectedYear, selectedMonth);
  const weekDays = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
  const { days, offset } = getMonthDays(selectedYear, selectedMonth);

  return (
    <div className="w-full p-4 overflow-auto">
      {/* Month Selector */}
      <div className="flex flex-col sm:flex-row w-full justify-between gap-2">
        <div className="flex flex-col">
          <p>Attendance</p>
          <p className="text-[#AAAAAA]">Track your attendance with ease</p>
        </div>
        <div className="flex justify-start sm:justify-center gap-4 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="h-full">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-[#6F6F6F]"
              >
                {months[selectedMonth]} <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {months.map((month, index) => (
                <DropdownMenuItem
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                >
                  {month}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Year Input */}
          <input
            type="number"
            className="border p-2 text-[#6F6F6F] rounded w-20 text-center"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          />
        </div>
      </div>

      {/* Calendar Table */}
      <div className="w-full overflow-x-auto bg-white">
        <table className="w-full rounded-lg text-center">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="p-2 border-b font-normal text-[#858585] border-[#F0F0F0]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(
              { length: Math.ceil((days.length + offset) / 5) },
              (_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#F0F0F0]">
                  {Array.from({ length: 5 }, (_, colIndex) => {
                    const index = rowIndex * 5 + colIndex;

                    if (index < offset) {
                      return (
                        <td key={`empty-${index}`} className="p-3 border"></td>
                      ); // Empty cell
                    }

                    const date = days[index - offset]; // Adjust index to skip empty cells
                    if (!date)
                      return (
                        <td key={`empty-${index}`} className="p-3 border"></td>
                      );

                    const dateKey = format(date, "yyyy-MM-dd");
                    const attendance = attendanceData[dateKey];

                    return (
                      <td key={dateKey} className="p-3 relative border">
                        <div className="flex flex-col items-center">
                          <span>{format(date, "d")}</span>
                          <span
                            className={`mt-1 px-2 py-1 text-xs w-full text-left rounded-lg ${
                              attendance === "Present"
                                ? "bg-[#003366]/25 text-[#003366] border border-[#003366]/25"
                                : "bg-[#993333]/10 text-[#993333] border border-[#993333]/30"
                            }`}
                          >
                            {attendance}
                          </span>
                          {isToday(date) && (
                            <span className="absolute right-5 bg-gray-200 text-xs px-2 py-1 rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomCalendar;
