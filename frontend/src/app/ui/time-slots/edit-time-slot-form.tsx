'use client';

import { useActionState } from 'react';
import { toast } from 'sonner';
import { TimeSlot } from '@/app/lib/definitions';
import { updateTimeSlot } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Form({ timeSlot }: { timeSlot: TimeSlot }) {
  const [state, action, isPending] = useActionState(
    updateTimeSlot.bind(null, timeSlot?.id),
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
            toast.success('Cập nhật khung giờ thành công!');
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
            defaultValue={`${timeSlot?.date}`.split('T')[0]}
            className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="date-error"
          />
          {state?.errors?.date && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.date}
            </span>
          )}
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
            defaultValue={timeSlot?.start}
            className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="start-error"
          />
          {state?.errors?.start && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.start}
            </span>
          )}
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
            defaultValue={timeSlot?.end}
            className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="end-error"
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
          href="/dashboard/time-slots"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Cập nhật khung giờ
        </Button>
      </div>
    </form>
  );
}
