import { fetchCommitteeRoleById } from '@/app/lib/data';
import { CommitteeRole } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/committee-roles/edit-committee-role-form';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật vai trò hội đồng',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const committeeRole: CommitteeRole = await fetchCommitteeRoleById(
    authToken,
    id
  );

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vai trò hội đồng', href: '/dashboard/committee-roles' },
          {
            label: 'Cập nhật vai trò hội đồng',
            href: `/dashboard/committee-roles/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form committeeRole={committeeRole} />
    </main>
  );
}
