import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/users/create-user-form';
import { fetchDegrees, fetchFaculties, fetchRoles } from '@/app/lib/data';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Tạo người dùng',
};

export default async function Page() {
  const authToken = (await cookies()).get('session')?.value;
  const roles = await fetchRoles(authToken);
  const faculties = await fetchFaculties(authToken);
  const degrees = await fetchDegrees(authToken);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Người dùng', href: '/dashboard/users' },
          {
            label: 'Tạo người dùng',
            href: '/dashboard/users/create',
            active: true,
          },
        ]}
      />
      <Form roles={roles} faculties={faculties} degrees={degrees} />
    </main>
  );
}
