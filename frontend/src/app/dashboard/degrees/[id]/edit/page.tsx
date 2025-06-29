import { fetchDegreeById } from '@/app/lib/data';
import { Degree } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/degrees/edit-degree-form';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật học vị',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const degree: Degree = await fetchDegreeById(authToken, id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Học vị', href: '/dashboard/degrees' },
          {
            label: 'Cập nhật học vị',
            href: `/dashboard/degrees/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form degree={degree} />
    </main>
  );
}
