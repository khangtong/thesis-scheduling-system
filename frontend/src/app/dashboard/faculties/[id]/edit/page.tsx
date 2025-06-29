import { fetchFacultyById } from '@/app/lib/data';
import { Faculty } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/faculties/edit-faculty-form';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật khoa',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const faculty: Faculty = await fetchFacultyById(authToken, id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Khoa', href: '/dashboard/faculties' },
          {
            label: 'Cập nhật khoa',
            href: `/dashboard/faculties/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form faculty={faculty} />
    </main>
  );
}
