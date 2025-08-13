'use client';

import {
  AtSymbolIcon,
  BuildingOfficeIcon,
  ClockIcon,
  TagIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { CommitteeMember, Thesis } from '@/app/lib/definitions';

export default function Form({
  thesis,
  committeeMembers,
}: {
  thesis: Thesis;
  committeeMembers: CommitteeMember[];
}) {
  return (
    <form aria-describedby="form-error">
      <div className="rounded-md bg-gray-100 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Tên đề tài
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Nhập tên đề tài"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="title-error"
                defaultValue={thesis?.title}
                readOnly
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="student" className="mb-2 block text-sm font-medium">
            Sinh viên
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="student"
                name="student"
                type="text"
                placeholder="Nhập tên sinh viên"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="student-error"
                defaultValue={thesis?.student?.user?.fullname}
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="lecturer" className="mb-2 block text-sm font-medium">
            Giảng viên hướng dẫn
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="lecturer"
                name="lecturer"
                type="text"
                placeholder="Nhập tên giảng viên hướng dẫn"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="lecturer-error"
                defaultValue={thesis?.lecturer?.user?.fullname}
                readOnly
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Trạng thái
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="status"
                name="status"
                type="text"
                placeholder="Nhập trạng thái"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="status-error"
                defaultValue={thesis?.status}
                readOnly
              />
              <TagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="timeSlot" className="mb-2 block text-sm font-medium">
            Khung giờ
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="timeSlot"
                name="timeSlot"
                type="text"
                placeholder="Nhập khung giờ"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="timeSlot-error"
                defaultValue={
                  thesis?.timeSlot
                    ? `${thesis?.timeSlot?.date
                        .toString()
                        .split('-')
                        .reverse()
                        .join('/')} (${thesis?.timeSlot?.start} - ${
                        thesis?.timeSlot?.end
                      })`
                    : 'Chưa có'
                }
                readOnly
              />
              <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="defenseCommittee"
            className="mb-2 block text-sm font-medium"
          >
            Hội đồng
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="defenseCommittee"
                name="defenseCommittee"
                type="text"
                placeholder="Nhập hội đồng"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="defenseCommittee-error"
                defaultValue={
                  thesis?.timeSlot?.defenseCommittee?.name || 'Chưa có'
                }
                readOnly
              />
              <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
          {committeeMembers.length > 0 ? (
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
          ) : (
            <div className="relative">
              <input
                id="defenseCommittee"
                name="defenseCommittee"
                type="text"
                placeholder="Nhập hội đồng"
                className=" peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="defenseCommittee-error"
                defaultValue="Chưa có"
                readOnly
              />
              <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                defaultValue={
                  thesis?.timeSlot?.defenseCommittee?.room?.name || 'Chưa có'
                }
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
