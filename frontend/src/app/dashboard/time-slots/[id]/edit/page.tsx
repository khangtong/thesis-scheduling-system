import Form from '@/app/ui/time-slots/edit-time-slot-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { fetchTimeSlotById } from '@/app/lib/data';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật khung giờ',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const timeSlot = await fetchTimeSlotById(
    (await cookies()).get('session')?.value,
    id
  );

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
            label: 'Cập nhật khung giờ',
            href: `/dashboard/time-slots/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form timeSlot={timeSlot} />
    </main>
  );
}
