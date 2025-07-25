import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/users/table';
import { Create } from '@/app/ui/buttons';
import { ImportUsersButton } from '@/app/ui/users/import-users-button';
import {
  fetchLecturerByUserId,
  fetchRoles,
  fetchStudentByUserId,
  searchUsers,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE, Lecturer, Student } from '@/app/lib/definitions';
import SearchForm from '@/app/ui/users/search-form';

export const metadata: Metadata = {
  title: 'Người dùng',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    roleId?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  // Construct query string from search parameters
  let query = '';
  if (searchParams?.query || searchParams?.roleId) {
    const params = new URLSearchParams();
    if (searchParams?.query) params.append('query', searchParams.query);
    if (searchParams?.roleId) params.append('roleId', searchParams.roleId);
    query = params.toString();
  } else if (searchParams?.query) {
    query = searchParams.query;
  }

  const authToken = (await cookies()).get('session')?.value;
  const { data, totalPages } = await searchUsers(authToken, query);
  const roles = await fetchRoles(authToken);
  let lecturers: Lecturer[] = [];
  let students: Student[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i]?.active && data[i]?.role?.name === 'GIANG_VIEN') {
      const lecturer = await fetchLecturerByUserId(authToken, data[i]?.id + '');
      lecturers.push(lecturer);
    }
    if (data[i]?.active && data[i]?.role?.name === 'SINH_VIEN') {
      const student = await fetchStudentByUserId(authToken, data[i]?.id + '');
      students.push(student);
    }
  }

  // Paginate users based on ITEMS_PER_PAGE
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
        <h1 className={`${lexend.className} text-2xl`}>Quản lý người dùng</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 max-w-full">
        <SearchForm roles={roles} />
        <div className="flex gap-2">
          <ImportUsersButton />
          <Create singular="người dùng" path="users" />
        </div>
      </div>
      <Table
        users={a[currentPage - 1]}
        lecturers={lecturers}
        students={students}
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
