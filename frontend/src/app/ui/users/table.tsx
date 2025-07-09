import { Update, DeleteUser } from '../buttons';
import { User } from '@/app/lib/definitions';
import Status from '../status';

export default function Table({ users = [] }: { users: User[] }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0 overflow-x-auto w-full">
          <div className="xl:hidden">
            {users?.map((user) => (
              <div
                key={user?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{user?.username}</p>
                    </div>
                    <p className="max-w-[160px] text-xs text-nowrap overflow-hidden text-ellipsis sm:text-sm text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                  <Status status={user?.active ? true : false} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {user?.fullname || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {user?.role?.name || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Tạo:{' '}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Cập nhật:{' '}
                      {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Update id={user?.id ? user.id : -1} path="users" />
                    <DeleteUser id={user?.id ? user.id : -1} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-gray-900 xl:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium sm:pl-6">
                  Họ tên
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Email
                </th>
                {/* <th scope="col" className="px-3 py-3 font-medium">
                  Tên tài khoản
                </th> */}
                <th scope="col" className="px-3 py-3 font-medium">
                  Tạo
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Cập nhật
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Trạng thái
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Vai trò
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users?.map((user) => (
                <tr
                  key={user?.id}
                  className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{user?.fullname}</p>
                    </div>
                  </td>
                  <td className="text-nowrap overflow-hidden text-ellipsis max-w-[200px] px-3 py-1">
                    {user?.email}
                  </td>
                  {/* <td className="px-3 py-1">
                    {user?.username}
                  </td> */}
                  <td className="px-3 py-1">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    <Status status={user?.active ? true : false} />
                  </td>
                  <td className="px-3 py-1">{user?.role?.name}</td>
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Update id={user?.id ? user.id : -1} path="users" />
                      <DeleteUser id={user?.id ? user.id : -1} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
