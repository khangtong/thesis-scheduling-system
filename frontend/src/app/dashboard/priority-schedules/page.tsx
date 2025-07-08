import Pagination from '@/app/ui/pagination';
import Table from '@/app/ui/priority-schedules/table';
import { lexend } from '@/app/ui/fonts';
import {
  fetchDefensePeriodsWithQuery,
  fetchNotifications,
  fetchPrioritySchedules,
  fetchTimeSlotsByDateRange,
  searchTimeSlots,
} from '@/app/lib/data';
import { cookies } from 'next/headers';
import { ITEMS_PER_PAGE } from '@/app/lib/definitions';
import SearchForm from '@/app/ui/time-slots/search-form';
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

  // Paginate time slots based on ITEMS_PER_PAGE
  const a = [];
  const totalPages = Math.ceil(timeSlots.length / ITEMS_PER_PAGE);
  let j = 0;
  for (let i = 0; i < totalPages; i++) {
    const b = [];
    while (j < timeSlots.length && b.length < ITEMS_PER_PAGE) {
      b.push(timeSlots[j]);
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
        <div className="flex gap-2">
          <Link
            href="/dashboard/priority-schedules/register"
            className="max-w-[100px] lg:max-w-full flex items-center rounded-lg bg-blue-600 px-2 sm:px-4 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Đăng ký
          </Link>
          <Button className="px-6">Lưu</Button>
        </div>
      </div>
      <Table timeSlots={timeSlots} prioritySchedules={prioritySchedules} />
      {/* <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
}
