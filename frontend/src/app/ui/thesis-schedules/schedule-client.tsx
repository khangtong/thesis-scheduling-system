'use client';

import { useEffect, useState } from 'react';
import { useTimeSlotStore } from '@/stores/timeSlotStore'; // Import store
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
import { useThesisStore } from '@/stores/thesisStore';

interface ScheduleClientProps {
  authToken: string | undefined;
  defensePeriods: DefensePeriod[];
  theses: Thesis[];
  defensePeriodAndTimeSlots: {
    defensePeriod: DefensePeriod;
    timeSlots: TimeSlot[];
  }[];
}

export default function ScheduleClient({
  defensePeriods,
  theses,
  defensePeriodAndTimeSlots,
}: ScheduleClientProps) {
  // Lấy hàm initialize từ store
  const initializeTimeSlots = useTimeSlotStore(
    (state) => state.initializeTimeSlots
  );
  const setTheses = useThesisStore((state) => state.setTheses);

  // Sử dụng useEffect để khởi tạo dữ liệu cho store chỉ một lần khi component được mount
  useEffect(() => {
    initializeTimeSlots([]);
    setTheses(theses);
  }, [initializeTimeSlots]);

  return (
    <>
      <Toolbar defensePeriods={defensePeriods} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-3">
        <div className="lg:col-span-2">
          <Search placeholder="Tìm kiếm luận văn..." />
          <ThesisList />
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
