export type Role = 'model' | 'fan';

export type User = {
  id: string;
  name: string;
  role: Role;
  createdAt: string;
};
