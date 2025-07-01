import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/expertises/table';
import { Create } from '@/app/ui/buttons';
import { ImportExpertisesButton } from '@/app/ui/expertises/import-expertises-button';
import { fetchExpertisesWithQuery } from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Chuyên môn',
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

  const { expertises, totalPages } = await fetchExpertisesWithQuery(
    (await cookies()).get('session')?.value,
    query
  );

  // Paginate expertises based on ITEMS_PER_PAGE
  const a = [];
  let j = 0;
  for (let i = 0; i < totalPages; i++) {
    const b = [];
    while (j < expertises.length && b.length < ITEMS_PER_PAGE) {
      b.push(expertises[j]);
      j++;
    }
    a.push(b);
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lexend.className} text-2xl`}>Quản lý chuyên môn</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        <Search placeholder="Tìm kiếm chuyên môn..." />
        <div className="flex gap-2">
          <ImportExpertisesButton />
          <Create singular="chuyên môn" path="expertises" />
        </div>
      </div>
      <Table expertises={a[currentPage - 1]} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
