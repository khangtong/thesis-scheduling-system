'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TimeSlot } from '@/app/lib/definitions';
import { createTimeSlot } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { DefensePeriod } from '@/app/lib/definitions';
import { CalendarDateRangeIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Form({
  defensePeriods,
}: {
  defensePeriods: DefensePeriod[];
}) {
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
      <div className="rounded-md bg-gray-100 p-4 md:p-6">
        <div className="mb-4">
          <label
            htmlFor="defensePeriodId"
            className="mb-2 block text-sm font-medium"
          >
            Đợt bảo vệ
          </label>
          <div className="relative">
            <select
              id="defensePeriodId"
              name="defensePeriodId"
              className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="defensePeriodId-error"
              required
            >
              <option value="" disabled>
                Chọn đợt bảo vệ
              </option>
              {defensePeriods.map(
                (defensePeriod) =>
                  defensePeriod?.active && (
                    <option key={defensePeriod?.id} value={defensePeriod?.id}>
                      {defensePeriod?.name}
                    </option>
                  )
              )}
            </select>
            <CalendarDateRangeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.defensePeriodId && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.defensePeriodId}
            </span>
          )}
        </div>
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label
                htmlFor="start-morning-phase"
                className="mb-2 block text-sm font-medium"
              >
                Thời gian bắt đầu ca sáng
              </label>
              <input
                id="start-morning-phase"
                name="start-morning-phase"
                type="time"
                className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
                aria-describedby="start-morning-phase-error"
                min="00:00"
                max="11:59"
              />
              {state?.errors?.startMorningPhase && (
                <span className="text-left text-xs text-red-500 relative">
                  {state.errors.startMorningPhase}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="end-morning-phase"
                className="mb-2 block text-sm font-medium"
              >
                Thời gian kết thúc ca sáng
              </label>
              <input
                id="end-morning-phase"
                name="end-morning-phase"
                type="time"
                className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
                aria-describedby="end-morning-phase-error"
                min="00:00"
                max="11:59"
              />
              {state?.errors?.endMorningPhase && (
                <span className="text-left text-xs text-red-500 relative">
                  {state.errors.endMorningPhase}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label
                htmlFor="start-afternoon-phase"
                className="mb-2 block text-sm font-medium"
              >
                Thời gian bắt đầu ca chiều
              </label>
              <input
                id="start-afternoon-phase"
                name="start-afternoon-phase"
                type="time"
                className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
                aria-describedby="start-afternoon-phase-error"
                min="12:00"
                max="23:59"
              />
              {state?.errors?.startAfternoonPhase && (
                <span className="text-left text-xs text-red-500 relative">
                  {state.errors.startAfternoonPhase}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="end-afternoon-phase"
                className="mb-2 block text-sm font-medium"
              >
                Thời gian kết thúc ca chiều
              </label>
              <input
                id="end-afternoon-phase"
                name="end-afternoon-phase"
                type="time"
                className="peer block w-full bg-white rounded-md border border-gray-200 py-2 px-3 text-sm placeholder:text-gray-500"
                aria-describedby="end-afternoon-phase-error"
                min="12:00"
                max="23:59"
              />
              {state?.errors?.endAfternoonPhase && (
                <span className="text-left text-xs text-red-500 relative">
                  {state.errors.endAfternoonPhase}
                </span>
              )}
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="time-length"
            className="mb-2 block text-sm font-medium"
          >
            Thời lượng mỗi buổi bảo vệ
          </label>
          <div className="relative">
            <select
              id="time-length"
              name="time-length"
              className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="time-length-error"
              required
            >
              <option value="" disabled>
                Chọn thời lượng mỗi buổi bảo vệ
              </option>
              <option value="15">15 phút</option>
              <option value="20">20 phút</option>
              <option value="25">25 phút</option>
              <option value="30">30 phút</option>
              <option value="35">35 phút</option>
              <option value="40">40 phút</option>
              <option value="45">45 phút</option>
              <option value="50">50 phút</option>
              <option value="55">55 phút</option>
              <option value="60">60 phút</option>
            </select>
            <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.timeLength && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.timeLength}
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
          Tạo khung giờ
        </Button>
      </div>
    </form>
  );
}
