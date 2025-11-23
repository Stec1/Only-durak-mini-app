export type Role = 'model' | 'fan';

type User = {
  role: Role;
  username: string;
  nickname: string;
};

let currentUser: User = { role: 'model', username: 'Model', nickname: 'Eva' };

export function setUserByCredentials(u: string, p: string) {
  if (u === 'Model' && p === '12') {
    currentUser = { role: 'model', username: 'Model', nickname: 'Eva' };
  } else if (u === 'Fan' && p === '34') {
    currentUser = { role: 'fan', username: 'Fan', nickname: 'Yurii' };
  }
}

export function getUser(): User {
  return currentUser;
}

export function isModel() {
  return getUser()?.role === 'model';
}

export function isFan() {
  return getUser()?.role === 'fan';
}
