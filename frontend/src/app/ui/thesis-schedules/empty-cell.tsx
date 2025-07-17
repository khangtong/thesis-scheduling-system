import { Thesis, TimeSlot } from '@/app/lib/definitions';
import { useState } from 'react';
import { toast } from 'sonner';

export default function EmptyCell({
  timeSlot,
  day,
}: {
  timeSlot: TimeSlot;
  day: string;
}) {
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

      toast.info(
        `Khung giờ ${timeSlot?.start}-${timeSlot?.end} ngày ${day} chưa có hội đồng`
      );
    } catch (error) {
      console.error('Error parsing dropped thesis data:', error);
    }
  };

  return (
    <div
      className={`h-full w-full rounded-md border-2 border-dashed transition-colors ${
        isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    />
  );
}
