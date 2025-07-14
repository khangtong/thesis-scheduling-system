'use client';

import { AtSymbolIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateThesis } from '@/app/lib/actions';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Student, Lecturer, Thesis } from '@/app/lib/definitions';

export default function Form({
  thesis,
  students,
  lecturers,
}: {
  thesis: Thesis;
  students: Student[];
  lecturers: Lecturer[];
}) {
  const updateThesisWithId = updateThesis.bind(null, thesis?.id || -1);
  const [state, action, isPending] = useActionState(
    updateThesisWithId,
    undefined
  );
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<string>(
    thesis?.student?.id + ''
  );
  const [selectedLecturer, setSelectedLecturer] = useState<string>(
    thesis?.lecturer?.id + ''
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
          if (state?.success) {
            toast.success('Cập nhật luận văn thành công!');
            router.push('/dashboard/theses');
          } else {
            toast.error(state.message);
          }
        }
      }
    }
  }, [isPending, state]);

  return (
    <form action={action} aria-describedby="form-error">
      <div className="rounded-md bg-gray-100 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Tên đề tài
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Nhập tên đề tài"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="title-error"
                defaultValue={thesis?.title}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.title && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.title}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="studentId" className="mb-2 block text-sm font-medium">
            Sinh viên
          </label>
          <div className="relative">
            <select
              id="studentId"
              name="studentId"
              className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue={thesis?.student?.id || ''}
              aria-describedby="studentId-error"
              required
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="" disabled>
                Chọn sinh viên
              </option>
              {students.map((student) => (
                <option key={student?.id} value={student?.id}>
                  {student?.user?.fullname}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.studentId && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.studentId}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="lecturerId"
            className="mb-2 block text-sm font-medium"
          >
            Giảng viên hướng dẫn
          </label>
          <div className="relative">
            <select
              id="lecturerId"
              name="lecturerId"
              className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue={thesis?.lecturer?.id || ''}
              aria-describedby="lecturerId-error"
              required
              onChange={(e) => setSelectedLecturer(e.target.value)}
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
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.lecturerId && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.lecturerId}
            </span>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/theses"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Cập nhật luận văn
        </Button>
      </div>
    </form>
  );
}
