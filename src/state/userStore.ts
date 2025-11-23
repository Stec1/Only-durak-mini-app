import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
      name: 'user_profile',
      storage: {
        getItem: (key) => AsyncStorage.getItem(key),
        setItem: (key, value) => AsyncStorage.setItem(key, value),
        removeItem: (key) => AsyncStorage.removeItem(key),
      },
    }
  )
);
