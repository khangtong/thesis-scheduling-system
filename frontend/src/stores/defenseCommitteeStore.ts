import { create } from 'zustand';
import { DefenseCommittee } from '@/app/lib/definitions';

// Định nghĩa "hình dạng" của store
interface DefenseCommitteeState {
  defenseCommittees: DefenseCommittee[];
  selectedDefenseCommittee: DefenseCommittee | null;
  // Các hàm để cập nhật state
  initializeDefenseCommittees: (defenseCommittees: DefenseCommittee[]) => void;
  selectDefenseCommittee: (defenseCommittee: DefenseCommittee | null) => void;
}

// Tạo store
export const useDefenseCommitteeStore = create<DefenseCommitteeState>(
  (set) => ({
    // State mặc định ban đầu
    defenseCommittees: [],
    selectedDefenseCommittee: null,

    // Action để khởi tạo danh sách defenseCommittee
    initializeDefenseCommittees: (defenseCommittees) =>
      set({
        defenseCommittees,
        // Chọn session đầu tiên có lỗi làm mặc định khi khởi tạo
        selectedDefenseCommittee: defenseCommittees[0],
      }),

    // Action để chọn một defenseCommittee
    selectDefenseCommittee: (defenseCommittee) =>
      set({ selectedDefenseCommittee: defenseCommittee }),
  })
);
