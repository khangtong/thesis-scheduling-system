import { useDefenseCommitteeStore } from '@/stores/defenseCommitteeStore';
import { DefenseCommittee } from '@/app/lib/definitions';

interface ScheduleCardProps {
  defenseCommittee: DefenseCommittee;
  isSelected: boolean;
}

const statusStyles = {
  OK: 'bg-green-100 border-green-400 hover:bg-green-200',
  CONFLICT: 'bg-red-100 border-red-400 hover:bg-red-200',
  WARNING: 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200',
};

export default function ScheduleCard({
  defenseCommittee,
  isSelected,
}: ScheduleCardProps) {
  const selectDefenseCommittee = useDefenseCommitteeStore(
    (state) => state.selectDefenseCommittee
  );
  const selectedStyle = isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : '';

  return (
    <div
      onClick={() => selectDefenseCommittee(defenseCommittee)}
      className={`p-2 h-full rounded-md border cursor-pointer flex flex-col justify-between text-sm ${selectedStyle}`}
    >
      <div>
        <p className="font-bold text-gray-800">{defenseCommittee?.name}</p>
        <p className="text-gray-600 truncate">{defenseCommittee?.room?.name}</p>
      </div>
    </div>
  );
}
