'use client';

import { useEffect, useState } from 'react';
import { useTimeSlotStore } from '@/stores/timeSlotStore'; // Import store
import ScheduleGrid from './schedule-grid';
import DetailsPanel from './details-panel';
import { ScheduledSession } from './mock-data';
import {
  CommitteeMember,
  DefensePeriod,
  Faculty,
  Thesis,
  TimeSlot,
} from '@/app/lib/definitions';
import Toolbar from './toolbar';
import ThesisList from './thesis-list';
import Search from '../search';
import { useThesisStore } from '@/stores/thesisStore';
import { useCommitteeMemberStore } from '@/stores/committeeMemberStore';

interface ScheduleClientProps {
  authToken: string | undefined;
  defensePeriods: DefensePeriod[];
  theses: Thesis[];
  defensePeriodAndTimeSlots: {
    defensePeriod: DefensePeriod;
    timeSlots: TimeSlot[];
  }[];
  committeeMembers: CommitteeMember[];
}

export default function ScheduleClient({
  defensePeriods,
  theses,
  defensePeriodAndTimeSlots,
  committeeMembers,
}: ScheduleClientProps) {
  const setTheses = useThesisStore((state) => state.setTheses);
  const setCommitteeMembers = useCommitteeMemberStore(
    (state) => state.setCommitteeMembers
  );

  // Sử dụng useEffect để khởi tạo dữ liệu cho store chỉ một lần khi component được mount
  useEffect(() => {
    setTheses(theses);
    setCommitteeMembers(committeeMembers);
  }, []);

  return (
    <>
      <Toolbar
        defensePeriods={defensePeriods}
        committeeMembers={committeeMembers}
      />
      <div className="grid grid-cols-1 lg:grid-cols-13 gap-3 mt-3">
        <div className="lg:col-span-3">
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
