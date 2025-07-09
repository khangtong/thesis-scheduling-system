import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/priority-schedules/table';
import { lexend } from '@/app/ui/fonts';
import {
  fetchDefensePeriodsWithQuery,
  fetchNotifications,
  fetchPrioritySchedules,
  fetchTimeSlotsByDateRange,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';
import SearchForm from '@/app/ui/priority-schedules/search-form';
import { Metadata } from 'next';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Đăng ký lịch bận',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    date?: string;
    start?: string;
    end?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;

  // Construct query string from search parameters
  let query = '';
  if (searchParams?.date || searchParams?.start || searchParams?.end) {
    const params = new URLSearchParams();
    if (searchParams?.date) params.append('date', searchParams.date);
    if (searchParams?.start) params.append('start', searchParams.start);
    if (searchParams?.end) params.append('end', searchParams.end);
    query = params.toString();
  } else if (searchParams?.query) {
    query = searchParams.query;
  }

  // Get notifications that are not on deadline
  const authToken = (await cookies()).get('session')?.value;
  const notifications = await fetchNotifications(authToken);
  let deadline = '';
  const activeNotis = notifications.filter((noti: any) => {
    deadline = noti.content
      .substring(
        noti.content.lastIndexOf('<strong>') + '<strong>'.length,
        noti.content.lastIndexOf('</strong>')
      )
      .split('/')
      .reverse()
      .join('-');
    const now = new Date();
    return now <= new Date(deadline);
  });

  // Get defense periods from those notifications
  let activeDefensePeriods: any = [];
  for (let i = 0; i < activeNotis.length; i++) {
    const defensePeriodName = activeNotis[i].content.substring(
      activeNotis[i].content.indexOf('<span>') + '<span>'.length,
      activeNotis[i].content.indexOf('</span>')
    );
    const { defensePeriods, totalPages } = await fetchDefensePeriodsWithQuery(
      authToken,
      defensePeriodName
    );
    if (
      !activeDefensePeriods.find((dp: any) => dp?.id === defensePeriods[0]?.id)
    ) {
      activeDefensePeriods.push(defensePeriods[0]);
    }
  }

  // Get time slots from those defense periods
  let timeSlots = [];
  for (let j = 0; j < activeDefensePeriods.length; j++) {
    timeSlots = await fetchTimeSlotsByDateRange(
      authToken,
      activeDefensePeriods[j].start.split('T')[0],
      activeDefensePeriods[j].end.split('T')[0]
    );
  }

  // Filter time slots based on search parameters
  let filteredTimeSlots = [...timeSlots];

  if (searchParams?.date) {
    filteredTimeSlots = filteredTimeSlots.filter((slot) => {
      if (!slot?.date) return false;
      const slotDate = new Date(slot.date).toISOString().split('T')[0];
      return slotDate === searchParams.date;
    });
  }

  if (searchParams?.start) {
    filteredTimeSlots = filteredTimeSlots.filter((slot) => {
      if (!slot?.start) return false;
      return slot.start >= searchParams.start + ':00';
    });
  }

  if (searchParams?.end) {
    filteredTimeSlots = filteredTimeSlots.filter((slot) => {
      if (!slot?.end) return false;
      return slot.end <= searchParams.end + ':00';
    });
  }

  // Paginate filtered time slots based on ITEMS_PER_PAGE
  const a = [];
  const totalPages = Math.ceil(filteredTimeSlots.length / ITEMS_PER_PAGE);
  let j = 0;
  for (let i = 0; i < totalPages; i++) {
    const b = [];
    while (j < filteredTimeSlots.length && b.length < ITEMS_PER_PAGE) {
      b.push(filteredTimeSlots[j]);
      j++;
    }
    a.push(b);
  }

  const prioritySchedules = await fetchPrioritySchedules(authToken);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lexend.className} text-2xl`}>
          Đăng ký lịch bận (Hạn đăng ký:{' '}
          {new Date(deadline).toLocaleDateString()})
        </h1>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 max-w-full">
        <SearchForm />
      </div>
      <Table
        timeSlots={a[currentPage - 1]}
        prioritySchedules={prioritySchedules}
      />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
