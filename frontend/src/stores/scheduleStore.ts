import { create } from 'zustand';
import { ScheduledSession } from '@/app/ui/thesis-schedules/mock-data';

// Định nghĩa "hình dạng" của store
interface ScheduleState {
  sessions: ScheduledSession[];
  selectedSession: ScheduledSession | null;
  // Các hàm để cập nhật state
  initializeSessions: (sessions: ScheduledSession[]) => void;
  selectSession: (session: ScheduledSession | null) => void;
}

// Tạo store
export const useScheduleStore = create<ScheduleState>((set) => ({
  // State mặc định ban đầu
  sessions: [],
  selectedSession: null,

  // Action để khởi tạo danh sách session
  initializeSessions: (sessions) =>
    set({
      sessions,
      // Chọn session đầu tiên có lỗi làm mặc định khi khởi tạo
      selectedSession: sessions.find((s) => s.status === 'CONFLICT') || null,
    }),

  // Action để chọn một session
  selectSession: (session) => set({ selectedSession: session }),
}));
