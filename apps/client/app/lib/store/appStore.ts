import { GetUserAPIResponse } from '@repo/shared';
import { create } from 'zustand';

export interface AppStore {
  user: GetUserAPIResponse;
  setUser: (user: GetUserAPIResponse) => void;
}
const appStore = create<AppStore>((set) => ({
  user: {} as GetUserAPIResponse,
  setUser: (user: GetUserAPIResponse) => set({ user }),
}));

export default appStore;
