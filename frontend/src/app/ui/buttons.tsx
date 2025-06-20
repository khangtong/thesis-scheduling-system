import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function Create({ singular, path }: { singular: string; path: string }) {
  return (
    <Link
      href={`/dashboard/${path}/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block capitalize">Tạo {singular}</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function Update({ id, path }: { id: number; path: string }) {
  return (
    <Link
      href={`/dashboard/${path}/${id}/edit`}
      className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function Delete({ id }: { id: number }) {
  return (
    <form>
      <button className="rounded-md border border-gray-200 p-2 hover:bg-gray-100">
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}
