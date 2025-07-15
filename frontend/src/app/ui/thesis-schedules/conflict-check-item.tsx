// app/components/scheduling/ConflictCheckItem.tsx
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { Conflict } from './mock-data';

const statusInfo = {
  OK: { icon: CheckCircleIcon, color: 'text-green-600', text: 'Sẵn sàng' },
  CONFLICT: { icon: XCircleIcon, color: 'text-red-600', text: 'TRÙNG LỊCH' },
  WARNING: {
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    text: 'CẢNH BÁO',
  },
};

export default function ConflictCheckItem({
  conflict,
}: {
  conflict: Conflict;
}) {
  const InfoIcon = statusInfo[conflict.status].icon;

  return (
    <li className="flex items-start py-2">
      <InfoIcon
        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
          statusInfo[conflict.status].color
        }`}
      />
      <div className="ml-3 text-sm">
        <p className="font-medium text-gray-900">
          {conflict.resource}:{' '}
          <span className={`font-bold ${statusInfo[conflict.status].color}`}>
            {statusInfo[conflict.status].text}
          </span>
        </p>
        {conflict.status !== 'OK' && (
          <p className="text-gray-500">{conflict.details}</p>
        )}
      </div>
    </li>
  );
}
