import { UserDocument } from '@repo/shared';
import { create } from 'zustand';

export interface AppStore {
  user: UserDocument;
  setUser: (user: UserDocument) => void;
}
const appStore = create<AppStore>((set) => ({
  user: {} as UserDocument,
  setUser: (user: UserDocument) => set({ user }),
}));

export default appStore;
