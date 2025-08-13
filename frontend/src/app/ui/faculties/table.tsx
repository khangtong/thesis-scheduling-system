import { Update, DeleteFaculty } from '../buttons';
import { Faculty } from '@/app/lib/definitions';

export default function Table({ faculties = [] }: { faculties: Faculty[] }) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0 overflow-x-auto w-full">
          <div className="xl:hidden">
            {faculties?.map((faculty) => (
              <div
                key={faculty?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <div className="flex items-center">
                      <p>{faculty?.name}</p>
                    </div>
                  </div>
                  <p>ID: {faculty?.id}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <Update
                      id={faculty?.id ? faculty.id : -1}
                      path="faculties"
                    />
                    <DeleteFaculty id={faculty?.id ? faculty.id : -1} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-gray-900 xl:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium sm:pl-6">
                  ID
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Tên khoa
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {faculties?.map((faculty) => (
                <tr
                  key={faculty?.id}
                  className="w-full border-b border-gray-200 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-1 pl-6 pr-3">
                    <p>{faculty?.id}</p>
                  </td>
                  <td className="px-3 py-1">
                    <p>{faculty?.name}</p>
                  </td>
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Update
                        id={faculty?.id ? faculty.id : -1}
                        path="faculties"
                      />
                      <DeleteFaculty id={faculty?.id ? faculty.id : -1} />
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
