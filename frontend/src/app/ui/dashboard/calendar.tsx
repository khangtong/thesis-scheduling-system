'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useRouter } from 'next/navigation';

export default function Calendar({ events }: { events: any[] }) {
  const router = useRouter();

  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      locale="vn"
      height={680}
      headerToolbar={{
        left: 'prevYear prev today next nextYear',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      }}
      events={events}
      eventClick={(info) => {
        if (info.event.title) {
          router.push(`/dashboard/defense-periods/${info.event.id}/edit`);
        } else {
          router.push(`/dashboard/priority-schedules`);
        }
      }}
    />
  );
}
