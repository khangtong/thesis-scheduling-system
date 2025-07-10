import { Update, DeleteDefenseSession } from '../buttons';
import { DefenseSession } from '@/app/lib/definitions';

export default function Table({
  defenseSessions = [],
}: {
  defenseSessions: DefenseSession[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0 overflow-x-auto w-full">
          <div className="xl:hidden">
            {defenseSessions?.map((defenseSession) => (
              <div
                key={defenseSession?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{defenseSession?.status}</p>
                    </div>
                    <p className="max-w-[160px] text-xs text-nowrap overflow-hidden text-ellipsis sm:text-sm text-gray-500">
                      {defenseSession?.note || 'Không có'}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Tạo:{' '}
                      {defenseSession?.createdAt
                        ? new Date(
                            defenseSession.createdAt
                          ).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Cập nhật:{' '}
                      {defenseSession?.updatedAt
                        ? new Date(
                            defenseSession.updatedAt
                          ).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Phòng: {defenseSession?.room?.name || 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Khung giờ:{' '}
                      {`${new Date(
                        defenseSession?.timeSlot?.date || ''
                      ).toLocaleDateString()} (${
                        defenseSession?.timeSlot?.start
                      } - ${defenseSession?.timeSlot?.end})`}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Đợt bảo vệ: {defenseSession?.defensePeriod?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Update
                      id={defenseSession?.id ? defenseSession.id : -1}
                      path="defense-sessions"
                    />
                    <DeleteDefenseSession
                      id={defenseSession?.id ? defenseSession.id : -1}
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
              {defenseSessions?.map((defenseSession) => (
                <tr
                  key={defenseSession?.id}
                  className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{defenseSession?.status}</p>
                    </div>
                  </td>
                  <td className="text-nowrap overflow-hidden text-ellipsis max-w-[200px] px-3 py-1">
                    {defenseSession?.note || 'Không có'}
                  </td>
                  <td className="px-3 py-1">
                    {defenseSession?.createdAt
                      ? new Date(defenseSession.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {defenseSession?.updatedAt
                      ? new Date(defenseSession.updatedAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {defenseSession?.room?.name || 'N/A'}
                  </td>
                  <td className="px-3 py-1">
                    {`${new Date(
                      defenseSession?.timeSlot?.date || ''
                    ).toLocaleDateString()} (${
                      defenseSession?.timeSlot?.start
                    } - ${defenseSession?.timeSlot?.end})`}
                  </td>
                  <td className="px-3 py-1">
                    {defenseSession?.defensePeriod?.name || 'N/A'}
                  </td>
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Update
                        id={defenseSession?.id ? defenseSession.id : -1}
                        path="defense-sessions"
                      />
                      <DeleteDefenseSession
                        id={defenseSession?.id ? defenseSession.id : -1}
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
