import Form from '@/app/ui/defense-committees/edit-defense-committee-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchDefensePeriods,
  fetchDefenseSessionById,
  fetchRooms,
  fetchTimeSlots,
} from '@/app/lib/data';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật buổi bảo vệ',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const defenseSession = await fetchDefenseSessionById(authToken, id);
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
            label: 'Cập nhật buổi bảo vệ',
            href: `/dashboard/defense-committees/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        defenseSession={defenseSession}
        rooms={rooms}
        timeSlots={timeSlots}
        defensePeriods={defensePeriods}
      />
    </main>
  );
}
