import Form from '@/app/ui/time-slots/create-time-slot-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tạo khung giờ',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: 'Khung giờ',
            href: '/dashboard/time-slots',
            active: false,
          },
          {
            label: 'Tạo khung giờ',
            href: '/dashboard/time-slots/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
