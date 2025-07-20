import { create } from 'zustand';
import { DefensePeriod } from '@/app/lib/definitions';
import { persist } from 'zustand/middleware';

interface DefensePeriodIdState {
  defensePeriodId: string;
  setDefensePeriodId: (id: string) => void;
}

interface DefensePeriodState {
  defensePeriod: DefensePeriod;
  setDefensePeriod: (defensePeriod: DefensePeriod) => void;
}

export const useDefensePeriodIdStore = create<DefensePeriodIdState>()(
  persist(
    (set) => ({
      defensePeriodId: '',
      setDefensePeriodId: (id: string) => set({ defensePeriodId: id }),
    }),
    { name: 'defensePeriodId-storage' }
  )
);

export const useDefensePeriodStore = create<DefensePeriodState>()((set) => ({
  defensePeriod: null,
  setDefensePeriod: (defensePeriod: DefensePeriod) => set({ defensePeriod }),
}));
