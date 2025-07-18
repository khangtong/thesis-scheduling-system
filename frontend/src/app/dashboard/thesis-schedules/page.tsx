import { Metadata } from 'next';
import {
  fetchCommitteeMembersByDefenseCommitteeId,
  fetchDefensePeriods,
  fetchFaculties,
  fetchTheses,
  fetchTimeSlotsByDateRange,
  searchTheses,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import ScheduleClient from '@/app/ui/thesis-schedules/schedule-client';
import {
  CommitteeMember,
  DefensePeriod,
  TimeSlot,
} from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Xếp lịch luận văn',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  const authToken = (await cookies()).get('session')?.value;
  const defensePeriods = await fetchDefensePeriods(authToken);
  const { data } = await searchTheses(authToken, query);
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

      for (let j = 0; j < timeSlotsByDateRange.length; j++) {
        if (timeSlotsByDateRange[j].defenseCommittee) {
          timeSlotsByDateRange[j].committeeMembers =
            await fetchCommitteeMembersByDefenseCommitteeId(
              authToken,
              timeSlotsByDateRange[j].defenseCommittee.id
            );
        }
      }

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
        theses={data}
        defensePeriodAndTimeSlots={defensePeriodAndTimeSlots}
      />
    </div>
  );
}
