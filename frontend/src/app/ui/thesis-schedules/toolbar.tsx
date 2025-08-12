'use client';

import { autoScheduling, publishSchedules } from '@/app/lib/actions';
import { CommitteeMember, DefensePeriod } from '@/app/lib/definitions';
import { useDefensePeriodIdStore } from '@/stores/defensePeriodStore';
import { useThesisStore } from '@/stores/thesisStore';
import { useTimeSlotStore } from '@/stores/timeSlotStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Toolbar({
  defensePeriods,
  committeeMembers,
}: {
  defensePeriods: DefensePeriod[];
  committeeMembers: CommitteeMember[];
}) {
  const defensePeriodId = useDefensePeriodIdStore(
    (state) => state.defensePeriodId
  );
  const setDefensePeriodId = useDefensePeriodIdStore(
    (state) => state.setDefensePeriodId
  );
  const selectTimeSlot = useTimeSlotStore((state) => state.selectTimeSlot);
  const theses = useThesisStore((state) => state.theses);
  const router = useRouter();

  function handleAutoScheduling() {
    if (defensePeriodId) {
      toast.promise(autoScheduling(defensePeriodId), {
        loading: 'Đang xếp lịch tự động...',
        success: () => {
          window.location.reload();
          return 'Xếp lịch tự động thành công';
        },
        error: (error) => error.message,
      });
    } else {
      toast.error('Phải chọn một đợt bảo vệ để xếp lịch tự động');
    }
  }

  function handleCheckConflict() {
    selectTimeSlot(null);
  }

  function handlePublish() {
    if (theses.some((t) => t?.timeSlot == null)) {
      toast.error('Vẫn còn luận văn chưa được xếp lịch');
    } else {
      toast(
        'Hệ thống sẽ gửi email cho tất cả giảng viên tham gia đợt bảo vệ này. Bạn có chắc chắn muốn công bố lịch?',
        {
          action: {
            label: 'Công bố',
            onClick: () => {
              toast.promise(publishSchedules(defensePeriodId), {
                loading: 'Đang công bố lịch...',
                success: () => {
                  window.location.reload();
                  return 'Công bố lịch thành công';
                },
                error: (error) => error.message,
              });
            },
          },
        }
      );
    }
  }

  async function exportData(
    data: any,
    headers: any,
    title: string,
    filename: string
  ) {
    try {
      const response = await fetch(`http://localhost:8080/api/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data,
          headers: headers,
          title: title,
          filename: filename,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  function shortDegree(degree: string | undefined) {
    switch (degree) {
      case 'Tiến sĩ':
        return 'TS';
      case 'Thạc sĩ':
        return 'ThS';
      case 'Giáo sư':
        return 'GS';
      case 'Phó giáo sư':
        return 'PGS';
      default:
        return degree;
    }
  }

  function handleExport() {
    if (theses.every((t) => t?.status === 'Đã công bố')) {
      const headers = [
        'STT',
        'MSSV',
        'Họ tên SV',
        'Tên đề tài',
        'GVHD',
        'Thời gian',
        'Phòng',
        'Hội đồng',
      ];
      const data: any = [];
      theses.forEach((thesis, i) => {
        const thesisCommitteeMembers = committeeMembers.filter(
          (cm) =>
            cm?.defenseCommittee?.id === thesis?.timeSlot?.defenseCommittee?.id
        );
        data.push({
          'STT': i + 1,
          'MSSV': thesis?.student?.code,
          'Họ tên SV': thesis?.student?.user?.fullname,
          'Tên đề tài': thesis?.title,
          'GVHD': thesis?.lecturer?.user?.fullname,
          'Thời gian': `${thesis?.timeSlot?.start.slice(0, -3).split(':')[0]}h${
            thesis?.timeSlot?.start.slice(0, -3).split(':')[1]
          } ngày ${(thesis?.timeSlot?.date + '')
            .split('-')
            .reverse()
            .join('/')}`,
          'Phòng': thesis?.timeSlot?.defenseCommittee?.room?.name,
          'Hội đồng': thesisCommitteeMembers.reduce((acc, cm, i, arr) => {
            return (
              acc +
              `${cm?.committeeRole?.id}. ${shortDegree(
                cm?.lecturer?.degree?.name
              )}. ${cm?.lecturer?.user?.fullname}${
                i + 1 < arr.length ? ', ' : ''
              }`
            );
          }, ''),
        });
      });

      toast.promise(
        exportData(
          data,
          headers,
          'bao_cao',
          `${'bao_cao'}_${new Date().toISOString().split('T')[0]}`
        ),
        {
          loading: 'Đang xuất báo cáo...',
          success: () => {
            window.location.reload();
            return 'Xuất báo cáo thành công';
          },
          error: (error) => error.message,
        }
      );
    } else {
      toast.error('Vẫn còn luận văn chưa được công bố');
    }
  }

  return (
    <div className="flex flex-wrap md:flex-nowrap items-end gap-2 md:gap-3 pb-3 border-b-2 border-gray-300">
      <select
        id="defensePeriodId"
        name="defensePeriodId"
        className="peer block bg-white cursor-pointer rounded-md border border-gray-200 py-2 text-sm placeholder:text-gray-500"
        aria-describedby="defensePeriodId-error"
        value={defensePeriodId}
        onChange={(e) => setDefensePeriodId(e.target.value)}
      >
        <option value="" disabled>
          Chọn đợt bảo vệ
        </option>
        {defensePeriods.map(
          (defensePeriod) =>
            defensePeriod?.active && (
              <option key={defensePeriod?.id} value={defensePeriod?.id}>
                {defensePeriod?.name}
              </option>
            )
        )}
      </select>
      <button
        onClick={handleAutoScheduling}
        className="flex items-center rounded-lg bg-blue-600 py-2 px-2 lg:px-4 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
      >
        Xếp lịch tự động
      </button>
      <button
        onClick={handleCheckConflict}
        className="flex items-center rounded-lg bg-blue-600 py-2 px-2 lg:px-4 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
      >
        Kiểm tra lại cảnh báo
      </button>
      <button
        onClick={handlePublish}
        className="flex items-center rounded-lg bg-blue-600 py-2 px-2 lg:px-4 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
      >
        Công bố lịch
      </button>
      <button
        onClick={() => handleExport()}
        className="flex items-center rounded-lg bg-blue-600 py-2 px-2 lg:px-4 text-xs lg:text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
      >
        Xuất báo cáo
      </button>
    </div>
  );
}
