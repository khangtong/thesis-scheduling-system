import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/users/create-form';
import { fetchRoles } from '@/app/lib/data';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Tạo người dùng',
};

export default async function Page() {
  const roles = await fetchRoles((await cookies()).get('session')?.value);

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
      <Form roles={roles} />
    </main>
  );
}
