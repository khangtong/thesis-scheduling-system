'use client';

import { DefensePeriod, Room, TimeSlot } from '@/app/lib/definitions';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({
  rooms,
  timeSlots,
  defensePeriods,
}: {
  rooms: Room[];
  timeSlots: TimeSlot[];
  defensePeriods: DefensePeriod[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [defensePeriodId, setDefensePeriodId] = useState(
    searchParams.get('defensePeriodId') || ''
  );
  const [timeSlotId, setTimeSlotId] = useState(
    searchParams.get('timeSlotId') || ''
  );
  const [roomId, setRoomId] = useState(searchParams.get('roomId') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    // Set or delete status parameter
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    // Set or delete defense period parameter
    if (defensePeriodId) {
      params.set('defensePeriodId', defensePeriodId);
    } else {
      params.delete('defensePeriodId');
    }

    // Set or delete time slot parameter
    if (timeSlotId) {
      params.set('timeSlotId', timeSlotId);
    } else {
      params.delete('timeSlotId');
    }

    // Set or delete room parameter
    if (roomId) {
      params.set('roomId', roomId);
    } else {
      params.delete('roomId');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    // Reset state values
    setStatus('');
    setDefensePeriodId('');
    setTimeSlotId('');
    setRoomId('');

    // Reset URL parameters
    const params = new URLSearchParams(searchParams);
    params.delete('status');
    params.delete('defensePeriodId');
    params.delete('timeSlotId');
    params.delete('roomId');
    params.set('page', '1');

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-2 flex-wrap">
      <div className="flex flex-col">
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
          aria-describedby="status-error"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="" disabled>
            Chọn trạng thái
          </option>
          <option value="Chưa có luận văn">Chưa có luận văn</option>
          <option value="Đã có luận văn">Đã có luận văn</option>
          <option value="Đang bảo vệ">Đang bảo vệ</option>
          <option value="Đã bảo vệ">Đã bảo vệ</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="defensePeriodId"
          className="mb-2 block text-sm font-medium"
        >
          Đợt bảo vệ
        </label>
        <select
          id="defensePeriodId"
          name="defensePeriodId"
          className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
          aria-describedby="defensePeriodId-error"
          value={defensePeriodId}
          onChange={(e) => setDefensePeriodId(e.target.value)}
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
      </div>

      <div className="flex flex-col">
        <label htmlFor="timeSlotId" className="mb-2 block text-sm font-medium">
          Khung giờ
        </label>
        <select
          id="timeSlotId"
          name="timeSlotId"
          className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
          aria-describedby="timeSlotId-error"
          value={timeSlotId}
          onChange={(e) => setTimeSlotId(e.target.value)}
        >
          <option value="" disabled>
            Chọn khung giờ
          </option>
          {timeSlots.map((timeSlot) => (
            <option key={timeSlot?.id} value={timeSlot?.id}>
              {`${timeSlot?.date} (${timeSlot?.start} - ${timeSlot?.end})`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="roomId" className="mb-2 block text-sm font-medium">
          Phòng
        </label>
        <select
          id="roomId"
          name="roomId"
          className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
          aria-describedby="roomId-error"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        >
          <option value="" disabled>
            Chọn phòng
          </option>
          {rooms.map(
            (room) =>
              room?.active && (
                <option key={room?.id} value={room?.id}>
                  {room?.name}
                </option>
              )
          )}
        </select>
      </div>

      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-2 lg:px-4 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600"
        >
          <MagnifyingGlassIcon className="h-3 w-3 mr-1 lg:h-5 lg:w-5 lg:mr-2" />
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-2 lg:px-4 text-xs lg:text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:bg-gray-300"
        >
          <XCircleIcon className="h-3 w-3 mr-1 lg:h-5 lg:w-5 lg:mr-2" />
          Đặt lại
        </button>
      </div>
    </form>
  );
}
