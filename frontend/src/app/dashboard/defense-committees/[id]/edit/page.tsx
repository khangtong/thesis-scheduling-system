import Form from '@/app/ui/defense-committees/edit-defense-committee-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchDefensePeriods,
  fetchDefenseCommitteeById,
  fetchRooms,
  fetchTimeSlots,
  fetchCommitteeMembersByDefenseCommitteeId,
  fetchLecturerByUserId,
  fetchUsers,
} from '@/app/lib/data';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Lecturer } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Cập nhật hội đồng',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const defenseCommittee = await fetchDefenseCommitteeById(authToken, id);
  const rooms = await fetchRooms(authToken);
  const timeSlots = await fetchTimeSlots(authToken);
  const defensePeriods = await fetchDefensePeriods(authToken);
  const committeeMembers = await fetchCommitteeMembersByDefenseCommitteeId(
    authToken,
    id
  );
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
            label: 'Cập nhật hội đồng',
            href: `/dashboard/defense-committees/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        defenseCommittee={defenseCommittee}
        rooms={rooms}
        timeSlots={timeSlots}
        defensePeriods={defensePeriods}
        committeeMembers={committeeMembers}
        lecturers={lecturers}
      />
    </main>
  );
}
