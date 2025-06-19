'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';

export default function Calendar() {
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
    />
  );
}
