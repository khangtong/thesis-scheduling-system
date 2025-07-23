'use client';

import {
  AtSymbolIcon,
  BuildingOfficeIcon,
  CalendarDateRangeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { DefenseCommittee, TimeSlot } from '@/app/lib/definitions';
import { CommitteeMember } from '@/app/lib/definitions';

export default function Form({
  defenseCommittee,
  timeSlots,
  committeeMembers,
}: {
  defenseCommittee: DefenseCommittee;
  timeSlots: TimeSlot[];
  committeeMembers: CommitteeMember[];
}) {
  const selectedTimeSlots =
    timeSlots
      .filter(
        (timeSlot) => timeSlot?.defenseCommittee?.id == defenseCommittee?.id
      )
      .map((ts) => ts?.id || -1) || [];
  const filteredTimeSlots = timeSlots.filter((ts) =>
    selectedTimeSlots.includes(ts?.id || -1)
  );

  return (
    <form>
      <div className="rounded-md bg-gray-100 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Tên hội đồng
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nhập tên hội đồng"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="name-error"
                defaultValue={defenseCommittee?.name || ''}
                readOnly
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="defensePeriod"
            className="mb-2 block text-sm font-medium"
          >
            Đợt bảo vệ
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="defensePeriod"
                name="defensePeriod"
                type="text"
                placeholder="Nhập đợt bảo vệ"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="defensePeriod-error"
                defaultValue={defenseCommittee?.defensePeriod?.name}
                readOnly
              />
              <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="defensePeriodId"
            className="mb-2 block text-sm font-medium"
          >
            Thành viên hội đồng
          </label>
          <div className="pointer-events-none relative">
            <table className="w-full text-gray-900 border-collapse border border-gray-200">
              <thead className="text-sm font-normal bg-white">
                <tr>
                  <th
                    scope="col"
                    className="border border-gray-200 px-4 py-3 font-medium"
                  >
                    Vai trò hội đồng
                  </th>
                  <th
                    scope="col"
                    className="border border-gray-200 px-3 py-3 font-medium"
                  >
                    Giảng viên
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {committeeMembers.map((committeeMember) => (
                  <tr
                    key={committeeMember?.id}
                    className="w-full border border-gray-200 py-3 text-sm"
                  >
                    <td className="text-center py-1 pl-6 pr-3">
                      {committeeMember?.committeeRole?.name}
                      <input
                        type="text"
                        name="committeeRoleIds"
                        defaultValue={committeeMember?.committeeRole?.id}
                        className="hidden"
                      />
                    </td>
                    <td className="border border-gray-200 px-3 py-1">
                      <div className="relative">
                        <input
                          id={`lecturers-${committeeMember?.id}`}
                          name="lecturers"
                          type="text"
                          placeholder="Nhập tên sinh viên"
                          className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                          aria-describedby="lecturers-error"
                          defaultValue={
                            committeeMember?.lecturer?.user?.fullname
                          }
                          readOnly
                        />
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Chọn khung giờ
          </label>
          <div className="pointer-events-none rounded-md border border-gray-200 bg-white p-3">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredTimeSlots.map((timeSlot) => (
                <div key={timeSlot?.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`timeSlot-${timeSlot?.id}`}
                    name="timeSlotIds"
                    defaultValue={timeSlot?.id}
                    defaultChecked={selectedTimeSlots.includes(
                      timeSlot?.id || -1
                    )}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`timeSlot-${timeSlot?.id}`}
                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                  >
                    {`${timeSlot?.date
                      .toString()
                      .split('-')
                      .reverse()
                      .join('/')} (${timeSlot?.start} - ${timeSlot?.end})`}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {selectedTimeSlots.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-blue-600">
                Đã chọn {selectedTimeSlots.length} khung giờ
              </p>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="room" className="mb-2 block text-sm font-medium">
            Phòng
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="room"
                name="room"
                type="text"
                placeholder="Nhập phòng"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="room-error"
                defaultValue={defenseCommittee?.room?.name}
                readOnly
              />
              <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
