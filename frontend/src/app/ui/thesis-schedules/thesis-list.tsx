import { Thesis } from '@/app/lib/definitions';
import { useThesisStore } from '@/stores/thesisStore';

export default function ThesisList() {
  const theses = useThesisStore((state) => state.theses);

  const handleDragStart = (e: React.DragEvent, thesis: Thesis) => {
    // Store the thesis data in the drag event
    e.dataTransfer.setData('application/json', JSON.stringify(thesis));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex flex-col gap-3 mt-3">
      {theses.map((thesis) => (
        <div
          key={thesis?.id}
          className="flex flex-col gap-1 bg-gray-100 rounded-lg p-3 cursor-move hover:bg-gray-200 transition-colors"
          draggable
          onDragStart={(e) => handleDragStart(e, thesis)}
        >
          <span className="font-medium text-sm">{thesis?.title}</span>
          <span className="text-xs">Trạng thái: {thesis?.status}</span>
          <span className="text-xs">
            Sinh viên: {thesis?.student?.user?.fullname}
          </span>
          <span className="text-xs">
            GVHD: {thesis?.lecturer?.user?.fullname}
          </span>
          <span className="text-xs">
            Khoa: {thesis?.lecturer?.faculty?.name}
          </span>
        </div>
      ))}
    </div>
  );
}
