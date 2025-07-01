import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/expertises/create-expertise-form';

export const metadata: Metadata = {
  title: 'Tạo chuyên môn',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Chuyên môn', href: '/dashboard/expertises' },
          {
            label: 'Tạo chuyên môn',
            href: '/dashboard/expertises/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
