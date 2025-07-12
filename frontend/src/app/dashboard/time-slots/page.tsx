import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/time-slots/table';
import { lexend } from '@/app/ui/fonts';
import { fetchDefenseCommittees, searchTimeSlots } from '@/app/lib/data';
import { cookies } from 'next/headers';
import { Create } from '@/app/ui/buttons';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';
import { ImportTimeSlotsButton } from '@/app/ui/time-slots/import-time-slots-button';
import SearchForm from '@/app/ui/time-slots/search-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khung giờ',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    date?: string;
    start?: string;
    end?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  // Construct query string from search parameters
  let query = '';
  if (searchParams?.date || searchParams?.start || searchParams?.end) {
    const params = new URLSearchParams();
    if (searchParams?.date) params.append('date', searchParams.date);
    if (searchParams?.start) params.append('start', searchParams.start);
    if (searchParams?.end) params.append('end', searchParams.end);
    query = params.toString();
  } else if (searchParams?.query) {
    query = searchParams.query;
  }

  const authToken = (await cookies()).get('session')?.value;
  const { data, totalPages } = await searchTimeSlots(authToken, query);
  const defenseCommittees = await fetchDefenseCommittees(authToken);

  // Paginate defense-periods based on ITEMS_PER_PAGE
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
        <h1 className={`${lexend.className} text-2xl`}>Quản lý khung giờ</h1>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 max-w-full">
        <SearchForm defenseCommittees={defenseCommittees} />
        <div className="flex gap-2">
          <ImportTimeSlotsButton />
          <Create path="time-slots" singular="khung giờ" />
        </div>
      </div>
      <Table timeSlots={a[currentPage - 1]} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
