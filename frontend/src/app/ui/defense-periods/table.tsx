import { Update, DeleteDefensePeriod } from '../buttons';
import { DefensePeriod } from '@/app/lib/definitions';
import Status from '../status';

export default function Table({
  defensePeriods = [],
}: {
  defensePeriods: DefensePeriod[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0 overflow-x-auto w-full">
          <div className="xl:hidden">
            {defensePeriods?.map((defensePeriod) => (
              <div
                key={defensePeriod?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{defensePeriod?.name}</p>
                    </div>
                  </div>
                  <Status status={defensePeriod?.active ? true : false} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Bắt đầu:{' '}
                      {defensePeriod?.start
                        ? new Date(defensePeriod.start).toLocaleDateString()
                        : 'N/A'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Kết thúc:{' '}
                      {defensePeriod?.end
                        ? new Date(defensePeriod.end).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Update
                      id={defensePeriod?.id ? defensePeriod.id : -1}
                      path="defense-periods"
                    />
                    <DeleteDefensePeriod
                      id={defensePeriod?.id ? defensePeriod.id : -1}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-gray-900 xl:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Tên đợt bảo vệ
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Bắt đầu
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Kết thúc
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Trạng thái
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {defensePeriods?.map((defensePeriod) => (
                <tr
                  key={defensePeriod?.id}
                  className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{defensePeriod?.name}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {defensePeriod?.start
                      ? new Date(defensePeriod.start).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-3">
                    {defensePeriod?.end
                      ? new Date(defensePeriod.end).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-3 py-3">
                    <Status status={defensePeriod?.active ? true : false} />
                  </td>
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Update
                        id={defensePeriod?.id ? defensePeriod.id : -1}
                        path="defense-periods"
                      />
                      <DeleteDefensePeriod
                        id={defensePeriod?.id ? defensePeriod.id : -1}
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
