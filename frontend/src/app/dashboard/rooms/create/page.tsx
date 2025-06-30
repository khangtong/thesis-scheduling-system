import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/rooms/create-room-form';

export const metadata: Metadata = {
  title: 'Tạo phòng',
};

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Phòng', href: '/dashboard/rooms' },
          {
            label: 'Tạo phòng',
            href: '/dashboard/rooms/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
