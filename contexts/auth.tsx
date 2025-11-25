import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { saveAvatar, loadAvatar } from '@/utils/avatarStorage';
import { useUserStore } from '@/src/state/userStore';
import {
  addAccount,
  clearStoredSession,
  clearUserProfile,
  findAccount,
  loadStoredSession,
  loadUserProfile,
  persistSession,
  saveUserProfile,
  setStoredDnaAccepted,
} from '@/storage/auth';
import { Role, StoredAccount, User } from '@/types/user';

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
  registerUser: (name: string, role: Role, password: string) => Promise<User>;
  login: (name: string, password: string) => Promise<User>;
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
  const setRoleInStore = useUserStore((state) => state.setRole);
  const modelAvatar = avatarUri;

  const syncUserState = useCallback(
    (nextUser: User | null) => {
      setUserState(nextUser);
      setRoleState(nextUser?.role ?? null);
      setNameInStore(nextUser?.name ?? null);
      setRoleInStore(nextUser?.role ?? null);
    },
    [setNameInStore, setRoleInStore]
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
          setRoleInStore(storedProfile.role);
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
    async (name: string, role: Role, password: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error('Name is required');
      }

      if (!password || password.trim().length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const existingAccount = await findAccount(trimmedName);
      if (existingAccount) {
        throw new Error('User with this name already exists');
      }

      const newAccount: StoredAccount = {
        username: trimmedName,
        role,
        password: password.trim(),
        avatarUri: useUserStore.getState().avatarUri ?? null,
        createdAt: new Date().toISOString(),
      };

      await addAccount(newAccount);

      const newUser: User = {
        id: `user-${trimmedName.toLowerCase()}`,
        name: trimmedName,
        role,
        createdAt: newAccount.createdAt,
      };

      const avatarFromStore = newAccount.avatarUri ?? null;

      syncUserState(newUser);
      setDnaAcceptedState(false);

      await Promise.all([
        persistSession(newUser, false),
        saveUserProfile({ username: newUser.name, role: newUser.role, avatarUri: avatarFromStore }),
        setStoredDnaAccepted(false),
      ]);

      return newUser;
    },
    [setDnaAcceptedState, syncUserState]
  );

  const login = useCallback(
    async (name: string, password: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error('Name is required');
      }

      if (!password) {
        throw new Error('Password is required');
      }

      const account = await findAccount(trimmedName);

      if (!account) {
        throw new Error('User not found');
      }

      if (account.password !== password) {
        throw new Error('Incorrect password');
      }

      const userFromAccount: User = {
        id: `user-${account.username.toLowerCase()}`,
        name: account.username,
        role: account.role,
        createdAt: account.createdAt,
      };

      const avatarFromStore = account.avatarUri ?? useUserStore.getState().avatarUri ?? null;

      syncUserState(userFromAccount);
      setDnaAcceptedState(false);

      await Promise.all([
        persistSession(userFromAccount, false),
        saveUserProfile({ username: userFromAccount.name, role: userFromAccount.role, avatarUri: avatarFromStore }),
        setStoredDnaAccepted(false),
      ]);

      return userFromAccount;
    },
    [setDnaAcceptedState, syncUserState]
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
      login,
      logout,
    }),
    [user, role, isLoading, dnaAccepted, modelAvatar, setUser, setRole, setDnaAccepted, setModelAvatar, registerUser, login, logout]
  );
});
