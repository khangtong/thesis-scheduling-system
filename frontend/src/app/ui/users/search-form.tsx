'use client';

import { Role } from '@/app/lib/definitions';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({ roles }: { roles: Role[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [roleId, setRoleId] = useState(searchParams.get('roleId') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    // Set or delete query parameter
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }

    // Set or delete roleId parameter
    if (roleId) {
      params.set('roleId', roleId);
    } else {
      params.delete('roleId');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    // Reset state values
    setQuery('');
    setRoleId('');

    // Reset URL parameters
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    params.delete('roleId');
    params.set('page', '1');

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-2 flex-wrap">
      <div className="flex flex-col">
        <label htmlFor="query" className="text-sm text-gray-600 mb-1">
          Tài khoản / Email / Họ tên
        </label>
        <input
          id="query"
          name="query"
          type="text"
          placeholder="Nhập tài khoản, email, họ tên"
          className="w-[215px] peer block bg-white rounded-md border border-gray-200 py-2 pl-1 text-sm placeholder:text-gray-500"
          aria-describedby="query-error"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="roleId" className="text-sm text-gray-600 mb-1">
          Vai trò
        </label>
        <select
          id="roleId"
          name="roleId"
          className="w-full peer block bg-white cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
          aria-describedby="roleId-error"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        >
          <option value="" disabled>
            Chọn vai trò
          </option>
          {roles.map((role) => (
            <option key={role?.id} value={role?.id}>
              {role?.name}
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
