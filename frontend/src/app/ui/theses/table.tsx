import { Update, DeleteThesis } from '../buttons';
import { Thesis } from '@/app/lib/definitions';

export default function Table({ theses = [] }: { theses: Thesis[] }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0 overflow-x-auto w-full">
          <div className="xl:hidden">
            {theses?.map((thesis) => (
              <div
                key={thesis?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{thesis?.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Trạng thái: {thesis?.status}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Tạo:{' '}
                      {thesis?.createdAt
                        ? new Date(thesis.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Cập nhật:{' '}
                      {thesis?.updatedAt
                        ? new Date(thesis.updatedAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Sinh viên: {thesis?.student?.user?.fullname || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Giảng viên hướng dẫn:{' '}
                      {thesis?.lecturer?.user?.fullname || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Khung giờ:{' '}
                      {`${thesis?.timeSlot?.date
                        .toString()
                        .split('-')
                        .reverse()
                        .join('/')} (${thesis?.timeSlot?.start} - ${
                        thesis?.timeSlot?.end
                      })` || 'Chưa có'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Update id={thesis?.id ? thesis.id : -1} path="theses" />
                    <DeleteThesis id={thesis?.id ? thesis.id : -1} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-gray-900 xl:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium sm:pl-6">
                  Tên đề tài
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Trạng thái
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Tạo
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Cập nhật
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Sinh viên
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Giảng viên hướng dẫn
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Khung giờ
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {theses?.map((thesis) => (
                <tr
                  key={thesis?.id}
                  className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{thesis?.title}</p>
                    </div>
                  </td>
                  <td className="px-3 py-1">{thesis?.status}</td>
                  <td className="px-3 py-1">
                    {thesis?.createdAt
                      ? new Date(thesis.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {thesis?.updatedAt
                      ? new Date(thesis.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {thesis?.student?.user?.fullname || 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {thesis?.lecturer?.user?.fullname || 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {`${thesis?.timeSlot?.date
                      .toString()
                      .split('-')
                      .reverse()
                      .join('/')} (${thesis?.timeSlot?.start} - ${
                      thesis?.timeSlot?.end
                    })` || 'Chưa có'}
                  </td>
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Update id={thesis?.id ? thesis.id : -1} path="theses" />
                      <DeleteThesis id={thesis?.id ? thesis.id : -1} />
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
