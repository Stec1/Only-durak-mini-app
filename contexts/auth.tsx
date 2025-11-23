import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { saveAvatar, loadAvatar } from '@/utils/avatarStorage';
import { useUserStore } from '@/src/state/userStore';
import {
  clearStoredSession,
  clearUserProfile,
  loadStoredSession,
  loadUserProfile,
  persistSession,
  saveUserProfile,
  setStoredDnaAccepted,
} from '@/storage/auth';
import { Role, User } from '@/types/user';

type AuthContextType = {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  dnaAccepted: boolean;
  modelAvatar: string | null;
  setUser: (user: User | null) => Promise<void>;
  setRole: (role: Role | null) => Promise<void>;
  setDnaAccepted: (accepted: boolean) => Promise<void>;
  setModelAvatar: (uri: string) => Promise<void>;
  registerUser: (name: string, role: Role) => Promise<User>;
  logout: () => Promise<void>;
};

export const [AuthContext, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUserState] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role | null>(null);
  const [dnaAccepted, setDnaAcceptedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const avatarUri = useUserStore((state) => state.avatarUri);
  const setAvatarInStore = useUserStore((state) => state.setAvatar);
  const setNameInStore = useUserStore((state) => state.setName);
  const modelAvatar = avatarUri;

  const syncUserState = useCallback(
    (nextUser: User | null) => {
      setUserState(nextUser);
      setRoleState(nextUser?.role ?? null);
      setNameInStore(nextUser?.name ?? null);
    },
    [setNameInStore]
  );

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const [{ user: storedUser, dnaAccepted: storedDNA }, avatar, storedProfile] = await Promise.all([
          loadStoredSession(),
          loadAvatar(),
          loadUserProfile(),
        ]);

        if (!isMounted) return;

        syncUserState(storedUser);
        setDnaAcceptedState(storedDNA);

        if (!storedUser && storedProfile) {
          setRoleState(storedProfile.role);
          setNameInStore(storedProfile.username);
        }

        const resolvedAvatar = avatar ?? storedProfile?.avatarUri ?? null;
        if (resolvedAvatar) {
          setAvatarInStore(resolvedAvatar);
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
  }, [setAvatarInStore, syncUserState]);

  const setUser = useCallback(
    async (nextUser: User | null) => {
      syncUserState(nextUser);

      if (nextUser) {
        const avatarFromStore = useUserStore.getState().avatarUri ?? null;

        await Promise.all([
          persistSession(nextUser, dnaAccepted),
          saveUserProfile({ username: nextUser.name, role: nextUser.role, avatarUri: avatarFromStore }),
        ]);
      } else {
        setDnaAcceptedState(false);
        await Promise.all([clearStoredSession(), clearUserProfile()]);
        useUserStore.getState().hardReset();
      }
    },
    [dnaAccepted, syncUserState]
  );

  const setRole = useCallback(
    async (nextRole: Role | null) => {
      if (!nextRole) {
        await setUser(null);
        return;
      }

      const updatedUser = user
        ? { ...user, role: nextRole }
        : {
            id: `user-${Date.now()}`,
            name: 'User',
            role: nextRole,
            createdAt: new Date().toISOString(),
          };

      syncUserState(updatedUser);
      const avatarFromStore = useUserStore.getState().avatarUri ?? null;
      await Promise.all([
        persistSession(updatedUser, dnaAccepted),
        saveUserProfile({ username: updatedUser.name, role: updatedUser.role, avatarUri: avatarFromStore }),
      ]);
    },
    [dnaAccepted, setUser, syncUserState, user]
  );

  const setDnaAccepted = useCallback(
    async (accepted: boolean) => {
      setDnaAcceptedState(accepted);

      if (user) {
        await persistSession(user, accepted);
      } else {
        await setStoredDnaAccepted(accepted);
      }
    },
    [user]
  );

  const setModelAvatar = useCallback(async (uri: string) => {
    try {
      const savedUri = await saveAvatar(uri);
      setAvatarInStore(savedUri);

      if (user) {
        await saveUserProfile({ username: user.name, role: user.role, avatarUri: savedUri });
      }
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  }, [setAvatarInStore, user]);

  const registerUser = useCallback(
    async (name: string, role: Role) => {
      const trimmedName = name.trim();
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: trimmedName,
        role,
        createdAt: new Date().toISOString(),
      };

      syncUserState(newUser);
      setDnaAcceptedState(true);
      const avatarFromStore = useUserStore.getState().avatarUri ?? null;
      await Promise.all([
        persistSession(newUser, true),
        saveUserProfile({ username: newUser.name, role: newUser.role, avatarUri: avatarFromStore }),
      ]);

      return newUser;
    },
    [setDnaAcceptedState, syncUserState]
  );

  const registerUser = useCallback(
    async (name: string, role: Role) => {
      const trimmedName = name.trim();
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: trimmedName,
        role,
        createdAt: new Date().toISOString(),
      };

      syncUserState(newUser);
      setDnaAcceptedState(true);
      await persistSession(newUser, true);

      return newUser;
    },
    [syncUserState]
  );

  const logout = useCallback(async () => {
    try {
      await Promise.all([clearStoredSession(), clearUserProfile()]);
      setUserState(null);
      setRoleState(null);
      setDnaAcceptedState(false);
      useUserStore.getState().hardReset();
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
      registerUser,
      logout,
    }),
    [user, role, isLoading, dnaAccepted, modelAvatar, setUser, setRole, setDnaAccepted, setModelAvatar, registerUser, logout]
  );
});