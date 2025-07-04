import { fetchDefensePeriods } from '@/app/lib/data';
import { DefensePeriod } from '@/app/lib/definitions';
import Calendar from '@/app/ui/dashboard/calendar';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const defensePeriods = await fetchDefensePeriods(
    (await cookies()).get('session')?.value
  );
  const events = defensePeriods.map((defensePeriod: DefensePeriod) => {
    // Add one day to the end date if it exists
    let endDate = defensePeriod?.end;
    if (endDate) {
      const date = new Date(endDate);
      date.setDate(date.getDate() + 1);
      endDate = date;
    }

    return {
      id: defensePeriod?.id,
      title: defensePeriod?.name,
      allDay: true,
      start: defensePeriod?.start,
      end: endDate,
      backgroundColor: defensePeriod?.active ? '#00c951' : '#90a1b9',
      borderColor: defensePeriod?.active ? '#00c951' : '#90a1b9',
    };
  });

  return (
    <div className="min-h-full bg-gray-100 p-4 rounded-md">
      <Calendar events={events} />
    </div>
  );
}
