import { fetchDefensePeriodById } from '@/app/lib/data';
import { DefensePeriod } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/defense-periods/edit-defense-period-form';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật đợt bảo vệ',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const defensePeriod: DefensePeriod = await fetchDefensePeriodById(
    authToken,
    id
  );

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Đợt bảo vệ', href: '/dashboard/defense-periods' },
          {
            label: 'Cập nhật đợt bảo vệ',
            href: `/dashboard/defense-periods/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form defensePeriod={defensePeriod} />
    </main>
  );
}
