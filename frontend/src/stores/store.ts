import { TimeSlot } from '@/app/lib/definitions';
import { create } from 'zustand';

type TimeSlotsState = {
  timeSlots: TimeSlot[];
  setTimeSlots: (timeSlots: TimeSlot[]) => void;
};

export const useTimeSlotsStore = create<TimeSlotsState>()((set) => ({
  timeSlots: [],
  setTimeSlots: (timeSlots: TimeSlot[]) => set({ timeSlots }),
}));
