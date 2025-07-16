import { Metadata } from 'next';
import {
  fetchDefensePeriods,
  fetchFaculties,
  fetchTheses,
  fetchTimeSlotsByDateRange,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { scheduledSessions } from '@/app/ui/thesis-schedules/mock-data';
import ScheduleClient from '@/app/ui/thesis-schedules/schedule-client';
import { DefensePeriod, TimeSlot } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Xếp lịch luận văn',
};

export default async function Page() {
  const authToken = (await cookies()).get('session')?.value;
  const defensePeriods = await fetchDefensePeriods(authToken);
  const theses = await fetchTheses(authToken);
  const faculties = await fetchFaculties(authToken);
  const sessions = scheduledSessions;
  let defensePeriodAndTimeSlots: {
    defensePeriod: DefensePeriod;
    timeSlots: TimeSlot[];
  }[] = [];

  // Get time slots of each active defense period
  for (let i = 0; i < defensePeriods.length; i++) {
    const defensePeriod = defensePeriods[i];
    if (defensePeriod?.active) {
      const timeSlotsByDateRange = await fetchTimeSlotsByDateRange(
        authToken,
        defensePeriod?.start.split('T')[0],
        defensePeriod?.end.split('T')[0]
      );
      defensePeriodAndTimeSlots.push({
        defensePeriod,
        timeSlots: timeSlotsByDateRange,
      });
    }
  }

  // Remove duplicate time slots
  defensePeriodAndTimeSlots = defensePeriodAndTimeSlots.filter((dp) => {
    dp.timeSlots = dp.timeSlots
      .filter((tl, i, arr) => {
        for (let j = 0; j < i; j++) {
          if (tl?.start === arr[j]?.start && tl?.end === arr[j]?.end) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => (a?.id || 0) - (b?.id || 0));
    return dp.timeSlots.length > 0;
  });

  return (
    <div>
      <ScheduleClient
        authToken={authToken}
        initialSessions={sessions}
        defensePeriods={defensePeriods}
        theses={theses}
        faculties={faculties}
        defensePeriodAndTimeSlots={defensePeriodAndTimeSlots}
      />
    </div>
  );
}
