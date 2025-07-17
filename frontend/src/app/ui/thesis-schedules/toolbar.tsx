'use client';

import { DefensePeriod } from '@/app/lib/definitions';
import { useDefensePeriodIdStore } from '@/stores/defensePeriodStore';
import { useState } from 'react';

export default function Toolbar({
  defensePeriods,
}: {
  defensePeriods: DefensePeriod[];
}) {
  const defensePeriodId = useDefensePeriodIdStore(
    (state) => state.defensePeriodId
  );
  const setDefensePeriodId = useDefensePeriodIdStore(
    (state) => state.setDefensePeriodId
  );

  return (
    <div className="flex items-end gap-3 pb-3 border-b-2 border-neutral-500">
      <select
        id="defensePeriodId"
        name="defensePeriodId"
        className="peer block bg-white cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
        aria-describedby="defensePeriodId-error"
        value={defensePeriodId}
        onChange={(e) => setDefensePeriodId(e.target.value)}
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
      <button className="flex items-center rounded-lg bg-blue-600 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer">
        Xếp lịch tự động
      </button>
      <button className="flex items-center rounded-lg bg-blue-600 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer">
        Kiểm tra lại xung đột
      </button>
      <button className="flex items-center rounded-lg bg-blue-600 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer">
        Công bố lịch
      </button>
      <button className="flex items-center rounded-lg bg-blue-600 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer">
        Xuất báo cáo
      </button>
    </div>
  );
}
