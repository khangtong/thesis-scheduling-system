'use client';

import { useEffect, useState } from 'react';
import { useDefenseCommitteeStore } from '@/stores/defenseCommitteeStore'; // Import store
import ScheduleGrid from './schedule-grid';
import DetailsPanel from './details-panel';
import { ScheduledSession } from './mock-data';
import {
  DefensePeriod,
  Faculty,
  Thesis,
  TimeSlot,
} from '@/app/lib/definitions';
import Toolbar from './toolbar';
import ThesisList from './thesis-list';
import Search from '../search';

interface ScheduleClientProps {
  authToken: string | undefined;
  initialSessions: ScheduledSession[];
  defensePeriods: DefensePeriod[];
  theses: Thesis[];
  faculties: Faculty[];
  defensePeriodAndTimeSlots: {
    defensePeriod: DefensePeriod;
    timeSlots: TimeSlot[];
  }[];
}

export default function ScheduleClient({
  initialSessions,
  defensePeriods,
  theses,
  faculties,
  defensePeriodAndTimeSlots,
}: ScheduleClientProps) {
  // Lấy hàm initialize từ store
  const initializeDefenseCommittees = useDefenseCommitteeStore(
    (state) => state.initializeDefenseCommittees
  );

  // Sử dụng useEffect để khởi tạo dữ liệu cho store chỉ một lần khi component được mount
  useEffect(() => {
    initializeDefenseCommittees([]);
  }, [initialSessions, initializeDefenseCommittees]);

  return (
    <>
      <Toolbar defensePeriods={defensePeriods} faculties={faculties} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-3">
        <div className="lg:col-span-2">
          <Search placeholder="Tìm kiếm luận văn..." />
          <ThesisList theses={theses} />
        </div>
        <div className="lg:col-span-10 grid grid-cols-1 xl:grid-cols-3 gap-3">
          <div className="xl:col-span-2">
            <ScheduleGrid
              defensePeriodAndTimeSlots={defensePeriodAndTimeSlots}
            />
          </div>
          <div className="xl:col-span-1">
            <DetailsPanel />
          </div>
        </div>
      </div>
    </>
  );
}
