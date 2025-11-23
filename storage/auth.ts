import AsyncStorage from '@react-native-async-storage/async-storage';
import { Role, User } from '@/types/user';

const STORAGE_KEYS = {
  USER: 'od_user',
  ROLE: 'od_role',
  DNA_ACCEPTED: 'od_dna',
} as const;

type StoredSession = {
  user: User | null;
  dnaAccepted: boolean;
};

function parseUser(raw: string | null): User | null {
  if (!raw) return null;

  try {
    const parsed: User = JSON.parse(raw);
    if (parsed && parsed.id && parsed.name && parsed.role && parsed.createdAt) {
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse stored user', error);
  }

  return null;
}

function legacyUserFromRole(role: Role | null): User | null {
  if (!role) return null;

  const name = role === 'model' ? 'Model' : 'Fan';
  return {
    id: `legacy-${role}`,
    name,
    role,
    createdAt: new Date().toISOString(),
  };
}

export async function loadStoredSession(): Promise<StoredSession> {
  try {
    const entries = await AsyncStorage.multiGet([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.ROLE,
      STORAGE_KEYS.DNA_ACCEPTED,
    ]);

    const store = Object.fromEntries(entries) as Record<string, string | null>;
    const user = parseUser(store[STORAGE_KEYS.USER]) ?? legacyUserFromRole(store[STORAGE_KEYS.ROLE] as Role | null);
    const dnaAccepted = store[STORAGE_KEYS.DNA_ACCEPTED] === 'true';

    return { user, dnaAccepted };
  } catch (error) {
    console.error('Error loading stored session', error);
    return { user: null, dnaAccepted: false };
  }
}

export async function persistSession(user: User | null, dnaAccepted: boolean): Promise<void> {
  try {
    if (!user) {
      await clearStoredSession();
      return;
    }

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.USER, JSON.stringify(user)],
      [STORAGE_KEYS.ROLE, user.role],
      [STORAGE_KEYS.DNA_ACCEPTED, dnaAccepted ? 'true' : 'false'],
    ]);
  } catch (error) {
    console.error('Error saving session', error);
  }
}

export async function setStoredDnaAccepted(accepted: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DNA_ACCEPTED, accepted ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving DNA acceptance', error);
  }
}

export async function clearStoredSession(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.ROLE,
      STORAGE_KEYS.DNA_ACCEPTED,
    ]);
  } catch (error) {
    console.error('Error clearing session', error);
  }
}
