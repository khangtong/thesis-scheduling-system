'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TimeSlot } from '@/app/lib/definitions';
import { createTimeSlot } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

export default function Form() {
  const [state, action, isPending] = useActionState(createTimeSlot, undefined);
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
            toast.success('Tạo khung giờ thành công!');
            router.push('/dashboard/time-slots');
          } else {
            toast.error(state.message);
          }
        }
      }
    }
  }, [isPending, state]);

  return (
    <form action={action}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Date */}
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            Ngày
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="date-error"
          />
          <div id="date-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.date &&
              state.errors.date.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label htmlFor="start" className="mb-2 block text-sm font-medium">
            Thời gian bắt đầu
          </label>
          <input
            id="start"
            name="start"
            type="time"
            className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="start-error"
          />
          <div id="start-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.start &&
              state.errors.start.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* End Time */}
        <div className="mb-4">
          <label htmlFor="end" className="mb-2 block text-sm font-medium">
            Thời gian kết thúc
          </label>
          <input
            id="end"
            name="end"
            type="time"
            className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="end-error"
          />
          <div id="end-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.end &&
              state.errors.end.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/time-slots"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Tạo khung giờ
        </Button>
      </div>
    </form>
  );
}
