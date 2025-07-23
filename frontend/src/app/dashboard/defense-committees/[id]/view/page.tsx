import Form from '@/app/ui/defense-committees/view-defense-committee-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchDefenseCommitteeById,
  fetchTimeSlots,
  fetchCommitteeMembersByDefenseCommitteeId,
} from '@/app/lib/data';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Xem hội đồng',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const defenseCommittee = await fetchDefenseCommitteeById(authToken, id);
  const timeSlots = await fetchTimeSlots(authToken);
  const committeeMembers = await fetchCommitteeMembersByDefenseCommitteeId(
    authToken,
    id
  );

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
            label: 'Xem hội đồng',
            href: `/dashboard/defense-committees/${id}/view`,
            active: true,
          },
        ]}
      />
      <Form
        defenseCommittee={defenseCommittee}
        timeSlots={timeSlots}
        committeeMembers={committeeMembers}
      />
    </main>
  );
}
