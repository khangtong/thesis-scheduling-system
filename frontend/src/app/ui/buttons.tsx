'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  deleteCommitteeRole,
  deleteDegree,
  deleteFaculty,
  deleteRoom,
  deleteUser,
} from '../lib/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function Create({ singular, path }: { singular: string; path: string }) {
  return (
    <Link
      href={`/dashboard/${path}/create`}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-2 sm:px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden lg:block capitalize">Tạo {singular}</span>{' '}
      <PlusIcon className="h-5 lg:ml-4" />
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

export function DeleteUser({ id }: { id: number }) {
  const deleteUserWithId = deleteUser.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa người dùng này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteUserWithId(), {
            loading: 'Đang xóa người dùng...',
            success: 'Xóa người dùng thành công',
            error: 'Có lỗi xảy ra khi xóa người dùng',
          });
          router.push('/dashboard/users');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteFaculty({ id }: { id: number }) {
  const deleteFacultyWithId = deleteFaculty.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa khoa này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteFacultyWithId(), {
            loading: 'Đang xóa khoa...',
            success: 'Xóa khoa thành công',
            error: 'Có lỗi xảy ra khi xóa khoa',
          });
          router.push('/dashboard/faculties');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteDegree({ id }: { id: number }) {
  const deleteDegreeWithId = deleteDegree.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa học vị này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteDegreeWithId(), {
            loading: 'Đang xóa học vị...',
            success: 'Xóa học vị thành công',
            error: 'Có lỗi xảy ra khi xóa học vị',
          });
          router.push('/dashboard/degrees');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteRoom({ id }: { id: number }) {
  const deleteRoomWithId = deleteRoom.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa phòng này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteRoomWithId(), {
            loading: 'Đang xóa phòng...',
            success: 'Xóa phòng thành công',
            error: 'Có lỗi xảy ra khi xóa phòng',
          });
          router.push('/dashboard/rooms');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteCommitteeRole({ id }: { id: number }) {
  const deleteCommitteeRoleWithId = deleteCommitteeRole.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa vai trò hội đồng này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteCommitteeRoleWithId(), {
            loading: 'Đang xóa vai trò hội đồng...',
            success: 'Xóa vai trò hội đồng thành công',
            error: 'Có lỗi xảy ra khi xóa vai trò hội đồng',
          });
          router.push('/dashboard/committee-roles');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}
