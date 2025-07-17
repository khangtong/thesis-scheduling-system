import { Thesis } from '@/app/lib/definitions';
import { create } from 'zustand';

interface ThesisState {
  theses: Thesis[];
  setTheses: (theses: Thesis[]) => void;
}

export const useThesisStore = create<ThesisState>()((set) => ({
  theses: [],
  setTheses: (theses) => set({ theses }),
}));
