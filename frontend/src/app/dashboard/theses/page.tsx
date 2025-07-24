import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/theses/table';
import { Create } from '@/app/ui/buttons';
import { ImportThesesButton } from '@/app/ui/theses/import-theses-button';
import {
  searchTheses,
  fetchTimeSlots,
  fetchUsers,
  fetchLecturerByUserId,
  fetchStudentByUserId,
  fetchTheses,
  fetchCommitteeMembersByDefenseCommitteeId,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE, Lecturer } from '@/app/lib/definitions';
import SearchForm from '@/app/ui/theses/search-form';
import { getUser } from '@/app/lib/actions';
import Form from '@/app/ui/theses/view-thesis-form';

export const metadata: Metadata = {
  title: 'Luận văn',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    title?: string;
    status?: string;
    lecturerId?: string;
    timeSlotId?: string;
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
    searchParams?.timeSlotId
  ) {
    const params = new URLSearchParams();
    if (searchParams?.title) params.append('title', searchParams.title);
    if (searchParams?.status) params.append('status', searchParams.status);
    if (searchParams?.lecturerId)
      params.append('lecturerId', searchParams.lecturerId);
    if (searchParams?.timeSlotId)
      params.append('timeSlotId', searchParams.timeSlotId);
    query = params.toString();
  } else if (searchParams?.query) {
    query = searchParams.query;
  }

  const user = await getUser();
  const authToken = (await cookies()).get('session')?.value;
  const { data, totalPages } = await searchTheses(authToken, query);
  let lecturers: Lecturer[] = [];
  let timeSlots = [];
  let committeeMembers = [];
  if (user?.role?.name === 'SINH_VIEN') {
    committeeMembers = await fetchCommitteeMembersByDefenseCommitteeId(
      authToken,
      data[0].timeSlot.defenseCommittee.id
    );
  } else {
    timeSlots = await fetchTimeSlots(authToken);
    if (user?.role?.name === 'ADMIN') {
      const users = await fetchUsers(authToken);
      for (let i = 0; i < users.length; i++) {
        if (users[i]?.active && users[i]?.role?.name === 'GIANG_VIEN') {
          const lecturer = await fetchLecturerByUserId(
            authToken,
            users[i]?.id + ''
          );
          lecturers.push(lecturer);
        }
      }
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

  return user?.role?.name !== 'SINH_VIEN' ? (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lexend.className} text-2xl`}>
          {user?.role?.name === 'ADMIN' ? 'Quản lý' : 'Thông tin'} luận văn
        </h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        <SearchForm
          lecturers={lecturers}
          timeSlots={timeSlots}
          role={user?.role}
        />
        <div
          className={`${user?.role?.name === 'ADMIN' || 'hidden'} flex gap-2`}
        >
          <ImportThesesButton />
          <Create singular="luận văn" path="theses" />
        </div>
      </div>
      <Table theses={a[currentPage - 1]} role={user?.role} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  ) : (
    <Form thesis={data[0]} committeeMembers={committeeMembers} />
  );
}
