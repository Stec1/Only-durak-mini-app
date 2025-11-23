import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserState = {
  name: string | null;
  avatarUri: string | null;
  setName: (name: string | null) => void;
  setAvatar: (uri: string | null) => void;
  resetAuth: () => void;
  hardReset: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: null,
      avatarUri: null,
      setName: (name) => set({ name }),
      setAvatar: (uri) => set({ avatarUri: uri }),
      resetAuth: () => set({ name: null }),
      hardReset: () => set({ name: null, avatarUri: null }),
    }),
    {
      name: 'od_user_store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
