'use client';

import {
  AtSymbolIcon,
  BuildingOfficeIcon,
  CalendarDateRangeIcon,
  ClockIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateDefenseSession } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  DefensePeriod,
  DefenseSession,
  Room,
  TimeSlot,
} from '@/app/lib/definitions';

export default function Form({
  defenseSession,
  rooms,
  timeSlots,
  defensePeriods,
}: {
  defenseSession: DefenseSession;
  rooms: Room[];
  timeSlots: TimeSlot[];
  defensePeriods: DefensePeriod[];
}) {
  const updateDefenseSessionWithId = updateDefenseSession.bind(
    null,
    defenseSession?.id || -1
  );
  const [state, action, isPending] = useActionState(
    updateDefenseSessionWithId,
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
            toast.success('Cập nhật buổi bảo vệ thành công!');
            router.push('/dashboard/defense-sessions');
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
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Trạng thái
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              className="pointer-events-none opacity-50 peer block bg-white w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
              defaultValue={defenseSession?.status || ''}
              aria-describedby="status-error"
              required
            >
              <option value="" disabled>
                Chọn trạng thái
              </option>
              <option value="Chưa có luận văn">Chưa có luận văn</option>
              <option value="Đã có luận văn">Đã có luận văn</option>
              <option value="Đang bảo vệ">Đang bảo vệ</option>
              <option value="Đã bảo vệ">Đã bảo vệ</option>
            </select>
            <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state?.errors?.status && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.status}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium">
            Ghi chú
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="note"
                name="note"
                type="text"
                placeholder="Nhập ghi chú"
                className="peer block bg-white w-full rounded-md border border-gray-200 py-2 pl-10 text-sm placeholder:text-gray-500"
                aria-describedby="note-error"
                defaultValue={defenseSession?.note || ''}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state?.errors?.note && (
            <span className="text-left text-xs text-red-500 relative">
              {state.errors.note}
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
              defaultValue={defenseSession?.defensePeriod?.id}
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
              defaultValue={defenseSession?.timeSlot?.id}
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
              defaultValue={defenseSession?.room?.id}
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
          href="/dashboard/faculties"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button type="submit" disabled={isPending}>
          Cập nhật buổi bảo vệ
        </Button>
      </div>
    </form>
  );
}
