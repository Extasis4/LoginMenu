import { Business } from './business.interface';

export interface User {
  id: string;
  name: string;
  email: string;
  age: number | null;
  city: string | null;
  rubroId: string;
  googleId: string | null;
  moduleId: string;
  roles: 'user' | 'admin' | 'moderator';
  businesses: Business[];
}

export interface UserResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}