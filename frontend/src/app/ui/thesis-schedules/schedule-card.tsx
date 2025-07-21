import { useTimeSlotStore } from '@/stores/timeSlotStore';
import { DefenseCommittee, Thesis } from '@/app/lib/definitions';
import { useState } from 'react';
import { toast } from 'sonner';
import { scheduling } from '@/app/lib/actions';
import { useThesisStore } from '@/stores/thesisStore';
import { useCommitteeMemberStore } from '@/stores/committeeMemberStore';
import { useRouter } from 'next/navigation';

interface ScheduleCardProps {
  isSelected: boolean;
  timeSlot?: any; // Add timeSlot prop for context
}

const statusStyles = {
  OK: 'bg-green-100 border-green-400 hover:bg-green-200',
  PUBLISHED: 'bg-blue-100 border-blue-400 hover:bg-blue-200',
  DEFENDED: 'bg-red-100 border-red-400 hover:bg-red-200',
};

export default function ScheduleCard({
  isSelected,
  timeSlot,
}: ScheduleCardProps) {
  const selectTimeSlot = useTimeSlotStore((state) => state.selectTimeSlot);
  const selectedStyle = isSelected ? 'ring-2 ring-blue-500' : '';
  const [isDragOver, setIsDragOver] = useState(false);
  const theses = useThesisStore((state) => state.theses);
  const thesis = theses.find((t) => t?.timeSlot?.id === timeSlot.id);
  const setCommitteeMembers = useCommitteeMemberStore(
    (state) => state.setCommitteeMembers
  );
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const thesisData = JSON.parse(e.dataTransfer.getData('application/json'));
      const thesis: Thesis = thesisData;

      // Assign defense committee to the thesis
      toast.promise(scheduling(thesis?.id, timeSlot?.id), {
        loading: 'Đang xếp lịch...',
        success: 'Luận văn đã được xếp lịch thành công',
        error: (error) => error.message,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error parsing dropped thesis data:', error);
    }
  };

  return (
    <div
      onClick={() => {
        selectTimeSlot(timeSlot);
        setCommitteeMembers(timeSlot.committeeMembers);
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-2 h-full rounded-md border cursor-pointer flex flex-col justify-center text-sm ${selectedStyle} ${
        isDragOver ? 'bg-blue-100! border-blue-400!' : ''
      } ${
        thesis && thesis.status === 'Đã xếp lịch'
          ? statusStyles.OK
          : thesis?.status === 'Đã công bố'
          ? statusStyles.PUBLISHED
          : thesis?.status === 'Đã bảo vệ'
          ? statusStyles.DEFENDED
          : ''
      }`}
    >
      <div>
        <p className="font-bold text-gray-800">
          {timeSlot?.defenseCommittee?.name}
        </p>
        <p className="text-gray-600 truncate">
          Phòng: {timeSlot?.defenseCommittee?.room?.name}
        </p>
        <p className="text-gray-600 truncate">{thesis && thesis.status}</p>
      </div>
    </div>
  );
}
