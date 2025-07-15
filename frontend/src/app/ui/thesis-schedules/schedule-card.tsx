// app/components/scheduling/ScheduleCard.tsx
import {
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { ScheduledSession } from './mock-data';
import { useScheduleStore } from '@/stores/scheduleStore';

interface ScheduleCardProps {
  session: ScheduledSession;
  isSelected: boolean;
}

const statusStyles = {
  OK: 'bg-green-100 border-green-400 hover:bg-green-200',
  CONFLICT: 'bg-red-100 border-red-400 hover:bg-red-200',
  WARNING: 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200',
};

export default function ScheduleCard({
  session,
  isSelected,
}: ScheduleCardProps) {
  const selectSession = useScheduleStore((state) => state.selectSession);
  const selectedStyle = isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '';

  return (
    <div
      onClick={() => selectSession(session)}
      className={`p-2 h-full rounded-md border cursor-pointer flex flex-col justify-between text-sm ${
        statusStyles[session.status]
      } ${selectedStyle}`}
    >
      <div>
        <p className="font-bold text-gray-800">{session.studentName}</p>
        <p className="text-gray-600 truncate">{session.committee[0].name}</p>
      </div>
      {(session.status === 'CONFLICT' || session.status === 'WARNING') && (
        <div className="flex items-center justify-end mt-1">
          {session.status === 'CONFLICT' ? (
            <XCircleIcon className="h-5 w-5 text-red-600" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
          )}
        </div>
      )}
    </div>
  );
}
