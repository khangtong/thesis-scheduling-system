import { Metadata } from 'next';
import {
  fetchDefensePeriods,
  fetchFaculties,
  fetchTheses,
  fetchTimeSlotsByDateRange,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import ScheduleClient from '@/app/ui/thesis-schedules/schedule-client';
import { DefensePeriod, TimeSlot } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Xếp lịch luận văn',
};

export default async function Page() {
  const authToken = (await cookies()).get('session')?.value;
  const defensePeriods = await fetchDefensePeriods(authToken);
  const theses = await fetchTheses(authToken);
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

  return (
    <div>
      <ScheduleClient
        authToken={authToken}
        defensePeriods={defensePeriods}
        theses={theses}
        defensePeriodAndTimeSlots={defensePeriodAndTimeSlots}
      />
    </div>
  );
}
