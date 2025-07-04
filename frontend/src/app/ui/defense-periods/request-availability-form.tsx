'use client';

import {
  CalendarDateRangeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { requestAvailability } from '@/app/lib/actions';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DefensePeriod } from '@/app/lib/definitions';

// Helper function to get all dates between start and end dates
function getDatesInRange(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = new Date(startDate);

  // Adjust to start of day
  currentDate.setHours(0, 0, 0, 0);

  // Create a copy of endDate and set to end of day
  const endDateCopy = new Date(endDate);
  endDateCopy.setHours(23, 59, 59, 999);

  while (currentDate <= endDateCopy) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Format date for display
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function Form({
  defensePeriods,
}: {
  defensePeriods: DefensePeriod[];
}) {
  const [state, action, isPending] = useActionState(
    requestAvailability,
    undefined
  );
  const router = useRouter();
  const [selectedDefensePeriod, setSelectedDefensePeriod] =
    useState<DefensePeriod | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [allChecked, setAllChecked] = useState(false);

  // Handle defense period selection change
  const handleDefensePeriodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = Number(e.target.value);
    const selected = defensePeriods.find((dp) => dp?.id === selectedId) || null;
    setSelectedDefensePeriod(selected);

    if (selected && selected.start && selected.end) {
      const dates = getDatesInRange(selected.start, selected.end);
      setAvailableDates(dates);
      // Reset selections when changing defense period
      setSelectedDates(new Set());
      setAllChecked(false);
    } else {
      setAvailableDates([]);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (date: Date, checked: boolean) => {
    const dateStr = date.toISOString();
    const newSelectedDates = new Set(selectedDates);

    if (checked) {
      newSelectedDates.add(dateStr);
    } else {
      newSelectedDates.delete(dateStr);
    }

    setSelectedDates(newSelectedDates);
    setAllChecked(newSelectedDates.size === availableDates.length);
  };

  // Toggle all checkboxes
  const toggleAllCheckboxes = () => {
    if (allChecked) {
      // Uncheck all
      setSelectedDates(new Set());
    } else {
      // Check all
      const allDates = new Set(
        availableDates.map((date) => date.toISOString())
      );
      setSelectedDates(allDates);
    }
    setAllChecked(!allChecked);
  };

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
            toast.success(state.message);
            router.push('/dashboard/defense-periods');
          } else {
            toast.error(state.message);
          }
        }
      }
    }
  }, [isPending, state, router]);

  return (
    <form action={action} aria-describedby="form-error">
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
              onChange={handleDefensePeriodChange}
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
        {availableDates.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Chọn những ngày bạn muốn yêu cầu giảng viên đăng ký lịch bận
              </label>
              <button
                type="button"
                onClick={toggleAllCheckboxes}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {allChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {availableDates.map((date, index) => {
                const dateStr = date.toISOString();
                const isChecked = selectedDates.has(dateStr);

                return (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`date-${index}`}
                      name={`unavailableDates`}
                      value={dateStr}
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(date, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label htmlFor={`date-${index}`} className="text-sm">
                      {formatDate(date)}
                    </label>
                  </div>
                );
              })}
            </div>
            {state?.errors?.unavailableDates && (
              <span className="text-left text-xs text-red-500 relative">
                {state.errors.unavailableDates}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/defense-periods"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Hủy
        </Link>
        <Button
          type="submit"
          disabled={isPending || availableDates.length === 0}
        >
          Yêu cầu đăng ký
        </Button>
      </div>
    </form>
  );
}
