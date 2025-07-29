'use client';

import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [name, setName] = useState(searchParams.get('name') || '');
  const [start, setStart] = useState(searchParams.get('start') || '');
  const [end, setEnd] = useState(searchParams.get('end') || '');

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

    // Set or delete start parameter
    if (start) {
      params.set('start', start);
    } else {
      params.delete('start');
    }

    // Set or delete end parameter
    if (end) {
      params.set('end', end);
    } else {
      params.delete('end');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    // Reset state values
    setName('');
    setStart('');
    setEnd('');

    // Reset URL parameters
    const params = new URLSearchParams(searchParams);
    params.delete('name');
    params.delete('start');
    params.delete('end');
    params.set('page', '1');

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-2 flex-wrap">
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm text-gray-600 mb-1">
          Tên đợt bảo vệ
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Nhập tên đợt bảo vệ"
          className="peer block bg-white w-full max-w-[160px] rounded-md border border-gray-200 py-2 pl-1 text-sm placeholder:text-gray-500"
          aria-describedby="name-error"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="start" className="text-sm text-gray-600 mb-1">
          Ngày bắt đầu
        </label>
        <input
          type="date"
          id="start"
          className="w-[150px] rounded-md border border-gray-200 py-[9px] px-3 text-sm"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="end" className="text-sm text-gray-600 mb-1">
          Ngày kết thúc
        </label>
        <input
          type="date"
          id="end"
          className="w-[150px] rounded-md border border-gray-200 py-[9px] px-3 text-sm"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-2 lg:px-4 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600"
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-2 lg:px-4 text-xs lg:text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:bg-gray-300"
        >
          Đặt lại
        </button>
      </div>
    </form>
  );
}
