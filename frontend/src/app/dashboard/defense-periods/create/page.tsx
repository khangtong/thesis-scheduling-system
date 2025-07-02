import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/defense-periods/create-defense-period-form';

export const metadata: Metadata = {
  title: 'Tạo đợt bảo vệ',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Đợt bảo vệ', href: '/dashboard/defense-periods' },
          {
            label: 'Tạo đợt bảo vệ',
            href: '/dashboard/defense-periods/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
