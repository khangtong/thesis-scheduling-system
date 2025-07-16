import { useDefenseCommitteeStore } from '@/stores/defenseCommitteeStore';
import { rooms } from './mock-data';
import ScheduleCard from './schedule-card';
import { TimeSlot, DefensePeriod } from '@/app/lib/definitions';
import { useDefensePeriodIdStore } from '@/stores/defensePeriodStore';
import { useEffect, useState } from 'react';

export default function ScheduleGrid({
  defensePeriodAndTimeSlots,
}: {
  defensePeriodAndTimeSlots: {
    defensePeriod: DefensePeriod;
    timeSlots: TimeSlot[];
  }[];
}) {
  // Helper function to find a session for a specific cell
  const {
    defenseCommittees,
    selectedDefenseCommittee,
    selectDefenseCommittee,
  } = useDefenseCommitteeStore();
  const selectedDefenseCommitteeId = selectedDefenseCommittee?.id;
  const findDefenseCommittee = (timeSlot: string, room: string) => {
    return defenseCommittees.find((s) => s?.room?.name === room);
  };
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [dayList, setDayList] = useState<string[]>([]);
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
      const defensePeriod = defensePeriodAndTimeSlots.find(
        (dp) => dp.defensePeriod?.id + '' === defensePeriodId
      );
      if (defensePeriod) {
        console.log(
          `${defensePeriod.timeSlots[0]?.date}`.split('-').reverse().join('/')
        );
        setDayList(
          getDateRange(
            defensePeriod.defensePeriod?.start + '',
            defensePeriod.defensePeriod?.end + ''
          )
        );
        setTimeSlots(defensePeriod.timeSlots);
        console.log(
          getDateRange(
            defensePeriod.defensePeriod?.start + '',
            defensePeriod.defensePeriod?.end + ''
          )[0]
        );
      }
    }
  }, [defensePeriodId]);

  return (
    <div className="px-3 max-h-[650px] overflow-auto border-x-2 border-neutral-500">
      <div className="grid grid-cols-[auto_repeat(3,minmax(180px,1fr))]">
        {/* Header Row */}
        <div className="sticky top-0 bg-white z-10"></div> {/* Empty corner */}
        {dayList.map((day) => (
          <div
            key={day}
            className="text-center font-bold text-gray-700 py-2 border-b-2 border-gray-300 sticky top-0 bg-white z-10"
          >
            {day}
          </div>
        ))}
        {/* Schedule Rows */}
        {timeSlots.map((timeSlot) => (
          <div
            key={timeSlot?.id}
            className="grid grid-cols-subgrid col-span-4 border-t border-gray-200"
          >
            {/* Time Slot Label */}
            <div className="flex flex-col items-center justify-center text-sm font-semibold text-gray-500 p-2 border-r border-gray-200">
              <span>{timeSlot?.start}</span>
              <span>-</span>
              <span>{timeSlot?.end}</span>
            </div>
            {/* Session Cells */}
            {timeSlots.map((timeSlot) => (
              <div
                key={`${timeSlot?.id}-${timeSlot?.defenseCommittee?.id}`}
                className="h-24 p-1 border-r border-gray-200 bg-gray-50"
              >
                {timeSlot?.defenseCommittee &&
                `${timeSlot.date}`.split('-').reverse().join('/') ===
                  dayList[0] ? (
                  <ScheduleCard
                    defenseCommittee={timeSlot?.defenseCommittee}
                    isSelected={
                      timeSlot?.defenseCommittee.id ===
                      selectedDefenseCommitteeId
                    }
                  />
                ) : (
                  // Đây là ô trống để kéo thả
                  <div className="h-full w-full rounded-md border-2 border-dashed border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
