import { useTimeSlotStore } from '@/stores/timeSlotStore';
import ScheduleCard from './schedule-card';
import {
  TimeSlot,
  DefensePeriod,
  CommitteeMember,
} from '@/app/lib/definitions';
import { useDefensePeriodIdStore } from '@/stores/defensePeriodStore';
import { useEffect, useState } from 'react';
import EmptyCell from './empty-cell';
import { useCommitteeMemberStore } from '@/stores/committeeMemberStore';

export default function ScheduleGrid({
  defensePeriodAndTimeSlots,
}: {
  defensePeriodAndTimeSlots: {
    defensePeriod: DefensePeriod;
    timeSlots: TimeSlot[];
  }[];
}) {
  const selectedTimeSlot = useTimeSlotStore((state) => state.selectedTimeSlot);
  const selectedTimeSlotId = selectedTimeSlot?.id;
  const [timeSlots, setTimeSlotsState] = useState<TimeSlot[]>([]);
  const setTimeSlots = useTimeSlotStore((state) => state.setTimeSlots);
  const [dayList, setDayList] = useState<
    { day: string; timeSlotsOnDay: TimeSlot[] }[]
  >([]);
  // Get the defense period id from the select of toolbar using zustand
  const defensePeriodId = useDefensePeriodIdStore(
    (state) => state.defensePeriodId
  );

  function getDateRange(start: string, end: string): string[] {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates: string[] = [];

    // Create a new date object to avoid modifying the original
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Format date as dd/MM/yyyy
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();

      dates.push(`${day}/${month}/${year}`);

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  useEffect(() => {
    if (defensePeriodId) {
      // Get defense period using the defense period's id from zustand
      const defensePeriod = defensePeriodAndTimeSlots.find(
        (dp) => dp.defensePeriod?.id + '' === defensePeriodId
      );

      if (defensePeriod) {
        // Create a list contains an object that has time slots for each day during a defense period
        setDayList(
          getDateRange(
            defensePeriod.defensePeriod?.start + '',
            defensePeriod.defensePeriod?.end + ''
          ).map((day) => {
            return {
              day,
              timeSlotsOnDay: defensePeriod.timeSlots.filter(
                (tl) => `${tl?.date}`.split('-').reverse().join('/') === day
              ),
            };
          })
        );

        // Set time slots' store
        setTimeSlots(defensePeriod.timeSlots);

        // Remove duplicate time slots
        setTimeSlotsState(
          defensePeriod.timeSlots
            .filter(
              (tl) =>
                `${tl?.date}` ===
                `${defensePeriod.defensePeriod?.start}`.split('T')[0]
            )
            .sort((a, b) => (a?.id || 0) - (b?.id || 0))
        );
      }
    }
  }, [defensePeriodId]);

  return (
    <div className="max-h-[650px] overflow-auto border-x-2 border-gray-300">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `auto repeat(${dayList.length}, minmax(180px, 1fr))`,
        }}
      >
        {/* Header Row */}
        <div className="sticky top-0 bg-white z-10"></div> {/* Empty corner */}
        {dayList.map(({ day }) => (
          <div
            key={day}
            className="text-center font-bold text-gray-700 py-2 border-b-2 border-gray-300 sticky top-0 bg-white z-10"
          >
            {day}
          </div>
        ))}
        {/* Schedule Rows */}
        {timeSlots.map((timeSlot, i) => {
          return (
            <div key={timeSlot?.id} className="contents">
              {/* Time Slot Label */}
              <div className="flex flex-col items-center justify-center text-sm font-semibold text-gray-500 p-2 border-r border-gray-200">
                <span>{timeSlot?.start.slice(0, -3)}</span>
                <span>-</span>
                <span>{timeSlot?.end.slice(0, -3)}</span>
              </div>
              {/* Session Cells */}
              {dayList.map(({ day, timeSlotsOnDay }, i) => {
                const matchTimeSlot: TimeSlot =
                  timeSlotsOnDay.find(
                    (tl) =>
                      `${tl?.date}`.split('-').reverse().join('/') === day &&
                      tl?.start === timeSlot?.start &&
                      tl?.end === timeSlot?.end
                  ) || null;
                return (
                  <div
                    key={`day-${i}`}
                    className="min-w-[180px] h-24 p-1 border-r border-gray-200 bg-gray-50"
                  >
                    {matchTimeSlot?.defenseCommittee ? (
                      <ScheduleCard
                        isSelected={matchTimeSlot?.id === selectedTimeSlotId}
                        timeSlot={matchTimeSlot}
                      />
                    ) : (
                      // Empty cell with drop functionality
                      <EmptyCell timeSlot={timeSlot} day={day} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
