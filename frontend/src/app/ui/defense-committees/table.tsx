import { Update, DeleteDefenseCommittee } from '../buttons';
import { DefenseCommittee } from '@/app/lib/definitions';

export default function Table({
  defenseCommittees = [],
}: {
  defenseCommittees: DefenseCommittee[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0 overflow-x-auto w-full">
          <div className="xl:hidden">
            {defenseCommittees?.map((defenseCommittee) => (
              <div
                key={defenseCommittee?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{defenseCommittee?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Tạo:{' '}
                      {defenseCommittee?.createdAt
                        ? new Date(
                            defenseCommittee.createdAt
                          ).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Cập nhật:{' '}
                      {defenseCommittee?.updatedAt
                        ? new Date(
                            defenseCommittee.updatedAt
                          ).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Phòng: {defenseCommittee?.room?.name || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Khung giờ:{' '}
                      {`${new Date(
                        defenseCommittee?.timeSlot?.date || ''
                      ).toLocaleDateString()} (${
                        defenseCommittee?.timeSlot?.start
                      } - ${defenseCommittee?.timeSlot?.end})`}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Đợt bảo vệ:{' '}
                      {defenseCommittee?.defensePeriod?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Update
                      id={defenseCommittee?.id ? defenseCommittee.id : -1}
                      path="defense-committees"
                    />
                    <DeleteDefenseCommittee
                      id={defenseCommittee?.id ? defenseCommittee.id : -1}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-gray-900 xl:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium sm:pl-6">
                  Trạng thái
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Ghi chú
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Tạo
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Cập nhật
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Phòng
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Khung giờ
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Đợt bảo vệ
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {defenseCommittees?.map((defenseCommittee) => (
                <tr
                  key={defenseCommittee?.id}
                  className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{defenseCommittee?.name}</p>
                    </div>
                  </td>
                  <td className="px-3 py-1">
                    {defenseCommittee?.createdAt
                      ? new Date(
                          defenseCommittee.createdAt
                        ).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {defenseCommittee?.updatedAt
                      ? new Date(
                          defenseCommittee.updatedAt
                        ).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {defenseCommittee?.room?.name || 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {`${new Date(
                      defenseCommittee?.timeSlot?.date || ''
                    ).toLocaleDateString()} (${
                      defenseCommittee?.timeSlot?.start
                    } - ${defenseCommittee?.timeSlot?.end})`}
                  </td>
                  <td className="px-3 py-1">
                    {defenseCommittee?.defensePeriod?.name || 'N/A'}
                  </td>
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Update
                        id={defenseCommittee?.id ? defenseCommittee.id : -1}
                        path="defense-committees"
                      />
                      <DeleteDefenseCommittee
                        id={defenseCommittee?.id ? defenseCommittee.id : -1}
                      />
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
