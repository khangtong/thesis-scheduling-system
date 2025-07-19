import { create } from 'zustand';
import { TimeSlot } from '@/app/lib/definitions';

interface TimeSlotState {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  initializeTimeSlots: (timeSlots: TimeSlot[]) => void;
  selectTimeSlot: (timeSlot: TimeSlot | null) => void;
  setTimeSlots: (timeSlots: TimeSlot[]) => void;
}

export const useTimeSlotStore = create<TimeSlotState>()((set) => ({
  timeSlots: [],
  selectedTimeSlot: null,
  initializeTimeSlots: (timeSlots) =>
    set({
      timeSlots,
      selectedTimeSlot: timeSlots[0],
    }),
  selectTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
  setTimeSlots: (timeSlots) => set({ timeSlots }),
}));
