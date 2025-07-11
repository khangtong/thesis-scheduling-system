import Form from '@/app/ui/defense-committees/create-defense-committee-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';
import {
  fetchDefensePeriods,
  fetchRooms,
  fetchTimeSlots,
} from '@/app/lib/data';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Tạo buổi bảo vệ',
};

export default async function Page() {
  const authToken = (await cookies()).get('session')?.value;
  const rooms = await fetchRooms(authToken);
  const timeSlots = await fetchTimeSlots(authToken);
  const defensePeriods = await fetchDefensePeriods(authToken);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Buổi bảo vệ',
            href: '/dashboard/defense-committees',
            active: false,
          },
          {
            label: 'Tạo buổi bảo vệ',
            href: '/dashboard/defense-committees/create',
            active: true,
          },
        ]}
      />
      <Form
        rooms={rooms}
        timeSlots={timeSlots}
        defensePeriods={defensePeriods}
      />
    </main>
  );
}
