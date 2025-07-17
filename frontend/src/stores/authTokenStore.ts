import { create } from 'zustand';

interface AuthTokenState {
  authToken: string | undefined;
  setAuthToken: (authToken: string | undefined) => void;
}

export const useAuthTokenStore = create<AuthTokenState>()((set) => ({
  authToken: '',
  setAuthToken: (authToken: string | undefined) => set({ authToken }),
}));
