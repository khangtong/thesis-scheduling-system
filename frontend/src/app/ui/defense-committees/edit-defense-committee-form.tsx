'use client';

import {
  AtSymbolIcon,
  BuildingOfficeIcon,
  CalendarDateRangeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateDefenseCommittee } from '@/app/lib/actions';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  DefensePeriod,
  DefenseCommittee,
  Room,
  TimeSlot,
  PrioritySchedule,
} from '@/app/lib/definitions';
import { CommitteeMember, Lecturer } from '@/app/lib/definitions';

export default function Form({
  defenseCommittee,
  rooms,
  timeSlots,
  defensePeriods,
  committeeMembers,
  lecturers,
  prioritySchedules,
}: {
  defenseCommittee: DefenseCommittee;
  rooms: Room[];
  timeSlots: TimeSlot[];
  defensePeriods: DefensePeriod[];
  committeeMembers: CommitteeMember[];
  lecturers: Lecturer[];
  prioritySchedules: PrioritySchedule[];
}) {
  const updateDefenseCommitteeWithId = updateDefenseCommittee.bind(
    null,
    defenseCommittee?.id || -1
  );
  const [state, action, isPending] = useActionState(
    updateDefenseCommitteeWithId,
    undefined
  );
  const router = useRouter();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>(
    timeSlots
      .filter(
        (timeSlot) => timeSlot?.defenseCommittee?.id == defenseCommittee?.id
      )
      .map((ts) => ts?.id || -1) || []
  );
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedLecturerIds, setSelectedLecturerIds] = useState<string[]>([]);
  const [selectedDefensePeriodId, setSelectedDefensePeriodId] =
    useState<string>(defenseCommittee?.defensePeriod?.id?.toString() || '');

  // Function to get all currently selected lecturer IDs from all select inputs
  const getAllSelectedLecturerIds = () => {
    const ids: string[] = [];
    committeeMembers.forEach((member) => {
      const selectElement = document.getElementById(
        `lecturerId-${member?.id}`
      ) as HTMLSelectElement;
      if (selectElement && selectElement.value) {
        ids.push(selectElement.value);
      }
    });
    return ids;
  };

  // Initialize selected lecturer IDs from existing committee members
  useEffect(() => {
    const initialLecturerIds = committeeMembers
      .map((member) => member?.lecturer?.id?.toString())
      .filter(Boolean) as string[];
    setSelectedLecturerIds(initialLecturerIds);
  }, [committeeMembers]);

  useEffect(() => {
    // If no defense period is selected, show empty time slots
    if (!selectedDefensePeriodId) {
      setFilteredTimeSlots([]);
      return;
    }

    let availableTimeSlots = timeSlots;

    // Filter by defense period date range
    const selectedDefensePeriod = defensePeriods.find(
      (dp) => dp?.id?.toString() === selectedDefensePeriodId
    );

    if (selectedDefensePeriod) {
      const startDate = new Date(
        `${selectedDefensePeriod.start}`.split('T')[0]
      );
      const endDate = new Date(`${selectedDefensePeriod.end}`.split('T')[0]);

      availableTimeSlots = availableTimeSlots.filter((ts) => {
        const timeSlotDate = new Date(ts?.date + '');
        return timeSlotDate >= startDate && timeSlotDate <= endDate;
      });
    }

    // Filter by lecturer schedules (exclude time slots that conflict with selected lecturers)
    if (selectedLecturerIds.length > 0) {
      const lecturerSchedules = prioritySchedules.filter((ps) =>
        selectedLecturerIds.some((id) => ps?.lecturer?.id === +id)
      );

      availableTimeSlots = availableTimeSlots.filter(
        (ts) => !lecturerSchedules.some((ls) => ls?.timeSlot?.id === ts?.id)
      );
    }

    // Include already selected time slots for this defense committee (even if they would be filtered out)
    const currentlySelectedTimeSlots = timeSlots.filter(
      (ts) => ts?.defenseCommittee?.id === defenseCommittee?.id
    );

    // Merge available time slots with currently selected ones, removing duplicates
    const mergedTimeSlots = [
      ...availableTimeSlots,
      ...currentlySelectedTimeSlots.filter(
        (selected) =>
          !availableTimeSlots.some(
            (available) => available?.id === selected?.id
          )
      ),
    ];

    setFilteredTimeSlots(mergedTimeSlots);
  }, [
    selectedLecturerIds,
    selectedDefensePeriodId,
    timeSlots,
    prioritySchedules,
    defensePeriods,
    defenseCommittee?.id,
  ]);

  useEffect(() => {
    if (isPending) {
      const toastId = toast.loading('Loading...');
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 1000);
    } else {
      if (state !== undefined) {
        if (state?.message) {
          if (state?.success) {
            toast.success('Cập nhật hội đồng thành công!');
            router.push('/dashboard/defense-committees');
          } else {
            toast.error(state.message);
          }
        }
      }
    }
  }, [isPending, state]);

  const handleTimeSlotChange = (timeSlotId: number) => {
    setSelectedTimeSlots((prev) => {
      if (prev.includes(timeSlotId)) {
        return prev.filter((id) => id !== timeSlotId);
      } else {
        return [...prev, timeSlotId];
      }
    });
  };

  const handleLecturerChange = () => {
    // Get all currently selected lecturer IDs from all select inputs
    const allSelectedIds = getAllSelectedLecturerIds();
    setSelectedLecturerIds(allSelectedIds);
  };

  const handleDefensePeriodChange = (defensePeriodId: string) => {
    setSelectedDefensePeriodId(defensePeriodId);
    // Clear selected time slots when defense period changes (except already assigned ones)
    const currentlyAssignedTimeSlots = timeSlots
      .filter((ts) => ts?.defenseCommittee?.id === defenseCommittee?.id)
      .map((ts) => ts?.id || -1);
    setSelectedTimeSlots(currentlyAssignedTimeSlots);
    // Clear all lecturer selections when defense period changes
    setSelectedLecturerIds([]);
    // Clear all lecturer select inputs
    committeeMembers.forEach((member) => {
      const selectElement = document.getElementById(
        `lecturerId-${member?.id}`
      ) as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = '';
      }
    });
  };

  return (
    <form action={action} aria-describedby="form-error">
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
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.name && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.name}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="defensePeriodId"
            className="mb-2 block text-sm font-medium"
          >
            Đợt bảo vệ
          </label>
          <div className="relative">
            <select
              id="defensePeriodId"
              name="defensePeriodId"
              className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue={defenseCommittee?.defensePeriod?.id || ''}
              onChange={(e) => handleDefensePeriodChange(e.target.value)}
              aria-describedby="defensePeriodId-error"
              required
            >
              <option value="" disabled>
                Chọn đợt bảo vệ
              </option>
              {defensePeriods.map(
                (defensePeriod) =>
                  defensePeriod?.active && (
                    <option key={defensePeriod?.id} value={defensePeriod?.id}>
                      {defensePeriod?.name}
                    </option>
                  )
              )}
            </select>
            <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.defensePeriodId && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.defensePeriodId}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="defensePeriodId"
            className="mb-2 block text-sm font-medium"
          >
            Thành viên hội đồng
          </label>
          <div className="relative">
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
                      <select
                        id={`lecturerId-${committeeMember?.id}`}
                        name="lecturerIds"
                        className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-3 text-sm placeholder:text-gray-500"
                        defaultValue={committeeMember?.lecturer?.id || ''}
                        onChange={handleLecturerChange}
                        aria-describedby={`lecturerId-${committeeMember?.id}-error`}
                        required
                      >
                        <option value="" disabled>
                          Chọn giảng viên
                        </option>
                        {lecturers.map((lecturer) => (
                          <option key={lecturer?.id} value={lecturer?.id}>
                            {lecturer?.user?.fullname}
                          </option>
                        ))}
                      </select>
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
          <div className="rounded-md border border-gray-200 bg-white p-3">
            {filteredTimeSlots.length > 0 ? (
              <div className="space-y-2 max-h-68 overflow-y-auto">
                {filteredTimeSlots.map((timeSlot) => (
                  <div key={timeSlot?.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`timeSlot-${timeSlot?.id}`}
                      name="timeSlotIds"
                      value={timeSlot?.id}
                      checked={selectedTimeSlots.includes(timeSlot?.id || -1)}
                      onChange={() => handleTimeSlotChange(timeSlot?.id || -1)}
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
            ) : (
              <p className="text-sm text-gray-500">
                {!selectedDefensePeriodId
                  ? 'Vui lòng chọn đợt bảo vệ trước'
                  : 'Không có khung giờ nào'}
              </p>
            )}
          </div>
          {selectedTimeSlots.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-blue-600">
                Đã chọn {selectedTimeSlots.length} khung giờ
              </p>
            </div>
          )}
          {state?.errors?.timeSlotIds && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.timeSlotIds}
            </span>
          )}
        </div>
        <div className="mb-1">
          <label htmlFor="roomId" className="mb-2 block text-sm font-medium">
            Phòng
          </label>
          <div className="relative">
            <select
              id="roomId"
              name="roomId"
              className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue={defenseCommittee?.room?.id || ''}
              aria-describedby="roomId-error"
              required
            >
              <option value="" disabled>
                Chọn phòng
              </option>
              {rooms.map(
                (room) =>
                  room?.active && (
                    <option key={room?.id} value={room?.name}>
                      {room?.name}
                    </option>
                  )
              )}
            </select>
            <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.roomId && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.roomId}
            </span>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/defense-committees"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Cập nhật hội đồng
        </Button>
      </div>
    </form>
  );
}
