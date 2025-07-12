'use client';

import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { DefenseCommittee } from '@/app/lib/definitions';

export default function SearchForm({
  defenseCommittees,
}: {
  defenseCommittees: DefenseCommittee[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [date, setDate] = useState(searchParams.get('date') || '');
  const [startTime, setStartTime] = useState(searchParams.get('start') || '');
  const [endTime, setEndTime] = useState(searchParams.get('end') || '');
  const [defenseCommitteeId, setDefenseCommitteeId] = useState(
    searchParams.get('defenseCommitteeId') || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    // Set or delete date parameter
    if (date) {
      params.set('date', date);
    } else {
      params.delete('date');
    }

    // Set or delete start time parameter
    if (startTime) {
      params.set('start', startTime);
    } else {
      params.delete('start');
    }

    // Set or delete end time parameter
    if (endTime) {
      params.set('end', endTime);
    } else {
      params.delete('end');
    }

    // Set or delete defense committee id parameter
    if (defenseCommitteeId) {
      params.set('defenseCommitteeId', defenseCommitteeId);
    } else {
      params.delete('defenseCommitteeId');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    // Reset state values
    setDate('');
    setStartTime('');
    setEndTime('');
    setDefenseCommitteeId('');

    // Reset URL parameters
    const params = new URLSearchParams(searchParams);
    params.delete('date');
    params.delete('start');
    params.delete('end');
    params.delete('defenseCommitteeId');
    params.set('page', '1');

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-2 flex-wrap">
      <div className="flex flex-col">
        <label htmlFor="date" className="text-sm text-gray-600 mb-1">
          Ngày
        </label>
        <input
          type="date"
          id="date"
          className="w-[160px] rounded-md border border-gray-200 py-[9px] px-3 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="start-time" className="text-sm text-gray-600 mb-1">
          Thời gian bắt đầu
        </label>
        <input
          type="time"
          id="start-time"
          className="w-[160px] rounded-md border border-gray-200 py-[9px] px-3 text-sm"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="end-time" className="text-sm text-gray-600 mb-1">
          Thời gian kết thúc
        </label>
        <input
          type="time"
          id="end-time"
          className="w-[160px] rounded-md border border-gray-200 py-[9px] px-3 text-sm"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="defenseCommitteeId"
          className="text-sm text-gray-600 mb-1"
        >
          Hội đồng
        </label>
        <select
          id="defenseCommitteeId"
          name="defenseCommitteeId"
          className="w-full rounded-md border border-gray-200 py-[10px] text-sm"
          aria-describedby="defenseCommitteeId-error"
          value={defenseCommitteeId}
          onChange={(e) => setDefenseCommitteeId(e.target.value)}
        >
          <option value="" disabled>
            Chọn hội đồng
          </option>
          {defenseCommittees.map((defenseCommittee) => (
            <option key={defenseCommittee?.id} value={defenseCommittee?.id}>
              {defenseCommittee?.name}
            </option>
          ))}
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
