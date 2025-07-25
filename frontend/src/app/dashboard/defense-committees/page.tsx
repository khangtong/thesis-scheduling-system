import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/defense-committees/table';
import { Create } from '@/app/ui/buttons';
import {
  fetchDefensePeriods,
  searchDefenseCommittees,
  fetchRooms,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';
import SearchForm from '@/app/ui/defense-committees/search-form';
import { getUser } from '@/app/lib/actions';

export const metadata: Metadata = {
  title: 'Hội đồng',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    name?: string;
    defensePeriodId?: string;
    timeSlotId?: string;
    roomId?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  // Construct query string from search parameters
  let query = '';
  if (
    searchParams?.name ||
    searchParams?.defensePeriodId ||
    searchParams?.timeSlotId ||
    searchParams?.roomId
  ) {
    const params = new URLSearchParams();
    if (searchParams?.name) params.append('name', searchParams.name);
    if (searchParams?.defensePeriodId)
      params.append('defensePeriodId', searchParams.defensePeriodId);
    if (searchParams?.timeSlotId)
      params.append('timeSlotId', searchParams.timeSlotId);
    if (searchParams?.roomId) params.append('roomId', searchParams.roomId);
    query = params.toString();
  } else if (searchParams?.query) {
    query = searchParams.query;
  }

  const authToken = (await cookies()).get('session')?.value;
  const { data, totalPages } = await searchDefenseCommittees(authToken, query);
  const rooms = await fetchRooms(authToken);
  const defensePeriods = await fetchDefensePeriods(authToken);
  const user = await getUser();

  // Paginate defense-committees based on ITEMS_PER_PAGE
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
        <h1 className={`${lexend.className} text-2xl`}>
          {user?.role?.name === 'ADMIN' ? 'Quản lý' : 'Thông tin'} hội đồng
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        <SearchForm rooms={rooms} defensePeriods={defensePeriods} />
        <div
          className={`${user?.role?.name === 'ADMIN' || 'hidden'} flex gap-2`}
        >
          <Create singular="hội đồng" path="defense-committees" />
        </div>
      </div>
      <Table defenseCommittees={a[currentPage - 1]} role={user?.role} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
