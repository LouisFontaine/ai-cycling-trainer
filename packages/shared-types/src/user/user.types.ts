import { Entity } from '../common';
import { UserProfile } from './user-profile.types';

export interface User extends Entity {
  email: string;
  firstName: string;
  lastName: string;
  profile?: UserProfile;
  intervalsIcuUserId?: string;
  intervalsIcuApiKey?: string;
}

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  intervalsIcuUserId?: string;
  intervalsIcuApiKey?: string;
}
