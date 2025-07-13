'use client';

import { DefensePeriod, Room, TimeSlot } from '@/app/lib/definitions';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({
  rooms,
  defensePeriods,
}: {
  rooms: Room[];
  defensePeriods: DefensePeriod[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [name, setName] = useState(searchParams.get('name') || '');
  const [defensePeriodId, setDefensePeriodId] = useState(
    searchParams.get('defensePeriodId') || ''
  );
  const [roomId, setRoomId] = useState(searchParams.get('roomId') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    // Set or delete name parameter
    if (name) {
      params.set('name', name);
    } else {
      params.delete('name');
    }

    // Set or delete defense period parameter
    if (defensePeriodId) {
      params.set('defensePeriodId', defensePeriodId);
    } else {
      params.delete('defensePeriodId');
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
    setName('');
    setDefensePeriodId('');
    setRoomId('');

    // Reset URL parameters
    const params = new URLSearchParams(searchParams);
    params.delete('name');
    params.delete('defensePeriodId');
    params.delete('roomId');
    params.set('page', '1');

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-2 flex-wrap">
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm text-gray-600 mb-1">
          Tên hội đồng
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Nhập tên hội đồng"
          className="peer block bg-white w-full max-w-[160px] rounded-md border border-gray-200 py-2 pl-1 text-sm placeholder:text-gray-500"
          aria-describedby="name-error"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="defensePeriodId" className="text-sm text-gray-600 mb-1">
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
          {defensePeriods.map((defensePeriod) => (
            <option key={defensePeriod?.id} value={defensePeriod?.id}>
              {defensePeriod?.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="roomId" className="text-sm text-gray-600 mb-1">
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
