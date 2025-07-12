'use client';

import {
  AtSymbolIcon,
  BuildingOfficeIcon,
  CalendarDateRangeIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createDefenseCommittee } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DefensePeriod, Room, TimeSlot } from '@/app/lib/definitions';

export default function Form({
  rooms,
  timeSlots,
  defensePeriods,
}: {
  rooms: Room[];
  timeSlots: TimeSlot[];
  defensePeriods: DefensePeriod[];
}) {
  const [state, action, isPending] = useActionState(
    createDefenseCommittee,
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
            toast.success('Tạo hội đồng thành công!');
            router.push('/dashboard/defense-committees');
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
            Tên hội đồng
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nhập tên hội đồng"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="name-error"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.name && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.name}
            </span>
          )}
        </div>
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
          <label
            htmlFor="timeSlotId"
            className="mb-2 block text-sm font-medium"
          >
            Khung giờ
          </label>
          <div className="relative">
            <select
              id="timeSlotId"
              name="timeSlotId"
              className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="timeSlotId-error"
              required
            >
              <option value="" disabled>
                Chọn khung giờ
              </option>
              {timeSlots.map((timeSlot) => (
                <option key={timeSlot?.id} value={timeSlot?.id}>
                  {`${new Date(timeSlot?.date || '').toLocaleDateString()} (${
                    timeSlot?.start
                  } - ${timeSlot?.end})`}
                </option>
              ))}
            </select>
            <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.timeSlotId && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.timeSlotId}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="roomId" className="mb-2 block text-sm font-medium">
            Phòng
          </label>
          <div className="relative">
            <select
              id="roomId"
              name="roomId"
              className="peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="roomId-error"
              required
            >
              <option value="" disabled>
                Chọn phòng
              </option>
              {rooms.map(
                (room) =>
                  room?.active && (
                    <option key={room?.id} value={room?.id}>
                      {room?.name}
                    </option>
                  )
              )}
            </select>
            <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.roomId && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.roomId}
            </span>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/defense-committees"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Tạo hội đồng
        </Button>
      </div>
    </form>
  );
}
