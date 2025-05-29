export type UserRole = 'ADMIN' | 'SELLER' | 'SHOPPER';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  name?: string;
  applicationStatus?: string;
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const hasRole = (role: UserRole): boolean => {
  const user = getUser();
  return user?.role === role;
};

export const hasAnyRole = (roles: UserRole[]): boolean => {
  const user = getUser();
  return roles.includes(user?.role as UserRole);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 