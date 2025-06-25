'use client';

import {
  Degree,
  Faculty,
  Lecturer,
  Role,
  Student,
  User,
} from '@/app/lib/definitions';
import { Button } from '../button';
import Link from 'next/link';
import {
  AcademicCapIcon,
  AtSymbolIcon,
  BookOpenIcon,
  CheckIcon,
  EnvelopeIcon,
  IdentificationIcon,
  LockClosedIcon,
  NoSymbolIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUser } from '@/app/lib/actions';

export default function Form({
  user,
  roles,
  faculties,
  degrees,
  lecturer = null,
  student = null,
}: {
  user: User;
  roles: Role[];
  faculties: Faculty[];
  degrees: Degree[];
  lecturer: Lecturer | null;
  student: Student | null;
}) {
  const updateUserWithId = updateUser.bind(
    null,
    user?.id,
    lecturer?.id,
    student?.id
  );
  const [state, action, isPending] = useActionState(
    updateUserWithId,
    undefined
  );
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>(
    `${user?.role?.id}` || ''
  );

  useEffect(() => {
    if (isPending) {
      const toastId = toast.loading('Loading...');
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 1000);
    } else {
      if (state !== undefined) {
        if (state?.message) {
          toast.error(state.message);
        }

        if (state?.success) {
          toast.success('Cập nhật người dùng thành công!');
          router.push('/dashboard/users');
        }
      }
    }
  }, [isPending, state]);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r?.id === +roleId);
    return role?.name || '';
  };

  const renderAdditionalFields = () => {
    const roleName = getRoleName(selectedRole);

    if (roleName === 'GIANG_VIEN') {
      return (
        <div className="mt-6 rounded-md bg-blue-50 p-4 border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-4">
            Thông tin giảng viên
          </h3>

          <div className="mb-4">
            <label
              htmlFor="lecturerCode"
              className="mb-2 block text-sm font-medium"
            >
              Mã giảng viên
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="lecturerCode"
                  name="lecturerCode"
                  type="text"
                  placeholder="Nhập mã giảng viên"
                  className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                  aria-describedby="lecturerCode-error"
                  defaultValue={lecturer?.code || ''}
                  required
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state?.errors?.lecturerCode && (
              <span className="text-left text-xs text-red-500 relative">
                {state.errors.lecturerCode}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="facultyId"
              className="mb-2 block text-sm font-medium"
            >
              Khoa
            </label>
            <div className="relative">
              <select
                id="facultyId"
                name="facultyId"
                className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                defaultValue={lecturer?.faculty?.id || ''}
                aria-describedby="facultyId-error"
                required
              >
                <option value="" disabled>
                  Chọn khoa
                </option>
                {faculties.map((faculty) => (
                  <option key={faculty?.id} value={faculty?.id}>
                    {faculty?.name}
                  </option>
                ))}
              </select>
              <BookOpenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state?.errors?.facultyId && (
              <span className="text-left text-xs text-red-500 relative">
                {state.errors.facultyId}
              </span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="degreeId"
              className="mb-2 block text-sm font-medium"
            >
              Học vị
            </label>
            <div className="relative">
              <select
                id="degreeId"
                name="degreeId"
                className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                defaultValue={lecturer?.degree?.id || ''}
                aria-describedby="degreeId-error"
                required
              >
                <option value="" disabled>
                  Chọn học vị
                </option>
                {degrees.map((degree) => (
                  <option key={degree?.id} value={degree?.id}>
                    {degree?.name}
                  </option>
                ))}
              </select>
              <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state?.errors?.degreeId && (
              <span className="text-left text-xs text-red-500 relative">
                {state.errors.degreeId}
              </span>
            )}
          </div>
        </div>
      );
    }

    if (roleName === 'SINH_VIEN') {
      return (
        <div className="mt-6 rounded-md bg-green-50 p-4 border border-green-200">
          <h3 className="text-lg font-medium text-green-900 mb-4">
            Thông tin sinh viên
          </h3>

          <div className="mb-4">
            <label
              htmlFor="studentCode"
              className="mb-2 block text-sm font-medium"
            >
              Mã sinh viên
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="studentCode"
                  name="studentCode"
                  type="text"
                  placeholder="Nhập mã sinh viên"
                  className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                  aria-describedby="studentCode-error"
                  defaultValue={student?.code || ''}
                  required
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state?.errors?.studentCode && (
              <span className="text-left text-xs text-red-500 relative">
                {state.errors.studentCode}
              </span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="studentClass"
              className="mb-2 block text-sm font-medium"
            >
              Lớp
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="studentClass"
                  name="studentClass"
                  type="text"
                  placeholder="Nhập tên lớp"
                  className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                  aria-describedby="studentClass-error"
                  defaultValue={student?.studentClass || ''}
                  required
                />
                <UserGroupIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state?.errors?.studentClass && (
              <span className="text-left text-xs text-red-500 relative">
                {state.errors.studentClass}
              </span>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <form action={action} aria-describedby="form-error">
      <div className="rounded-md bg-gray-100 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Tên tài khoản
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Nhập tên tài khoản"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="username-error"
                defaultValue={user?.username || ''}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.username && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.username}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Mật khẩu
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="password-error"
                defaultValue={user?.password || ''}
                required
              />
              <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.password && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.password}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="email-error"
                defaultValue={user?.email || ''}
                required
              />
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.email && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.email}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="fullname" className="mb-2 block text-sm font-medium">
            Họ và tên
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Nhập họ và tên"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="fullname-error"
                defaultValue={user?.fullname || ''}
                required
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.fullname && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.fullname}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="roleId" className="mb-2 block text-sm font-medium">
            Vai trò
          </label>
          <div className="relative">
            <select
              id="roleId"
              name="roleId"
              className="pointer-events-none opacity-50 peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              aria-describedby="roleId-error"
              value={selectedRole}
              required
              onChange={handleRoleChange}
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
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.roleId && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.roleId}
            </span>
          )}
        </div>
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Trạng thái người dùng
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="active"
                  type="radio"
                  value="false"
                  defaultChecked={!user?.active}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600"
                  aria-describedby="active-error"
                />
                <label
                  htmlFor="false"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Không hoạt động <NoSymbolIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="active"
                  type="radio"
                  value="true"
                  defaultChecked={user?.active}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600"
                  aria-describedby="active-error"
                />
                <label
                  htmlFor="true"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Hoạt động <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Render additional fields based on selected role */}
      {renderAdditionalFields()}

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Cập nhật người dùng
        </Button>
      </div>
    </form>
  );
}
