import Form from '@/app/ui/time-slots/create-time-slot-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { Metadata } from 'next';
import { fetchDefensePeriods } from '@/app/lib/data';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Tạo khung giờ',
};

export default async function Page() {
  const defensePeriods = await fetchDefensePeriods(
    (await cookies()).get('session')?.value
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
            label: 'Tạo khung giờ',
            href: '/dashboard/time-slots/create',
            active: true,
          },
        ]}
      />
      <Form defensePeriods={defensePeriods} />
    </main>
  );
}
