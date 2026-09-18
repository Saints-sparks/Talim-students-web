import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScheduleTimelineProps } from "@/types/dashboard";

export function ScheduleTimeline({
  schedule,
  currentTime,
}: ScheduleTimelineProps) {
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "01:00",
    "02:00",
  ];

  const timelineWidth = 554.5; // Width for a 2-hour duration in pixels
  const slotWidth = 275; // Width for a 1-hour duration in pixels
  const lgStimelineWidth = 300;
  const lgSlotWidth = 146;
  // Function to calculate the left position of a subject based on its start time
  const getLeftPosition = (time: string) => {
    const [rawHour, minute] = time.split(":").map(Number);
    const hour = rawHour < 8 ? rawHour + 12 : rawHour; // Adjust PM hours
    const totalMinutes = (hour - 8) * 60 + minute; // Minutes from start of timeline
    return (totalMinutes / 60) * slotWidth; // Calculate the left position in pixels
  };
  // Function to calculate the left position of a subject based on its start time for lg screens
  const getLgLeftPosition = (time: string) => {
    const [rawHour, minute] = time.split(":").map(Number);
    const hour = rawHour < 8 ? rawHour + 12 : rawHour; // Adjust PM hours
    const totalMinutes = (hour - 8) * 60 + minute; // Minutes from start of timeline

    // Return the calculated left position for lg screen
    // Adjust for lg screen (you can customize the width as needed)
    return (totalMinutes / 60) * lgSlotWidth;
  };

  // Function to calculate the width of a subject based on its duration (1 hour or 2 hours)
  const getScheduleItemWidth = (duration: number) => {
    if (duration === 2) {
      return timelineWidth; // 2 hours = 555px
    }
    return slotWidth; // 1 hour = 277.5px
  };
  // Function to calculate the width of a subject based on its duration (1 hour or 2 hours) for lg screens
  const getLgScheduleItemWidth = (duration: number) => {
    if (duration === 2) {
      return lgStimelineWidth; // Width for a 2-hour duration on lg screen (customize as needed)
    }
    return lgSlotWidth; // Width for a 1-hour duration on lg screen (customize as needed)
  };
  return (
    <>
      {/* For 2xl screen */}
      <div className="-mt-10 2xl:mt-8 bg-white 2xl:h-[38em] hidden 2xl:block">
        <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
          <CardTitle className="text-lg font-medium">Today Schedule</CardTitle>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            See all
          </button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Timeline header */}
            <div className="flex justify-between relative">
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className="text-sm text-gray-500 font-medium relative"
                >
                  {time}
                  {/* Vertical line */}
                  <div className="absolute left-1/2 -translate-x-1/2 lg:h-[16.5em] top-[28px] 2xl:h-[32.8em] border border-dashed border-[#E8E8E8]" />
                </div>
              ))}
            </div>

            {/* Timeline grid */}
            <div className="relative">
              {/* Horizontal lines */}
              <div className="absolute left-0 right-0 top-2 h-px bg-gray-200" />
              <div className="absolute left-0 right-0 lg:top-[17.5em] 2xl:top-[29.2em] h-px bg-gray-200" />

              {/* Current time indicator */}
              <div
                className="absolute z-10"
                style={{
                  left: `${getLeftPosition(currentTime)}px`, // Adjust current time position
                  top: 0,
                }}
              >
                {/* Time pill */}
                <div className="absolute -top-8 left-1/2 h-7 px-3 -translate-x-1/2 flex items-center justify-center bg-[#002B5B] text-white text-sm font-medium rounded-full">
                  {currentTime}
                </div>
                {/* Blue dot */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#002B5B]" />
                {/* Vertical line */}
                <div className="absolute top-4 left-1/2 lg:h-[16.5em] 2xl:h-[28.2em] w-px -translate-x-1/2 bg-[#002B5B]" />
              </div>

              {/* Schedule items */}
              <div className="relative">
                {schedule.map((item, index) => {
                  const duration =
                    item.endTime && item.startTime
                      ? parseInt(item.endTime.split(":")[0], 10) -
                          parseInt(item.startTime.split(":")[0], 10) || 1 // Calculate the duration
                      : 1;

                  // Check if the subject is "BREAK - TIME"
                  const isBreakTime = item.subject === "BREAK - TIME";
                  const isEnglishTime = item.subject === "English language";
                  return (
                    <div
                      key={index}
                      className={`absolute flex mt-5 bg-[#F8F8F8] rounded-sm shadow-sm py-2 px-3 ${
                        isBreakTime ? "ml-[17px]" : ""
                      }  ${isEnglishTime ? "ml-[10.2px]" : ""} ${
                        duration === 1 ? "ml-[6px]" : ""
                      }`} // Apply margin if break time
                      style={{
                        left: `${
                          getLeftPosition(item.startTime) +
                          (isBreakTime ? 10 : 20)
                        }px`, // Add offset for break time
                        top: `${index * 60}px`, // Ensure each subject gets its own row
                        width: `${getScheduleItemWidth(duration)}px`, // Width based on duration (1 hour or 2 hours)
                      }}
                    >
                      <div className="text-sm font-medium border-l-4 pl-1 border-[#002B5B] text-gray-900">
                        {item.subject}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* For smaller screens like lg */}
      <div className="2xl:hidden block bg-white h-[23.5em]">
        <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
          <CardTitle className="text-lg font-medium">Today Schedule</CardTitle>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            See all
          </button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Timeline header */}
            <div className="flex justify-between relative">
              {timeSlots.map((time, index) => (
                <div
                  key={time}
                  className="text-sm text-gray-500 font-medium relative"
                >
                  {time}
                  {/* Vertical line */}
                  <div className="absolute left-1/2 -translate-x-1/2 lg:h-[15.9em] top-[28px] 2xl:h-[32.8em] border border-dashed border-[#E8E8E8]" />
                </div>
              ))}
            </div>

            <div className="relative">
              {/* Horizontal lines */}
              <div className="absolute left-0 right-0 top-2 h-px bg-gray-200" />
              <div className="absolute left-0 right-0 lg:top-[14.5em] 2xl:top-[29.2em] h-px bg-gray-200" />

              {/* Current time indicator */}
              <div
                className="absolute z-10"
                style={{
                  left: `${getLgLeftPosition(currentTime)}px`, // Adjust current time position
                  top: 0,
                }}
              >
                <div className="absolute -top-8 left-1/2 h-7 px-3 -translate-x-1/2 flex items-center justify-center bg-[#002B5B] text-white text-sm font-medium rounded-full">
                  {currentTime}
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#002B5B]" />
                {/* Vertical line */}
                <div className="absolute top-4 left-1/2 lg:h-[13.5em] 2xl:h-[28.2em] w-px -translate-x-1/2 bg-[#002B5B]" />
              </div>

              {/* Schedule items */}
              <div className="relative ml-5">
                {schedule.map((item, index) => {
                  const duration =
                    item.endTime && item.startTime
                      ? parseInt(item.endTime.split(":")[0], 10) -
                          parseInt(item.startTime.split(":")[0], 10) || 1
                      : 1;

                  // Check if the subject is "BREAK - TIME"
                  const isBreakTime = item.subject === "BREAK - TIME";
                  const isEnglishTime = item.subject === "English language";
                  return (
                    <div
                      key={index}
                      className={`absolute flex mt-5 bg-[#F8F8F8] rounded-sm shadow-sm py-2 px-3 ${
                        isBreakTime ? "ml-[12px]" : ""
                      }  ${isEnglishTime ? "ml-[14.2px]" : ""} ${
                        duration === 1 ? "ml-[10px]" : ""
                      } `}
                      style={{
                        left: `${getLgLeftPosition(item.startTime)}px`,
                        top: `${index * 40}px`,
                        width: `${getLgScheduleItemWidth(duration)}px`,
                      }}
                    >
                      <div className="text-sm font-medium border-l-4 pl-1 border-[#002B5B] text-gray-900">
                        {item.subject}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </>
  );
}
