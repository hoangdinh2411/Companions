import { GetUserAPIResponse } from '@repo/shared';
import { create } from 'zustand';

export interface AppStore {
  user: GetUserAPIResponse;
  setUser: (user: GetUserAPIResponse) => void;
  showMenuBar: boolean;
  setShowMenuBar: (showMenuBar: boolean) => void;
}
const appStore = create<AppStore>((set) => ({
  user: {} as GetUserAPIResponse,
  setUser: (user: GetUserAPIResponse) => set({ user }),
  showMenuBar: false,
  setShowMenuBar: (showMenuBar: boolean) => set({ showMenuBar }),
}));

export default appStore;
