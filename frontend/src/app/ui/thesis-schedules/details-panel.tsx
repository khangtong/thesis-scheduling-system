'use client';
import { unscheduled } from '@/app/lib/actions';
import { useCommitteeMemberStore } from '@/stores/committeeMemberStore';
import { useThesisStore } from '@/stores/thesisStore';
import { useTimeSlotStore } from '@/stores/timeSlotStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DetailsPanel() {
  const timeSlots = useTimeSlotStore((state) => state.timeSlots);
  const selectedTimeSlot = useTimeSlotStore((state) => state.selectedTimeSlot);
  const theses = useThesisStore((state) => state.theses);
  const thesis = theses.find((t) => t?.timeSlot?.id === selectedTimeSlot?.id);
  const unScheduledTheses = theses.filter((t) => !t?.timeSlot);
  const committeeMembers = useCommitteeMemberStore(
    (state) => state.committeeMembers
  );
  const router = useRouter();

  if (!selectedTimeSlot) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
        <h3 className="text-lg text-green-400 font-medium text-center">
          Đã xếp lịch{' '}
          {`${theses.filter((t) => t?.status === 'Đã xếp lịch').length}/${
            theses.length
          }`}{' '}
          luận văn
        </h3>
        <div className="border-b pb-4 my-4">
          <h3 className="text-lg font-medium text-yellow-400">Cảnh báo:</h3>
        </div>
        {unScheduledTheses.map((ut) => (
          <div key={ut?.id} className="border-b pb-4 mb-4">
            <span className="text-sm text-neutral-800">
              Luận văn <strong>{ut?.title}</strong> chưa được xếp lịch
            </span>
          </div>
        ))}
      </div>
    );
  }

  function handleUnscheduled() {
    toast.promise(unscheduled(thesis?.id), {
      loading: 'Đang gỡ xếp lịch...',
      success: 'Gỡ xếp lịch thành công',
      error: (error) => error.message,
    });
    router.push('/dashboard/thesis-schedules');
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
      {thesis && (
        <button
          onClick={handleUnscheduled}
          className="flex items-center rounded-lg bg-red-600 py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
        >
          Gỡ xếp lịch
        </button>
      )}

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
