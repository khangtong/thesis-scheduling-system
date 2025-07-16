'use client';
import { useDefenseCommitteeStore } from '@/stores/defenseCommitteeStore';

export default function DetailsPanel() {
  const selectedDefenseCommittee = useDefenseCommitteeStore(
    (state) => state.selectedDefenseCommittee
  );

  if (!selectedDefenseCommittee) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-500">Chọn một buổi bảo vệ để xem chi tiết</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full overflow-y-auto">
      {/* Section: Thông tin chi tiết */}
      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-lg text-gray-800">Thông tin chi tiết</h3>
        <p className="text-sm mt-2">
          <span className="font-semibold">Sinh viên:</span> Tong Duy Khang
        </p>
        <p className="text-sm">
          <span className="font-semibold">Đề tài:</span> Ten de tai
        </p>
        <p className="text-sm">
          <span className="font-semibold">GVHD:</span> Giang vien 1
        </p>
        <p className="text-sm">
          <span className="font-semibold">Lịch:</span> 07:00 - 07:45 tại{' '}
          {selectedDefenseCommittee?.room?.name}
        </p>
      </div>

      {/* Section: Hội đồng */}
      {/* <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-lg text-gray-800">Hội đồng</h3>
        <ul className="mt-2 space-y-1 text-sm">
          {selectedSession.committee.map((member) => (
            <li key={member.name}>
              <span className="font-semibold">{member.role}:</span>{' '}
              {member.name}
            </li>
          ))}
        </ul>
      </div> */}

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
