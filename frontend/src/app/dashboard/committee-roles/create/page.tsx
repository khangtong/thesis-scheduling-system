import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/committee-roles/create-committee-role-form';

export const metadata: Metadata = {
  title: 'Tạo vai trò hội đồng',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vai trò hội đồng', href: '/dashboard/committee-roles' },
          {
            label: 'Tạo vai trò hội đồng',
            href: '/dashboard/committee-roles/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
