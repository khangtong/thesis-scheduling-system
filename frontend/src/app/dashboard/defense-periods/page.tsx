import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/defense-periods/table';
import { Create } from '@/app/ui/buttons';
import { ImportDefensePeriodsButton } from '@/app/ui/defense-periods/import-defense-periods-button';
import { searchDefensePeriods } from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';
import Link from 'next/link';
import SearchForm from '@/app/ui/defense-periods/search-form';

export const metadata: Metadata = {
  title: 'Đợt bảo vệ',
};

export default async function Page(props: {
  searchParams?: Promise<{
    name?: string;
    start?: string;
    end?: string;
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  // Construct query string from search parameters
  let query = '';
  if (searchParams?.name || searchParams?.start || searchParams?.end) {
    const params = new URLSearchParams();
    if (searchParams?.name) params.append('name', searchParams.name);
    if (searchParams?.start) params.append('start', searchParams.start);
    if (searchParams?.end) params.append('end', searchParams.end);
    query = params.toString();
  } else if (searchParams?.query) {
    query = searchParams.query;
  }

  const { data, totalPages } = await searchDefensePeriods(
    (await cookies()).get('session')?.value,
    query
  );

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
        <h1 className={`${lexend.className} text-2xl`}>Quản lý đợt bảo vệ</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        <SearchForm />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/defense-periods/request-availability"
            className="max-w-[100px] lg:max-w-full flex items-center rounded-lg bg-blue-600 px-2 sm:px-4 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Yêu cầu đăng ký lịch bận
          </Link>
          <ImportDefensePeriodsButton />
          <Create singular="đợt bảo vệ" path="defense-periods" />
        </div>
      </div>
      <Table defensePeriods={a[currentPage - 1]} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
