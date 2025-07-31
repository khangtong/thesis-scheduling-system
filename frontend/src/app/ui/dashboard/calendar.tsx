'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRouter } from 'next/navigation';
import useWindowDimension from '@/app/hooks/useWindowDimension';

export default function Calendar({ events }: { events: any[] }) {
  const router = useRouter();
  const { width, isMounted } = useWindowDimension();

  // Show a loading state or default view until component is mounted
  if (!isMounted) {
    return (
      <div className="w-full h-[680px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin, timeGridPlugin]}
      initialView={width > 768 ? 'dayGridMonth' : 'listMonth'}
      locale="vn"
      height={width > 1280 ? 680 : 960}
      headerToolbar={{
        left:
          width >= 1280
            ? 'prevYear prev today next nextYear'
            : width > 768
            ? 'prev next'
            : 'prev',
        center: 'title',
        right:
          width >= 1024
            ? 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            : width > 768
            ? 'dayGridMonth,listMonth'
            : 'next',
      }}
      titleFormat={{ year: 'numeric', month: 'short', day: 'numeric' }}
      buttonText={{
        today: 'Hôm nay',
        month: 'Tháng',
        week: 'Tuần',
        day: 'Ngày',
        list: 'List',
      }}
      events={events}
      eventClick={(info) => {
        if (info.event.title) {
          router.push(`/dashboard/theses`);
        } else {
          router.push(`/dashboard/priority-schedules`);
        }
      }}
    />
  );
}
