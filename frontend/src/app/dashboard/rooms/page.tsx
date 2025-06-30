import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/rooms/table';
import { Create } from '@/app/ui/buttons';
import { ImportRoomsButton } from '@/app/ui/rooms/import-rooms-button';
import { fetchRoomsWithQuery } from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Phòng',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const { rooms, totalPages } = await fetchRoomsWithQuery(
    (await cookies()).get('session')?.value,
    query
  );

  // Paginate rooms based on ITEMS_PER_PAGE
  const a = [];
  let j = 0;
  for (let i = 0; i < totalPages; i++) {
    const b = [];
    while (j < rooms.length && b.length < ITEMS_PER_PAGE) {
      b.push(rooms[j]);
      j++;
    }
    a.push(b);
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lexend.className} text-2xl`}>Quản lý phòng</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        <Search placeholder="Tìm kiếm phòng..." />
        <div className="flex gap-2">
          <ImportRoomsButton />
          <Create singular="phòng" path="rooms" />
        </div>
      </div>
      <Table rooms={a[currentPage - 1]} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
