import { getUser } from '@/app/lib/actions';
import {
  fetchDefensePeriods,
  searchDefensePeriods,
  fetchNotifications,
  fetchPrioritySchedules,
  fetchTheses,
  fetchTimeSlots,
  fetchTimeSlotsByDateRange,
} from '@/app/lib/data';
import {
  DefensePeriod,
  PrioritySchedule,
  Thesis,
  TimeSlot,
} from '@/app/lib/definitions';
import Calendar from '@/app/ui/dashboard/calendar';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const user = await getUser();
  const authToken = (await cookies()).get('session')?.value;
  const theses: Thesis[] = await fetchTheses(authToken);
  let events: any = theses
    .filter((t) => t?.status !== 'Chưa xếp lịch')
    .map((thesis) => {
      return {
        id: thesis?.id,
        title: thesis?.title,
        start: `${thesis?.timeSlot?.date}T${thesis?.timeSlot?.start}`,
        end: `${thesis?.timeSlot?.date}T${thesis?.timeSlot?.end}`,
        backgroundColor:
          thesis?.status === 'Đã xếp lịch'
            ? '#05df72'
            : thesis?.status === 'Đã công bố'
            ? '#51a2ff'
            : '#ff6467',
        borderColor:
          thesis?.status === 'Đã xếp lịch'
            ? '#05df72'
            : thesis?.status === 'Đã công bố'
            ? '#51a2ff'
            : '#ff6467',
      };
    });

  if (user?.role?.name === 'GIANG_VIEN') {
    // Get notifications that are not on deadline
    const notifications = await fetchNotifications(authToken);
    const activeNotis = notifications.filter((noti: any) => {
      const deadline = noti.content
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
      const { data, totalPages } = await searchDefensePeriods(
        authToken,
        defensePeriodName
      );
      if (!activeDefensePeriods.find((dp: any) => dp?.id === data[0]?.id)) {
        activeDefensePeriods.push(data[0]);
      }
    }

    // Get time slots from those defense periods
    const prioritySchedules = await fetchPrioritySchedules(authToken);
    for (let j = 0; j < activeDefensePeriods.length; j++) {
      const timeSlots = await fetchTimeSlotsByDateRange(
        authToken,
        activeDefensePeriods[j].start.split('T')[0],
        activeDefensePeriods[j].end.split('T')[0]
      );

      events.push(
        ...timeSlots.map((timeSlot: TimeSlot) => {
          return {
            id: timeSlot?.id,
            start: `${timeSlot?.date}T${timeSlot?.start}`,
            end: `${timeSlot?.date}T${timeSlot?.end}`,
            backgroundColor: prioritySchedules.find(
              (ps: PrioritySchedule) => ps?.timeSlot?.id === timeSlot?.id
            )
              ? '#e7000b'
              : '#00a63e',
          };
        })
      );
    }
  }

  return (
    <div className="min-h-full bg-gray-100 p-4 rounded-md">
      <Calendar events={events} />
    </div>
  );
}
