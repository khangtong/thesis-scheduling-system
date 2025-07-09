import { PrioritySchedule, TimeSlot } from '@/app/lib/definitions';
import { DeletePrioritySchedule, RegisterPrioritySchedule } from '../buttons';

export default async function Table({
  timeSlots,
  prioritySchedules,
}: {
  timeSlots: TimeSlot[];
  prioritySchedules: PrioritySchedule[];
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-100 p-2 md:pt-0">
          <div className="md:hidden">
            {timeSlots?.map((timeSlot: TimeSlot) => (
              <div
                key={timeSlot?.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>
                        Ngày:{' '}
                        {timeSlot?.date
                          ? new Date(timeSlot.date).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Bắt đầu: {timeSlot?.start}
                    </p>
                    <p className="text-sm text-gray-500">
                      Kết thúc: {timeSlot?.end}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  {prioritySchedules.find(
                    (ps) => ps?.timeSlot?.id === timeSlot?.id
                  ) ? (
                    <DeletePrioritySchedule id={timeSlot?.id || -1} />
                  ) : (
                    <RegisterPrioritySchedule id={timeSlot?.id || -1} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium sm:pl-6">
                  Ngày
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Thời gian bắt đầu
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Thời gian kết thúc
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Trạng thái
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {timeSlots?.map((timeSlot: TimeSlot) => (
                <tr
                  key={timeSlot?.id}
                  className="w-full border-b border-gray-200 py-1 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="py-1 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>
                        {timeSlot?.date
                          ? new Date(timeSlot.date).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-1">{timeSlot?.start || 'N/A'}</td>
                  <td className="px-3 py-1">{timeSlot?.end || 'N/A'}</td>
                  <td className="px-3 py-1">
                    {prioritySchedules.find(
                      (ps) => ps?.timeSlot?.id === timeSlot?.id
                    )
                      ? 'Bận'
                      : 'Rảnh'}
                  </td>
                  <td className="py-1 pl-6 pr-3">
                    {prioritySchedules.find(
                      (ps) => ps?.timeSlot?.id === timeSlot?.id
                    ) ? (
                      <DeletePrioritySchedule id={timeSlot?.id || -1} />
                    ) : (
                      <RegisterPrioritySchedule id={timeSlot?.id || -1} />
                    )}
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
