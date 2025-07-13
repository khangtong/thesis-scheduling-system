import { getUser } from '@/app/lib/actions';
import {
  fetchDefensePeriods,
  fetchDefensePeriodsWithQuery,
  fetchNotifications,
  fetchPrioritySchedules,
  fetchTimeSlots,
  fetchTimeSlotsByDateRange,
} from '@/app/lib/data';
import {
  DefensePeriod,
  PrioritySchedule,
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
  let events = [];

  if (user?.role?.name === 'ADMIN') {
    const defensePeriods = await fetchDefensePeriods(authToken);
    events = defensePeriods.map((defensePeriod: DefensePeriod) => {
      // Add one day to the end date if it exists
      let endDate = defensePeriod?.end;
      if (endDate) {
        const date = new Date(endDate);
        date.setDate(date.getDate() + 1);
        endDate = date;
      }

      return {
        id: defensePeriod?.id,
        title: defensePeriod?.name,
        allDay: true,
        start: defensePeriod?.start,
        end: endDate,
        backgroundColor: defensePeriod?.active ? '#00c951' : '#90a1b9',
        borderColor: defensePeriod?.active ? '#00c951' : '#90a1b9',
      };
    });
  }

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
      const { defensePeriods, totalPages } = await fetchDefensePeriodsWithQuery(
        authToken,
        defensePeriodName
      );
      if (
        !activeDefensePeriods.find(
          (dp: any) => dp?.id === defensePeriods[0]?.id
        )
      ) {
        activeDefensePeriods.push(defensePeriods[0]);
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
