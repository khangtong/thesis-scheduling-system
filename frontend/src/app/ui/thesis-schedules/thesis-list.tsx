import { Thesis } from '@/app/lib/definitions';

export default function ThesisList({ theses }: { theses: Thesis[] }) {
  return (
    <div className="flex flex-col gap-3 mt-3">
      {theses.map((thesis) => (
        <div
          key={thesis?.id}
          className="flex flex-col gap-1 bg-gray-100 rounded-lg p-3"
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
