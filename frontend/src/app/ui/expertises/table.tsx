import { Update, DeleteExpertise } from '../buttons';
import { Expertise } from '@/app/lib/definitions';

export default function Table({
  expertises = [],
}: {
  expertises: Expertise[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0 overflow-x-auto w-full">
          <div className="xl:hidden">
            {expertises?.map((expertise) => (
              <div
                key={expertise?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{expertise?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="max-w-[160px] text-xs text-nowrap overflow-hidden text-ellipsis sm:text-sm text-gray-500">
                      {expertise?.description}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Update
                      id={expertise?.id ? expertise.id : -1}
                      path="expertises"
                    />
                    <DeleteExpertise id={expertise?.id ? expertise.id : -1} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-gray-900 xl:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Tên chuyên môn
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Mô tả chuyên môn
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {expertises?.map((expertise) => (
                <tr
                  key={expertise?.id}
                  className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{expertise?.name}</p>
                    </div>
                  </td>
                  <td className="text-nowrap overflow-hidden text-ellipsis max-w-[200px] px-3 py-3">
                    {expertise?.description}
                  </td>
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Update
                        id={expertise?.id ? expertise.id : -1}
                        path="expertises"
                      />
                      <DeleteExpertise id={expertise?.id ? expertise.id : -1} />
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
