import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Role } from '@/types/user';

type UserState = {
  name: string | null;
  role: Role | null;
  avatarUri: string | null;
  setName: (name: string | null) => void;
  setRole: (role: Role | null) => void;
  setAvatar: (uri: string | null) => void;
  resetAuth: () => void;
  hardReset: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: null,
      role: null,
      avatarUri: null,
      setName: (name) => set({ name }),
      setRole: (role) => set({ role }),
      setAvatar: (uri) => set({ avatarUri: uri }),
      resetAuth: () => set({ name: null, role: null }),
      hardReset: () => set({ name: null, role: null, avatarUri: null }),
    }),
    {
      name: 'od_user_store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
