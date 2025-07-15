'use client';

import { useEffect } from 'react';
import { useScheduleStore } from '@/stores/scheduleStore'; // Import store
import ScheduleGrid from './schedule-grid';
import DetailsPanel from './details-panel';
import { ScheduledSession } from './mock-data';
import { DefensePeriod, Faculty, Thesis } from '@/app/lib/definitions';
import Toolbar from './toolbar';
import ThesisList from './thesis-list';

interface ScheduleClientProps {
  initialSessions: ScheduledSession[];
  defensePeriods: DefensePeriod[];
  theses: Thesis[];
  faculties: Faculty[];
}

export default function ScheduleClient({
  initialSessions,
  defensePeriods,
  theses,
  faculties,
}: ScheduleClientProps) {
  // Lấy hàm initialize từ store
  const initializeSessions = useScheduleStore(
    (state) => state.initializeSessions
  );

  // Sử dụng useEffect để khởi tạo dữ liệu cho store chỉ một lần khi component được mount
  useEffect(() => {
    initializeSessions(initialSessions);
  }, [initialSessions, initializeSessions]);

  // Không cần quản lý state ở đây nữa!

  return (
    <>
      <Toolbar defensePeriods={defensePeriods} faculties={faculties} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <ThesisList theses={theses} />
        </div>
        <div className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {/* Component không cần nhận props về state nữa */}
            <ScheduleGrid />
          </div>
          <div className="xl:col-span-1">
            {/* Component không cần nhận props về state nữa */}
            <DetailsPanel />
          </div>
        </div>
      </div>
    </>
  );
}
