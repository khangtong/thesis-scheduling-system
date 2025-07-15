import { Metadata } from 'next';
import Toolbar from '@/app/ui/thesis-schedules/toolbar';
import {
  fetchDefensePeriods,
  fetchFaculties,
  fetchTheses,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import ThesisList from '@/app/ui/thesis-schedules/thesis-list';
import Search from '@/app/ui/search';
import { scheduledSessions } from '@/app/ui/thesis-schedules/mock-data';
import ScheduleClient from '@/app/ui/thesis-schedules/schedule-client';

export const metadata: Metadata = {
  title: 'Xếp lịch luận văn',
};

export default async function Page() {
  const authToken = (await cookies()).get('session')?.value;
  const defensePeriods = await fetchDefensePeriods(authToken);
  const theses = await fetchTheses(authToken);
  const faculties = await fetchFaculties(authToken);
  const sessions = scheduledSessions;
  return (
    <div>
      <ScheduleClient
        initialSessions={sessions}
        defensePeriods={defensePeriods}
        theses={theses}
        faculties={faculties}
      />
    </div>
  );
}
