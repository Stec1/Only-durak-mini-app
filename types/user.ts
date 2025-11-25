export type Role = 'model' | 'fan';

export type User = {
  id: string;
  name: string;
  role: Role;
  createdAt: string;
};

export type UserProfile = {
  username: string;
  role: Role;
  avatarUri?: string | null;
};

export type StoredAccount = {
  username: string;
  role: Role;
  password: string;
  avatarUri?: string | null;
  createdAt: string;
};
