import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/faculties/create-faculty-form';

export const metadata: Metadata = {
  title: 'Tạo khoa',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Khoa', href: '/dashboard/faculties' },
          {
            label: 'Tạo khoa',
            href: '/dashboard/faculties/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
