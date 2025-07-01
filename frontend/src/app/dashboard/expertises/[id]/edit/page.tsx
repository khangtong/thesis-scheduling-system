import { fetchExpertiseById } from '@/app/lib/data';
import { Expertise } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/expertises/edit-expertise-form';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật chuyên môn',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const expertise: Expertise = await fetchExpertiseById(authToken, id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Chuyên môn', href: '/dashboard/expertises' },
          {
            label: 'Cập nhật chuyên môn',
            href: `/dashboard/expertises/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form expertise={expertise} />
    </main>
  );
}
