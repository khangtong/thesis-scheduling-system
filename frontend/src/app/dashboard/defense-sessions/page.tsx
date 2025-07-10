import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/defense-sessions/table';
import { Create } from '@/app/ui/buttons';
import { ImportDefenseSessionsButton } from '@/app/ui/defense-sessions/import-defense-sessions-button';
import {
  fetchDefensePeriods,
  searchDefenseSessions,
  fetchRooms,
  fetchTimeSlots,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';
import SearchForm from '@/app/ui/defense-sessions/search-form';

export const metadata: Metadata = {
  title: 'Buổi bảo vệ',
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

  const authToken = (await cookies()).get('session')?.value;
  const { data, totalPages } = await searchDefenseSessions(authToken, query);
  const rooms = await fetchRooms(authToken);
  const timeSlots = await fetchTimeSlots(authToken);
  const defensePeriods = await fetchDefensePeriods(authToken);

  // Paginate defense-sessions based on ITEMS_PER_PAGE
  const a = [];
  let j = 0;
  for (let i = 0; i < totalPages; i++) {
    const b = [];
    while (j < data.length && b.length < ITEMS_PER_PAGE) {
      b.push(data[j]);
      j++;
    }
    a.push(b);
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lexend.className} text-2xl`}>Quản lý buổi bảo vệ</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        <SearchForm
          rooms={rooms}
          timeSlots={timeSlots}
          defensePeriods={defensePeriods}
        />
        <div className="flex gap-2">
          <ImportDefenseSessionsButton />
          <Create singular="buổi bảo vệ" path="defense-sessions" />
        </div>
      </div>
      <Table defenseSessions={a[currentPage - 1]} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
