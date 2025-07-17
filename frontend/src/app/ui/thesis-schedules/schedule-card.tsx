import { useTimeSlotStore } from '@/stores/timeSlotStore';
import { DefenseCommittee, Thesis } from '@/app/lib/definitions';
import { useState } from 'react';
import { toast } from 'sonner';
import { scheduling } from '@/app/lib/actions';

interface ScheduleCardProps {
  defenseCommittee: DefenseCommittee;
  isSelected: boolean;
  timeSlot?: any; // Add timeSlot prop for context
  day?: string; // Add day prop for context
}

const statusStyles = {
  OK: 'bg-green-100 border-green-400 hover:bg-green-200',
  CONFLICT: 'bg-red-100 border-red-400 hover:bg-red-200',
  WARNING: 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200',
};

export default function ScheduleCard({
  defenseCommittee,
  isSelected,
  timeSlot,
  day,
}: ScheduleCardProps) {
  const selectTimeSlot = useTimeSlotStore((state) => state.selectTimeSlot);
  const selectedStyle = isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '';
  const [isDragOver, setIsDragOver] = useState(false);

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
    } catch (error) {
      console.error('Error parsing dropped thesis data:', error);
    }
  };

  return (
    <div
      onClick={() => selectTimeSlot(timeSlot)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-2 h-full rounded-md border cursor-pointer flex flex-col justify-between text-sm ${selectedStyle} ${
        isDragOver ? 'bg-blue-100 border-blue-400' : ''
      }`}
    >
      <div>
        <p className="font-bold text-gray-800">{defenseCommittee?.name}</p>
        <p className="text-gray-600 truncate">{defenseCommittee?.room?.name}</p>
      </div>
    </div>
  );
}
