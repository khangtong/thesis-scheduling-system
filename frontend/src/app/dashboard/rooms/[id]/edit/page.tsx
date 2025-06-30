import { fetchRoomById } from '@/app/lib/data';
import { Room } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/rooms/edit-room-form';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Cập nhật phòng',
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const authToken = (await cookies()).get('session')?.value;
  const room: Room = await fetchRoomById(authToken, id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Phòng', href: '/dashboard/rooms' },
          {
            label: 'Cập nhật phòng',
            href: `/dashboard/rooms/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form room={room} />
    </main>
  );
}
