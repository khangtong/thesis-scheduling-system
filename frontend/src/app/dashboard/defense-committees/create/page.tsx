import Form from '@/app/ui/defense-committees/create-defense-committee-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';
import {
  fetchCommitteeRoles,
  fetchDefensePeriods,
  fetchLecturerByUserId,
  fetchRooms,
  fetchTimeSlots,
  fetchUsers,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { Lecturer, User } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Tạo hội đồng',
};

export default async function Page() {
  const authToken = (await cookies()).get('session')?.value;
  const rooms = await fetchRooms(authToken);
  const timeSlots = await fetchTimeSlots(authToken);
  const defensePeriods = await fetchDefensePeriods(authToken);
  const committeeRoles = await fetchCommitteeRoles(authToken);
  const users = await fetchUsers(authToken);
  let lecturers: Lecturer[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i]?.active && users[i]?.role?.name === 'GIANG_VIEN') {
      const lecturer = await fetchLecturerByUserId(
        authToken,
        users[i]?.id + ''
      );
      lecturers.push(lecturer);
    }
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Hội đồng',
            href: '/dashboard/defense-committees',
            active: false,
          },
          {
            label: 'Tạo hội đồng',
            href: '/dashboard/defense-committees/create',
            active: true,
          },
        ]}
      />
      <Form
        rooms={rooms}
        timeSlots={timeSlots}
        defensePeriods={defensePeriods}
        committeeRoles={committeeRoles}
        lecturers={lecturers}
      />
    </main>
  );
}
