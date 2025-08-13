import Form from '@/app/ui/theses/view-thesis-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import {
  fetchCommitteeMembersByDefenseCommitteeId,
  fetchThesisById,
} from '@/app/lib/data';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Xem luận văn',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const thesis = await fetchThesisById(authToken, id);
  let committeeMembers: any = [];
  if (thesis?.timeSlot) {
    committeeMembers = await fetchCommitteeMembersByDefenseCommitteeId(
      authToken,
      thesis.timeSlot.defenseCommittee.id
    );
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Luận văn',
            href: '/dashboard/theses',
            active: false,
          },
          {
            label: 'Xem luận văn',
            href: `/dashboard/theses/${id}/view`,
            active: true,
          },
        ]}
      />
      <Form thesis={thesis} committeeMembers={committeeMembers} />
    </main>
  );
}
