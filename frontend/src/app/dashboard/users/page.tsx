import { Metadata } from 'next';
import { lexend } from '@/app/ui/fonts';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/users/table';
import { Create } from '@/app/ui/buttons';
import { ImportUsersButton } from '@/app/ui/users/import-users-button';
import { fetchUsers } from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Người dùng',
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

  const { users, totalPages } = await fetchUsers(
    (await cookies()).get('session')?.value,
    query
  );

  // Paginate users based on ITEMS_PER_PAGE
  const a = [];
  let j = 0;
  for (let i = 0; i < totalPages; i++) {
    const b = [];
    while (j < users.length && b.length < ITEMS_PER_PAGE) {
      b.push(users[j]);
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
        <Search placeholder="Tìm kiếm người dùng..." />
        <div className="flex gap-2">
          <ImportUsersButton />
          <Create singular="người dùng" path="users" />
        </div>
      </div>
      <Table users={a[currentPage - 1]} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
