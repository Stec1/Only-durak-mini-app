import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveAvatar, loadAvatar } from '@/utils/avatarStorage';
import { useUserStore } from '@/src/state/userStore';

type User = {
  username: string;
};

type Role = 'model' | 'fan' | null;

type AuthContextType = {
  user: User | null;
  role: Role;
  isLoading: boolean;
  dnaAccepted: boolean;
  modelAvatar: string | null;
  setUser: (user: User | null) => void;
  setRole: (role: Role) => void;
  setDnaAccepted: (accepted: boolean) => void;
  setModelAvatar: (uri: string) => Promise<void>;
  logout: () => void;
};

export const [AuthContext, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUserState] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>(null);
  const [dnaAccepted, setDnaAcceptedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const avatarUri = useUserStore((state) => state.avatarUri);
  const setAvatarInStore = useUserStore((state) => state.setAvatar);
  const modelAvatar = avatarUri;

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const [storedRole, storedDNA, avatar] = await Promise.all([
          AsyncStorage.getItem('od_role'),
          AsyncStorage.getItem('od_dna'),
          loadAvatar(),
        ]);

        if (!isMounted) return;

        if (storedRole && storedDNA === 'true') {
          const parsedRole = storedRole as Role;
          setRoleState(parsedRole);
          setDnaAcceptedState(true);
          const username = parsedRole === 'model' ? 'Model' : parsedRole === 'fan' ? 'Fan' : '';
          if (username) {
            setUserState({ username });
          }
        }

        if (avatar) {
          setAvatarInStore(avatar);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [setAvatarInStore]);

  const setUser = useCallback((user: User | null) => {
    setUserState(user);
  }, []);

  const setRole = useCallback(async (role: Role) => {
    try {
      setRoleState(role);
      if (role) {
        await AsyncStorage.setItem('od_role', role);
      } else {
        await AsyncStorage.removeItem('od_role');
      }
    } catch (error) {
      console.error('Error saving role:', error);
    }
  }, []);

  const setDnaAccepted = useCallback(async (accepted: boolean) => {
    try {
      setDnaAcceptedState(accepted);
      if (accepted) {
        await AsyncStorage.setItem('od_dna', 'true');
      } else {
        await AsyncStorage.removeItem('od_dna');
      }
    } catch (error) {
      console.error('Error saving DNA acceptance:', error);
    }
  }, []);

  const setModelAvatar = useCallback(async (uri: string) => {
    try {
      const savedUri = await saveAvatar(uri);
      setAvatarInStore(savedUri);
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  }, [setAvatarInStore]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('od_role');
      await AsyncStorage.removeItem('od_dna');
      setUserState(null);
      setRoleState(null);
      setDnaAcceptedState(false);
      useUserStore.getState().resetAuth();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, []);

  return useMemo(
    () => ({
      user,
      role,
      isLoading,
      dnaAccepted,
      modelAvatar,
      setUser,
      setRole,
      setDnaAccepted,
      setModelAvatar,
      logout,
    }),
    [user, role, isLoading, dnaAccepted, modelAvatar, setUser, setRole, setDnaAccepted, setModelAvatar, logout]
  );
});