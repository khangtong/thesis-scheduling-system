'use client';

import {
  EyeIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  createPrioritySchedule,
  deleteCommitteeRole,
  deleteDefensePeriod,
  deleteDefenseCommittee,
  deleteDegree,
  deleteExpertise,
  deleteFaculty,
  deletePrioritySchedule,
  deleteRoom,
  deleteTimeSlot,
  deleteUser,
  deleteThesis,
} from '../lib/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { error } from 'console';

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
      className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function View({ id, path }: { id: number; path: string }) {
  return (
    <Link
      href={`/dashboard/${path}/${id}/view`}
      className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
    >
      <EyeIcon className="w-5" />
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
            error: (error) => error.message,
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
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
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
            error: (error) => error.message,
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
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
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
            error: (error) => error.message,
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
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
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
            error: (error) => error.message,
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
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
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
            error: (error) => error.message,
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
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteExpertise({ id }: { id: number }) {
  const deleteExpertiseWithId = deleteExpertise.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa chuyên môn này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteExpertiseWithId(), {
            loading: 'Đang xóa chuyên môn...',
            success: 'Xóa chuyên môn thành công',
            error: (error) => error.message,
          });
          router.push('/dashboard/expertises');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteDefensePeriod({ id }: { id: number }) {
  const deleteDefensePeriodWithId = deleteDefensePeriod.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa đợt bảo vệ này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteDefensePeriodWithId(), {
            loading: 'Đang xóa đợt bảo vệ...',
            success: 'Xóa đợt bảo vệ thành công',
            error: (error) => error.message,
          });
          router.push('/dashboard/defense-periods');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteTimeSlot({ id }: { id: number }) {
  const deleteTimeSlotWithId = deleteTimeSlot.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa khung giờ này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteTimeSlotWithId(), {
            loading: 'Đang xóa khung giờ...',
            success: 'Xóa khung giờ thành công',
            error: (error) => error.message,
          });
          router.push('/dashboard/time-slots');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function RegisterPrioritySchedule({ id }: { id: number }) {
  const createPriorityScheduleWithId = createPrioritySchedule.bind(null, id);
  const router = useRouter();

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast.promise(createPriorityScheduleWithId(), {
      loading: 'Đang đăng ký...',
      success: (result) => {
        router.refresh();
        return result.message;
      },
      error: (error) => error.message,
    });
  }

  return (
    <form onSubmit={handleCreate}>
      <button
        type="submit"
        className="cursor-pointer rounded-md border border-gray-200 p-1 hover:bg-gray-100"
      >
        <span className="sr-only">Đăng ký</span>
        <PencilSquareIcon className="w-5 text-green-600" />
      </button>
    </form>
  );
}

export function DeletePrioritySchedule({ id }: { id: number }) {
  const deletePriorityScheduleWithId = deletePrioritySchedule.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn hủy lịch bận này?', {
      action: {
        label: 'Hủy',
        onClick: () => {
          toast.promise(deletePriorityScheduleWithId(), {
            loading: 'Đang hủy lịch bận...',
            success: (result) => {
              router.refresh();
              return result.message;
            },
            error: (error) => error.message,
          });
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
      >
        <span className="sr-only">Hủy</span>
        <XMarkIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteDefenseCommittee({ id }: { id: number }) {
  const deleteDefenseCommitteeWithId = deleteDefenseCommittee.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa hội đồng này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteDefenseCommitteeWithId(), {
            loading: 'Đang xóa hội đồng...',
            success: 'Xóa hội đồng thành công',
            error: (error) => error.message,
          });
          router.push('/dashboard/defense-committees');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}

export function DeleteThesis({ id }: { id: number }) {
  const deleteThesisWithId = deleteThesis.bind(null, id);
  const router = useRouter();

  function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    toast('Bạn có chắc chắn muốn xóa luận văn này?', {
      action: {
        label: 'Xóa',
        onClick: () => {
          toast.promise(deleteThesisWithId(), {
            loading: 'Đang xóa luận văn...',
            success: 'Xóa luận văn thành công',
            error: (error) => error.message,
          });
          router.push('/dashboard/theses');
        },
      },
    });
  }

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="rounded-md border border-gray-200 p-1 hover:bg-gray-100"
      >
        <span className="sr-only">Xóa</span>
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}
