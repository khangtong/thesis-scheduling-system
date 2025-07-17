import { create } from 'zustand';
import { DefenseCommittee } from '@/app/lib/definitions';

interface DefenseCommitteeState {
  defenseCommittees: DefenseCommittee[];
  selectedDefenseCommittee: DefenseCommittee | null;
  initializeDefenseCommittees: (defenseCommittees: DefenseCommittee[]) => void;
  selectDefenseCommittee: (defenseCommittee: DefenseCommittee | null) => void;
}

export const useDefenseCommitteeStore = create<DefenseCommitteeState>()(
  (set) => ({
    defenseCommittees: [],
    selectedDefenseCommittee: null,
    initializeDefenseCommittees: (defenseCommittees) =>
      set({
        defenseCommittees,
        selectedDefenseCommittee: defenseCommittees[0],
      }),
    selectDefenseCommittee: (defenseCommittee) =>
      set({ selectedDefenseCommittee: defenseCommittee }),
  })
);
