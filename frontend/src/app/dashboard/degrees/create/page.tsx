import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/degrees/create-degree-form';

export const metadata: Metadata = {
  title: 'Tạo học vị',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Học vị', href: '/dashboard/degrees' },
          {
            label: 'Tạo học vị',
            href: '/dashboard/degrees/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
