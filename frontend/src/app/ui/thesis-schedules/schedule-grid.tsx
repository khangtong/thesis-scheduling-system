// app/components/scheduling/ScheduleGrid.tsx
import { useScheduleStore } from '@/stores/scheduleStore';
import { timeSlots, rooms } from './mock-data';
import ScheduleCard from './schedule-card';

export default function ScheduleGrid() {
  // Helper function to find a session for a specific cell
  const { sessions, selectedSession, selectSession } = useScheduleStore();
  const selectedSessionId = selectedSession?.id;

  const findSession = (timeSlot: string, room: string) => {
    return sessions.find((s) => s.timeSlot === timeSlot && s.room === room);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
      <div className="grid grid-cols-[auto_repeat(3,minmax(180px,1fr))]">
        {/* Header Row */}
        <div className="sticky top-0 bg-white z-10"></div> {/* Empty corner */}
        {rooms.map((room) => (
          <div
            key={room}
            className="text-center font-bold text-gray-700 py-2 border-b-2 border-gray-300 sticky top-0 bg-white z-10"
          >
            {room}
          </div>
        ))}
        {/* Schedule Rows */}
        {timeSlots.map((timeSlot) => (
          <div
            key={timeSlot}
            className="grid grid-cols-subgrid col-span-4 border-t border-gray-200"
          >
            {/* Time Slot Label */}
            <div className="text-center text-sm font-semibold text-gray-500 p-2 border-r border-gray-200">
              {timeSlot}
            </div>
            {/* Session Cells */}
            {rooms.map((room) => {
              const session = findSession(timeSlot, room);
              return (
                <div
                  key={`${timeSlot}-${room}`}
                  className="h-24 p-1 border-r border-gray-200 bg-gray-50"
                >
                  {session ? (
                    <ScheduleCard
                      session={session}
                      isSelected={session.id === selectedSessionId}
                    />
                  ) : (
                    // Đây là ô trống để kéo thả
                    <div className="h-full w-full rounded-md border-2 border-dashed border-gray-200"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
