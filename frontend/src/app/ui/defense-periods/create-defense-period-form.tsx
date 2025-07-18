'use client';

import { CalendarDateRangeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createDefensePeriod } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Form() {
  const [state, action, isPending] = useActionState(
    createDefensePeriod,
    undefined
  );
  const router = useRouter();

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
            toast.success('Tạo đợt bảo vệ thành công!');
            router.push('/dashboard/defense-periods');
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
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Tên đợt bảo vệ
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nhập tên đợt bảo vệ"
              className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              aria-describedby="name-error"
              required
            />
            <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {state?.errors?.name && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.name}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="start" className="mb-2 block text-sm font-medium">
            Ngày bắt đầu
          </label>
          <input
            id="start"
            name="start"
            type="date"
            className="block bg-white w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="start-error"
            required
          />
          {state?.errors?.start && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.start}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="end" className="mb-2 block text-sm font-medium">
            Ngày kết thúc
          </label>
          <input
            id="end"
            name="end"
            type="date"
            className="block bg-white w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="end-error"
            required
          />
          {state?.errors?.end && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.end}
            </span>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/defense-periods"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Tạo đợt bảo vệ
        </Button>
      </div>
    </form>
  );
}
