'use client';

import { Lecturer, TimeSlot } from '@/app/lib/definitions';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({
  lecturers,
  timeSlots,
}: {
  lecturers: Lecturer[];
  timeSlots: TimeSlot[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [timeSlotId, setTimeSlotId] = useState(
    searchParams.get('timeSlotId') || ''
  );
  const [lecturerId, setLecturerId] = useState(
    searchParams.get('lecturerId') || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    // Set or delete title parameter
    if (title) {
      params.set('title', title);
    } else {
      params.delete('title');
    }

    // Set or delete status parameter
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    // Set or delete time slot parameter
    if (timeSlotId) {
      params.set('timeSlotId', timeSlotId);
    } else {
      params.delete('timeSlotId');
    }

    // Set or delete room parameter
    if (lecturerId) {
      params.set('lecturerId', lecturerId);
    } else {
      params.delete('lecturerId');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    // Reset state values
    setTitle('');
    setStatus('');
    setTimeSlotId('');
    setLecturerId('');

    // Reset URL parameters
    const params = new URLSearchParams(searchParams);
    params.delete('title');
    params.delete('status');
    params.delete('timeSlotId');
    params.delete('lecturerId');
    params.set('page', '1');

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-2 flex-wrap">
      <div className="flex flex-col">
        <label htmlFor="title" className="text-sm text-gray-600 mb-1">
          Tên đề tài
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Nhập tên đề tài"
          className="w-[150px] peer block bg-white max-w-[160px] rounded-md border border-gray-200 py-2 pl-1 text-sm placeholder:text-gray-500"
          aria-describedby="title-error"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="status" className="text-sm text-gray-600 mb-1">
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          className="w-[150px] peer block bg-white cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
          aria-describedby="status-error"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="" disabled>
            Chọn trạng thái
          </option>
          {['Chưa xếp lịch', 'Đã xếp lịch', 'Đã công bố', 'Đã bảo vệ'].map(
            (status) => (
              <option key={status} value={status}>
                {status}
              </option>
            )
          )}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="lecturerId" className="text-sm text-gray-600 mb-1">
          Giảng viên hướng dẫn
        </label>
        <select
          id="lecturerId"
          name="lecturerId"
          className="w-[150px] peer block bg-white cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
          aria-describedby="lecturerId-error"
          value={lecturerId}
          onChange={(e) => setLecturerId(e.target.value)}
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
      </div>

      <div className="flex flex-col">
        <label htmlFor="timeSlotId" className="text-sm text-gray-600 mb-1">
          Khung giờ
        </label>
        <select
          id="timeSlotId"
          name="timeSlotId"
          className="w-[150px] peer block bg-white cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
          aria-describedby="timeSlotId-error"
          value={timeSlotId}
          onChange={(e) => setTimeSlotId(e.target.value)}
        >
          <option value="" disabled>
            Chọn khung giờ
          </option>
          {timeSlots.map((timeSlot) => (
            <option key={timeSlot?.id} value={timeSlot?.id}>
              {`${timeSlot?.date.toString().split('-').reverse().join('/')} (${
                timeSlot?.start
              } - ${timeSlot?.end})`}
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
