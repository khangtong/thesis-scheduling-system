import { create } from 'zustand';
import { TimeSlot } from '@/app/lib/definitions';

interface TimeSlotState {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  isScheduled: boolean;
  initializeTimeSlots: (timeSlots: TimeSlot[]) => void;
  selectTimeSlot: (timeSlot: TimeSlot | null) => void;
  setScheduled: (isScheduled: boolean) => void;
}

export const useTimeSlotStore = create<TimeSlotState>()((set) => ({
  timeSlots: [],
  selectedTimeSlot: null,
  isScheduled: false,
  initializeTimeSlots: (timeSlots) =>
    set({
      timeSlots,
      selectedTimeSlot: timeSlots[0],
    }),
  selectTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
  setScheduled: (isScheduled) => set({ isScheduled }),
}));
