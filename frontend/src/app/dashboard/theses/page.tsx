import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/theses/table';
import { Create } from '@/app/ui/buttons';
import { ImportThesesButton } from '@/app/ui/theses/import-theses-button';
import {
  searchTheses,
  fetchDefenseCommittees,
  fetchUsers,
  fetchLecturerByUserId,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE, Lecturer } from '@/app/lib/definitions';
import SearchForm from '@/app/ui/theses/search-form';

export const metadata: Metadata = {
  title: 'Luận văn',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    title?: string;
    status?: string;
    lecturerId?: string;
    defenseCommitteeId?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  // Construct query string from search parameters
  let query = '';
  if (
    searchParams?.title ||
    searchParams?.status ||
    searchParams?.lecturerId ||
    searchParams?.defenseCommitteeId
  ) {
    const params = new URLSearchParams();
    if (searchParams?.title) params.append('title', searchParams.title);
    if (searchParams?.status) params.append('status', searchParams.status);
    if (searchParams?.lecturerId)
      params.append('lecturerId', searchParams.lecturerId);
    if (searchParams?.defenseCommitteeId)
      params.append('defenseCommitteeId', searchParams.defenseCommitteeId);
    query = params.toString();
  } else if (searchParams?.query) {
    query = searchParams.query;
  }

  const authToken = (await cookies()).get('session')?.value;
  const { data, totalPages } = await searchTheses(authToken, query);
  const defenseCommittees = await fetchDefenseCommittees(authToken);
  const users = await fetchUsers(authToken);
  let lecturers: Lecturer[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i]?.active && users[i]?.role?.name === 'GIANG_VIEN') {
      const lecturer = await fetchLecturerByUserId(
        authToken,
        users[i]?.id + ''
      );
      lecturers.push(lecturer);
    }
  }

  // Paginate theses based on ITEMS_PER_PAGE
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
        <h1 className={`${lexend.className} text-2xl`}>Quản lý luận văn</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        <SearchForm
          lecturers={lecturers}
          defenseCommittees={defenseCommittees}
        />
        <div className="flex gap-2">
          <ImportThesesButton />
          <Create singular="luận văn" path="theses" />
        </div>
      </div>
      <Table theses={a[currentPage - 1]} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
