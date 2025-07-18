'use client';
import { useCommitteeMemberStore } from '@/stores/committeeMemberStore';
import { useThesisStore } from '@/stores/thesisStore';
import { useTimeSlotStore } from '@/stores/timeSlotStore';

export default function DetailsPanel() {
  const selectedTimeSlot = useTimeSlotStore((state) => state.selectedTimeSlot);
  const theses = useThesisStore((state) => state.theses);
  const thesis = theses.find((t) => t?.timeSlot?.id === selectedTimeSlot?.id);
  const committeeMembers = useCommitteeMemberStore(
    (state) => state.committeeMembers
  );

  if (!selectedTimeSlot) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-500">Chọn một buổi bảo vệ để xem chi tiết</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-lg text-gray-800">Thông tin chi tiết</h3>
        <p className="text-sm">
          <span className="font-semibold">Lịch:</span>{' '}
          {selectedTimeSlot.start.slice(0, -3)} -{' '}
          {selectedTimeSlot.end.slice(0, -3)} tại{' '}
          {selectedTimeSlot?.defenseCommittee?.room?.name}
        </p>
        <span className="font-semibold text-sm">Thông tin luận văn: </span>
        {thesis ? (
          <div>
            <p className="text-sm">
              <span className="font-semibold">Đề tài:</span> {thesis.title}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Sinh viên:</span>{' '}
              {thesis.student?.user?.fullname}
            </p>
            <p className="text-sm">
              <span className="font-semibold">GVHD:</span>{' '}
              {thesis.lecturer?.user?.fullname}
            </p>
          </div>
        ) : (
          <span className="text-sm">Chưa có luận văn</span>
        )}
      </div>

      {/* Section: Hội đồng */}
      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-lg text-gray-800">Hội đồng: </h3>
        <span className="font-semibold text-sm">Tên hội đồng: </span>
        <span className="text-sm">
          {selectedTimeSlot.defenseCommittee?.name}
        </span>
        <ul className="space-y-1 text-sm">
          {committeeMembers.map((cm) => (
            <li key={cm?.id}>
              <span className="font-semibold">{cm?.committeeRole?.name}:</span>{' '}
              {cm?.lecturer?.user?.fullname}
            </li>
          ))}
        </ul>
      </div>

      {/* Section: Kiểm tra Xung đột */}
      {/* <div>
        <h3 className="font-bold text-lg text-gray-800">Kiểm tra Xung đột</h3>
        <ul className="mt-2 divide-y divide-gray-200">
          {selectedSession.conflicts.map((conflict) => (
            <ConflictCheckItem key={conflict.resource} conflict={conflict} />
          ))}
        </ul>
      </div> */}
    </div>
  );
}
