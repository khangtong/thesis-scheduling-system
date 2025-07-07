import { Metadata } from 'next';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/defense-periods/request-availability-form';
import { fetchDefensePeriods, fetchFaculties } from '@/app/lib/data';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Yêu cầu đăng ký lịch bận',
};

export default async function Page() {
  const defensePeriods = await fetchDefensePeriods(
    (await cookies()).get('session')?.value
  );
  const faculties = await fetchFaculties(
    (await cookies()).get('session')?.value
  );

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Đợt bảo vệ', href: '/dashboard/defense-periods' },
          {
            label: 'Yêu cầu đăng ký lịch bận',
            href: '/dashboard/defense-periods/request-availability',
            active: true,
          },
        ]}
      />
      <Form defensePeriods={defensePeriods} faculties={faculties} />
    </main>
  );
}
